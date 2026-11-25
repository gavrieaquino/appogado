"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { fullName, lawyers, offices, places, pilotArea } from "@/lib/data";
import { search, type Filters } from "@/lib/directory";
import { byDistance, distanceKm, fmtKm } from "@/lib/geo";
import { LANGUAGES, PRACTICE, PRACTICE_KEYS } from "@/lib/practice";
import { useT } from "@/lib/i18n";
import { useDemo } from "@/lib/store";
import type { LanguageCode, PracticeArea } from "@/lib/types";
import LawyerCard from "@/components/LawyerCard";
import Term from "@/components/Term";
import NearYou, { type From } from "./NearYou";
import s from "./find.module.css";

// The map (and Leaflet with it) loads only when it is shown.
const OfficeMap = dynamic(() => import("@/components/OfficeMap"), { ssr: false, loading: () => <div className={s.mapSkel} role="status"><span className="sr-only">Loading map</span></div> });

const YEARS = [3, 5, 10, 15];

function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const f = () => setWide(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);
  return wide;
}

export default function Directory() {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const { t, lang } = useT();
  const [state] = useDemo();
  const wide = useWide();
  const [gps, setGps] = useState<From | null>(null);
  const [view, setView] = useState<"list" | "map">("list");

  const f: Filters = {
    area: (params.get("area") as PracticeArea) || undefined,
    lang: (params.get("lang") as LanguageCode) || undefined,
    minYears: params.get("years") ? Number(params.get("years")) : undefined,
  };
  // A chosen area may live in the URL (shareable, coarse). A GPS position never does.
  const placeName = params.get("near");
  const place = places.find((p) => p.name === placeName);
  const from: From | null = gps ?? (place ? { lat: place.lat, lng: place.lng, source: "place", label: place.name } : null);

  const officeKm = useMemo(() => (from ? Object.fromEntries(offices.map((o) => [o.id, distanceKm(from, o)])) : null), [from?.lat, from?.lng]); // eslint-disable-line react-hooks/exhaustive-deps
  const list = useMemo(() => search(lawyers, f, officeKm ? (l) => officeKm[l.officeId] : undefined), [f.area, f.lang, f.minYears, officeKm]); // eslint-disable-line react-hooks/exhaustive-deps
  const any = [f.area, f.lang, f.minYears].some((v) => v !== undefined);

  const mapItems = useMemo(() => {
    if (!from) return [];
    const open = list.filter((l) => l.availability !== "closed");
    return byDistance(offices, from).map((o) => ({ ...o, matches: open.filter((l) => l.officeId === o.id).map((l) => ({ id: l.id, name: fullName(l) })) }));
  }, [from?.lat, from?.lng, list]); // eslint-disable-line react-hooks/exhaustive-deps
  const nearest = mapItems.find((o) => o.matches.length);

  const setParams = (changes: Record<string, string>) => {
    const p = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(changes)) { if (v) p.set(k, v); else p.delete(k); }
    router.replace(`${path}${p.size ? `?${p}` : ""}`, { scroll: false });
  };
  const onFrom = (next: From | null) => {
    if (next?.source === "gps") { setGps(next); setParams({ near: "" }); }
    else { setGps(null); setParams({ near: next?.label ?? "" }); }
  };

  const answer = from
    ? nearest
      ? t(f.area ? "near.nearestArea" : "near.nearest", { area: f.area ? PRACTICE[f.area][lang].toLowerCase() : "", office: nearest.name, where: nearest.barangay, km: fmtKm(nearest.km) })
      : t("near.noneOpen")
    : any ? t("fd.count", { n: list.length }) : t("fd.countAll", { n: list.length });

  const showMap = !!from && (wide || view === "map");
  const showList = !from || wide || view === "list";

  return (
    <div className="page-in">
      <header className={s.head}>
        <p className={s.kicker}>{t("near.pilot")}</p>
        <h1 className={s.title}>{t("fd.title")}</h1>
        <p className={s.answer} aria-live="polite" id="near-answer">{answer}</p>
        <p className="muted small">{t(from ? "fd.orderNear" : "fd.order")} <Term def={t("t.verified")}>{lang === "en" ? "What does verified mean?" : "Ano ang ibig sabihin ng beripikado?"}</Term></p>
      </header>

      {state.draft && <p className={s.draft} role="status">{t("fd.draft")}</p>}

      <NearYou from={from} onChange={onFrom} />

      <form className={s.filters} onSubmit={(e) => e.preventDefault()} aria-label="Filters">
        <div className="field">
          <label htmlFor="area">{t("fd.area")}</label>
          <select id="area" className="select" value={f.area ?? ""} onChange={(e) => setParams({ area: e.target.value })}>
            <option value="">{t("fd.any")}</option>
            {PRACTICE_KEYS.map((k) => <option key={k} value={k}>{PRACTICE[k][lang]}</option>)}
          </select>
        </div>
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
        {any && <button type="button" className="btn btn-quiet" onClick={() => setParams({ area: "", lang: "", years: "" })}>{t("fd.clear")}</button>}
      </form>

      {from && !wide && (
        <fieldset className={s.view} style={{ "--i": view === "list" ? 0 : 1 } as React.CSSProperties}>
          <legend className="sr-only">{t("near.view")}</legend>
          <span className={s.thumb} aria-hidden />
          {(["list", "map"] as const).map((v) => (
            <label key={v} className={s.viewOpt}>
              <input type="radio" name="view" checked={view === v} onChange={() => setView(v)} />{t(`near.${v}`)}
            </label>
          ))}
        </fieldset>
      )}

      <div className={showMap && showList ? s.split : undefined}>
        {showList && (list.length === 0 ? (
          <p className={s.none}>{t("fd.none")}</p>
        ) : (
          <ul className={s.grid}>
            {list.map((l) => <li key={l.id}><LawyerCard lawyer={l} lang={lang} away={officeKm ? t("near.away", { km: fmtKm(officeKm[l.officeId]) }) : undefined} /></li>)}
          </ul>
        ))}
        {showMap && from && (
          <div className={s.mapCol}>
            <OfficeMap
              from={from}
              items={mapItems}
              nearestId={nearest?.id ?? null}
              bounds={pilotArea.bounds}
              labels={{
                region: t("near.mapLabel"), you: t("near.you"), here: t("near.lawyersHere"), none: t("near.noMatchHere"),
                away: (km: number) => t("near.away", { km: fmtKm(km) }), tiles: t("near.tiles"), note: t("near.mapNote"),
              }}
            />
          </div>
        )}
      </div>
      <p className="muted small">{lang === "en" ? "Every lawyer, office and location here is sample data." : "Sample na datos ang lahat ng abogado, opisina at lokasyon dito."} <Link href="/describe/">{t("home.cta")}</Link></p>
    </div>
  );
}

