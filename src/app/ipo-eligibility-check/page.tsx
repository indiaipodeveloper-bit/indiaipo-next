import { Metadata } from "next";
import { Suspense } from "react";
import EligibilityCheckClient from "./EligibilityCheckClient";

export const metadata: Metadata = {
  title: "Check IPO Eligibility | India IPO",
  description: "Comprehensive IPO Eligibility check. Evaluate your company's readiness for Mainboard or SME IPO with our elite expert advisors.",
  keywords: "IPO Eligibility, IPO readiness, SME IPO check, Mainboard IPO eligibility",
  alternates: {
    canonical: "https://www.indiaipo.in/ipo-eligibility-check",
  },
};

export default function EligibilityCheckPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <EligibilityCheckClient />
    </Suspense>
  );
}
