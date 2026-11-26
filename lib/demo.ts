// Fixed demo date so every number stays the same during a pitch (decision D16).
export const DEMO_TODAY = "2026-11-25";
// Noon Manila time, so the date is the same in UTC and every day count is stable.
export const demoToday = () => new Date(`${DEMO_TODAY}T12:00:00+08:00`);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2026-11-25" → "25 Nov 2026". Works on ISO dates and date-times, no locale or timezone drift. */
export function fmtDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
export const fmtHours = (h: number) => `${Number.isInteger(h) ? h : h.toFixed(1)} ${h === 1 ? "hour" : "hours"}`;
export const fmtNum = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
export const peso = (n: number) => `₱${n.toLocaleString("en-PH")}`;
