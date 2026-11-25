"use client";
import { useState } from "react";
import { places, pilotArea } from "@/lib/data";
import { inBounds } from "@/lib/geo";
import { useT } from "@/lib/i18n";
import type { LatLng } from "@/lib/types";
import s from "./find.module.css";

export type From = LatLng & { source: "gps" | "place"; label: string; accuracy?: number };

// Location picker. GPS is asked for only when the user taps the button; the position stays in
// memory on this page (never stored, never in the URL). Choosing an area needs no GPS at all.
export default function NearYou({ from, onChange }: { from: From | null; onChange: (f: From | null) => void }) {
  const { t } = useT();
  const [status, setStatus] = useState<"idle" | "asking" | "denied" | "outside">("idle");

  const useGps = () => {
    if (!("geolocation" in navigator)) { setStatus("denied"); return; }
    setStatus("asking");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (!inBounds(p, pilotArea.bounds)) { setStatus("outside"); onChange(null); return; }
        setStatus("idle");
        onChange({ ...p, source: "gps", label: "", accuracy: Math.round(pos.coords.accuracy) });
      },
      () => setStatus("denied"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  };

  const place = from?.source === "place" ? from.label : "";
  return (
    <section className={s.near} aria-labelledby="near-title">
      <h2 id="near-title" className={s.nearTitle}>{t("near.title")}</h2>
      <div className={s.nearRow}>
        <button type="button" className="btn" onClick={useGps} aria-pressed={from?.source === "gps"}>{t("near.use")}</button>
        <span className="muted small">{t("near.or")}</span>
        <label htmlFor="near-place" className="sr-only">{t("near.place")}</label>
        <select id="near-place" className={`select ${s.nearSelect}`} value={place}
          onChange={(e) => {
            const p = places.find((x) => x.name === e.target.value);
            setStatus("idle");
            onChange(p ? { lat: p.lat, lng: p.lng, source: "place", label: p.name } : null);
          }}>
          <option value="">{t("near.pick")}</option>
          {places.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
        </select>
        {from && <button type="button" className="btn btn-quiet" onClick={() => { setStatus("idle"); onChange(null); }}>{t("near.clear")}</button>}
      </div>
      <p className="hint" aria-live="polite">
        {status === "asking" ? t("near.asking")
          : status === "denied" ? <span className={s.warnText}>{t("near.denied")}</span>
          : status === "outside" ? <span className={s.warnText}>{t("near.outside")}</span>
          : from?.source === "gps" ? `${from.accuracy ? t("near.fromGps", { m: from.accuracy }) : t("near.fromGpsPlain")} ${t("near.straight")}`
          : from ? `${t("near.fromPlace", { place: from.label })} ${t("near.straight")}`
          : t("near.privacy")}
      </p>
      {from && <p className="hint">{t("near.privacy")}</p>}
    </section>
  );
}
