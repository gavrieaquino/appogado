"use client";
// Map-first "Near you" page for the Quezon City pilot (decision D29), built on the gis-ui-kit
// map page: full-bleed map, a 380 px card column (answer card → sections → office list → legend),
// a status island over the map, a More options drawer, and on phones the column becomes a bottom
// sheet whose peek is exactly the answer card. Location rules (D21): GPS only on tap, kept in page
// memory, never stored or put in the URL; a chosen barangay may go in the URL.
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { fullName, lawyers, offices, pilotArea, places } from "@/lib/data";
import { search, type Filters } from "@/lib/directory";
import { distanceKm, fmtKm, inBounds } from "@/lib/geo";
import { AVAILABILITY, LANGUAGES, PRACTICE, PRACTICE_KEYS } from "@/lib/practice";
import { useT } from "@/lib/i18n";
import { resetDemo, useDemo } from "@/lib/store";
import type { LanguageCode, LatLng, PracticeArea } from "@/lib/types";
import Term from "@/components/Term";
import Icon from "@/components/Icon";
import LangToggle from "@/components/LangToggle";
import type { MapRow } from "@/components/OfficeMap";
import s from "./map.module.css";

const OfficeMap = dynamic(() => import("@/components/OfficeMap"), { ssr: false });

type From = LatLng & { source: "gps" | "place"; label: string; accuracy?: number };
const YEARS = [3, 5, 10, 15];

