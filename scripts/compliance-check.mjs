// Pre-merge compliance check (checklists/compliance.md). Fails on banned wording and on
// AI/brief surfaces that do not render the info-not-advice notice.
// Run: npm run check:compliance
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["app", "components", "lib", "data"];
const BANNED = [
  [/\bfeatured\b/i, "C2 paid prominence"],
  [/\bsponsored\b/i, "C2 paid prominence"],
  [/\bboost(ed)?\b/i, "C2 paid prominence"],
  [/\bpremium\b/i, "C2 paid prominence"],
  [/\btop[- ](rated|ranked|lawyers?)\b/i, "C3 self-laudatory"],
  [/\bbest (lawyers?|attorneys?)\b/i, "C3 self-laudatory"],
  [/#1\b/, "C3 self-laudatory"],
  [/\bour (lawyers?|attorneys?)\b/i, "C6 lawyers are not employees"],
  [/\bpocket lawyer\b/i, "C6 implies the app practices law"],
  [/\b(stars?|rating)\b.*\blawyer/i, "C3 ratings framed as superiority"],
];
// Surfaces that show AI output, a brief preview, or forum-like content must render <Notice />.
const NEEDS_NOTICE = ["app/(client)/Home.tsx", "app/(client)/describe/Describe.tsx", "app/(client)/describe/review/Review.tsx"];

const files = [];
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|json|css)$/.test(f) && !/\.test\.ts$/.test(f)) files.push(p);
  }
};
ROOTS.forEach(walk);

const problems = [];
for (const f of files) {
  readFileSync(f, "utf8").split("\n").forEach((line, i) => {
    if (line.includes("compliance-allow")) return;
    for (const [re, why] of BANNED) if (re.test(line)) problems.push(`${f}:${i + 1}  ${why}: ${line.trim().slice(0, 120)}`);
  });
}
for (const f of NEEDS_NOTICE) {
  const src = readFileSync(f, "utf8");
  if (!/<Notice\s*\/>/.test(src)) problems.push(`${f}  C5 missing <Notice />`);
}
// Lawyer data must carry no plan or tier field (C2, C8).
const lawyers = JSON.parse(readFileSync("data/lawyers.json", "utf8")).items;
if (lawyers.some((l) => "plan" in l || "tier" in l || "rating" in l)) problems.push("data/lawyers.json  C2/C8 public lawyer data has a plan, tier or rating field");

if (problems.length) {
  console.error(`Compliance check failed (${problems.length}):\n` + problems.map((p) => `  ${p}`).join("\n"));
  process.exit(1);
}
console.log(`Compliance check passed: ${files.length} files, ${BANNED.length} rules, ${NEEDS_NOTICE.length} notice surfaces.`);
