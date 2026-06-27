import type { Metadata } from "next";
import RegistrarListClient from "./RegistrarListClient";
import { API_URL, BASE_URL } from "@/lib/constants";

async function getInitialRegistrarsData() {

  let registrars = [];
  let pagination = null;
  let bannerVideo = null;

  try {
    const res = await fetch(`${API_URL}/api/registrars?page=1&limit=9`, {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      const body = await res.json();
      registrars = body.data || [];
      pagination = body.pagination || null;
    }
  } catch (err) {
    console.error("Failed to fetch initial registrars on server:", err);
  }

  try {
    const bannerRes = await fetch(`${API_URL}/api/banners?page=%2Fipo-registrar-list`, {
      next: { revalidate: 60 }
    });
    if (bannerRes.ok) {
      const bannerData = await bannerRes.json();
      const videoBanner = bannerData.find((b: any) => b.video_url);
      if (videoBanner) bannerVideo = videoBanner.video_url;
    }
  } catch (err) {
    console.warn("Failed to fetch banner video on server:", err);
  }

  return { registrars, pagination, bannerVideo };
}

export const metadata: Metadata = {
  title: "List of IPO Registrars in India | India IPO — Official RTA Directory",
  description: "Explore the comprehensive list of official IPO Registrars in India. Check their track record, serviced IPOs, Mainboard & SME history, and contact details.",
  keywords: "IPO registrars India, official RTA, registrar and transfer agent, SME IPO registrar, mainboard IPO registrar list",
  alternates: {
    canonical: `${BASE_URL}/ipo-registrar-list`,
  },
  openGraph: {
    title: "List of IPO Registrars in India | India IPO — Official RTA Directory",
    description: "Explore the comprehensive list of official IPO Registrars in India. Check their track record, serviced IPOs, Mainboard & SME history, and contact details.",
    url: `${BASE_URL}/ipo-registrar-list`,
    type: "website",
  }
};

export default async function RegistrarsPage() {
  const { registrars, pagination, bannerVideo } = await getInitialRegistrarsData();

  return (
    <>
      <RegistrarListClient
        initialRegistrars={registrars}
        initialPagination={pagination}
        initialBannerVideo={bannerVideo}
      />
    </>
  );
}
