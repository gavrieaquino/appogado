// Typed access to the sample data. Everything here is fictional (see data/*.json _meta).
import type { Booking, Brief, FirmMember, HourEntry, Lawyer, Office, Place, PracticeArea } from "./types";
import lawyersJson from "@/data/lawyers.json";
import briefsJson from "@/data/briefs.json";
import logsJson from "@/data/ulas-logs.json";
import bookingsJson from "@/data/bookings.json";
import firmJson from "@/data/firm.json";
import verificationJson from "@/data/verification.json";
import accountJson from "@/data/account.json";
import officesJson from "@/data/offices.json";
import placesJson from "@/data/places.json";

export const lawyers = lawyersJson.items as Lawyer[];
export const sampleBriefs = briefsJson.items as Brief[];
export const sampleHours = logsJson.items as HourEntry[];
export const sampleBookings = bookingsJson.items as Booking[];
export const firm = firmJson.items[0] as { name: string; members: FirmMember[] };
export const verificationQueue = verificationJson.items as { id: string; name: string; rollNo: string; ibpId: string; submittedOn: string; practiceAreas: PracticeArea[] }[];
export const account = accountJson.items[0];
export const offices = officesJson.items as Office[];
export const places = placesJson.items as Place[];
/** Quezon City pilot area (decision D20). A bounding box, not the city boundary. */
export const pilotArea = placesJson.pilotArea as { name: string; bounds: [[number, number], [number, number]]; note: string };
export const officeById = (id: string) => offices.find((o) => o.id === id);

/** The lawyer the lawyer-side demo is signed in as. */
export const ME_ID = account.lawyer;
export const lawyerById = (id: string) => lawyers.find((l) => l.id === id);
export const me = lawyerById(ME_ID)!;
export const fullName = (l: Pick<Lawyer, "firstName" | "surname">) => `Atty. ${l.firstName} ${l.surname}`;
