"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutGrid, Search, ArrowRight, ChevronRight, TrendingUp, BarChart3, Home, Zap, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { getImageUrl } from "@/lib/utils";

interface Sector {
  id: string | number;
  name: string;
  description: string;
  mainline_count: number;
  sme_count: number;
  total_count: number;
}

interface SectorsClientProps {
  initialSectors: Sector[];
  initialBannerVideo: string | null;
}

export default function SectorsClient({ initialSectors, initialBannerVideo }: SectorsClientProps) {
  const router = useRouter();
  const [sectors, setSectors] = useState<Sector[]>(initialSectors);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch.trim() === "") {
      setSectors(initialSectors);
      return;
    }

    const fetchSectors = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/sectors?search=${encodeURIComponent(debouncedSearch)}`);
        if (res.ok) {
          const data = await res.json();
          const filteredData = (data || []).filter(
            (s: any) => s.name && s.name.trim().toLowerCase() !== "all"
          );
          setSectors(filteredData);
        }
      } catch (err) {
        console.error("Failed to search sectors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSectors();
  }, [debouncedSearch, initialSectors]);

  const filtered = sectors.filter((s) => {
    if (!debouncedSearch.trim()) {
      return (Number(s.total_count) || 0) > 0;
    }
    return true;
  });

  const totalMainline = sectors.reduce((a, s) => a + (Number(s.mainline_count) || 0), 0);
  const totalSME = sectors.reduce((a, s) => a + (Number(s.sme_count) || 0), 0);
  const totalAll = sectors.reduce((a, s) => a + (Number(s.total_count) || 0), 0);

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <main>
        {/* Banner Section */}
        <section className="py-14 relative overflow-hidden bg-[#001529]">
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-30"
              src={getImageUrl(initialBannerVideo || "video/ccvindia1.mp4")}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#001529]/80 via-[#001529]/40 to-[#001529]" />
          </div>

          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            <div
              className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-5"
              style={{
                background: "#f59e08",
                filter: "blur(100px)",
                transform: "translate(25%,-25%)",
              }}
            />
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-1 z-10"
            style={{
              background: `linear-gradient(90deg, #001529, #f59e08, #001529)`,
            }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-6 flex-wrap">
              <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
                <Home className="h-3.5 w-3.5 text-[#f59e08]" /> Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/70">Resources</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/90 font-semibold">Sector-wise IPO</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                  Sector-wise <span className="text-[#f59e08]">IPO List</span>
                </h1>
                <p className="text-white/60 mt-3 font-medium max-w-xl text-sm leading-relaxed">
                  Analysis of Indian IPOs categorized by industry sectors and market segments for smarter investment decisions.
                </p>
              </div>
              <div className="relative w-full md:w-80 shrink-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  placeholder="Find a sector…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm font-medium focus:outline-none focus:bg-white/15 focus:border-[#f59e08]/50 transition-all outline-none"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Status Counts strip */}
        <section className="bg-gradient-to-r from-[#001529] to-[#003380] py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: LayoutGrid, val: sectors.length, lbl: "Total Sectors" },
                { icon: TrendingUp, val: totalMainline, lbl: "Mainline Issues" },
                { icon: Zap, val: totalSME, lbl: "SME IPO Issues" },
                { icon: BarChart3, val: totalAll, lbl: "Cumulative Total" },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center text-center py-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-2">
                    <s.icon className="h-5 w-5 text-[#f59e08]" />
                  </div>
                  <p className="text-2xl font-black text-white mb-0.5">{s.val}</p>
                  <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">{s.lbl}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sectors Table Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-7 rounded-full bg-[#f59e08]" />
              <h2 className="text-xl font-black text-[#001529]">All Industry Sectors</h2>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-gradient-to-r from-[#001529] to-[#003380]">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#f59e08]" />
                  <span className="font-black text-white text-sm">{filtered.length} Sectors</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#001529]">
                      {["Sector Information", "Mainline", "SME IPO", "Total Issues", "Action"].map((h, i) => (
                        <th
                          key={h}
                          className={`px-5 py-4 text-xs font-black uppercase tracking-widest whitespace-nowrap text-[#f59e08] ${
                            i === 0 ? "text-left" : i === 4 ? "text-right" : "text-center"
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      [...Array(6)].map((_, i) => (
                        <tr key={i}>
                          <td colSpan={5} className="px-5 py-6 text-center">
                            <div className="h-5 bg-slate-100 animate-pulse rounded-lg w-full" />
                          </td>
                        </tr>
                      ))
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-16 text-center">
                          <LayoutGrid className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                          <p className="text-slate-400 font-semibold">No sectors found matching your search.</p>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((sector, idx) => (
                        <tr
                          key={sector.id}
                          className={`group hover:bg-[#f59e08]/5 transition-colors cursor-pointer ${
                            idx % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"
                          }`}
                          onClick={() => router.push(`/sector/${sector.id}`)}
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 rounded-xl transition-all group-hover:scale-110 bg-[#001529]/5">
                                <LayoutGrid className="w-4 h-4 text-[#001529] group-hover:text-[#f59e08] transition-colors" />
                              </div>
                              <div>
                                <div className="font-black text-sm capitalize transition-colors group-hover:text-[#f59e08] text-[#001529]">
                                  {sector.name.toLowerCase()}
                                </div>
                                {sector.description && (
                                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-medium">
                                    {sector.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className="inline-flex items-center justify-center min-w-[36px] px-3 py-1 rounded-lg text-sm font-black bg-[#001529]/5 text-[#001529]">
                              {sector.mainline_count}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className="inline-flex items-center justify-center min-w-[36px] px-3 py-1 rounded-lg text-sm font-black bg-[#f59e08]/10 text-[#d97706]">
                              {sector.sme_count}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className="text-base font-black text-[#001529]">{sector.total_count}</span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-black transition-all group-hover:text-white group-hover:bg-[#001529] group-hover:border-[#001529] text-[#001529] cursor-pointer">
                              Explore <ArrowRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Consultation CTA */}
            <div className="mt-10 p-8 rounded-2xl relative overflow-hidden bg-gradient-to-r from-[#001529] to-[#003380]">
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5"
                style={{
                  background: "#f59e08",
                  filter: "blur(60px)",
                  transform: "translate(30%,-30%)",
                }}
              />
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div>
                  <h3 className="text-xl font-black text-white mb-1">Need expert consultation on your IPO journey?</h3>
                  <p className="text-white/55 text-sm font-medium">Our team guides you through the complexities of the public market.</p>
                </div>
                <button
                  onClick={() => router.push("/ipo-eligibility-check")}
                  className="flex items-center gap-2 px-7 h-12 rounded-xl font-black text-sm transition-all hover:scale-105 shrink-0 bg-gradient-to-r from-[#f59e08] to-[#d97706] text-[#001529] cursor-pointer"
                  style={{ boxShadow: "0 4px 20px rgba(245,158,8,0.35)" }}
                >
                  Check IPO Eligibility <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
