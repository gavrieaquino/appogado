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
| D14 | 2026-11-25 | Demo state lives in the browser (localStorage, `lib/store.ts`). A brief the client sends appears in the lawyer inbox, whichever lawyer was chosen, labelled "From this demo". | Shows both problems linked in one demo without a backend. | Pilot: real accounts and storage |
| D15 | 2026-11-25 | The brief is built by keyword rules (`lib/brief.ts`), not AI, and the screen says so. | No AI provider chosen yet (M7), and no client data may go to one before the Data Privacy position is settled. | M7 resolved |
| D16 | 2026-11-25 | Fixed demo date 25 Nov 2026 (`lib/demo.ts`), shown in the footer. | Numbers stay the same in every pitch. | Pilot |
| D17 | 2026-11-25 | Vitest added for the ULAS math, CSV, ordering and redaction; Playwright smoke script for routes, sizes and the end-to-end demo. | The tracker's numbers must be checkable; the redaction tests already caught two real bugs. | — |
| D18 | 2026-11-25 | The lawyer side is English only in the prototype; the client side is fully EN/FIL (FIL draft). | Lawyers work in English; clients have low legal literacy. Vision principle 4 asks for both everywhere. | Pilot, or if pilot lawyers ask for it |
| D19 | 2026-11-25 | ULAS Fund contribution cap uses the lowest figure found (50%). | Conservative: never tells a lawyer they are covered when they might not be. | M5 resolved |
| D20 | 2026-11-25 | **Quezon City pilot first.** The directory and "Near you" cover Quezon City only. Every sample office is in QC; the sample firm's four lawyers share one Commonwealth office. A GPS position outside the pilot box is not used. | User asked to pilot in QC first. Keeps data, verification and outreach to one LGU. | Pilot results; next city chosen |
| D21 | 2026-11-25 | Location stays on the device: GPS is asked for only on tap, kept in page memory, never stored, logged or put in a URL. A chosen barangay may go in the URL (coarse, shareable). Choosing an area needs no GPS. | Data Privacy Act; rule C11. | Legal review |
| D22 | 2026-11-25 | **Ordering change (amends D9):** filter match, then straight-line distance from the user's point, then surname A to Z. Without a location, D9 applies unchanged. Cards stay identical and show distance as a fact. Only the user's own nearest matching office gets a dashed line on the map. | Distance is neutral and useful for in-person consultations; V6's example rule includes it. | Lawyer review of CPRA rules (M4) |
| D23 | 2026-11-25 | Map: Leaflet 1.9.4 with OpenStreetMap's public tiles, loaded only when the map is shown (~42 KB gzipped plus tiles). | Lightest usable map for prepaid data. | **Expiry: replace OSM public tiles before the pilot** (their usage policy does not cover production traffic). Options: a paid tile provider or self-hosted tiles. |
| D24 | 2026-11-25 | Office and barangay points are approximate sample coordinates; the pilot box is a bounding box, not the city boundary. | No real office data yet. | Pilot: lawyers pin their office at sign-up, checked in verification; QC boundary and barangay list from PSA/NAMRIA or OSM (licence to confirm) |
| D25 | 2026-11-25 | Palette from the ui-ux-pro-max "Accessible & Ethical" system: navy `--brand` for structure, amber `--act` for actions only, slate neutrals. Its badge/social-proof pattern and web fonts are rejected (C2, C3, D12). | User asked to run the skill; tokens were placeholders; the skill flags purple as an AI cliché. | Brand direction set by the owner (M10) |
| D26 | 2026-11-25 | No buttons disabled until a form is valid. Use `aria-disabled`, validate on click, explain inline and move focus. Accept stays locked by the conflict check (C10), the same way. | ui-ux-pro-max "Submit Button Not Pre-Disabled"; disabled buttons cannot be focused. | – |
| D27 | 2026-11-25 | **LAMBAT design system, APPogado purple** (supersedes D25's palette). Purple `--brand #4A2BB5` carries structure (rail, links, primary buttons, markers); LAMBAT gold `--act #EFBE01` marks "act here" only (nearest-office numbers, nav tick, the 14 px band); grey page `#EEE` with white shadowed cards; 48 px pill buttons. Built from `.claude/skills/gis-ui-kit`. | User: the UI was not good; LAMBAT's real source had not been read. User chose LAMBAT's system with the original APPogado purple. | Owner confirms the exact purple hex (M10) |
| D28 | 2026-11-25 | Self-hosted Space Grotesk (display, every number) + Public Sans (text), Latin subset variable woff2 via `next/font/local`, ~52 KB once, cached. No request to Google. Supersedes D12. | LAMBAT's typography is a large part of why it reads as premium; user chose self-hosting. | – |
| D29 | 2026-11-25 | `/find` is a **map-first page** (amends D23): full-bleed map, 380 px column with the answer card, office rows (gold numbers in distance order), legend; status island; More options drawer; phones get the column as a bottom sheet whose peek is the answer card. Leaflet now loads with this page. Lawyers are listed inside their office row. | gis-ui-kit rule: a map inside a document page is not a map page. | User review of this phase |
| D30 | 2026-11-26 | **Direction D, "expressive map-first", one look with two densities.** Client pages spacious; lawyer pages `data-density="dense"`. New lawyer home `/app/` is a bento grid (ULAS, new briefs, next appointment, partner clinics, firm, plan). Firm leaves the tab bar (5 items max) and is reached from Today and ULAS. | User chose D after seeing references (Stripe, Vercel, Harvey, GOV.UK, SGDS, Material 3, bento examples). | User review of PR #6 |
| D31 | 2026-11-26 | Motion tokens: damped-spring curves as CSS `linear()` (spatial fast/default/slow) plus effects and exit eases; no animation library. Phone sheets snap peek / half / full (`components/SnapSheet.tsx`), flick > 0.4 px/ms moves one snap; map controls ride above the sheet. Scroll reveals use native `animation-timeline: view()`. One hero motion per screen; all instant under reduced motion. | Research: Material 3 Expressive springs, Apple Maps / Material bottom sheets, Stripe/Linear restraint. | – |
| D32 | 2026-11-26 | Third colour: soft gold `#E9B949` (replaces LAMBAT `#EFBE01`), solid accents only. The 14 px diagonal band becomes a 4 px solid accent bar on answer cards, briefs and the map answer card; gold tint pills and markers add presence. | User: remove the stripe band; purple and white felt lacking. | Owner brand review (M10) |

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
| M15 | Production map tiles to replace OSM public tiles (D23) | Team | Open, needed before pilot |
| M16 | Real office locations: lawyer-pinned at sign-up, checked in verification (D24) | Team | Open, needed before pilot |
| M17 | QC boundary and barangay list source and licence (D24) | Team | Open, needed before pilot |
