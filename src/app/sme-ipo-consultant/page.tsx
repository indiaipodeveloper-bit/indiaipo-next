import { Metadata } from "next";
import { Suspense } from "react";
import SmeIpoClient from "./SmeIpoClient";

export const metadata: Metadata = {
  title: "SME IPO Consultation | India IPO Advisory Services",
  description:
    "End-to-end advisory for Small and Medium Enterprise IPOs on BSE SME and NSE Emerge platforms.",
  keywords: "sme ipo consultation, bse sme, nse emerge, sme ipo requirements",
  alternates: {
    canonical: "https://www.indiaipo.in/sme-ipo-consultant",
  },
};

export default function SmeIpoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      }
    >
      <SmeIpoClient />
    </Suspense>
  );
}
