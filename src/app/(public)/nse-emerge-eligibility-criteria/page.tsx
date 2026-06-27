import type { Metadata } from "next";
import NotificationClient from "@/components/NotificationClient";
import { BASE_URL, API_URL } from "@/lib/constants";

async function getInitialNotifications() {

  let notifications: any[] = [];
  let bannerVideo: string | null = null;

  try {
    const res = await fetch(`${API_URL}/api/notifications`, {
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
    const bannerRes = await fetch(`${API_URL}/api/banners?page=%2Fnse-emerge-eligibility-criteria`, {
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
  title: "NSE Emerge Eligibility Criteria | India IPO — RTA Compliance",
  description: "Official listing requirements and financial benchmarks for the National Stock Exchange (NSE) SME Platform. View asset levels, positive cashflow requirements, and promoter lock-in times.",
  keywords: "NSE Emerge eligibility, NSE SME IPO criteria, NSE Emerge listing requirements, tech startup listing NSE, cash flow listing",
  alternates: {
    canonical: `${BASE_URL}/nse-emerge-eligibility-criteria`,
  },
  openGraph: {
    title: "NSE Emerge Eligibility Criteria | India IPO — RTA Compliance",
    description: "Official listing requirements and financial benchmarks for the National Stock Exchange (NSE) SME Platform. View asset levels, positive cashflow requirements, and promoter lock-in times.",
    url: `${BASE_URL}/nse-emerge-eligibility-criteria`,
    type: "website",
  }
};

export default async function NseEmergeEligibilityPage() {
  const { notifications, bannerVideo } = await getInitialNotifications();

  const activePdf = {
    id: "nse-elig",
    title: "NSE Emerge Eligibility Criteria",
    slug: "nse-emerge-eligibility-criteria",
    pdf_url: null,
    link: null,
    description: "Official listing criteria for the National Stock Exchange (NSE) Emerge platform for SME IPOs."
  };

  return (
    <>
      <NotificationClient
        pdf={activePdf}
        allPdfs={notifications}
        slug="nse-emerge-eligibility-criteria"
        bannerVideo={bannerVideo}
      />
    </>
  );
}
