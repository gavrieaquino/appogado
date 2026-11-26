# Lessons

Newest first. One line each: what happened, what rule it became.

- 2026-11-25 — ui-ux-pro-max recommended a "Trust & Authority" pattern with security badges and case studies. For lawyers that breaks CPRA Canon II. Rule: run every external design recommendation past `docs/compliance-rules.md` before applying it.
- 2026-11-25 — Disabled "Continue" and "Accept" buttons could not be focused and did not say what was missing. Rule: `aria-disabled` plus an explanation on click (D26).
- 2026-11-25 — The GPS line read "accurate to about 0 m" in the test browser, which reports zero accuracy. Rule: never show a measured value the device did not really measure.
- 2026-11-25 — Adding "nearest first" touched the neutral-ordering rule (D9). Rule: any change to directory order is a dated decision tied to the CPRA review, never a silent default.
- 2026-11-25 — Critic pass on screenshots: the template brief turned "Mr. Roberto Lim" into "Mr." / "[NAME]im" (the L of Lim read as a middle initial; the splitter broke after "Mr."). Rule: a middle initial needs its period, and sentence splitting skips titles. Regression tests added.
- 2026-11-25 — The page fade-in used a transform, which made the phone bottom sheet position against the page instead of the screen. Rule: page-level animations are opacity only.
- 2026-11-25 — A popover `<div>` inside a `<p>` broke hydration (React #418) only on some pages. Rule: inline components render inline elements; the smoke test fails on any console error.
- 2026-11-25 — The bottom sheet made its body `inert` on desktop too, so the decision panel could not be used. The end-to-end smoke test caught it. Rule: phone-only behaviour checks the media query.
- 2026-11-25 — First redaction test caught "ni Mrs. Lydia Torres" hiding the title instead of the name. Rule: every redaction pattern gets a test with Filipino name markers.
- 2026-11-24 — The official SC ULAS FAQ could not be fetched by automated tools (incomplete TLS chain, then 403). Rule: legal sources come from files the owner uploads, and figures from search summaries are marked "via search summary".
- 2026-11-24 — The vision doc's "50% fund payment" figure conflicts with secondary sources (50% / 60% / 75% / 100%). Rule: every ULAS constant lives in one config object with a source and a status.
- 2026-11-24 — LAMBAT's ranked site list (gold rank circles) cannot be reused for the lawyer directory: it breaks CPRA Canon II Sec. 17. Rule: check every borrowed pattern against `docs/compliance-rules.md` before adapting it.
