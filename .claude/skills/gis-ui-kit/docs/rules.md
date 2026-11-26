# Rules (each from a rejection, a critic finding or a bug)

Source in brackets: [B§n] LAMBAT breakdown section, [L file] LAMBAT source, [A] APPogado lesson.

## Layout
- The answer (question + numbers) is above the fold on every page. [B§2 critic: "home page had no answer above the fold"]
- Cards may not cover more than about a third of the map; fold long lists so the legend stays visible. [B§2 critic: "left cards covered ~40% of the map"]
- Nothing covers the thing it explains: popovers open beside or below their term, tour cards beside their target. [B§2 critic]
- Every overlay (loader, island, tooltip, labels) centres on the **free** map area, not behind the column. [L map.css:15]
- The map page is full-bleed. A map inside a document page is not a map page. [A 2026-11-25]
- Answer card order: band, eyebrow (place + Change), question (≤ 3 lines), stats, honest line, one action, footer link. [L map.css:30-63]

## Visual
- One brand hue for structure; gold only for "act here" (rank dots, nav tick, band). Gold is never small text on light. [B§4]
- Grey page (`#EEE`) with white cards and **one** shadow. Bordered cards on white read flat. [L base.css; A 2026-11-25]
- Display face for headings and **every number**; tabular numerals everywhere. [L base.css:42]
- Buttons are 48 px pills; secondary is a ghost pill. [L base.css:115]
- Zero is its own class with a hatch, so "none" is never confused with "low". [B§5.8]

## Interaction
- 44 px minimum targets; extend small links with an invisible `::after`. [B§2 critic: targets under 44 px]
- Segmented controls are real radio inputs under a sliding thumb. [L map.css:80-86]
- Hover feedback never covers the map: use the island, not tooltips. [B§5.4]
- Loading has three layers: boot loader, map loader in the free area, skeleton lines with `aria-busy`. [B§5.2]
- A stuck load says what to do: "This is taking longer than usual. Check your connection, then Try again." [B§5.2]

## Accessibility
- Animated numbers: the animated copy is `aria-hidden`, an `sr-only` twin holds the final value. [L home.js:28-53]
- The island is `aria-hidden`; a separate live region announces only meaningful changes, never hover. [B§5.4, §8.5]
- Chart text at least 11 px. [B§2 critic: chart text was 6–7 px]
- No `div` inside `p` (popovers are spans). Page fades are opacity-only (a transform traps `position: fixed`). [A]

## Copy
- Plain words: "cut off from care", not "access gap". Raw data tags never reach the UI. [B§6]
- No em dashes. Write the action, not just the data. [B§6]
- Every model output carries a caveat line. [B§6]

## Engineering
- Per-page CSS loads before the page draws (no flash of unstyled content). [L app.js:109-123]
- One sliding nav indicator, measured from the active item; re-measure on resize and on list resize. [L app.js:39-48,63]
- Humans click through on a phone and on desktop before "done": the AI missed a stuck loader, FOUC, a drifting highlight and out-of-order lists. [B§2]
