import MerchantBankerDetailClient from "./MerchantBankerDetailClient";
import type { Metadata } from "next";
import { getImageUrl } from "@/lib/utils";
import { redirect } from "next/navigation";

const BASE_URL = "https://www.indiaipo.in";

const cleanGarbledText = (text: string) => {
  if (!text) return "";
  let result = String(text)
    .replace(/\\u20b9/g, "₹")
    .replace(/\\u20b5/g, "₹")
    .replace(/&nbsp;/g, " ")
    .trim();

  if (result.startsWith('"') && result.endsWith('"') && result.length >= 2) {
    result = result.substring(1, result.length - 1);
  }
  return result;
};

interface Banker {
  id: string | number;
  title: string;
  sub_title: string;
  slug: string;
  mcat_id: string | number;
  image: string;
  description: string;
  meta_title: string;
  meta_desc: string;
  meta_keywords: string;
  noOfiposofar: string;
  ipos: string;
  totalfundraised: string;
  avgiposize: string;
  avglisting_gain: string;
  avgsubscription: string;
  faqs: string;
  nseemer: string;
  bsesme: string;
  yearwise_ipolisting: string;
  sme_ipos_by_size: string;
  sme_ipos_by_subscription: string;
  cemail: string;
  cmobile: string;
  caddress: string;
  cweblink: string;
  logo_url?: string;
  name?: string;
  website?: string;
  location?: string;
  email?: string;
  phone?: string;
  total_ipos?: string | number;
  total_raised?: string | number;
  avg_size?: string | number;
  avg_subscription?: string | number;
  avg_listing_gain?: string | number;
}

async function fetchBankerOnServer(slug: string): Promise<Banker | null> {
  const isDev = process.env.NODE_ENV === 'development';
  const apiBase = isDev ? "http://localhost:5000" : "https://www.indiaipo.in";

  try {
    // Try SME first
    let res = await fetch(`${apiBase}/api/bankers/slug/${slug}`, {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      return await res.json();
    }

    // Try Mainboard
    res = await fetch(`${apiBase}/api/mainboard-bankers/slug/${slug}`, {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch banker on server:", err);
  }
  return null;
}

async function fetchRelatedBankersOnServer(banker: Banker): Promise<Banker[]> {
  const isDev = process.env.NODE_ENV === 'development';
  const apiBase = isDev ? "http://localhost:5000" : "https://www.indiaipo.in";

  try {
    const relatedIds = JSON.parse(banker.ipos || "[]");
    if (Array.isArray(relatedIds) && relatedIds.length > 0) {
      const res = await fetch(`${apiBase}/api/bankers?ids=${relatedIds.join(",")}`, {
        next: { revalidate: 60 }
      });
      if (res.ok) {
        const body = await res.json();
        return body.data || [];
      }
    }
  } catch {
    // ignore parsing/fetching errors
  }
  return [];
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const banker = await fetchBankerOnServer(slug);

  if (!banker) {
    return {
      title: "Profile Not Found | India IPO",
      description: "The requested merchant banker profile could not be found.",
    };
  }

  const siteUrl = BASE_URL;
  const bankerImage = getImageUrl(banker.image || banker.logo_url);
  const resolvedImage = bankerImage
    ? (bankerImage.startsWith('http') ? bankerImage : `${siteUrl}${bankerImage.startsWith('/') ? '' : '/'}${bankerImage}`)
    : `${siteUrl}/favicon.png`;

  const metaTitle = banker.meta_title || `${banker.title} | Merchant Banker | India IPO`;
  const metaDescription =
    banker.meta_desc ||
    banker.description?.replace(/<[^>]*>?/gm, "").substring(0, 160) ||
    `Expert merchant banker services from ${banker.title} on India IPO.`;

  const metaKeywords = banker.meta_keywords || "Merchant Banker, SME IPO, BRLM India, capital markets";

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    alternates: {
      canonical: `${siteUrl}/merchant-banker/${banker.slug}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `${siteUrl}/merchant-banker/${banker.slug}`,
      type: "website",
      images: [
        {
          url: resolvedImage,
          alt: banker.title,
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [resolvedImage],
    }
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const banker = await fetchBankerOnServer(slug);

  if (!banker) {
    redirect("/merchant-bankers/list-of-sme-merchant-bankers");
  }

  const related = await fetchRelatedBankersOnServer(banker);
  const siteUrl = BASE_URL;

  const bankerImage = getImageUrl(banker.image || banker.logo_url);
  const resolvedImage = bankerImage
    ? (bankerImage.startsWith('http') ? bankerImage : `${siteUrl}${bankerImage.startsWith('/') ? '' : '/'}${bankerImage}`)
    : `${siteUrl}/favicon.png`;

  // Generate local business / financial service schema for SEO
  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": banker.title,
    "image": resolvedImage,
    "description": banker.description?.replace(/<[^>]*>?/gm, "").substring(0, 200) || banker.sub_title,
    "telephone": banker.cmobile || banker.phone || undefined,
    "email": banker.cemail || banker.email || undefined,
    "address": banker.caddress || banker.location ? {
      "@type": "PostalAddress",
      "streetAddress": banker.caddress || banker.location,
      "addressCountry": "IN"
    } : undefined,
    "url": `${siteUrl}/merchant-banker/${banker.slug}`
  };

  let faqSchemaItems: { question: string; answer: string }[] = [];
  if (banker.faqs && typeof banker.faqs === "string") {
    try {
      const parsed = JSON.parse(banker.faqs);
      if (Array.isArray(parsed)) {
        faqSchemaItems = parsed
          .filter((f: any) => f && (f.question || f.q) && (f.answer || f.a))
          .map((f: any) => ({
            question: cleanGarbledText(String(f.question || f.q)).replace(/<[^>]*>?/gm, "").trim(),
            answer: cleanGarbledText(String(f.answer || f.a)).replace(/<[^>]*>?/gm, "").trim(),
          }));
      }
    } catch (e) {
      // ignore parse errors
    }
  }

  const faqSchema =
    faqSchemaItems.length > 0
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqSchemaItems.map((f) => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer,
          },
        })),
      }
      : null;

  const jsonLd = faqSchema ? [schema, faqSchema] : schema;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MerchantBankerDetailClient banker={banker} relatedBankers={related} />
    </>
  );
}
