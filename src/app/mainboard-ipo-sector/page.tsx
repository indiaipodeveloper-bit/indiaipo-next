import { Suspense } from "react";
import SectorIPOsClient from "@/components/SectorIPOsClient";
import type { Metadata } from "next";

const BASE_URL = "https://www.indiaipo.in";

async function getInitialReports() {
  const isDev = process.env.NODE_ENV === 'development';
  const apiBase = isDev ? "http://localhost:5000" : BASE_URL;

  let sectors: any[] = [];

  try {
    const res = await fetch(`${apiBase}/api/ipo-lists?page=1&limit=15&category=mainline&sort=sector_name&by_sector=true`, {
      next: { revalidate: 60 }
    });

    try {
      const secRes = await fetch(`${apiBase}/api/sectors`, {
        next: { revalidate: 60 }
      });
      if (secRes.ok) {
        sectors = await secRes.json();
      }
    } catch {}

    if (res.ok) {
      const body = await res.json();
      return {
        items: body.data || [],
        total: body.pagination?.total || 0,
        totalPages: body.pagination?.totalPages || 0,
        sectors
      };
    }
  } catch (err) {
    console.error("Failed to fetch mainline sector reports on server:", err);
  }

  return { items: [], total: 0, totalPages: 0, sectors: [] };
}

export const metadata: Metadata = {
  title: "Mainboard IPOs by Sector | India IPO — Sector Wise Mainline IPOs",
  description: "Analyse sector-wise mainboard IPO activity with real-time data on issue trends, capital flows and listing performance on India IPO.",
  keywords: "Mainboard IPO by sector, sector wise mainboard IPO, mainline sectors, NSE BSE sectors, India IPO",
  alternates: {
    canonical: `${BASE_URL}/mainboard-ipo-sector`,
  },
  openGraph: {
    title: "Mainboard IPOs by Sector | India IPO — Sector Wise Mainline IPOs",
    description: "Analyse sector-wise mainboard IPO activity with real-time data on issue trends, capital flows and listing performance on India IPO.",
    url: `${BASE_URL}/mainboard-ipo-sector`,
    type: "website",
  }
};

export default async function MainboardIpoSectorPage() {
  const data = await getInitialReports();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>}>
      <SectorIPOsClient
        initialItems={data.items}
        initialTotal={data.total}
        initialTotalPages={data.totalPages}
        initialSectors={data.sectors}
        category="mainline"
      />
    </Suspense>
  );
}
