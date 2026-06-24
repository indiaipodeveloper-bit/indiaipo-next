import { Metadata } from "next";
import { Suspense } from "react";
import HomeClient from "./HomeClient";
import { academyItems, faqItems } from "@/data/academyFaqData";

export const metadata: Metadata = {
  title: "India IPO Consultant - SME & Mainboard IPO Advisory",
  description: "India's most trusted IPO consultancy for SME & Mainboard IPO advisory. SEBI-compliant, end-to-end IPO services across Delhi, Mumbai & pan-India. 140+ successful IPOs.",
  keywords: "IPO, SME IPO, GMP tracker, IPO India, Expert Advisory",
  alternates: {
    canonical: "https://www.indiaipo.in",
  },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "India IPO",
        "url": "https://www.indiaipo.in",
        "logo": "https://www.indiaipo.in/logo.png",
        "sameAs": [
          "https://www.facebook.com/01indiapo",
          "https://x.com/india_ipo1",
          "https://www.linkedin.com/company/india-ipo/",
          "https://www.instagram.com/india_ipo1"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-74283-37280",
          "contactType": "customer service",
          "email": "info@indiaipo.in",
          "areaServed": "IN",
          "availableLanguage": ["en", "hi"]
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          ...academyItems.map((item) => ({
            "@type": "Question",
            "name": item.title,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.desc,
            },
          })),
          ...faqItems.map((item) => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.a,
            },
          })),
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      }>
        <HomeClient />
      </Suspense>
    </>
  );
}
