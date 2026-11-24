# APPogado prototype

**This is a demonstration prototype running on sample data.** It does not process real
lawyers, clients, briefs or pro bono hours, and nothing in it is legal advice.

APPogado is planned subscription software for Philippine lawyers and law firms that
covers three things behind one login:

1. **Get discovered.** A directory of verified lawyers with identical cards and neutral ordering.
2. **Triage fast.** A client's account of their problem becomes a one-page brief.
3. **Stay ULAS-compliant.** Pro bono hours under the Rules on Unified Legal Aid Service are tracked and reported.

## What this prototype demonstrates

- The client flow: describe a problem once, review the brief, send it to a chosen lawyer.
- The lawyer flow: inbox of briefs, accept or decline (paid or pro bono), ULAS hour tracker, compliance report.
- How the interface enforces the Code of Professional Responsibility and Accountability (CPRA) rules on advertising and fee-sharing.

## What it does not demonstrate

- Real lawyer verification, real AI brief generation, payments, accounts or storage.
- Confirmed ULAS rules. The tracker math follows `docs/ulas-rules.md`, which a lawyer has not reviewed yet.
- Legal review. The CPRA rules in `docs/compliance-rules.md` have not been reviewed by a lawyer.

## Why the data is sample data

Real user data needs a lawyer's review of the CPRA rules, ULAS rules confirmed against
A.M. No. 22-11-01-SC, a lawyer verification source, and a decision on the official SC
ULAS Portal. Until those are done, the system holds sample data only. See `CLAUDE.md`.

## Run it

```bash
npm install
```

```bash
npm run dev
```

`npm run build` writes a static site to `out/`.
