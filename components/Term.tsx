"use client";
import { useId, useRef } from "react";
import s from "./Term.module.css";

// The term itself is the button (LAMBAT "? terms"). The popover opens below the line it
// explains, so it never covers the sentence. Native Popover API: Esc and outside tap close it.
export default function Term({ children, def }: { children: React.ReactNode; def: string }) {
  const id = useId().replace(/:/g, "");
  const btn = useRef<HTMLButtonElement>(null);
  const pop = useRef<HTMLDivElement>(null);
  const place = () => {
    const b = btn.current?.getBoundingClientRect();
    const p = pop.current;
    if (!b || !p) return;
    const w = Math.min(320, window.innerWidth - 32);
    p.style.width = `${w}px`;
    p.style.left = `${Math.max(16, Math.min(b.left, window.innerWidth - w - 16))}px`;
    const below = b.bottom + 10;
    const h = p.offsetHeight || 120;
    p.style.top = `${below + h > window.innerHeight - 8 ? Math.max(8, b.top - h - 10) : below}px`;
  };
  return (
    <>
      <button ref={btn} type="button" className={s.term} popoverTarget={id} onClick={() => requestAnimationFrame(place)}>
        {children}<span className={s.q} aria-hidden>?</span>
      </button>
      <div ref={pop} id={id} popover="auto" className={s.pop} role="tooltip"
        onToggle={(e) => { if ((e as unknown as ToggleEvent).newState === "open") place(); }}>
        {def}
      </div>
    </>
  );
}
