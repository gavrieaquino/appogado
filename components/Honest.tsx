import s from "./ui.module.css";
export function Honest({ children }: { children: React.ReactNode }) {
  return <div className={s.honest} role="note">{children}</div>;
}
export function Answer({ kicker, children, id }: { kicker?: React.ReactNode; children: React.ReactNode; id?: string }) {
  return (
    <header>
      {kicker && <p className={s.kicker}>{kicker}</p>}
      <h1 className={s.answer} id={id}>{children}</h1>
    </header>
  );
}
