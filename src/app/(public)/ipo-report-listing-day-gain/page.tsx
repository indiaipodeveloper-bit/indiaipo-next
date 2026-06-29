import { Suspense } from "react";
import ListingDayGainClient from "./ListingDayGainClient";
import type { Metadata } from "next";
import { API_URL, BASE_URL } from "@/lib/constants";

async function getInitialData() {
  let bannerVideo: string | null = null;
  let initialData: any = null;

  try {
    const res = await fetch(`${API_URL}/api/ipo-lists?page=1&limit=15&status=Listed`, {
      next: { revalidate: 60 }
    });

    try {
      const bannerRes = await fetch(`${API_URL}/api/banners?page=%2Fipo-report-listing-day-gain`, {
        next: { revalidate: 60 }
      });
      if (bannerRes.ok) {
        const bannersData = await bannerRes.json();
        const videoBanner = bannersData.find((b: any) => b.video_url);
        if (videoBanner) bannerVideo = videoBanner.video_url;
      }
    } catch { }

    if (res.ok) {
      initialData = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch listing day gain reports on server:", err);
  }

  return { initialData, bannerVideo };
}

export const metadata: Metadata = {
  title: "IPO Report Listing Day Gain | India IPO",
  description: "Track listing day gains and loss percentages of mainline and SME IPOs. Compare subscription numbers against listing prices.",
  keywords: "IPO listing gain, listing day gain, IPO report, listing performance, SME IPO gain, mainline listing gain",
  alternates: {
    canonical: `${BASE_URL}/ipo-report-listing-day-gain`,
  },
  openGraph: {
    title: "IPO Report Listing Day Gain | India IPO",
    description: "Track listing day gains and loss percentages of mainline and SME IPOs. Compare subscription numbers against listing prices.",
    url: `${BASE_URL}/ipo-report-listing-day-gain`,
    type: "website",
  }
};

export default async function IpoListingDayGainPage() {
  const data = await getInitialData();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>}>
      <ListingDayGainClient
        initialData={data.initialData}
        initialBannerVideo={data.bannerVideo}
      />
    </Suspense>
  );
}
