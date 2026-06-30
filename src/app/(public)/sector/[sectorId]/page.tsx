import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SectorDetailClient from "@/components/SectorDetailClient";
import { API_URL, BASE_URL } from "@/lib/constants";

interface PageParams {
  sectorId: string;
}

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[&,]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

async function getSectorDetails(sectorId: string) {

  try {
    // 1. Fetch all sectors to find the matching one
    const secRes = await fetch(`${API_URL}/api/sectors`, {
      next: { revalidate: 60 }
    });
    if (!secRes.ok) return null;

    const sectors = await secRes.json();
    const matchedSector = sectors.find(
      (s: any) => String(s.id) === sectorId || (s.name && slugify(s.name) === sectorId)
    );

    if (!matchedSector) return null;

    // 2. Fetch IPOs for this sector
    const iposRes = await fetch(
      `${API_URL}/api/ipo-lists?by_sector=true&sector_name=${encodeURIComponent(matchedSector.name)}&limit=500`,
      { next: { revalidate: 30 } }
    );

    let items: any[] = [];
    if (iposRes.ok) {
      const body = await iposRes.json();
      items = body.data || [];
    }

    // Calculate stats
    const sizes = items
      .map((item: any) => {
        const val = item.issue_size;
        if (typeof val === "string") return parseFloat(val.replace(/[^0-9.]/g, ""));
        return typeof val === "number" ? val : 0;
      })
      .filter((v: number) => !isNaN(v) && v > 0);

    let stats = { highest: 0, lowest: 0, median: 0, count: items.length };

    if (sizes.length > 0) {
      const sorted = [...sizes].sort((a, b) => a - b);
      const highest = sorted[sorted.length - 1];
      const lowest = sorted[0];
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      stats = { highest, lowest, median, count: items.length };
    }

    return {
      sector: matchedSector,
      items,
      stats,
    };
  } catch (err) {
    console.error("Failed to load sector and IPOs on server:", err);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sectorId } = await params;
  const data = await getSectorDetails(sectorId);
  if (!data) {
    return {
      title: "Sector Not Found | India IPO",
      description: "The requested sector could not be found."
    };
  }

  const title = `${data.sector.name} Sector IPOs List in India | India IPO`;
  const description = `Explore all Initial Public Offerings (IPOs) in the ${data.sector.name} sector. View comprehensive list, size, P/E ratio, and expert insights.`;
  const canonicalUrl = `${BASE_URL}/sector/${sectorId}`;

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

export default async function SectorDetailPage({ params }: { params: Promise<PageParams> }) {
  const { sectorId } = await params;
  const data = await getSectorDetails(sectorId);

  if (!data) {
    notFound();
  }

  const initialPaginatedData = {
    data: data.items.slice(0, 15),
    pagination: {
      total: data.items.length,
      page: 1,
      limit: 15,
      totalPages: Math.ceil(data.items.length / 15)
    }
  };

  return (
    <>
      <SectorDetailClient sector={data.sector} initialPaginatedData={initialPaginatedData} stats={data.stats} />
    </>
  );
}
