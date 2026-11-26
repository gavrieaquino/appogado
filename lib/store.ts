"use client";
// Demo store (decision D14): localStorage, per browser, wrapped in try/catch so the page
// still works when storage is blocked. It hands the client's brief to the lawyer inbox.
import { useCallback, useSyncExternalStore } from "react";
import type { Booking, Brief, HourEntry, Lang } from "./types";
import type { IntakeInput } from "./brief";

export type DemoState = {
  consent: { store: boolean; read: boolean; share: boolean } | null;
  intake: IntakeInput | null;
  draft: Brief | null;
  sent: Brief[];
  decisions: Record<string, Pick<Brief, "status" | "acceptedAs" | "declineReason">>;
  hours: HourEntry[];
  bookings: Booking[];
  bookingUpdates: Record<string, Partial<Booking>>;
  verified: Record<string, "approved" | "rejected">;
};

const KEY = "appogado.demo.v1";
const EMPTY: DemoState = { consent: null, intake: null, draft: null, sent: [], decisions: {}, hours: [], bookings: [], bookingUpdates: {}, verified: {} };
const listeners = new Set<() => void>();
let cache: DemoState | null = null;

function read(): DemoState {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache!;
}

export function update(fn: (s: DemoState) => DemoState) {
  cache = fn(read());
  try { window.localStorage.setItem(KEY, JSON.stringify(cache)); } catch { /* storage blocked: keep in memory */ }
  listeners.forEach((l) => l());
}

export function resetDemo() {
  cache = EMPTY;
  try { window.localStorage.removeItem(KEY); } catch { /* ignore */ }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) { cache = null; l(); } };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(l); window.removeEventListener("storage", onStorage); };
};

/** Returns EMPTY during prerender and the first client render, then the stored state. */
export function useDemo(): [DemoState, typeof update] {
  const s = useSyncExternalStore(subscribe, read, () => EMPTY);
  return [s, useCallback(update, [])];
}

// Language preference lives separately so it survives "Reset demo".
const LANG_KEY = "appogado.lang";
const langListeners = new Set<() => void>();
export function readLang(): Lang {
  try { return window.localStorage.getItem(LANG_KEY) === "fil" ? "fil" : "en"; } catch { return "en"; }
}
export function writeLang(l: Lang) {
  try { window.localStorage.setItem(LANG_KEY, l); } catch { /* ignore */ }
  langListeners.forEach((f) => f());
}
export function useLang(): Lang {
  return useSyncExternalStore((l) => { langListeners.add(l); return () => langListeners.delete(l); }, readLang, () => "en");
}
