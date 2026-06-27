import { Metadata } from "next";
import { Suspense } from "react";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | India IPO",
  description: "Get in touch with India IPO for IPO consultancy, pre-IPO funding, and capital market advisory. Visit our offices in Delhi and Mumbai.",
  keywords: "contact India IPO, IPO consultation, IPO advisory contact, India IPO Delhi, India IPO Mumbai",
  alternates: {
    canonical: "https://www.indiaipo.in/contact",
  },
};

const faqs = [
  {
    q: "What services does India IPO offer?",
    a: "India IPO provides end-to-end IPO advisory services including pre-IPO funding, DRHP preparation, regulatory compliance, merchant banking, and post-listing support for both SME and Mainboard IPOs.",
  },
  {
    q: "How can I apply for an IPO through India IPO?",
    a: "You can apply through our platform by creating an account, linking your ASBA-enabled bank account or UPI ID, and submitting your application for any open IPO. Our team is available to guide you at every step.",
  },
  {
    q: "What is the typical response time for enquiries?",
    a: "We typically respond to all queries within 24 business hours. For urgent matters, you can reach us on our WhatsApp or call our office directly during business hours.",
  },
  {
    q: "Does India IPO assist with SME IPOs?",
    a: "Yes, we have a dedicated SME IPO desk that assists companies in raising capital through NSE Emerge and BSE SME platforms, offering complete end-to-end support.",
  },
  {
    q: "Is India IPO registered with SEBI?",
    a: "India IPO works in collaboration with official merchant bankers and intermediaries. We ensure all project execution follows the regulatory guidelines strictly.",
  },
];

export default function ContactPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact India IPO",
      "description": "Get in touch with India IPO for IPO consultancy, advisory and capital market services.",
      "url": "https://www.indiaipo.in/contact",
      "inLanguage": "en-IN",
      "publisher": {
        "@type": "Organization",
        "name": "India IPO",
        "url": "https://www.indiaipo.in",
        "telephone": "+91-74283-37280",
        "email": "info@indiaipo.in",
        "address": [
          {
            "@type": "PostalAddress",
            "streetAddress": "808, 8th Floor, D-Mall, Netaji Subhash Place, Pitampura",
            "addressLocality": "Delhi",
            "postalCode": "110034",
            "addressCountry": "IN"
          },
          {
            "@type": "PostalAddress",
            "streetAddress": "Office No. 601, Shagun Insignia, Ulwe, Sector-19",
            "addressLocality": "Navi Mumbai",
            "postalCode": "410206",
            "addressCountry": "IN"
          }
        ]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      }>
        <ContactClient />
      </Suspense>
    </>
  );
}
