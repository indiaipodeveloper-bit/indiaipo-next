import type { Metadata } from "next";
import DailyDigestsClient from "./DailyDigestsClient";

export const metadata: Metadata = {
  title: "Daily Reporter (Daily Digests) | Admin Dashboard",
  description: "Manage daily market reports, newsletters, and updates.",
};

export default function DailyDigestsPage() {
  return <DailyDigestsClient />;
}
