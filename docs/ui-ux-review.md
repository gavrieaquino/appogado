# ui-ux-pro-max review, 25 Nov 2026

Skill: `.claude/skills/ui-ux-pro-max` (vendored, commit 8db3633, MIT). Run with
`python3 -I .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain ux`.
Project rules win over the skill where they conflict (see `VENDORED.md`).

## Design system query

`"legal services directory trust accessible" --design-system` returned: pattern "Trust & Authority +
Conversion", style "Accessible & Ethical", navy primary `#1E3A8A` with amber CTA `#B45309`, EB Garamond +
Lato, anti-patterns "AI purple/pink", "hidden credentials".

| Recommendation | Decision | Why |
|---|---|---|
| Accessible & Ethical style (contrast, keyboard, visible focus, reduced motion, 44 px targets) | **Applied** | Matches CLAUDE.md accessibility rules |
| Navy for structure, amber for the call to action only | **Applied** (D25) | Same idea as "one accent with one job"; replaces the placeholder purple the skill flags |
| Slate neutrals (`#0F172A`, `#475569`, `#CBD5E1`, `#F8FAFC`) | **Applied** | All text pairs ≥ 7:1 |
| Security badges, case studies, logo walls, stats as proof | **Rejected** | CPRA Canon II Sec. 17 (rules C2, C3): no badges or unverifiable claims |
| EB Garamond + Lato from Google Fonts | **Rejected** | D12: no web-font download on prepaid data |

## UX guideline checks against the build

| Guideline (skill) | Finding | Fix |
|---|---|---|
| Focus States; Focus Not Obscured | 2 px ring; phone tab bar and bottom sheet could cover a focused field | 3 px ring with 3 px offset; `scroll-padding-bottom` on phones |
| Submit Button Not Pre-Disabled | Consent "Continue", "Send question" and "Approve" were disabled until valid, so unfocusable and silent | Enabled (or `aria-disabled`), validate on click, explain inline, move focus to what is missing |
| (same, with rule C10) | "Accept" disabled until the conflict check | Still locked (legal rule), now `aria-disabled`, focusable, and on click moves focus to the conflict check |
| Error Placement | Story error not linked to its field | `aria-describedby` to the error; focus the field |
| Map Text Alternative (Critical) | Region label existed; no link to a text summary | Map `aria-describedby` points at the answer line; the list follows the filters |
| Loading Indicators | Map loading was a bare "…" | Skeleton with a `role="status"` "Loading map" |
| Touch Target Size | Map popup links 32 px | 44 px |
| Touch Spacing, Hover States, Sticky Navigation, Bottom nav ≤ 5 | Already met | – |

Contrast after the change (light / dark): button text 5.0 / 8.7, links 9.9 / 11.6, muted text 7.2 / 9.5,
map markers and focus 10.4 / 8.1. All pass WCAG 2.1 AA.
