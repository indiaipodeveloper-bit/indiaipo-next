"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ArrowLeft, FileText, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { API_URL } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

interface Sector {
  id: string | number;
  name: string;
  description?: string;
}

interface IPOItem {
  id: string | number;
  issuer_company: string;
  issue_category: string | null;
  issue_size: string | number | null;
  ipo_pe_ratio: string | number | null;
  open_date: string | null;
}

interface PaginatedResponse {
  data: IPOItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface SectorDetailClientProps {
  sector: Sector;
  initialPaginatedData: PaginatedResponse;
  stats: {
    highest: number;
    lowest: number;
    median: number;
    count: number;
  };
}

const formatDate = (dateStr: any) => {
  if (!dateStr || dateStr === "0") return "TBA";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? "TBA" : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export default function SectorDetailClient({ sector, initialPaginatedData, stats }: SectorDetailClientProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading } = useQuery({
    queryKey: ["sector-ipos", sector.name, page, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("by_sector", "true");
      params.append("sector_name", sector.name);
      params.append("limit", "15");
      params.append("page", page.toString());
      if (debouncedSearch.trim() !== "") {
        params.append("search", debouncedSearch);
      }
      const res = await fetch(`${API_URL}/api/ipo-lists?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    initialData: page === 1 && debouncedSearch === "" ? initialPaginatedData : undefined,
    placeholderData: (prev) => prev,
    staleTime: 30000,
  });

  const paginatedItems: IPOItem[] = data?.data || [];
  const total = data?.pagination?.total || 0;
  const totalPages = data?.pagination?.totalPages || 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="bg-[#001529] py-12 relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#003380,transparent)] opacity-40 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/all-sectors"
            className="flex items-center gap-2 text-white/60 hover:text-white text-xs font-semibold uppercase tracking-wider mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sectors
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-black capitalize tracking-tight">
                {sector.name.toLowerCase()} <span className="text-[#f59e08]">IPOs</span>
              </h1>
              <p className="text-white/60 mt-3 font-medium max-w-xl text-sm">
                Comprehensive performance and metrics tracker of public listings in the {sector.name.toLowerCase()} industry.
              </p>
            </div>

            <div className="relative w-full md:w-80 shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                placeholder="Search company in this sector…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm font-medium focus:outline-none focus:bg-white/15 focus:border-[#f59e08]/50 transition-all outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Stats Summary Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
                <h3 className="text-slate-800 font-black text-xs uppercase tracking-widest mb-6">Sector Summary</h3>
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Total IPOs</span>
                    <span className="text-slate-800 font-bold text-base">{stats.count}</span>
                  </div>
                  <div className="w-full h-px bg-slate-100" />
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Highest Size</span>
                    <span className="text-slate-800 font-bold text-base">
                      {stats.highest > 0 ? `₹${stats.highest.toFixed(2)} Cr` : "TBA"}
                    </span>
                  </div>
                  <div className="w-full h-px bg-slate-100" />
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Median Size</span>
                    <span className="text-slate-800 font-bold text-base">
                      {stats.median > 0 ? `₹${stats.median.toFixed(2)} Cr` : "TBA"}
                    </span>
                  </div>
                  <div className="w-full h-px bg-slate-100" />
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Lowest Size</span>
                    <span className="text-slate-800 font-bold text-base">
                      {stats.lowest > 0 ? `₹${stats.lowest.toFixed(2)} Cr` : "TBA"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* IPOs Table Area */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">{total} Companies Listed</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#001529] text-white">
                        <th className="py-4 px-5 font-semibold text-xs uppercase tracking-widest whitespace-nowrap">Company Name</th>
                        <th className="py-4 px-5 font-semibold text-xs uppercase tracking-widest whitespace-nowrap text-center">Type</th>
                        <th className="py-4 px-5 font-semibold text-xs uppercase tracking-widest whitespace-nowrap text-right">IPO Size (Cr)</th>
                        <th className="py-4 px-5 font-semibold text-xs uppercase tracking-widest whitespace-nowrap text-center">P/E Ratio</th>
                        <th className="py-4 px-5 font-semibold text-xs uppercase tracking-widest whitespace-nowrap text-center">Issue Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {isLoading ? (
                        <tr>
                          <td colSpan={5} className="py-20 text-center">
                            <Loader2 className="w-8 h-8 animate-spin text-[#001529] mx-auto mb-2" />
                            <p className="text-slate-500 font-semibold">Loading IPOs...</p>
                          </td>
                        </tr>
                      ) : paginatedItems.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-20 text-center">
                            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-semibold">No companies found in this sector matching your query.</p>
                          </td>
                        </tr>
                      ) : (
                        paginatedItems.map((item, idx) => (
                          <tr
                            key={item.id}
                            className={cn(
                              "transition-all cursor-pointer hover:bg-blue-50/40 group",
                              idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                            )}
                          >
                            <td className="py-5 px-5">
                              <Link href={`/all-ipos/${item.id}`} className="text-[#001529] font-black text-sm group-hover:text-blue-700 transition-colors">
                                {item.issuer_company}
                              </Link>
                            </td>
                            <td className="py-5 px-5 text-center">
                              <span className={cn(
                                "inline-flex px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                                item.issue_category?.toLowerCase() === "sme"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-blue-100 text-blue-800"
                              )}>
                                {item.issue_category || "SME"}
                              </span>
                            </td>
                            <td className="py-5 px-5 text-right text-slate-700 font-bold text-sm">
                              {item.issue_size && item.issue_size !== "0" && item.issue_size !== 0 ? `₹${item.issue_size} Cr` : "TBA"}
                            </td>
                            <td className="py-5 px-5 text-center text-slate-700 font-semibold text-sm">
                              {item.ipo_pe_ratio && item.ipo_pe_ratio !== "0" && item.ipo_pe_ratio !== 0 ? item.ipo_pe_ratio : "TBA"}
                            </td>
                            <td className="py-5 px-5 text-center text-slate-500 font-medium text-sm">
                              {formatDate(item.open_date)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-4">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest hidden md:block">
                      Showing Page {page} of {totalPages}
                    </p>
                    <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="flex items-center justify-center border border-slate-200 rounded-xl h-10 px-3 font-bold disabled:opacity-40 disabled:cursor-not-allowed text-[#001529] bg-white hover:bg-slate-50 shrink-0 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">Prev</span>
                      </button>
                      <div className="flex items-center gap-1 sm:gap-1.5 px-1">
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
                          return pages.map((p, idx) =>
                            p === -1 ? (
                              <span key={`ell-${idx}`} className="text-slate-350 px-1 text-xs sm:text-sm">...</span>
                            ) : (
                              <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`h-9 w-9 flex-shrink-0 rounded-xl text-xs sm:text-sm font-black transition-all ${
                                  page === p
                                    ? "bg-[#001529] text-white shadow-lg shadow-[#001529]/30"
                                    : "text-slate-400 hover:bg-slate-100"
                                }`}
                              >
                                {p}
                              </button>
                            )
                          );
                        })()}
                      </div>
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                        className="flex items-center justify-center border border-slate-200 rounded-xl h-10 px-3 font-bold disabled:opacity-40 disabled:cursor-not-allowed text-[#001529] bg-white hover:bg-slate-50 shrink-0 transition-colors"
                      >
                        <span className="hidden sm:inline">Next</span> <ChevronRight className="h-4 w-4 sm:ml-1" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
