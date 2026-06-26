import { API_URL, BASE_URL } from "@/lib/constants";
import DailyReporterClient from "./DailyReporterClient";
import type { Metadata } from "next";

async function getInitialDigests() {

  try {
    const res = await fetch(`${API_URL}/api/daily-digests?page=1&limit=12`, {
      next: { revalidate: 60 }
    });
    let bannerVideo: string | null = null;

    try {
      const bannerRes = await fetch(`${API_URL}/api/banners?page=%2Fdaily-ipo-digest`, {
        next: { revalidate: 60 }
      });
      if (bannerRes.ok) {
        const bannersData = await bannerRes.json();
        const videoBanner = bannersData.find((b: any) => b.video_url);
        if (videoBanner) bannerVideo = videoBanner.video_url;
      }
    } catch {
      // Banners are optional
    }

    if (res.ok) {
      const body = await res.json();
      return {
        digests: body.data || [],
        total: body.pagination?.total || 0,
        totalPages: body.pagination?.totalPages || 1,
        bannerVideo,
      };
    }
  } catch (err) {
    console.error("Failed to fetch daily digests on server:", err);
  }

  return { digests: [], total: 0, totalPages: 1, bannerVideo: null };
}

export const metadata: Metadata = {
  title: "Daily Reporter | India IPO — Daily Market Digests & IPO Snapshots",
  description: "Access India IPO's exclusive daily market digests featuring IPO summaries, GMP updates, and financial snapshots of the Indian capital market landscape.",
  keywords: "Daily IPO reporter, market digest India, daily IPO news, IPO snapshots, India IPO daily report",
  alternates: {
    canonical: `${BASE_URL}/daily-ipo-digest`,
  },
  openGraph: {
    title: "Daily Reporter | India IPO — Daily Market Digests & IPO Snapshots",
    description: "Access India IPO's exclusive daily market digests featuring IPO summaries, GMP updates, and financial snapshots of the Indian capital market landscape.",
    url: `${BASE_URL}/daily-ipo-digest`,
    type: "website",
  }
};

export default async function DailyReporterPage() {
  const data = await getInitialDigests();

  return (
    <DailyReporterClient
      initialDigests={data.digests}
      initialTotal={data.total}
      initialTotalPages={data.totalPages}
      initialBannerVideo={data.bannerVideo}
    />
  );
}
