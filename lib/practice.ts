import type { LanguageCode, PracticeArea, Availability } from "./types";

export const PRACTICE: Record<PracticeArea, { en: string; fil: string }> = {
  family: { en: "Family", fil: "Pamilya" },
  labor: { en: "Work and employment", fil: "Trabaho" },
  land: { en: "Land, rent and housing", fil: "Lupa, upa at tirahan" },
  criminal: { en: "Criminal", fil: "Kriminal" },
  consumer: { en: "Debt and consumer", fil: "Utang at mamimili" },
  estate: { en: "Wills and inheritance", fil: "Mana at testamento" },
  business: { en: "Small business and contracts", fil: "Negosyo at kontrata" },
};
export const PRACTICE_KEYS = Object.keys(PRACTICE) as PracticeArea[];

export const LANGUAGES: Record<LanguageCode, string> = { en: "English", fil: "Filipino", ceb: "Cebuano", ilo: "Ilocano" };

export const AVAILABILITY: Record<Availability, { en: string; fil: string }> = {
  open: { en: "Taking new matters", fil: "Tumatanggap ng bagong usapin" },
  limited: { en: "Limited availability", fil: "Limitado ang oras" },
  closed: { en: "Not taking new matters now", fil: "Hindi muna tumatanggap" },
};
