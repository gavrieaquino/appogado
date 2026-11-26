"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useBriefs, useHours } from "@/lib/useLawyer";
import { summarize, ULAS_CONFIG } from "@/lib/ulas";
import { DEMO_TODAY, demoToday, fmtDate, fmtHours, fmtNum, peso } from "@/lib/demo";
import { logHours } from "@/lib/actions";
import { downloadCsv } from "@/lib/csv";
import { fullName, me } from "@/lib/data";
import { Answer, Honest } from "@/components/Honest";
import UlasMeter from "@/components/UlasMeter";
import Term from "@/components/Term";
import { reportRows } from "./reportRows";
import s from "./ulas.module.css";

export default function Ulas() {
  const hours = useHours();
  const briefs = useBriefs();
  const sum = useMemo(() => summarize(hours, demoToday()), [hours]);
  const proBonoMatters = briefs.filter((b) => b.status === "accepted" && b.acceptedAs === "probono");
  const [form, setForm] = useState({ date: DEMO_TODAY, matter: proBonoMatters[0]?.id ?? "other", other: "", hours: "1" });
  const [pesos, setPesos] = useState("");
  const [logged, setLogged] = useState<string | null>(null);

  const cap = ULAS_CONFIG.minimumHours.value * ULAS_CONFIG.contributionCapShare.value;
  const offset = Math.min(cap, (Number(pesos) || 0) / ULAS_CONFIG.contributionPerHour.value);
  const matterTitle = (id: string) => briefs.find((b) => b.id === id)?.title;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = Number(form.hours);
    if (!(h > 0)) return;
    const title = form.matter === "other" ? form.other.trim() || "Other legal aid activity" : matterTitle(form.matter) ?? "Pro bono matter";
    logHours({ date: form.date, matter: title, briefId: form.matter === "other" ? undefined : form.matter, hours: h });
    setLogged(`${fmtHours(h)} logged for ${title}.`);
  };

  return (
    <div className="page-in">
      <Answer kicker={`Compliance period ${fmtDate(sum.periodStart)} to ${fmtDate(sum.periodEnd)} · ${fullName(me)}`}>
        {fmtNum(sum.credited)} of {sum.required} hours. {sum.personalMet ? `${sum.personalMinimum}-hour personal minimum met.` : `${fmtNum(sum.personalMinimum - sum.rendered)} hours to your ${sum.personalMinimum}-hour personal minimum.`} {sum.daysLeft} days left.
      </Answer>
      <Honest>
        <p>Based on <Term def="Rules on Unified Legal Aid Service: Supreme Court rules that require most lawyers to give 60 hours of free legal aid every 36 months.">ULAS</Term> rules that a lawyer has not yet confirmed. Two of them conflict between sources. <a href="#how">See how we count</a>.</p>
      </Honest>

      <UlasMeter value={sum.credited} max={sum.required || 60} marker={sum.personalMinimum} markerLabel={`${sum.personalMinimum}-hour personal minimum`} label="ULAS hours credited this period" />

      <div className={s.stats}>
        <div className={s.stat}><p className={s.statNum}>{fmtNum(sum.remaining)}</p><p className={s.statLbl}>hours still needed</p></div>
        <div className={s.stat}><p className={s.statNum}>{fmtNum(sum.hoursPerMonthNeeded)}</p><p className={s.statLbl}>hours a month to finish by {fmtDate(sum.periodEnd)}</p></div>
        <div className={s.stat}><p className={s.statNum}>{sum.personalMetOn ? fmtDate(sum.personalMetOn) : "Not yet"}</p><p className={s.statLbl}>personal minimum reached</p></div>
      </div>

      <div className={s.cols}>
        <section className="panel">
          <h2 className={s.h2}>Log pro bono hours</h2>
          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="matter">Matter</label>
              <select id="matter" className="select" value={form.matter} onChange={(e) => setForm({ ...form, matter: e.target.value })}>
                {proBonoMatters.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
                <option value="other">Other legal aid activity</option>
              </select>
            </div>
            {form.matter === "other" && (
              <div className="field">
                <label htmlFor="other">What did you do?</label>
                <input id="other" className="input" value={form.other} onChange={(e) => setForm({ ...form, other: e.target.value })} placeholder="For example: barangay legal aid day" />
              </div>
            )}
            <div className={s.two}>
              <div className="field"><label htmlFor="date">Date</label><input id="date" type="date" className="input" max={DEMO_TODAY} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <div className="field"><label htmlFor="hours">Hours</label><input id="hours" type="number" min="0.5" max="12" step="0.5" className="input" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} /></div>
            </div>
            <button className="btn btn-primary" type="submit">Log hours</button>
            {logged && <p className={s.ok} role="status">{logged}</p>}
          </form>
        </section>

        <section className="panel">
          <h2 className={s.h2}>Milestones</h2>
          <ul className={s.miles}>
            <li data-done={sum.personalMet || undefined}><strong>{sum.personalMinimum}-hour personal minimum</strong><span>{sum.personalMet ? `Met on ${fmtDate(sum.personalMetOn!)}` : "Not met. These hours cannot come from your firm or a fund payment."}</span></li>
            <li data-done={sum.credited >= 30 || undefined}><strong>Halfway: 30 hours</strong><span>{sum.credited >= 30 ? "Reached" : `${fmtNum(30 - sum.credited)} hours to go`}</span></li>
            <li data-done={sum.remaining === 0 || undefined}><strong>All 60 hours</strong><span>{sum.remaining === 0 ? "Complete" : `${fmtNum(sum.remaining)} hours to go`}</span></li>
            <li><strong>Period ends</strong><span>{fmtDate(sum.periodEnd)}, in {sum.daysLeft} days</span></li>
          </ul>
          <div className="btn-row">
            <Link className="btn" href="/app/ulas/report/">Compliance report</Link>
            <button className="btn" onClick={() => downloadCsv(`ulas-hours-${DEMO_TODAY}.csv`, reportRows(hours, sum))}>Download CSV</button>
          </div>
        </section>
      </div>

      <section className={s.section}>
        <h2 className={s.h2}>Hour log</h2>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th scope="col">Date</th><th scope="col">Matter or activity</th><th scope="col" className="num">Hours</th><th scope="col">Source</th></tr></thead>
            <tbody>
              {hours.map((h) => (
                <tr key={h.id}><td>{fmtDate(h.date)}</td><td>{h.matter}</td><td className="num">{fmtNum(h.hours)}</td><td>{h.demo ? "Logged in this demo" : "Sample"}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={`panel ${s.section}`}>
        <h2 className={s.h2}>Paying into the ULAS Fund instead</h2>
        <p className="small">Some hours may be covered by a payment to the ULAS Fund. Sources found so far say {peso(ULAS_CONFIG.contributionPerHour.value)} per hour, for up to {cap} hours. The cap is one of the conflicting rules.</p>
        <div className="field" style={{ maxWidth: 280 }}>
          <label htmlFor="pesos">Amount in pesos</label>
          <input id="pesos" type="number" min="0" step="500" className="input" value={pesos} onChange={(e) => setPesos(e.target.value)} />
        </div>
        <p className="small" aria-live="polite">{pesos ? `This would cover ${fmtNum(offset)} hours${offset === cap ? " (the cap)" : ""}. Your personal minimum still has to be your own service.` : "Enter an amount to see how many hours it would cover. Nothing is paid here."}</p>
      </section>

      <section id="how" className={s.section}>
        <h2 className={s.h2}>How we count</h2>
        <p className="small">Every rule below comes from secondary sources (law-firm summaries and news reports). A lawyer must check each one against A.M. No. 22-11-01-SC and the ULAS Manual before this tracker is used for real. The Supreme Court is also reported to be launching its own ULAS Portal in 2026; how this tracker will work with it is not decided yet.</p>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th scope="col">Rule</th><th scope="col">Value used</th><th scope="col">Status</th><th scope="col">Where it comes from</th></tr></thead>
            <tbody>
              {Object.entries(ULAS_CONFIG).map(([k, r]) => (
                <tr key={k}>
                  <td>{r.label}</td>
                  <td>{typeof r.value === "number" && r.value < 1 ? `${r.value * 100}%` : String(r.value)}</td>
                  <td><span className={r.status === "conflict" ? s.conflict : s.unconf}>{r.status === "conflict" ? "Sources conflict" : "Unconfirmed"}</span></td>
                  <td>{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
