# Surfaces

Build order: 1 → 7. Each entry: job, user, answer-first line, states, rules that apply.
Supporting surfaces (forum, case library, bulletin, messaging, admin moderation) are out
of prototype scope.

## 1. Client intake + brief (`/describe`, `/describe/review`)
- **User:** first-time client, phone, prepaid data, low legal literacy.
- **Job:** describe the problem once and get a brief they agree with.
- **Answer-first line:** "This is what a lawyer will see. Check it, then choose who gets it."
- **States:** consent (itemised) → describe (type / photo / upload, EN or FIL) → generating (status pill: "Reading your photo · Step 2 of 3") → review/edit → choose lawyer or pro bono routing → sent. Error: "This is taking longer than usual. Your text is saved. Try again."
- **Rules:** C5, C7, C9. Redaction shown before AI step. Brief labelled "AI summary of what you wrote. Check it before sending."

## 2. Lawyer inbox + brief review (`/app/inbox`)
- **User:** QC solo practitioner, mostly on phone for this screen.
- **Job:** decide on a matter in under a minute.
- **Answer-first line:** "3 new briefs. 1 marked urgent."
- **Brief layout:** key facts, category, urgency, documents, client language, parties (for conflict check).
- **Actions:** Accept as paid · Accept as pro bono · Ask for more information · Decline (reason: conflict / outside practice / capacity).
- **Rules:** C4, C10. Pro bono acceptance creates a ULAS hour entry stub.

## 3. ULAS dashboard (`/app/ulas`, then `/app/firm`)
- **User:** same lawyer; desktop.
- **Answer-first line:** "22 of 60 hours. 15-hour personal minimum met. 412 days left."
- **Honest box:** "Based on rules not yet confirmed by a lawyer. See how we count." (until M5 closes)
- **Parts:** progress meter, personal minimum marker, hour log per matter, milestone reminders, compliance report (A4 print + CSV), firm pool view.
- **Rules:** all constants from `docs/ulas-rules.md` config. M14 (SC Portal) decides the export format.

## 4. Directory (`/find`)
- **User:** client.
- **Job:** find a verified lawyer who handles this kind of matter.
- **Answer-first line:** "12 verified lawyers handle family matters in Quezon City."
- **Card:** name, verification status + date, practice areas (separate tags), languages, location, availability. Identical for every tier.
- **Order:** filter match, then alphabetical by surname (D9). With a location: filter match, then distance, then surname (D22). The rule in force is stated on screen.
- **Near you (QC pilot, D20):** answer line "Nearest office for family matters: Dela Paz Law Office, Diliman, about 1.2 km away." Straight-line distance, labelled as such. Map shows one identical marker per office, the user's point, and a dashed line to their nearest matching office.
- **Rules:** C2, C3, C6, C8.

## 5. Booking (`/app/bookings`)
- Booking carries the brief and the paid/pro bono tag. Closing a pro bono appointment asks "How long did this take?" and logs ULAS hours.
- **Rules:** C1.

## 6. Account, seats, billing (`/app/account`)
- Tier, founding-rate expiry date, seats (firm), monthly cancel-anytime. Prices from V6: solo ₱1,099/mo list (₱750 founding), firm ₱799/seat/mo list (₱550 founding). No payment processing in the prototype.
- **Rules:** C8.

## 7. Landing pages (`/`, `/for-lawyers`)
- Two front doors. The brief is the hero on both.
- Client: plain language, FIL/EN toggle visible. Lawyer: three jobs, pricing, the ULAS answer line as proof.
