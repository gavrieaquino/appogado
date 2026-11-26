// Data shapes for the prototype. These become the pilot's types.
export type Lang = "en" | "fil";
export type LanguageCode = "en" | "fil" | "ceb" | "ilo";
export type PracticeArea = "family" | "labor" | "land" | "criminal" | "consumer" | "estate" | "business";
export type Availability = "open" | "limited" | "closed";

/** Public lawyer facts only. There is deliberately no plan or tier field (rule C2, C8). */
export type Lawyer = {
  id: string;
  firstName: string;
  surname: string;
  practiceAreas: PracticeArea[];
  languages: LanguageCode[];
  barangay: string;
  city: string;
  yearsOfPractice: number;
  rollNo: string;
  rollStatus: "Active";
  verifiedOn: string; // ISO date
  availability: Availability;
  takesProBono: boolean;
  officeId: string;
};

/** An office on the map. Public business address only; no plan or tier field (rule C2). */
export type Office = {
  id: string;
  name: string;
  kind: "solo" | "firm";
  barangay: string;
  city: string;
  lat: number;
  lng: number;
};

export type LatLng = { lat: number; lng: number };
export type Place = LatLng & { name: string };

export type Urgency = "urgent" | "soon" | "routine";
export type BriefStatus = "new" | "accepted" | "declined" | "more-info";

export type Brief = {
  id: string;
  receivedAt: string; // ISO date-time
  language: Lang;
  category: PracticeArea;
  urgency: Urgency;
  urgencyReason: string;
  title: string;
  facts: string[];
  wants: string;
  otherParty: string;
  documents: string[];
  city: string;
  proBonoRequested: boolean;
  source: "client" | "partner-clinic";
  partner?: string;
  status: BriefStatus;
  acceptedAs?: "paid" | "probono";
  declineReason?: string;
  addressedTo?: string; // lawyer id, or "probono-routing"
  demo?: boolean; // created in this browser during the demo
};

export type HourEntry = {
  id: string;
  date: string; // ISO date
  matter: string;
  briefId?: string;
  hours: number;
  kind: "service";
  demo?: boolean;
};

export type Booking = {
  id: string;
  briefId: string;
  matter: string;
  date: string | null; // null = to schedule
  time: string | null;
  mode: "In person" | "Video call";
  place: string;
  tag: "paid" | "probono";
  status: "to-schedule" | "upcoming" | "done";
  hoursLogged?: number;
  demo?: boolean;
};

export type FirmMember = {
  name: string;
  serviceHours: number;
  exempt?: string; // reason, if exempt
};
