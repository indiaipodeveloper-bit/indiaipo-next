import WeeklyDigestClient from "./WeeklyDigestClient";
import type { Metadata } from "next";

const BASE_URL = "https://www.indiaipo.in";

async function getInitialWeeklyDigests() {
  const isDev = process.env.NODE_ENV === 'development';
  const apiBase = isDev ? "http://localhost:5000" : BASE_URL;

  try {
    const res = await fetch(`${apiBase}/api/weekly-digests?page=1&limit=12`, {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      const body = await res.json();
      return {
        digests: body.data || [],
        total: body.pagination?.total || 0,
        totalPages: body.pagination?.totalPages || 1,
      };
    }
  } catch (err) {
    console.error("Failed to fetch weekly digests on server:", err);
  }

  return { digests: [], total: 0, totalPages: 1 };
}

export const metadata: Metadata = {
  title: "Weekly Reporter | India IPO — Complete Weekly Market Digests & Reports",
  description: "Access India IPO's exclusive weekly market digests featuring comprehensive IPO analysis, weekly summaries, GMP trends, and expert insights.",
  keywords: "Weekly IPO reporter, weekly market digest India, Sunday IPO news, weekly IPO snapshots, India IPO weekly report",
  alternates: {
    canonical: `${BASE_URL}/weekly-ipo-report`,
  },
  openGraph: {
    title: "Weekly Reporter | India IPO — Complete Weekly Market Digests & Reports",
    description: "Access India IPO's exclusive weekly market digests featuring comprehensive IPO analysis, weekly summaries, GMP trends, and expert insights.",
    url: `${BASE_URL}/weekly-ipo-report`,
    type: "website",
  }
};

export default async function WeeklyReporterPage() {
  const data = await getInitialWeeklyDigests();

  return (
    <WeeklyDigestClient
      initialDigests={data.digests}
      initialTotal={data.total}
      initialTotalPages={data.totalPages}
    />
  );
}
