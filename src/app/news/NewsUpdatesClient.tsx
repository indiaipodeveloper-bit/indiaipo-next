"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { getImgSrc } from "@/utils/image";
import Ribbon from "@/components/Ribbon";
import newsImg2 from "@/assets/newsImg2.webp";

interface SocialVideo {
  id: string | number;
  title: string;
  url: string;
  img_url: string;
  status: string;
  created_at: string;
}

import {
  Newspaper, Youtube, Loader2, ChevronLeft, ChevronRight,
  Calendar, Tag, ArrowRight, TrendingUp, Bell, PlayCircle,
  Search, Home, Clock, Eye, Bookmark, Share2, Mail, Phone,
  BarChart3, Zap, Globe, X,
} from "lucide-react";
import { API_URL } from "@/lib/constants";

const fallbackImage =
  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1000&auto=format&fit=crop";

const CATEGORIES = ["All", "IPO", "Equity", "NSE", "BSE", "SEBI", "Economy"];
const NEWS_PER_PAGE = 9;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const heroStats = [
  { icon: <Newspaper className="h-4 w-4" />, label: "Daily News Updates" },
  { icon: <TrendingUp className="h-4 w-4" />, label: "Market Insights" },
  { icon: <BarChart3 className="h-4 w-4" />, label: "Market Regulatory Alerts" },
  { icon: <Youtube className="h-4 w-4" />, label: "Video Market Snaps" },
];

const trustStats = [
  { value: "10 Lakh + ", label: "Monthly Audience", icon: Eye },
  { value: "5000+", label: "News Articles", icon: Newspaper },
  { value: "Daily", label: "Updates Published", icon: Clock },
  { value: "98%", label: "Official Status", icon: Zap },
];

