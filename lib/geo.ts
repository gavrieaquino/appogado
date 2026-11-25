// Distance maths for "Near you". Runs on the device only (decision D21): the user's
// location is never stored, put in a URL, or sent anywhere.
import type { LatLng } from "./types";

const R = 6371; // mean Earth radius, km

/** Great-circle ("straight-line") distance in km. Not travel time, and the UI says so. */
export function distanceKm(a: LatLng, b: LatLng): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Inside the pilot bounding box. Approximate: the box also covers bits of neighbouring cities. */
export function inBounds(p: LatLng, [[s, w], [n, e]]: [[number, number], [number, number]]): boolean {
  return p.lat >= s && p.lat <= n && p.lng >= w && p.lng <= e;
}

/** "350 m", "1.2 km", "12 km". */
export function fmtKm(km: number): string {
  if (km < 1) return `${Math.max(50, Math.round((km * 1000) / 50) * 50)} m`;
  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
}

/** Items sorted by distance from `from`, nearest first, with the distance attached. */
export function byDistance<T extends LatLng>(items: T[], from: LatLng): (T & { km: number })[] {
  return items.map((i) => ({ ...i, km: distanceKm(from, i) })).sort((a, b) => a.km - b.km);
}
