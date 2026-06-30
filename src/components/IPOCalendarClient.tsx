"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn, getImageUrl, getLatestGmpValue } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon,
  Search,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  LayoutGrid,
  Loader2,
  FileText,
  TrendingUp,
  Home,
  ChevronDown
} from "lucide-react";
import { motion } from "framer-motion";
import { getImgSrc } from "@/utils/image";
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

const statusColor: Record<string, string> = {
  Active:
    "bg-emerald-100 text-emerald-800 border-emerald-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all duration-300",
  Upcoming:
    "bg-blue-100 text-blue-800 border-blue-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300",
  "Issue Closed (Unlisted)":
    "bg-yellow-100 text-yellow-800 border-yellow-300 group-hover:bg-yellow-500 group-hover:text-white group-hover:border-yellow-500 transition-all duration-300",
  Listed:
    "bg-slate-50 text-slate-700 border-slate-300 group-hover:bg-slate-100 group-hover:text-slate-900 group-hover:border-slate-400 transition-all duration-300",
  Inactive:
    "bg-rose-100 text-rose-800 border-rose-300 group-hover:bg-rose-600 group-hover:text-white group-hover:border-rose-600 transition-all duration-300",
  "Listing Today":
    "bg-red-100 text-red-800 border-red-300 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all duration-300",
  "Date Not Declared":
    "bg-orange-100 text-orange-800 border-orange-300 group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600 transition-all duration-300",
};

