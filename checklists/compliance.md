# Compliance checklist (pre-merge)

Rule numbers refer to `docs/compliance-rules.md`. Any "no" blocks the merge.

- [ ] **C1** No payment, fee, commission or checkout UI on any client surface
- [ ] **C2** No "featured", "top", "premium", "sponsored", "boosted" (run: `grep -riE "featured|sponsored|boosted|premium|\btop\b" app/`)
- [ ] **C2** Directory cards identical across tiers; order is filter match then alphabetical, stated on screen
- [ ] **C3** No "best", "#1", superiority ratings
- [ ] **C4** No lawyer surface lists clients or lets a lawyer start contact
- [ ] **C5** Info-not-advice notice present in EN and FIL on every AI or forum surface and on the brief preview
- [ ] **C6** No "our lawyers" (run: `grep -riE "our lawyers?" app/`)
- [ ] **C7** Itemised consent precedes upload; redaction step shown before AI processing
- [ ] **C8** No tier, price or billing state on public profile
- [ ] **C9** Client makes the final choice of lawyer or pro bono routing
- [ ] **C10** Accept requires an answered conflict prompt
- [ ] No real person's data anywhere in `data/` or screenshots (no real lawyer names, no "Saul Goodman"-style test accounts)
