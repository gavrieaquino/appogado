"use client";
import { useEffect, useRef, useState } from "react";
import { fmtNum } from "@/lib/demo";
import s from "./UlasMeter.module.css";

// Bar to the requirement with a marker at the personal minimum. The number counts up
// (600 ms, ease-out) from the value on screen; the real value is always in the DOM for screen readers.
export default function UlasMeter({ value, max, marker, markerLabel, label }: { value: number; max: number; marker?: number; markerLabel?: string; label: string }) {
  const [shown, setShown] = useState(value);
  const from = useRef(0);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setShown(value); from.current = value; return; }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 600);
      const v = a + (value - a) * (1 - Math.pow(1 - p, 3));
      setShown(v);
      from.current = v;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 100;
  return (
    <div className={s.meter}>
      <p className={s.num}>
        <span aria-hidden>{fmtNum(Math.round(shown * 10) / 10)}</span>
        <span className="sr-only">{fmtNum(value)}</span>
        <span className={s.of}> of {max} hours</span>
      </p>
      <div className={s.track} role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
        <div className={s.bar} style={{ width: `${pct}%` }} />
        {marker !== undefined && max > 0 && (
          <div className={s.marker} style={{ left: `${(marker / max) * 100}%` }}>
            <span className={s.markerLabel}>{markerLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
