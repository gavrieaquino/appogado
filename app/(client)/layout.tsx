import Shell from "@/components/Shell";

const items = [
  { href: "/", label: "nav.home" },
  { href: "/describe/", label: "nav.describe" },
  { href: "/find/", label: "nav.find" },
  { href: "/for-lawyers/", label: "nav.forLawyers" },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <Shell audience="client" items={items}>{children}</Shell>;
}
