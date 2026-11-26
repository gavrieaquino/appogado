import Shell from "@/components/Shell";

const items = [
  { href: "/app/", label: "Today", icon: "home" as const, exact: true },
  { href: "/app/inbox/", label: "Inbox", icon: "inbox" as const },
  { href: "/app/ulas/", label: "ULAS hours", short: "ULAS", icon: "clock" as const },
  { href: "/app/bookings/", label: "Bookings", icon: "calendar" as const },
  { href: "/app/account/", label: "Account", icon: "user" as const },
];

export default function LawyerLayout({ children }: { children: React.ReactNode }) {
  return <Shell audience="lawyer" items={items}>{children}</Shell>;
}
