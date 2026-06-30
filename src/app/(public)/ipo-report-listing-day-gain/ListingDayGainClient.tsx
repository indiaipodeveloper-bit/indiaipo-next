"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn, getImageUrl } from "@/lib/utils";

import {
  Calendar as CalendarIcon,
  Search,

  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  FileText,
  TrendingUp,
  TrendingDown,
  Home,
  ChevronDown
} from "lucide-react";
import { motion } from "framer-motion";
import { API_URL } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import listingGain from "@/assets/listingGain2.webp"

interface IPOItem {
  id: number;
  issuer_company: string;
  logo: string | null;
  blog_image: string | null;
  open_date: string | null;
  close_date: string | null;
  listing_date: string | null;
  issue_size: string | number | null;
  issue_lowest_price: string | number | null;
  issue_highest_price: string | number | null;
  exchange: string | null;
  issue_category: string | null;
  blog_slug: string | null;
  ipo_subscription: string | null;
  listing_day_open_bse?: string | number | null;
  listing_day_open_nse?: string | number | null;
  listing_day_close_bse?: string | number | null;
  listing_day_close_nse?: string | number | null;
  listing_day_gain_percentage?: string | number | null;
}

const formatDate = (dateStr: any, options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' }) => {
  if (!dateStr || dateStr === "0" || dateStr === 0) return 'TBA';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? 'TBA' : d.toLocaleDateString('en-IN', options);
};

const getSubscriptionTimes = (subscriptionJson: string | null) => {
  if (!subscriptionJson) return { qib: "—", nii: "—", retail: "—", total: "—" };
  try {
    const parsed = typeof subscriptionJson === "string" ? JSON.parse(subscriptionJson) : subscriptionJson;
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return { qib: "—", nii: "—", retail: "—", total: "—" };
    }
    const latestRow = parsed[parsed.length - 1];
    const getFloatVal = (val: any) => parseFloat(val) || 0;

    const qOff = getFloatVal(latestRow.qib_offered);
    const qBid = getFloatVal(latestRow.qib_bid);
    const qibVal = qOff > 0 ? (qBid / qOff).toFixed(2) + "x" : "—";

    const bOff = getFloatVal(latestRow.bnii_offered);
    const sOff = getFloatVal(latestRow.snii_offered);
    const bBid = getFloatVal(latestRow.bnii_bid);
    const sBid = getFloatVal(latestRow.snii_bid);
    const niiOff = bOff + sOff;
    const niiBid = bBid + sBid;
    const niiVal = niiOff > 0 ? (niiBid / niiOff).toFixed(2) + "x" : "—";

    const rOff = getFloatVal(latestRow.retail_offered);
    const rBid = getFloatVal(latestRow.retail_bid);
    const retailVal = rOff > 0 ? (rBid / rOff).toFixed(2) + "x" : "—";

    const totOff = qOff + niiOff + rOff;
    const totBid = qBid + niiBid + rBid;
    const totalVal = totOff > 0 ? (totBid / totOff).toFixed(2) + "x" : "—";

    return { qib: qibVal, nii: niiVal, retail: retailVal, total: totalVal };
  } catch (err) {
    return { qib: "—", nii: "—", retail: "—", total: "—" };
  }
};

const getInitials = (name: string) => {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
};

