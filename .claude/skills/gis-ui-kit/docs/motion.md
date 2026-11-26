# Motion (springs, snap sheets, reveals)

Research behind this file (26 Nov 2026): Material 3 Expressive motion (springs by stiffness and damping,
spatial vs effects, fast/default/slow), Apple Maps and Material 3 bottom sheets (snap points), Stripe /
Linear / Vercel restraint (one hero moment, strong ease-out, transforms only), Chrome's scroll-driven
animation case studies (`animation-timeline`).

## Springs without a library
Generate a damped spring as CSS `linear()`:
x(t) = 1 - e^(-ζωt) (cos(ω_d t) + ζω/ω_d · sin(ω_d t)), ω_d = ω·sqrt(1-ζ²); settle T = -ln(0.002)/(ζω).
Sample 25 points over T. APPogado uses ω/ζ = 26/0.8 (fast, 300 ms), 17/0.68 (default, 540 ms),
11/0.72 (slow, 780 ms). Spatial (position, size) may overshoot; effects (opacity, colour) use a plain
ease-out and never overshoot. Exits are faster than entries.

## Rules
- One hero motion per screen (APPogado: the ULAS bar filling, the brief appearing). Everything else supports.
- Animate transform and opacity; for expand/collapse use `grid-template-rows: 0fr → 1fr` on a spring.
- Reduced motion: every duration token becomes 0 ms; final states must be identical.

## Snap sheet (phones)
- Snaps: peek (the answer card + 48 px handle), half (peek + ~260 px so the first items show), full (scrolls).
- The sheet expands before its content scrolls (`overflow: hidden` until full).
- Flick > 0.4 px/ms moves one snap in that direction; otherwise nearest snap.
- The handle is a button whose label says what a tap will do; tap cycles peek → half → full → peek.
- Floating map controls ride above the sheet (`bottom: var(--sheet-h)`), and the map's fit padding
  uses the visible sheet height.
- Give the sheet's root a higher-specificity selector than any page column class it is mounted on.

## Reveals and stagger
- `animation-timeline: view()` with `animation-range: entry 0% cover 28%` for section reveals; no JS.
- Bento tiles: staggered spring entry, 45 ms apart, max 6 tiles.
