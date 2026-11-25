# APPogado prototype

**This is a demonstration prototype running on sample data.** It does not process real
lawyers, clients, briefs or pro bono hours, and nothing in it is legal advice.

APPogado is planned subscription software for Philippine lawyers and law firms that
covers three things behind one login:

1. **Get discovered.** A directory of verified lawyers with identical cards and neutral ordering.
2. **Triage fast.** A client's account of their problem becomes a one-page brief.
3. **Stay ULAS-compliant.** Pro bono hours under the Rules on Unified Legal Aid Service are tracked and reported.

## What this prototype demonstrates

Try it end to end in one browser:

1. **Client** (`/`, English or Filipino): give consent item by item, describe the problem, see which personal details will be hidden, check the one-page brief, then choose a lawyer from the directory or ask for pro bono help.
2. **Lawyer** (`/app/inbox`): the brief arrives in the inbox. Accept unlocks only after the conflict check. Accept it as pro bono.
3. **Bookings** (`/app/bookings`): schedule it, close the appointment, enter the hours.
4. **ULAS** (`/app/ulas`): the hours count toward 60, with the personal minimum, days left, and a printable report.

**Near you (Quezon City pilot):** `/find` is a map page. Tap "Use my location" or choose a QC barangay; the answer card gives the distance to the nearest office with a lawyer for your kind of matter, the office list and the gold numbers on the map run in distance order, and each office opens to its lawyers. On phones the answer card is the peek of a bottom sheet. Your location stays on the device.

The UI follows `.claude/skills/gis-ui-kit`, distilled from LAMBAT.

Also: the firm view (`/app/firm`), account and seats (`/app/account`), the lawyer landing page (`/for-lawyers`) and a lawyer verification mock (`/admin/verification`). "Reset demo" in the footer clears everything.

How the interface enforces the CPRA rules on advertising and fee-sharing is listed in `docs/compliance-rules.md` and checked by `npm run check:compliance`.

## Screens

Screenshots from the smoke test are in `docs/screens/`: client home (`01`), consent (`02`), redaction check (`03`), brief review (`04`), directory (`05`), lawyer inbox (`06`), brief decision (`07`), bookings (`08`), ULAS (`09`), report (`10`), lawyer landing (`11`), firm (`12`), phone views (`13` to `16`), and Near you on desktop and phone (`17` to `19`).

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

`npm run build` writes a static site to `out/`. Checks:

```bash
npm run lint && npm test && npm run check:compliance && npm run build && npm run smoke
```
