"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { resetDemo } from "@/lib/store";
import { useT, type Key } from "@/lib/i18n";
import { DEMO_TODAY, fmtDate } from "@/lib/demo";
import LangToggle from "./LangToggle";
import Icon, { type IconName } from "./Icon";
import s from "./Shell.module.css";

export type NavItem = { href: string; label: Key | string; short?: Key | string; icon: IconName };
type Props = { audience: "client" | "lawyer" | "admin"; items: NavItem[]; children: React.ReactNode };

const isActive = (path: string, href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(href));
const WORD = "APPogado".split("");
// Pages that own the whole viewport (map-first). Everything else is a document page.
const FULL_BLEED = ["/find/"];

// Shell from the gis-ui-kit (LAMBAT base.css .nav + app.js mountNav): brand-colour rail with icon
// and label items, one sliding indicator with a gold tick, collapsible and remembered; on phones a
// brand-colour tab bar. Labels always show (vision principle 7: icons alone are not enough).
export default function Shell({ audience, items, children }: Props) {
  const path = usePathname() || "/";
  const { t } = useT();
  const label = (l: string) => (l.includes(".") ? t(l as Key) : l);
  const listRef = useRef<HTMLUListElement>(null);
  const indRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(true);
  const [weaving, setWeaving] = useState(0);
  const activeIndex = items.findIndex((i) => isActive(path, i.href));
  const full = FULL_BLEED.includes(path);

  useEffect(() => {
    try { if (localStorage.getItem("appogado.nav") === "closed") setOpen(false); } catch { /* storage blocked */ }
  }, []);
  useEffect(() => { document.documentElement.dataset.nav = open ? "open" : "closed"; }, [open]);

  const place = useCallback(() => {
    const ind = indRef.current, ul = listRef.current;
    const a = ul?.querySelectorAll<HTMLElement>("a[data-nav]")[activeIndex];
    if (!ind || !ul) return;
    if (!a) { ind.style.opacity = "0"; return; }
    const u = ul.getBoundingClientRect(), r = a.getBoundingClientRect();
    ind.style.opacity = "1";
    ind.style.width = `${r.width}px`;
    ind.style.height = `${r.height}px`;
    ind.style.transform = `translate(${r.left - u.left}px, ${r.top - u.top}px)`;
  }, [activeIndex]);

  useLayoutEffect(() => {
    place();
    const ro = "ResizeObserver" in window ? new ResizeObserver(place) : null;
    if (listRef.current) ro?.observe(listRef.current);
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place).catch(() => {});
    return () => { ro?.disconnect(); window.removeEventListener("resize", place); };
  }, [place, open]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) setWeaving((w) => w + 1);
    try { localStorage.setItem("appogado.nav", next ? "open" : "closed"); } catch { /* ignore */ }
    setTimeout(() => window.dispatchEvent(new Event("resize")), 260);
  };

  const other = audience === "client"
    ? { href: "/app/inbox/", text: t("foot.lawyerSide"), short: t("foot.lawyerSideShort") }
    : { href: "/", text: "Prototype: see the client side", short: "Client side (demo)" };

  return (
    <div className={s.app} data-full={full || undefined}>
      <nav className={`${s.nav} no-print`} aria-label="Main">
        <div className={s.head}>
          <Link href={audience === "client" ? "/" : "/app/inbox/"} className={s.brand} aria-label="APPogado home">
            <span className={s.mark} aria-hidden>A</span>
            <span className={s.words}>
              <span className={s.word} key={weaving} aria-hidden>
                {WORD.map((c, i) => <span key={i} className={s.ltr} style={{ "--i": i } as React.CSSProperties}>{c}</span>)}
              </span>
              {audience !== "client" && <span className={s.sub}>{audience === "admin" ? "Admin" : "for lawyers"}</span>}
            </span>
          </Link>
          <button type="button" className={s.toggle} onClick={toggle} aria-expanded={open} aria-label={open ? "Collapse the sidebar" : "Expand the sidebar"}>
            <Icon name="chev" />
          </button>
        </div>
        <ul ref={listRef} className={s.list}>
          <span ref={indRef} className={s.ind} aria-hidden />
          {items.map((i, n) => (
            <li key={i.href}>
              <Link href={i.href} data-nav className={s.item} aria-current={n === activeIndex ? "page" : undefined} title={label(i.label)}>
                <Icon name={i.icon} />
                <span className={s.full}>{label(i.label)}</span>
                <span className={s.short}>{label(i.short ?? i.label)}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className={s.foot}>
          <div className={s.lang}><LangToggle compact tone="brand" /></div>
          <Link href={other.href} className={s.item} title={other.text}><Icon name="swap" /><span className={s.full}>{other.short}</span></Link>
          <button type="button" className={s.item} title={t("foot.reset")}
            onClick={() => { resetDemo(); window.location.assign(audience === "client" ? "/" : "/app/inbox/"); }}>
            <Icon name="reset" /><span className={s.full}>{t("foot.reset")}</span>
          </button>
          <p className={s.meta}>Demo date {fmtDate(DEMO_TODAY)}</p>
        </div>
      </nav>
      <div className={s.view}>
        {!full && (
          <div className={`${s.topline} no-print`}>
            <p className={s.sample} role="note">{t("sample.banner")}</p>
            <span className={s.phoneLang}><LangToggle compact /></span>
          </div>
        )}
        <main id="main" tabIndex={-1} className={full ? s.mainFull : s.main}>{children}</main>
        {!full && (
          <footer className={`${s.pageFoot} no-print`}>
            <Link href={other.href}>{other.text}</Link>
            <button type="button" className="btn-quiet" onClick={() => { resetDemo(); window.location.assign(audience === "client" ? "/" : "/app/inbox/"); }}>{t("foot.reset")}</button>
            <span>Demo date {fmtDate(DEMO_TODAY)}</span>
            <span>{t("foot.draft")}</span>
          </footer>
        )}
      </div>
    </div>
  );
}
