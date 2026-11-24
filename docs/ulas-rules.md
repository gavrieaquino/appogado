# ULAS rules (A.M. No. 22-11-01-SC)

**Status: UNCONFIRMED.** Compiled 24 Nov 2026 from secondary sources. The official SC
FAQ and Manual could not be downloaded from the build environment (the SC server returns
403 to automated requests). A lawyer must confirm every row against the Rules and the
Manual before the tracker shows anything to a real user.

## Rules the tracker depends on

| Rule | Value found | Agreement | Source |
|---|---|---|---|
| Minimum hours | 60 hours per compliance period | Sources agree | [1] [3] [5] |
| Compliance period | 36 months | Sources agree | [1] [5] |
| Start date | 1 Jan 2025 or Feb 2025 | **Conflict.** The Manual is dated 8 Apr 2025. | [4] [6] |
| Personal (non-aggregable) minimum | 15 hours (25% of 60); cannot be aggregated or substituted | One detailed source | [4] |
| Firm / registered organization (RO) total | 60 × number of covered lawyers (e.g. 5 lawyers → 300 h) | One detailed source | [4] |
| Aggregable share | Remaining 45 h (75%) may be rendered collectively by the RO | One detailed source; matches vision doc | [4] |
| Hour sharing between lawyer and RO | 50% of hours rendered retained by RO, 50% by lawyer, lawyer capped at 60; hours above 60 go to the RO | One detailed source | [4] |
| Financial contribution (ULAS Fund) | ₱500 per hour offset | One source | [5] |
| Contribution cap, individual | **Conflict:** 50% (30 h) vs 60% (the remaining 36 h) | **Conflict** | [4] [5] |
| Contribution cap, RO | **Conflict:** 75% vs 100% of aggregate hours | **Conflict** | [5] |
| Contribution cap, lawyer abroad | 100% | One source | [5] |

## Coverage and exemptions

Not covered (per [5], [7]):
- Lawyers with at least 35 years of practice, or aged 60
- Lawyers with certain disabilities
- Newly admitted lawyers, for the compliance period in which they were admitted

Excluded offices: Public Attorney's Office, the Judiciary, Office of the Solicitor
General, DOJ prosecutors, Shari'ah Public Assistance Office. Other government lawyers are
covered unless their agency denies authority to render ULAS service.

**Open:** whether "35 years or 60" is "or" in the Rules; what "certain disabilities" means;
partial-period rules for lawyers admitted mid-period; penalties for non-compliance;
which activities and clients qualify (indigency test); how hours are certified.

## Official SC ULAS Portal

Lexology [6] reports an official ULAS Portal launching in 2026 for lawyers and firms.
**Blocking (decision D8):** confirm launch date, what it records, and whether it accepts
imports. The tracker's role (feed the portal, export a report for it, or be dropped)
depends on this.

## Tracker logic sketch (for the prototype only)

```
period        = 36 months from period_start (configurable until confirmed)
exempt        = age >= 60 OR years_of_practice >= 35 OR newly_admitted_this_period OR excluded_office
required      = exempt ? 0 : 60
personal_min  = 15                                  // non-aggregable
rendered      = sum(hours on pro bono matters, this period)
contributed_h = fund_payment_pesos / 500           // capped at CONTRIBUTION_CAP (unconfirmed)
credited      = min(60, rendered + contributed_h + ro_share)
on_track      = rendered >= personal_min AND credited >= required
```

Every constant above lives in one config object so a confirmed value is a one-line change.

## Sources

1. [SC ULAS FAQ for lawyers, as of 31 May 2025 (PDF)](https://sc.judiciary.gov.ph/wp-content/uploads/2025/06/FAQs-for-lawyers-as-of-May-31-2025-1.pdf) — not read; download blocked
2. [SC ULAS page](https://sc.judiciary.gov.ph/ulas/) — not read; download blocked
3. [Manual on the Rules on ULAS, SC E-Library](https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/11/99241) — not read
4. [Ocampo & Suralvo Law Offices, 9 May 2025](https://www.ocamposuralvo.com/2025/05/09/supreme-court-approves-new-rules-on-mandatory-pro-bono-legal-aid-service-in-administrative-matter-no-22-11-01-sc/), via search summary
5. [Philippine News Agency](https://www.pna.gov.ph/articles/1238475), [Pro Bono Institute, Sep 2025](https://www.probonoinst.org/2025/09/11/mandatory-pro-bono-in-the-philippines/), via search summary
6. [Lexology: ULAS Portal to launch in 2026](https://www.lexology.com/library/detail.aspx?g=056198a1-8878-490b-a15b-2ba0f566c046), [Lexology: SC issues ULAS rules](https://www.lexology.com/library/detail.aspx?g=72d06745-bc1b-4407-8755-40f31ffaecfc), via search summary
7. [SunStar: Pro bono legal aid services](https://www.sunstar.com.ph/cebu/rivera-pro-bono-legal-aid-services), via search summary

"Via search summary" means the figure came from a search engine's summary of the page,
not from reading the page itself. Treat it as a lead, not a citation.
