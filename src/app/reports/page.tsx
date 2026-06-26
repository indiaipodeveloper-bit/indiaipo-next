import Reports from "./ReportsPage";
import { ipoListApi } from "@/services/api";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}) {
  const { sector } = await searchParams;

  const initialData = await ipoListApi.getAll({
    page: "1",
    limit: "15",
    ...(sector && {
      sector_name: sector,
      by_sector: "true",
    }),
  });

  return (
    <Reports
      initialData={initialData}
      initialSlug="ipo-calendar"
      initialSector={sector ?? null}
    />
  );
}