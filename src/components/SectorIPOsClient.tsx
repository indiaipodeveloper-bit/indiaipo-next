"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, ChevronLeft, ChevronRight, FileText, Filter, List, Search, Banknote, Percent } from "lucide-react";
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

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[&,]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export default function SectorIPOsClient({
  initialItems,
  initialTotal,
  initialTotalPages,
  initialSectors,
  category,
  idParams,
}: {
  initialItems: IPOItem[];
  initialTotal: number;
  initialTotalPages: number;
  initialSectors: SectorItem[];
  category: "mainline" | "sme";
  idParams?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMainboard = category === "mainline";
  const title = isMainboard ? "Mainboard IPOs" : "SME IPOs";

  const [page, setPage] = useState(1);
  const [sectorSearch, setSectorSearch] = useState("");
  const [items, setItems] = useState<IPOItem[]>(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);

  const sectors = useMemo(() => {
    if (!initialSectors) return [];
    return [...initialSectors]
      .filter((s: any) => s.name && s.name.trim().toLowerCase() !== "all")
      .sort((a: any, b: any) => {
        const countA = category === "sme" ? (Number(a.sme_count) || 0) : (Number(a.mainline_count) || 0);
        const countB = category === "sme" ? (Number(b.sme_count) || 0) : (Number(b.mainline_count) || 0);
        if (countB !== countA) {
          return countB - countA;
        }
        return a.name.localeCompare(b.name);
      });
  }, [initialSectors, category]);

  const selectedSectors = useMemo(() => {
    if (idParams && sectors.length > 0) {
      const ids = idParams.split(",");
      const names: string[] = [];
      ids.forEach(currentId => {
        const found = sectors.find(s => String(s.id) === currentId || (s.name && slugify(s.name) === currentId));
        if (found) {
          names.push(found.name);
        }
      });
      return names;
    }
    const sec = searchParams.get("sector");
    if (!sec || sec === "All") return [];
    return sec.split(",").map(s => decodeURIComponent(s.trim())).filter(Boolean);
  }, [idParams, sectors, searchParams]);

  const visibleSectors = useMemo(() => {
    // 1. Filter sectors based on search input or active status or non-zero count
    const filtered = sectors.filter((s: any) => {
      const isSelected = selectedSectors.includes(s.name);
      const matchesSearch = s.name && s.name.toLowerCase().includes(sectorSearch.toLowerCase());
      if (!matchesSearch) return false;
      if (!sectorSearch.trim()) {
        if (isSelected) return true;
        const count = category === "sme" ? (Number(s.sme_count) || 0) : (Number(s.mainline_count) || 0);
        return count > 0;
      }
      return true;
    });

    // 2. Sort so that selected sectors are at the top,
    // in descending order of click/selection time
    const selected = filtered.filter((s: any) => selectedSectors.includes(s.name));
    const unselected = filtered.filter((s: any) => !selectedSectors.includes(s.name));

    selected.sort((a: any, b: any) => {
      const indexA = selectedSectors.indexOf(a.name);
      const indexB = selectedSectors.indexOf(b.name);
      return indexA - indexB;
    });

    return [...selected, ...unselected];
  }, [sectors, sectorSearch, category, selectedSectors]);

  const isFirstMount = useRef(true);

  const fetchData = async (currentPage: number) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", "15");
      params.append("category", category);
      params.append("sort", "sector_name");
      params.append("by_sector", "true");
      
      if (selectedSectors.length > 0) {
        params.append("sector_name", selectedSectors.join(","));
      }

      const res = await fetch(`${API_URL}/api/ipo-lists?${params.toString()}`);
      if (res.ok) {
        const body = await res.json();
        setItems(body.data || []);
        setTotal(body.pagination?.total || 0);
        setTotalPages(body.pagination?.totalPages || 0);
      }
    } catch (err) {
      console.error("Error fetching sector IPOs client-side:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      if (initialItems.length === 0) {
        fetchData(1);
      }
      return;
    }
    
    setPage(1);
    fetchData(1);
  }, [idParams, category]);

  useEffect(() => {
    if (page !== 1) {
      fetchData(page);
    }
  }, [page]);

  const handleSectorToggle = (sectorName: string) => {
    setPage(1);

    if (sectorName === "All") {
      router.push(isMainboard ? "/mainboard-ipo-sector" : "/sme-ipo-sector");
      return;
    }

    const targetSector = sectors.find(s => s.name === sectorName);
    if (!targetSector) return;

    // Get currently selected sector IDs in their current selection order
    const currentSelectedIds = selectedSectors.map(name => {
      const found = sectors.find(s => s.name === name);
      return found ? String(found.id) : null;
    }).filter(Boolean) as string[];

    const targetId = String(targetSector.id);
    const isCurrentlySelected = selectedSectors.includes(sectorName);

    let updatedIds: string[];
    if (isCurrentlySelected) {
      // Toggle off -> remove from the selected list
      updatedIds = currentSelectedIds.filter(id => id !== targetId);
    } else {
      // Toggle on -> add to the FRONT of the selected list
      updatedIds = [targetId, ...currentSelectedIds];
    }

    if (updatedIds.length === 0) {
      router.push(isMainboard ? "/mainboard-ipo-sector" : "/sme-ipo-sector");
    } else {
      router.push(isMainboard ? `/ipos/sector/${updatedIds.join(",")}` : `/sme-ipos/sector/${updatedIds.join(",")}`);
    }
  };

  const getYear = (dateStr: any) => {
    if (!dateStr || dateStr === "0") return "-";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  };

  const calculateStats = (key: string) => {
    const values = items
      .map(item => {
        const val = item[key as keyof IPOItem];
        if (typeof val === 'string') return parseFloat(val.replace(/[^0-9.]/g, ''));
        return typeof val === 'number' ? val : 0;
      })
      .filter(v => !isNaN(v) && v > 0);

    if (values.length === 0) return { highest: 0, lowest: 0, median: 0 };

    const sorted = [...values].sort((a, b) => a - b);
    const highest = sorted[sorted.length - 1];
    const lowest = sorted[0];
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    return { highest, lowest, median };
  };

  const sizeStats = calculateStats('issue_size');
  const peStats = calculateStats('ipo_pe_ratio');

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Column - Main Content */}
            <div className="flex-1 min-w-0 order-2 lg:order-1">
              
              {/* Header Bar */}
              <div className="bg-[#E2F1F8] border border-[#B3E5FC] rounded-xl py-3 px-4 mb-6 flex items-center justify-center text-[#01579B] text-sm font-semibold shadow-sm">
                <FileText className="w-4 h-4 mr-2" />
                Showing {items.length} of {total} {title}
              </div>

              {/* Table */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#3B71CA] text-white">
                        <th className="py-4 px-5 font-semibold text-[15px] whitespace-nowrap">Company Name</th>
                        <th className="py-4 px-5 font-semibold text-[15px] whitespace-nowrap">Sector</th>
                        <th className="py-4 px-5 font-semibold text-[15px] whitespace-nowrap">IPO Size (Cr.)</th>
                        <th className="py-4 px-5 font-semibold text-[15px] whitespace-nowrap">IPO Year</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loading ? (
                        <tr>
                          <td colSpan={4} className="py-20 text-center">
                            <Loader2 className="w-8 h-8 animate-spin text-[#3B71CA] mx-auto mb-2" />
                            <p className="text-slate-500 font-medium">Loading IPOs...</p>
                          </td>
                        </tr>
                      ) : items.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-20 text-center">
                            <div className="text-slate-400 mb-2 flex justify-center"><Search className="w-10 h-10" /></div>
                            <p className="text-slate-500 font-medium">No records found for this sector.</p>
                          </td>
                        </tr>
                      ) : (
                        items.map((item, idx) => (
                          <tr key={item.id} className={cn(
                            "transition-colors hover:bg-slate-50",
                            idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                          )}>
                            <td className="py-4 px-5">
                              {item.blog_slug ? (
                                <Link href={`/ipo-blogs/${item.blog_slug}`} className="text-[#3B71CA] font-bold text-[14px] hover:underline">
                                  {item.issuer_company}
                                </Link>
                              ) : (
                                <span className="text-[#3B71CA] font-bold text-[14px]">
                                  {item.issuer_company}
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-5">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#3B71CA] text-white uppercase tracking-wider whitespace-nowrap">
                                {item.sector_name || item.sector_names || item.sector || "Other"}
                              </span>
                            </td>
                            <td className="py-4 px-5 text-slate-700 text-[14px] font-medium whitespace-nowrap">
                              {item.issue_size && item.issue_size !== '0' ? `₹${item.issue_size}` : "TBA"}
                            </td>
                            <td className="py-4 px-5 text-slate-700 text-[14px] font-medium whitespace-nowrap">
                              {getYear(item.open_date)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
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
                    <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
                      <p className="text-sm text-slate-500 font-medium hidden md:block">
                        Page {page} of {totalPages}
                      </p>
                      <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        <button onClick={() => setPage(Math.max(1, page - 1))}
                          disabled={page === 1}
                          className="flex items-center justify-center w-8 h-8 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0">
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        {range.map((p, idx) =>
                          p === "..." ? (
                            <span key={`e-${idx}`} className="px-2 text-slate-400 text-sm">...</span>
                          ) : (
                            <button key={p} onClick={() => setPage(p as number)}
                              className={cn(
                                "w-8 h-8 shrink-0 rounded text-sm font-semibold transition-colors",
                                page === p ? "bg-[#3B71CA] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              )}>
                              {p}
                            </button>
                          )
                        )}

                        <button onClick={() => setPage(Math.min(totalPages, page + 1))}
                          disabled={page >= totalPages}
                          className="flex items-center justify-center w-8 h-8 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:w-[320px] shrink-0 order-1 lg:order-2 space-y-6 lg:sticky lg:top-[120px] lg:self-start lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pb-6 scrollbar-hide">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    <Filter className="w-4 h-4" />
                    <span>Filter by Sector</span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    {sectorSearch ? `${sectors.filter((s: any) => s.name && s.name.toLowerCase().includes(sectorSearch.toLowerCase())).length} of ${sectors.length}` : `${sectors.length} Sectors`}
                  </div>
                </div>
                <div className="p-3 border-b border-slate-100 bg-white">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search sectors..."
                      value={sectorSearch}
                      onChange={(e) => setSectorSearch(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B71CA]/20 focus:border-[#3B71CA] transition-all"
                    />
                    {sectorSearch && (
                      <button
                        onClick={() => setSectorSearch("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold px-1.5 py-0.5 rounded hover:bg-slate-100 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-2 max-h-[40vh] overflow-y-auto custom-scrollbar">
                  {!sectorSearch && (
                    <button
                      onClick={() => handleSectorToggle("All")}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors mb-1 text-left",
                        selectedSectors.length === 0 ? "bg-[#3B71CA] text-white" : "hover:bg-slate-50 text-slate-600"
                      )}
                    >
                      <List className="w-4 h-4" />
                      All Sectors
                    </button>
                  )}
                  {visibleSectors.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs font-medium">
                      No sectors found
                    </div>
                  ) : (
                    visibleSectors.map((s) => {
                      const isChecked = selectedSectors.includes(s.name);
                      return (
                        <div
                          key={s.id}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all mb-1 hover:bg-slate-50/75",
                            isChecked ? "bg-slate-50 text-[#3B71CA]" : "text-slate-600"
                          )}
                        >
                          <input
                            type="checkbox"
                            id={`sector-checkbox-${s.id}`}
                            checked={isChecked}
                            onChange={() => handleSectorToggle(s.name)}
                            className="w-4 h-4 rounded border-slate-200 text-[#3B71CA] focus:ring-[#3B71CA]/20 cursor-pointer shrink-0"
                          />
                          <label
                            htmlFor={`sector-checkbox-${s.id}`}
                            className="text-left flex-1 cursor-pointer select-none py-0.5 line-clamp-1"
                          >
                            {s.name}
                          </label>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Stats Cards */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden border-t-4 border-t-[#3B71CA] relative p-5">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-[#334155] font-black text-[13px] uppercase tracking-widest">IPO SIZE (CR.)</h3>
                  <div className="text-slate-100">
                    <Banknote className="w-8 h-8" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748b] text-[14px]">Highest</span>
                    <span className="text-[#0f172a] font-bold text-[14px]">{sizeStats.highest.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-px bg-slate-100" />
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748b] text-[14px]">Median</span>
                    <span className="text-[#0f172a] font-bold text-[14px]">{sizeStats.median.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-px bg-slate-100" />
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748b] text-[14px]">Lowest</span>
                    <span className="text-[#0f172a] font-bold text-[14px]">{sizeStats.lowest.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <p className="text-[13px] text-slate-400">IPO Size in Crores</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden border-t-4 border-t-[#3B71CA] relative p-5">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-[#334155] font-black text-[13px] uppercase tracking-widest">P/E RATIO</h3>
                  <div className="text-slate-100">
                    <Percent className="w-8 h-8" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748b] text-[14px]">Highest</span>
                    <span className="text-[#0f172a] font-bold text-[14px]">{peStats.highest.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-px bg-slate-100" />
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748b] text-[14px]">Median</span>
                    <span className="text-[#0f172a] font-bold text-[14px]">{peStats.median.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-px bg-slate-100" />
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748b] text-[14px]">Lowest</span>
                    <span className="text-[#0f172a] font-bold text-[14px]">{peStats.lowest.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <p className="text-[13px] text-slate-400">Valuation metrics</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
