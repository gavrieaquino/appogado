import Link from "next/link";
import { account, fullName, me } from "@/lib/data";
import { fmtDate, peso } from "@/lib/demo";
import { Answer } from "@/components/Honest";
import s from "./account.module.css";

export const metadata = { title: "Account · APPogado for lawyers (prototype)" };

export default function Page() {
  return (
    <div className="page-in">
      <Answer kicker={`${fullName(me)} · member since ${fmtDate(account.memberSince)}`}>
        {account.plan} plan at the founding rate of {peso(account.foundingPrice)} a month, until {fmtDate(account.foundingUntil)}.
      </Answer>
      <div className={s.cols}>
        <section className="panel">
          <h2 className={s.h2}>Your plan</h2>
          <dl className={s.dl}>
            <div><dt>Plan</dt><dd>{account.plan} practitioner, 1 seat</dd></div>
            <div><dt>Price</dt><dd>{peso(account.foundingPrice)} a month (founding rate). List price {peso(account.listPrice)}.</dd></div>
            <div><dt>Founding rate ends</dt><dd>{fmtDate(account.foundingUntil)} (sample date)</dd></div>
            <div><dt>Billing</dt><dd>{account.billing}. Next bill {fmtDate(account.nextBill)}.</dd></div>
          </dl>
          <div className="btn-row">
            <button className="btn" disabled title="Prototype">Cancel subscription</button>
          </div>
          <p className="hint">Prototype: no payment details are collected or stored.</p>
        </section>
        <section className="panel">
          <h2 className={s.h2}>Seats for a firm</h2>
          <p className="small">A firm plan is {peso(account.firmPlan.listPrice)} per seat a month (founding rate {peso(account.firmPlan.foundingPrice)}). It adds the firm pool for ULAS hours and compliance reports for every lawyer.</p>
          <table className="table">
            <thead><tr><th scope="col">Seat</th><th scope="col">Lawyer</th><th scope="col">Status</th></tr></thead>
            <tbody><tr><td>1</td><td>{fullName(me)}</td><td>Active</td></tr></tbody>
          </table>
          <div className="btn-row" style={{ marginTop: "var(--s-3)" }}><button className="btn" disabled title="Prototype">Add a seat</button></div>
        </section>
      </div>
      <section className={`panel ${s.public}`}>
        <h2 className={s.h2}>What clients see</h2>
        <p className="small">Your plan, price and billing are never shown on your public profile. Every lawyer&rsquo;s card in the directory looks the same and is listed by surname, whatever they pay. You cannot pay to be listed higher.</p>
        <Link className="btn" href={`/find/${me.id}/`}>View my public profile</Link>
      </section>
    </div>
  );
}
