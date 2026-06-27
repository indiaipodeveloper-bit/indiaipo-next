import { Metadata } from "next";
import { Suspense } from "react";
import CareersClient from "./CareersClient";

export const metadata: Metadata = {
  title: "Careers at India IPO | Join India's Leading IPO Advisory Platform",
  description: "Launch your career with India's leading IPO advisory and consultancy platform. Apply today to join our team of SEBI compliance, finance, and capital markets experts.",
  keywords: "careers India IPO, IPO advisory jobs, capital markets career India, SEBI compliance jobs, finance jobs India",
  alternates: {
    canonical: "https://www.indiaipo.in/career",
  },
};

export default function CareerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001529]"></div>
      </div>
    }>
      <CareersClient />
    </Suspense>
  );
}
