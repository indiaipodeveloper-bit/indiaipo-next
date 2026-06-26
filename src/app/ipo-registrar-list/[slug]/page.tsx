import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RegistrarDetailsClient from "./RegistrarDetailsClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { API_URL, BASE_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getRegistrarDetails(slug: string) {

  try {
    const res = await fetch(`${API_URL}/api/registrars/slug/${slug}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (!data || !data.id) return null;

    let faqs = [];
    if (data.faqs) {
      try {
        const parsed = JSON.parse(data.faqs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          faqs = parsed.map((f: any) => ({
            question: f.q || f.question || "",
            answer: f.a || f.answer || ""
          }));
        }
      } catch (err) {
        console.warn("Failed to parse registrar faqs:", err);
      }
    }

    if (faqs.length === 0) {
      try {
        const globalRes = await fetch(`${API_URL}/api/registrar-faqs/active`, {
          next: { revalidate: 60 }
        });
        if (globalRes.ok) {
          const globalFaqs = await globalRes.json();
          faqs = globalFaqs.map((f: any) => ({
            question: f.question || f.q || "",
            answer: f.answer || f.a || ""
          }));
        }
      } catch (err) {
        console.warn("Failed to fetch global faqs:", err);
      }
    }

    return { registrar: data, faqs };
  } catch (err) {
    console.error(`Failed to load registrar ${slug} on server:`, err);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getRegistrarDetails(slug);
  if (!data) {
    return {
      title: "Registrar Not Found | India IPO",
      description: "The requested registrar profile could not be found."
    };
  }

  const { registrar } = data;
  const title = registrar.meta_title || `${registrar.name} IPO Registrar & Allotment | India IPO`;
  const description = registrar.meta_desc || `Detailed profile of IPO Registrar ${registrar.name}. Check track record, serviced IPOs, contact details, and allotment status.`;
  const canonicalUrl = `${BASE_URL}/ipo-registrar-list/${slug}`;

  return {
    title,
    description,
    keywords: registrar.meta_keywords || "IPO registrar, registrar profile, share allotment",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
    }
  };
}

export default async function RegistrarDetailPage({ params }: Props) {
  const { slug } = await params;
  const data = await getRegistrarDetails(slug);

  if (!data) {
    notFound();
  }

  const { registrar, faqs } = data;

  // Schema Injection
  const schemas: any[] = [
    {
      "@context": "https://schema.org",
      "@type": "FinancialService",
      "name": registrar.name,
      "description": registrar.meta_desc || `${registrar.name} is a SEBI-registered Registrar and Transfer Agent (RTA) providing IPO processing, allotment and share registry services in India.`,
      "url": `${BASE_URL}/ipo-registrar-list/${registrar.slug}`,
      "image": registrar.image ? (registrar.image.startsWith('http') ? registrar.image : `${BASE_URL}/${registrar.image}`) : `${BASE_URL}/favicon.png`,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": registrar.location || "India",
        "addressCountry": "IN"
      },
      "areaServed": { "@type": "Country", "name": "India" },
      "serviceType": "IPO Registrar & Transfer Agent",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Registry Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "IPO Application Processing" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Basis of Allotment Finalization" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Refund & Share Credit" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Dividend Disbursal" } }
        ]
      },
      "knowsAbout": ["IPO", "SME IPO", "Mainboard IPO", "SEBI", "Share Allotment", "RTA"]
    }
  ];

  if (faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((f: any) => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": { "@type": "Answer", "text": f.answer }
      }))
    });
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <Header />
      <RegistrarDetailsClient registrar={registrar} faqs={faqs} />
      <Footer />
    </>
  );
}
