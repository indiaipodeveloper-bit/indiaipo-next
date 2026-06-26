import type { Metadata } from "next";
import IpoWorldMagazineClient from "./IpoWorldMagazineClient";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { BASE_URL, API_URL } from "@/lib/constants";

async function getInitialMagazines() {

  try {
    const res = await fetch(`${API_URL}/api/magazines?page=1&limit=8&language=english`, {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      const data = await res.json();
      return {
        magazines: data.data || [],
        pagination: data.pagination || null
      };
    }
  } catch (err) {
    console.error("Failed to fetch initial magazines on server:", err);
  }

  return { magazines: [], pagination: null };
}

export const metadata: Metadata = {
  title: "IPO World Magazine | India IPO — Monthly Analysis",
  description: "India's only magazine dedicated 100% to IPOs. Stay updated with the latest IPO news, analysis, subscriber reviews, and industry insights.",
  keywords: "IPO magazine, IPO World Magazine, IPO analysis magazine, SME IPO magazine, mainline IPO magazine",
  alternates: {
    canonical: `${BASE_URL}/ipo-world-magazine`,
  },
  openGraph: {
    title: "IPO World Magazine | India IPO — Monthly Analysis",
    description: "India's only magazine dedicated 100% to IPOs. Stay updated with the latest IPO news, analysis, subscriber reviews, and industry insights.",
    url: `${BASE_URL}/ipo-world-magazine`,
    type: "website",
  }
};

export default async function IpoWorldMagazinePage() {
  const { magazines, pagination } = await getInitialMagazines();

  return (
    <>
      <Header />
      <IpoWorldMagazineClient
        initialMagazines={magazines}
        initialPagination={pagination}
        initialLanguage="english"
      />
      <Footer />
    </>
  );
}

