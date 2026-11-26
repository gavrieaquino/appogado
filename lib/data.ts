// Typed access to the sample data. Everything here is fictional (see data/*.json _meta).
import type { Booking, Brief, FirmMember, HourEntry, Lawyer, PracticeArea } from "./types";
import lawyersJson from "@/data/lawyers.json";
import briefsJson from "@/data/briefs.json";
import logsJson from "@/data/ulas-logs.json";
import bookingsJson from "@/data/bookings.json";
import firmJson from "@/data/firm.json";
import verificationJson from "@/data/verification.json";
import accountJson from "@/data/account.json";

export const lawyers = lawyersJson.items as Lawyer[];
export const sampleBriefs = briefsJson.items as Brief[];
export const sampleHours = logsJson.items as HourEntry[];
export const sampleBookings = bookingsJson.items as Booking[];
export const firm = firmJson.items[0] as { name: string; members: FirmMember[] };
export const verificationQueue = verificationJson.items as { id: string; name: string; rollNo: string; ibpId: string; submittedOn: string; practiceAreas: PracticeArea[] }[];
export const account = accountJson.items[0];

/** The lawyer the lawyer-side demo is signed in as. */
export const ME_ID = account.lawyer;
export const lawyerById = (id: string) => lawyers.find((l) => l.id === id);
export const me = lawyerById(ME_ID)!;
export const fullName = (l: Pick<Lawyer, "firstName" | "surname">) => `Atty. ${l.firstName} ${l.surname}`;
