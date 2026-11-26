"use client";
// Lawyer-side view of the data: sample records merged with what happened in this browser's demo.
import { useMemo } from "react";
import { useDemo } from "./store";
import { sampleBookings, sampleBriefs, sampleHours } from "./data";
import type { Booking, Brief } from "./types";

const urgencyRank = { urgent: 0, soon: 1, routine: 2 } as const;

export function useBriefs(): Brief[] {
  const [s] = useDemo();
  return useMemo(() => {
    const all = [...sampleBriefs, ...s.sent].map((b) => ({ ...b, ...(s.decisions[b.id] ?? {}) }));
    return all.sort((a, b) =>
      Number(a.status !== "new") - Number(b.status !== "new") ||
      urgencyRank[a.urgency] - urgencyRank[b.urgency] ||
      b.receivedAt.localeCompare(a.receivedAt));
  }, [s.sent, s.decisions]);
}

export function useHours() {
  const [s] = useDemo();
  return useMemo(() => [...sampleHours, ...s.hours].sort((a, b) => b.date.localeCompare(a.date)), [s.hours]);
}

export function useBookings(): Booking[] {
  const [s] = useDemo();
  return useMemo(() => [...sampleBookings, ...s.bookings].map((b) => ({ ...b, ...(s.bookingUpdates[b.id] ?? {}) })), [s.bookings, s.bookingUpdates]);
}
