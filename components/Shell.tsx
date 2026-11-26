"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { resetDemo } from "@/lib/store";
import { useT, type Key } from "@/lib/i18n";
import { DEMO_TODAY, fmtDate } from "@/lib/demo";
import LangToggle from "./LangToggle";
import s from "./Shell.module.css";

export type NavItem = { href: string; label: Key | string; short?: string };
type Props = { audience: "client" | "lawyer" | "admin"; items: NavItem[]; children: React.ReactNode };

const isActive = (path: string, href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(href));

// One shell for both front doors: a labelled rail on desktop, a labelled tab bar on phones
// (vision principle 7: icons alone are not enough). The active indicator slides between items.
export default function Shell({ audience, items, children }: Props) {
  const path = usePathname() || "/";
  const { t } = useT();
  const label = (l: string) => (l.includes(".") ? t(l as Key) : l);
  const listRef = useRef<HTMLUListElement>(null);
  const [ind, setInd] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const activeIndex = items.findIndex((i) => isActive(path, i.href));

  useLayoutEffect(() => {
    const place = () => {
      const el = listRef.current?.querySelectorAll<HTMLElement>("[data-nav]")[activeIndex];
      if (!el) return setInd(null);
      setInd({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });
    };
    place();
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place).catch(() => {});
    return () => window.removeEventListener("resize", place);
  }, [activeIndex, path]);

  const other = audience === "client"
    ? { href: "/app/inbox/", text: t("foot.lawyerSide") }
    : { href: "/", text: "Prototype: see the client side" };

  return (
    <div className={s.shell} data-audience={audience}>
      <header className={`${s.rail} no-print`}>
        <div className={s.top}>
          <Link href={audience === "client" ? "/" : "/app/inbox/"} className={s.brand}>
            APPogado{audience !== "client" && <span className={s.sub}>{audience === "admin" ? "Admin" : "for lawyers"}</span>}
          </Link>
          <LangToggle compact />
        </div>
        <nav aria-label="Main" className={s.nav}>
          <ul ref={listRef} className={s.list}>
            {ind && <li aria-hidden className={s.ind} style={{ transform: `translate(${ind.x}px, ${ind.y}px)`, width: ind.w, height: ind.h }} />}
            {items.map((i, n) => (
              <li key={i.href} data-nav>
                <Link href={i.href} className={s.link} aria-current={n === activeIndex ? "page" : undefined}>
                  <span className={s.full}>{label(i.label)}</span>
                  <span className={s.short}>{i.short ?? label(i.label)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <div className={s.body}>
        <p className={`${s.banner} no-print`} role="note">{t("sample.banner")}</p>
        <main id="main" className={s.main}>{children}</main>
        <footer className={`${s.foot} no-print`}>
          <Link href={other.href}>{other.text}</Link>
          <button type="button" className={s.reset} onClick={() => { resetDemo(); window.location.assign(audience === "client" ? "/" : "/app/inbox/"); }}>{t("foot.reset")}</button>
          <span>Demo date {fmtDate(DEMO_TODAY)}</span>
          <span>{t("foot.draft")}</span>
        </footer>
      </div>
    </div>
  );
}
