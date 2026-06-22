import { Metadata } from "next";
import { Suspense } from "react";
import MerchantContactClient from "./MerchantContactClient";

export const metadata: Metadata = {
  title: "Contact Merchant Bankers | India IPO",
  description: "Connect with top merchant bankers for SME and Mainboard IPO advisory services. Get expert insights and professional consultation.",
  keywords: "merchant banker contact, IPO advisory, SME IPO consultants, mainline IPO bankers, India IPO contact",
  alternates: {
    canonical: "https://www.indiaipo.in/merchant-contact",
  },
};

export default function MerchantContactPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001529]"></div>
      </div>
    }>
      <MerchantContactClient />
    </Suspense>
  );
}
