# QA checklist

Run before calling any surface done. The automated part:

```
npm run lint && npm test && npm run check:compliance && npm run build && npm run smoke
```

The smoke test covers viewports, horizontal scroll, console errors, control height and the end-to-end demo. The rest of this list is manual.

## Viewports
- [ ] 1440×900 desktop
- [ ] 390×844 and 375×667 phone
- [ ] No horizontal scroll at any size
- [ ] No console errors or warnings

## Accessibility
- [ ] Every control is at least 44 px
- [ ] Text contrast at least 4.5:1, in light and dark
- [ ] Keyboard: every action reachable, visible focus ring, skip link works
- [ ] Screen reader: animated numbers have `sr-only` final values; live regions announce real changes only
- [ ] `prefers-reduced-motion` and `prefers-reduced-transparency` checked
- [ ] Navigation items have text labels

## Content
- [ ] Every term from `docs/words.md` uses the exact wording; first use has a `?` button
- [ ] EN/FIL toggle works on the screen; FIL marked draft where unreviewed
- [ ] Sample data is labelled as sample data somewhere visible

## Data and numbers
- [ ] Every number traces back to `data/*.json` or `docs/ulas-rules.md`
- [ ] CSV export escapes cells starting with `= + - @`

## ui-ux-pro-max
- [ ] For a new or changed screen, query the skill for the relevant concern (`--domain ux`) and record what was applied or rejected in `docs/ui-ux-review.md`

## Critic personas (run each as a separate review pass)
1. **Strict judge** — is the answer above the fold? would a pitch judge get it in 10 seconds?
2. **Domain expert (practising lawyer)** — does this match how a solo practice actually triages and logs pro bono?
3. **First-time user (client)** — can they finish intake on a phone without help?
4. **Plain reader** — any jargon left undefined?
5. **Fact checker** — any number or rule not traceable to a source?
6. **CPRA compliance critic** — anything that ranks, praises, solicits, or takes a fee share? (see `compliance.md`)
7. **Data Privacy critic** — consent before upload, redaction before AI, retention stated, public-post warning?
