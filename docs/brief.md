# Project brief (scope lock)

Confirmed by the project owner on 24 Nov 2026.

APPogado helps a Quezon City solo practitioner track and prove their 60 ULAS pro bono
hours and triage incoming matters from a one-page brief, and helps a first-time client in
Quezon City describe their problem once and reach a verified lawyer. This phase is a
**demonstration**: a clickable Next.js prototype on sample data (sample lawyers, briefs,
ULAS hour logs), built for the next pitch and for feedback from pilot lawyers. It does
not process real users.

Critical dependencies, all unconfirmed:

1. A lawyer's review of the CPRA rules.
2. ULAS rules checked against A.M. No. 22-11-01-SC. Secondary sources conflict on the fund-payment cap and the start date.
3. How the tracker relates to the official SC ULAS Portal reported for 2026.
4. Lawyer verification via the SC Law List, which is public, searched by hand and reportedly incomplete.

No real lawyer profile, client account or brief enters the system until 1, 2 and 4 are
confirmed and 3 has a decision. If they are not, the prototype remains a demo.

Stack: Next.js static export, chosen so the screens port to the pilot app. There is no
backend, auth or database in this phase, because there is no real data to hold.

## Problem statements

1. Help a **Quezon City solo practitioner** log and prove their ULAS pro bono hours and
   decide on new matters from a one-page brief, so they stay compliant without chasing
   cases or paying for placement.
2. Help a **first-time client in Quezon City** describe their problem once, in Filipino
   or English, and reach a verified lawyer who handles that kind of matter.

The lawyer is the paying user. The client flow exists to put a brief in the lawyer's inbox.

## Real vs demonstration

Demonstration now, real pilot (10 to 20 firms, per Proposal V6) later. The switch to
real happens only through an explicit, dated entry in `docs/decisions.md`.
