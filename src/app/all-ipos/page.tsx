import { Suspense } from "react";
import IPOCalendarClient from "@/components/IPOCalendarClient";
import type { Metadata } from "next";

const BASE_URL = "https://www.indiaipo.in";

async function getInitialReports() {
  const isDev = process.env.NODE_ENV === 'development';
  const apiBase = isDev ? "http://localhost:5000" : BASE_URL;

  let bannerVideo: string | null = null;
  let sectors: any[] = [];

  try {
    const res = await fetch(`${apiBase}/api/ipo-lists?page=1&limit=15`, {
      next: { revalidate: 60 }
    });

    try {
      const bannerRes = await fetch(`${apiBase}/api/banners?page=%2Fall-ipos`, {
        next: { revalidate: 60 }
      });
      if (bannerRes.ok) {
        const bannersData = await bannerRes.json();
        const videoBanner = bannersData.find((b: any) => b.video_url);
        if (videoBanner) bannerVideo = videoBanner.video_url;
      }
    } catch {}

    try {
      const secRes = await fetch(`${apiBase}/api/sectors`, {
        next: { revalidate: 60 }
      });
      if (secRes.ok) {
        sectors = await secRes.json();
      }
    } catch {}

    if (res.ok) {
      const body = await res.json();
      return {
        items: body.data || [],
        total: body.pagination?.total || 0,
        totalPages: body.pagination?.totalPages || 0,
        sectors,
        bannerVideo
      };
    }
  } catch (err) {
    console.error("Failed to fetch calendar reports on server:", err);
  }

  return { items: [], total: 0, totalPages: 0, sectors: [], bannerVideo: null };
}

export const metadata: Metadata = {
  title: "IPO Calendar | India IPO — Real-Time IPO Data",
  description: "Detailed IPO Calendar with company info, GMP, issue size, price band and more. Track all mainline and SME IPOs on India IPO.",
  keywords: "IPO calendar, IPO calendar India, IPO list, BSE NSE IPO, SME IPO, mainboard IPO",
  alternates: {
    canonical: `${BASE_URL}/all-ipos`,
  },
  openGraph: {
    title: "IPO Calendar | India IPO — Real-Time IPO Data",
    description: "Detailed IPO Calendar with company info, GMP, issue size, price band and more. Track all mainline and SME IPOs on India IPO.",
    url: `${BASE_URL}/all-ipos`,
    type: "website",
  }
};

export default async function IpoCalendarPage() {
  const data = await getInitialReports();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>}>
      <IPOCalendarClient
        initialItems={data.items}
        initialTotal={data.total}
        initialTotalPages={data.totalPages}
        initialBannerVideo={data.bannerVideo}
      />
    </Suspense>
  );
}
