"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowLeft, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface SectorDetailClientProps {
  sector: Sector;
  initialIpos: IPOItem[];
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

export default function SectorDetailClient({ sector, initialIpos, stats }: SectorDetailClientProps) {
  const [search, setSearch] = useState("");

  const filteredItems = initialIpos.filter(
    (item) =>
      item.issuer_company?.toLowerCase().includes(search.toLowerCase()) ||
      item.issue_category?.toLowerCase().includes(search.toLowerCase())
  );

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
                  <span className="text-sm font-bold text-slate-700">{filteredItems.length} Companies Listed</span>
                </div>

                {filteredItems.length === 0 ? (
                  <div className="py-20 text-center">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-semibold">No companies found in this sector matching your query.</p>
                  </div>
                ) : (
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
                        {filteredItems.map((item, idx) => (
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
                        ))}
                      </tbody>
                    </table>
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
