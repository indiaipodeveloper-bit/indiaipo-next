import BlogDetailsClient from "./BlogDetailsClient";
import type { Metadata } from "next";
import { getImgSrc } from "@/utils/image";
import { redirect } from "next/navigation";
import { API_URL, BASE_URL } from "@/lib/constants";

interface AdminBlogFull {
  id: string; title: string; slug: string;
  image: string; content: string; faqs: string; status: string;
  category: string; description: string;
  meta_title: string; keyword: string;
  created_at: string;
  updated_at?: string;
}

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

async function fetchBlogOnServer(slug: string): Promise<AdminBlogFull | null> {
  try {
    const res = await fetch(`${API_URL}/api/admin-blogs/${slug}`, {
      next: { revalidate: 60 } // cache for 1 minute
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch blog on server:", err);
  }
  return null;
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await fetchBlogOnServer(slug);

  if (!blog) {
    return {
      title: "Blog Not Found | India IPO",
      description: "The requested blog post could not be found.",
    };
  }

  const siteUrl = BASE_URL;
  const blogImageSrc = getImgSrc(blog.image);
  const resolvedImage = blogImageSrc
    ? (blogImageSrc.startsWith('http') ? blogImageSrc : `${siteUrl}${blogImageSrc.startsWith('/') ? '' : '/'}${blogImageSrc}`)
    : `${siteUrl}/favicon.png`;

  const metaTitle = blog.meta_title || `${blog.title} | India IPO`;
  const metaDescription = blog.description || `Read about ${blog.title} on India IPO.`;
  const metaKeywords = blog.keyword || "IPO blog, IPO article, India IPO";

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    alternates: {
      canonical: `${siteUrl}/blogs/${blog.slug}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `${siteUrl}/blogs/${blog.slug}`,
      type: "article",
      images: [
        {
          url: resolvedImage,
          alt: blog.title,
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
  const blog = await fetchBlogOnServer(slug);

  if (!blog) {
    redirect("/blogs");
  }

  // Handle redirects based on category
  const category = blog.category;
  if (category === "ipo_updates") {
    redirect(`/ipo-blogs/${slug}`);
  } else if (category === "daily_reporter") {
    redirect(`/daily-reporter/${slug}`);
  } else if (category === "city_blogs") {
    redirect(`/consultant/${slug}`);
  } else if (category !== "ipo_blogs") {
    redirect("/blogs");
  }

  const siteUrl = BASE_URL;
  const blogImageSrc = getImgSrc(blog.image);
  const resolvedImage = blogImageSrc
    ? (blogImageSrc.startsWith('http') ? blogImageSrc : `${siteUrl}${blogImageSrc.startsWith('/') ? '' : '/'}${blogImageSrc}`)
    : `${siteUrl}/favicon.png`;

  // Build JSON-LD schemas
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.meta_title || blog.title,
    "description": blog.description || `Read about ${blog.title} on India IPO.`,
    "image": [resolvedImage],
    "datePublished": (blog.created_at && !isNaN(new Date(blog.created_at).getTime()))
      ? new Date(blog.created_at).toISOString()
      : (blog.updated_at && !isNaN(new Date(blog.updated_at).getTime()))
        ? new Date(blog.updated_at).toISOString()
        : new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "India IPO",
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
      "@id": `${siteUrl}/blogs/${blog.slug}`
    },
    "keywords": blog.keyword || "IPO article, IPO analysis, India IPO, capital markets",
    "articleSection": (blog.category || 'IPO').replace(/_/g, ' '),
    "inLanguage": "en-IN",
    "wordCount": Math.ceil((blog.content || "").length / 5) || 0
  };

  let faqSchemaItems: { question: string; answer: string }[] = [];
  if (blog.faqs && typeof blog.faqs === "string") {
    try {
      const parsed = JSON.parse(blog.faqs);
      if (Array.isArray(parsed)) {
        faqSchemaItems = parsed
          .filter((f: any) => f && f.question && f.answer)
          .map((f: any) => ({
            question: cleanGarbledText(String(f.question)).replace(/<[^>]*>?/gm, "").trim(),
            answer: cleanGarbledText(String(f.answer)).replace(/<[^>]*>?/gm, "").trim(),
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

  const jsonLd = faqSchema ? [articleSchema, faqSchema] : articleSchema;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDetailsClient initialBlog={blog} slug={slug} />
    </>
  );
}
