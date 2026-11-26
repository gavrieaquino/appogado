"use client";
// Demo actions shared by client and lawyer screens. Everything writes to the browser-only demo store.
import { update } from "./store";
import type { Booking, Brief, HourEntry } from "./types";
import { DEMO_TODAY } from "./demo";

export function sendBrief(addressedTo: string, proBono = false) {
  update((s) => {
    if (!s.draft) return s;
    const sent: Brief = { ...s.draft, id: `d${Date.now().toString(36)}`, addressedTo, proBonoRequested: s.draft.proBonoRequested || proBono, receivedAt: new Date().toISOString(), status: "new" };
    return { ...s, sent: [...s.sent, sent], draft: null, intake: null };
  });
}

export function decide(brief: Brief, d: Pick<Brief, "status" | "acceptedAs" | "declineReason">) {
  update((s) => {
    const next = { ...s, decisions: { ...s.decisions, [brief.id]: d } };
    if (d.status === "accepted") {
      const booking: Booking = { id: `k-${brief.id}`, briefId: brief.id, matter: brief.title, date: null, time: null, mode: "In person", place: "To agree with the client", tag: d.acceptedAs === "probono" ? "probono" : "paid", status: "to-schedule", demo: true };
      if (!next.bookings.some((b) => b.id === booking.id)) next.bookings = [...next.bookings, booking];
    }
    return next;
  });
}

export function logHours(entry: Omit<HourEntry, "id" | "kind" | "demo">) {
  update((s) => ({ ...s, hours: [...s.hours, { ...entry, id: `h-${Date.now().toString(36)}`, kind: "service", demo: true }] }));
}

export function closeBooking(b: Booking, hours: number | null) {
  update((s) => {
    const next = { ...s, bookingUpdates: { ...s.bookingUpdates, [b.id]: { status: "done" as const, hoursLogged: hours ?? undefined } } };
    if (b.tag === "probono" && hours && hours > 0) {
      next.hours = [...s.hours, { id: `h-${b.id}`, date: DEMO_TODAY, matter: b.matter, briefId: b.briefId, hours, kind: "service", demo: true }];
    }
    return next;
  });
}

export function scheduleBooking(b: Booking, date: string, time: string, mode: Booking["mode"]) {
  update((s) => ({ ...s, bookingUpdates: { ...s.bookingUpdates, [b.id]: { status: "upcoming", date, time, mode, place: mode === "Video call" ? "Video call" : "Office" } } }));
}
