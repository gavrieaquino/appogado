import s from "./ui.module.css";

// Inline status pill (adapted from LAMBAT's status island). The visual pill is aria-hidden;
// a separate live region announces the step, so screen readers hear real changes only.
export default function StatusPill({ step, total, text, stepLabel }: { step: number; total: number; text: string; stepLabel: string }) {
  const c = 2 * Math.PI * 11;
  return (
    <>
      <div className={s.pill} aria-hidden>
        <svg className={s.ring} viewBox="0 0 28 28">
          <circle className={s.ringTrack} cx="14" cy="14" r="11" fill="none" strokeWidth="3" />
          <circle className={s.ringBar} cx="14" cy="14" r="11" fill="none" strokeWidth="3" strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={c * (1 - step / total)} transform="rotate(-90 14 14)" />
        </svg>
        <span className={s.pillText}><span className={s.pillStep}>{stepLabel}</span>{text}</span>
      </div>
      <p className="sr-only" aria-live="polite">{stepLabel}: {text}</p>
    </>
  );
}
