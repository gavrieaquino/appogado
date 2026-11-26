# CLAUDE.md — APPogado prototype

## Problem constraints — read before doing anything

These are blocking conditions. If any is unresolved, stop and surface it to the user
before proceeding.

- [ ] No real user data (lawyer profiles, client accounts, briefs, hour logs) enters
      this system until ALL of these are confirmed:
      (a) a lawyer has reviewed `docs/compliance-rules.md` (CPRA rules);
      (b) `docs/ulas-rules.md` is confirmed against A.M. No. 22-11-01-SC — today it rests
          on secondary sources that conflict on the fund-payment cap and the start date;
      (c) a lawyer verification source is confirmed accessible (SC Law List: public,
          searched by hand, reportedly incomplete);
      (d) a decision is recorded on how the ULAS tracker relates to the official
          SC ULAS Portal reported for 2026 (feed it, export to it, or drop the tracker).
      If work requires real data before then, stop and surface it.
- [ ] The project solves two linked problems:
      1. Help a Quezon City solo practitioner log and prove their ULAS pro bono hours and
         decide on new matters from a one-page brief, so they stay compliant without
         chasing cases or paying for placement.
      2. Help a first-time client in Quezon City describe their problem once, in Filipino
         or English, and reach a verified lawyer who handles that kind of matter.
      The lawyer is the paying user. Client work that does not lead to a brief in a
      lawyer's inbox: flag it. Both users are personas until interviewed (M13).
- [ ] Prototype data (`data/*.json`: sample lawyers, briefs, ULAS logs) is in use for the
      whole demo phase. If (a)–(d) are not resolved, the prototype stays a demo and the
      README says so. This decision is never made silently.
- [ ] No ranking, badges, "featured", "top", "sponsored" or tier-dependent display on any
      public lawyer surface. Every AI or forum surface shows the info-not-advice notice
      in English and Filipino. See `checklists/compliance.md`.

## Project brief (confirmed 24 Nov 2026)

See `docs/brief.md`. This phase is a **demonstration**: a clickable Next.js prototype on
sample data, built for the next pitch and for feedback from pilot lawyers. It does not
process real users.

## Stack

| Component | Why it is here |
|---|---|
| Next.js 15, App Router, `output: "export"` | Routing for ~12 screens; same framework as the old capstone app so screens port to the pilot. Static export = no server. |
| TypeScript | Sample-data shapes become the pilot's types. |
| CSS variables (`design/tokens.css`) + CSS Modules | LAMBAT token set via `gis-ui-kit` (D27), no UI library, small pages for prepaid mobile data. |
| Space Grotesk + Public Sans, self-hosted (`app/fonts.ts`) | Display face for headings and every number; ~52 KB once (D28). |
| Leaflet 1.9.4 + OpenStreetMap tiles | The map-first `/find` page in the QC pilot (D29). OSM public tiles are prototype-only: replace before pilot (D23, M15). |
| `data/*.json` | Sample data only. |
| **Not in this phase** | Supabase, auth, AI API, Mantine/any component library. No real data to hold. Revisit at pilot (see `docs/decisions.md`). |

Commands: `npm run dev`, `npm run build` (writes static `out/`), `npm run lint`, `npm test` (Vitest),
`npm run check:compliance` (banned wording, notice present, no tier field), `npm run smoke` (after a build:
every route at 1440/390/375 px plus the end-to-end demo; writes `docs/screens/`).
Before calling work done: `npm run lint && npm test && npm run check:compliance && npm run build && npm run smoke`.

## Where things live

- `docs/brief.md` scope lock · `docs/decisions.md` dated decision log · `docs/ia.md` routes
- `docs/surfaces.md` one entry per screen · `docs/words.md` bilingual vocabulary
- `docs/compliance-rules.md` CPRA + Data Privacy rules → screen behaviour
- `docs/ulas-rules.md` ULAS logic and its sources
- `design/tokens.css`, `design/components.md`
- `checklists/qa.md`, `checklists/compliance.md`, `lessons.md`
- `.claude/skills/gis-ui-kit` **the UI system** (from LAMBAT): rules, components, map recipes, tokens, templates, QA. Read it before any UI work.
- `.claude/skills/ui-ux-pro-max` UI/UX guidance (vendored; project rules win). Last review: `docs/ui-ux-review.md`

## House rules (from the LAMBAT method, adapted)

**Copy**
- One term per concept, from `docs/words.md`. Define on first use with a `?` term button.
- Plain words in client flows. No legal jargon without a definition.
- "Connect with a lawyer", never "our lawyers". APPogado does not provide legal services.
- No em dashes in UI copy. Write the action, not just the data.
- Every AI output carries "AI summary of what you wrote. Check it before sending." (or the surface's equivalent).

**Layout and behaviour**
- Answer first: every lawyer screen opens with the one line that answers its question
  ("22 of 60 hours. 15-hour minimum met. 412 days left.").
- Purple `--brand` carries structure (rail, links, primary pill buttons, markers). Soft gold `--act` (#E9B949) is the third colour: "act here" and highlights (nearest-office numbers, the nav tick, the 4 px accent bar on answer cards, pills on `--act-tint`). Solid only, never stripes, never small text (D32).
- Grey page, white cards with one shadow, display face on every number (gis-ui-kit).
- Never disable a button until a form is valid: `aria-disabled`, validate on click, explain inline, move focus (D26).
- Nothing covers the thing it explains (popovers, tour cards).
- Lawyer directory entries are identical. Order: filter match, then distance from the user (if they set a location), then name. Never touched by payment.
- Map pages are full-bleed with a card column (snap sheet on phones: peek / half / full) and the answer card first (D29, D31).
- One look, two densities: client pages spacious, lawyer pages dense (`data-density`). Lawyer home is the `/app/` bento (D30).
- Motion uses the spring tokens in `design/tokens.css` (D31): one hero motion per screen, transforms and opacity only, nothing that only decorates.

**Accessibility**
- 44 px touch targets, 4.5:1 text contrast, labelled navigation (no icon-only nav).
- Real form controls under custom skins; visible focus; skip link.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honoured.
- Animated numbers keep the final value in the DOM (`sr-only`).

**Engineering**
- Each page loads its own CSS module; skeletons while loading; failures show a way forward.
- CSV exports escape cells starting with `= + - @`.
- Test at 1440×900 and 375/390 px. No horizontal scroll, no console errors.
- Run the critic personas in `checklists/qa.md` before calling a surface done.

## Out of scope for the prototype

Kiosk intake, institutional tier, premium tier, forum, case library, bulletin board,
messaging, admin moderation (beyond a lawyer-verification mock), real payments.
