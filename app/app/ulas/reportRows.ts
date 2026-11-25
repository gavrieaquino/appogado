import type { HourEntry } from "@/lib/types";
import type { UlasSummary } from "@/lib/ulas";
import { fullName, me } from "@/lib/data";
import { DEMO_TODAY } from "@/lib/demo";

export function reportRows(hours: HourEntry[], sum: UlasSummary): unknown[][] {
  return [
    ["ULAS hours report (prototype, sample data, rules unconfirmed)"],
    ["Lawyer", fullName(me), "Roll no.", me.rollNo],
    ["Period", sum.periodStart, "to", sum.periodEnd],
    ["Prepared", DEMO_TODAY],
    [],
    ["Date", "Matter or activity", "Hours", "Source"],
    ...[...hours].sort((a, b) => a.date.localeCompare(b.date)).map((h) => [h.date, h.matter, h.hours, h.demo ? "Demo" : "Sample"]),
    [],
    ["Total service hours", "", sum.rendered],
    ["Credited toward requirement", "", sum.credited, `of ${sum.required}`],
    ["Personal minimum met", "", sum.personalMet ? "Yes" : "No"],
  ];
}
