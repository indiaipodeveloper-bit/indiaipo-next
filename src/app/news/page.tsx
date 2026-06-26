import { API_URL } from "@/lib/constants";
import NewsUpdatesClient from "./NewsUpdatesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Updates | India IPO — Latest IPO & Market News",
  description: "Stay ahead with the latest IPO news, regulatory updates, BSE/NSE market updates, and capital market insights from India IPO — India's most trusted IPO advisory.",
  keywords: "IPO news India, market updates, NSE BSE market news, IPO market updates, capital market news, India IPO news",
  alternates: {
    canonical: "https://www.indiaipo.in/news",
  },
  openGraph: {
    title: "News & Updates | India IPO — Latest IPO & Market News",
    description: "Stay ahead with the latest IPO news, regulatory updates, BSE/NSE market updates, and capital market insights from India IPO — India's most trusted IPO advisory.",
    url: "https://www.indiaipo.in/news",
    type: "website",
  }
};

async function getInitialData() {
  try {
    const newsRes = await fetch(`${API_URL}/api/news?page=1&limit=9`, {
      next: { revalidate: 60 } // cache for 1 minute
    });
    
    let bannersData = [];
    try {
      const bannersRes = await fetch(`${API_URL}/api/banners?page=%2Fnews`, {
        next: { revalidate: 60 }
      });
      if (bannersRes.ok) bannersData = await bannersRes.json();
    } catch {
      // banners is optional
    }
    
    const newsData = newsRes.ok ? await newsRes.json() : { data: [], pagination: { total: 0 } };
    const videoBanner = bannersData.find((b: any) => b.video_url);
    const total = newsData.pagination?.total || 0;
    
    return {
      news: newsData.data || [],
      total: total,
      totalPages: Math.ceil(total / 9) || 1,
      bannerVideo: videoBanner ? videoBanner.video_url : null,
    };
  } catch (err) {
    console.error("Failed to load initial news on server:", err);
    return { news: [], total: 0, totalPages: 1, bannerVideo: null };
  }
}

export default async function NewsPage() {
  const data = await getInitialData();
  
  return (
    <NewsUpdatesClient
      initialNews={data.news}
      initialTotal={data.total}
      initialTotalPages={data.totalPages}
      initialBannerVideo={data.bannerVideo}
    />
  );
}
