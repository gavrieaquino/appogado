import Link from "next/link";
import type { Lang, Lawyer } from "@/lib/types";
import { AVAILABILITY, LANGUAGES, PRACTICE } from "@/lib/practice";
import { translate } from "@/lib/i18n";
import { fmtDate } from "@/lib/demo";
import { fullName } from "@/lib/data";
import s from "./LawyerCard.module.css";

// Rules C2, C3, C8: one fixed layout for every lawyer. The props carry public facts only;
// there is no plan, tier, rating or badge input, so the card cannot vary by payment.
export default function LawyerCard({ lawyer, lang }: { lawyer: Lawyer; lang: Lang }) {
  const t = (k: Parameters<typeof translate>[1], v?: Record<string, string | number>) => translate(lang, k, v);
  return (
    <article className={s.card}>
      <h2 className={s.name}><Link href={`/find/${lawyer.id}/`} className={s.link}>{fullName(lawyer)}</Link></h2>
      <p className={s.verified}><span className={s.check} aria-hidden>✓</span>{t("lc.verified", { date: fmtDate(lawyer.verifiedOn) })} · Roll {lawyer.rollNo}</p>
      <ul className={s.areas} aria-label={t("pf.areas")}>
        {lawyer.practiceAreas.map((a) => <li key={a}>{PRACTICE[a][lang]}</li>)}
      </ul>
      <dl className={s.facts}>
        <div><dt>{t("lc.speaks")}</dt><dd>{lawyer.languages.map((l) => LANGUAGES[l]).join(", ")}</dd></div>
        <div><dt>{t("pf.office")}</dt><dd>{lawyer.barangay}, {lawyer.city}</dd></div>
        <div><dt>{t("fd.years")}</dt><dd>{lawyer.yearsOfPractice}</dd></div>
        <div><dt>{t("pf.avail")}</dt><dd>{AVAILABILITY[lawyer.availability][lang]}{lawyer.takesProBono ? ` · ${t("lc.pb")}` : ""}</dd></div>
      </dl>
    </article>
  );
}
