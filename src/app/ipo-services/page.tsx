import { Metadata } from "next";
import { Suspense } from "react";
import IPOServicesClient from "./IPOServicesClient";

export const metadata: Metadata = {
  title: "IPO Services — SME IPO, Mainline IPO, FPO & Pre-IPO Funding | India IPO",
  description:
    "Complete IPO advisory services in India. Expert consultation for SME IPO, Mainline IPO, Follow-On Public Offer (FPO), and Pre-IPO Funding. Expert advisory, 500+ successful IPOs.",
  keywords:
    "IPO advisory India, SME IPO consultants, Mainline IPO, FPO advisory, Pre-IPO funding, SEBI IPO process, BSE SME listing, NSE Emerge IPO",
  alternates: {
    canonical: "https://www.indiaipo.in/ipo-services",
  },
};

export default function IPOServicesPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "IPO Services",
    "description": "Complete IPO advisory services in India. Expert consultation for SME IPO, Mainline IPO, Follow-On Public Offer (FPO), and Pre-IPO Funding. Expert advisory, 500+ successful IPOs.",
    "provider": {
      "@type": "FinancialService",
      "name": "India IPO",
      "url": "https://www.indiaipo.in"
    },
    "url": "https://www.indiaipo.in/ipo-services",
    "serviceType": "IPO Advisory",
    "areaServed": "IN"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        }
      >
        <IPOServicesClient />
      </Suspense>
    </>
  );
}
