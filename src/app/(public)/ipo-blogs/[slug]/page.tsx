import IPOBlogDetailsClient from "./IPOBlogDetailsClient";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getImageUrl } from "@/lib/utils";
import { API_URL, BASE_URL } from "@/lib/constants";

interface AdminBlogFull {
  id: string;
  title: string;
  slug: string;
  new_slug?: string;
  image: string;
  content: string;
  faqs: string;
  status: string;
  confidential: string;
  upcoming: string;
  category: string;
  new_highlight_text: string;
  gmp_date: string;
  gmp_ipo_price: string;
  gmp: string;
  gmp_last_updated: string;
  ipo_details: string;
  ipo_description: string;
  ipo_timeline_details: string;
  ipo_timeline_description: string;
  ipo_lots_application: string;
  ipo_lots: string;
  ipo_lots_share: string;
  ipo_lots_amount: string;
  promotor_hold_pre_issue: string;
  promotor_hold_post_issue: string;
  finantial_information_ended: string;
  finantial_information_assets: string;
  finantial_information_revenue: string;
  finantial_information_profit_tax: string;
  financial_info_reserves_surplus: string;
  finantial_information_networth: string;
  finantial_information_borrowing: string;
  key_kpi: string;
  key_value: string;
  key_pri_ipo_eps: string;
  key_pos_ipo_eps: string;
  key_pre_ipo_pe: string;
  key_post_ipo_pe: string;
  competative_strenght: string;
  meta_title: string;
  description: string;
  keyword: string;
  rhp: string;
  drhp: string;
  confidential_drhp: string;
  confidential_drhp_description: string;
  confidential_drhp_date: string;
  state: string;
  city: string;
  pincode: string;
  drhp_status: string;
  linked_digest_id: string;
  linked_digest_pdf?: string;
  recientipo: string;
  private_equity: string;
  business_economics_update: string;
  geopolitical_update: string;
  source: string;
  created_at: string;
  updated_at?: string;
}

const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
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
  const blogImage = getImageUrl(blog.image);
  const resolvedImage = blogImage
    ? (blogImage.startsWith("http")
      ? blogImage
      : `${siteUrl}${blogImage.startsWith("/") ? "" : "/"}${blogImage}`)
    : `${siteUrl}/favicon.png`;

  const metaTitle = stripHtml(blog.meta_title) || `${stripHtml(blog.title)} - India IPO`;
  const metaDescription = stripHtml(blog.description) || `Read details and updates about ${stripHtml(blog.title)}`;
  const metaKeywords = blog.keyword || "IPO, SME IPO, India IPO, stock market";

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    alternates: {
      canonical: `${siteUrl}/ipo-blogs/${blog.new_slug || blog.slug}`,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `${siteUrl}/ipo-blogs/${blog.new_slug || blog.slug}`,
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
    redirect("/ipo-blogs");
  }

  // Handle redirects based on category
  const category = blog.category;
  if (category === "ipo_blogs") {
    redirect(`/blogs/${slug}`);
  } else if (category === "daily_reporter") {
    redirect(`/daily-reporter/${slug}`);
  } else if (category === "city_blogs") {
    redirect(`/consultant/${slug}`);
  } else if (category !== "ipo_updates") {
    redirect("/ipo-blogs");
  }

  const siteUrl = BASE_URL;
  const blogImage = getImageUrl(blog.image);
  const resolvedImage = blogImage
    ? (blogImage.startsWith("http")
      ? blogImage
      : `${siteUrl}${blogImage.startsWith("/") ? "" : "/"}${blogImage}`)
    : `${siteUrl}/favicon.png`;

  // Build JSON-LD schemas
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: stripHtml(blog.meta_title || blog.title),
    description: stripHtml(
      blog.description || `Read details and updates about ${blog.title}`,
    ),
    datePublished:
      blog.created_at && !String(blog.created_at).startsWith("0000") && !isNaN(new Date(blog.created_at).getTime())
        ? new Date(blog.created_at).toISOString()
        : blog.updated_at && !String(blog.updated_at).startsWith("0000") && !isNaN(new Date(blog.updated_at).getTime())
          ? new Date(blog.updated_at).toISOString()
          : new Date().toISOString(),
    dateModified: new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "India IPO",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "India IPO",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/${blog.category === "daily_reporter" ? "daily-reporter" : "ipo-blogs"}/${blog.new_slug || blog.slug}`,
    },
    keywords: blog.keyword || "IPO, SME IPO, India IPO, stock market",
    articleSection: (blog.category || "IPO").replace(/_/g, " "),
    inLanguage: "en-IN",
  };

  let faqSchemaItems: { question: string; answer: string }[] = [];
  if (blog.faqs && typeof blog.faqs === "string") {
    try {
      const parsed = JSON.parse(blog.faqs);
      if (Array.isArray(parsed)) {
        faqSchemaItems = parsed
          .filter((f: any) => f && f.question && f.answer)
          .map((f: any) => ({
            question: stripHtml(String(f.question)),
            answer: stripHtml(String(f.answer)),
          }));
      }
    } catch (e) {
      /* ignore parse errors */
    }
  }

  const faqSchema =
    faqSchemaItems.length > 0
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqSchemaItems.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
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
      <IPOBlogDetailsClient initialBlog={blog} slug={slug} />
    </>
  );
}
