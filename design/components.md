# Components

What each is, where it comes from, and the rule that keeps it honest. "LAMBAT" means the
pattern is adapted from the LAMBAT UI breakdown.

| Component | Used on | Origin | Build notes | Must not |
|---|---|---|---|---|
| **Answer line** | Every lawyer screen, brief review | LAMBAT answer card | One sentence, numbers with units, then one action. | Show a number without its context |
| **Honest box** | Brief, ULAS dashboard | LAMBAT honest box | Wash background; baseline, caveat, link to "how we count". | Be hidden behind a click |
| **Notice banner** | Chatbot, document analysis, forum, brief preview | C5 | EN + FIL, always visible, not dismissible on first view. | Be shortened to an icon |
| **Brief card** | Client review, lawyer inbox, print | Vision "brief is the hero" | Key facts, category, urgency, documents, language, parties. Same component on both sides so the client sees exactly what the lawyer sees. A4 print style. | Differ between client and lawyer view |
| **Lawyer card** | Directory | C2, C3 | Name, verification status + date, practice-area tags, languages, location, availability. One fixed size. | Accept any tier-dependent prop |
| **Inbox row** | Lawyer inbox | LAMBAT expandable card | Category, urgency, received time, language; expands to the brief. | Show client contact details before acceptance |
| **ULAS meter** | ULAS dashboard, firm view | LAMBAT rolling numbers | Bar to 60 with a 15-hour personal-minimum marker; number counts to value; final value in `sr-only`. | Animate under reduced motion |
| **Term button (`?`)** | Anywhere a `words.md` term appears | LAMBAT `?` popovers | The term is the button; dotted underline; popover never covers the sentence; native Popover API. | Use a bare icon without the word |
| **Status pill** | Brief generation | LAMBAT status island | Inline pill: "Step n of 3 · …"; `aria-live` mirror for real changes only. | Float over content it describes |
| **Segmented control** | EN/FIL, paid/pro bono, period | LAMBAT sliding thumb | Real radio inputs under a sliding thumb. | Lose keyboard access |
| **Bottom sheet** | Client mobile flows, lawyer mobile inbox | LAMBAT phone sheet | Peek = height of the answer line; velocity drag; `inert` when closed. | Hide the answer line |
| **App shell** | All | LAMBAT shell | Labelled nav; rail on desktop ↔ labelled tab bar under 768 px; sliding active indicator. | Icon-only navigation |
| **Skeletons** | All async views | LAMBAT | `aria-busy` on container; stuck-state copy with a way forward. | Spin forever |
| **Consent list** | Intake | C7 | One row per use (store, AI read, share with chosen lawyer), each with its own yes/no. | Bundle consents into one checkbox |
