# Information architecture

Two front doors (client, lawyer), one login later. Static routes only in the prototype.

## Client (public, phone first)

| Route | Screen | Job |
|---|---|---|
| `/` | Client landing | "Describe your problem once. Reach a verified lawyer." Shows a sample brief. |
| `/describe` | Intake | Type, photo, or upload; EN or FIL; consent first |
| `/describe/review` | Brief review | Client sees exactly what the lawyer will see; edits; picks a lawyer or pro bono routing |
| `/find` | Directory | Filter by practice area, location, language, years; identical cards |
| `/find/[id]` | Lawyer profile | Verifiable facts only |
| `/sent` | Confirmation | What happens next, how long it may take |

The intake is one page (`/describe`) with three steps: consent, story, personal-details check.

## Lawyer (desktop dashboard, mobile inbox)

| Route | Screen | Job |
|---|---|---|
| `/for-lawyers` | Lawyer landing | Get discovered, triage in a minute, stay ULAS-compliant. Pricing. |
| `/app/inbox` | Inbox | Queue of briefs sent to this lawyer |
| `/app/inbox/brief/?id=` | Brief review | Accept (paid / pro bono) · decline · ask for more; conflict check. A query parameter, not a path, so briefs made in the browser demo open too. |
| `/app/ulas` | ULAS dashboard | Hours vs 60, personal minimum, days left, hour log, report export |
| `/app/ulas/report` | Compliance report | A4 print sheet and CSV |
| `/app/firm` | Firm view | Pool, each lawyer's personal minimum, who is behind |
| `/app/bookings` | Bookings | Booking carries the brief and the paid/pro bono tag; closing logs hours |
| `/app/account` | Account, seats, billing | Tier, founding-rate expiry, seats; never public |

## Admin (mock only)

| Route | Screen |
|---|---|
| `/admin/verification` | Lawyer verification queue: roll number, IBP ID, SC Law List check, date |

## Shared state in the URL

Filters on `/find`, the period on `/app/ulas`, and the selected brief are in the URL so a
view can be shared and printed.
