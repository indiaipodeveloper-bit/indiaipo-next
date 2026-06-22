import { Metadata } from "next";
import { Suspense } from "react";
import FPOClient from "./FPOClient";

export const metadata: Metadata = {
  title: "Follow-On Public Offer (FPO) | India IPO Advisory Services",
  description:
    "End-to-end advisory for listed companies raising additional capital through FPOs, ensuring efficient execution, regulatory compliance and strong investor participation.",
  keywords: "follow-on public offer, fpo, public listing, secondary offer, capital raise",
  alternates: {
    canonical: "https://www.indiaipo.in/fpo",
  },
};

export default function FPOPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      }
    >
      <FPOClient />
    </Suspense>
  );
}
