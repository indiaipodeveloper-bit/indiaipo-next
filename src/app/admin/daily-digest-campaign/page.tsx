import type { Metadata } from "next";
import { Suspense } from "react";
import DailyDigestCampaignClient from "./DailyDigestCampaignClient";

export const metadata: Metadata = {
  title: "Daily Digest Campaign | Admin Dashboard",
  description: "Manage email broadcast campaigns for daily market reports.",
};

export default function DailyDigestCampaignPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    }>
      <DailyDigestCampaignClient />
    </Suspense>
  );
}
