"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useBriefs } from "@/lib/useLawyer";
import { decide } from "@/lib/actions";
import { update } from "@/lib/store";
import { translate } from "@/lib/i18n";
import BriefCard from "@/components/BriefCard";
import BottomSheet from "@/components/BottomSheet";
import Term from "@/components/Term";
import s from "./brief.module.css";

type Conflict = "none" | "yes" | "unsure" | null;
const REASONS = ["Conflict of interest", "Outside my practice areas", "No capacity right now", "Other"];

export default function BriefView() {
  const id = useSearchParams().get("id") ?? "";
  const brief = useBriefs().find((b) => b.id === id);
  const [conflict, setConflict] = useState<Conflict>(null);
  const [mode, setMode] = useState<"ask" | "decline" | null>(null);
  const [reason, setReason] = useState(REASONS[1]);
  const [ask, setAsk] = useState("");
  const [askError, setAskError] = useState(false);
  const conflictRef = useRef<HTMLFieldSetElement>(null);
  // Accept stays locked until the conflict check (rule C10), but remains focusable and
  // explains itself on click instead of being a dead, unfocusable button.
  const tryAccept = (as: "paid" | "probono") => {
    if (conflict !== "none") { conflictRef.current?.querySelector("input")?.focus(); return; }
    decide(brief!, { status: "accepted", acceptedAs: as });
  };

  if (!brief) {
    return (
      <div className="stack">
        <h1>Brief not found</h1>
        <p className="muted">It may have been sent in another browser. Demo data stays in the browser that made it.</p>
        <Link className="btn" href="/app/inbox/">Back to inbox</Link>
      </div>
    );
  }

  const decided = brief.status !== "new";
  const status =
    brief.status === "accepted" ? `You accepted this as ${brief.acceptedAs === "probono" ? "pro bono" : "a paid matter"}.` :
    brief.status === "declined" ? `You declined this brief${brief.declineReason ? `: ${brief.declineReason.toLowerCase()}` : ""}.` :
    brief.status === "more-info" ? "You asked the client for more information." :
    "Decide on this brief: accept, ask for more, or decline.";

  const panel = decided ? (
    <div className="stack">
      {brief.status === "accepted" && (
        <p className="small">{brief.acceptedAs === "probono"
          ? "This matter now appears in Bookings to schedule. Hours you log when you close each appointment count toward your ULAS hours."
          : "You agree the fee with the client, and they pay you directly. APPogado takes no share."}</p>
      )}
      <div className="btn-row">
        {brief.status === "accepted" && <Link className="btn btn-primary" href="/app/bookings/">Go to bookings</Link>}
        <button className="btn btn-quiet" onClick={() => update((x) => { const d = { ...x.decisions }; d[brief.id] = { status: "new" }; return { ...x, decisions: d }; })}>Undo (demo)</button>
      </div>
    </div>
  ) : (
    <div className="stack">
      <fieldset className={s.conflict} ref={conflictRef}>
        <legend className="label">Check for a <Term def={translate("en", "t.conflict")}>conflict of interest</Term></legend>
        <p className="small">Other side named in this brief: <strong>{brief.otherParty}</strong>. Do you or your office act for this person, or have a personal link to them?</p>
        {([["none", "No conflict"], ["yes", "Yes, there is a conflict"], ["unsure", "Not sure yet"]] as const).map(([v, l]) => (
          <label key={v} className={s.radio}>
            <input type="radio" name="conflict" checked={conflict === v} onChange={() => { setConflict(v); if (v === "yes") { setMode("decline"); setReason(REASONS[0]); } }} />
            {l}
          </label>
        ))}
      </fieldset>

      {conflict !== "none" && <p className={s.lock} role="status" id="accept-lock">{conflict === "yes" ? "You cannot accept a matter with a conflict. Decline it below; the client can choose someone else." : "Accept unlocks once you confirm there is no conflict."}</p>}

      <div className={s.accept}>
        <button className="btn btn-primary" aria-disabled={conflict !== "none" || undefined} aria-describedby={conflict !== "none" ? "accept-lock" : undefined} onClick={() => tryAccept("paid")}>Accept as a paid matter</button>
        <button className="btn btn-primary" aria-disabled={conflict !== "none" || undefined} aria-describedby={conflict !== "none" ? "accept-lock" : undefined} onClick={() => tryAccept("probono")}>Accept as pro bono</button>
        <p className="hint">Pro bono matters count toward your ULAS hours. For paid matters the client pays you directly.</p>
      </div>

      <div className="btn-row">
        <button className="btn" aria-expanded={mode === "ask"} onClick={() => setMode(mode === "ask" ? null : "ask")}>Ask for more information</button>
        <button className="btn" aria-expanded={mode === "decline"} onClick={() => setMode(mode === "decline" ? null : "decline")}>Decline</button>
      </div>

      {mode === "ask" && (
        <form className="stack" noValidate onSubmit={(e) => { e.preventDefault(); if (ask.trim().length < 3) { setAskError(true); document.getElementById("ask")?.focus(); return; } decide(brief, { status: "more-info" }); }}>
          <div className="field">
            <label htmlFor="ask">What do you need from the client?</label>
            <p className="hint" id="ask-hint">For example: a photo of the notice, and the date the client received it.</p>
            <textarea id="ask" className="textarea" style={{ minHeight: 100 }} value={ask} aria-invalid={askError || undefined} aria-describedby={askError ? "ask-hint ask-error" : "ask-hint"}
              onChange={(e) => { setAsk(e.target.value); if (askError) setAskError(false); }} />
            {askError && <p className="error" role="alert" id="ask-error">Write what you need from the client.</p>}
          </div>
          <button className="btn" type="submit">Send question</button>
        </form>
      )}
      {mode === "decline" && (
        <form className="stack" onSubmit={(e) => { e.preventDefault(); decide(brief, { status: "declined", declineReason: reason }); }}>
          <div className="field">
            <label htmlFor="reason">Reason (the client sees a general message, not this reason)</label>
            <select id="reason" className="select" value={reason} onChange={(e) => setReason(e.target.value)}>
              {REASONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <button className="btn btn-danger" type="submit">Decline this brief</button>
        </form>
      )}
    </div>
  );

  return (
    <div className={`page-in ${s.grid}`}>
      <div>
        <p className="no-print"><Link href="/app/inbox/">← Inbox</Link></p>
        <BriefCard brief={brief} showReceived />
        <div className="btn-row no-print" style={{ marginTop: "var(--s-3)" }}>
          <button className="btn" onClick={() => window.print()}>Print brief</button>
        </div>
      </div>
      <div className={`${s.side} no-print`}>
        <BottomSheet peek={<p className={s.peek} aria-live="polite">{status}</p>} openLabel="Show decision" closeLabel="Hide decision">
          {panel}
        </BottomSheet>
      </div>
    </div>
  );
}
