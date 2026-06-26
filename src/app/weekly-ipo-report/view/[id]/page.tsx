import WeeklyReporterViewerClient from "./WeeklyReporterViewerClient";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BASE_URL, API_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ id: string }>;
}

async function fetchWeeklyDigestOnServer(id: string) {

  try {
    const res = await fetch(`${API_URL}/api/weekly-digests/${id}`, {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch weekly digest viewer data:", err);
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const digest = await fetchWeeklyDigestOnServer(id);

  if (!digest) {
    return {
      title: "Weekly Report Not Found | India IPO",
      description: "The requested weekly report could not be found.",
    };
  }

  const title = `${digest.title} | Weekly IPO Report | India IPO`;
  const description = `Read the weekly report: ${digest.title}. Exclusive market insights and deep-dive IPO analysis.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/weekly-ipo-report/view/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/weekly-ipo-report/view/${id}`,
      type: "website",
    }
  };
}

export default async function WeeklyReporterViewerPage({ params }: Props) {
  const { id } = await params;
  const digest = await fetchWeeklyDigestOnServer(id);

  if (!digest) {
    redirect("/weekly-ipo-report");
  }

  return <WeeklyReporterViewerClient digest={digest} />;
}
