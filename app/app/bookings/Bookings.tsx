"use client";
import Link from "next/link";
import { useState } from "react";
import { useBookings } from "@/lib/useLawyer";
import { closeBooking, scheduleBooking } from "@/lib/actions";
import { DEMO_TODAY, fmtDate, fmtHours } from "@/lib/demo";
import type { Booking } from "@/lib/types";
import { Answer } from "@/components/Honest";
import s from "./bookings.module.css";

function Row({ b }: { b: Booking }) {
  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState("1");
  const [when, setWhen] = useState({ date: DEMO_TODAY, time: "10:00", mode: "In person" as Booking["mode"] });
  const pb = b.tag === "probono";
  return (
    <li className={s.row}>
      <div className={s.main}>
        <p className={s.title}>{b.matter}</p>
        <ul className={s.chips}>
          <li className={`${s.chip} ${pb ? s.pb : ""}`}>{pb ? "Pro bono" : "Paid"}</li>
          {b.demo && <li className={`${s.chip} ${s.demo}`}>From this demo</li>}
        </ul>
        <p className={s.meta}>
          {b.date ? `${fmtDate(b.date)}, ${b.time} · ${b.mode} · ${b.place}` : "Not scheduled yet"}
        </p>
        <p className={s.meta}>{pb ? "Hours you log when you close this count toward your ULAS hours." : "Paid directly to you. APPogado takes no share of your fee."}</p>
        {b.status === "done" && <p className={s.done}>Closed{b.hoursLogged ? ` · ${fmtHours(b.hoursLogged)} logged to ULAS` : ""}</p>}
      </div>
      <div className={s.actions}>
        <Link className="btn btn-quiet" href={`/app/inbox/brief/?id=${b.briefId}`}>Open brief</Link>
        {b.status === "to-schedule" && !open && <button className="btn btn-primary" onClick={() => setOpen(true)}>Schedule</button>}
        {b.status === "upcoming" && !open && <button className="btn btn-primary" onClick={() => setOpen(true)}>Close appointment</button>}
      </div>
      {open && b.status === "to-schedule" && (
        <form className={s.form} onSubmit={(e) => { e.preventDefault(); scheduleBooking(b, when.date, when.time, when.mode); setOpen(false); }}>
          <div className="field"><label htmlFor={`d-${b.id}`}>Date</label><input id={`d-${b.id}`} type="date" className="input" min={DEMO_TODAY} value={when.date} onChange={(e) => setWhen({ ...when, date: e.target.value })} /></div>
          <div className="field"><label htmlFor={`t-${b.id}`}>Time</label><input id={`t-${b.id}`} type="time" className="input" value={when.time} onChange={(e) => setWhen({ ...when, time: e.target.value })} /></div>
          <div className="field"><label htmlFor={`m-${b.id}`}>How</label>
            <select id={`m-${b.id}`} className="select" value={when.mode} onChange={(e) => setWhen({ ...when, mode: e.target.value as Booking["mode"] })}><option>In person</option><option>Video call</option></select>
          </div>
          <div className="btn-row"><button className="btn btn-primary" type="submit">Save</button><button type="button" className="btn" onClick={() => setOpen(false)}>Cancel</button></div>
        </form>
      )}
      {open && b.status === "upcoming" && (
        <form className={s.form} onSubmit={(e) => { e.preventDefault(); closeBooking(b, pb ? Number(hours) : null); setOpen(false); }}>
          {pb ? (
            <div className="field">
              <label htmlFor={`h-${b.id}`}>How long did this take?</label>
              <input id={`h-${b.id}`} type="number" min="0.5" max="12" step="0.5" className="input" value={hours} onChange={(e) => setHours(e.target.value)} />
              <p className="hint">Include preparation time. This is added to your ULAS hours.</p>
            </div>
          ) : <p className="small">Close this paid appointment? Nothing is logged to ULAS.</p>}
          <div className="btn-row"><button className="btn btn-primary" type="submit">{pb ? "Close and log hours" : "Close appointment"}</button><button type="button" className="btn" onClick={() => setOpen(false)}>Cancel</button></div>
        </form>
      )}
    </li>
  );
}

const GROUPS: { key: Booking["status"]; title: string }[] = [
  { key: "to-schedule", title: "To schedule" },
  { key: "upcoming", title: "Upcoming" },
  { key: "done", title: "Done" },
];

export default function Bookings() {
  const all = useBookings();
  const upcoming = all.filter((b) => b.status === "upcoming").sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const next = upcoming[0];
  const toSchedule = all.filter((b) => b.status === "to-schedule").length;
  return (
    <div className="page-in">
      <Answer kicker="Bookings">
        {next ? `Next: ${fmtDate(next.date!)} at ${next.time}, ${next.tag === "probono" ? "pro bono" : "paid"}.` : "No upcoming appointments."} {toSchedule ? `${toSchedule} to schedule.` : ""}
      </Answer>
      {GROUPS.map((g) => {
        const list = g.key === "upcoming" ? upcoming : all.filter((b) => b.status === g.key);
        if (!list.length) return null;
        return (
          <section key={g.key} className={s.group}>
            <h2 className={s.h2}>{g.title} <span className="muted">({list.length})</span></h2>
            <ul className={s.list}>{list.map((b) => <Row key={b.id} b={b} />)}</ul>
          </section>
        );
      })}
    </div>
  );
}
