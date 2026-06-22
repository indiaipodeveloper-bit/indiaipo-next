
import IPOBlogsClient from "./IPOBlogsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IPO Blogs & Updates | India IPO — GMP, Reviews & Analysis",
  description: "Read the latest updates, GMP reviews and comprehensive details about Current and Upcoming IPOs in India. Expert analysis and market insights.",
  keywords: "IPO blogs India, IPO GMP today, IPO review, current IPO list, upcoming IPO 2025, IPO analysis India IPO",
  alternates: {
    canonical: "https://www.indiaipo.in/ipo-blogs",
  },
  openGraph: {
    title: "IPO Blogs & Updates | India IPO — GMP, Reviews & Analysis",
    description: "Read the latest updates, GMP reviews and comprehensive details about Current and Upcoming IPOs in India. Expert analysis and market insights.",
    url: "https://www.indiaipo.in/ipo-blogs",
    type: "website",
  }
};

async function getInitialData() {
  const isDev = process.env.NODE_ENV === 'development';
  const apiBase = isDev ? "http://localhost:5000" : "https://www.indiaipo.in";
  try {
    // Default filter is "current" (upcoming=0)
    const blogsRes = await fetch(`${apiBase}/api/admin-blogs?page=1&limit=12&summary=1&category=ipo_updates&upcoming=0`, {
      next: { revalidate: 60 } // cache for 1 minute
    });

    let bannersData = [];
    try {
      const bannersRes = await fetch(`${apiBase}/api/banners?page=%2Fipo-blogs`, {
        next: { revalidate: 60 }
      });
      if (bannersRes.ok) bannersData = await bannersRes.json();
    } catch {
      // banners is optional
    }

    const blogsData = blogsRes.ok ? await blogsRes.json() : { data: [], total: 0, totalPages: 1 };
    const videoBanner = bannersData.find((b: any) => b.video_url);

    return {
      blogs: blogsData.data || [],
      total: blogsData.total || 0,
      totalPages: blogsData.totalPages || 1,
      bannerVideo: videoBanner ? videoBanner.video_url : null,
    };
  } catch (err) {
    console.error("Failed to load initial ipo blogs on server:", err);
    return { blogs: [], total: 0, totalPages: 1, bannerVideo: null };
  }
}

export default async function IPOBlogsPage() {
  const data = await getInitialData();

  const siteUrl = "https://www.indiaipo.in";
  const itemListSchema = data.blogs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "IPO Blogs & Updates | India IPO",
    "description": "Latest IPO blogs, GMP updates and market analysis for Current and Upcoming IPOs in India.",
    "url": `${siteUrl}/ipo-blogs`,
    "numberOfItems": data.blogs.length,
    "itemListElement": data.blogs.map((blog: any, idx: number) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "url": `${siteUrl}/ipo-blogs/${blog.slug || blog.id}`,
      "name": blog.title
    }))
  } : null;

  return (
    <>
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <IPOBlogsClient
        initialBlogs={data.blogs}
        initialTotal={data.total}
        initialTotalPages={data.totalPages}
        initialBannerVideo={data.bannerVideo}
      />
    </>
  );
}
