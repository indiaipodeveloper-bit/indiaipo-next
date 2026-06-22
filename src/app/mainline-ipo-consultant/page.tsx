import { Metadata } from "next";
import { Suspense } from "react";
import MainlineIpoClient from "./MainlineIpoClient";

export const metadata: Metadata = {
  title: "Mainline IPO Consultation | India IPO Advisory Services",
  description:
    "Structured IPO advisory for mainboard IPOs, helping companies prepare, structure and execute listings with full regulatory compliance and strong institutional participation.",
  keywords: "mainline ipo consultation, mainboard ipo, nse mainline, bse mainline, sebi compliance",
  alternates: {
    canonical: "https://www.indiaipo.in/mainline-ipo-consultant",
  },
};

export default function MainlineIpoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      }
    >
      <MainlineIpoClient />
    </Suspense>
  );
}
