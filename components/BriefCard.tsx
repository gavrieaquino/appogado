import type { Brief, Lang } from "@/lib/types";
import { PRACTICE } from "@/lib/practice";
import { translate } from "@/lib/copy";
import { fmtDate } from "@/lib/demo";
import s from "./BriefCard.module.css";

// The same card on both sides, so the client sees exactly what the lawyer sees.
export default function BriefCard({ brief, lang = "en", showReceived = false, headingLevel = 2 }: { brief: Brief; lang?: Lang; showReceived?: boolean; headingLevel?: 2 | 3 }) {
  const t = (k: Parameters<typeof translate>[1]) => translate(lang, k);
  const H = `h${headingLevel}` as "h2" | "h3";
  const urgencyClass = brief.urgency === "urgent" ? s.urgent : brief.urgency === "soon" ? s.soon : s.routine;
  return (
    <article className={s.card} aria-label="Brief">
      <div className={s.band} aria-hidden />
      <header className={s.head}>
        <p className={s.kind}>{PRACTICE[brief.category][lang]}</p>
        <H className={s.title}>{brief.title}</H>
        <ul className={s.meta}>
          <li className={`${s.chip} ${urgencyClass}`}>{t(`u.${brief.urgency}` as const)}</li>
          {brief.proBonoRequested && <li className={`${s.chip} ${s.pb}`}>{t("bc.pb")}</li>}
          <li className={s.chip}>{t("bc.lang")} {brief.language === "fil" ? "Filipino" : "English"}</li>
          <li className={s.chip}>{brief.city}</li>
          {showReceived && <li className={s.chip}>{fmtDate(brief.receivedAt)}</li>}
        </ul>
      </header>
      <dl className={s.body}>
        <div className={s.row}><dt>{t("bc.urgency")}</dt><dd>{brief.urgencyReason}</dd></div>
        <div className={s.row}><dt>{t("bc.facts")}</dt><dd><ul className={s.facts}>{brief.facts.map((f, i) => <li key={i}>{f}</li>)}</ul></dd></div>
        <div className={s.row}><dt>{t("bc.wants")}</dt><dd>{brief.wants}</dd></div>
        <div className={s.row}><dt>{t("bc.other")}</dt><dd>{brief.otherParty}</dd></div>
        <div className={s.row}><dt>{t("bc.docs")}</dt><dd>{brief.documents.length ? <ul className={s.docs}>{brief.documents.map((d) => <li key={d}>{d}</li>)}</ul> : t("bc.none")}</dd></div>
        {brief.partner && <div className={s.row}><dt>Routed by</dt><dd>{brief.partner}</dd></div>}
      </dl>
    </article>
  );
}
