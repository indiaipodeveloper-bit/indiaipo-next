"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getImageUrl, cn, getLatestGmpValue } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Home, ChevronRight, TrendingUp, Search, Calendar, BarChart3, PieChart,
  Info, Loader2, ChevronLeft, ArrowUpRight,
} from "lucide-react";
import { getImgSrc } from "@/utils/image";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/constants";

interface IPOItem {
  id: number;
  issuer_company: string;
  logo: string | null;
  blog_image: string | null;
  open_date: string | null;
  close_date: string | null;
  listing_date: string | null;
  gmp: string | null;
  issue_size: string | number | null;
  issue_lowest_price: string | number | null;
  issue_highest_price: string | number | null;
  lot_size: string | number | null;
  status: string;
  exchange: string | null;
  sector_name: string | null;
  sector_names: string | null;
  sector: string | null;
  issue_category: string | null;
  blog_slug: string | null;
  ipo_pe_ratio: string | number | null;
  date_declared?: string | number;
}

interface SectorItem {
  id: string | number;
  name: string;
  sme_count?: string | number;
  mainline_count?: string | number;
}

const statusColor: Record<string, string> = {
  Active:
    "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300",
  Upcoming:
    "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300",
  "Issue Closed (Unlisted)":
    "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-500 hover:text-white hover:border-yellow-500 transition-all duration-300",
  Listed:
    "bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-400 transition-all duration-300",
  Inactive:
    "bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all duration-300",
  "Listing Today":
    "bg-red-100 text-red-800 border-red-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300",
  "Date Not Declared":
    "bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all duration-300",
};

const rowBgColor: Record<string, string> = {
  Active: "bg-emerald-100/30 hover:bg-emerald-100/60",
  Upcoming: "bg-blue-100/30 hover:bg-blue-100/60",
  "Issue Closed (Unlisted)": "bg-yellow-100/30 hover:bg-yellow-100/60",
  Listed: "bg-white hover:bg-slate-100/80",
  Inactive: "bg-rose-100/30 hover:bg-rose-100/60",
  "Listing Today": "bg-red-100/30 hover:bg-red-100/60",
  "Date Not Declared": "bg-orange-50/40 hover:bg-orange-100/30",
};

