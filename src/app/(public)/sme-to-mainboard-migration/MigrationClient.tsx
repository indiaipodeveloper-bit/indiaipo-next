"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  TrendingUp,
  Search,
  Loader2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  SearchX,
  FileSpreadsheet,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/lib/constants";

interface MigrationRecord {
  id: number;
  sno: string;
  company_name: string;
  ipo_date: string;
  exchanges: string;
  merchant_banker: string;
  ipo_size: string;
  migration_date: string;
  issue_price: string;
}

const getPageNumbers = (totalPages: number, currentPage: number) => {
  const pages: (number | string)[] = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 2) {
      end = 4;
    } else if (currentPage >= totalPages - 1) {
      start = totalPages - 3;
    }

    if (start > 2) {
      pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);
  }

  return pages;
};

interface MigrationClientProps {
  children: React.ReactNode; // This will receive the original static content from the page
}

export default function MigrationClient({ children }: MigrationClientProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "nse" | "bse">("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(15);

  const exchangeParam = activeTab === "nse" ? "NSE" : "BSE";

  const { data: rawRecords = [], isLoading: loading } = useQuery<MigrationRecord[]>({
    queryKey: ["sme-migrations-public", activeTab],
    queryFn: async () => {
      if (activeTab === "overview") return [];
      const res = await fetch(
        `${API_URL}/api/sme-migrations?exchange=${exchangeParam}&limit=100000`
      );
      if (!res.ok) throw new Error("Failed to fetch records");
      const body = await res.json();
      return body.data || [];
    },
    enabled: activeTab !== "overview",
    staleTime: 5 * 60 * 1000,
  });

  // Client-side search filtering
  const filteredRecords = rawRecords.filter((r) => {
    const searchTerm = search.toLowerCase();
    return (
      r.company_name?.toLowerCase().includes(searchTerm) ||
      r.merchant_banker?.toLowerCase().includes(searchTerm) ||
      r.exchanges?.toLowerCase().includes(searchTerm)
    );
  });

  const total = filteredRecords.length;
  const paginatedRecords = filteredRecords.slice((page - 1) * limit, page * limit);

  const formatClientDate = (val: string) => {
    if (!val) return "-";
    const strVal = String(val).trim();
    if (strVal.includes("GMT") || strVal.includes("Standard Time")) {
      const d = new Date(strVal);
      if (!isNaN(d.getTime())) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const day = String(d.getDate()).padStart(2, '0');
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
      }
    }
    return strVal;
  };

  const totalPages = Math.ceil(total / limit) || 1;

  // Handle active class for sidebar buttons
  const tabBtnClass = (tab: typeof activeTab) => {
    const base = "w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 border text-left shadow-xs";
    if (activeTab === tab) {
      return `${base} border-[#2557C5]/30 text-[#2557C5] font-bold shadow-md shadow-amber-500/5`;
    }
    return `${base} bg-white hover:bg-slate-50 border-slate-100 text-slate-600 hover:text-slate-800 hover:border-slate-200`;
  };

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Sticky Left Sidebar Navigation */}
        <aside className={`w-full lg:w-1/4 lg:sticky lg:top-24 space-y-4 shrink-0 z-30 transition-all duration-300 ${sidebarOpen ? "block" : "hidden"}`}>
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xl shadow-slate-100/50 space-y-3">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Navigation Menu</span>
                <h2 className="text-base font-bold text-[#001529] mt-0.5 font-heading">Migration Navigator</h2>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors hidden lg:block"
                title="Collapse Sidebar"
              >
                <PanelLeftClose className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={tabBtnClass("overview")}
              >
                <BookOpen className={`h-4.5 w-4.5 shrink-0 ${activeTab === "overview" ? "text-amber-500" : "text-slate-400"}`} />
                <span>Overview Guide</span>
              </button>

              <button
                onClick={() => { setActiveTab("nse"); setPage(1); setSearch(""); }}
                className={tabBtnClass("nse")}
              >
                <TrendingUp className={`h-4.5 w-4.5 shrink-0 ${activeTab === "nse" ? "text-amber-500" : "text-slate-400"}`} />
                <span className="flex-1">SME NSE Migration List</span>
                <ChevronRight className="h-4 w-4 opacity-50 text-slate-400" />
              </button>

              <button
                onClick={() => { setActiveTab("bse"); setPage(1); setSearch(""); }}
                className={tabBtnClass("bse")}
              >
                <TrendingUp className={`h-4.5 w-4.5 shrink-0 ${activeTab === "bse" ? "text-amber-500" : "text-slate-400"}`} />
                <span className="flex-1">SME BSE Migration List</span>
                <ChevronRight className="h-4 w-4 opacity-50 text-slate-400" />
              </button>
            </div>
          </div>


          {activeTab !== "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#001529] to-[#0d2a4a] text-white rounded-3xl p-5 shadow-xl"
            >
              <h3 className="text-xs font-bold tracking-wider text-amber-400 uppercase">Migration stats</h3>
              <p className="text-2xl font-black mt-2 font-heading">{total}</p>
              <p className="text-xs text-white/70 mt-1">Total companies migrated to {activeTab.toUpperCase()} Mainboard in this database.</p>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">


              </div>
            </motion.div>
          )}
        </aside>

        {/* Dynamic Right Side Content */}
        <div className={`w-full ${sidebarOpen ? "lg:w-3/4" : "w-full"} flex-grow bg-white border border-slate-100/70 shadow-2xl shadow-slate-100/30 rounded-[32px] overflow-hidden min-h-[500px] transition-all duration-300`}>
          <AnimatePresence mode="wait">
            {activeTab === "overview" ? (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="p-6 md:p-8 space-y-16"
              >
                {!sidebarOpen && (
                  <div className="flex justify-start">
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-600  border border-slate-200/60 hover:border-amber-500/20 rounded-xl px-4 py-2.5 transition-all shadow-xs"
                    >
                      <PanelLeftOpen className="h-4.5 w-4.5 text-amber-500" />
                      Show Sidebar Navigation
                    </button>
                  </div>
                )}
                {/* Render the original untouched page contents */}
                {children}
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="p-6 md:p-8 space-y-6"
              >
                {/* Header info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-start gap-3">
                    {!sidebarOpen && (
                      <button
                        onClick={() => setSidebarOpen(true)}
                        className="mt-1 p-2.5 bg-slate-50 hover:bg-amber-50/50 border border-slate-200/60 hover:border-amber-500/20 rounded-xl text-slate-500 hover:text-amber-600 transition-colors shadow-xs"
                        title="Expand Sidebar"
                      >
                        <PanelLeftOpen className="h-5 w-5 text-amber-500" />
                      </button>
                    )}
                    <div>
                      <h2 className="text-2xl font-bold text-[#001529] tracking-tight font-heading">
                        SME {activeTab.toUpperCase()} Migration List
                      </h2>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        Official records of companies that graduated from the SME platform ({activeTab === "nse" ? "NSE Emerge" : "BSE SME"}) to the Mainboard exchange.
                      </p>
                    </div>
                  </div>

                  {/* Search box with subtle shadow */}
                  <div className="relative w-full md:w-72 shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search company, banker, exchanges..."
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                      className="pl-9 h-11 bg-slate-50/50   border-[#2557C5]  rounded-2xl text-sm transition-all  text-slate-800"
                    />
                  </div>
                </div>

                {/* Table View */}
                <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-semibold">
                          <th className="py-4 px-5 text-left w-14">S.No.</th>
                          <th className="py-4 px-5 text-left min-w-[200px]">Company Name</th>
                          <th className="py-4 px-5 text-left">IPO Date</th>
                          <th className="py-4 px-5 text-left">Exchanges</th>
                          <th className="py-4 px-5 text-left">Merchant Banker</th>
                          <th className="py-4 px-5 text-left">IPO Size (Cr)</th>
                          <th className="py-4 px-5 text-left">Migration Date</th>
                          <th className="py-4 px-5 text-left">Issue Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {loading ? (
                          <tr>
                            <td colSpan={8} className="py-24 text-center">
                              <div className="flex flex-col items-center justify-center space-y-3">
                                <Loader2 className="w-9 h-9 text-amber-500 animate-spin" />
                                <p className="text-sm font-semibold text-slate-500">Retrieving records...</p>
                              </div>
                            </td>
                          </tr>
                        ) : paginatedRecords.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-24 text-center">
                              <div className="flex flex-col items-center justify-center space-y-3 max-w-sm mx-auto text-slate-400">
                                <SearchX className="h-12 w-12 text-slate-300 stroke-1" />
                                <p className="text-base font-bold text-slate-700">No records found</p>
                                <p className="text-xs leading-relaxed">
                                  We couldn't find any migrations matching "{search}". Try searching another name or reset filters.
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          paginatedRecords.map((r, idx) => (
                            <tr key={r.id} className="hover:bg-slate-50/70 transition-colors group">
                              <td className="py-3.5 px-5 font-mono text-xs text-slate-400">
                                {r.sno || (page - 1) * limit + idx + 1}
                              </td>
                              <td className="py-3.5 px-5 font-bold text-slate-800 group-hover:text-[#2557C5] transition-colors">
                                {r.company_name}
                              </td>
                              <td className="py-3.5 px-5 text-xs text-slate-500">{formatClientDate(r.ipo_date)}</td>
                              <td className="py-3.5 px-5 text-xs">
                                <span className="bg-[#2557C5]/10 text-[#2557C5] font-semibold px-2 py-0.5 rounded border border-[#2557C5]">
                                  {r.exchanges || (activeTab === "nse" ? "NSE" : "BSE")}
                                </span>
                              </td>
                              <td className="py-3.5 px-5 text-slate-600">{r.merchant_banker || "-"}</td>
                              <td className="py-3.5 px-5 font-semibold text-slate-800">{r.ipo_size || "-"}</td>
                              <td className="py-3.5 px-5 text-xs font-semibold text-slate-800">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                  {formatClientDate(r.migration_date)}
                                </div>
                              </td>
                              <td className="py-3.5 px-5 font-mono text-xs font-bold text-slate-800">
                                {r.issue_price ? `₹${r.issue_price}` : "-"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination control bar */}
                  {!loading && totalPages > 0 && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-xs text-slate-500 font-medium">
                        Showing <span className="font-bold text-slate-700">{(page - 1) * limit + 1}-{Math.min(page * limit, total)}</span> of <span className="font-bold text-slate-700">{total}</span> migrations
                      </p>

                      <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-100 shadow-xs">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={page === 1}
                          onClick={() => setPage(page - 1)}
                          className="h-8 w-8 text-slate-700 hover:bg-slate-50 rounded-lg"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {getPageNumbers(totalPages, page).map((p, index) => {
                          if (p === "...") {
                            return (
                              <span key={`dots-${index}`} className="px-2.5 text-xs text-slate-400">
                                ...
                              </span>
                            );
                          }
                          return (
                            <Button
                              key={`page-${p}`}
                              variant={page === p ? "default" : "ghost"}
                              size="sm"
                              onClick={() => setPage(Number(p))}
                              className={`h-8 w-8 text-xs font-semibold ${page === p ? "bg-amber-500 text-white font-bold" : "text-slate-700"
                                }`}
                            >
                              {p}
                            </Button>
                          );
                        })}

                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={page === totalPages}
                          onClick={() => setPage(page + 1)}
                          className="h-8 w-8 text-slate-700 hover:bg-slate-50 rounded-lg"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
