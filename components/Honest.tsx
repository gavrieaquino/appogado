import s from "./ui.module.css";
export function Honest({ children }: { children: React.ReactNode }) {
  return <div className={s.honest} role="note">{children}</div>;
}
// Answer card (gis-ui-kit): 14 px gold band, eyebrow, the answer as the headline, optional detail below.
export function Answer({ kicker, children, id, after }: { kicker?: React.ReactNode; children: React.ReactNode; id?: string; after?: React.ReactNode }) {
  return (
    <header className={s.answerCard}>
      {kicker && <p className={s.kicker}>{kicker}</p>}
      <h1 className={s.answer} id={id}>{children}</h1>
      {after}
    </header>
  );
}
