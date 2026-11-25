import { firm } from "@/lib/data";
import { firmSummary, ULAS_CONFIG } from "@/lib/ulas";
import { Answer, Honest } from "@/components/Honest";
import UlasMeter from "@/components/UlasMeter";
import s from "./firm.module.css";

export const metadata = { title: "Firm view · APPogado for lawyers (prototype)" };

export default function Page() {
  const f = firmSummary(firm.members);
  const min = ULAS_CONFIG.personalMinimum.value;
  return (
    <div className="page-in">
      <Answer kicker={`${firm.name} · ${firm.members.length} lawyers`}>
        {f.behind.length} of {f.covered} covered lawyers have not met the {min}-hour personal minimum. Firm pool: {f.rendered} of {f.required} hours.
      </Answer>
      <Honest>
        <p>The firm pool is {ULAS_CONFIG.minimumHours.value} hours for each covered lawyer. Each lawyer must still give {min} hours personally; the firm cannot cover those. These rules are unconfirmed. This view uses a separate sample firm; the demo lawyer is a solo practitioner.</p>
      </Honest>
      <UlasMeter value={f.rendered} max={f.required} label="Firm pool hours" />
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th scope="col">Lawyer</th><th scope="col" className="num">Service hours</th><th scope="col">Personal minimum ({min} h)</th></tr></thead>
          <tbody>
            {[...firm.members].sort((a, b) => Number(!!a.exempt) - Number(!!b.exempt) || a.serviceHours - b.serviceHours).map((m) => (
              <tr key={m.name}>
                <td>{m.name}</td>
                <td className="num">{m.exempt ? "–" : m.serviceHours}</td>
                <td>{m.exempt
                  ? <span className={s.exempt}>Not covered: {m.exempt.toLowerCase()} (unconfirmed rule)</span>
                  : m.serviceHours >= min ? <span className={s.met}>Met</span> : <span className={s.behind}>Behind by {min - m.serviceHours} hours</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
