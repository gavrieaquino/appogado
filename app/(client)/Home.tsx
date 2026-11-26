"use client";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { sampleBriefs } from "@/lib/data";
import BriefCard from "@/components/BriefCard";
import Notice from "@/components/Notice";
import Term from "@/components/Term";
import s from "./home.module.css";

const sample = sampleBriefs.find((b) => b.id === "b01")!;

// Client front door. The brief is the hero (vision principle 2).
export default function Home() {
  const { t, lang } = useT();
  return (
    <div className="page-in">
      <section className={s.hero}>
        <div>
          <p className={s.kicker}>{t("home.kicker")}</p>
          <h1 className={s.title}>{t("home.title")}</h1>
          <p className={s.lead}>{t("home.lead")}</p>
          <div className="btn-row">
            <Link className="btn btn-primary" href="/describe/">{t("home.cta")}</Link>
            <Link className="btn" href="/find/">{t("home.ctaFind")}</Link>
          </div>
          <p className={s.free}>{t("home.free")}</p>
        </div>
        <figure className={s.sample}>
          <figcaption className={s.cap}>{t("home.sample")} · <Term def={t("t.brief")}>{lang === "en" ? "What is a brief?" : "Ano ang buod?"}</Term></figcaption>
          <BriefCard brief={sample} lang={lang} />
        </figure>
      </section>
      <section aria-labelledby="how" className={s.how}>
        <h2 id="how" className={s.h2}>{t("home.how")}</h2>
        <ol className={s.steps}>
          {([1, 2, 3] as const).map((n) => (
            <li key={n} className={s.step}>
              <span className={s.n} aria-hidden>{n}</span>
              <h3>{t(`home.s${n}t`)}</h3>
              <p>{t(`home.s${n}d`)}</p>
            </li>
          ))}
        </ol>
      </section>
      <Notice />
    </div>
  );
}
