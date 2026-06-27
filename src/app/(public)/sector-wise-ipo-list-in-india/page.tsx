import type { Metadata } from "next";
import SectorsClient from "@/components/SectorsClient";
import { BASE_URL, API_URL } from "@/lib/constants";

async function getInitialSectorsData() {

  let sectors: any[] = [];
  let bannerVideo: string | null = null;

  try {
    const res = await fetch(`${API_URL}/api/sectors`, {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      const data = await res.json();
      sectors = (data || []).filter(
        (s: any) => s.name && s.name.trim().toLowerCase() !== "all"
      );
    }
  } catch (err) {
    console.error("Failed to fetch sectors on server:", err);
  }

  try {
    const bannerRes = await fetch(`${API_URL}/api/banners?page=%2Fall-sectors`, {
      next: { revalidate: 60 }
    });
    if (bannerRes.ok) {
      const bannerData = await bannerRes.json();
      const videoBanner = bannerData.find((b: any) => b.video_url);
      if (videoBanner) bannerVideo = videoBanner.video_url;
    }
  } catch (err) {
    console.warn("Failed to fetch banners on server:", err);
  }

  return { sectors, bannerVideo };
}

export const metadata: Metadata = {
  title: "Sector-wise IPO List in India | India IPO — Industry Analysis",
  description: "Explore IPOs by industry sector. View mainline and SME IPO counts for all sectors in the Indian stock market with in-depth analysis.",
  keywords: "sector wise IPO list India, industry IPO analysis, IT sector IPO, BFSI IPO, manufacturing IPO India, SME mainboard sector",
  alternates: {
    canonical: `${BASE_URL}/sector-wise-ipo-list-in-india`,
  },
  openGraph: {
    title: "Sector-wise IPO List in India | India IPO — Industry Analysis",
    description: "Explore IPOs by industry sector. View mainline and SME IPO counts for all sectors in the Indian stock market with in-depth analysis.",
    url: `${BASE_URL}/sector-wise-ipo-list-in-india`,
    type: "website",
  }
};

export default async function SectorWiseListAliasPage() {
  const { sectors, bannerVideo } = await getInitialSectorsData();

  return (
    <>
      <SectorsClient initialSectors={sectors} initialBannerVideo={bannerVideo} />
    </>
  );
}

