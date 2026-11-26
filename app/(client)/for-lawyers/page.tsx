import Link from "next/link";
import { lawyers, sampleBriefs, sampleHours } from "@/lib/data";
import { summarize } from "@/lib/ulas";
import { demoToday, fmtNum, peso } from "@/lib/demo";
import { account } from "@/lib/data";
import BriefCard from "@/components/BriefCard";
import LawyerCard from "@/components/LawyerCard";
import s from "./lawyers.module.css";

export const metadata = { title: "For lawyers and law firms · APPogado prototype" };

// Lawyer front door: the buyer. English only in the prototype (decision D18).
export default function Page() {
  const sum = summarize(sampleHours, demoToday());
  const brief = sampleBriefs.find((b) => b.id === "b03")!;
  const card = lawyers.find((l) => l.id === "l02")!;
  return (
    <div className="page-in" lang="en">
      <section className={s.hero}>
        <p className={s.kicker}>For lawyers and law firms in the Philippines</p>
        <h1 className={s.title}>Get discovered by the right clients, triage every matter in a minute, and stay ULAS-compliant.</h1>
        <p className={s.lead}>One subscription covers a verified directory listing, one-page case briefs from clients, and tracking for your 60 pro bono hours. Clients never pay. APPogado never takes a share of your fees.</p>
        <div className="btn-row">
          <Link className="btn btn-primary" href="/app/inbox/">Open the lawyer demo</Link>
          <a className="btn" href="#pricing">See pricing</a>
        </div>
      </section>

      <section className={s.job}>
        <div>
          <p className={s.n}>1 · Get discovered</p>
          <h2 className={s.h2}>A listing that is the same for everyone</h2>
          <p className="muted">Clients filter by kind of matter, city, language and years of practice. Every card shows the same verified facts, in alphabetical order. Nobody can pay to be listed higher, so your listing stays within the CPRA rules on advertising.</p>
        </div>
        <div className={s.preview}><LawyerCard lawyer={card} lang="en" /></div>
      </section>

      <section className={s.job}>
        <div>
          <p className={s.n}>2 · Triage in a minute</p>
          <h2 className={s.h2}>Every matter arrives as a one-page brief</h2>
          <p className="muted">Clients describe the problem in English or Filipino. You get the key facts, the kind of matter, how urgent it is, the documents, and the other party&rsquo;s name for your conflict check. Accept as paid or pro bono, ask for more, or decline.</p>
        </div>
        <div className={s.preview}><BriefCard brief={brief} headingLevel={3} /></div>
      </section>

      <section className={s.job}>
        <div>
          <p className={s.n}>3 · Stay ULAS-compliant</p>
          <h2 className={s.h2}>Your 60 hours, counted as you go</h2>
          <p className="muted">Pro bono matters log their hours when you close each appointment. You see your personal minimum, the days left, and a report ready to print. Firms see the pool and who is behind. Partner legal aid clinics can route vetted pro bono matters to you.</p>
        </div>
        <div className={`${s.preview} ${s.ulas}`}>
          <p className={s.ulasLine}>{fmtNum(sum.credited)} of {sum.required} hours. {sum.personalMinimum}-hour personal minimum met. {sum.daysLeft} days left.</p>
          <div className={s.bar}><span style={{ width: `${(sum.credited / sum.required) * 100}%` }} /></div>
          <p className="hint">Sample lawyer. ULAS rules in this prototype are not yet confirmed by a lawyer.</p>
        </div>
      </section>

      <section id="pricing" className={s.pricing}>
        <h2 className={s.h2}>Pricing</h2>
        <div className={s.plans}>
          <div className="panel">
            <h3>Solo practitioner</h3>
            <p className={s.price}>{peso(account.foundingPrice)}<span> a month</span></p>
            <p className="small muted">Founding rate. List price {peso(account.listPrice)} a month.</p>
            <ul className={s.incl}><li>Directory listing</li><li>Case brief inbox</li><li>Personal ULAS tracker and report</li><li>Bookings</li></ul>
          </div>
          <div className="panel">
            <h3>Law firm, 2 or more seats</h3>
            <p className={s.price}>{peso(account.firmPlan.foundingPrice)}<span> per seat a month</span></p>
            <p className="small muted">Founding rate. List price {peso(account.firmPlan.listPrice)} per seat a month.</p>
            <ul className={s.incl}><li>Everything in Solo</li><li>Firm ULAS pool</li><li>Seat management</li><li>Compliance reports for every lawyer</li></ul>
          </div>
        </div>
        <p className="small muted">Monthly, cancel anytime. Prices from the APPogado business plan (Proposal V6).</p>
      </section>

      <section className={`panel ${s.never}`}>
        <h2 className={s.h2}>What APPogado never does</h2>
        <ul>
          <li>Sell placement, badges or a higher spot in the directory.</li>
          <li>Take a commission or any share of your legal fees.</li>
          <li>Let lawyers browse clients or contact them first.</li>
          <li>Present itself as the provider of legal services. Lawyers on APPogado are independent, not its employees.</li>
        </ul>
        <p className="hint">These follow the business plan&rsquo;s reading of the CPRA. A lawyer has not yet reviewed them.</p>
      </section>
    </div>
  );
}
