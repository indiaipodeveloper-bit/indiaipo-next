"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, ChevronLeft, ChevronRight,
  BookOpen, Search, Zap, Calendar, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getImgSrc } from "@/utils/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface IPOBlog {
  id: string;
  title: string;
  slug: string;
  image: string;
  category: string;
  upcoming: string;
  status: string;
  gmp_date: string;
  gmp_ipo_price: string;
  gmp: string;
  created_at: string;
  updated_at?: string;
  description: string;
}

const formatDate = (dateStr: string) => {
  if (!dateStr || dateStr.startsWith("0000")) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return ""; }
};

const getBlogDisplayDate = (blog: IPOBlog) => {
  const formattedCreated = formatDate(blog.created_at);
  if (formattedCreated) return formattedCreated;
  
  const formattedUpdated = formatDate(blog.updated_at || "");
  if (formattedUpdated) return formattedUpdated;
  
  return "N/A";
};

export default function BlogsListingClient({
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
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [total, setTotal] = useState(initialTotal);
  const [bannerVideo, setBannerVideo] = useState<string | null>(initialBannerVideo);
  const pathname = usePathname();

  const isInitialMount = useRef(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const loadBlogs = async () => {
      setLoading(true);
      try {
        let url = `/api/admin-blogs?page=${page}&limit=12&summary=1&category=ipo_blogs`;
        if (debouncedSearch.trim()) {
          url += `&search=${encodeURIComponent(debouncedSearch.trim())}`;
        }
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setBlogs(data.data || []);
          setTotalPages(data.totalPages || 1);
          setTotal(data.total || 0);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    loadBlogs();
  }, [debouncedSearch, page]);

  useEffect(() => { setPage(1); }, [debouncedSearch]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header />

      <section className="relative pt-20 pb-24 overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 -skew-x-12 translate-x-1/4 pointer-events-none" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-amber-100/30 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
            >
              <BookOpen className="w-3.5 h-3.5" />
              The Editorial Desk
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8"
            >
              Systematic <span className="text-blue-600">IPO Analysis</span> <br className="hidden md:block" /> & Market Research
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mb-12"
            >
              Deep-dive reports, valuation updates, and strategic guides curated by India's leading capital market research team.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full max-w-xl group"
            >
              <div className="relative flex items-center p-1.5 bg-white rounded-[1.5rem] shadow-xl shadow-slate-200/50 border border-slate-200 transition-all focus-within:border-blue-300 focus-within:shadow-blue-200/40">
                <Search className="ml-5 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search articles, sectors, or trends..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full h-14 pl-4 pr-12 bg-transparent outline-none text-slate-900 font-medium placeholder:text-slate-400"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="flex-1 pb-24 bg-white">
        <div className="container mx-auto px-4 -mt-10 relative z-20">

          {!loading && blogs.length > 0 && page === 1 && !debouncedSearch && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-20"
            >
              <Link href={`/blogs/${blogs[0].slug}`} className="group relative block overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl">
                <div className="aspect-video w-full bg-slate-900">
                  <img
                    src={getImgSrc(blogs[0].image) || "/placeholder.jpg"}
                    alt={blogs[0].title}
                    className="w-full h-full object-contain opacity-60 transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14">
                  <div className="max-w-3xl">
                    <span className="inline-block px-3 py-1 rounded-md bg-amber-500 text-slate-900 text-[9px] font-black uppercase tracking-widest mb-6">
                      FEATURED ANALYSIS
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] mb-6 group-hover:text-amber-500 transition-colors">
                      {blogs[0].title}
                    </h2>
                    <p className="text-white/70 text-base md:text-lg font-medium line-clamp-2 mb-8">
                      {blogs[0].description}
                    </p>
                    <div className="flex items-center gap-6">
                      <span className="flex items-center gap-2 text-white/50 text-[10px] font-black uppercase tracking-widest">
                        <Calendar className="w-4 h-4" /> {getBlogDisplayDate(blogs[0])}
                      </span>
                      <div className="flex items-center gap-2 text-amber-500 font-black text-xs uppercase tracking-widest">
                        Read Detail <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Latest Publications</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Research & Analysis Repository</p>
              </div>
              {total > 0 && (
                <span className="px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <span className="text-blue-600">{total}</span> Reports Available
                </span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-6">
                    <div className="aspect-[16/10] bg-slate-100 rounded-3xl animate-pulse" />
                    <div className="h-6 w-2/3 bg-slate-100 rounded-lg animate-pulse" />
                    <div className="h-4 w-full bg-slate-100 rounded-lg animate-pulse" />
                  </div>
                ))}
              </div>
            ) : blogs.length === 0 ? (
              <div className="py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-900 mb-2">No Research Found</h3>
                <p className="text-slate-400 font-medium max-w-sm mx-auto">Try refining your search keyword or explore different categories.</p>
                {debouncedSearch && (
                  <Button onClick={() => setSearch("")} className="mt-8 bg-blue-600 text-white rounded-xl px-10 h-12 font-bold uppercase tracking-widest text-[10px]">
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
                <AnimatePresence>
                  {blogs.slice(page === 1 && !debouncedSearch ? 1 : 0).map((blog, idx) => (
                    <motion.div
                      key={blog.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                    >
                      <Link href={`/blogs/${blog.slug}`} className="group block space-y-6">
                        <div className="relative aspect-video bg-white rounded-[2rem] overflow-hidden border-2 border-transparent group-hover:border-blue-100 transition-all shadow-sm group-hover:shadow-2xl group-hover:-translate-y-2 duration-500">
                          <img
                            src={getImgSrc(blog.image) || "/placeholder.jpg"}
                            alt={blog.title}
                            className="w-full h-full object-contain grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                          />
                        </div>

                        <div className="space-y-4 px-2">
                          <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-blue-500" /> {getBlogDisplayDate(blog)}</span>
                          </div>
                          <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-[1.3] group-hover:text-blue-600 transition-colors line-clamp-2">
                            {blog.title}
                          </h3>
                          <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-3">
                            {blog.description}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

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

            return <div className="mt-24 pt-10 border-t border-slate-100 flex flex-col items-center gap-6">
              <div className="flex items-center justify-center gap-1.5 sm:gap-3">
                <Button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="outline"
                  className="w-9 h-9 sm:w-auto sm:h-12 sm:px-6 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 border-slate-200 transition-all font-black text-[10px] sm:text-xs"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">PREV</span>
                </Button>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  {range.map((p, i) => (
                    p === "..." ? (
                      <span key={`e-${i}`} className="w-7 sm:w-12 h-9 sm:h-12 flex items-center justify-center text-slate-300 font-black">...</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm transition-all shadow-sm ${p === page
                          ? "bg-slate-900 text-white shadow-xl scale-110"
                          : "bg-white text-slate-400 border border-slate-200 hover:bg-slate-50"
                          }`}
                      >
                        {p}
                      </button>
                    )
                  ))}
                </div>

                <Button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  variant="outline"
                  className="w-9 h-9 sm:w-auto sm:h-12 sm:px-6 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 border-slate-200 transition-all font-black text-[10px] sm:text-xs bg-slate-900 text-white hover:bg-slate-800"
                >
                  <span className="hidden sm:inline">NEXT</span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>

              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <div className="w-10 h-[1px] bg-slate-100" />
                <span>Page {page} of {totalPages} <span className="mx-1 opacity-30">|</span> {total} Reports</span>
                <div className="w-10 h-[1px] bg-slate-100" />
              </div>
            </div>;
          })()}
        </div>
      </main>

      <section className="py-24 bg-[#001529] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/10 -skew-x-12 translate-x-1/2" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              Master the Markets with <br className="hidden md:block" /> <span className="text-amber-400 font-black">Strategic IPO Guidance</span>
            </h2>
            <p className="text-white/50 text-base md:text-lg font-medium leading-relaxed max-w-2xl mx-auto">
              From sector-wise trend analysis to personal consultative support, navigate your public listing journey with the experts.
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <Button asChild className="h-16 px-12 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-sm uppercase tracking-widest shadow-2xl shadow-amber-400/20 transition-transform hover:scale-105">
                <Link href="/ipo-eligibility-check">Evaluate Eligibility <Zap className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button asChild variant="outline" className="h-16 px-12 rounded-2xl border-white bg-transparent text-white font-black text-sm uppercase tracking-widest hover:bg-transparent hover:text-white">
                <Link href="/contact">Speak with Analysts</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
