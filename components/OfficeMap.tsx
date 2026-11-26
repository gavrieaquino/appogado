"use client";
// Leaflet map of law offices for the map-first "Near you" page (decisions D23, D29; gis-ui-kit
// docs/maplibre.md, Leaflet section). Markers are focusable divIcons styled like LAMBAT's rank dots:
// gold numbers for offices with a matching lawyer, in distance order from the user's own point;
// purple dots before a location is set; grey rings where no lawyer matches. Nobody can pay for a
// marker style (rule C2): the only input is the filter match and the distance.
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { Map as LMap, LayerGroup, Marker } from "leaflet";
import type { LatLng } from "@/lib/types";
import s from "./OfficeMap.module.css";

export type MapRow = { id: string; name: string; lat: number; lng: number; matches: number; rank: number | null; sub: string };
type Props = {
  from: (LatLng & { accuracy?: number }) | null;
  rows: MapRow[];
  nearestId: string | null;
  hoverId: string | null;
  selectedId: string | null;
  bounds: [[number, number], [number, number]];
  padBottom: number;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  onReady: () => void;
  labels: { region: string; you: string; tiles: string };
};

export default function OfficeMap({ from, rows, nearestId, hoverId, selectedId, bounds, padBottom, onHover, onSelect, onReady, labels }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const ref = useRef<{ L: typeof import("leaflet"); map: LMap; layer: LayerGroup; markers: Map<string, Marker> } | null>(null);
  // The last framing, re-applied whenever the map changes size (column, sheet, first layout).
  const refit = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);
  const [tilesFailed, setTilesFailed] = useState(false);
  const cb = useRef({ onHover, onSelect, onReady });
  cb.current = { onHover, onSelect, onReady };

  useEffect(() => {
    let cancelled = false;
    let fails = 0;
    let ro: ResizeObserver | null = null;
    import("leaflet").then((L) => {
      if (cancelled || !el.current) return;
      const pad = 0.03;
      const map = L.map(el.current, {
        minZoom: 11,
        maxBounds: [[bounds[0][0] - pad, bounds[0][1] - pad], [bounds[1][0] + pad, bounds[1][1] + pad]],
        maxBoundsViscosity: 0.8,
        zoomSnap: 0.5,
        zoomControl: false,
      });
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        className: s.tiles,
      })
        .on("tileerror", () => { if (++fails === 4) setTilesFailed(true); })
        .on("tileload", () => { fails = 0; })
        .addTo(map);
      map.fitBounds(bounds);
      ref.current = { L, map, layer: L.layerGroup().addTo(map), markers: new Map() };
      const c = map.getContainer();
      c.setAttribute("role", "region");
      c.setAttribute("aria-label", labels.region);
      if (document.getElementById("mp-answer")) c.setAttribute("aria-describedby", "mp-answer");
      // Refit when the column, sheet or drawer changes the map's size.
      ro = new ResizeObserver(() => { map.invalidateSize({ pan: false }); refit.current(); });
      ro.observe(el.current);
      setReady(true);
      cb.current.onReady();
    });
    return () => { cancelled = true; ro?.disconnect(); ref.current?.map.remove(); ref.current = null; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Draw markers when the data changes.
  useEffect(() => {
    const r = ref.current;
    if (!ready || !r) return;
    const { L, map, layer, markers } = r;
    layer.clearLayers();
    markers.clear();
    const nearest = rows.find((x) => x.id === nearestId);
    if (from && nearest) {
      L.polyline([[from.lat, from.lng], [nearest.lat, nearest.lng]], { color: "#141a2e", weight: 2, dashArray: "6 6", interactive: false }).addTo(layer);
    }
    for (const o of rows) {
      const kind = o.matches ? (o.rank ? "rank" : "dot") : "none";
      const html = kind === "rank" ? `<span class="ap-rank">${o.rank}</span>` : kind === "dot" ? '<span class="ap-dot"></span>' : '<span class="ap-none"></span>';
      const size = kind === "rank" ? 32 : kind === "dot" ? 20 : 16;
      const m = L.marker([o.lat, o.lng], {
        icon: L.divIcon({ html, className: "ap-mk", iconSize: [size, size], iconAnchor: [size / 2, size / 2] }),
        title: `${o.name}. ${o.sub}`,
        alt: o.name,
        keyboard: true,
        riseOnHover: true,
        zIndexOffset: kind === "rank" ? 1000 - (o.rank ?? 0) : kind === "dot" ? 500 : 0,
      })
        .on("mouseover focus", () => cb.current.onHover(o.id))
        .on("mouseout blur", () => cb.current.onHover(null))
        .on("click keypress", () => cb.current.onSelect(o.id))
        .addTo(layer);
      markers.set(o.id, m);
    }
    if (from) {
      if (from.accuracy && from.accuracy > 0 && from.accuracy < 3000) {
        L.circle([from.lat, from.lng], { radius: from.accuracy, color: "#141a2e", weight: 1, fillOpacity: 0.06, interactive: false }).addTo(layer);
      }
      L.marker([from.lat, from.lng], {
        icon: L.divIcon({ html: '<span class="ap-you"></span>', className: "ap-mk", iconSize: [20, 20], iconAnchor: [10, 10] }),
        title: labels.you, alt: labels.you, keyboard: false, zIndexOffset: 2000,
      }).addTo(layer);
      const near = rows.filter((x) => x.rank).slice(0, 3);
      const pts: [number, number][] = [[from.lat, from.lng], ...near.map((x) => [x.lat, x.lng] as [number, number])];
      refit.current = () => map.fitBounds(L.latLngBounds(pts), { paddingTopLeft: [56, 96], paddingBottomRight: [72, 56 + padBottom], maxZoom: 15, animate: false });
    } else {
      refit.current = () => map.fitBounds(bounds, { paddingTopLeft: [16, 72], paddingBottomRight: [16, 16 + padBottom], animate: false });
    }
    refit.current();
  }, [ready, from?.lat, from?.lng, rows, nearestId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Hover and selection rings, synced with the office list.
  useEffect(() => {
    const r = ref.current;
    if (!ready || !r) return;
    r.markers.forEach((m, id) => {
      const node = m.getElement();
      if (!node) return;
      node.classList.toggle("ap-hl", id === hoverId || id === selectedId);
      node.classList.toggle("ap-dim", !!hoverId && id !== hoverId);
    });
    if (selectedId) {
      const m = r.markers.get(selectedId);
      // Pan only when the selected office is out of view, so the framing of the nearest offices stays.
      if (m && !r.map.getBounds().contains(m.getLatLng())) r.map.panTo(m.getLatLng());
    }
  }, [ready, hoverId, selectedId, rows]);

  return (
    <div className={s.wrap}>
      <div ref={el} className={s.map} aria-busy={!ready} />
      {tilesFailed && <p className={s.fail} role="status">{labels.tiles}</p>}
    </div>
  );
}
