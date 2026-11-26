"use client";
// Phone bottom sheet with three snap points (peek / half / full), after Apple Maps and Material 3
// bottom sheets (decision D31). Peek shows the answer; half shows the answer plus the first items;
// full scrolls. The sheet expands before its content scrolls. A flick (> 0.4 px/ms) carries the sheet
// to the next snap in that direction; otherwise it lands on the nearest one. The handle is a button:
// tap or Enter cycles peek → half → full → peek. Motion: spatial spring; instant under reduced motion.
// When `enabled` is false (desktop) it renders a plain container with the same children.
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import s from "./SnapSheet.module.css";

export type Snap = "peek" | "half" | "full";
type Props = {
  enabled: boolean;
  peek: number;                // visible height at peek, handle included
  half?: number;               // share of the full height visible at half
  snap: Snap;
  onSnap: (s: Snap) => void;
  onVisible?: (px: number) => void; // visible height, for map padding and floating controls
  labels: Record<Snap, string>;     // what tapping the handle will do from each snap
  className?: string;
  ariaLabel: string;
  children: React.ReactNode;
};
const ORDER: Snap[] = ["peek", "half", "full"];

export default function SnapSheet({ enabled, peek, half = 0.55, snap, onSnap, onVisible, labels, className, ariaLabel, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [h, setH] = useState(600);
  const [drag, setDrag] = useState<number | null>(null);
  const start = useRef<{ y: number; t: number; base: number; moved: boolean } | null>(null);

  useLayoutEffect(() => {
    const el = ref.current?.parentElement;
    if (!el || !enabled) return;
    const fit = () => setH(Math.round(el.clientHeight * 0.92));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [enabled]);

  // Half shows the peek plus room for the first items (about 260 px), never less than `half` of the sheet.
  const y = (sn: Snap) => (sn === "full" ? 0 : sn === "half" ? Math.max(60, h - Math.max(peek + 260, h * half)) : Math.max(0, h - peek));
  const visible = h - (drag ?? y(snap));
  useEffect(() => { if (enabled && drag === null) onVisible?.(h - y(snap)); }, [enabled, snap, h, peek, drag]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (snap !== "full" && ref.current) ref.current.scrollTop = 0; }, [snap]);

  if (!enabled) return <aside ref={ref} className={className} aria-label={ariaLabel}>{children}</aside>;

  const onDown = (e: React.PointerEvent) => { start.current = { y: e.clientY, t: performance.now(), base: y(snap), moved: false }; (e.currentTarget as Element).setPointerCapture?.(e.pointerId); };
  const onMove = (e: React.PointerEvent) => {
    const st = start.current; if (!st) return;
    const dy = e.clientY - st.y; if (Math.abs(dy) > 4) st.moved = true;
    setDrag(Math.min(h - 48, Math.max(0, st.base + dy)));
  };
  const onUp = (e: React.PointerEvent) => {
    const st = start.current; start.current = null;
    if (!st) return;
    const pos = drag ?? st.base; setDrag(null);
    if (!st.moved) return;
    (e.currentTarget as HTMLElement).dataset.dragged = "1";
    const v = (e.clientY - st.y) / Math.max(1, performance.now() - st.t); // px/ms, + is down
    const i = ORDER.indexOf(snap);
    if (Math.abs(v) > 0.4) return onSnap(ORDER[Math.min(2, Math.max(0, i + (v < 0 ? 1 : -1)))]);
    onSnap(ORDER.reduce((a, b) => (Math.abs(y(b) - pos) < Math.abs(y(a) - pos) ? b : a)));
  };
  const cycle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = e.currentTarget; if (el.dataset.dragged) { delete el.dataset.dragged; return; }
    onSnap(ORDER[(ORDER.indexOf(snap) + 1) % 3]);
  };

  return (
    <aside ref={ref} className={`${className ?? ""} ${s.sheet}`} data-snap={snap} aria-label={ariaLabel}
      style={{ height: h, transform: `translateY(${drag ?? y(snap)}px)`, transition: drag !== null ? "none" : undefined, overflowY: snap === "full" && drag === null ? "auto" : "hidden", "--visible": `${visible}px` } as React.CSSProperties}>
      <button type="button" className={s.handle} aria-expanded={snap !== "peek"} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onClick={cycle}>
        <span className={s.grip} aria-hidden />
        <span className={s.handleT}>{labels[snap]}</span>
      </button>
      {children}
    </aside>
  );
}
