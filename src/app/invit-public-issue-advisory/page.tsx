import { Metadata } from "next";
import { servicesData } from "@/data/servicesData";
import InvitPublicIssueClient from "./InvitPublicIssueClient";

const slug = "invit-public-issue-advisory";
const service = servicesData.find((s) => s.slug === slug)!;
const BASE_URL = "https://www.indiaipo.in";

const commonFaqs = [
  {
    q: "How do I know if an SME IPO is right for my company?",
    a: "We assess your financial performance, eligibility criteria and growth plans to determine whether an SME IPO on BSE SME or NSE Emerge is the right fit and whether you are ready for listing.",
  },
  {
    q: "How long does the SME IPO process typically take?",
    a: "The SME IPO timeline usually ranges from 3 to 6 months, depending on your company’s preparedness, documentation and regulatory approvals at each stage of the process.",
  },
  {
    q: "Are your SME IPO advisors experienced?",
    a: "Yes, our advisors have extensive experience in managing SME IPOs, working closely with merchant bankers, legal teams and exchanges to ensure smooth execution and compliance.",
  },
  {
    q: "What are your fee structures?",
    a: "Our fees are structured based on the scope and size of the SME IPO. For capital-raising services, we typically follow a success-fee model linked to the funds raised. For advisory services like valuation and modelling, we charge a fixed professional fee, discussed transparently upfront.",
  },
  {
    q: "Can you assist SME companies from non-metro cities?",
    a: "Absolutely. We have executed SME IPO mandates for companies across Tier 1, Tier 2 and Tier 3 cities in India. Location is not a limitation; we combine on-ground support with secure digital processes.",
  },
];

export const metadata: Metadata = {
  title: `${service.title} | India IPO Advisory Services`,
  description: service.shortDescription,
  keywords: `${service.title}, IPO Consultancy India, ${service.category}, expert IPO advisory, financial services India`,
  alternates: {
    canonical: `${BASE_URL}/${slug}`,
  },
  openGraph: {
    title: `${service.title} | India IPO Advisory Services`,
    description: service.shortDescription,
    url: `${BASE_URL}/${slug}`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/favicon.png`,
        alt: service.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${service.title} | India IPO Advisory Services`,
    description: service.shortDescription,
    images: [`${BASE_URL}/favicon.png`],
  },
};

export default function Page() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: service.title,
    description: service.shortDescription,
    url: `${BASE_URL}/${service.slug}`,
    image: `${BASE_URL}/favicon.png`,
    provider: {
      "@type": "Organization",
      name: "India IPO",
      url: BASE_URL,
      logo: `${BASE_URL}/favicon.png`,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-74283-37280",
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    serviceType: service.category || "IPO Advisory",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.title} Services`,
      itemListElement: (service.keyBenefits || [])
        .slice(0, 5)
        .map((benefit, i) => ({
          "@type": "Offer",
          position: i + 1,
          itemOffered: {
            "@type": "Service",
            name: benefit,
            description: "",
          },
        })),
    },
    inLanguage: "en-IN",
    knowsAbout: [
      "IPO",
      "SME IPO",
      "SEBI Regulations",
      "Capital Markets",
      "India Stock Exchange",
    ],
  };

  const faqsToUse = service.faqs && service.faqs.length > 0 ? service.faqs : commonFaqs;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqsToUse.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <InvitPublicIssueClient />
    </>
  );
}
