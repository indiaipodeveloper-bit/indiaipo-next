import type { Metadata } from "next";
import MarketSnapsClient from "./MarketSnapsClient";

export const metadata: Metadata = {
  title: "Market Snaps (YouTube Feed) | Admin Dashboard",
  description: "Manage market snaps fetched directly from YouTube.",
};

export default function MarketSnapsPage() {
  return <MarketSnapsClient />;
}
