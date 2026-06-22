import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import MagazineViewerClient from "./MagazineViewerClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BASE_URL = "https://www.indiaipo.in";

interface Props {
  params: Promise<{ id: string }>;
}

async function getMagazineDetails(id: string) {
  const isDev = process.env.NODE_ENV === 'development';
  const apiBase = isDev ? "http://localhost:5000" : BASE_URL;

  try {
    const res = await fetch(`${apiBase}/api/magazines/${id}`, {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.error(`Failed to fetch magazine ${id} on server:`, err);
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const magazine = await getMagazineDetails(id);
  if (!magazine) {
    return {
      title: "Magazine Not Found | India IPO",
      description: "The requested magazine edition could not be found."
    };
  }

  const title = `${magazine.title} | IPO World Magazine`;
  const description = `Read the ${magazine.language} edition of ${magazine.title}. Exclusive IPO insights, subscription details, and market analysis.`;
  const canonicalUrl = `${BASE_URL}/ipo-world-magazine/view/${id}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
    }
  };
}

export default async function MagazineViewerPage({ params }: Props) {
  const { id } = await params;
  const magazine = await getMagazineDetails(id);

  if (!magazine) {
    notFound();
  }

  // Server-side lock check (redirect if locked)
  if (Number(magazine.pdf_lock) === 1) {
    redirect("/ipo-world-magazine");
  }

  return (
    <>
      <Header />
      <MagazineViewerClient magazine={magazine} />
      <Footer />
    </>
  );
}
