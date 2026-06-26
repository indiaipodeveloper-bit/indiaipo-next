import { Suspense } from "react";
import SectorIPOsClient from "@/components/SectorIPOsClient";
import type { Metadata } from "next";
import { BASE_URL, API_URL } from "@/lib/constants";

async function getInitialReports() {

  let sectors: any[] = [];

  try {
    const res = await fetch(`${API_URL}/api/ipo-lists?page=1&limit=15&category=sme&sort=sector_name&by_sector=true`, {
      next: { revalidate: 60 }
    });

    try {
      const secRes = await fetch(`${API_URL}/api/sectors`, {
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
    console.error("Failed to fetch SME sector reports on server:", err);
  }

  return { items: [], total: 0, totalPages: 0, sectors: [] };
}

export const metadata: Metadata = {
  title: "SME IPOs by Sector | India IPO — Sector Wise Small-Cap IPOs",
  description: "Track sector-wise SME IPO trends with real-time data on issue activity, pricing dynamics and listing outcomes on India IPO.",
  keywords: "SME IPO by sector, sector wise SME IPO, small-cap sectors, BSE SME sectors, NSE Emerge sector, India IPO",
  alternates: {
    canonical: `${BASE_URL}/sme-ipo-sector`,
  },
  openGraph: {
    title: "SME IPOs by Sector | India IPO — Sector Wise Small-Cap IPOs",
    description: "Track sector-wise SME IPO trends with real-time data on issue activity, pricing dynamics and listing outcomes on India IPO.",
    url: `${BASE_URL}/sme-ipo-sector`,
    type: "website",
  }
};

export default async function SmeIpoSectorPage() {
  const data = await getInitialReports();

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>}>
      <SectorIPOsClient
        initialItems={data.items}
        initialTotal={data.total}
        initialTotalPages={data.totalPages}
        initialSectors={data.sectors}
        category="sme"
      />
    </Suspense>
  );
}
