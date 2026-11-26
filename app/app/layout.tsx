import Shell from "@/components/Shell";

const items = [
  { href: "/app/inbox/", label: "Inbox" },
  { href: "/app/ulas/", label: "ULAS hours", short: "ULAS" },
  { href: "/app/firm/", label: "Firm" },
  { href: "/app/bookings/", label: "Bookings" },
  { href: "/app/account/", label: "Account" },
];

export default function LawyerLayout({ children }: { children: React.ReactNode }) {
  return <Shell audience="lawyer" items={items}>{children}</Shell>;
}
