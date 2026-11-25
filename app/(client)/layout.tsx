import Shell from "@/components/Shell";

const items = [
  { href: "/", label: "nav.home", icon: "home" as const },
  { href: "/describe/", label: "nav.describe", icon: "pen" as const },
  { href: "/find/", label: "nav.find", short: "nav.findShort", icon: "pin" as const },
  { href: "/for-lawyers/", label: "nav.forLawyers", short: "nav.forLawyersShort", icon: "scale" as const },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <Shell audience="client" items={items}>{children}</Shell>;
}
