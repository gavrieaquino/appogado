import { notFound } from "next/navigation";
import { fullName, lawyerById, lawyers } from "@/lib/data";
import Profile from "./Profile";

export const dynamicParams = false;
export function generateStaticParams() { return lawyers.map((l) => ({ id: l.id })); }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const l = lawyerById((await params).id);
  return { title: l ? `${fullName(l)} · APPogado prototype` : "Lawyer" };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const l = lawyerById((await params).id);
  if (!l) notFound();
  return <Profile id={l.id} />;
}
