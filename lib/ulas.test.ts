import { describe, expect, it } from "vitest";
import { daysLeft, exemptionReason, firmSummary, periodBounds, summarize, ULAS_CONFIG } from "./ulas";
import { sampleHours } from "./data";
import type { HourEntry } from "./types";

const today = new Date("2026-11-25T12:00:00Z");
const h = (date: string, hours: number): HourEntry => ({ id: date, date, matter: "m", hours, kind: "service" });

describe("period", () => {
  it("runs 36 months from 1 Jan 2025 to 31 Dec 2027", () => {
    expect(periodBounds(today)).toMatchObject({ start: "2025-01-01", end: "2027-12-31" });
  });
  it("rolls into the next period after the end", () => {
    expect(periodBounds(new Date("2028-01-02T12:00:00Z")).start).toBe("2028-01-01");
  });
  it("counts days left to the last day", () => {
    expect(daysLeft(today, "2027-12-31")).toBe(401);
  });
});

describe("summary", () => {
  it("matches the sample lawyer: 22 of 60, minimum met on 17 Jan 2026", () => {
    const s = summarize(sampleHours, today);
    expect(s.rendered).toBe(22);
    expect(s.remaining).toBe(38);
    expect(s.personalMet).toBe(true);
    expect(s.personalMetOn).toBe("2026-01-17");
  });
  it("ignores hours outside the period", () => {
    expect(summarize([h("2024-12-31", 10), h("2025-01-01", 2)], today).rendered).toBe(2);
  });
  it("caps fund payments at the configured share of 60 hours", () => {
    const s = summarize([], today, { fundPaymentPesos: 1_000_000 });
    expect(s.contributedHours).toBe(60 * ULAS_CONFIG.contributionCapShare.value);
  });
  it("never credits more than 60 hours", () => {
    expect(summarize([h("2025-02-01", 75)], today).credited).toBe(60);
  });
  it("requires nothing from an exempt lawyer", () => {
    expect(summarize([], today, { exemption: { age: 61 } })).toMatchObject({ required: 0, exempt: "Aged 60 or older" });
  });
});

describe("exemptions", () => {
  it("covers years of practice and new admission", () => {
    expect(exemptionReason({ yearsOfPractice: 35 }, "2025-01-01")).toMatch(/35/);
    expect(exemptionReason({ admittedOn: "2025-06-01" }, "2025-01-01")).toMatch(/Admitted/);
    expect(exemptionReason({ age: 45, yearsOfPractice: 10 }, "2025-01-01")).toBeNull();
  });
});

describe("firm", () => {
  it("pools 60 hours per covered lawyer and lists who is behind", () => {
    const f = firmSummary([{ name: "A", serviceHours: 20 }, { name: "B", serviceHours: 9 }, { name: "C", serviceHours: 0, exempt: "Aged 60 or older" }]);
    expect(f.required).toBe(120);
    expect(f.rendered).toBe(29);
    expect(f.behind.map((m) => m.name)).toEqual(["B"]);
  });
});
