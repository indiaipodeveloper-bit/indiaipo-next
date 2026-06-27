"use client";

import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import LazySection from "@/components/LazySection";
import AboutPreview from "@/components/AboutPreview";
import ServicesSection from "@/components/ServicesSection";
import Hero from "@/components/home/Hero";
import { API_URL } from "@/lib/constants";

const LiveIPOs = lazy(() => import("@/components/home/LiveIPOs"));
const GMPSection = lazy(() => import("@/components/home/GMPSection"));
const SitePopup = lazy(() => import("@/components/SitePopup"));
const IPOTable = lazy(() => import("@/components/home/IPOTable"));
const BentoGrid = lazy(() => import("@/components/home/BentoGrid"));
const VideoSection = lazy(() => import("@/components/home/VideoSection"));
const MarketInsights = lazy(() => import("@/components/home/MarketInsights"));
const WeeklyReporter = lazy(() => import("@/components/home/WeeklyReporter"));
const AcademyFAQ = lazy(() => import("@/components/home/AcademyFAQ"));
const AnnualReport = lazy(() => import("@/components/home/AnnualReport"));
const LatestNews = lazy(() => import("@/components/home/LatestNews"));
const Newsletter = lazy(() => import("@/components/home/Newsletter"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function HomeContent() {
  const { data: ipoData, isLoading } = useQuery({
    queryKey: ["homeIpos"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/ipo-lists?limit=10`);
      if (!res.ok) throw new Error("Failed to fetch IPOs");
      return res.json();
    },
  });

  const ipos = ipoData?.data || [];

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.location.hash) return;

    let interval: ReturnType<typeof setInterval> | null = null;

    const handleScroll = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const targetId = hash.replace("#", "");
      if (!targetId) return;

      if (interval) clearInterval(interval);

      let attempts = 0;
      interval = setInterval(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          if (interval) clearInterval(interval);
        }
        attempts++;
        if (attempts > 50) {
          if (interval) clearInterval(interval);
        }
      }, 100);
    };

    handleScroll();

    window.addEventListener("hashchange", handleScroll);
    return () => {
      if (interval) clearInterval(interval);
      window.removeEventListener("hashchange", handleScroll);
    };
  }, [isLoading]);

  return (
    <>
      <main>
        <Hero />
        <AboutPreview />
        <ServicesSection />

        <LazySection>
          <Suspense fallback={null}>
            <LiveIPOs ipos={ipos} isLoading={isLoading} />
          </Suspense>
        </LazySection>

        <LazySection>
          <Suspense fallback={null}>
            <GMPSection ipos={ipos} isLoading={isLoading} />
          </Suspense>
        </LazySection>

        <LazySection>
          <Suspense fallback={null}>
            <IPOTable ipos={ipos} isLoading={isLoading} />
          </Suspense>
        </LazySection>

        <Suspense fallback={null}>
          <BentoGrid />
        </Suspense>

        <Suspense fallback={null}>
          <VideoSection />
        </Suspense>

        <LazySection>
          <Suspense fallback={null}>
            <MarketInsights />
          </Suspense>
        </LazySection>

        <LazySection>
          <Suspense fallback={null}>
            <WeeklyReporter />
          </Suspense>
        </LazySection>

        <LazySection>
          <Suspense fallback={null}>
            <AcademyFAQ />
          </Suspense>
        </LazySection>

        <LazySection>
          <Suspense fallback={null}>
            <AnnualReport />
          </Suspense>
        </LazySection>

        <LazySection>
          <Suspense fallback={null}>
            <LatestNews />
          </Suspense>
        </LazySection>

        <LazySection>
          <Suspense fallback={null}>
            <Newsletter />
          </Suspense>
        </LazySection>
      </main>

      <Suspense fallback={null}>
        <SitePopup />
      </Suspense>
    </>
  );
}

export default function HomeClient() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomeContent />
    </QueryClientProvider>
  );
}
