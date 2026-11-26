"use client";
import Link from "next/link";
import { useMemo } from "react";
import { useHours } from "@/lib/useLawyer";
import { summarize } from "@/lib/ulas";
import { DEMO_TODAY, demoToday, fmtDate, fmtNum } from "@/lib/demo";
import { downloadCsv } from "@/lib/csv";
import { fullName, me } from "@/lib/data";
import { reportRows } from "../reportRows";
import s from "./report.module.css";

// A4 sheet for offices that work on paper. On screen it is a preview with Print and CSV.
export default function Report() {
  const hours = useHours();
  const sum = useMemo(() => summarize(hours, demoToday()), [hours]);
  const rows = [...hours].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <div className="page-in">
      <div className={`btn-row no-print ${s.bar}`}>
        <Link className="btn" href="/app/ulas/">← Back</Link>
        <button className="btn btn-primary" onClick={() => window.print()}>Print</button>
        <button className="btn" onClick={() => downloadCsv(`ulas-report-${DEMO_TODAY}.csv`, reportRows(hours, sum))}>Download CSV</button>
      </div>
      <article className={s.sheet}>
        <p className={s.draft}>Draft · Prototype on sample data · ULAS rules not yet confirmed by a lawyer</p>
        <h1 className={s.h1}>ULAS pro bono hours report</h1>
        <dl className={s.meta}>
          <div><dt>Lawyer</dt><dd>{fullName(me)}</dd></div>
          <div><dt>Roll no.</dt><dd>{me.rollNo}</dd></div>
          <div><dt>Compliance period</dt><dd>{fmtDate(sum.periodStart)} to {fmtDate(sum.periodEnd)}</dd></div>
          <div><dt>Prepared</dt><dd>{fmtDate(DEMO_TODAY)}</dd></div>
        </dl>
        <p className={s.summary}>
          {fmtNum(sum.credited)} of {sum.required} hours credited. Personal minimum of {sum.personalMinimum} hours {sum.personalMet ? `met on ${fmtDate(sum.personalMetOn!)}` : "not yet met"}. {fmtNum(sum.remaining)} hours remaining.
        </p>
        <table className={s.table}>
          <thead><tr><th>Date</th><th>Matter or activity</th><th className={s.num}>Hours</th></tr></thead>
          <tbody>{rows.map((h) => <tr key={h.id}><td>{fmtDate(h.date)}</td><td>{h.matter}</td><td className={s.num}>{fmtNum(h.hours)}</td></tr>)}</tbody>
          <tfoot><tr><td colSpan={2}>Total service hours</td><td className={s.num}>{fmtNum(sum.rendered)}</td></tr></tfoot>
        </table>
        <p className={s.note}>Prepared by APPogado from hours the lawyer logged. This is a record for the lawyer&rsquo;s own use, not a certificate of compliance. The way hours are counted follows rules that have not yet been confirmed against A.M. No. 22-11-01-SC.</p>
      </article>
    </div>
  );
}
