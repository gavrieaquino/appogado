// Template brief builder. Prototype only: keyword rules, not AI (decision D15). The UI says so.
import type { Brief, Lang, PracticeArea, Urgency } from "./types";
import { redact } from "./redact";
import { PRACTICE } from "./practice";

const KEYWORDS: Record<PracticeArea, string[]> = {
  labor: ["trabaho", "employer", "amo", "sweldo", "sahod", "salary", "wage", "tinanggal", "fired", "dismiss", "resign", "final pay", "13th month", "overtime"],
  family: ["asawa", "spouse", "husband", "wife", "anak", "child", "custody", "sustento", "support", "annul", "kasal", "married", "separat"],
  land: ["lupa", "land", "title", "upa", "rent", "landlord", "tenant", "evict", "palayas", "vacate", "bahay", "house", "lease"],
  consumer: ["utang", "loan", "debt", "lending", "collection", "collector", "credit card", "interest", "harass", "online lending"],
  criminal: ["nakaw", "theft", "stole", "estafa", "pulis", "police", "arrest", "kinasuhan", "complaint", "assault", "threat", "banta"],
  estate: ["mana", "inherit", "will", "testament", "namatay", "died", "deceased", "estate", "heir"],
  business: ["negosyo", "business", "contract", "kontrata", "supplier", "partnership", "dti", "sec registration", "client won't pay"],
};

const URGENT = ["bukas", "tomorrow", "today", "ngayon", "deadline", "hearing", "subpoena", "summons", "vacate", "palayas", "evict", "arrest", "banta", "threat", "within 5", "within 3", "in 5 days", "in 3 days"];
const SOON = ["next week", "susunod na linggo", "this month", "ngayong buwan", "soon", "agad"];

export function classify(text: string): PracticeArea {
  const t = text.toLowerCase();
  let best: PracticeArea = "family";
  let bestScore = -1;
  for (const [area, words] of Object.entries(KEYWORDS) as [PracticeArea, string[]][]) {
    const score = words.reduce((s, w) => s + (t.includes(w) ? 1 : 0), 0);
    if (score > bestScore) { best = area; bestScore = score; }
  }
  return best;
}

export function urgencyOf(text: string, deadline: string | null): { urgency: Urgency; reason: string } {
  const t = text.toLowerCase();
  if (deadline) return { urgency: "urgent", reason: `Client gave a date: ${deadline}.` };
  const hit = URGENT.find((w) => t.includes(w));
  if (hit) return { urgency: "urgent", reason: `Client mentions "${hit}".` };
  const soon = SOON.find((w) => t.includes(w));
  if (soon) return { urgency: "soon", reason: `Client mentions "${soon}".` };
  return { urgency: "routine", reason: "No date or deadline mentioned." };
}

export function sentences(text: string, max = 5): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3)
    .slice(0, max)
    .map((s) => (/[.!?]$/.test(s) ? s : `${s}.`));
}

export type IntakeInput = { story: string; wants: string; otherParty: string; deadline: string | null; files: string[]; city: string; language: Lang; proBono: boolean };

export function buildBrief(i: IntakeInput): Brief {
  const category = classify(`${i.story} ${i.wants}`);
  const { urgency, reason } = urgencyOf(i.story, i.deadline);
  const clean = redact(i.story);
  return {
    id: `d${Date.now().toString(36)}`,
    receivedAt: new Date().toISOString(),
    language: i.language,
    category,
    urgency,
    urgencyReason: reason,
    title: `${PRACTICE[category].en} matter`,
    facts: sentences(clean),
    wants: redact(i.wants.trim()) || "Not stated.",
    otherParty: i.otherParty.trim() || "Not given",
    documents: i.files,
    city: i.city,
    proBonoRequested: i.proBono,
    source: "client",
    status: "new",
    demo: true,
  };
}
