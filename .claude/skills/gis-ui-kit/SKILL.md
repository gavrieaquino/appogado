---
name: gis-ui-kit
description: "Build or review a map-first decision tool UI the LAMBAT way: answer card first, map full-bleed with a floating card column (bottom sheet on phones), status island, ? term popovers, ranked site list, quiet basemap, honest numbers. Use when designing, building or critiquing any page that shows places on a map or answers a 'where should we act' question, and before writing shell, home, answer-card, map-page, legend, tour or print-sheet code. Includes the LAMBAT token set, CSS templates, Leaflet/MapLibre layer recipes, rules learned from critiques, and a QA checklist."
---

# GIS UI kit (from LAMBAT)

Distilled from LAMBAT (`lambat-ph/lambat`, commit 94426f0: `web/css/base.css`, `web/css/map.css`,
`web/css/home.css`, `web/js/app.js`, `web/js/pages/home.js`) and the *LAMBAT UI breakdown*.
LAMBAT has no licence file; reuse inside the team that owns it. Project rules (CLAUDE.md, legal or
compliance rules, dated decisions) always win over this kit.

## The five rules

1. **Answer first, map second.** Every page opens with the question and its answer in numbers.
2. **The map owns the screen; everything else floats.** Desktop: full-bleed map with a card column.
   Phones: the same column is a bottom sheet whose peek is exactly the answer card.
3. **One idea per element, one term per concept.** A words table; every term defined once with a `?` button.
4. **Honest numbers next to the headline.** Baseline, range, caveat ("Model estimate, not checked on the ground").
5. **Motion explains state, never decorates.** Count to new values, spring the island, slide the indicator,
   glide the tour hole. All off under `prefers-reduced-motion`.

## Build order (this worked for LAMBAT; do not skip ahead)

1. Brief → decide **what** each page shows, then **where**.
2. Pick 2–3 references and name which components to borrow.
3. **Tokens + fonts** (`styles/tokens.css`): one brand hue, one "act here" hue (gold), grey page, white cards.
4. **Shell** (`templates/shell.css`): brand-colour rail ↔ brand-colour tab bar, sliding indicator with gold tick.
5. **Home + answer card** (`templates/answer-card.css`, home section of `docs/components.md`).
6. **Map page layout + layers** (`templates/map-page.css`, `docs/maplibre.md`).
7. **Island and `?` terms**. 8. **List and controls** (site rows, segmented thumbs, switches).
9. **Phone sheet**. 10. **Tour**. 11. **Share / CSV / A4 print**.
12. **Critic pass** (`checklists/qa.md`): fix, then repeat from the failing step.

## Files

- `docs/rules.md` — one line per rule, each from a rejection or critic finding. Read before building.
- `docs/components.md` — every component: what, build notes, pitfalls, LAMBAT class names.
- `docs/maplibre.md` — map recipes (MapLibre and Leaflet).
- `styles/tokens.css` — the token block. Swap `--brand*` for a new product; keep the structure.
- `templates/*.css` — shell, answer card, map page (column, sheet, island, drawer), components.
- `checklists/qa.md` — run before calling a screen done. `lessons.md` — newest first; add to it.