export default function NewsUpdatesClient({
  initialNews,
  initialTotal,
  initialTotalPages,
  initialBannerVideo,
}: {
  initialNews: any[];
  initialTotal: number;
  initialTotalPages: number;
  initialBannerVideo: string | null;
}) {
  const [newsItems, setNewsItems] = useState<any[]>(initialNews);
  const [totalItems, setTotalItems] = useState(initialTotal);
  const [videos, setVideos] = useState<SocialVideo[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [videosLoading, setVideosLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, debouncedSearchQuery]);

  useEffect(() => {
    // Skip initial fetch since props have initial data
    if (currentPage === 1 && activeCategory === "All" && debouncedSearchQuery === "") {
      setNewsItems(initialNews);
      setTotalItems(initialTotal);
      return;
    }

    const fetchNews = async () => {
      try {
        setNewsLoading(true);
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: NEWS_PER_PAGE.toString()
        });

        if (activeCategory !== "All") {
          queryParams.append("category", activeCategory);
        }

        if (debouncedSearchQuery.trim()) {
          queryParams.append("search", debouncedSearchQuery.trim());
        }

        const res = await fetch(`${API_URL}/api/news?${queryParams.toString()}`);
        if (res.ok) {
          const result = await res.json();
          setNewsItems(result.data || []);
          setTotalItems(result.pagination?.total || 0);
        } else {
          setNewsItems([]);
        }
      } catch (err) {
        console.error("News fetch failed client-side:", err);
        setNewsItems([]);
      } finally {
        setNewsLoading(false);
      }
    };
    fetchNews();
  }, [activeCategory, currentPage, debouncedSearchQuery, initialNews, initialTotal]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setVideosLoading(true);
        const res = await fetch(`${API_URL}/api/videos/youtube/playlistItems?maxResults=4`);
        if (res.ok) {
          const data = await res.json();
          const mapped: SocialVideo[] = (data.items || []).map((item: any) => ({
            id: item.id || item.snippet.resourceId.videoId,
            title: item.snippet.title,
            url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
            img_url: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
            status: "published",
            created_at: item.snippet.publishedAt,
          }));
          setVideos(mapped);
        }
      } catch (err) {
        console.error("YouTube fetch failed client-side:", err);
      } finally {
        setVideosLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const extractYoutubeId = (url: string) => {
    if (!url) return null;
    if (!url.includes('/')) { const p = url.split('?')[0]; if (p.length === 11) return p; }
    const m = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return m && m[2].length === 11 ? m[2] : null;
  };

  const getThumbnail = (vid: SocialVideo) => {
    if (vid.img_url && vid.img_url.startsWith('http')) return vid.img_url;
    let yId = extractYoutubeId(vid.url);
    if (!yId && vid.img_url && !vid.img_url.startsWith('http')) {
      const fb = vid.img_url.split('?')[0];
      if (fb.length === 11) yId = fb;
    }
    if (yId && yId.length === 11) return `https://img.youtube.com/vi/${yId}/hqdefault.jpg`;
    return 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80';
  };

  const paginatedNews = newsItems;
  const totalPages = Math.ceil(totalItems / NEWS_PER_PAGE);

  const goToPage = (p: number) => {
    setCurrentPage(p);
    window.scrollTo({ top: 480, behavior: "smooth" });
  };

  const handleShare = async (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    const shareUrl = `${window.location.origin}/news/detail/${item.slug || item.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // Copy fallback
      navigator.clipboard.writeText(shareUrl);
      setCopiedId(item.id.toString());
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden w-full flex flex-col">
      <Header />

      <main>
        <section className="bg-[#001529] pt-14 pb-36 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            {initialBannerVideo ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-30"
                src={getImageUrl(initialBannerVideo)}
              />
            ) : (
              <img
                src={newsImg2.src}
                alt="News Banner"
                className="w-full h-full object-cover opacity-30"
              />
            )}
            <div className="absolute inset-0 bg-[#001529]/60" />
          </div>

          <div className="absolute inset-0 pointer-events-none overflow-hidden z-1">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-5"
              style={{ background: "#f59e08", filter: "blur(100px)", transform: "translate(25%,-25%)" }} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-8 flex-wrap">
              <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/80 font-semibold">News & Updates</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight max-w-4xl">
                IPO News &amp; <span className="text-[#f59e08]">Market Updates</span>
              </h1>
              <p className="text-white/65 max-w-2xl text-base md:text-lg font-medium leading-relaxed mb-10">
                Stay ahead with the latest news from IPO markets, regulatory updates, BSE/NSE announcements, and capital market intelligence — all in one place, updated daily.
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-4">
                {heroStats.map((s, i) => (
                  <Ribbon
                    key={i}
                    fontSize="16px"
                    cutout="0.8em"
                    className="flex items-center gap-2 text-white font-bold"
                  >
                    <span className="text-white shrink-0">{s.icon}</span>
                    <span className="pr-1.5">{s.label}</span>
                  </Ribbon>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="relative flex-1 max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search news articles…"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); }}
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#001529]/20 focus:border-[#001529]/40 font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(""); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex overflow-x-auto pb-0 scrollbar-hide flex-1 gap-2 w-full">
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => { setActiveCategory(cat); }}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeCategory === cat
                      ? "bg-[#001529] text-white shadow-md"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                      }`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-1 h-8 rounded-full bg-[#f59e08]" />
                  <h2 className="text-2xl font-black text-[#001529]">Markets &amp; Money Update</h2>
                </div>

                {newsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-[#001529]" />
                    <p className="text-slate-500 font-medium">Fetching latest news…</p>
                  </div>
                ) : paginatedNews.length === 0 ? (
                  <div className="text-center py-20 rounded-3xl bg-white border border-slate-200">
                    <Newspaper className="h-14 w-14 mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-500 font-semibold text-lg">No news found</p>
                    <p className="text-slate-400 text-sm mt-1">Try a different category or search term</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {paginatedNews.map((item, idx) => {
                      const date = item.published_at
                        ? new Date(item.published_at).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })
                        : "No Date";
                      return (
                        <motion.div key={item.id} custom={idx} initial="hidden" whileInView="visible"
                          viewport={{ once: true }} variants={fadeUp}>
                          <Link href={`/news/detail/${item.slug || item.id}`}
                            className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden flex flex-col md:flex-row gap-0 block relative">
                            {getImgSrc(item.image) && (
                              <div className="w-full md:w-52 h-44 md:h-auto shrink-0 overflow-hidden relative">
                                <img src={getImgSrc(item.image) || fallbackImage} alt={item.title}
                                  onError={(e: any) => (e.target.src = fallbackImage)}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
                              </div>
                            )}

                            <div className="flex flex-col justify-between p-5 flex-1 relative">
                              <div
                                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-none"
                                style={{ background: "linear-gradient(90deg, #001529, #f59e08)" }}
                              />
                              <div>
                                <div className="flex items-center gap-2 mb-3 flex-wrap">
                                  {item.category && activeCategory === "All" && (
                                    <Ribbon
                                      fontSize="10px"
                                      cutout="0.6em"
                                      className="inline-flex items-center gap-1 text-white font-black uppercase tracking-widest"
                                    >
                                      <Tag className="h-2.5 w-2.5 text-white" /> {item.category}
                                    </Ribbon>
                                  )}
                                  <span className="ml-auto flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                    <Calendar className="h-3 w-3" /> {date}
                                  </span>
                                </div>
                                <h3 className="font-black text-base leading-snug line-clamp-2 mb-2 text-[#001529] group-hover:text-[#f59e08] transition-colors">
                                  {item.title}
                                </h3>
                                {item.description && (
                                  <p className="text-sm text-slate-500 line-clamp-2 font-medium leading-relaxed">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                                <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#001529] group-hover:text-[#f59e08] transition-colors">
                                  Read Full News<ArrowRight className="h-3.5 w-3.5" />
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => handleShare(e, item)}
                                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-[#001529] hover:text-white text-slate-500 flex items-center justify-center transition-all cursor-pointer"
                                  >
                                    <Share2 className="h-4 w-4" />
                                  </button>
                                  {copiedId === item.id.toString() && (
                                    <span className="text-[10px] text-emerald-600 font-black uppercase">Copied!</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {!newsLoading && totalPages > 1 && (() => {
                  const delta = 2;
                  const range: (number | "…")[] = [];
                  const rangeSet = new Set<number>();
                  [1, totalPages, ...Array.from({ length: delta * 2 + 1 }, (_, i) => currentPage - delta + i)]
                    .filter((p) => p >= 1 && p <= totalPages)
                    .sort((a, b) => a - b)
                    .forEach((p) => rangeSet.add(p));
                  const sorted = Array.from(rangeSet).sort((a, b) => a - b);
                  sorted.forEach((p, i) => {
                    if (i > 0 && p - sorted[i - 1] > 1) range.push("…");
                    range.push(p);
                  });
                  return (
                    <div className="mt-14 flex flex-col items-center gap-6">
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                        <button
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="w-9 h-9 sm:w-auto sm:px-5 sm:h-11 rounded-xl flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-[#001529] hover:bg-slate-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm font-black text-[10px] sm:text-xs cursor-pointer"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="hidden sm:inline">PREV</span>
                        </button>

                        <div className="flex items-center gap-1 sm:gap-1.5">
                          {range.map((p, i) =>
                            p === "…" ? (
                              <span key={`e${i}`} className="w-7 sm:w-10 h-9 sm:h-11 flex items-center justify-center text-slate-400 font-bold">...</span>
                            ) : (
                              <button key={p} onClick={() => goToPage(p as number)}
                                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${p === currentPage
                                  ? "bg-[#f59e08] text-[#001529] shadow-lg shadow-[#f59e08]/20"
                                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                  }`}
                              >
                                {p}
                              </button>
                            )
                          )}
                        </div>

                        <button
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="w-9 h-9 sm:w-auto sm:px-5 sm:h-11 rounded-xl flex items-center justify-center gap-1.5 bg-[#001529] text-white hover:bg-[#002147] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md font-black text-[10px] sm:text-xs cursor-pointer"
                        >
                          <span className="hidden sm:inline">NEXT</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <div className="w-10 h-[1px] bg-slate-200" />
                        <span>Page {currentPage} of {totalPages} <span className="mx-1 opacity-30">|</span> {totalItems} Articles</span>
                        <div className="w-10 h-[1px] bg-slate-200" />
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 rounded-full bg-[#f59e08]" />
                  <h2 className="text-xl font-black text-[#001529]">IPO &amp; Market Snaps</h2>
                </div>

                {videosLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-[#f59e08]" />
                  </div>
                ) : videos.length === 0 ? (
                  <div className="text-center py-12 rounded-2xl bg-white border border-slate-200">
                    <Youtube className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p className="text-slate-400 text-sm font-medium">No videos available.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {videos.map((vid) => {
                      const yId = extractYoutubeId(vid.url);
                      const thumb = getThumbnail(vid);
                      const isPlaying = selectedVideo === String(vid.id);
                      const ytLink = yId ? `https://www.youtube.com/watch?v=${yId}` : vid.url;
                      return (
                        <div key={vid.id}
                          className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                          {isPlaying && yId ? (
                            <div className="aspect-video">
                              <iframe width="100%" height="100%"
                                src={`https://www.youtube.com/embed/${yId}?autoplay=1&rel=0`}
                                title={vid.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen className="block w-full h-full border-0" />
                            </div>
                          ) : (
                            <div className="relative aspect-video cursor-pointer"
                              onClick={() => setSelectedVideo(String(vid.id))}>
                              <img src={thumb} alt={vid.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/35 group-hover:bg-black/25 transition-all">
                                <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform"
                                  style={{ background: "linear-gradient(135deg, #f59e08, #d97706)" }}>
                                  <PlayCircle className="h-8 w-8 text-white" />
                                </div>
                              </div>
                              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                WATCH
                              </div>
                            </div>
                          )}
                          <div className="p-3.5">
                            <h4 className="text-sm font-bold leading-snug line-clamp-2 text-[#001529] mb-2">{vid.title}</h4>
                            <a href={ytLink} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-black text-[#f59e08] hover:underline"
                              onClick={(e) => e.stopPropagation()}>
                              Watch on YouTube <ArrowRight className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="rounded-2xl overflow-hidden animate-none"
                  style={{ background: "linear-gradient(135deg, #001529 0%, #003380 100%)" }}>
                  <div className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#f59e08]/20 flex items-center justify-center mx-auto mb-4">
                      <Youtube className="h-7 w-7 text-[#f59e08]" />
                    </div>
                    <p className="font-black text-white text-base mb-1">Subscribe to Our Channel</p>
                    <p className="text-white/55 text-xs mb-5 leading-relaxed">
                      Get the latest IPO videos, GMP updates, and market insights delivered to your feed.
                    </p>
                    <a
                      href="https://www.youtube.com/@IndiaIPOofficial"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all hover:scale-105 shadow-xl"
                      style={{
                        background: "#FF0000",
                        color: "#ffffff",
                        boxShadow: "0 4px 16px rgba(255,0,0,0.35)"
                      }}
                    >
                      <Youtube className="h-4 w-4 text-white" />
                      Subscribe Now
                    </a>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100" style={{ background: "#001529" }}>
                    <h3 className="font-black text-white text-sm uppercase tracking-widest flex items-center gap-2">
                      <Globe className="h-4 w-4 text-[#f59e08]" /> Stay Connected
                    </h3>
                  </div>
                  <div className="p-5 space-y-3">
                    <a href="mailto:info@indiaipo.in"
                      className="flex items-center gap-3 text-sm font-semibold text-slate-600 hover:text-[#001529] transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-[#001529]/10 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-[#001529]" />
                      </div>
                      info@indiaipo.in
                    </a>
                    <a href="tel:+917428337280"
                      className="flex items-center gap-3 text-sm font-semibold text-slate-600 hover:text-[#001529] transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-[#f59e08]/10 flex items-center justify-center">
                        <Phone className="h-4 w-4 text-[#f59e08]" />
                      </div>
                      +91-74283-37280
                    </a>
                    <a href="https://wa.me/917428337280" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm font-semibold text-slate-600 hover:text-[#001529] transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                        <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                        </svg>
                      </div>
                      WhatsApp Alerts
                    </a>
                  </div>
                  <div className="px-5 pb-5">
                    <Link href="/contact"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-black text-white transition-all hover:scale-105"
                      style={{ background: "linear-gradient(135deg, #001529, #003380)", boxShadow: "0 4px 16px rgba(0,21,41,0.25)" }}>
                      Get IPO Advisory <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 border-t border-slate-200">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-[#001529] mb-4">
                What We <span className="text-[#f59e08]">Cover</span>
              </h2>
              <p className="text-slate-500 font-medium max-w-2xl">
                India IPO's news desk monitors and analyses every major development in India's capital markets — so you never miss a beat.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: TrendingUp, title: "IPO Watch", desc: "Track every upcoming, open, and recently listed IPO with GMP, subscription, and allotment updates." },
                { icon: Zap, title: "Regulatory Circulars", desc: "Instant analysis of all regulatory changes, circulars, and their impact on markets and investors." },
                { icon: BarChart3, title: "Market Data", desc: "NSE/BSE index movements, sector performance, FII/DII flows, and daily market intelligence." },
                { icon: Globe, title: "Economy & Policy", desc: "RBI policy updates, government economic reforms, and global macro factors affecting Indian markets." },
              ].map((item, i) => (
                <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200 hover:shadow-lg hover:-translate-y-1.5 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#001529] to-[#003380] flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                    <item.icon className="h-6 w-6 text-[#f59e08]" />
                  </div>
                  <h3 className="font-black text-[#001529] text-base mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#001529] to-[#003380] py-10 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {trustStats.map((s, i) => (
                <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-all">
                  <div className="w-11 h-11 rounded-xl bg-[#f59e08]/20 flex items-center justify-center mx-auto mb-3">
                    <s.icon className="h-5 w-5 text-[#f59e08]" />
                  </div>
                  <div className="text-2xl font-black text-white mb-1">{s.value}</div>
                  <div className="text-white/55 text-xs font-semibold">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#001529] via-[#002147] to-[#003380] py-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
              style={{ background: "#f59e08", filter: "blur(80px)", transform: "translate(20%,-30%)" }} />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight">
              Get Real-Time IPO Alerts &amp;<br />
              <span className="text-[#f59e08]">Market Intelligence</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-base font-medium mb-10 leading-relaxed">
              Connect with our advisory team to receive personalized IPO alerts, GMP updates, and market insights directly on WhatsApp or email — tailored to your investment interests.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base transition-all hover:scale-105 shadow-2xl"
                style={{ background: "linear-gradient(135deg, #f59e08, #d97706)", color: "#001529", boxShadow: "0 8px 32px rgba(245,158,8,0.35)" }}>
                <Phone className="h-5 w-5" /> Get in Touch
              </Link>
              <Link href="https://wa.me/917428337280" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base transition-all hover:bg-white/10 border border-white/25 text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                Get In Touch
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
