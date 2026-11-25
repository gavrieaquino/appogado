// Neutral directory order (decision D9, rule C2): filter match, then surname A to Z.
// Takes only public lawyer fields. There is no plan, tier or payment input, by design.
import type { Lawyer, LanguageCode, PracticeArea } from "./types";

export type Filters = { area?: PracticeArea; city?: string; lang?: LanguageCode; minYears?: number };

export function matchScore(l: Lawyer, f: Filters): number {
  let s = 0;
  if (f.area && l.practiceAreas.includes(f.area)) s++;
  if (f.city && l.city === f.city) s++;
  if (f.lang && l.languages.includes(f.lang)) s++;
  if (f.minYears !== undefined && l.yearsOfPractice >= f.minYears) s++;
  return s;
}

/** Lawyers that meet every chosen filter, in neutral order. */
export function search(lawyers: Lawyer[], f: Filters): Lawyer[] {
  const active = [f.area, f.city, f.lang, f.minYears].filter((v) => v !== undefined).length;
  return lawyers
    .filter((l) => matchScore(l, f) === active)
    .sort((a, b) => matchScore(b, f) - matchScore(a, f) || a.surname.localeCompare(b.surname, "en") || a.firstName.localeCompare(b.firstName, "en"));
}
