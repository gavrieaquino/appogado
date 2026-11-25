"use client";
import { useRef, useState } from "react";
import { verificationQueue } from "@/lib/data";
import { PRACTICE } from "@/lib/practice";
import { DEMO_TODAY, fmtDate } from "@/lib/demo";
import { useDemo } from "@/lib/store";
import { Answer, Honest } from "@/components/Honest";
import s from "./verification.module.css";

// Mock of the manual check against the SC Law List (open item M6). Reject is secondary and confirmed.
export default function Verification() {
  const [state, set] = useDemo();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [target, setTarget] = useState<string | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const pending = verificationQueue.filter((v) => !state.verified[v.id]);
  const mark = (id: string, v: "approved" | "rejected") => set((x) => ({ ...x, verified: { ...x.verified, [id]: v } }));

  return (
    <div className="page-in">
      <Answer kicker="Admin · mock">{pending.length} {pending.length === 1 ? "lawyer waits" : "lawyers wait"} for verification.</Answer>
      <Honest>
        <p>The Supreme Court Law List is public but searched by hand, and reportedly incomplete. There is no bulk or API access, so each check is manual. If a lawyer is missing from the list, ask the Office of the Bar Confidant in writing before rejecting. All applicants here are sample records.</p>
      </Honest>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th scope="col">Applicant</th><th scope="col">Roll no.</th><th scope="col">IBP ID</th><th scope="col">Practice areas</th><th scope="col">Submitted</th><th scope="col">SC Law List</th><th scope="col">Decision</th></tr></thead>
          <tbody>
            {verificationQueue.map((v) => {
              const done = state.verified[v.id];
              return (
                <tr key={v.id}>
                  <td>{v.name}</td><td>{v.rollNo}</td><td>{v.ibpId}</td>
                  <td>{v.practiceAreas.map((a) => PRACTICE[a].en).join(", ")}</td>
                  <td>{fmtDate(v.submittedOn)}</td>
                  <td>
                    <label className={s.check}>
                      <input type="checkbox" disabled={!!done} checked={!!checked[v.id] || done === "approved"} onChange={(e) => setChecked({ ...checked, [v.id]: e.target.checked })} />
                      Name and roll no. found, status Active
                    </label>
                    {checked[v.id] && !done && <span className="hint">Checked {fmtDate(DEMO_TODAY)}</span>}
                  </td>
                  <td>
                    {done ? (
                      <span className={done === "approved" ? s.ok : s.no}>{done === "approved" ? `Verified ${fmtDate(DEMO_TODAY)}` : "Rejected"}</span>
                    ) : (
                      <div className={s.actions}>
                        <button className="btn btn-primary" disabled={!checked[v.id]} onClick={() => mark(v.id, "approved")}>Approve</button>
                        <button className="btn btn-quiet btn-danger" onClick={() => { setTarget(v.id); dlg.current?.showModal(); }}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="hint">Approve stays off until the Law List check is ticked. Verified lawyers are re-checked once a year.</p>

      <dialog ref={dlg} className={s.dialog} onClose={() => setTarget(null)}>
        <form method="dialog">
          <h2 className={s.h2}>Reject {verificationQueue.find((v) => v.id === target)?.name}?</h2>
          <p className="small">They will not appear in the directory. They can apply again with corrected details.</p>
          <div className="btn-row">
            <button className="btn" value="cancel">Keep in queue</button>
            <button className="btn btn-danger" value="reject" onClick={() => target && mark(target, "rejected")}>Reject</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