export default function ListingDayGainClient({
  initialData,
  initialBannerVideo,
}: {
  initialData: any;
  initialBannerVideo: string | null;
}) {
  const router = useRouter();

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ["listing-day-gain", page, debouncedSearch, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "15");
      params.append("status", "Listed");
      if (debouncedSearch.trim() !== "") {
        params.append("search", debouncedSearch);
      }
      if (categoryFilter !== "all") {
        params.append("category", categoryFilter);
      }

      const res = await fetch(`${API_URL}/api/ipo-lists?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch");
      }
      return res.json();
    },
    initialData: page === 1 && debouncedSearch === "" && categoryFilter === "all" ? initialData : undefined,
    placeholderData: (prev) => prev,
    staleTime: 30000,
  });

  const paginatedItems: IPOItem[] = data?.data || [];
  const total = data?.pagination?.total || 0;
  const totalPages = data?.pagination?.totalPages || 0;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryFilter]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main>
        {/* Banner Section */}
        <section className="bg-[#001529] pt-16 pb-32 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={listingGain}
              alt="Listing Gain Banner"
              fill
              priority
              className="object-cover "
            />

            <div className="absolute inset-0 bg-gradient-to-b from-[#001529]/80 via-[#001529]/40 to-[#001529]" />
          </div>

          <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform translate-x-20 z-1"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-6">
              <Link href="/" className="hover:text-white flex items-center gap-1">
                <Home className="h-3 w-3" /> Home
              </Link>
              <span>/</span>
              <span className="text-white">IPO Listing Day Gain Report</span>
            </div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight"
            >
              Listing Day <span className="text-[#F99810]">Gain & Performance</span>
            </motion.h1>
            <p className="text-white/90 max-w-2xl text-lg md:text-xl font-medium">
              Analyze subscription demand against listing day opening and closing gain or loss percentages.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 -mt-10 mb-20 relative z-20">
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-slate-200 overflow-hidden">

            {/* Header Controls */}
            <div className="p-6 md:p-10 border-b border-slate-100 bg-white flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-600/20">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 leading-none">
                    IPO Listing <strong style={{ color: "#F99810" }}>Day Gain Report</strong>
                  </h2>
                  <p className="text-slate-500 mt-2 font-medium">{total} Listed Issues Found</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search company..."
                    className="w-full pl-12 pr-4 h-14 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white transition-all text-base outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="relative w-full sm:w-[200px]">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600 pointer-events-none" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full pl-11 pr-10 h-14 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-700 font-bold outline-none cursor-pointer focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 appearance-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="mainline">Mainline Only</option>
                    <option value="sme">SME Only</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="overflow-x-auto hidden xl:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100/90 text-slate-600 border-b border-slate-200">
                    <th className="px-5 py-4 text-left font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">Company</th>
                    <th className="px-4 py-4 text-left font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">Category</th>
                    <th className="px-4 py-4 text-left font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">Open Date</th>
                    <th className="px-4 py-4 text-left font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">Issue Price</th>
                    <th className="px-4 py-4 text-left font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">Issue Amt (Cr)</th>
                    <th className="px-4 py-4 text-center font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">QIB</th>
                    <th className="px-4 py-4 text-center font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">NII</th>
                    <th className="px-4 py-4 text-center font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">Retail</th>
                    <th className="px-4 py-4 text-center font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">Total</th>
                    <th className="px-4 py-4 text-left font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">Listing Date</th>
                    <th className="px-5 py-4 text-right font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">% Gain/Loss</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={11} className="py-24 text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing with Exchange...</span>
                      </td>
                    </tr>
                  ) : paginatedItems.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-24 text-center">
                        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                          <FileText className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">No Listing Gain Records</h3>
                        <p className="text-slate-500 text-sm">Please check back later or try adjusting filters.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedItems.map((item, idx) => {
                      const subs = getSubscriptionTimes(item.ipo_subscription);
                      const issuePrice = parseFloat(item.issue_highest_price as any) || parseFloat(item.issue_lowest_price as any) || 0;

                      const openPrice = parseFloat(item.listing_day_open_nse as any) || parseFloat(item.listing_day_open_bse as any) || 0;
                      const closePrice = parseFloat(item.listing_day_close_nse as any) || parseFloat(item.listing_day_close_bse as any) || 0;

                      let isPositive = false;
                      let isNegative = false;
                      let displayText = "";

                      if (item.listing_day_gain_percentage !== undefined && item.listing_day_gain_percentage !== null && item.listing_day_gain_percentage !== '') {
                        displayText = String(item.listing_day_gain_percentage).trim();
                        if (displayText.includes("-") || (displayText.startsWith("(") && displayText.endsWith(")")) || displayText.toLowerCase().includes("loss")) {
                          isNegative = true;
                        } else {
                          isPositive = true;
                        }
                      } else {
                        const calculatedPercentage = issuePrice > 0 && closePrice > 0
                          ? ((closePrice - issuePrice) / issuePrice) * 100
                          : 0;
                        isPositive = calculatedPercentage > 0;
                        isNegative = calculatedPercentage < 0;
                        displayText = (calculatedPercentage > 0 ? "+" : "") + calculatedPercentage.toFixed(2) + "%";
                      }

                      const hasGainInfo = (item.listing_day_gain_percentage !== undefined && item.listing_day_gain_percentage !== null && item.listing_day_gain_percentage !== '') || (closePrice > 0);

                      return (
                        <tr
                          key={`desktop-${item.id}`}
                          className="group transition-all hover:bg-slate-50/50 cursor-pointer border-b border-slate-50"
                          onClick={() => item.blog_slug ? router.push(`/ipo-blogs/${item.blog_slug}`) : null}
                        >
                          <td className="px-5 py-7 font-black text-slate-800 text-sm group-hover:text-blue-700 transition-colors">
                            {item.issuer_company}
                            {item.exchange && (
                              <span className="text-[9px] font-bold text-slate-400 border border-slate-200 px-1 py-0.2 rounded uppercase ml-1.5 shrink-0">
                                {item.exchange}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-7 capitalize text-slate-600 text-xs font-semibold">{item.issue_category || "—"}</td>
                          <td className="px-4 py-7 text-slate-600 text-xs whitespace-nowrap">{formatDate(item.open_date)}</td>
                          <td className="px-4 py-7 text-slate-900 font-bold text-xs">₹{issuePrice || "—"}</td>
                          <td className="px-4 py-7 text-slate-900 text-xs font-medium">{item.issue_size ? `₹${item.issue_size} Cr` : "—"}</td>
                          <td className="px-4 py-7 text-center text-slate-700 font-semibold text-xs">{subs.qib}</td>
                          <td className="px-4 py-7 text-center text-slate-700 font-semibold text-xs">{subs.nii}</td>
                          <td className="px-4 py-7 text-center text-slate-700 font-semibold text-xs">{subs.retail}</td>
                          <td className="px-4 py-7 text-center text-slate-900 font-bold text-xs bg-slate-50/30">{subs.total}</td>
                          <td className="px-4 py-7 text-slate-600 text-xs whitespace-nowrap">{formatDate(item.listing_date)}</td>
                          <td className="px-5 py-7 text-right font-black text-xs">
                            {hasGainInfo ? (
                              <span className={cn(
                                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full",
                                isPositive && "bg-emerald-50 text-emerald-700 border border-emerald-200",
                                isNegative && "bg-rose-50 text-rose-700 border border-rose-200",
                                !isPositive && !isNegative && "bg-slate-50 text-slate-600 border border-slate-200"
                              )}>
                                {isPositive && <TrendingUp className="h-3 w-3" />}
                                {isNegative && <TrendingDown className="h-3 w-3" />}
                                {displayText}
                              </span>
                            ) : (
                              <span className="text-slate-400 font-medium">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View Card Grid */}
            <div className="bg-[#f8fafc]/50 p-4 border-t border-slate-100 xl:hidden">
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center">
                  <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing with Exchange...</span>
                </div>
              ) : paginatedItems.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                  <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">No Listing Gain Records</h3>
                  <p className="text-slate-500 text-sm">Please check back later or try adjusting filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {paginatedItems.map((item, idx) => {
                    const subs = getSubscriptionTimes(item.ipo_subscription);
                    const issuePrice = parseFloat(item.issue_highest_price as any) || parseFloat(item.issue_lowest_price as any) || 0;

                    const openPrice = parseFloat(item.listing_day_open_nse as any) || parseFloat(item.listing_day_open_bse as any) || 0;
                    const closePrice = parseFloat(item.listing_day_close_nse as any) || parseFloat(item.listing_day_close_bse as any) || 0;

                    let isPositive = false;
                    let isNegative = false;
                    let displayText = "";

                    if (item.listing_day_gain_percentage !== undefined && item.listing_day_gain_percentage !== null && item.listing_day_gain_percentage !== '') {
                      displayText = String(item.listing_day_gain_percentage).trim();
                      if (displayText.includes("-") || (displayText.startsWith("(") && displayText.endsWith(")")) || displayText.toLowerCase().includes("loss")) {
                        isNegative = true;
                      } else {
                        isPositive = true;
                      }
                    } else {
                      const calculatedPercentage = issuePrice > 0 && closePrice > 0
                        ? ((closePrice - issuePrice) / issuePrice) * 100
                        : 0;
                      isPositive = calculatedPercentage > 0;
                      isNegative = calculatedPercentage < 0;
                      displayText = (calculatedPercentage > 0 ? "+" : "") + calculatedPercentage.toFixed(2) + "%";
                    }

                    const hasGainInfo = (item.listing_day_gain_percentage !== undefined && item.listing_day_gain_percentage !== null && item.listing_day_gain_percentage !== '') || (closePrice > 0);

                    return (
                      <div
                        key={`mobile-${item.id}`}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:border-slate-300 transition-colors cursor-pointer"
                        onClick={() => item.blog_slug ? router.push(`/ipo-blogs/${item.blog_slug}`) : null}
                      >
                        <div className="p-4 border-b border-slate-100 flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2">{item.issuer_company}</h3>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className="text-[9px] font-bold text-slate-400 border border-slate-200 px-1 py-0.2 rounded uppercase shrink-0">
                                {item.exchange || "BSE/NSE"}
                              </span>
                              <span className="text-[9px] font-black italic text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded uppercase tracking-tight shrink-0">
                                {item.issue_category || "Mainline"}
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0">
                            {hasGainInfo ? (
                              <span className={cn(
                                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold",
                                isPositive && "bg-emerald-50 text-emerald-700 border border-emerald-200",
                                isNegative && "bg-rose-50 text-rose-700 border border-rose-200",
                                !isPositive && !isNegative && "bg-slate-50 text-slate-600 border border-slate-200"
                              )}>
                                {isPositive && <TrendingUp className="h-3.5 w-3.5" />}
                                {isNegative && <TrendingDown className="h-3.5 w-3.5" />}
                                {displayText}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-xs font-semibold">—</span>
                            )}
                          </div>
                        </div>

                        <div className="p-4 grid grid-cols-2 gap-4 text-xs">
                          <div className="col-span-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Dates & Price</p>
                            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg mt-1">
                              <div>
                                <p className="text-[10px] text-slate-400">Open Date</p>
                                <p className="font-bold text-slate-700">{formatDate(item.open_date, { day: '2-digit', month: 'short' })}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400">Listing Date</p>
                                <p className="font-bold text-slate-700">{formatDate(item.listing_date, { day: '2-digit', month: 'short' })}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400">Price Band</p>
                                <p className="font-bold text-slate-850">₹{issuePrice || "—"}</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Issue Size</p>
                            <p className="font-bold text-slate-800 bg-slate-50 p-2.5 rounded-lg mt-1">{item.issue_size ? `₹${item.issue_size} Cr` : "—"}</p>
                          </div>
                          <div className="col-span-2 bg-slate-50 p-2.5 rounded-lg grid grid-cols-4 gap-2 text-center text-[11px]">
                            <div>
                              <p className="text-[9px] text-slate-400 uppercase font-bold">QIB</p>
                              <p className="font-bold text-slate-700">{subs.qib}</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-400 uppercase font-bold">NII</p>
                              <p className="font-bold text-slate-700">{subs.nii}</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-400 uppercase font-bold">Retail</p>
                              <p className="font-bold text-slate-700">{subs.retail}</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-400 uppercase font-bold">Total</p>
                              <p className="font-black text-slate-800">{subs.total}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-4 md:px-10 py-6 md:py-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between bg-slate-50/30 gap-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest hidden md:block">
                  Showing Page {page} of {totalPages}
                </p>
                <div className="flex items-center justify-between md:justify-end gap-1.5 md:gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center justify-center border border-slate-200 rounded-xl h-10 px-3 md:h-12 md:px-6 font-bold disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 bg-white hover:bg-slate-50 shrink-0"
                  >
                    <ChevronLeft className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Prev</span>
                  </button>
                  <div className="flex items-center gap-1 md:gap-2 px-1">
                    {(() => {
                      const pages = [];
                      const delta = 1;
                      for (let i = 1; i <= totalPages; i++) {
                        if (
                          i === 1 ||
                          i === totalPages ||
                          (i >= page - delta && i <= page + delta)
                        ) {
                          if (pages.length > 0 && i - pages[pages.length - 1] > 1) {
                            pages.push(-1);
                          }
                          pages.push(i);
                        }
                      }
                      return pages.map((p, idx) => (
                        p === -1 ? (
                          <span key={`ell-${idx}`} className="text-slate-300 px-1 text-xs md:text-sm">...</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`h-9 w-9 md:h-10 md:w-10 flex-shrink-0 rounded-xl text-xs md:text-sm font-black transition-all ${page === p
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                              : "text-slate-400 hover:bg-slate-100"
                              }`}
                          >
                            {p}
                          </button>
                        )
                      ));
                    })()}
                  </div>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="flex items-center justify-center border border-slate-200 rounded-xl h-10 px-3 md:h-12 md:px-6 font-bold disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 bg-white hover:bg-slate-50 shrink-0"
                  >
                    <span className="hidden md:inline">Next</span> <ChevronRight className="h-4 w-4 md:ml-2" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
