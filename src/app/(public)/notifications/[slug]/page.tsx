import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NotificationClient from "@/components/NotificationClient";
import { API_URL, BASE_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getNotificationData(slug: string) {

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

  const activePdf = notifications.find((p) => p.slug === slug) || null;

  try {
    const bannerRes = await fetch(`${API_URL}/api/banners?page=%2Fnotifications%2F${slug}`, {
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

  return { activePdf, notifications, bannerVideo };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { activePdf } = await getNotificationData(slug);
  if (!activePdf) {
    return {
      title: "Notification Not Found | India IPO",
      description: "The requested notification could not be found."
    };
  }

  const title = `${activePdf.title} | India IPO Notifications`;
  const description = activePdf.description || "Official Notifications, Circulars, ICDR Regulations and SME IPO compliance documents — India IPO Knowledge Center.";
  const canonicalUrl = `${BASE_URL}/notifications/${slug}`;

  return {
    title,
    description,
    keywords: "IPO notifications, SEBI circulars, NSE BSE announcements, ICDR regulations",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
    }
  };
}

export default async function NotificationDetailPage({ params }: Props) {
  const { slug } = await params;
  const { activePdf, notifications, bannerVideo } = await getNotificationData(slug);

  if (!activePdf) {
    notFound();
  }

  return (
    <>
      <NotificationClient
        pdf={activePdf}
        allPdfs={notifications}
        slug={slug}
        bannerVideo={bannerVideo}
      />
    </>
  );
}
