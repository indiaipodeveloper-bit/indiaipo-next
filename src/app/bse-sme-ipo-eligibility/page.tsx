import type { Metadata } from "next";
import NotificationClient from "@/components/NotificationClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BASE_URL = "https://www.indiaipo.in";

async function getInitialNotifications() {
  const isDev = process.env.NODE_ENV === 'development';
  const apiBase = isDev ? "http://localhost:5000" : BASE_URL;

  let notifications: any[] = [];
  let bannerVideo: string | null = null;

  try {
    const res = await fetch(`${apiBase}/api/notifications`, {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      notifications = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch notifications on server:", err);
  }

  // Ensure mandatory pages are in the list
  const mandatory = [
    { id: "nse-elig", title: "NSE Emerge Eligibility Criteria", slug: "nse-emerge-eligibility-criteria", pdf_url: null, link: null, description: "Official listing criteria for the National Stock Exchange (NSE) Emerge platform for SME IPOs." },
    { id: "bse-elig", title: "BSE SME Eligibility Criteria", slug: "bse-sme-ipo-eligibility", pdf_url: null, link: null, description: "Official listing criteria for the Bombay Stock Exchange (BSE) SME platform for SME IPOs." }
  ];

  mandatory.forEach(m => {
    if (!notifications.find((d: any) => d.slug === m.slug)) {
      notifications.push(m);
    }
  });

  try {
    const bannerRes = await fetch(`${apiBase}/api/banners?page=%2Fbse-sme-ipo-eligibility`, {
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

  return { notifications, bannerVideo };
}

export const metadata: Metadata = {
  title: "BSE SME Eligibility Criteria | India IPO — RTA Compliance",
  description: "Comprehensive listing requirements based on ICDR Regulations and Exchange norms for the BSE SME Platform. Check paid-up capital, net worth, track records, and lock-ins.",
  keywords: "BSE SME Eligibility, SME IPO criteria, BSE SME list requirements, ICDR guidelines SME, IPO lock-in promoters",
  alternates: {
    canonical: `${BASE_URL}/bse-sme-ipo-eligibility`,
  },
  openGraph: {
    title: "BSE SME Eligibility Criteria | India IPO — RTA Compliance",
    description: "Comprehensive listing requirements based on ICDR Regulations and Exchange norms for the BSE SME Platform. Check paid-up capital, net worth, track records, and lock-ins.",
    url: `${BASE_URL}/bse-sme-ipo-eligibility`,
    type: "website",
  }
};

export default async function BseSmeEligibilityPage() {
  const { notifications, bannerVideo } = await getInitialNotifications();

  const activePdf = {
    id: "bse-elig",
    title: "BSE SME Eligibility Criteria",
    slug: "bse-sme-ipo-eligibility",
    pdf_url: null,
    link: null,
    description: "Official listing criteria for the Bombay Stock Exchange (BSE) SME platform for SME IPOs."
  };

  return (
    <>
      <Header />
      <NotificationClient
        pdf={activePdf}
        allPdfs={notifications}
        slug="bse-sme-ipo-eligibility"
        bannerVideo={bannerVideo}
      />
      <Footer />
    </>
  );
}
