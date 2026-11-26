import { Suspense } from "react";
import MapPage from "./MapPage";
export const metadata = { title: "Find a verified lawyer near you · APPogado prototype" };
export default function Page() {
  return <Suspense fallback={<p aria-busy="true" style={{ padding: 24 }}>Loading the map…</p>}><MapPage /></Suspense>;
}
