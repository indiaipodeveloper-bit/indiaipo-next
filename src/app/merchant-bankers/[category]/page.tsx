import MerchantBankersClient from "./MerchantBankersClient";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ category: string }>;
};

async function getCategoryInfo(category: string): Promise<{ type: "SME" | "Mainboard"; name: string }> {
  if (category === "list-of-sme-merchant-bankers") {
    return { type: "SME", name: "List of SME Merchant Bankers" };
  }
  if (category === "list-of-mainboard-merchant-bankers") {
    return { type: "Mainboard", name: "List of Mainboard Merchant Bankers" };
  }

  const isDev = process.env.NODE_ENV === 'development';
  const apiBase = isDev ? "http://localhost:5000" : "https://www.indiaipo.in";

  try {
    const res = await fetch(`${apiBase}/api/banker-subcategories`, {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      const body = await res.json();
      const cats = body.data || [];
      const cat = cats.find((c: any) => c.slug === category);
      if (cat) {
        return {
          type: cat.type === "mainboard" ? "Mainboard" : "SME",
          name: cat.name || "Merchant Bankers Directory"
        };
      }
    }
  } catch (err) {
    console.error("Failed to fetch banker categories on server:", err);
  }

  // Fallback to SME if category slug doesn't match
  return { type: "SME", name: "List of SME Merchant Bankers" };
}

async function getInitialBankers(category: string, type: "SME" | "Mainboard") {
  const isDev = process.env.NODE_ENV === 'development';
  const apiBase = isDev ? "http://localhost:5000" : "https://www.indiaipo.in";
  const apiPath = type === "SME" ? "/api/bankers" : "/api/mainboard-bankers";

  try {
    const res = await fetch(`${apiBase}${apiPath}?page=1&limit=9&category=${category}`, {
      next: { revalidate: 60 }
    });
    let bannerVideo: string | null = null;

    try {
      const bannerRes = await fetch(`${apiBase}/api/banners?page=%2Fmerchant-bankers%2F${category}`, {
        next: { revalidate: 60 }
      });
      if (bannerRes.ok) {
        const bannersData = await bannerRes.json();
        const videoBanner = bannersData.find((b: any) => b.video_url);
        if (videoBanner) bannerVideo = videoBanner.video_url;
      }
    } catch {
      // banners is optional
    }

    if (res.ok) {
      const body = await res.json();
      const total = body.pagination?.total || 0;
      const totalPages = body.pagination?.totalPages || 1;
      return {
        bankers: body.data || [],
        total,
        totalPages,
        bannerVideo,
      };
    }
  } catch (err) {
    console.error("Failed to fetch initial bankers on server:", err);
  }

  return { bankers: [], total: 0, totalPages: 1, bannerVideo: null };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const catInfo = await getCategoryInfo(category);
  const isSME = catInfo.type === "SME";
  const pageTitle = catInfo.name;

  return {
    title: `${pageTitle} | India IPO — Official Bankers Directory`,
    description: `Complete directory of ${isSME ? "SME" : "Mainboard"} merchant bankers in India with IPO stats, contact details, and performance data.`,
    keywords: `${pageTitle}, expert advisors, IPO merchant bankers, BRLM India, ${isSME ? "BSE SME emulation NSE Emerge" : "NSE BSE mainboard"} IPO lead manager`,
    alternates: {
      canonical: `https://www.indiaipo.in/merchant-bankers/${category}`,
    },
    openGraph: {
      title: `${pageTitle} | India IPO — Official Bankers Directory`,
      description: `Complete directory of ${isSME ? "SME" : "Mainboard"} merchant bankers in India with IPO stats, contact details, and performance data.`,
      url: `https://www.indiaipo.in/merchant-bankers/${category}`,
      type: "website",
    }
  };
}

export default async function MerchantBankersPage({ params }: Props) {
  const { category } = await params;
  const catInfo = await getCategoryInfo(category);
  const data = await getInitialBankers(category, catInfo.type);

  return (
    <MerchantBankersClient
      initialBankers={data.bankers}
      initialTotal={data.total}
      initialTotalPages={data.totalPages}
      type={catInfo.type}
      category={category}
      initialBannerVideo={data.bannerVideo}
    />
  );
}
