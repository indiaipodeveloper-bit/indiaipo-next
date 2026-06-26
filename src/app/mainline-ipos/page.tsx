import { Suspense } from "react";
import ReportsClient from "@/components/ReportsClient";
import type { Metadata } from "next";
import { BASE_URL, API_URL } from "@/lib/constants";

async function getInitialReports() {

  let bannerVideo: string | null = null;
  let sectors: any[] = [];

  try {
    const res = await fetch(`${API_URL}/api/ipo-lists?page=1&limit=15&category=mainline`, {
      next: { revalidate: 60 }
    });

    try {
      const bannerRes = await fetch(`${API_URL}/api/banners?page=%2Fmainline-ipos`, {
        next: { revalidate: 60 }
      });
      if (bannerRes.ok) {
        const bannersData = await bannerRes.json();
        const videoBanner = bannersData.find((b: any) => b.video_url);
        if (videoBanner) bannerVideo = videoBanner.video_url;
      }
    } catch {}

    try {
      const secRes = await fetch(`${API_URL}/api/sectors`, {
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
    console.error("Failed to fetch mainline reports on server:", err);
  }

  return { items: [], total: 0, totalPages: 0, sectors: [], bannerVideo: null };
}

export const metadata: Metadata = {
  title: "Mainline IPO Updates | India IPO — Real-Time Mainboard IPO Data",
  description: "Detailed Mainline IPO updates with company info, GMP, issue size, price band and more. Track all mainline board IPOs on India IPO.",
  keywords: "Mainline IPO updates, Mainboard IPO list, BSE NSE mainline IPO, BSE NSE IPO, India IPO",
  alternates: {
    canonical: `${BASE_URL}/mainline-ipos`,
  },
  openGraph: {
    title: "Mainline IPO Updates | India IPO — Real-Time Mainboard IPO Data",
    description: "Detailed Mainline IPO updates with company info, GMP, issue size, price band and more. Track all mainline board IPOs on India IPO.",
    url: `${BASE_URL}/mainline-ipos`,
    type: "website",
  }
};

export default async function MainboardIpoPage() {
  const data = await getInitialReports();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>}>
      <ReportsClient
        initialData={data.items}
        initialTotal={data.total}
        initialTotalPages={data.totalPages}
        initialSectors={data.sectors}
        initialBannerVideo={data.bannerVideo}
        title="Mainline IPO Updates"
        subtitle="Access real-time data and performance insights on mainboard IPOs, including pricing trends, subscription levels and listing outcomes."
        categoryType="mainline"
        effectiveSlug="mainline-ipo-report"
      />
    </Suspense>
  );
}
