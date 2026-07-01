"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, ChevronRight, ChevronLeft, Calendar, Eye,
  Search, ArrowRight, Newspaper, Loader2, PieChart, BarChart3, Zap, X, Mail, Calendar1, ChartLine
} from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { toast } from "sonner";
import { API_URL } from "@/lib/constants";

interface WeeklyDigestData {
  id: number;
  title: string;
  image: string | null;
  pdf: string | null;
  type: "weekly" | "monthly";
  created_at: string;
  updated_at: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.45 } }),
};

const reporterTypes = [
  { icon: Calendar1, value: "WEEKLY", label: "Every Sunday" },
  { icon: Calendar1, value: "MONTHLY", label: "Every Month End" },
  { icon: BarChart3, value: "QUARTERLY", label: "Every Quarter End" },
  { icon: PieChart, value: "HALF YEARLY", label: "Every 6 Months" },
  { icon: ChartLine, value: "YEARLY", label: "Every Year End" },
];

const reportFilters = [
  { value: "all", label: "All Reports" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
] as const;

export default function WeeklyDigestClient({
  initialDigests,
  initialTotal,
  initialTotalPages
}: {
  initialDigests: WeeklyDigestData[];
  initialTotal: number;
  initialTotalPages: number;
}) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [digests, setDigests] = useState<WeeklyDigestData[]>(initialDigests);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [total, setTotal] = useState(initialTotal);
  const [type, setType] = useState<"all" | "weekly" | "monthly">("all");

  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { getToken } = useRecaptcha();

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const fetchData = async (currentPage: number, currentSearch: string, currentType: "all" | "weekly" | "monthly" ) => {
    try {
      setLoading(true);
        let params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
      });

      params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
      });

      if (currentSearch.trim()) {
        params.set("search", currentSearch);
      }

      if (currentType !== "all") {
        params.set("type", currentType);
      }


      const res = await fetch(`${API_URL}/api/weekly-digests?${params.toString()}`);
      if (res.ok) {
        const result = await res.json();
        setDigests(result.data || []);
        setTotalPages(result.pagination?.totalPages || 1);
        setTotal(result.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Error fetching weekly digests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, search, type);
  }, [page, search, type]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      return toast.error("Please enter your email address");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.error("Please enter a valid email address");
    }

    setSubmitting(true);
    try {
      const recaptchaToken = await getToken('newsletter_subscribe');
      const r = await fetch(`${API_URL}/api/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, recaptchaToken }),
      });

      if (r.ok) {
        toast.success("Thank you for subscribing to Weekly Reporter!");
        setEmail("");
        setShowSubscribeModal(false);
      } else {
        const err = await r.json();
        toast.error(err.error || "Subscription failed. Please try again.");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      <main>
        <section className="bg-[#001529] pt-14 pb-36 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-cover bg-center opacity-20" style={{ backgroundImage: "url('/assets/newsletter-bg.jpg')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#001529]/80 via-[#001529]/40 to-[#001529]" />
          </div>

          <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-5"
              style={{ background: "#fbbf24", filter: "blur(100px)", transform: "translate(25%,-25%)" }} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#F8FAFC] z-10" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-8 flex-wrap justify-start md:justify-center">
              <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
                <Home className="h-3.5 w-3.5 text-[#fbbf24]" /> Home
              </Link>
              <ChevronRight className="h-4 w-4 text-white/30" />
              <span className="text-white/80">IPO Reporter</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-left md:text-center flex flex-col items-start md:items-center">
              <h1 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight max-w-3xl mr-auto md:mx-auto">
                IPO Reports By <span className="text-[#fbbf24]">India IPO</span>
              </h1>
              <p className="text-white/65 max-w-2xl text-base md:text-lg font-medium leading-relaxed mb-10 mr-auto md:mx-auto">
                Stay informed with comprehensive insights into India's IPO market. Our reports are available in multiple frequencies to match your information needs - from weekly updates to yearly deep dives.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="5"
              >
                <Button
                  onClick={() => setShowSubscribeModal(true)}
                  className="bg-[#fbbf24] hover:bg-[#f59e0b] text-[#001529] font-black px-10 py-7 rounded-2xl text-lg shadow-2xl shadow-[#fbbf24]/20 uppercase transition-all hover:scale-105 active:scale-95 cursor-pointer h-auto"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Subscribe Now
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#001529] to-[#003380] py-10 -mt-1 relative z-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {reporterTypes.map((s, i) => (
                <div
                  key={i}
                  className="w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.75rem)] lg:w-[calc(20%-0.8rem)] max-w-[220px] bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#fbbf24]/20 flex items-center justify-center mx-auto mb-3">
                    <s.icon className="h-5 w-5 text-[#fbbf24]" />
                  </div>

                  <div className="text-xl font-black text-white mb-1">
                    {s.value}
                  </div>

                  <div className="text-white/55 text-xs font-semibold">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 rounded-full bg-[#fbbf24]" />
              <h2 className="text-2xl font-black text-[#001529]">Latest Editions</h2>
              <div className="relative w-full max-w-lg mr-auto md:mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black/40" />
                <input
                  type="text"
                  placeholder="Search IPO reports"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/10 border border-black/20 text-black placeholder:text-black/40 text-sm font-medium focus:outline-none focus:bg-black/15 focus:border-[#fbbf24]/50 transition-all"
                />
              </div>
            </div>
            
              <div className="flex flex-wrap gap-3 mb-8">
              {reportFilters.map((item) => (
                <button
                  key={item.value.toLowerCase()}
                  onClick={() =>
                    setType(item.value.toLowerCase() as "all" | "weekly" | "monthly")
                  }
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer
                  ${
                    type === item.value
                      ? "bg-[#001529] text-white shadow-lg"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-[#001529]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#001529] to-[#003380] flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-[#fbbf24]" />
                </div>
                <p className="text-slate-500 font-semibold">Fetching latest editions…</p>
              </div>
            ) : digests.length === 0 ? (
              <div className="py-24 text-center bg-white rounded-3xl border border-slate-200">
                <div className="w-16 h-16 rounded-2xl bg-[#001529]/10 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-[#001529]/30" />
                </div>
                <h3 className="text-xl font-black text-[#001529] mb-2">No matching reports found</h3>
                <p className="text-slate-400 font-medium mb-4">Try adjusting your search.</p>
                <button onClick={() => setSearchInput("")} className="text-sm font-black text-[#fbbf24] hover:underline cursor-pointer">Clear Search</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {digests.map((digest) => (
                  <div key={digest.id} className="group bg-white shadow-2xl border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col">
                    <div className="relative aspect-video overflow-hidden bg-white">
                      {digest.image ? (
                        <img src={getImageUrl(digest.image)} alt={digest.title} className="w-full h-full object-fill group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(0,21,41,0.08), rgba(0,51,128,0.12))" }}>
                          <Newspaper className="h-12 w-12 text-[#001529]/20" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        {digest.pdf && (
                          <Link href={`/ipo-report/view/${digest.id}`} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#001529] text-xs font-black hover:bg-white/90 transition-all font-semibold">
                            <Eye className="h-3.5 w-3.5 text-[#fbbf24]" /> View {digest.type} pdf
                          </Link>
                        )}
                      </div>

                      <div className="absolute top-3 left-3">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 shadow-sm">
                          <Calendar className="h-3 w-3 text-[#fbbf24]" />
                          <span className="text-[10px] font-black text-[#001529] uppercase tracking-wide">
                            {new Date(digest.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                      </div>
                      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, #001529, #fbbf24)" }} />
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-black text-[#001529] text-sm leading-snug line-clamp-2 mb-3 group-hover:text-[#fbbf24] transition-colors flex-1">
                        {digest.title}
                      </h3>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        {digest.pdf ? (
                          <Link href={`/ipo-report/view/${digest.id}`} className="inline-flex items-center gap-1 text-xs font-black text-[#001529] hover:text-[#fbbf24] transition-colors">
                            Open Report <ArrowRight className="h-3.5 w-3.5 text-[#fbbf24]" />
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Coming soon…</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      className="w-9 h-9 sm:w-auto sm:px-5 sm:h-11 rounded-xl flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-[#001529] hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm font-black text-[10px] sm:text-xs cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">PREV</span>
                    </button>

                    <div className="flex items-center gap-1 sm:gap-1.5">
                      {range.map((p, i) => (
                        p === "..." ? (
                          <span key={`e-${i}`} className="w-7 sm:w-11 h-9 sm:h-11 flex items-center justify-center text-slate-400 font-black">...</span>
                        ) : (
                          <button key={p} onClick={() => setPage(p as number)}
                            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl text-xs sm:text-sm font-black transition-all shadow-sm cursor-pointer ${p === page
                              ? "bg-[#fbbf24] text-[#001529] shadow-lg shadow-[#fbbf24]/20"
                              : "bg-white text-slate-400 border border-slate-200 hover:bg-slate-50"
                              }`}
                          >
                            {p}
                          </button>
                        )
                      ))}
                    </div>

                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      className="w-9 h-9 sm:w-auto sm:px-5 sm:h-11 rounded-xl flex items-center justify-center gap-1.5 bg-[#001529] text-white hover:bg-[#002147] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md font-black text-[10px] sm:text-xs cursor-pointer"
                    >
                      <span className="hidden sm:inline">NEXT</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <div className="w-10 h-[1px] bg-slate-200" />
                    <span>Page {page} of {totalPages} <span className="mx-1 opacity-30">|</span> Weekly Reports</span>
                    <div className="w-10 h-[1px] bg-slate-200" />
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#001529] via-[#002147] to-[#003380] py-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
              style={{ background: "#fbbf24", filter: "blur(80px)", transform: "translate(20%,-30%)" }} />
          </div>
          <div className="container mx-auto px-4 text-left md:text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Expert <span className="text-[#fbbf24]">IPO Guidance</span>
            </h2>
            <p className="text-white/60 max-w-xl mr-auto md:mx-auto text-base font-medium mb-10">
              Navigating the IPO journey requires precision and expertise. Let our seasoned professionals help you achieve your public listing goals.
            </p>
            <div className="flex flex-wrap justify-start md:justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base transition-all hover:scale-105 shadow-2xl bg-[#fbbf24] text-[#001529] hover:bg-[#f59e0b] shadow-[#fbbf24]/20 justify-center">
                Get Free Consultation <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/ipo-eligibility-check" className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base text-white border border-white/25 hover:bg-white/10 transition-all justify-center">
                Check Eligibility
              </Link>
            </div>
          </div>
        </section>
      </main>


      {/* Custom Newsletter Modal */}
      <AnimatePresence>
        {showSubscribeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/65 backdrop-blur-sm"
              onClick={() => setShowSubscribeModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-gradient-to-br from-[#001c38] to-[#001529] p-8 md:p-10 text-center rounded-3xl border border-[#fbbf24]/40 shadow-2xl z-10"
            >
              <button
                onClick={() => setShowSubscribeModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="w-16 h-16 bg-gradient-to-br from-[#fbbf24]/20 to-[#fbbf24]/5 text-[#fbbf24] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#fbbf24]/20 shadow-lg shrink-0">
                <Mail className="h-8 w-8" />
              </div>

              <h2 className="text-2xl md:text-3xl font-black mb-3 text-white tracking-tight leading-tight">
                Stay ahead of <span className="text-[#fbbf24]">the curve</span>
              </h2>

              <p className="text-white/60 mb-8 text-sm font-medium leading-relaxed">
                Get weekly analysis, allotment status, and critical IPO news delivered straight to your inbox.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-white/5 border border-white/10 focus:border-[#fbbf24]/50 focus:ring-4 focus:ring-[#fbbf24]/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 outline-none transition-all"
                  required
                />
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#fbbf24] hover:bg-[#f59e0b] text-[#001529] font-black py-6 rounded-2xl text-base shadow-xl shadow-[#fbbf24]/15 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer h-auto"
                >
                  {submitting ? "Subscribing..." : "SUBSCRIBE NOW"}
                </Button>
              </form>

              <p className="text-[9px] text-white/35 mt-6 uppercase tracking-[0.25em] font-bold">
                WE RESPECT YOUR PRIVACY. UNSUBSCRIBE ANYTIME.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Subscribe Button */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:block">
        <button
          onClick={() => setShowSubscribeModal(true)}
          className="bg-[#fbbf24] text-[#001529] font-black py-4 px-2.5 rounded-l-2xl shadow-2xl vertical-text flex items-center gap-2 hover:bg-[#f59e0b] transition-all hover:pl-4 group cursor-pointer"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <Mail className="h-5 w-5 rotate-90 group-hover:scale-110 transition-transform" />
          <span className="uppercase tracking-widest text-xs">Subscribe Now</span>
        </button>
      </div>
    </div>
  );
}
