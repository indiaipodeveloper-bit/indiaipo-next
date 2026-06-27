import NewsDetailsClient from "./NewsDetailsClient";
import type { Metadata } from "next";
import { getImgSrc } from "@/utils/image";
import { redirect } from "next/navigation";
import { API_URL, BASE_URL } from "@/lib/constants";

interface ApiNews {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  published_at: string;
  image: string;
  category: string;
  latest_news: number;
  trending_news: number;
  author?: string;
  created_at?: string;
  updated_at?: string;
  meta_title?: string;
  keyword?: string;
}

async function fetchNewsOnServer(slug: string): Promise<ApiNews | null> {
  try {
    const res = await fetch(`${API_URL}/api/news/${slug}`, {
      next: { revalidate: 60 } // cache for 1 minute
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch news on server:", err);
  }
  return null;
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const news = await fetchNewsOnServer(slug);

  if (!news) {
    return {
      title: "News Not Found | India IPO",
      description: "The requested news article could not be found.",
    };
  }

  const siteUrl = BASE_URL;
  const newsImageSrc = getImgSrc(news.image);
  const resolvedImage = newsImageSrc
    ? (newsImageSrc.startsWith('http') ? newsImageSrc : `${siteUrl}${newsImageSrc.startsWith('/') ? '' : '/'}${newsImageSrc}`)
    : `${siteUrl}/favicon.png`;

  const metaTitle = news.meta_title || `${news.title} | India IPO`;
  const metaDescription = news.description || `Read about ${news.title} on India IPO.`;
  const metaKeywords = news.keyword || "IPO news, India IPO news, market news, stock market updates";

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    alternates: {
      canonical: `${siteUrl}/news/detail/${news.slug || news.id}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `${siteUrl}/news/detail/${news.slug || news.id}`,
      type: "article",
      images: [
        {
          url: resolvedImage,
          alt: news.title,
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
  const news = await fetchNewsOnServer(slug);

  if (!news) {
    redirect("/news");
  }

  const siteUrl = BASE_URL;
  const newsImageSrc = getImgSrc(news.image);
  const resolvedImage = newsImageSrc
    ? (newsImageSrc.startsWith('http') ? newsImageSrc : `${siteUrl}${newsImageSrc.startsWith('/') ? '' : '/'}${newsImageSrc}`)
    : `${siteUrl}/favicon.png`;

  // Build JSON-LD schema
  const newsSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": news.title,
    "description": news.description || `Read about ${news.title} on India IPO.`,
    "image": [resolvedImage],
    "datePublished": (news.published_at && !isNaN(new Date(news.published_at).getTime()))
      ? new Date(news.published_at).toISOString()
      : (news.created_at && !isNaN(new Date(news.created_at).getTime()))
        ? new Date(news.created_at).toISOString()
        : new Date().toISOString(),
    "dateModified": (news.updated_at && !isNaN(new Date(news.updated_at).getTime()))
      ? new Date(news.updated_at).toISOString()
      : new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": news.author || "India IPO",
      "url": siteUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "India IPO",
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/favicon.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/news/detail/${news.slug || news.id}`
    },
    "keywords": news.keyword || "IPO news, India IPO, market updates",
    "articleSection": (news.category || 'IPO').replace(/_/g, ' '),
    "inLanguage": "en-IN"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsSchema) }}
      />
      <NewsDetailsClient initialNews={news} slug={slug} />
    </>
  );
}