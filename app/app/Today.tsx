"use client";
// Lawyer overview as a bento grid (direction D, decision D30): the day organised the way a solo
// practitioner thinks (new matters, hours owed, next appointment, the plan). Answer first, then tiles
// sized by importance. Hero motion: the ULAS bar fills. Tiles enter with a short staggered spring.
import Link from "next/link";
import { useMemo } from "react";
import { useBookings, useBriefs, useHours } from "@/lib/useLawyer";
import { firmSummary, summarize } from "@/lib/ulas";
import { DEMO_TODAY, demoToday, fmtDate, fmtNum, peso } from "@/lib/demo";
import { PRACTICE } from "@/lib/practice";
import { account, firm, fullName, me } from "@/lib/data";
import { Answer } from "@/components/Honest";
import UlasMeter from "@/components/UlasMeter";
import RollNumber from "@/components/RollNumber";
import Icon from "@/components/Icon";
import s from "./today.module.css";

export default function Today() {
  const briefs = useBriefs();
  const hours = useHours();
  const bookings = useBookings();
  const sum = useMemo(() => summarize(hours, demoToday()), [hours]);
  const fresh = briefs.filter((b) => b.status === "new");
  const urgent = fresh.filter((b) => b.urgency === "urgent");
  const fromClinics = fresh.filter((b) => b.source === "partner-clinic");
  const next = bookings.filter((b) => b.status === "upcoming").sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))[0];
  const toSchedule = bookings.filter((b) => b.status === "to-schedule").length;
  const f = firmSummary(firm.members);

  return (
    <div className="page-in">
      <Answer kicker={`${fmtDate(DEMO_TODAY)} · ${fullName(me)} · sample lawyer`}>
        {fresh.length} new {fresh.length === 1 ? "brief" : "briefs"}, {urgent.length} urgent. {fmtNum(sum.credited)} of {sum.required} ULAS hours, {sum.daysLeft} days left.
      </Answer>

      <div className={`${s.grid} stagger`}>
        <section className={`${s.tile} ${s.ulas}`} style={{ "--i": 0 } as React.CSSProperties} aria-labelledby="t-ulas">
          <h2 id="t-ulas" className={s.h}><Link href="/app/ulas/" className={s.cover}>ULAS hours</Link></h2>
          <UlasMeter value={sum.credited} max={sum.required || 60} marker={sum.personalMinimum} markerLabel={`${sum.personalMinimum} h personal minimum`} label="ULAS hours credited this period" />
          <dl className={s.kv}>
            <div><dt>Still needed</dt><dd>{fmtNum(sum.remaining)} h</dd></div>
            <div><dt>Pace</dt><dd>{fmtNum(sum.hoursPerMonthNeeded)} h a month</dd></div>
            <div><dt>Period ends</dt><dd>{fmtDate(sum.periodEnd)}</dd></div>
          </dl>
          <p className={s.note}>Rules not yet confirmed by a lawyer.</p>
        </section>

        <section className={`${s.tile} ${s.briefs}`} style={{ "--i": 1 } as React.CSSProperties} aria-labelledby="t-briefs">
          <h2 id="t-briefs" className={s.h}><Link href="/app/inbox/" className={s.cover}>New briefs</Link></h2>
          <p className={s.big}><RollNumber value={fresh.length} /><span className={s.unit}>{urgent.length} urgent</span></p>
          <ul className={s.list}>
            {fresh.slice(0, 3).map((b) => (
              <li key={b.id}>
                <span className={b.urgency === "urgent" ? s.dotUrgent : s.dot} aria-hidden />
                <span className={s.lt}>{b.title}<span className={s.ls}>{PRACTICE[b.category].en}{b.proBonoRequested ? " · pro bono asked" : ""}</span></span>
              </li>
            ))}
          </ul>
        </section>

        <section className={`${s.tile} ${s.next}`} style={{ "--i": 2 } as React.CSSProperties} aria-labelledby="t-next">
          <h2 id="t-next" className={s.h}><Link href="/app/bookings/" className={s.cover}>Next appointment</Link></h2>
          {next ? (
            <>
              <p className={s.mid}>{fmtDate(next.date!)}<span className={s.unit}>{next.time} · {next.mode}</span></p>
              <p className={s.small}>{next.matter}</p>
              <span className={next.tag === "probono" ? s.tagPb : s.tag}>{next.tag === "probono" ? "Pro bono" : "Paid"}</span>
            </>
          ) : <p className={s.small}>Nothing scheduled.</p>}
          {toSchedule > 0 && <p className={s.note}>{toSchedule} to schedule</p>}
        </section>

        <section className={`${s.tile} ${s.clinic}`} style={{ "--i": 3 } as React.CSSProperties} aria-labelledby="t-clinic">
          <h2 id="t-clinic" className={s.h}><Link href="/app/inbox/" className={s.cover}>From partner clinics</Link></h2>
          <p className={s.mid}><RollNumber value={fromClinics.length} /><span className={s.unit}>pro bono {fromClinics.length === 1 ? "brief" : "briefs"} waiting</span></p>
          <p className={s.small}>{fromClinics[0]?.partner ?? "No routed briefs right now."}</p>
        </section>

        <section className={`${s.tile} ${s.firm}`} style={{ "--i": 4 } as React.CSSProperties} aria-labelledby="t-firm">
          <h2 id="t-firm" className={s.h}><Link href="/app/firm/" className={s.cover}>Firm view (sample)</Link></h2>
          <p className={s.mid}>{f.rendered}<span className={s.unit}>of {f.required} pooled hours</span></p>
          <p className={s.small}>{f.behind.length} of {f.covered} lawyers behind on the personal minimum</p>
        </section>

        <section className={`${s.tile} ${s.plan}`} style={{ "--i": 5 } as React.CSSProperties} aria-labelledby="t-plan">
          <h2 id="t-plan" className={s.h}><Link href="/app/account/" className={s.cover}>Plan</Link></h2>
          <p className={s.mid}>{peso(account.foundingPrice)}<span className={s.unit}>a month, founding rate</span></p>
          <p className={s.small}>Until {fmtDate(account.foundingUntil)}. Never shown on your public profile.</p>
        </section>
      </div>
      <p className={s.foot}><Icon name="arrow" size={16} /> Each tile opens its screen. Sample data only.</p>
    </div>
  );
}
