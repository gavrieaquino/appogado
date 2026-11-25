"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { segments, LABEL } from "@/lib/redact";
import { buildBrief, type IntakeInput } from "@/lib/brief";
import Term from "@/components/Term";
import Notice from "@/components/Notice";
import StatusPill from "@/components/StatusPill";
import s from "./describe.module.css";

const CITIES = ["Quezon City", "Manila", "Pasig", "Marikina", "Caloocan", "Other"];
const EXAMPLE = {
  en: { story: "I resigned from my job at a bakery on 10 October 2026 after two years. My employer still has not given my final pay or my certificate of employment. I texted the owner, Mr. Roberto Lim, twice at 0917 555 0142 and he says payroll is still processing.", wants: "Get my final pay and certificate of employment.", other: "The bakery (my former employer)" },
  fil: { story: "Nag-resign ako sa trabaho ko sa bakery noong 10 Oktubre 2026 pagkatapos ng dalawang taon. Hanggang ngayon hindi pa binibigay ng amo ko ang final pay at certificate of employment ko. Dalawang beses ko nang tinext si Mr. Roberto Lim sa 0917 555 0142 at sabi niya pinoproseso pa raw ang payroll.", wants: "Makuha ang final pay at certificate of employment ko.", other: "Ang bakery (dati kong amo)" },
};

type Step = "consent" | "story" | "check" | "making";

