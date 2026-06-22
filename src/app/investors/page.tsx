import { Metadata } from "next";
import { Suspense } from "react";
import InvestorsClient from "./InvestorsClient";

export const metadata: Metadata = {
  title: "For Investors | Professional Services",
  description: "Premium IPO investment tools, private equity opportunities, GMP tracking, and expert advisory for HNI and institutional investors.",
  alternates: {
    canonical: "https://www.indiaipo.in/investors",
  },
};

export default function InvestorsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <InvestorsClient />
    </Suspense>
  );
}
