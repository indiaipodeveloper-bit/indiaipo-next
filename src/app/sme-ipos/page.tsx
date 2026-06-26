import { Suspense } from "react";
import ReportsClient from "@/components/ReportsClient";
import type { Metadata } from "next";
import { API_URL, BASE_URL } from "@/lib/constants";

async function getInitialReports() {

  let bannerVideo: string | null = null;
  let sectors: any[] = [];

  try {
    const res = await fetch(`${API_URL}/api/ipo-lists?page=1&limit=15&category=sme`, {
      next: { revalidate: 60 }
    });

    try {
      const bannerRes = await fetch(`${API_URL}/api/banners?page=%2Fsme-ipos`, {
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
    console.error("Failed to fetch SME reports on server:", err);
  }

  return { items: [], total: 0, totalPages: 0, sectors: [], bannerVideo: null };
}

export const metadata: Metadata = {
  title: "SME IPO Updates | India IPO — Real-Time SME IPO Data",
  description: "Detailed SME IPO updates with company info, GMP, issue size, price band and more. Track all small-medium enterprise IPOs on India IPO.",
  keywords: "SME IPO updates, SME IPO list, NSE Emerge list, BSE SME IPO, small-cap IPO, India IPO",
  alternates: {
    canonical: `${BASE_URL}/sme-ipos`,
  },
  openGraph: {
    title: "SME IPO Updates | India IPO — Real-Time SME IPO Data",
    description: "Detailed SME IPO updates with company info, GMP, issue size, price band and more. Track all small-medium enterprise IPOs on India IPO.",
    url: `${BASE_URL}/sme-ipos`,
    type: "website",
  }
};

export default async function SmeIpoPage() {
  const data = await getInitialReports();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>}>
      <ReportsClient
        initialData={data.items}
        initialTotal={data.total}
        initialTotalPages={data.totalPages}
        initialSectors={data.sectors}
        initialBannerVideo={data.bannerVideo}
        title="SME IPO Updates"
        subtitle="Track SME IPOs with real-time data, GMP trends, subscription demand and listing performance insights."
        categoryType="sme"
        effectiveSlug="sme-ipo-report"
      />
    </Suspense>
  );
}
