"use client";

import React, { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getImgSrc } from "@/utils/image";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Tag,
} from "lucide-react";
import Ribbon from "@/components/Ribbon";

const fallbackImage =
  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1000&auto=format&fit=crop";

const categoryStyles: Record<string, string> = {
  IPO: "bg-amber-50 text-amber-700 border-amber-200",
  Equity: "bg-emerald-50 text-emerald-700 border-emerald-200",
  NSE: "bg-blue-50 text-blue-700 border-blue-200",
  BSE: "bg-indigo-50 text-indigo-700 border-indigo-200",
  SEBI: "bg-red-50 text-red-700 border-red-200",
  Economy: "bg-purple-50 text-purple-700 border-purple-200",
  General: "bg-slate-50 text-slate-700 border-slate-200",
};

const categoryRibbonBgs: Record<string, string> = {
  IPO: "linear-gradient(135deg, #f59e0b, #d97706)",
  Equity: "linear-gradient(135deg, #10b981, #059669)",
  NSE: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
  BSE: "linear-gradient(135deg, #6366f1, #4f46e5)",
  SEBI: "linear-gradient(135deg, #ef4444, #b91c1c)",
  Economy: "linear-gradient(135deg, #a855f7, #7e22ce)",
  General: "linear-gradient(135deg, #64748b, #475569)",
};

const LatestNews = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { data: responseData, isLoading, error } = useQuery({
    queryKey: ["latestNewsHome"],
    queryFn: async () => {
      const res = await fetch("/api/news?limit=9");
      if (!res.ok) throw new Error("Failed to fetch news");
      return res.json();
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const newsItems = responseData?.data || [];

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, [newsItems, isLoading]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const move = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -move : move,
      behavior: "smooth",
    });
    setTimeout(checkScrollButtons, 450);
  };

  return (
    <section className="py-24 bg-[#f8f9fb] border-t border-slate-200 overflow-hidden relative">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">

        {/* Header Section */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Latest <span className="text-blue-900">News & Updates</span>
            </h2>
            <p className="text-slate-500 text-sm mt-2 max-w-xl font-medium">
              Stay updated with daily insights from the Indian capital markets, regulatory circulars, and IPO reviews.
            </p>
          </div>

          {/* Navigation Slider Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-11 h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 shadow-sm active:scale-95 disabled:opacity-0 disabled:pointer-events-none cursor-pointer`}
              aria-label="Scroll Left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-11 h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300 shadow-sm active:scale-95 disabled:opacity-0 disabled:pointer-events-none cursor-pointer`}
              aria-label="Scroll Right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <Link
              href="/news"
              className="hidden md:inline-flex items-center gap-1.5 px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-700 transition-colors ml-2 shadow-md"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          onScroll={checkScrollButtons}
          className="overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory flex"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-6">

            {/* Loading Skeletons */}
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[290px] sm:w-[320px] md:w-[360px] snap-center bg-white rounded-2xl border border-slate-150 overflow-hidden animate-pulse shadow-sm"
                >
                  <div className="h-48 bg-slate-200" />
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-6 bg-slate-200 rounded-full w-20" />
                      <div className="h-4 bg-slate-200 rounded w-24 ml-auto" />
                    </div>
                    <div className="h-5 bg-slate-200 rounded w-full" />
                    <div className="h-5 bg-slate-200 rounded w-4/5" />
                    <div className="h-4 bg-slate-200 rounded w-2/3 mt-2" />
                    <div className="h-9 bg-slate-200 rounded w-full mt-4" />
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="w-full text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 min-w-[300px]">
                <p className="text-red-500 font-semibold mb-2">Failed to load latest news</p>
                <p className="text-slate-400 text-sm">Please check your network connection or try again later.</p>
              </div>
            ) : newsItems.length === 0 ? (
              <div className="w-full text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 min-w-[300px]">
                <p className="text-slate-500 font-semibold mb-2">No news items found</p>
                <p className="text-slate-400 text-sm">Check back later for live market news.</p>
              </div>
            ) : (
              newsItems.map((item: any, i: number) => {
                const category = item.category || "General";
                const image = getImgSrc(item.image) || fallbackImage;

                return (
                  <div
                    key={item.id || i}
                    className="flex-shrink-0 w-[290px] sm:w-[320px] md:w-[360px] snap-center"
                  >
                    <Link
                      href={`/news/detail/${item.slug || item.id}`}
                      className="group flex flex-col bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 h-full"
                    >
                      {/* Image Area */}
                      <div className="h-48 overflow-hidden relative shrink-0">
                        <img
                          src={image}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = fallbackImage;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                      </div>

                      {/* Content Area */}
                      <div className="p-6 flex flex-col flex-grow justify-between">
                        <div>
                          {/* Badge & Date */}
                          <div className="flex items-center gap-3 mb-4 flex-wrap">
                            <Ribbon
                              fontSize="10px"
                              cutout="0.5em"
                              color={categoryRibbonBgs[category] || categoryRibbonBgs.General}
                              className="inline-flex items-center gap-1.5 text-white font-black uppercase tracking-wider"
                            >
                              <Tag className="h-2.5 w-2.5 text-white" />
                              {category}
                            </Ribbon>
                          </div>

                          {/* Title */}
                          <h3 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-2 mb-3 group-hover:text-blue-900 transition-colors">
                            {item.title}
                          </h3>
                        </div>

                        {/* Read More Link */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 group-hover:text-blue-700 transition-colors">
                            Read Full News
                            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* View All button on Mobile View */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-700 transition-colors shadow-sm"
          >
            View All News <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default React.memo(LatestNews);
