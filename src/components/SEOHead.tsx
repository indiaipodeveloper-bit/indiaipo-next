"use client";
import { useEffect, useState } from "react";
import { useCanonicalUrl } from "@/hooks/useCanonicalUrl";
import { usePathname } from "next/navigation";
import { API_URL } from "@/lib/constants";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: any;
  noindex?: boolean;
  canonicalPath?: string;
}

const SEOHead = ({
  title,
  description,
  keywords,
  ogImage,
  ogType = "website",
  jsonLd,
  noindex,
  canonicalPath,
}: SEOProps) => {
  const pathname = usePathname();
  const canonicalUrl = useCanonicalUrl(canonicalPath);
  const [globalSeo, setGlobalSeo] = useState<any>(null);

  useEffect(() => {
    const fetchGlobalSEO = async () => {
      try {
        const res = await fetch(`${API_URL}/api/seo`);
        const data = await res.json();
        if (data && !data.error) {
          setGlobalSeo(data);
        }
      } catch (err) {
        console.error("SEO fetch error:", err);
      }
    };
    fetchGlobalSEO();
  }, []);

  const finalTitle =
    title || globalSeo?.meta_title || "India IPO - India's Leading IPO Consultancy";
  const finalDescription =
    description ||
    globalSeo?.meta_description ||
    "Expert advisory for SME IPO, Mainline IPO, FPO, and Pre-IPO funding.";
  const finalKeywords =
    keywords || globalSeo?.keywords || "IPO, SME IPO, GMP tracker, IPO India, SEBI";
  const finalOgImage =
    ogImage || globalSeo?.og_image || "https://www.indiaipo.in/og-image.jpg";

  const isRoot = pathname === "/" || pathname === "/2";
  const fullTitle = isRoot ? finalTitle : `${finalTitle} | India IPO`;

  const robotsContent = noindex ? "noindex, nofollow" : "index, follow";

  return (
    <>
      <title>{fullTitle}</title>
      <link rel="canonical" href={canonicalUrl} />
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="robots" content={robotsContent} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalOgImage} />

      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </>
  );
};

export default SEOHead;
