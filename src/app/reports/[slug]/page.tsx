import { ipoListApi } from "@/services/api";
import Reports from "../ReportsPage";
import { REPORT_SLUGS } from "@/lib/constants";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    sector?: string;
  }>;
}

export default async function ReportSlugPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;

  if (!REPORT_SLUGS.includes(slug)) {
    notFound();
  }
  const { sector } = await searchParams;

  const query: any = {
    page: "1",
    limit: "15",
  };

  if (slug === "upcoming-ipo-calendar") {
    query.upcoming = "1";
  } else if (slug === "mainline-ipo-report") {
    query.category = "mainline";
  } else if (slug === "sme-ipo-report") {
    query.category = "sme";
  } else if (slug === "sme-ipos-by-sector") {
    query.category = "sme";
    query.by_sector = "true";
    query.sort = "sector_name";
  } else if (slug === "mainboard-ipos-by-sector") {
    query.category = "mainline";
    query.by_sector = "true";
    query.sort = "sector_name";
  }

  if (sector) {
    query.sector_name = sector;
    query.by_sector = "true";
  }

  const initialData = await ipoListApi.getAll(query);

  return <Reports initialData={initialData} initialSlug={slug} initialSector={sector ?? null} />;
}
