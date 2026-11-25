import { Suspense } from "react";
import BriefView from "./BriefView";
export const metadata = { title: "Brief · APPogado for lawyers (prototype)" };
export default function Page() {
  return <Suspense fallback={<p aria-busy="true">Loading brief…</p>}><BriefView /></Suspense>;
}
