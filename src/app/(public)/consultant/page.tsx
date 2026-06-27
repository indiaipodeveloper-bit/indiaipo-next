import { Metadata } from "next";
import { Suspense } from "react";
import ConsultantsClient from "./ConsultantsClient";

export const metadata: Metadata = {
  title: "IPO Consultants in India | IndiaIPO — Expert SEBI Advisory",
  description: "Partner with India's most trusted IPO consultants. SEBI-compliant advisory for SME and Mainboard IPOs. Expert guidance for a successful public listing.",
  keywords: "IPO consultants India, SEBI advisory, SME IPO consultant, mainboard IPO expert, capital market advisory India, IPO listing guidance",
  alternates: {
    canonical: "https://www.indiaipo.in/consultant",
  },
};

export default function ConsultantPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001529]"></div>
      </div>
    }>
      <ConsultantsClient />
    </Suspense>
  );
}
