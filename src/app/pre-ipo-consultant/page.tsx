import { Metadata } from "next";
import { Suspense } from "react";
import PreIpoClient from "./PreIpoClient";

export const metadata: Metadata = {
  title: "Pre-IPO Funding Services | India IPO Advisory Services",
  description:
    "Expert-led pre-IPO fundraising support focused on investor access, deal structuring and optimal valuation to make companies IPO ready.",
  keywords: "pre-ipo funding, pre-ipo valuation, bridge financing, investor pitch, capital raising",
  alternates: {
    canonical: "https://www.indiaipo.in/pre-ipo-consultant",
  },
};

export default function PreIpoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      }
    >
      <PreIpoClient />
    </Suspense>
  );
}
