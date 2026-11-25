// Prototype redaction: finds common patterns only. The screen says so and asks the client to check.
export type RedactKind = "name" | "phone" | "email" | "address" | "case";
export type Segment = { text: string; kind?: RedactKind };

const PATTERNS: [RedactKind, RegExp][] = [
  ["email", /[\w.+-]+@[\w-]+\.[\w.]+/g],
  ["phone", /(?:\+63|0)9\d{2}[\s-]?\d{3}[\s-]?\d{4}/g],
  ["case", /\b(?:(?:civil|criminal|special civil|NLRC)\s+)?(?:case|G\.R\.)\s+no\.?\s*[\w-]+/gi],
  ["address", /(?:#\s?\d+[\w-]*\s|\b\d{1,4}\s)(?:[A-Z][\w.]*\s){0,3}(?:St\.?|Street|Ave\.?|Avenue|Road|Rd\.?|Kalye)/g],
  // Names after a Filipino name marker (si/ni/kay) and/or a title, one to three capitalised words.
  ["name", /\b(?:(?:si|ni|kay|named)\s+(?:(?:Mr|Mrs|Ms|Atty|Dr|Gng|G)\.\s+)?|(?:Mr|Mrs|Ms|Atty|Dr|Gng|G)\.\s+)([A-Z][a-zñ]+(?:\s+[A-Z]\.)?(?:\s+[A-Z][a-zñ]+){0,2})/g], // a middle initial needs its period
];

export const LABEL: Record<RedactKind, string> = { name: "[NAME]", phone: "[PHONE]", email: "[EMAIL]", address: "[ADDRESS]", case: "[CASE NO.]" };

export function findSensitive(text: string): { start: number; end: number; kind: RedactKind }[] {
  const hits: { start: number; end: number; kind: RedactKind }[] = [];
  for (const [kind, re] of PATTERNS) {
    for (const m of text.matchAll(re)) {
      const full = m[0];
      // For names, mark only the captured name, not the title before it.
      const offset = kind === "name" && m[1] ? full.lastIndexOf(m[1]) : 0;
      const start = (m.index ?? 0) + offset;
      const end = start + (kind === "name" && m[1] ? m[1].length : full.length);
      if (!hits.some((h) => start < h.end && end > h.start)) hits.push({ start, end, kind });
    }
  }
  return hits.sort((a, b) => a.start - b.start);
}

export function segments(text: string): Segment[] {
  const out: Segment[] = [];
  let i = 0;
  for (const h of findSensitive(text)) {
    if (h.start > i) out.push({ text: text.slice(i, h.start) });
    out.push({ text: text.slice(h.start, h.end), kind: h.kind });
    i = h.end;
  }
  if (i < text.length) out.push({ text: text.slice(i) });
  return out;
}

export const redact = (text: string) => segments(text).map((s) => (s.kind ? LABEL[s.kind] : s.text)).join("");
