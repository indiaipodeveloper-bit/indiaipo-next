import MerchantBankerCompareClient from "./MerchantBankerCompareClient";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

const BASE_URL = "https://www.indiaipo.in";

interface Banker {
  id: string | number;
  title: string;
  sub_title?: string;
  image?: string;
  logo_url?: string;
  noOfiposofar?: string;
  totalfundraised?: string;
  avgiposize?: string;
  avgsubscription?: string;
  avglisting_gain?: string;
  nseemer?: string;
  bsesme?: string;
  cemail?: string;
  cmobile?: string;
  caddress?: string;
  cweblink?: string;
  yearwise_ipolisting?: string;
  sme_ipos_by_size?: string;
  sme_ipos_by_subscription?: string;
  ipos?: string;
  total_ipos?: string | number;
  total_raised?: string | number;
  avg_size?: string | number;
  avg_subscription?: string | number;
  avg_listing_gain?: string | number;
  website?: string;
  location?: string;
  email?: string;
  phone?: string;
}

async function fetchBankerOnServer(id: string, type: string): Promise<Banker | null> {
  const isDev = process.env.NODE_ENV === 'development';
  const apiBase = isDev ? "http://localhost:5000" : "https://www.indiaipo.in";
  const apiPath = type === "mainboard" ? "/api/mainboard-bankers" : "/api/bankers";

  try {
    const res = await fetch(`${apiBase}${apiPath}/${id}`, {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error(`Failed to fetch banker ${id} on compare page:`, err);
  }
  return null;
}

type Props = {
  searchParams: Promise<{ a?: string; b?: string; type?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { a: idA, b: idB, type } = await searchParams;
  const isMainboard = type === "mainboard";

  if (!idA || !idB) {
    return {
      title: "Compare Merchant Bankers | India IPO",
      description: "Compare performance records of Indian merchant bankers.",
    };
  }

  const bankerA = await fetchBankerOnServer(idA, type || "sme");
  const bankerB = await fetchBankerOnServer(idB, type || "sme");

  if (!bankerA || !bankerB) {
    return {
      title: "Compare Merchant Bankers | India IPO",
      description: "Compare performance records of Indian merchant bankers.",
    };
  }

  const title = `${bankerA.title} vs ${bankerB.title} | Compare Merchant Bankers | India IPO`;
  const description = `Compare ${bankerA.title} and ${bankerB.title} on India IPO directory. Analyze total IPOs, total funds raised, subscription averages, listing gains, and more.`;

  return {
    title,
    description,
    keywords: "merchant banker comparison, BRLM compare, SME IPO compare, IPO advisory compare",
    alternates: {
      canonical: `${BASE_URL}/merchant-bankers/compare?a=${idA}&b=${idB}&type=${type || "sme"}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/merchant-bankers/compare?a=${idA}&b=${idB}&type=${type || "sme"}`,
      type: "website",
    }
  };
}

export default async function Page({ searchParams }: Props) {
  const { a: idA, b: idB, type } = await searchParams;
  const backUrl = type === "mainboard"
    ? "/merchant-bankers/list-of-mainboard-merchant-bankers"
    : "/merchant-bankers/list-of-sme-merchant-bankers";

  if (!idA || !idB) {
    redirect(backUrl);
  }

  const bankerA = await fetchBankerOnServer(idA, type || "sme");
  const bankerB = await fetchBankerOnServer(idB, type || "sme");

  if (!bankerA || !bankerB) {
    redirect(backUrl);
  }

  return <MerchantBankerCompareClient a={bankerA} b={bankerB} type={type || "sme"} />;
}
