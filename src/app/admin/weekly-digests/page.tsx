import type { Metadata } from "next";
import WeeklyDigestsClient from "./WeeklyDigestsClient";

export const metadata: Metadata = {
  title: "Weekly Reporter (Weekly Digests) | Admin Dashboard",
  description: "Manage weekly market reports, updates, and digests.",
};

export default function WeeklyDigestsPage() {
  return <WeeklyDigestsClient />;
}
