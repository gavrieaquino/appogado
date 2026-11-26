"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { lawyers } from "@/lib/data";
import { search, type Filters } from "@/lib/directory";
import { LANGUAGES, PRACTICE, PRACTICE_KEYS } from "@/lib/practice";
import { useT } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import type { LanguageCode, PracticeArea } from "@/lib/types";
import LawyerCard from "@/components/LawyerCard";
import Term from "@/components/Term";
import s from "./find.module.css";

const CITIES = [...new Set(lawyers.map((l) => l.city))].sort();
const YEARS = [3, 5, 10, 15];

export default function Directory() {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const { t, lang } = useT();
  const [state] = useDemo();

  const f: Filters = {
    area: (params.get("area") as PracticeArea) || undefined,
    city: params.get("city") || undefined,
    lang: (params.get("lang") as LanguageCode) || undefined,
    minYears: params.get("years") ? Number(params.get("years")) : undefined,
  };
  const list = useMemo(() => search(lawyers, f), [f.area, f.city, f.lang, f.minYears]); // eslint-disable-line react-hooks/exhaustive-deps
  const any = Object.values(f).some((v) => v !== undefined);

  const setParam = (k: string, v: string) => {
    const p = new URLSearchParams(params.toString());
    if (v) p.set(k, v); else p.delete(k);
    router.replace(`${path}${p.size ? `?${p}` : ""}`, { scroll: false });
  };

  return (
    <div className="page-in">
      <header className={s.head}>
        <h1 className={s.title}>{t("fd.title")}</h1>
        <p className={s.answer} aria-live="polite">{any ? t("fd.count", { n: list.length }) : t("fd.countAll", { n: list.length })}</p>
        <p className="muted small">{t("fd.order")} <Term def={t("t.verified")}>{lang === "en" ? "What does verified mean?" : "Ano ang ibig sabihin ng beripikado?"}</Term></p>
      </header>

      {state.draft && <p className={s.draft} role="status">{t("fd.draft")}</p>}

      <form className={s.filters} onSubmit={(e) => e.preventDefault()} aria-label="Filters">
        <div className="field">
          <label htmlFor="area">{t("fd.area")}</label>
          <select id="area" className="select" value={f.area ?? ""} onChange={(e) => setParam("area", e.target.value)}>
            <option value="">{t("fd.any")}</option>
            {PRACTICE_KEYS.map((k) => <option key={k} value={k}>{PRACTICE[k][lang]}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="city">{t("fd.city")}</label>
          <select id="city" className="select" value={f.city ?? ""} onChange={(e) => setParam("city", e.target.value)}>
            <option value="">{t("fd.any")}</option>
            {CITIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="lang">{t("fd.lang")}</label>
          <select id="lang" className="select" value={f.lang ?? ""} onChange={(e) => setParam("lang", e.target.value)}>
            <option value="">{t("fd.any")}</option>
            {(Object.keys(LANGUAGES) as LanguageCode[]).map((k) => <option key={k} value={k}>{LANGUAGES[k]}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="years">{t("fd.years")}</label>
          <select id="years" className="select" value={f.minYears ?? ""} onChange={(e) => setParam("years", e.target.value)}>
            <option value="">{t("fd.any")}</option>
            {YEARS.map((y) => <option key={y} value={y}>{t("fd.min", { n: y })}</option>)}
          </select>
        </div>
        {any && <button type="button" className="btn btn-quiet" onClick={() => router.replace(path, { scroll: false })}>{t("fd.clear")}</button>}
      </form>

      {list.length === 0 ? (
        <p className={s.none}>{t("fd.none")}</p>
      ) : (
        <ul className={s.grid}>
          {list.map((l) => <li key={l.id}><LawyerCard lawyer={l} lang={lang} /></li>)}
        </ul>
      )}
      <p className="muted small">{lang === "en" ? "Every lawyer and record here is sample data." : "Sample na datos ang lahat ng abogado at rekord dito."} <Link href="/describe/">{t("home.cta")}</Link></p>
    </div>
  );
}
