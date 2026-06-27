import type { Metadata } from "next";
import { Suspense } from "react";
import ProfitCalculatorClient from "./ProfitCalculatorClient";

export const metadata: Metadata = {
  title: "IPO Profit & Shares Application Calculator | India IPO",
  description: "Calculate how many lots/shares to apply for based on your budget for SME & Mainboard IPOs. Estimate potential listing gains using Grey Market Premium (GMP).",
  keywords: "RCL Retail IPO, IPO profit calculator, shares to apply calculator, SME IPO lots calculator, listing gain calculator, India IPO tools",
  alternates: {
    canonical: "https://www.indiaipo.in/ipo-tools/profit-calculator",
  },
  openGraph: {
    title: "IPO Profit & Shares Application Calculator | India IPO",
    description: "Calculate how many lots/shares to apply for based on your budget for SME & Mainboard IPOs. Estimate potential listing gains using Grey Market Premium (GMP).",
    type: "website",
    url: "https://www.indiaipo.in/ipo-tools/profit-calculator",
  },
};

export default function ProfitCalculatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ProfitCalculatorClient />
    </Suspense>
  );
}
