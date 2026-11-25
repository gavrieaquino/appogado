"use client";
import { useEffect, useRef, useState } from "react";
import s from "./BottomSheet.module.css";

// Phone-only bottom sheet (LAMBAT pattern). The peek is the answer line, always visible.
// Drag with velocity: a flick over 0.4 px/ms decides direction, otherwise snap to the nearer state.
// On desktop the same content renders inline in a side column.
export default function BottomSheet({ peek, children, openLabel, closeLabel }: { peek: React.ReactNode; children: React.ReactNode; openLabel: string; closeLabel: string }) {
  const [open, setOpen] = useState(false);
  const [drag, setDrag] = useState<number | null>(null);
  const start = useRef<{ y: number; t: number } | null>(null);
  const moved = useRef(false);
  const body = useRef<HTMLDivElement>(null);
  useEffect(() => { if (body.current) body.current.inert = !open; }, [open]);

  const onDown = (e: React.PointerEvent) => { start.current = { y: e.clientY, t: performance.now() }; moved.current = false; (e.target as Element).setPointerCapture?.(e.pointerId); };
  const onMove = (e: React.PointerEvent) => {
    if (!start.current) return;
    const dy = e.clientY - start.current.y;
    if (Math.abs(dy) > 4) moved.current = true;
    setDrag(dy);
  };
  const onUp = (e: React.PointerEvent) => {
    if (!start.current) return;
    const dy = e.clientY - start.current.y;
    const v = dy / Math.max(1, performance.now() - start.current.t);
    start.current = null;
    setDrag(null);
    if (!moved.current) return;
    if (Math.abs(v) > 0.4) setOpen(v < 0);
    else setOpen(open ? dy < 80 : dy < -80);
  };

  return (
    <section className={s.sheet} data-open={open || undefined} style={drag !== null ? { transform: `translateY(${drag}px)`, transition: "none" } : undefined}>
      <button type="button" className={s.handle} aria-expanded={open}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}
        onClick={() => { if (!moved.current) setOpen((o) => !o); }}>
        <span className={s.grip} aria-hidden />
        <span className={s.handleText}>{open ? closeLabel : openLabel}</span>
      </button>
      <div className={s.peek}>{peek}</div>
      <div ref={body} className={s.body}>{children}</div>
    </section>
  );
}
