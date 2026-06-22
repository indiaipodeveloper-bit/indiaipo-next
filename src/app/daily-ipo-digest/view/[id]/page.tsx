import DailyReporterViewerClient from "./DailyReporterViewerClient";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

const BASE_URL = "https://www.indiaipo.in";

interface Props {
  params: Promise<{ id: string }>;
}

async function fetchDigestOnServer(id: string) {
  const isDev = process.env.NODE_ENV === 'development';
  const apiBase = isDev ? "http://localhost:5000" : BASE_URL;

  try {
    const res = await fetch(`${apiBase}/api/daily-digests/${id}`, {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch daily digest viewer data:", err);
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const digest = await fetchDigestOnServer(id);

  if (!digest) {
    return {
      title: "Daily Report Not Found | India IPO",
      description: "The requested daily report could not be found.",
    };
  }

  const title = `${digest.title} | Daily IPO Reporter | India IPO`;
  const description = `Read the daily report: ${digest.title}. Exclusive market insights and IPO analysis.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/daily-ipo-digest/view/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/daily-ipo-digest/view/${id}`,
      type: "website",
    }
  };
}

export default async function DailyReporterViewerPage({ params }: Props) {
  const { id } = await params;
  const digest = await fetchDigestOnServer(id);

  if (!digest) {
    redirect("/daily-ipo-digest");
  }

  return <DailyReporterViewerClient digest={digest} />;
}