export default function MapPage() {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const { t, lang } = useT();
  const [state] = useDemo();

  const [gps, setGps] = useState<From | null>(null);
  const [status, setStatus] = useState<"idle" | "asking" | "denied" | "outside">("idle");
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const f: Filters = {
    area: (params.get("area") as PracticeArea) || undefined,
    lang: (params.get("lang") as LanguageCode) || undefined,
    minYears: params.get("years") ? Number(params.get("years")) : undefined,
  };
  const place = places.find((p) => p.name === params.get("near"));
  const from: From | null = gps ?? (place ? { lat: place.lat, lng: place.lng, source: "place", label: place.name } : null);

  const setParams = useCallback((changes: Record<string, string>) => {
    const p = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(changes)) { if (v) p.set(k, v); else p.delete(k); }
    router.replace(`${path}${p.size ? `?${p}` : ""}`, { scroll: false });
  }, [params, path, router]);

  const useGps = () => {
    if (!("geolocation" in navigator)) { setStatus("denied"); return; }
    setStatus("asking");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (!inBounds(p, pilotArea.bounds)) { setStatus("outside"); setGps(null); return; }
        setStatus("idle");
        setGps({ ...p, source: "gps", label: "", accuracy: Math.round(pos.coords.accuracy) });
        setParams({ near: "" });
      },
      () => setStatus("denied"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  };
  const chooseArea = (name: string) => { setGps(null); setStatus("idle"); setParams({ near: name }); };
  const stopLocation = () => { setGps(null); setStatus("idle"); setParams({ near: "" }); };

  // Data: lawyers that match the filters, grouped by office; offices ordered by distance when a
  // location is set, else by name. Closed lawyers never count as a match for "nearest".
  const matched = useMemo(() => search(lawyers, f).filter((l) => l.availability !== "closed"), [f.area, f.lang, f.minYears]); // eslint-disable-line react-hooks/exhaustive-deps
  const rows = useMemo(() => {
    const list = offices.map((o) => {
      const here = matched.filter((l) => l.officeId === o.id).sort((a, b) => a.surname.localeCompare(b.surname, "en"));
      return { ...o, km: from ? distanceKm(from, o) : null, lawyers: here };
    });
    list.sort((a, b) => (from ? (a.km! - b.km!) : 0) || a.name.localeCompare(b.name, "en"));
    let n = 0;
    return list.map((o) => ({ ...o, rank: from && o.lawyers.length ? ++n : null }));
  }, [matched, from?.lat, from?.lng]); // eslint-disable-line react-hooks/exhaustive-deps
  const shown = showAll ? rows : rows.filter((o) => o.lawyers.length);
  const nearest = from ? rows.find((o) => o.lawyers.length) ?? null : null;
  const officesWithMatch = rows.filter((o) => o.lawyers.length).length;
  const hovered = rows.find((o) => o.id === hoverId) ?? null;

  const sub = (o: (typeof rows)[number]) => [
    o.barangay,
    o.km !== null ? fmtKm(o.km) : null,
    o.lawyers.length ? (o.lawyers.length === 1 ? t("mp.match1") : t("mp.match", { n: o.lawyers.length })) : t("mp.noMatch"),
  ].filter(Boolean).join(" · ");
  const mapRows: MapRow[] = useMemo(() => shown.map((o) => ({ id: o.id, name: o.name, lat: o.lat, lng: o.lng, matches: o.lawyers.length, rank: o.rank, sub: sub(o) })), [shown, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  const areaLabel = f.area ? PRACTICE[f.area][lang].toLowerCase() : "";

  // Phone sheet: peek = handle + answer card height (measured), velocity drag on the handle.
  const colRef = useRef<HTMLElement>(null);
  const acRef = useRef<HTMLElement>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [peek, setPeek] = useState(300);
  const [phone, setPhone] = useState(false);
  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setPhone(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    const ro = new ResizeObserver(() => { if (acRef.current) setPeek(48 + acRef.current.offsetHeight); });
    if (acRef.current) ro.observe(acRef.current);
    return () => { mq.removeEventListener("change", apply); ro.disconnect(); };
  }, []);
  const drag = useRef<{ y: number; t: number; moved: boolean } | null>(null);
  const [dragY, setDragY] = useState<number | null>(null);
  const onDown = (e: React.PointerEvent) => { drag.current = { y: e.clientY, t: performance.now(), moved: false }; (e.target as Element).setPointerCapture?.(e.pointerId); };
  const onMove = (e: React.PointerEvent) => { if (!drag.current) return; const dy = e.clientY - drag.current.y; if (Math.abs(dy) > 4) drag.current.moved = true; setDragY(dy); };
  const onUp = (e: React.PointerEvent) => {
    const d = drag.current; drag.current = null; setDragY(null);
    if (!d || !d.moved) return;
    const dy = e.clientY - d.y, v = dy / Math.max(1, performance.now() - d.t);
    setSheetOpen(Math.abs(v) > 0.4 ? v < 0 : sheetOpen ? dy < 80 : dy < -80);
    if (d.moved) (e.target as HTMLElement).dataset.dragged = "1";
  };
  useEffect(() => { if (colRef.current) colRef.current.scrollTop = 0; }, [sheetOpen]);

  // Selecting an office (row or marker) opens its row and, on phones, the sheet.
  const select = (id: string) => {
    setOpenId(id);
    if (phone) setSheetOpen(true);
    requestAnimationFrame(() => document.getElementById(`row-${id}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" }));
  };

  // Island content: loading → prompt → nearest; hover shows the hovered office.
  const island = !mapReady
    ? { key: "load", main: t("mp.iLoading"), badge: null as string | null, sub: null as string | null }
    : hovered
      ? { key: `h-${hovered.id}`, main: hovered.name, badge: hovered.rank ? String(hovered.rank) : null, sub: sub(hovered) }
      : nearest
        ? { key: `n-${nearest.id}`, main: t("mp.iNearest", { office: nearest.name }), badge: "1", sub: fmtKm(nearest.km!) }
        : from
          ? { key: "none", main: t("mp.iNone"), badge: null, sub: null }
          : { key: "set", main: t("mp.iSet"), badge: null, sub: null };
  const live = nearest ? t("mp.iNearest", { office: nearest.name }) + `, ${fmtKm(nearest.km!)}` : "";

  // Drawer: Esc closes, focus moves in and back.
  const optBtn = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!drawer) return;
    drawerRef.current?.querySelector<HTMLElement>("button, input, select, a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setDrawer(false); optBtn.current?.focus(); }
      if (e.key === "Tab" && drawerRef.current) {
        const els = [...drawerRef.current.querySelectorAll<HTMLElement>("button, input, select, a")].filter((x) => !x.hasAttribute("disabled"));
        const first = els[0], last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawer]);

  const colStyle = { "--peek": `${peek}px`, ...(dragY !== null ? { transform: `translateY(calc(${sheetOpen ? "0px" : `100% - ${peek}px`} + ${dragY}px))`, transition: "none" } : {}) } as React.CSSProperties;

  return (
    <div className={s.mp}>
      <aside ref={colRef} className={`${s.col} ${phone && !sheetOpen ? s.closed : ""}`} style={colStyle} aria-label={t("mp.offices")}>
        <button type="button" className={s.handle} aria-expanded={sheetOpen}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}
          onClick={(e) => { const el = e.currentTarget; if (el.dataset.dragged) { delete el.dataset.dragged; return; } setSheetOpen((o) => !o); }}>
          <span className={s.grip} aria-hidden />
          <span className={s.handleT}>{sheetOpen ? t("mp.sheetClose") : t("mp.sheetOpen")}</span>
        </button>

        <section ref={acRef} className={s.ac} aria-labelledby="mp-q">
          <div className={s.eyebrow}>
            <span className={s.place}>{from?.source === "place" ? from.label : from?.source === "gps" ? t("mp.yourLoc") : "Quezon City"}</span>
            <span className={s.pilot}>{t("near.pilot")}</span>
          </div>
          <h1 id="mp-q" className={s.q}>{f.area ? t("mp.qArea", { area: areaLabel }) : t("mp.qAny")}</h1>

          <div className={s.locRow}>
            <button type="button" className={`btn btn-sm ${from?.source === "gps" ? "" : "btn-primary"}`} onClick={useGps} aria-pressed={from?.source === "gps"}>
              <Icon name="locate" size={18} />{t("near.use")}
            </button>
            <label htmlFor="near-place" className="sr-only">{t("near.place")}</label>
            <select id="near-place" aria-label={t("near.place")} className={`select ${s.areaSel}`} value={from?.source === "place" ? from.label : ""} onChange={(e) => (e.target.value ? chooseArea(e.target.value) : stopLocation())}>
              <option value="">{t("near.pick")}</option>
              {places.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          {status !== "idle" && (
            <p className={status === "asking" ? s.note : s.warn} role="status">
              {status === "asking" ? t("near.asking") : status === "denied" ? t("near.denied") : t("near.outside")}
            </p>
          )}

          <dl className={s.stats} id="mp-answer" aria-live="polite">
            {nearest ? (
              <div className={s.st}><dt className={s.stl}>{t("mp.stKm")}</dt><dd className={s.stn}>{fmtKm(nearest.km!)}</dd><dd className={s.sts}>{nearest.name}, {nearest.barangay}</dd></div>
            ) : (
              <div className={s.st}><dt className={s.stl}>{t("mp.stOfficesAll")}</dt><dd className={s.stn}>{offices.length}</dd></div>
            )}
            <div className={s.st}><dt className={s.stl}>{t("mp.stMatch")}</dt><dd className={s.stn}>{matched.length}</dd><dd className={s.sts}>{t("mp.stOffices", { n: officesWithMatch })}</dd></div>
          </dl>
          <p className={s.honest}>{t("mp.honest")}</p>
          {state.draft && <p className={s.draft} role="status">{t("mp.draft")}</p>}
          <p className={s.act}>{from ? t("mp.actFrom") : t("mp.actNone")}</p>
          {from && <button type="button" className="btn-quiet" onClick={stopLocation}>{t("near.clear")}</button>}
        </section>

        <section className={s.sec} aria-labelledby="sec-kind">
          <h2 id="sec-kind" className="sr-only">{t("fd.area")}</h2>
          <label htmlFor="area" className={s.secLabel}>{t("fd.area")}</label>
          <select id="area" className="select" value={f.area ?? ""} onChange={(e) => setParams({ area: e.target.value })}>
            <option value="">{t("fd.any")}</option>
            {PRACTICE_KEYS.map((k) => <option key={k} value={k}>{PRACTICE[k][lang]}</option>)}
          </select>
        </section>

        <section className={s.sec} aria-labelledby="sec-off">
          <h2 id="sec-off" className={s.secH}>{from ? t("mp.officesNear") : t("mp.offices")}</h2>
          <p className={s.order}>{from ? t("mp.order") : t("mp.orderAz")} <Term def={t("t.verified")}>{lang === "en" ? "Verified?" : "Beripikado?"}</Term></p>
          {shown.length === 0 && <p className={s.note}>{t("fd.none")}</p>}
          <ul className={s.sites}>
            {shown.map((o) => {
              const open = openId === o.id;
              return (
                <li key={o.id} id={`row-${o.id}`} className={`${s.srow} ${open ? s.srowOpen : ""}`}>
                  <button type="button" className={`${s.site} ${hoverId === o.id ? s.siteOn : ""}`} aria-expanded={open} aria-controls={`det-${o.id}`}
                    onClick={() => setOpenId(open ? null : o.id)} onMouseEnter={() => setHoverId(o.id)} onMouseLeave={() => setHoverId(null)} onFocus={() => setHoverId(o.id)} onBlur={() => setHoverId(null)}>
                    {o.rank ? <span className={s.badge} aria-hidden>{o.rank}</span> : <span className={o.lawyers.length ? s.dot : s.ring} aria-hidden />}
                    <span className={s.siteT}>
                      <span className={s.siteName}>{o.name}</span>
                      <span className={s.siteSub}>{sub(o)}</span>
                    </span>
                    <span className={s.chev} aria-hidden><Icon name="chev" size={16} /></span>
                  </button>
                  <div id={`det-${o.id}`} className={s.det} inert={!open}>
                    <div>
                      {o.lawyers.length ? (
                        <ul className={s.lawyers}>
                          {o.lawyers.map((l) => (
                            <li key={l.id}>
                              <Link href={`/find/${l.id}/`} className={s.lname}>{fullName(l)}</Link>
                              <span className={s.lsub}>{l.practiceAreas.map((a) => PRACTICE[a][lang]).join(", ")} · {AVAILABILITY[l.availability][lang]}</span>
                            </li>
                          ))}
                        </ul>
                      ) : <p className={s.note}>{t("mp.noMatch")}</p>}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className={`${s.sec} ${s.legend}`} aria-labelledby="sec-lg">
          <h2 id="sec-lg" className={s.secH}>{t("mp.legend")}</h2>
          <ul className={s.lg}>
            <li><span className={s.badge} aria-hidden>1</span>{t("mp.lgGold")}</li>
            <li><span className={s.dot} aria-hidden />{t("mp.lgDot")}</li>
            <li><span className={s.ring} aria-hidden />{t("mp.lgGrey")}</li>
            <li><span className={s.you} aria-hidden />{t("mp.lgYou")}</li>
          </ul>
          <p className={s.src}>{t("mp.src")} {t("near.privacy")}</p>
        </section>
      </aside>

      <div className={s.side}>
        <OfficeMap
          from={from}
          rows={mapRows}
          nearestId={nearest?.id ?? null}
          hoverId={hoverId}
          selectedId={openId}
          bounds={pilotArea.bounds}
          padBottom={phone ? peek : 0}
          onHover={setHoverId}
          onSelect={select}
          onReady={() => setMapReady(true)}
          labels={{ region: t("near.mapLabel"), you: t("near.you"), tiles: t("near.tiles") }}
        />
        <Island k={island.key} main={island.main} badge={island.badge} sub={island.sub} loading={!mapReady} />
        <p className="sr-only" aria-live="polite">{live}</p>

        <button ref={optBtn} type="button" className={s.optBtn} aria-expanded={drawer} aria-controls="mp-drawer" onClick={() => setDrawer((d) => !d)}>
          <Icon name="more" size={20} />{t("mp.more")}
        </button>
        <div className={`${s.scrim} ${drawer ? s.scrimOn : ""}`} onClick={() => setDrawer(false)} aria-hidden />
        <div ref={drawerRef} id="mp-drawer" role="dialog" aria-modal="true" aria-labelledby="mp-drawer-h" className={`glass ${s.drawer} ${drawer ? s.drawerOpen : ""}`} inert={!drawer}>
          <div className={s.drawerHead}>
            <h2 id="mp-drawer-h">{t("mp.more")}</h2>
            <button type="button" className={s.x} onClick={() => { setDrawer(false); optBtn.current?.focus(); }} aria-label={t("mp.close")}><Icon name="close" size={20} /></button>
          </div>
          <div className={s.drawerBody}>
            <p className={s.optsH}>{t("lang.label")}</p>
            <LangToggle />
            <p className={s.optsH}>{t("mp.filters")}</p>
            <div className="field">
              <label htmlFor="lang">{t("fd.lang")}</label>
              <select id="lang" className="select" value={f.lang ?? ""} onChange={(e) => setParams({ lang: e.target.value })}>
                <option value="">{t("fd.any")}</option>
                {(Object.keys(LANGUAGES) as LanguageCode[]).map((k) => <option key={k} value={k}>{LANGUAGES[k]}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="years">{t("fd.years")}</label>
              <select id="years" className="select" value={f.minYears ?? ""} onChange={(e) => setParams({ years: e.target.value })}>
                <option value="">{t("fd.any")}</option>
                {YEARS.map((y) => <option key={y} value={y}>{t("fd.min", { n: y })}</option>)}
              </select>
            </div>
            <label className="switch">{t("mp.showAll")}<input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} /></label>
            <p className={s.optsH}>{t("mp.links")}</p>
            <div className={s.links}>
              <Link href="/describe/">{t("home.cta")}</Link>
              <Link href="/app/inbox/">{t("foot.lawyerSideShort")}</Link>
              <button type="button" className="btn-quiet" onClick={() => { resetDemo(); window.location.assign("/find/"); }}>{t("foot.reset")}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Status island (LAMBAT .island/.isl): a navy pill over the map that springs to fit new content.
// The visual pill is aria-hidden; the page keeps a separate live region for real changes.
function Island({ k, main, badge, sub, loading }: { k: string; main: string; badge: string | null; sub: string | null; loading: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [w, setW] = useState<number | null>(null);
  const [avail, setAvail] = useState<number | null>(null);
  // Measure the content's natural width against the space the island may use, then spring to it.
  useLayoutEffect(() => {
    const fit = () => {
      const b = box.current, el = inner.current;
      if (!b || !el) return;
      const cs = getComputedStyle(b);
      setAvail(b.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight));
      setW(el.offsetWidth);
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (box.current) ro.observe(box.current);
    if (inner.current) ro.observe(inner.current);
    document.fonts?.ready.then(fit).catch(() => {});
    return () => ro.disconnect();
  }, [k, main, sub]);
  return (
    <div ref={box} className={s.island} aria-hidden>
      <div className={s.isl} style={{ width: w ?? undefined, "--avail": avail ? `${avail}px` : "100%" } as React.CSSProperties}>
        <div ref={inner} key={k} className={s.islC}>
          {loading ? <span className={s.ring2} /> : badge ? <span className={s.islBadge}>{badge}</span> : <Icon name="pin" size={18} />}
          <span className={s.islT}><b>{main}</b>{sub && <span className={s.islSub}>{sub}</span>}</span>
        </div>
      </div>
    </div>
  );
}
