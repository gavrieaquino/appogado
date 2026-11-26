"use client";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { lawyers, offices, sampleBriefs } from "@/lib/data";
import { PRACTICE_KEYS } from "@/lib/practice";
import BriefCard from "@/components/BriefCard";
import Notice from "@/components/Notice";
import Term from "@/components/Term";
import Icon from "@/components/Icon";
import RollNumber from "@/components/RollNumber";
import s from "./home.module.css";

const sample = sampleBriefs.find((b) => b.id === "b01")!;

// Client front door, built on LAMBAT's home (gis-ui-kit): the headline is the answer in numbers,
// then one action, a stats strip, a preview of the product (the brief), numbered steps and a story.
// Every number comes from the sample data; none is invented.
export default function Home() {
  const { t, lang } = useT();
  return (
    <div className={s.home}>
      <div className={s.bg} aria-hidden />
      <div className={s.inner}>
        <p className="eyebrow">{t("h.tagline")}</p>
        <h1 className={s.h1}>
          {t("h.answer1", { n: lawyers.length, o: offices.length })}
          <span className={s.h1b}>{t("h.answer2")}</span>
        </h1>
        <p className={s.def}>{t("h.def")}</p>
        <div className={s.cta}>
          <Link className="btn btn-primary" href="/describe/">{t("home.cta")}<Icon name="arrow" size={18} /></Link>
          <Link className={s.nearLink} href="/find/">{t("h.near")}</Link>
        </div>

        <dl className={`${s.strip} reveal`}>
          <div><dt>{t("h.stLawyers")}</dt><dd><RollNumber value={lawyers.length} /></dd></div>
          <div><dt>{t("h.stOffices")}</dt><dd><RollNumber value={offices.length} /></dd></div>
          <div><dt>{t("h.stAreas")}</dt><dd><RollNumber value={PRACTICE_KEYS.length} /></dd></div>
        </dl>

        <p className={`${s.lede} reveal`}>{t("h.lede")}</p>

        <div className={`${s.how} reveal`}>
          <Link className={s.preview} href="/describe/">
            <div className={s.pvCard}><BriefCard brief={sample} lang={lang} headingLevel={3} /></div>
            <span className={s.pvCap}>{t("h.pvCap")}<Icon name="arrow" size={18} /></span>
            <span className={s.pvLegend}>{t("h.pvLegend")}</span>
          </Link>
          <section className={s.steps} aria-labelledby="how">
            <h2 id="how">{t("home.how")}</h2>
            <ol>
              {([1, 2, 3] as const).map((n) => (
                <li key={n}>
                  <span className={s.n} aria-hidden>{n}</span>
                  <div>
                    <b>{t(`home.s${n}t`)}</b>
                    {n === 2 ? <>{t("home.s2d")} <Term def={t("t.brief")}>{lang === "en" ? "What is a brief?" : "Ano ang buod?"}</Term></> : t(`home.s${n}d`)}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <blockquote className={`${s.quote} reveal`}>
          <p>{t("h.quote")}</p>
          <cite>{t("h.cite")}</cite>
        </blockquote>
        <Notice />
      </div>
    </div>
  );
}
