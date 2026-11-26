# Components (what · build notes · pitfalls)

| Component | LAMBAT source | Build notes | Pitfalls |
|---|---|---|---|
| **Shell rail** | base.css `.nav`, app.js `mountNav` | Brand bg, white text; 48 px items (icon + label), 12 px radius; `.nav-ind` (white 18% + 4 px gold tick) slides via transform; collapse 232↔64 px saved in localStorage; wordmark letters weave in on open | Re-measure indicator on resize and when a scrollbar appears (ResizeObserver) |
| **Tab bar** | base.css `@media (max-width:767px)` | Same nav, fixed bottom, 64 px, icon above short label, gold tick on top edge | Pad the page bottom by 64 px |
| **Home** | home.css, home.js | Brand line, eyebrow tagline, **h1 = the answer in numbers**, CTA pill + text link, stats strip (`dd` display face above `dt`), preview card with hover lift, numbered steps, composite-story quote; background pattern + waves under a mask at ~8% | Skeleton the h1 and stats; never invent a number |
| **Answer card** | map.css `.col-top`, `.q`, `.stats`, `.st-*` | 14 px band (`repeating-linear-gradient(-45deg, gold 0 20px, #fff 20px 24px)`), eyebrow, question clamp 3 lines, stat blocks (1.75 rem display number, label, sub), honest line, one blue action line, footer link | Peek height on phones = this card's height |
| **Status island** | map.css `.island`, `.isl*` | Navy pill top-centre of free map area; springs width/height (`.5s cubic-bezier(.34,1.45,.5,1)`); old content blurs out, new fades in; gold badge; ring for loading | `aria-hidden` + separate live region; drop extra words under 900 px |
| **`?` term** | map.css `.tip-q`, `.tipbox` | Term is the button: dotted underline + small solid glyph; glass box with arrow; native popover | Never covers its sentence |
| **Segmented thumb** | map.css `.pseg`, `.mseg` | Radios over labels, one `.thumb` translated by `--i` | Focus ring on the label (`:has(input:focus-visible)`) |
| **Site row** | map.css `.site`, `.sdet` | 56 px row: 32 px gold number badge, name/sub, chevron; expand via `grid-template-rows: 0fr→1fr`, body `inert` when shut | Hover syncs with the map marker |
| **Drawer** | map.css `.drawer`, `.scrim` | Glass panel from the right, blurred scrim, focus trap, Esc | One right-side surface at a time |
| **Phone sheet** | map.css `@media (max-width:599px)` `.col` | The column itself; `closed` = `translateY(100% - --peek)`; handle with words; velocity flick > 0.4 px/ms; whole open sheet scrolls | Refit the map above the sheet after height changes |
| **Tour** | map.css `.tour*` | Card with the band, anchored with side fallback; cut-out scrim via `box-shadow: 0 0 0 9999px`; dots stretch to a pill | Restore the previous view at the end |
| **Loader** | base.css `.loader`, index.html `#boot` | Boot loader inline in HTML before fonts/scripts; map loader glass in the free area; progress bar | Timeout copy with Try again |
| **Skeletons** | base.css `.skel*` | Shimmer in brand tint; `aria-hidden`, container `aria-busy` | Static under reduced motion |
