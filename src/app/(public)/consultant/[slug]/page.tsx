import { Metadata } from "next";
import { Suspense } from "react";
import ConsultantDetailsClient from "./ConsultantDetailsClient";
import { API_URL } from "@/lib/constants";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  try {
    const res = await fetch(`${API_URL}/api/consultants/${slug}`);
    if (res.ok) {
      const consultant = await res.json();
      return {
        title: consultant.meta_title || `${consultant.name} | India IPO Expert Consultant`,
        description: consultant.meta_desc || consultant.description?.substring(0, 160) || "Expert IPO advisory services.",
        keywords: consultant.meta_keywords || consultant.tags || "IPO, Listing",
        alternates: {
          canonical: `https://www.indiaipo.in/consultant/${slug}`
        }
      };
    }
  } catch (err) {
    console.error("Metadata generation error:", err);
  }
  return {
    title: "Expert IPO Consultant | India IPO",
    description: "Expert IPO advisory services.",
  };
}

export default function ConsultantDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#001529]"></div>
      </div>
    }>
      <ConsultantDetailsClient />
    </Suspense>
  );
}
