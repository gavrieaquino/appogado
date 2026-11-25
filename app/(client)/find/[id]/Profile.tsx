"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fullName, lawyerById } from "@/lib/data";
import { AVAILABILITY, LANGUAGES, PRACTICE } from "@/lib/practice";
import { fmtDate } from "@/lib/demo";
import { useT } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import { sendBrief } from "@/lib/actions";
import BriefCard from "@/components/BriefCard";
import s from "./profile.module.css";

// Facts only (rules C3, C8): no ratings, no badges, no plan. The same layout for everyone.
export default function Profile({ id }: { id: string }) {
  const l = lawyerById(id)!;
  const router = useRouter();
  const { t, lang } = useT();
  const [state] = useDemo();
  const name = fullName(l);
  return (
    <div className={`page-in ${s.grid}`}>
      <div>
        <p><Link href="/find/">← {t("pf.back")}</Link></p>
        <h1 className={s.name}>{name}</h1>
        <p className={s.checked}><span className={s.tick} aria-hidden>✓</span>{t("pf.checked", { date: fmtDate(l.verifiedOn) })}</p>
        <h2 className={s.h2}>{t("pf.facts")}</h2>
        <dl className={s.facts}>
          <div><dt>{t("pf.roll")}</dt><dd>{l.rollNo} · {l.rollStatus}</dd></div>
          <div><dt>{t("pf.areas")}</dt><dd>{l.practiceAreas.map((a) => PRACTICE[a][lang]).join(", ")}</dd></div>
          <div><dt>{t("lc.speaks")}</dt><dd>{l.languages.map((x) => LANGUAGES[x]).join(", ")}</dd></div>
          <div><dt>{t("pf.office")}</dt><dd>{l.barangay}, {l.city}</dd></div>
          <div><dt>{t("fd.years")}</dt><dd>{t("lc.years", { n: l.yearsOfPractice })}</dd></div>
          <div><dt>{t("pf.avail")}</dt><dd>{AVAILABILITY[l.availability][lang]}</dd></div>
          <div><dt>Pro bono</dt><dd>{l.takesProBono ? t("lc.pb") : "–"}</dd></div>
        </dl>
      </div>
      <aside className={s.side}>
        {l.availability === "closed" ? (
          <p className="panel">{t("pf.closed")}</p>
        ) : state.draft ? (
          <div className="panel stack">
            <BriefCard brief={state.draft} lang={lang} headingLevel={3} />
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => { sendBrief(l.id); router.push("/sent/"); }}>{t("pf.send", { name })}</button>
          </div>
        ) : (
          <div className="panel stack">
            <p>{t("pf.noDraft")}</p>
            <Link className="btn btn-primary" href="/describe/">{t("home.cta")}</Link>
          </div>
        )}
      </aside>
    </div>
  );
}