const rowBgColor: Record<string, string> = {
  Active: "bg-emerald-100 hover:bg-emerald-200",
  Upcoming: "bg-blue-100 hover:bg-blue-200",
  "Issue Closed (Unlisted)": "bg-yellow-100 hover:bg-yellow-200",
  Listed: "bg-white hover:bg-slate-100",
  Inactive: "bg-rose-100 hover:bg-rose-200",
  "Listing Today": "bg-red-100 hover:bg-red-200",
  "Date Not Declared": "bg-orange-50 hover:bg-orange-100/70",
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

const formatDate = (dateStr: any, options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' }) => {
  if (!dateStr || dateStr === "0" || dateStr === 0) return 'TBA';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? 'TBA' : d.toLocaleDateString('en-IN', options);
};

export default function IPOCalendarClient({
  initialItems,
  initialTotal,
  initialTotalPages,
  initialBannerVideo,
}: {
  initialItems: IPOItem[];
  initialTotal: number;
  initialTotalPages: number;
  initialBannerVideo: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [items, setItems] = useState<IPOItem[]>(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const isFirstMount = useRef(true);

  const fetchData = async (currentPage: number, currentSearch: string, currentStatus: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", "15");
      if (currentSearch) params.append("search", currentSearch);
      if (currentStatus && currentStatus !== "all") params.append("status", currentStatus);

      const res = await fetch(`${API_URL}/api/ipo-lists?${params.toString()}`);
      if (res.ok) {
        const body = await res.json();
        setItems(body.data || []);
        setTotal(body.pagination?.total || 0);
        setTotalPages(body.pagination?.totalPages || 0);
      }
    } catch (err) {
      console.error("Error fetching calendar IPOs client-side:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      if (initialItems.length === 0) {
        fetchData(1, debouncedSearch, statusFilter);
      }
      return;
    }
    
    setPage(1);
    fetchData(1, debouncedSearch, statusFilter);
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    if (page !== 1) {
      fetchData(page, debouncedSearch, statusFilter);
    }
  }, [page]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      <main>
        <section className="bg-[#001529] pt-16 pb-32 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-30"
              src={getImageUrl(initialBannerVideo || "/uploads/video/ccvindia1.mp4")}
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
              <span className="text-white">IPO Calendar</span>
            </div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight"
            >
              Master <span className="text-[#F58e09]">IPO Dashboard</span>
            </motion.h1>
            <p className="text-white/70 max-w-2xl text-lg md:text-xl font-medium">
              Track Mainboard and SME IPOs with real-time updates across key milestones from announcement to listing.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 -mt-10 mb-20 relative z-20">
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-slate-200 overflow-hidden">
            <div className="p-6 md:p-10 border-b border-slate-100 bg-white flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <CalendarIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 leading-none">
                    Live <strong style={{ color: "#f58e09" }}>IPO Calendar</strong>
                  </h2>
                  <p className="text-slate-500 mt-2 font-medium">{total} Upcoming & Active Issues</p>
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

                <div className="relative w-full sm:w-[180px]">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600 pointer-events-none" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-11 pr-10 h-14 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-700 font-bold outline-none cursor-pointer focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 appearance-none"
                  >
                    <option value="all">All Issues</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Active">Active</option>
                    <option value="Issue Closed (Unlisted)">Issue Closed</option>
                    <option value="Listing Today">Listing Today</option>
                    <option value="Listed">Listed</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>

                <div className="relative w-full sm:w-[220px]">
                  <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-500 pointer-events-none" />
                  <select
                    value={pathname}
                    onChange={(e) => router.push(e.target.value)}
                    className="w-full pl-11 pr-10 h-14 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-700 font-bold outline-none cursor-pointer focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 appearance-none"
                  >
                    <option value="/all-ipos">IPO Calendar</option>
                    <option value="/mainline-ipos">Mainline IPO Updates</option>
                    <option value="/sme-ipos">SME IPO Updates</option>
                    <option value="/sme-ipo-sector">SME IPOs by Sector</option>
                    <option value="/mainboard-ipo-sector">Mainboard IPOs by Sector</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="px-6 md:px-10 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center gap-x-8 gap-y-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-2.5 bg-[#f58e09] rounded-full border border-orange-500"></span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date Not Declared</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-2.5 bg-emerald-400 rounded-full border border-emerald-500"></span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active / Open</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-2.5 bg-blue-400 rounded-full border border-blue-500"></span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Upcoming Issue</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-2.5 bg-yellow-400 rounded-full border border-yellow-500"></span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Closed (Unlisted)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-2.5 bg-red-400 rounded-full border border-red-500"></span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Listing Today</span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto hidden lg:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100/90 text-slate-600 border-b border-slate-200">
                    <th className="px-8 py-5 text-left font-bold text-xs uppercase tracking-widest whitespace-nowrap">Company & Sector</th>
                    <th className="px-8 py-5 text-left font-bold text-xs uppercase tracking-widest whitespace-nowrap">IPO Dates</th>
                    <th className="px-8 py-5 text-center font-bold text-xs uppercase tracking-widest whitespace-nowrap">GMP</th>
                    <th className="px-8 py-5 text-left font-bold text-xs uppercase tracking-widest whitespace-nowrap">Issue Size</th>
                    <th className="px-8 py-5 text-left font-bold text-xs uppercase tracking-widest whitespace-nowrap">Price Band</th>
                    <th className="px-8 py-5 text-left font-bold text-xs uppercase tracking-widest whitespace-nowrap">Lot Size</th>
                    <th className="px-8 py-5 text-center font-bold text-xs uppercase tracking-widest whitespace-nowrap">Status</th>
                    <th className="px-8 py-5 text-right font-bold text-xs uppercase tracking-widest whitespace-nowrap">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-32 text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing with Exchange...</span>
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-32 text-center">
                        <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                          <FileText className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Matching IPOs</h3>
                        <p className="text-slate-400">Try adjusting your filters to find what you're looking for.</p>
                      </td>
                    </tr>
                  ) : items.map((item, idx) => {
                    const displayStatus = getCalculatedStatus(item);
                    return (
                      <motion.tr
                        key={`desktop-${item.id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.002, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                        className={cn(
                          "group transition-all cursor-pointer border-b border-slate-50 relative z-30",
                          rowBgColor[String(displayStatus)] || "bg-white"
                        )}
                        onClick={() => item.blog_slug ? router.push(`/ipo-blogs/${item.blog_slug}`) : null}
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-5">
                            {getImgSrc(item.logo || item.blog_image) ? (
                              <div className="h-12 w-12 bg-white rounded-xl border border-slate-100 p-2 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <img src={getImgSrc(item.logo || item.blog_image)!} alt="" className="max-h-full max-w-full object-contain" />
                              </div>
                            ) : (
                              <div className="h-12 w-12 bg-blue-600/5 rounded-xl border border-blue-600/10 flex items-center justify-center text-blue-600 font-black text-xl">
                                {String(item.issuer_company || '?')[0]}
                              </div>
                            )}
                            <div>
                              <p className="font-black text-slate-900 text-[17px] group-hover:text-blue-700 transition-colors">{item.issuer_company}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                  {item.exchange || 'BSE/NSE'}
                                </span>
                                <span className="text-[10px] font-black italic text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tight">
                                  {item.sector_name || item.sector_names || item.sector || item.issue_category || "Mainline"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-[15px] font-bold text-slate-700">
                              {formatDate(item.open_date)} - {formatDate(item.close_date)}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                              Listing: {formatDate(item.listing_date, { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col items-center text-slate-900">
                            <motion.div
                              animate={{ opacity: [1, 0.7, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className={cn(
                                "text-[15px] font-black flex items-center gap-1",
                                item.gmp && item.gmp !== '0' ? "text-green-700" : "text-slate-400"
                              )}
                            >
                              {getLatestGmpValue(item.gmp)}
                            </motion.div>
                            <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Premium</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col text-slate-900">
                            <span className="text-[15px] font-black italic">
                              {item.issue_size && item.issue_size !== '0' && item.issue_size !== 0 ? `₹${item.issue_size} Cr` : 'TBA'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Aggregate Issue</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col text-slate-900">
                            <span className="text-[15px] font-bold">
                              {item.issue_lowest_price && item.issue_lowest_price !== '0' && item.issue_lowest_price !== 0 ? `₹${item.issue_lowest_price} - ₹${item.issue_highest_price}` : (item.issue_highest_price && item.issue_highest_price !== '0' && item.issue_highest_price !== 0 ? `₹${item.issue_highest_price}` : 'TBA')}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">Price Per Share</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col text-slate-900">
                            <span className="text-[15px] font-black italic">
                              {item.lot_size || 'TBA'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">Minimum Lot</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-full px-4 py-1.5 text-[11px] shadow-sm font-bold uppercase tracking-wider border",
                              statusColor[String(displayStatus)] || "bg-slate-100 text-slate-500 border-slate-200"
                            )}
                          >
                            {displayStatus}
                          </Badge>
                        </td>
                        <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                          <Link
                            href={`/ipo-tools/profit-calculator/${item.id}`}
                            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold px-4 py-2 text-sm shadow-lg shadow-blue-600/10"
                          >
                            Calculator <ArrowUpRight className="h-4 w-4 ml-1.5" />
                          </Link>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="bg-[#f8fafc]/50 p-4 border-t border-slate-100 lg:hidden">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center">
                  <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing with Exchange...</span>
                </div>
              ) : items.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                  <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">No Matching IPOs</h3>
                  <p className="text-slate-500 text-sm">Try adjusting your filters to find what you're looking for.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {items.map((item, idx) => {
                    const displayStatus = getCalculatedStatus(item);
                    const statusLabel = displayStatus === "Active" ? "Open" : displayStatus;

                    let borderColor = "border-slate-200";
                    let statusBg = "bg-slate-100";
                    let statusText = "text-slate-600";
                    let dotColor = "bg-slate-500";

                    if (displayStatus === "Open" || displayStatus === "Active") {
                      borderColor = "border-emerald-500";
                      statusBg = "bg-emerald-500";
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
                      statusBg = "bg-orange-500";
                      statusText = "text-white";
                      dotColor = "bg-white";
                    }

                    const getInitials = (name: string) => {
                      if (!name) return '?';
                      return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
                    }

                    return (
                      <motion.div
                        key={`mobile-${item.id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={cn(
                          "rounded-xl shadow-sm border border-slate-200 border-l-[5px] transition-all overflow-hidden flex flex-col",
                          borderColor,
                          rowBgColor[String(displayStatus)] || "bg-white"
                        )}
                        onClick={() => item.blog_slug ? router.push(`/ipo-blogs/${item.blog_slug}`) : null}
                      >
                        <div className="p-4 flex justify-between items-start gap-3 border-b border-slate-100/80 border-dashed">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 bg-[#1A202C] rounded-lg text-white flex items-center justify-center font-black text-xs shrink-0 overflow-hidden shadow-sm mt-0.5">
                              {getImgSrc(item.logo || item.blog_image) ? (
                                <img src={getImgSrc(item.logo || item.blog_image)!} alt={item.issuer_company} className="h-full w-full object-contain bg-white p-1" />
                              ) : (
                                getInitials(item.issuer_company)
                              )}
                            </div>
                            <div className="flex flex-col">
                              <h3 className="font-bold text-slate-900 text-base leading-tight line-clamp-2">{item.issuer_company}</h3>
                              <span className="text-[10px] font-black italic text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tight mt-1.5 w-max">
                                {item.sector_name || item.sector_names || item.sector || item.issue_category || 'Sector TBA'}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <div className={`flex items-center gap-1.5 ${statusBg} ${statusText} px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest w-max`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${dotColor} animate-pulse`}></span>
                              {statusLabel}
                            </div>
                            <span className="bg-[#1A202C] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider w-max shadow-sm">
                              {item.exchange || 'BSE/NSE'}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-3">
                          <div className="flex flex-col">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">IPO Dates</p>
                            <p className="text-[12px] font-bold text-slate-800">{formatDate(item.open_date)} - {formatDate(item.close_date)}</p>
                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Listing: {formatDate(item.listing_date, { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Issue Size</p>
                            <p className="text-[12px] font-black text-blue-600">{item.issue_size && item.issue_size !== '0' && item.issue_size !== 0 ? `₹${item.issue_size} Cr.` : 'TBA'}</p>
                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Aggregate</p>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Price Band</p>
                            <p className="text-[12px] font-bold text-slate-800">{item.issue_lowest_price && item.issue_lowest_price !== '0' && item.issue_lowest_price !== 0 ? `₹${item.issue_lowest_price} - ₹${item.issue_highest_price}` : (item.issue_highest_price && item.issue_highest_price !== '0' && item.issue_highest_price !== 0 ? `₹${item.issue_highest_price}` : 'TBA')}</p>
                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Per Share</p>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lot Size</p>
                            <p className="text-[12px] font-bold text-slate-800">{item.lot_size || 'TBA'}</p>
                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Minimum Lot</p>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Latest GMP</p>
                            <p className={cn(
                              "text-[12px] font-black",
                              item.gmp && item.gmp !== '0' && item.gmp !== '—' ? "text-green-600" : "text-slate-400"
                            )}>
                              {getLatestGmpValue(item.gmp)}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Premium</p>
                          </div>
                        </div>

                        <div className="px-4 pb-4 mt-auto" onClick={(e) => e.stopPropagation()}>
                          <Link
                            href={`/ipo-tools/profit-calculator/${item.id}`}
                            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/10 h-10 w-full text-sm"
                          >
                            Calculator <ArrowUpRight className="h-4 w-4 ml-1.5" />
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination */}
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
                            className={`h-9 w-9 md:h-10 md:w-10 flex-shrink-0 rounded-xl text-xs md:text-sm font-black transition-all ${
                              page === p 
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

          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group transition-all"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <TrendingUp className="h-24 w-24" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">IPO Insight Engine</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Access in-depth IPO analysis, including financials, GMP trends and key risk factors transforming complex RHP data into actionable insights.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] shadow-xl text-white relative overflow-hidden group transition-all"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <CalendarIcon className="h-24 w-24 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4">Real-Time Market Updates</h3>
              <p className="text-white/80 leading-relaxed font-medium mb-6">
                Stay updated with live IPO developments through continuous tracking of SEBI filings, price bands and key issue milestones.
              </p>
              <div className="h-1 w-24 bg-[#FFD700] rounded-full"></div>
            </motion.div>
          </div>
        </section>
      </main>

    </div>
  );
}
