"use client";
import { useEffect, useRef } from "react";

// Rolling number (LAMBAT home.js rollNumbers): counts up with a cubic ease-out when it scrolls into
// view. The animated copy is aria-hidden; an sr-only twin holds the real value, and the animated
// copy is reset to the final value if the animation is cut short.
export default function RollNumber({ value, format = (n) => n.toLocaleString("en-PH") }: { value: number; format?: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const final = format(value);
    el.textContent = final;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    let raf = 0;
    const settle = () => { cancelAnimationFrame(raf); el.textContent = final; };
    const io = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting)) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / 700);
        el.textContent = format(Math.round(value * (1 - (1 - k) ** 3)));
        if (k < 1) raf = requestAnimationFrame(tick); else settle();
      };
      el.textContent = format(0);
      raf = requestAnimationFrame(tick);
      setTimeout(settle, 1000);
    }, { threshold: 0.6 });
    io.observe(el);
    const onHide = () => { if (document.hidden) settle(); };
    document.addEventListener("visibilitychange", onHide);
    return () => { io.disconnect(); settle(); document.removeEventListener("visibilitychange", onHide); };
  }, [value, format]);
  return <><span ref={ref} aria-hidden>{format(value)}</span><span className="sr-only">{format(value)}</span></>;
}
