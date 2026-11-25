"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { sendBrief } from "@/lib/actions";
import { PRACTICE, PRACTICE_KEYS } from "@/lib/practice";
import type { PracticeArea } from "@/lib/types";
import BriefCard from "@/components/BriefCard";
import Notice from "@/components/Notice";
import Term from "@/components/Term";
import { Honest } from "@/components/Honest";
import s from "./review.module.css";

export default function Review() {
  const router = useRouter();
  const [state, set] = useDemo();
  const { t, lang } = useT();
  const [editing, setEditing] = useState(false);
  const [pb, setPb] = useState(false);
  const draft = state.draft;

  if (!draft) {
    return (
      <div className="page-in stack">
        <h1>{t("rv.empty")}</h1>
        <Link className="btn btn-primary" href="/describe/">{t("rv.start")}</Link>
      </div>
    );
  }

  const area = PRACTICE[draft.category][lang];
  return (
    <div className={`page-in ${s.grid}`}>
      <div>
        <header className={s.head}>
          <h1 className={s.title}>{t("rv.title")}</h1>
          <p className={s.lead}>{t("rv.lead")} <Term def={t("t.brief")}>{lang === "en" ? "What is a brief?" : "Ano ang buod?"}</Term></p>
        </header>
        <Honest>
          <p><strong>{t("rv.ai")}</strong></p>
          <p>{t("rv.template")}</p>
        </Honest>
        {editing ? (
          <form className="panel" onSubmit={(e) => { e.preventDefault(); setEditing(false); }}>
            <div className="field">
              <label htmlFor="cat">{t("bc.category")}</label>
              <select id="cat" className="select" value={draft.category}
                onChange={(e) => { const c = e.target.value as PracticeArea; set((x) => ({ ...x, draft: x.draft && { ...x.draft, category: c, title: `${PRACTICE[c].en} matter` } })); }}>
                {PRACTICE_KEYS.map((k) => <option key={k} value={k}>{PRACTICE[k][lang]}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="facts">{t("rv.facts")}</label>
              <textarea id="facts" className="textarea" value={draft.facts.join("\n")}
                onChange={(e) => { const facts = e.target.value.split("\n"); set((x) => ({ ...x, draft: x.draft && { ...x.draft, facts } })); }} />
            </div>
            <div className="field">
              <label htmlFor="wants">{t("bc.wants")}</label>
              <input id="wants" className="input" value={draft.wants} onChange={(e) => { const wants = e.target.value; set((x) => ({ ...x, draft: x.draft && { ...x.draft, wants } })); }} />
            </div>
            <div className="field">
              <label htmlFor="other">{t("bc.other")}</label>
              <input id="other" className="input" value={draft.otherParty} onChange={(e) => { const otherParty = e.target.value; set((x) => ({ ...x, draft: x.draft && { ...x.draft, otherParty } })); }} />
            </div>
            <button className="btn btn-primary" type="submit"
              onClick={() => set((x) => ({ ...x, draft: x.draft && { ...x.draft, facts: x.draft.facts.map((f) => f.trim()).filter(Boolean) } }))}>{t("rv.done")}</button>
          </form>
        ) : (
          <>
            <BriefCard brief={draft} lang={lang} />
            <button className="btn btn-quiet" onClick={() => setEditing(true)}>{t("rv.edit")}</button>
          </>
        )}
        <Notice />
      </div>

      <aside className={s.side} aria-labelledby="choose">
        <h2 id="choose" className={s.sideTitle}>{t("rv.choose")}</h2>
        <div className={s.option}>
          <h3>{t("rv.pick")}</h3>
          <p className="muted small">{t("rv.pickD", { area: area.toLowerCase() })}</p>
          <Link className="btn btn-primary" href={`/find/?area=${draft.category}`} aria-disabled={editing || undefined}>{t("rv.pick")}</Link>
        </div>
        <div className={s.option}>
          <h3><Term def={t("t.probono")}>{t("rv.pb")}</Term></h3>
          <p className="muted small">{t("rv.pbD")}</p>
          {pb ? (
            <button className="btn btn-primary" onClick={() => { sendBrief("probono-routing", true); router.push("/sent/"); }}>{t("rv.pbSend")}</button>
          ) : (
            <button className="btn" onClick={() => setPb(true)} disabled={editing}>{t("rv.pb")}</button>
          )}
        </div>
      </aside>
    </div>
  );
}
