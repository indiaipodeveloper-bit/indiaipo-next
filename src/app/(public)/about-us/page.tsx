import { Metadata } from "next";
import { Suspense } from "react";
import AboutClient from "../about/AboutClient";

export const metadata: Metadata = {
  title: "About India IPO - India's Premier IPO Consultancy",
  description: "Learn about India IPO — India's premier IPO consultancy with 140+ successful listings. Expert advisory for SME IPO, Mainboard, FPO and Pre-IPO funding.",
  keywords: "India IPO, about, IPO consultancy, expert advisors, merchant banker, SEBI, DRHP",
  alternates: {
    canonical: "https://www.indiaipo.in/about-us",
  },
};

export default function AboutUsPage() {
  const siteUrl = "https://www.indiaipo.in";
  const aboutSchema = [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About India IPO",
      "description": "India's premier IPO consultancy with 140+ successful listings. Expert advisory for SME IPO, Mainboard IPO, FPO and Pre-IPO funding.",
      "url": `${siteUrl}/about-us`,
      "inLanguage": "en-IN",
      "publisher": {
        "@type": "Organization",
        "name": "India IPO",
        "url": siteUrl
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "India IPO",
      "url": siteUrl,
      "logo": { "@type": "ImageObject", "url": `${siteUrl}/favicon.png` },
      "foundingDate": "2018",
      "description": "India's most trusted IPO advisory and consultancy platform offering expert services for SME IPO, Mainline IPO, FPO, Pre-IPO funding and capital structuring.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "808, 8th Floor, D-Mall, Netaji Subhash Place, Pitampura",
        "addressLocality": "Delhi",
        "postalCode": "110034",
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-74283-37280",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"]
      },
      "numberOfEmployees": { "@type": "QuantitativeValue", "minValue": 10, "maxValue": 50 },
      "knowsAbout": ["IPO Advisory", "SME IPO", "SEBI Regulations", "Capital Markets", "DRHP", "Business Valuation"]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      }>
        <AboutClient />
      </Suspense>
    </>
  );
}
