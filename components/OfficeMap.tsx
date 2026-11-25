"use client";
// Leaflet map of law offices (decision D23). Leaflet's code loads only when the map is shown,
// to save prepaid data. Tiles come from OpenStreetMap: fine for a prototype, not for pilot
// traffic. Markers are identical for every office (rule C2); only the user's own nearest office
// gets a dashed line, which is a fact computed from their location, not a placement anyone pays for.
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { Map as LMap, LayerGroup } from "leaflet";
import type { LatLng, Office } from "@/lib/types";
import s from "./OfficeMap.module.css";

export type MapOffice = Office & { km: number; matches: { id: string; name: string }[] };
type Props = {
  from: LatLng & { accuracy?: number };
  items: MapOffice[];
  nearestId: string | null;
  bounds: [[number, number], [number, number]];
  labels: { region: string; you: string; here: string; none: string; away: (km: number) => string; tiles: string; note: string };
};

const css = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "#5b3fd9";

export default function OfficeMap({ from, items, nearestId, bounds, labels }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const ref = useRef<{ L: typeof import("leaflet"); map: LMap; layer: LayerGroup } | null>(null);
  const [ready, setReady] = useState(false);
  const [tilesFailed, setTilesFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let fails = 0;
    import("leaflet").then((L) => {
      if (cancelled || !el.current) return;
      const pad = 0.03;
      const map = L.map(el.current, {
        minZoom: 11,
        maxBounds: [[bounds[0][0] - pad, bounds[0][1] - pad], [bounds[1][0] + pad, bounds[1][1] + pad]],
        maxBoundsViscosity: 0.8,
        zoomSnap: 0.5,
      });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      })
        .on("tileerror", () => { if (++fails === 4) setTilesFailed(true); })
        .on("tileload", () => { fails = 0; })
        .addTo(map);
      ref.current = { L, map, layer: L.layerGroup().addTo(map) };
      map.getContainer().setAttribute("aria-label", labels.region);
      map.getContainer().setAttribute("role", "region");
      // The answer line above the map is its text summary; the list is the full alternative.
      if (document.getElementById("near-answer")) map.getContainer().setAttribute("aria-describedby", "near-answer");
      setReady(true);
    });
    return () => { cancelled = true; ref.current?.map.remove(); ref.current = null; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const r = ref.current;
    if (!ready || !r) return;
    const { L, map, layer } = r;
    layer.clearLayers();
    const accent = css("--brand");
    const ink = css("--ink");
    const muted = css("--muted");
    const surface = css("--surface");

    const nearest = items.find((i) => i.id === nearestId);
    if (nearest) {
      L.polyline([[from.lat, from.lng], [nearest.lat, nearest.lng]], { color: ink, weight: 2, dashArray: "6 6", interactive: false }).addTo(layer);
    }
    for (const o of items) {
      const has = o.matches.length > 0;
      const m = L.circleMarker([o.lat, o.lng], {
        radius: 9, weight: 2, color: has ? accent : muted, fillColor: has ? accent : surface, fillOpacity: has ? 0.85 : 0.6,
      }).addTo(layer);
      // Build popups with DOM nodes and textContent, never HTML strings.
      const box = document.createElement("div");
      const h = document.createElement("strong");
      h.textContent = o.name;
      const where = document.createElement("div");
      where.textContent = `${o.barangay}, ${o.city} · ${labels.away(o.km)}`;
      box.append(h, where);
      if (has) {
        const p = document.createElement("div");
        p.className = s.popLabel;
        p.textContent = labels.here;
        const ul = document.createElement("ul");
        ul.className = s.popList;
        for (const l of o.matches) {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = `/find/${l.id}/`;
          a.textContent = l.name;
          li.append(a);
          ul.append(li);
        }
        box.append(p, ul);
      } else {
        const p = document.createElement("div");
        p.className = s.popLabel;
        p.textContent = labels.none;
        box.append(p);
      }
      m.bindPopup(box);
    }
    if (from.accuracy && from.accuracy < 3000) {
      L.circle([from.lat, from.lng], { radius: from.accuracy, color: ink, weight: 1, fillOpacity: 0.06, interactive: false }).addTo(layer);
    }
    L.circleMarker([from.lat, from.lng], { radius: 8, weight: 3, color: surface, fillColor: ink, fillOpacity: 1 })
      .bindTooltip(labels.you, { direction: "top", offset: [0, -8] })
      .addTo(layer);

    const near = items.filter((i) => i.matches.length).slice(0, 3);
    const pts: [number, number][] = [[from.lat, from.lng], ...near.map((i) => [i.lat, i.lng] as [number, number])];
    map.fitBounds(L.latLngBounds(pts), { padding: [36, 36], maxZoom: 15 });
  }, [ready, from, items, nearestId, labels]);

  return (
    <figure className={s.wrap}>
      <div ref={el} className={s.map} aria-busy={!ready} />
      {!ready && <p className={s.loading}><span className={s.skel} aria-hidden /><span className="sr-only">Loading map</span></p>}
      {tilesFailed && <p className={s.fail} role="status">{labels.tiles}</p>}
      <figcaption className={s.note}>{labels.note}</figcaption>
    </figure>
  );
}
