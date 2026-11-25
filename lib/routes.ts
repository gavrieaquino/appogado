// Single source for the prototype's routes. Mirrors docs/ia.md.
export type Surface = {
  href: string;
  label: string;   // short nav label
  title: string;   // page heading
  job: string;     // one-line job from docs/surfaces.md
  group: "client" | "lawyer" | "admin";
};

export const surfaces: Surface[] = [
  { href: "/", label: "Home", title: "Describe your problem once", job: "Client landing. Shows a sample brief.", group: "client" },
  { href: "/describe/", label: "Describe", title: "Tell us what happened", job: "Intake: consent, then type, photo or upload, in English or Filipino.", group: "client" },
  { href: "/describe/review/", label: "Review brief", title: "This is what a lawyer will see", job: "Client checks and edits the brief, then chooses a lawyer or pro bono routing.", group: "client" },
  { href: "/sent/", label: "Sent", title: "Your brief was sent", job: "Confirmation and what happens next.", group: "client" },
  { href: "/find/", label: "Find a lawyer", title: "Find a verified lawyer", job: "Directory with identical cards. Order: filter match, then alphabetical.", group: "client" },
  { href: "/for-lawyers/", label: "For lawyers", title: "For lawyers and law firms", job: "Get discovered, triage in a minute, stay ULAS-compliant.", group: "lawyer" },
  { href: "/app/inbox/", label: "Inbox", title: "Inbox", job: "Briefs sent to you. Accept as paid or pro bono, ask for more, or decline.", group: "lawyer" },
  { href: "/app/ulas/", label: "ULAS hours", title: "ULAS hours", job: "Hours against 60, the 15-hour personal minimum, days left, report export.", group: "lawyer" },
  { href: "/app/firm/", label: "Firm", title: "Firm view", job: "Firm pool, each lawyer's personal minimum, who is behind.", group: "lawyer" },
  { href: "/app/bookings/", label: "Bookings", title: "Bookings", job: "Each booking carries its brief and paid or pro bono tag; closing one logs hours.", group: "lawyer" },
  { href: "/app/account/", label: "Account", title: "Account, seats and billing", job: "Tier, founding-rate expiry, seats. Never shown publicly.", group: "lawyer" },
  { href: "/admin/verification/", label: "Verification", title: "Lawyer verification queue", job: "Mock: roll number, IBP ID, SC Law List check, verification date.", group: "admin" },
];

export const bySlug = (href: string) => {
  const s = surfaces.find((x) => x.href === href);
  if (!s) throw new Error(`Unknown route ${href}; add it to lib/routes.ts and docs/ia.md`);
  return s;
};
