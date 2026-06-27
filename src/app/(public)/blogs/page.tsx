import { API_URL } from "@/lib/constants";
import BlogsListingClient from "./BlogsListingClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IPO Blogs & Expert Articles | India IPO — In-depth IPO Analysis",
  description: "Read expert IPO blogs and articles on India IPO. Get comprehensive analysis, reviews and detailed insights on upcoming and current IPO listings in India.",
  keywords: "IPO blogs India, IPO articles, IPO analysis 2025, expert IPO review, India IPO blog, IPO insights",
  alternates: {
    canonical: "https://www.indiaipo.in/blogs",
  },
  openGraph: {
    title: "IPO Blogs & Expert Articles | India IPO",
    description: "Read expert IPO blogs and articles on India IPO. Get comprehensive analysis, reviews and detailed insights on upcoming and current IPO listings in India.",
    url: "https://www.indiaipo.in/blogs",
    type: "website",
  }
};

async function getInitialData() {
  try {
    const blogsRes = await fetch(`${API_URL}/api/admin-blogs?page=1&limit=12&summary=1&category=ipo_blogs`, {
      next: { revalidate: 60 } // cache for 1 minute
    });
    
    let bannersData = [];
    try {
      const bannersRes = await fetch(`${API_URL}/api/banners?page=%2Fblogs`, {
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
    console.error("Failed to load initial blogs on server:", err);
    return { blogs: [], total: 0, totalPages: 1, bannerVideo: null };
  }
}

export default async function BlogsPage() {
  const data = await getInitialData();
  return (
    <BlogsListingClient
      initialBlogs={data.blogs}
      initialTotal={data.total}
      initialTotalPages={data.totalPages}
      initialBannerVideo={data.bannerVideo}
    />
  );
}