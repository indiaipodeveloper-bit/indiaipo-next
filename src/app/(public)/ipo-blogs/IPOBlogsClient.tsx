"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";
import { ArrowRight, ChevronLeft, ChevronRight, Home, TrendingUp, Search, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getImgSrc } from "@/utils/image";
import { API_URL } from "@/lib/constants";
import ipoUpdatesImage from "@/assets/ipo-updates2.webp";
import Image from "next/image";

interface IPOBlog {
  id: string; title: string; slug: string;
  image: string; category: string; upcoming: string; status: string;
  gmp_date: string; gmp_ipo_price: string; gmp: string; created_at: string;
}

const isValid = (val: any) => {
  if (val === null || val === undefined) return false;
  const s = String(val).toLowerCase().trim();
  return s !== "null" && s !== "[null]" && s !== "" && s !== "undefined";
};

const N = "#001529", G = "#F99810";

export default function IPOBlogsClient({
  initialBlogs,
  initialTotal,
  initialTotalPages,
  initialBannerVideo,
}: {
  initialBlogs: IPOBlog[];
  initialTotal: number;
  initialTotalPages: number;
  initialBannerVideo: string | null;
}) {
  const [blogs, setBlogs] = useState<IPOBlog[]>(initialBlogs);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [filter, setFilter] = useState<string>("current");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filter]);

  useEffect(() => {
    // Skip initial fetch since props have initial data
    if (page === 1 && filter === "current" && debouncedSearch === "") {
      setBlogs(initialBlogs);
      setTotalPages(initialTotalPages);
      return;
    }

    const fetchBlogs = async () => {
      setLoading(true);
      try {
        let url = `${API_URL}/api/admin-blogs?page=${page}&limit=12&summary=1&category=ipo_updates`;
        if (filter === "current") url += "&upcoming=0";
        if (filter === "upcoming") url += "&upcoming=1";
        if (debouncedSearch.trim()) {
          url += `&search=${encodeURIComponent(debouncedSearch.trim())}`;
        }
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setBlogs(data.data || []);
          setTotalPages(data.totalPages || 1);
        }
      } catch (err) {
        console.error("Failed to fetch blogs on client:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [page, filter, debouncedSearch, initialBlogs, initialTotalPages]);

  const filters = [
    { key: "current", label: "Current IPOs" },
    { key: "upcoming", label: "Upcoming IPOs" },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F8FAFC" }}>

      <section className="py-14 relative overflow-hidden bg-[#001529]">
        <div className="absolute inset-0 z-0">
          <Image
            src={ipoUpdatesImage}
            alt="ipo-updates"
            className="w-full h-full object-cover "
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#001529]/80 via-[#001529]/40 to-[#001529]" />
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden z-1">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-5"
            style={{ background: G, filter: "blur(100px)", transform: "translate(25%,-25%)" }} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 z-1"
          style={{ background: `linear-gradient(90deg, ${N}, ${G}, ${N})` }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 text-white/50 text-sm mb-8 flex-wrap justify-start md:justify-center">
            <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
              <Home className="h-3.5 w-3.5" /> Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white/90 font-semibold">IPO Blogs</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-left md:text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
              IPO Blogs & <span style={{ color: G }}>Updates</span>
            </h1>
            <p className="text-white/90 max-w-2xl mr-auto md:mx-auto text-base md:text-lg font-medium leading-relaxed mb-10">
              Stay ahead of the market with comprehensive analysis, GMP tracking, and detailed reviews of all Current and Upcoming Initial Public Offerings.
            </p>

            <div className="relative max-w-lg mr-auto md:mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="text"
                placeholder="Search IPO updates by title…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm font-medium focus:outline-none focus:bg-white/15 focus:border-[#f59e08]/50 transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <main className="flex-1">
        <div className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex flex-wrap gap-3 justify-center">
            {filters.map(f => (
              <button key={f.key} onClick={() => { setFilter(f.key); }}
                className="px-6 h-10 rounded-xl text-sm font-black transition-all cursor-pointer animate-none"
                style={filter === f.key
                  ? { background: `linear-gradient(135deg, ${N}, #003380)`, color: "white", boxShadow: "0 4px 16px rgba(0,21,41,0.25)" }
                  : { background: "#F8FAFC", color: "#64748b", border: "1px solid #e2e8f0" }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-12 h-12 border-4 rounded-full animate-spin mb-4"
                style={{ borderColor: `${N} transparent transparent transparent` }} />
              <p className="text-slate-400 font-semibold">Loading expert IPO insights…</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-24 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-white shadow-sm">
              <Search className="h-14 w-14 mx-auto mb-4 text-slate-200" />
              <h3 className="text-2xl font-black mb-2" style={{ color: N }}>No IPOs Found</h3>
              <p className="text-slate-400 font-medium max-w-xs mx-auto mb-8">
                {search.trim()
                  ? `We couldn't find any IPO blogs matching "${search}".`
                  : "No IPO blogs match the current filter."}
              </p>
              {search.trim() && (
                <button
                  onClick={() => setSearch("")}
                  className="px-8 py-3 rounded-xl bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <AnimatePresence>
                {blogs.map((blog, idx) => (
                  <motion.div key={blog.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}>
                    <Link href={`/ipo-blogs/${blog.slug || blog.id}`} className="block h-full group">
                      <div className="h-full bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col">
                        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, #001529, #f59e08)` }} />

                        <div className="aspect-video bg-white relative overflow-hidden flex items-center justify-center">
                          {isValid(getImgSrc(blog.image)) ? (
                            <img src={getImgSrc(blog.image)!} alt={blog.title}
                              className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-16 h-16 rounded-full flex items-center justify-center"
                              style={{ background: "rgba(0,21,41,0.06)" }}>
                              <TrendingUp className="h-8 w-8 text-slate-300" />
                            </div>
                          )}
                        </div>

                        <div className="p-4 flex-1 flex flex-col">
                          <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "#d97706" }}>
                            {(blog.category || "IPO").replace("_", " ")}
                          </div>
                          <h3 className="font-black text-sm leading-snug mb-2 line-clamp-2 transition-colors group-hover:text-[#f59e08]"
                            style={{ color: N }} title={blog.title}>{blog.title}</h3>
                          <div className="mt-2 flex items-center gap-1 text-xs font-black opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                            style={{ color: G }}>
                            Read Full Details <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {!loading && totalPages > 1 && (() => {
            const delta = 2;
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
              <div className="mt-14 flex flex-col items-center gap-6">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="flex items-center justify-center gap-1.5 w-9 h-9 sm:w-auto sm:px-5 sm:h-11 rounded-xl font-black text-[10px] sm:text-xs text-[#001529] bg-white border border-slate-200 transition-all disabled:opacity-40 shadow-sm cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">PREV</span>
                  </button>

                  <div className="flex items-center gap-1 sm:gap-1.5">
                    {range.map((p, i) => (
                      p === "..." ? (
                        <span key={`e-${i}`} className="w-7 sm:w-11 h-9 sm:h-11 flex items-center justify-center text-slate-400 font-black">...</span>
                      ) : (
                        <button key={p} onClick={() => setPage(p as number)}
                          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl font-black text-xs sm:text-sm transition-all shadow-sm cursor-pointer ${p === page
                            ? "bg-[#f59e0b] text-[#001529] shadow-lg shadow-[#f59e08]/20"
                            : "bg-white text-slate-400 border border-slate-200 hover:bg-slate-50"
                            }`}
                        >
                          {p}
                        </button>
                      )
                    ))}
                  </div>

                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="flex items-center justify-center gap-1.5 w-9 h-9 sm:w-auto sm:px-5 sm:h-11 rounded-xl font-black text-[10px] sm:text-xs text-white transition-all disabled:opacity-40 shadow-md cursor-pointer"
                    style={{ background: "#001529" }}>
                    <span className="hidden sm:inline">NEXT</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <div className="w-10 h-[1px] bg-slate-200" />
                  <span>Page {page} of {totalPages} <span className="mx-1 opacity-30">|</span> Expert Analysis</span>
                  <div className="w-10 h-[1px] bg-slate-200" />
                </div>
              </div>
            );
          })()}
        </div>
      </main>

      <section className="py-16 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0c1e4a, #1e3a8a, #1e40af)" }}>
        <div className="container mx-auto px-4 text-left md:text-center relative z-10">
          <h2 className="text-3xl font-black text-white mb-3">
            Planning Your <span style={{ color: "#f59e0b" }}>IPO Journey?</span>
          </h2>
          <p className="text-white/65 max-w-lg mr-auto md:mx-auto font-medium mb-8">
            Get expert advisory from professional consultants and take the first step toward going public.
          </p>
          <div className="flex flex-wrap justify-start md:justify-center gap-4">
            <Link href="/ipo-eligibility-check"
              className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#001529", boxShadow: "0 8px 32px rgba(245,158,8,0.35)" }}>
              Check IPO Eligibility <Zap className="h-5 w-5" />
            </Link>
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base text-white border border-white/25 hover:bg-white/10 transition-all">
              Contact Experts
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
