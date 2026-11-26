# Compliance rules → screen behaviour

**Status: NOT REVIEWED BY A LAWYER.** These rules come from the CPRA analysis in
Proposal V6 (via the product vision summary). They are product rules: a screen that breaks
one is a bug. A lawyer must review every row before any real user data enters the system.

| # | Rule | Basis | Screen behaviour | Check | Review |
|---|---|---|---|---|---|
| C1 | No fee-sharing with a non-lawyer | CPRA Canon III, Sec. 43 | No per-booking fee, commission or checkout that takes a cut of the legal fee. Paid matters show "Pay your lawyer directly." | No payment UI on any client surface | Not reviewed |
| C2 | No paying for prominence or engagements | CPRA Canon II, Sec. 17 | No "featured", "top", "premium", "sponsored", "boosted". Directory cards identical regardless of tier. Ordering: filter match, then alphabetical (D9). | Grep copy for banned words; visual diff of two cards with different tiers | Not reviewed |
| C3 | No self-laudatory or unverifiable claims | CPRA Canon II, Sec. 17 | No "best lawyers", no star ratings framed as superiority, no "#1". Trust signals are facts only: roll status, verification date, practice areas, languages, location. | Copy review | Not reviewed |
| C4 | No solicitation | CPRA Canon II, Sec. 17 | Lawyers cannot browse clients or start contact. Lawyers see only briefs sent to them or routed through the pro bono pipeline. | No client list on any lawyer surface; inbox only shows addressed briefs | Not reviewed |
| C5 | Information is not advice | CPRA Canon II, Sec. 43 | Visible notice on chatbot, document analysis, forum, and on the client's brief preview, in EN and FIL: "Legal information, not legal advice. No lawyer-client relationship is created." | Notice component present on every listed surface | Not reviewed |
| C6 | Lawyers are not employees | Platform structure, V6 Sec. 10 | "Connect with a lawyer", never "our lawyers". Nothing implies APPogado provides the service. | Grep for "our lawyer" | Not reviewed |
| C7 | Sensitive personal data | Data Privacy Act 2012 | Itemised consent before any upload; plain-language privacy notice; redaction step before AI processing; stated retention period; warning before posting identifying details publicly. | Consent screen precedes upload in the intake flow | Not reviewed |
| C8 | Subscription status is private | V6 | Tier, founding rate and billing never appear on a public profile. | Profile page renders the same for every tier | Not reviewed |
| C9 | Connection is client-initiated | V6 | The client picks a lawyer or opts into pro bono routing. No auto-matching that pushes a client to a lawyer. | Intake ends with a client choice | Not reviewed |
| C10 | Conflict check before acceptance | CPRA (conflict of interest) | Accept action shows party names and asks the lawyer to confirm no conflict; "Decline: conflict" is a first-class option. | Accept is disabled until the conflict prompt is answered | Not reviewed |
