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
