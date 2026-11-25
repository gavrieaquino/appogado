import Shell from "@/components/Shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <Shell audience="admin" items={[{ href: "/admin/verification/", label: "Verification", icon: "shield" }]}>{children}</Shell>;
}
