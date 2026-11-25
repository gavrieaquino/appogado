"use client";
import Link from "next/link";
import { useState } from "react";
import { useBriefs } from "@/lib/useLawyer";
import { PRACTICE } from "@/lib/practice";
import { fmtDate } from "@/lib/demo";
import { fullName, lawyerById, me } from "@/lib/data";
import type { BriefStatus } from "@/lib/types";
import { Answer } from "@/components/Honest";
import s from "./inbox.module.css";

const TABS: { key: BriefStatus; label: string }[] = [
  { key: "new", label: "New" },
  { key: "more-info", label: "Asked for more" },
  { key: "accepted", label: "Accepted" },
  { key: "declined", label: "Declined" },
];

export default function Inbox() {
  const briefs = useBriefs();
  const [tab, setTab] = useState<BriefStatus>("new");
  const fresh = briefs.filter((b) => b.status === "new");
  const urgent = fresh.filter((b) => b.urgency === "urgent").length;
  const shown = briefs.filter((b) => b.status === tab);
  return (
    <div className="page-in">
      <Answer kicker={`${fullName(me)} · sample lawyer`}>
        {fresh.length} new {fresh.length === 1 ? "brief" : "briefs"}. {urgent} marked urgent.
      </Answer>
      <p className="muted small">You see only briefs that clients sent to you or that partner clinics routed to you for pro bono. Lawyers cannot browse or contact clients first.</p>

      <div className={s.tabs} role="tablist" aria-label="Filter briefs">
        {TABS.map((x) => {
          const n = briefs.filter((b) => b.status === x.key).length;
          return (
            <button key={x.key} role="tab" aria-selected={tab === x.key} className={s.tab} onClick={() => setTab(x.key)}>
              {x.label} <span className={s.count}>{n}</span>
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <p className={s.empty}>Nothing here.</p>
      ) : (
        <ul className={s.list} role="tabpanel">
          {shown.map((b) => {
            const to = b.addressedTo === "probono-routing" ? "Routed for pro bono" : b.addressedTo && b.addressedTo !== me.id ? `Sent to ${fullName(lawyerById(b.addressedTo)!)}` : null;
            return (
              <li key={b.id} className={s.row}>
                <Link href={`/app/inbox/brief/?id=${b.id}`} className={s.link}>
                  <span className={s.title}>{b.title}</span>
                </Link>
                <ul className={s.chips}>
                  <li className={s.chip}>{PRACTICE[b.category].en}</li>
                  {b.urgency === "urgent" && <li className={`${s.chip} ${s.urgent}`}>Urgent</li>}
                  {b.urgency === "soon" && <li className={`${s.chip} ${s.soon}`}>Soon</li>}
                  {b.proBonoRequested && <li className={`${s.chip} ${s.pb}`}>Pro bono asked</li>}
                  {b.status === "accepted" && <li className={`${s.chip} ${b.acceptedAs === "probono" ? s.pb : ""}`}>Accepted as {b.acceptedAs === "probono" ? "pro bono" : "paid"}</li>}
                  {b.demo && <li className={`${s.chip} ${s.demo}`}>From this demo{to ? ` · ${to}` : ""}</li>}
                </ul>
                <p className={s.meta}>
                  {fmtDate(b.receivedAt)} · Written in {b.language === "fil" ? "Filipino" : "English"} · {b.source === "partner-clinic" ? b.partner : "Sent by the client"}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
