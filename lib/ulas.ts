// ULAS tracker logic. Every constant comes from docs/ulas-rules.md and is UNCONFIRMED
// until a lawyer checks it against A.M. No. 22-11-01-SC. A confirmed value is a one-line change.
import type { HourEntry } from "./types";

type Rule<T> = { value: T; label: string; source: string; status: "unconfirmed" | "conflict" | "confirmed" };

export const ULAS_CONFIG = {
  minimumHours: { value: 60, label: "Hours required per period", source: "Sources agree", status: "unconfirmed" } as Rule<number>,
  periodMonths: { value: 36, label: "Length of the compliance period, in months", source: "Sources agree", status: "unconfirmed" } as Rule<number>,
  periodStart: { value: "2025-01-01", label: "Start of the first period", source: "Sources give January or February 2025", status: "conflict" } as Rule<string>,
  personalMinimum: { value: 15, label: "Hours you must give yourself (cannot be pooled)", source: "One law-firm summary", status: "unconfirmed" } as Rule<number>,
  contributionPerHour: { value: 500, label: "ULAS Fund payment per hour offset, in pesos", source: "One news report", status: "unconfirmed" } as Rule<number>,
  contributionCapShare: { value: 0.5, label: "Share of hours you may offset by paying", source: "Sources give 50%, 60%, 75% (firms) or 100% (abroad); the lowest is used", status: "conflict" } as Rule<number>,
  exemptAge: { value: 60, label: "Age at which a lawyer is not covered", source: "News reports", status: "unconfirmed" } as Rule<number>,
  exemptYears: { value: 35, label: "Years of practice after which a lawyer is not covered", source: "News reports", status: "unconfirmed" } as Rule<number>,
};

const DAY = 86_400_000;
const atNoon = (iso: string) => new Date(`${iso.slice(0, 10)}T12:00:00Z`);

/** Last day of the period that contains `today`. */
export function periodBounds(today: Date, start = ULAS_CONFIG.periodStart.value, months = ULAS_CONFIG.periodMonths.value) {
  let s = atNoon(start);
  for (;;) {
    const e = new Date(s);
    e.setUTCMonth(e.getUTCMonth() + months);
    if (today < e) {
      const last = new Date(e.getTime() - DAY);
      return { start: s.toISOString().slice(0, 10), end: last.toISOString().slice(0, 10), nextStart: e };
    }
    s = e;
  }
}

export function daysLeft(today: Date, endIso: string): number {
  const t = atNoon(today.toISOString());
  return Math.max(0, Math.round((atNoon(endIso).getTime() - t.getTime()) / DAY));
}

export type ExemptionInput = { age?: number; yearsOfPractice?: number; admittedOn?: string; excludedOffice?: boolean };

export function exemptionReason(p: ExemptionInput, periodStart: string): string | null {
  if (p.excludedOffice) return "Works in an excluded office";
  if (p.age !== undefined && p.age >= ULAS_CONFIG.exemptAge.value) return `Aged ${ULAS_CONFIG.exemptAge.value} or older`;
  if (p.yearsOfPractice !== undefined && p.yearsOfPractice >= ULAS_CONFIG.exemptYears.value) return `${ULAS_CONFIG.exemptYears.value} or more years of practice`;
  if (p.admittedOn && p.admittedOn >= periodStart) return "Admitted to the Bar during this period";
  return null;
}

export type UlasSummary = {
  required: number;
  rendered: number;
  contributedHours: number;
  credited: number;
  remaining: number;
  personalMinimum: number;
  personalMet: boolean;
  personalMetOn: string | null;
  periodStart: string;
  periodEnd: string;
  daysLeft: number;
  hoursPerMonthNeeded: number;
  exempt: string | null;
};

export function summarize(entries: HourEntry[], today: Date, opts: { fundPaymentPesos?: number; exemption?: ExemptionInput } = {}): UlasSummary {
  const { start, end } = periodBounds(today);
  const exempt = exemptionReason(opts.exemption ?? {}, start);
  const required = exempt ? 0 : ULAS_CONFIG.minimumHours.value;
  const inPeriod = entries.filter((e) => e.date >= start && e.date <= end).sort((a, b) => a.date.localeCompare(b.date));
  const rendered = round1(inPeriod.reduce((s, e) => s + e.hours, 0));

  const cap = ULAS_CONFIG.minimumHours.value * ULAS_CONFIG.contributionCapShare.value;
  const contributedHours = Math.min(cap, (opts.fundPaymentPesos ?? 0) / ULAS_CONFIG.contributionPerHour.value);

  let run = 0;
  let personalMetOn: string | null = null;
  for (const e of inPeriod) {
    run += e.hours;
    if (!personalMetOn && run >= ULAS_CONFIG.personalMinimum.value) personalMetOn = e.date;
  }
  const credited = round1(Math.min(ULAS_CONFIG.minimumHours.value, rendered + contributedHours));
  const remaining = round1(Math.max(0, required - credited));
  const dl = daysLeft(today, end);
  const monthsLeft = Math.max(1, dl / 30.44);
  return {
    required, rendered, contributedHours, credited, remaining,
    personalMinimum: ULAS_CONFIG.personalMinimum.value,
    personalMet: rendered >= ULAS_CONFIG.personalMinimum.value,
    personalMetOn,
    periodStart: start, periodEnd: end, daysLeft: dl,
    hoursPerMonthNeeded: round1(remaining / monthsLeft),
    exempt,
  };
}

/** Firm pool: 60 × covered lawyers; each covered lawyer still owes the personal minimum. */
export function firmSummary(members: { name: string; serviceHours: number; exempt?: string }[]) {
  const covered = members.filter((m) => !m.exempt);
  const required = covered.length * ULAS_CONFIG.minimumHours.value;
  const rendered = covered.reduce((s, m) => s + m.serviceHours, 0);
  const behind = covered.filter((m) => m.serviceHours < ULAS_CONFIG.personalMinimum.value);
  return { required, rendered, covered: covered.length, behind, remaining: Math.max(0, required - rendered) };
}

const round1 = (n: number) => Math.round(n * 10) / 10;
