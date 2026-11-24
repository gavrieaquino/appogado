# Decision log

Newest last. Each entry: date, decision, reason, what would reverse it.

| # | Date | Decision | Reason | Revisit when |
|---|---|---|---|---|
| D1 | 2026-11-24 | Start a fresh repo. The capstone app (Lambda Complex) is reference only. | Capstone repo is not reachable; revamp is a clean prototype. | Pilot build starts |
| D2 | 2026-11-24 | Scope is a clickable prototype of core surfaces on sample data. | Fastest route to pitch and pilot-lawyer feedback. | After first lawyer feedback round |
| D3 | 2026-11-24 | Demonstration now, real pilot later. | Legal and data dependencies are unconfirmed. | All four dependencies in `brief.md` resolved |
| D4 | 2026-11-24 | Two problem statements (lawyer + client); lawyer is primary. | Lawyer pays; client flow feeds the lawyer's inbox. | User interviews (M13) |
| D5 | 2026-11-24 | Next.js 15 static export, TypeScript, CSS Modules + tokens, no component library. | Ports to pilot; small pages on prepaid data. | Pilot: decide Mantine vs own components |
| D6 | 2026-11-24 | Prototype expiry: no real user data until CPRA review, ULAS confirmation, verification source, and SC Portal decision. | Guardrail 3. | — |
| D7 | 2026-11-24 | Second brain in Notion. | Guardrail 10. | — |
| D8 | 2026-11-24 | SC ULAS Portal (reported for 2026) is a blocking dependency, not a watch item. | If the Court runs its own hour log, the tracker must feed it or lose its purpose. | Portal launch details published |
| D9 | 2026-11-24 | Directory order default: filter match, then alphabetical by surname. | Neutral; payment never touches it (CPRA Canon II Sec. 17). Open question M11. | Legal review |
| D10 | 2026-11-24 | Paid consultations: "Pay your lawyer directly", no checkout in the prototype. | Avoids fee-sharing (CPRA Canon III Sec. 43). Open question M12. | Legal review of any pass-through |
| D11 | 2026-11-24 | Filipino copy ships as draft, marked "draft translation" in `words.md`. | No reviewer named yet (M9). | Reviewer named |
| D12 | 2026-11-24 | Design tokens start neutral with one placeholder accent (purple, from the current identity). System font stack, no web fonts. | Brand direction open (M10); no font download on prepaid data. | Brand direction set |
| D13 | 2026-11-24 | ULAS rules recorded from secondary sources with conflicts listed. | The SC site returns 403 to automated downloads from the build environment. | Owner uploads the official FAQ / Manual PDF |

## Open items

| # | Item | Owner | Status |
|---|---|---|---|
| M2 | Upload Proposal V6 (.docx) | Project owner | Open |
| M3 | Upload current UI screenshots (`APPogado_UI_current`) | Project owner | Open |
| M4 | Lawyer review of `compliance-rules.md` | Team | Not started |
| M5 | ULAS rules confirmed against A.M. No. 22-11-01-SC | Team + lawyer | Secondary sources only, conflicts open |
| M6 | Lawyer verification source | Team | SC Law List exists (public, manual); no bulk/API access found |
| M7 | AI provider + Data Privacy Act position on sending client data | Team | Open |
| M8 | Jurisprudence corpus source and terms | Team | Out of prototype scope |
| M9 | Filipino copy reviewer | Unassigned | Open |
| M10 | Brand direction | Project owner | Open |
| M11 | Neutral ordering rule (final) | Team + lawyer | Default in D9 |
| M12 | Payment model for paid consultations | Team + lawyer | Default in D10 |
| M13 | Interview a real QC solo practitioner and a first-time client | Team | Open |
| M14 | SC ULAS Portal: launch date, whether it accepts imports | Team | Open, blocking (D8) |