const getCalculatedStatus = (item: any) => {
  if (item.status === "Inactive") return "Inactive";

  if (item.date_declared === "No" || item.date_declared === "Date Not Declared" || !item.date_declared || item.date_declared === "" || item.date_declared === "0" || item.date_declared === 0) {
    return "Date Not Declared";
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const openDate = item.open_date ? new Date(item.open_date) : null;
  const closeDate = item.close_date ? new Date(item.close_date) : null;
  const listingDate = item.listing_date ? new Date(item.listing_date) : null;

  openDate?.setHours(0, 0, 0, 0);
  closeDate?.setHours(0, 0, 0, 0);
  listingDate?.setHours(0, 0, 0, 0);

  if (openDate && now < openDate) {
    return "Upcoming";
  }

  if (openDate && closeDate && now >= openDate && now <= closeDate) {
    return "Active";
  }

  if (closeDate && listingDate && now > closeDate && now < listingDate) {
    return "Issue Closed (Unlisted)";
  }

  if (listingDate && now.getTime() === listingDate.getTime()) {
    return "Listing Today";
  }

  if (listingDate && now > listingDate) {
    return "Listed";
  }

  return item.status || "Upcoming";
};

const formatDate = (dateStr: any, options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short" }) => {
  if (!dateStr || dateStr === "0" || dateStr === 0) return "TBA";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? "TBA" : d.toLocaleDateString("en-IN", options);
};

export default function ReportsClient({
  initialData,
  initialTotal,
  initialTotalPages,
  initialSectors,
  initialBannerVideo,
  title,
  subtitle,
  categoryType,
  effectiveSlug,
}: {
  initialData: IPOItem[];
  initialTotal: number;
  initialTotalPages: number;
  initialSectors: SectorItem[];
  initialBannerVideo: string | null;
  title: string;
  subtitle: string;
  categoryType: "all" | "mainline" | "sme";
  effectiveSlug: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sectorFilter = searchParams.get("sector");

  const [items, setItems] = useState<IPOItem[]>(initialData);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const isSectorPage = effectiveSlug?.includes("by-sector");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [effectiveSlug, sectorFilter]);

  const fetchData = async (currentPage: number, currentSearch: string, currentStatus: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", "15");
      if (currentSearch) params.append("search", currentSearch);
      if (currentStatus !== "all") params.append("status", currentStatus);

      if (sectorFilter) {
        params.append("sector_name", sectorFilter);
        params.append("by_sector", "true");
      }
      if (effectiveSlug?.includes("by-sector")) {
        params.append("sort", "sector_name");
        params.append("by_sector", "true");
      }

      if (effectiveSlug === "upcoming-ipo-calendar") {
        params.append("upcoming", "1");
      } else if (categoryType === "mainline") {
        params.append("category", "mainline");
      } else if (categoryType === "sme") {
        params.append("category", "sme");
      }

      const res = await fetch(`${API_URL}/api/ipo-lists?${params.toString()}`);
      if (res.ok) {
        const body = await res.json();
        setItems(body.data || []);
        setTotal(body.pagination?.total || 0);
        setTotalPages(body.pagination?.totalPages || 0);
      }
    } catch (err) {
      console.error("Error fetching reports client-side:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page !== 1 || debouncedSearch !== "" || statusFilter !== "all") {
      fetchData(page, debouncedSearch, statusFilter);
    } else if (initialData.length === 0) {
      // Server-side fetch returned empty — retry client-side
      fetchData(1, "", "all");
    } else {
      setItems(initialData);
      setTotal(initialTotal);
      setTotalPages(initialTotalPages);
    }
  }, [page, debouncedSearch, statusFilter, sectorFilter, effectiveSlug]);

  const calculateStats = (key: keyof IPOItem) => {
    const values = items
      .map((item) => {
        const val = item[key];
        if (typeof val === "string") return parseFloat(val.replace(/[^0-9.]/g, ""));
        return typeof val === "number" ? val : 0;
      })
      .filter((v) => v > 0);

    if (values.length === 0) return { highest: 0, lowest: 0, median: 0 };

    const sorted = [...values].sort((a, b) => a - b);
    const highest = sorted[sorted.length - 1];
    const lowest = sorted[0];
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    return { highest, lowest, median };
  };

  const sizeStats = calculateStats("issue_size");
  const peStats = calculateStats("ipo_pe_ratio");

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      <main>
        <section className="bg-[#001529] py-8 md:py-12 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-20"
              src={getImageUrl(initialBannerVideo || "video/ccvindia1.mp4")}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#001529]/90 via-[#001529]/60 to-[#001529]" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-2 text-white/50 text-xs mb-4 flex-wrap">
              <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
                <Home className="h-3 w-3 text-[#f59e08]" /> Home
              </Link>
              <ChevronRight className="h-3 w-3 text-white/30" />
              <span className="text-white/70">Reports</span>
              <ChevronRight className="h-3 w-3 text-white/30" />
              <span className="text-white/90 font-semibold">{title}</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl md:text-5xl gap-3 font-black flex text-white mb-2 leading-tight">
                {title.split(" ").map((word, i) => (
                  <span key={i} className={i % 2 === 1 ? "text-[#f59e08]" : ""}>{word} </span>
                ))}
              </h1>
              <p className="text-white/65 max-w-xl text-sm font-medium leading-relaxed">
                {subtitle}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - List table */}
              <div className="flex-1 min-w-0 order-2 lg:order-1">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
                  {/* Summary Legend */}
                  <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#001529] flex items-center justify-center">
                        <BarChart3 className="h-4 w-4 text-[#f59e08]" />
                      </div>
                      <span className="text-sm font-black text-[#001529]">{total} Records Found</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-orange-400 rounded-full"></span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">TBA</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-blue-400 rounded-full"></span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Upcoming</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Closed</span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop view table */}
                  <div className="overflow-x-auto hidden lg:block">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-100/80 text-slate-600 border-b border-slate-200">
                          {["Company & Sector", "IPO Dates", "GMP", "Issue Size", "Price Band", "Lot Size", "Status", "Details"].map((h) => (
                            <th key={h} className={cn(
                              "px-5 py-4 text-left font-black text-xs uppercase tracking-widest whitespace-nowrap",
                              (h === "Status" || h === "GMP") && "text-center",
                              h === "Details" && "text-right"
                            )}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {loading ? (
                          <tr>
                            <td colSpan={8} className="py-24 text-center">
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#001529] to-[#003380] flex items-center justify-center mx-auto mb-4">
                                <Loader2 className="h-7 w-7 animate-spin text-[#f59e08]" />
                              </div>
                              <p className="text-slate-500 font-semibold">Fetching real-time data…</p>
                            </td>
                          </tr>
                        ) : items.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-24 text-center">
                              <Info className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                              <p className="text-slate-500 font-semibold">No records matching your search</p>
                            </td>
                          </tr>
                        ) : (
                          items.map((item, idx) => {
                            const displayStatus = getCalculatedStatus(item);
                            return (
                              <tr
                                key={`desktop-${item.id}`}
                                className={cn(
                                  "transition-all group cursor-pointer",
                                  rowBgColor[String(displayStatus)] || (idx % 2 === 0 ? "bg-white hover:bg-slate-50" : "bg-[#F8FAFC] hover:bg-slate-100")
                                )}
                                onClick={() => {
                                  if (item.blog_slug) router.push(`/ipo-blogs/${item.blog_slug}`);
                                }}
                              >
                                <td className="px-5 py-5">
                                  <div className="flex items-center gap-3">
                                    {getImgSrc(item.logo || item.blog_image) ? (
                                      <img
                                        src={getImgSrc(item.logo || item.blog_image)!}
                                        alt=""
                                        className="w-10 h-10 rounded-lg object-contain border border-slate-200 bg-white p-1 group-hover:scale-105 transition-transform"
                                      />
                                    ) : (
                                      <div className="w-10 h-10 rounded-lg bg-[#001529]/10 flex items-center justify-center text-[#001529] font-black text-sm">
                                        {getInitials(item.issuer_company)}
                                      </div>
                                    )}
                                    <div>
                                      <p className="font-black text-[#001529] text-[15px] group-hover:text-blue-700 transition-colors leading-snug">
                                        {item.issuer_company}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase" style={{ background: "rgba(0,21,41,0.08)", color: "#001529" }}>
                                          {item.exchange || "BSE/NSE"}
                                        </span>
                                        <span className="text-[10px] font-black italic text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tight ml-2">
                                          {item.sector_name || item.sector_names || item.sector || item.issue_category || "Mainline"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                <td className="px-5 py-5 whitespace-nowrap">
                                  <div className="text-sm font-black text-[#001529]">
                                    {formatDate(item.open_date)} – {formatDate(item.close_date)}
                                  </div>
                                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                    <Calendar className="h-2.5 w-2.5 text-[#fbbf24]" />
                                    Listing: {formatDate(item.listing_date, { day: "2-digit", month: "short", year: "numeric" })}
                                  </p>
                                </td>

                                <td className="px-5 py-5 text-center">
                                  <div className="flex flex-col items-center">
                                    <span className={cn(
                                      "text-sm font-black",
                                      item.gmp && item.gmp !== "0" ? "text-emerald-600" : "text-slate-400"
                                    )}>
                                      {getLatestGmpValue(item.gmp)}
                                    </span>
                                    <span className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">Premium</span>
                                  </div>
                                </td>

                                <td className="px-5 py-5 whitespace-nowrap">
                                  <span className="font-black text-sm text-[#001529]">
                                    {item.issue_size && item.issue_size !== "0" && item.issue_size !== 0 ? `₹${item.issue_size} Cr` : "TBA"}
                                  </span>
                                </td>

                                <td className="px-5 py-5 whitespace-nowrap">
                                  <div className="text-sm font-bold text-[#001529]">
                                    {item.issue_lowest_price && item.issue_lowest_price !== "0" && item.issue_lowest_price !== 0 ? `₹${item.issue_lowest_price} – ₹${item.issue_highest_price}` : (item.issue_highest_price && item.issue_highest_price !== "0" && item.issue_highest_price !== 0 ? `₹${item.issue_highest_price}` : "TBA")}
                                  </div>
                                  <p className="text-[10px] text-slate-400 mt-0.5">Per Share</p>
                                </td>

                                <td className="px-5 py-5 whitespace-nowrap">
                                  <span className="font-black text-sm text-[#001529] italic">{item.lot_size || "TBA"}</span>
                                  <p className="text-[10px] text-slate-400 mt-0.5">Min. Lot</p>
                                </td>

                                <td className="px-5 py-5 text-center">
                                  <span className={cn(
                                    "inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm border",
                                    statusColor[String(displayStatus)] || "bg-slate-100 text-slate-500 border-slate-200"
                                  )}>
                                    {displayStatus}
                                  </span>
                                </td>

                                <td className="px-5 py-5 text-right">
                                  {item.blog_slug ? (
                                    <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold px-4 cursor-pointer">
                                      <Link href={`/ipo-blogs/${item.blog_slug}`}>
                                        Analyze <ArrowUpRight className="h-3.5 w-3.5 ml-1.5" />
                                      </Link>
                                    </Button>
                                  ) : (
                                    <Button disabled size="sm" variant="outline" className="rounded-xl font-bold text-slate-300 px-4">
                                      No Details
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile view cards */}
                  <div className="p-4 bg-[#F8FAFC]/30 border-slate-100 lg:hidden w-full overflow-hidden">
                    {loading ? (
                      <div className="py-20 flex flex-col items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-[#f59e08] mb-4" />
                        <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Fetching records...</span>
                      </div>
                    ) : items.length === 0 ? (
                      <div className="py-20 text-center flex flex-col items-center justify-center">
                        <Info className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-xl font-bold text-[#001529] mb-1">No Matching IPOs</h3>
                        <p className="text-slate-500 text-sm">Try adjusting your filters to find what you're looking for.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {items.map((item, idx) => {
                          const displayStatus = getCalculatedStatus(item);
                          const statusLabel = displayStatus === "Active" ? "Open" : displayStatus;

                          let borderColor = "border-slate-200";
                          let statusBg = "bg-slate-100";
                          let statusText = "text-slate-600";
                          let dotColor = "bg-slate-500";

                          if (displayStatus === "Active") {
                            borderColor = "border-emerald-500";
                            statusBg = "bg-emerald-600";
                            statusText = "text-white";
                            dotColor = "bg-white";
                          } else if (displayStatus === "Upcoming") {
                            borderColor = "border-blue-500";
                            statusBg = "bg-blue-600";
                            statusText = "text-white";
                            dotColor = "bg-white";
                          } else if (displayStatus === "Issue Closed (Unlisted)") {
                            borderColor = "border-yellow-500";
                            statusBg = "bg-yellow-500";
                            statusText = "text-white";
                            dotColor = "bg-white";
                          } else if (displayStatus === "Listed") {
                            borderColor = "border-slate-300";
                            statusBg = "bg-white";
                            statusText = "text-slate-700";
                            dotColor = "bg-slate-500";
                          } else if (displayStatus === "Listing Today") {
                            borderColor = "border-red-500";
                            statusBg = "bg-red-600";
                            statusText = "text-white";
                            dotColor = "bg-white";
                          } else if (displayStatus === "Date Not Declared") {
                            borderColor = "border-orange-500";
                            statusBg = "bg-orange-600";
                            statusText = "text-white";
                            dotColor = "bg-white";
                          }

                          return (
                            <div
                              key={`mobile-${item.id}`}
                              className={cn(
                                "rounded-xl shadow-sm border border-slate-200 border-l-[5px] transition-all overflow-hidden flex flex-col",
                                borderColor,
                                rowBgColor[String(displayStatus)] || "bg-white"
                              )}
                              onClick={() => {
                                if (item.blog_slug) router.push(`/ipo-blogs/${item.blog_slug}`);
                              }}
                            >
                              <div className="p-4 flex justify-between items-start gap-3 border-b border-slate-100/80 border-dashed">
                                <div className="flex items-start gap-3">
                                  <div className="h-10 w-10 bg-[#001529] rounded-lg text-white flex items-center justify-center font-black text-xs shrink-0 overflow-hidden shadow-sm mt-0.5">
                                    {getImgSrc(item.logo || item.blog_image) ? (
                                      <img src={getImgSrc(item.logo || item.blog_image)!} alt={item.issuer_company} className="h-full w-full object-contain bg-white p-1" />
                                    ) : (
                                      getInitials(item.issuer_company)
                                    )}
                                  </div>
                                  <div className="flex flex-col">
                                    <h3 className="font-bold text-[#001529] text-[14px] leading-tight line-clamp-2">{item.issuer_company}</h3>
                                    <span className="text-[10px] font-black italic text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tight mt-1.5 w-max">
                                      {item.sector_name || item.sector_names || item.sector || item.issue_category || "Sector TBA"}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex flex-col items-end gap-2 shrink-0">
                                  <div className={`flex items-center gap-1.5 ${statusBg} ${statusText} px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest w-max`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${dotColor} animate-pulse`}></span>
                                    {statusLabel}
                                  </div>
                                  <span className="bg-[#001529] text-[#f59e08] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider w-max shadow-sm">
                                    {item.exchange || 'BSE/NSE'}
                                  </span>
                                </div>
                              </div>

                              <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-3">
                                <div className="flex flex-col">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">IPO Dates</p>
                                  <p className="text-[12px] font-bold text-[#001529]">{formatDate(item.open_date)} - {formatDate(item.close_date)}</p>
                                  <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Listing: {formatDate(item.listing_date, { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                </div>
                                <div className="flex flex-col">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Issue Size</p>
                                  <p className="text-[12px] font-black text-blue-600">{item.issue_size && item.issue_size !== '0' && item.issue_size !== 0 ? `₹${item.issue_size} Cr.` : 'TBA'}</p>
                                </div>
                                <div className="flex flex-col">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Price Band</p>
                                  <p className="text-[12px] font-bold text-[#001529]">{item.issue_lowest_price && item.issue_lowest_price !== '0' && item.issue_lowest_price !== 0 ? `₹${item.issue_lowest_price} - ₹${item.issue_highest_price}` : (item.issue_highest_price && item.issue_highest_price !== '0' && item.issue_highest_price !== 0 ? `₹${item.issue_highest_price}` : 'TBA')}</p>
                                </div>
                                <div className="flex flex-col">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lot Size</p>
                                  <p className="text-[12px] font-bold text-[#001529]">{item.lot_size || 'TBA'}</p>
                                </div>
                                <div className="flex flex-col">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Latest GMP</p>
                                  <p className={cn(
                                    "text-[12px] font-black",
                                    item.gmp && item.gmp !== '0' && item.gmp !== '—' ? "text-green-600" : "text-slate-400"
                                  )}>
                                    {getLatestGmpValue(item.gmp)}
                                  </p>
                                </div>
                              </div>

                              <div className="px-4 pb-4 mt-auto">
                                {item.blog_slug ? (
                                  <Button asChild size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/10 h-10 transition-all cursor-pointer">
                                    <Link href={`/ipo-blogs/${item.blog_slug}`}>
                                      Analyze Details <ArrowUpRight className="h-4 w-4 ml-1.5" />
                                    </Link>
                                  </Button>
                                ) : (
                                  <Button disabled size="sm" variant="outline" className="w-full rounded-xl font-bold text-slate-300 h-10 border-slate-200">
                                    No Details
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Desktop Pagination */}
                  {totalPages > 1 && (() => {
                    const delta = 1;
                    const range: (number | "...")[] = [];
                    const rangeSet = new Set<number>();

                    [1, totalPages, ...Array.from({ length: delta * 2 + 1 }, (_, i) => page - delta + i)]
                      .filter(p => p >= 1 && p <= totalPages)
                      .sort((a, b) => a - b)
                      .forEach(p => rangeSet.add(p));

                    const sorted = Array.from(rangeSet).sort((a, b) => a - b);
                    sorted.forEach((p, i) => {
                      if (i > 0 && p - sorted[i - 1] > 1) range.push("...");
                      range.push(p);
                    });

                    return (
                      <div className="px-4 md:px-5 py-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between bg-[#F8FAFC] gap-4">
                        <p className="text-xs text-slate-400 font-semibold hidden md:block">
                          Page {page} of {totalPages}
                        </p>
                        <div className="flex items-center justify-between md:justify-end gap-1 md:gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                          <button onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="flex items-center justify-center gap-1 px-2.5 md:px-4 h-9 min-w-[36px] rounded-xl font-black text-xs bg-[#001529] text-white hover:bg-[#002147] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer">
                            <ChevronLeft className="h-4 w-4" /> <span className="hidden md:inline">Previous</span>
                          </button>

                          <div className="flex items-center gap-1 px-1">
                            {range.map((p, idx) =>
                              p === "..." ? (
                                <span key={`e-${idx}`} className="px-0.5 md:px-1 text-slate-400 text-xs font-black">...</span>
                              ) : (
                                <button key={p} onClick={() => setPage(p as number)}
                                  className="w-8 h-8 md:w-9 md:h-9 shrink-0 rounded-xl text-xs font-black transition-all shadow-sm cursor-pointer"
                                  style={page === p
                                    ? { background: "#f59e08", color: "#001529" }
                                    : { background: "#f1f5f9", color: "#475569" }}>
                                  {p}
                                </button>
                              )
                            )}
                          </div>

                          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages}
                            className="flex items-center justify-center gap-1 px-2.5 md:px-4 h-9 min-w-[36px] rounded-xl font-black text-xs bg-[#001529] text-white hover:bg-[#002147] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer">
                            <span className="hidden md:inline">Next</span> <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Right Column - Filters & Stats */}
              <div className="lg:w-80 shrink-0 space-y-6 order-1 lg:order-2 lg:sticky lg:top-[120px] lg:self-start lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pb-6 scrollbar-hide">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-5">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Search Company</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                      <input
                        placeholder="Search here…"
                        className="pl-9 pr-4 py-2.5 w-full rounded-xl bg-slate-50 border border-slate-100 focus:bg-white transition-all text-sm font-semibold outline-none focus:border-[#f59e08]/30"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Issue Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none cursor-pointer"
                    >
                      <option value="all">All Issues</option>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Active">Active</option>
                      <option value="Issue Closed (Unlisted)">Closed (Unlisted)</option>
                      <option value="Listing Today">Listing Today</option>
                      <option value="Listed">Listed</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Quick Navigator</label>
                    <select
                      value={pathname}
                      onChange={(e) => router.push(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none cursor-pointer"
                    >
                      <option value="/all-ipos">IPO Calendar</option>
                      <option value="/mainline-ipos">Mainline IPO Updates</option>
                      <option value="/sme-ipos">SME IPO Updates</option>
                      <option value="/sme-ipo-sector">SME IPOs by Sector</option>
                      <option value="/mainboard-ipo-sector">Mainboard IPOs by Sector</option>
                    </select>
                  </div>

                  {isSectorPage && (
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Filter by Sector</label>
                      <select
                        value={sectorFilter || "all"}
                        onChange={(e) => {
                          const val = e.target.value;
                          router.push(val === "all" ? pathname : `${pathname}?sector=${encodeURIComponent(val)}`);
                        }}
                        className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold outline-none cursor-pointer"
                      >
                        <option value="all">All Sectors</option>
                        {initialSectors
                          .filter((s) => {
                            if (sectorFilter === s.name) return true;
                            const isSme = effectiveSlug === "sme-ipos-by-sector";
                            const count = isSme ? (Number(s.sme_count) || 0) : (Number(s.mainline_count) || 0);
                            return count > 0;
                          })
                          .map((s) => (
                            <option key={s.id} value={s.name}>{s.name}</option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Stats Widget 1 */}
                <div className="bg-[#001529] rounded-2xl p-6 border border-[#f59e08]/20 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#f59e08]/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#f59e08]/20 transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-[#f59e08]/20 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-[#f59e08]" />
                      </div>
                      <h3 className="text-white font-black text-xs uppercase tracking-widest">IPO Size (Cr.)</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white/50 text-[13px] font-medium">Highest</span>
                        <span className="text-white font-black text-[15px]">₹{sizeStats.highest.toFixed(2)}</span>
                      </div>
                      <div className="w-full h-px bg-white/5" />
                      <div className="flex items-center justify-between">
                        <span className="text-white/50 text-[13px] font-medium">Median</span>
                        <span className="text-white font-black text-[15px]">₹{sizeStats.median.toFixed(2)}</span>
                      </div>
                      <div className="w-full h-px bg-white/5" />
                      <div className="flex items-center justify-between">
                        <span className="text-white/50 text-[13px] font-medium">Lowest</span>
                        <span className="text-white font-black text-[15px]">₹{sizeStats.lowest.toFixed(2)}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-white/30 mt-6 italic">Summary of listed records</p>
                  </div>
                </div>

                {/* Stats Widget 2 */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <PieChart className="h-4 w-4 text-blue-600" />
                      </div>
                      <h3 className="text-[#001529] font-black text-xs uppercase tracking-widest">P/E Ratio</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[13px] font-medium">Highest</span>
                        <span className="text-[#001529] font-black text-[15px]">{peStats.highest.toFixed(2)}</span>
                      </div>
                      <div className="w-full h-px bg-slate-100" />
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[13px] font-medium">Median</span>
                        <span className="text-[#001529] font-black text-[15px]">{peStats.median.toFixed(2)}</span>
                      </div>
                      <div className="w-full h-px bg-slate-100" />
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[13px] font-medium">Lowest</span>
                        <span className="text-[#001529] font-black text-[15px]">{peStats.lowest.toFixed(2)}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-300 mt-6 italic">Valuation metrics overview</p>
                  </div>
                </div>

                <Link href="/ipo-eligibility-check" className="block group">
                  <div className="bg-gradient-to-br from-[#f59e08] to-[#d97706] rounded-2xl p-6 text-[#001529] shadow-lg shadow-[#f59e08]/20 transition-all hover:scale-[1.02]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#001529]/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <h3 className="font-black text-sm uppercase leading-tight">Check IPO<br />Eligibility</h3>
                    </div>
                    <p className="text-xs font-bold opacity-80 mb-4 leading-relaxed">
                      Planning to take your company public? Get expert guidance today.
                    </p>
                    <div className="flex items-center gap-2 font-black text-xs bg-[#001529] text-[#f59e08] w-max px-4 py-2 rounded-lg">
                      Start Now <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
