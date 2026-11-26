import { Suspense } from "react";
import Directory from "./Directory";
export const metadata = { title: "Find a verified lawyer · APPogado prototype" };
export default function Page() {
  return <Suspense fallback={<p aria-busy="true">Loading lawyers…</p>}><Directory /></Suspense>;
}
