import SectorIPOsClient from "@/components/SectorIPOsClient";
import { API_URL, BASE_URL } from "@/lib/constants";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

async function getInitialData(idParams: string) {

  let sectors: any[] = [];
  try {
    const secRes = await fetch(`${API_URL}/api/sectors`, {
      next: { revalidate: 60 }
    });
    if (secRes.ok) {
      sectors = await secRes.json();
    }
  } catch {}

  const ids = idParams.split(",");
  const selectedNames: string[] = [];
  ids.forEach((currentId) => {
    const found = sectors.find(
      (s) => String(s.id) === currentId || (s.name && s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === currentId)
    );
    if (found) {
      selectedNames.push(found.name);
    }
  });

  let items: any[] = [];
  let total = 0;
  let totalPages = 1;

  try {
    const params = new URLSearchParams();
    params.append("page", "1");
    params.append("limit", "15");
    params.append("category", "mainline");
    params.append("sort", "sector_name");
    params.append("by_sector", "true");

    if (selectedNames.length > 0) {
      params.append("sector_name", selectedNames.join(","));
    }

    const res = await fetch(`${API_URL}/api/ipo-lists?${params.toString()}`, {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      const body = await res.json();
      items = body.data || [];
      total = body.pagination?.total || 0;
      totalPages = body.pagination?.totalPages || 1;
    }
  } catch (err) {
    console.error("Failed to fetch sector reports on server:", err);
  }

  return { items, total, totalPages, sectors, selectedNames };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getInitialData(id);

  const activeSectorNamesStr = data.selectedNames.join(", ");
  const title = activeSectorNamesStr
    ? `${activeSectorNamesStr} Sectors - Mainboard IPOs | India IPO`
    : `Mainboard IPOs by Sector | India IPO`;
  const description = activeSectorNamesStr
    ? `Explore the latest Mainboard IPOs in the ${activeSectorNamesStr} sectors. Get detailed listing dates, issue sizes, GMP trends, and valuation metrics.`
    : `View Mainboard IPOs categorized by industry sectors. Get detailed insights into company size and listing years.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/ipos/sector/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/ipos/sector/${id}`,
      type: "website",
    }
  };
}

export default async function MainboardSectorIdPage({ params }: Props) {
  const { id } = await params;
  const data = await getInitialData(id);

  return (
    <SectorIPOsClient
      initialItems={data.items}
      initialTotal={data.total}
      initialTotalPages={data.totalPages}
      initialSectors={data.sectors}
      category="mainline"
      idParams={id}
    />
  );
}