export default function Describe() {
  const router = useRouter();
  const [state, set] = useDemo();
  const { t, lang } = useT();
  const [step, setStep] = useState<Step>("consent");
  const [consent, setConsent] = useState<{ store: boolean | null; read: boolean | null; share: boolean | null }>({ store: null, read: null, share: null });
  const [form, setForm] = useState({ story: "", wants: "", otherParty: "", deadline: "", city: "Quezon City", files: [] as string[] });
  const [error, setError] = useState(false);
  const [making, setMaking] = useState(1);

  // Resume where the client left off on this device.
  useEffect(() => {
    if (state.consent) { setConsent(state.consent); setStep((st) => (st === "consent" ? "story" : st)); }
    if (state.intake) setForm({ story: state.intake.story, wants: state.intake.wants, otherParty: state.intake.otherParty, deadline: state.intake.deadline ?? "", city: state.intake.city, files: state.intake.files });
  }, [state.consent, state.intake]);

  const allYes = consent.store && consent.read && consent.share;
  const anyNo = consent.store === false || consent.read === false || consent.share === false;
  const segs = useMemo(() => segments(form.story), [form.story]);
  const found = segs.filter((x) => x.kind).length;
  const stepNo = step === "consent" ? 1 : step === "story" ? 2 : 3;

  const intake = (): IntakeInput => ({ story: form.story, wants: form.wants, otherParty: form.otherParty, deadline: form.deadline || null, files: form.files, city: form.city, language: lang, proBono: false });

  const toCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.story.trim().length < 10) { setError(true); return; }
    setError(false);
    set((x) => ({ ...x, intake: intake() }));
    setStep("check");
    window.scrollTo({ top: 0 });
  };

  const make = () => {
    setStep("making");
    setMaking(1);
    const fast = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 250 : 700;
    setTimeout(() => setMaking(2), fast);
    setTimeout(() => setMaking(3), fast * 2);
    setTimeout(() => {
      set((x) => ({ ...x, draft: buildBrief(intake()) }));
      router.push("/describe/review/");
    }, fast * 3);
  };

  return (
    <div className="page-in">
      <header className={s.head}>
        <p className={s.step}>{t("d.step", { n: stepNo })} · {t(stepNo === 1 ? "d.s1" : stepNo === 2 ? "d.s2" : "d.s3")}</p>
        <h1 className={s.title}>{step === "consent" ? t("c.title") : step === "story" ? t("d.title") : t("r.title")}</h1>
        <ol className={s.dots} aria-hidden>{[1, 2, 3].map((n) => <li key={n} data-on={n <= stepNo || undefined} data-now={n === stepNo || undefined} />)}</ol>
      </header>

      {step === "consent" && (
        <section className={s.col}>
          <p className="muted">
            <Term def={t("t.consent")}>{t("w.consent")}</Term>
            {lang === "en" ? ": you choose each one separately." : ": pipiliin mo ang bawat isa nang hiwalay."}
          </p>
          <ul className={s.consent}>
            {(["store", "read", "share"] as const).map((k) => (
              <li key={k} className={s.consentRow}>
                <p className={s.consentText}>{t(`c.${k}`)}</p>
                <fieldset className={s.yn}>
                  <legend className="sr-only">{t(`c.${k}`)}</legend>
                  {([true, false] as const).map((v) => (
                    <label key={String(v)} className={s.ynOpt} data-on={consent[k] === v || undefined}>
                      <input type="radio" name={`c-${k}`} checked={consent[k] === v} onChange={() => setConsent((c) => ({ ...c, [k]: v }))} />
                      {t(v ? "c.yes" : "c.no")}
                    </label>
                  ))}
                </fieldset>
              </li>
            ))}
          </ul>
          {anyNo && <p className={s.warn} role="status">{t("c.need")}</p>}
          <p className="hint">{t("c.retention")}</p>
          <div className="btn-row">
            <button className="btn btn-primary" disabled={!allYes} onClick={() => { set((x) => ({ ...x, consent: { store: true, read: true, share: true } })); setStep("story"); }}>{t("c.continue")}</button>
          </div>
        </section>
      )}

      {step === "story" && (
        <form className={s.col} onSubmit={toCheck} noValidate>
          <div className="field">
            <label htmlFor="story">{t("f.story")}</label>
            <p className="hint" id="story-hint">{t("f.storyHint")}</p>
            <textarea id="story" className="textarea" aria-describedby="story-hint" aria-invalid={error || undefined} value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} />
            {error && <p className="error" role="alert">{t("f.required")}</p>}
            <button type="button" className="btn btn-quiet" onClick={() => setForm({ ...form, story: EXAMPLE[lang].story, wants: EXAMPLE[lang].wants, otherParty: EXAMPLE[lang].other })}>{t("f.example")}</button>
          </div>
          <div className="field">
            <label htmlFor="wants">{t("f.wants")}</label>
            <input id="wants" className="input" value={form.wants} onChange={(e) => setForm({ ...form, wants: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="other">{t("f.other")}</label>
            <p className="hint" id="other-hint">{t("f.otherHint")}</p>
            <input id="other" className="input" aria-describedby="other-hint" value={form.otherParty} onChange={(e) => setForm({ ...form, otherParty: e.target.value })} />
          </div>
          <div className={s.two}>
            <div className="field">
              <label htmlFor="deadline">{t("f.deadline")}</label>
              <input id="deadline" type="date" className="input" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="city">{t("f.city")}</label>
              <select id="city" className="select" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="files">{t("f.files")}</label>
            <p className="hint" id="files-hint">{t("f.filesHint")}</p>
            <input id="files" type="file" multiple accept="image/*,application/pdf" className={s.file} aria-describedby="files-hint"
              onChange={(e) => setForm({ ...form, files: Array.from(e.target.files ?? []).map((f) => f.name) })} />
            {form.files.length > 0 && <ul className={s.fileList}>{form.files.map((f) => <li key={f}>{f}</li>)}</ul>}
          </div>
          <Notice />
          <div className="btn-row">
            <button type="submit" className="btn btn-primary">{t("f.next")}</button>
          </div>
        </form>
      )}

      {step === "check" && (
        <section className={s.col}>
          <p className={s.found} role="status">
            {found ? t("r.found", { n: found }) : t("r.none")}{" "}
            <Term def={t("t.redaction")}>{lang === "en" ? "What is hidden?" : "Ano ang itinatago?"}</Term>
          </p>
          <div className={s.preview}>
            {segs.map((x, i) => x.kind
              ? <mark key={i} className={s.mark} title={x.text}><s className={s.orig}>{x.text}</s> <span className={s.lbl}>{LABEL[x.kind]}</span></mark>
              : <span key={i}>{x.text}</span>)}
          </div>
          <p className="hint">{t("r.limit")}</p>
          <div className="btn-row">
            <button className="btn btn-primary" onClick={make}>{t("r.make")}</button>
            <button className="btn" onClick={() => setStep("story")}>{t("r.edit")}</button>
          </div>
        </section>
      )}

      {step === "making" && (
        <section className={s.making} aria-busy="true">
          <StatusPill step={making} total={3} stepLabel={t("d.step", { n: making })} text={t(`p.${making}` as "p.1")} />
          <div className={s.skel} aria-hidden><span /><span /><span /><span /></div>
        </section>
      )}
    </div>
  );
}
