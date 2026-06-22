import { Metadata } from "next";
import { Suspense } from "react";
import VideoUpdatesClient from "./VideoUpdatesClient";

export const metadata: Metadata = {
  title: "Watch Our IPO Video Updates | IPO & Market Snaps",
  description: "Catch the latest IPO updates, market analyses, and trending financial news visually.",
  alternates: {
    canonical: "https://www.indiaipo.in/ipo-video-updates",
  },
};

export default function VideoUpdatesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001529]"></div>
      </div>
    }>
      <VideoUpdatesClient />
    </Suspense>
  );
}
