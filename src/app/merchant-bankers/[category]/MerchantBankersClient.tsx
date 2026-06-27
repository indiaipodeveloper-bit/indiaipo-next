"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Building2,
  ArrowRight,
  ChevronRight,
  X,
  Home,
  Zap,
  GitCompare,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl, formatIndianNumber } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Banker {
  id: string | number;
  title: string;
  sub_title: string;
  slug: string;
  mcat_id: string | number;
  image: string;
  description: string;
  noOfiposofar: string;
  totalfundraised: string;
  avgiposize: string;
  avgsubscription: string;
  cemail: string;
  cmobile: string;
  caddress: string;
  cweblink: string;
  logo_url?: string;
  name?: string;
  website?: string;
  location?: string;
  email?: string;
  phone?: string;
  total_ipos?: string | number;
  total_raised?: string | number;
  avg_size?: string | number;
  avg_subscription?: string | number;
}

const N = "#001529";
const G = "#f59e08";
const G2 = "#d97706";

const ConnectModal = ({
  banker,
  onClose,
  isSME,
}: {
  banker: Banker;
  onClose: () => void;
  isSME: boolean;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    />
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: 20 }}
      className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 z-10"
    >
      <div
        className="p-8 text-white relative text-center flex flex-col items-center"
        style={{ background: `linear-gradient(135deg, ${N}, #003380)` }}
      >
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{ background: `linear-gradient(90deg, ${N}, ${G}, ${N})` }}
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/25 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
        <div className="w-16 h-16 rounded-xl bg-white mb-4 p-2 shadow-xl overflow-hidden flex items-center justify-center shrink-0">
          {banker.image || banker.logo_url ? (
            <img
              src={getImageUrl(banker.image || banker.logo_url)}
              alt={banker.title}
              className="w-full h-full object-contain"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center font-black text-2xl"
              style={{ color: N }}
            >
              {banker.title?.[0]}
            </div>
          )}
        </div>
        <h2 className="text-xl font-black mb-2 leading-tight">
          Connect with {banker.title} through India IPO
        </h2>
        <div className="text-white/50 font-bold text-lg my-1">&</div>
        <p className="font-extrabold text-sm uppercase tracking-wide" style={{ color: G }}>
          Save upto 20% on IPO Listing Expenses.
        </p>
      </div>
      <div className="p-8">
        <div className="pt-2">
          <Link
            href={`/merchant-contact?ipo_type=${isSME ? "SME-IPO" : "Mainboard-IPO"}`}
            className="block"
          >
            <button
              className="w-full h-12 rounded-xl font-black transition-all hover:scale-105 shadow-lg text-sm cursor-pointer text-white"
              style={{
                background: `linear-gradient(135deg, ${G}, ${G2})`,
                color: N,
                boxShadow: "0 4px 16px rgba(245,158,8,0.35)",
              }}
            >
              Contact Now
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  </div>
);

const CompareBar = ({
  selected,
  onRemove,
  onClear,
  onCompare,
}: {
  selected: Banker[];
  onRemove: (id: string | number) => void;
  onClear: () => void;
  onCompare: () => void;
}) => (
  <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 100, opacity: 0 }}
    className="fixed left-0 right-0 z-[49] px-3 pb-[80px] md:pb-4"
    style={{ bottom: 0 }}
  >
    <div
      className="max-w-4xl mx-auto rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${N}, #002f6c)`,
        boxShadow: "0 -4px 40px rgba(0,21,41,0.5)",
      }}
    >
      <div className="flex flex-wrap items-center gap-2 p-3 md:p-4">
        <GitCompare className="w-5 h-5 shrink-0" style={{ color: G }} />
        <p className="text-white font-black text-sm md:text-base flex-1 min-w-[160px]">
          {selected.length === 1
            ? "1 selected — pick 1 more"
            : "2 selected — ready to compare!"}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {selected.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-1.5 bg-white/10 rounded-xl px-2.5 py-1.5 border border-white/20"
            >
              <span className="text-white text-sm font-black max-w-[80px] md:max-w-[110px] truncate">
                {b.title}
              </span>
              <button
                onClick={() => onRemove(b.id)}
                className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-colors ml-1 cursor-pointer"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={onClear}
          className="text-white/50 hover:text-white text-sm font-bold transition-colors cursor-pointer"
        >
          Clear
        </button>
        <button
          onClick={onCompare}
          disabled={selected.length < 2}
          className="flex items-center gap-2 px-5 h-10 rounded-xl font-black text-sm transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer text-white"
          style={{
            background: `linear-gradient(135deg, ${G}, ${G2})`,
            color: N,
          }}
        >
          <GitCompare className="w-4 h-4" /> Compare Now
        </button>
      </div>
    </div>
  </motion.div>
);

export default function MerchantBankersClient({
  initialBankers,
  initialTotal,
  initialTotalPages,
  type,
  category,
  initialBannerVideo,
}: {
  initialBankers: Banker[];
  initialTotal: number;
  initialTotalPages: number;
  type: "SME" | "Mainboard";
  category: string;
  initialBannerVideo: string | null;
}) {
  const isSME = type === "SME";
  const [bankers, setBankers] = useState<Banker[]>(initialBankers);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 9;
  const [hasMore, setHasMore] = useState(initialTotalPages > 1);
  const [connectBanker, setConnectBanker] = useState<Banker | null>(null);
  const [compareList, setCompareList] = useState<Banker[]>([]);
  const [bannerVideo] = useState<string | null>(initialBannerVideo);
  const router = useRouter();

  const toggleCompare = (banker: Banker, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareList((prev) => {
      const exists = prev.find((b) => b.id === banker.id);
      if (exists) return prev.filter((b) => b.id !== banker.id);
      if (prev.length >= 2) return prev;
      return [...prev, banker];
    });
  };

  const removeFromCompare = (id: string | number) =>
    setCompareList((p) => p.filter((b) => b.id !== id));

  const handleCompareNow = () => {
    if (compareList.length < 2) return;
    const typeParam = isSME ? "sme" : "mainboard";
    router.push(
      `/merchant-bankers/compare?a=${compareList[0].id}&b=${compareList[1].id}&type=${typeParam}`
    );
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (page === 1 && debouncedSearch === "") {
      // Don't refetch initial page if search is empty on mount
      setBankers(initialBankers);
      setHasMore(initialTotalPages > 1);
      return;
    }

    if (page === 1) setLoading(true);
    else setLoadingMore(true);

    const api = isSME ? "/api/bankers" : "/api/mainboard-bankers";
    fetch(
      `${api}?page=${page}&limit=${limit}&search=${encodeURIComponent(debouncedSearch)}&category=${encodeURIComponent(category)}`
    )
      .then((r) => r.json())
      .then((body) => {
        const data = body.data || [];
        if (page === 1) setBankers(data);
        else setBankers((p) => [...p, ...data]);
        setHasMore(body.pagination ? page < body.pagination.totalPages : false);
      })
      .catch((err) => console.error("Error fetching filtered bankers client-side:", err))
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  }, [type, page, debouncedSearch, category]);

  const pageTitle = isSME
    ? "List of SME Merchant Bankers"
    : "List of Mainboard Merchant Bankers";

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />
      <main className="flex-grow">
        <section className="py-16 lg:py-24 relative overflow-hidden bg-[#001529]">
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-30"
              src={getImageUrl(bannerVideo || "/uploads/video/ccvindia1.mp4")}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#001529]/80 via-[#001529]/40 to-[#001529]" />
          </div>

          <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
            <div
              className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-5"
              style={{
                background: G,
                filter: "blur(100px)",
                transform: "translate(25%,-25%)",
              }}
            />
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-1 z-10"
            style={{ background: `linear-gradient(90deg, ${N}, ${G}, ${N})` }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-8 flex-wrap justify-start font-bold">
              <Link
                href="/"
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/90 font-semibold">
                {isSME ? "SME" : "Mainboard"} Merchant Bankers
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-7xl text-left"
            >
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-5 leading-tight">
                {isSME ? "SME" : "Mainboard"}{" "}
                <span style={{ color: G }}>Merchant Bankers</span>
              </h1>
              <p className="text-white/65 max-w-2xl mb-10 text-lg md:text-xl font-medium leading-relaxed">
                {isSME
                  ? "Access a curated network of SEBI-registered Merchant Bankers for SME IPOs on BSE SME and NSE Emerge, backed by expert advisory and execution support."
                  : "India's top expert Merchant Bankers for Mainline IPO advisory and book running."}
              </p>

              <div className="max-w-xl relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  placeholder="Search by merchant banker name or keywords…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm font-medium focus:outline-none focus:bg-white/15 focus:border-[#f59e08]/50 transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-4 justify-start">
                <Link
                  href={
                    isSME
                      ? "/merchant-bankers/list-of-mainboard-merchant-bankers"
                      : "/merchant-bankers/list-of-sme-merchant-bankers"
                  }
                  className="flex items-center gap-2 px-8 h-12 rounded-xl font-black text-base text-white border border-white/25 hover:bg-white/10 transition-all"
                >
                  View {isSME ? "Mainboard" : "SME"} Bankers{" "}
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/ipo-eligibility-check"
                  className="flex items-center gap-2 px-8 h-12 rounded-xl font-black text-base transition-all hover:scale-105 text-[#001529]"
                  style={{
                    background: `linear-gradient(135deg, ${G}, ${G2})`,
                  }}
                >
                  <Zap className="h-5 w-5" /> Check Your IPO Eligibility
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-14">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-1.5 h-10 rounded-full"
                  style={{ background: G }}
                />
                <h2 className="text-3xl font-black" style={{ color: N }}>
                  {pageTitle}
                </h2>
              </div>
              {isSME && (
                <p className="text-slate-600 text-base md:text-[16px] leading-relaxed text-justify font-medium">
                  Interested in listing your SME on the stock exchange? This
                  curated list of merchant bankers will assist you. From capital
                  restructuring and fundraising to the promotion of an IPO and a
                  post-issue process of compliance management, these specialists
                  will assist you with each step of your SME IPO journey. Use
                  this list to find the best merchant banker for assessing share
                  value, managing various aspects of an IPO and liaising with
                  regulatory authorities. Additionally, promoters will be able
                  to find the top 10 merchant bankers in India and select the
                  best fit to lead their IPO.
                </p>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-slate-200 h-72 animate-pulse"
                  />
                ))}
              </div>
            ) : bankers.length === 0 ? (
              <div className="bg-white text-center py-24 rounded-2xl border-2 border-dashed border-slate-200">
                <Building2 className="w-14 h-14 mx-auto mb-4 text-slate-200" />
                <h3 className="text-xl font-black mb-2" style={{ color: N }}>
                  No merchant bankers found
                </h3>
                <p className="text-slate-400 font-medium">
                  Try adjusting your search criteria.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bankers.map((banker, i) => (
                    <motion.div
                      key={banker.id}
                      onClick={() => router.push(`/merchant-banker/${banker.slug}`)}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (i % limit) * 0.05 }}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all cursor-pointer group flex flex-col"
                    >
                      <div
                        className="h-1 w-full"
                        style={{
                          background: `linear-gradient(90deg, ${N}, ${G})`,
                        }}
                      />

                      <div className="p-5 flex gap-4 items-start">
                        <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-2 shrink-0 shadow-sm group-hover:border-[#f59e08]/40 transition-colors overflow-hidden">
                          {banker.image || banker.logo_url ? (
                            <img
                              src={getImageUrl(banker.image || banker.logo_url)}
                              alt={banker.title}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span
                              className="text-2xl font-black"
                              style={{ color: N }}
                            >
                              {banker.title?.[0]}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3
                            className="text-lg font-black leading-snug line-clamp-2 transition-colors group-hover:text-[#f59e08]"
                            style={{ color: N }}
                          >
                            {banker.title}
                          </h3>
                          {banker.sub_title && (
                            <span
                              className="inline-block mt-1.5 text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-widest"
                              style={{
                                background: "rgba(245,158,8,0.12)",
                                color: G2,
                              }}
                            >
                              {banker.sub_title}
                            </span>
                          )}
                        </div>
                      </div>

                      <div
                        className="grid grid-cols-4 gap-0 mx-5 mb-5 rounded-xl overflow-hidden border border-slate-100"
                        style={{ background: "#F8FAFC" }}
                      >
                        {[
                          {
                            val: banker.noOfiposofar || banker.total_ipos || "0",
                            lbl: "IPOs",
                            c: N,
                          },
                          {
                            val:
                              formatIndianNumber(banker.totalfundraised || banker.total_raised) ||
                              "₹0",
                            lbl: "Raised",
                            c: G2,
                          },
                          {
                            val: formatIndianNumber(banker.avgiposize || banker.avg_size) || "NA",
                            lbl: "Avg Sz",
                            c: N,
                          },
                          {
                            val: banker.avgsubscription
                              ? `${banker.avgsubscription}x`
                              : banker.avg_subscription
                                ? `${banker.avg_subscription}x`
                                : "0x",
                            lbl: "Avg Sub",
                            c: G2,
                          },
                        ].map((s, si) => (
                          <div
                            key={si}
                            className="py-4 text-center border-r border-slate-100 last:border-r-0"
                          >
                            <p
                              className="text-sm md:text-base font-black"
                              style={{ color: s.c }}
                            >
                              {s.val}
                            </p>
                            <p className="text-[10px] text-slate-400 uppercase font-black mt-0.5 tracking-widest">
                              {s.lbl}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Compare toggle */}
                      <div className="px-5 pb-1">
                        <button
                          onClick={(e) => toggleCompare(banker, e)}
                          disabled={
                            compareList.length >= 2 &&
                            !compareList.find((b) => b.id === banker.id)
                          }
                          className={`w-full h-10 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all border cursor-pointer ${compareList.find((b) => b.id === banker.id)
                            ? "border-amber-400 bg-amber-50 text-amber-700"
                            : "border-slate-200 text-slate-400 hover:border-amber-300 hover:text-amber-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            }`}
                        >
                          {compareList.find((b) => b.id === banker.id) ? (
                            <>
                              <Check className="w-4 h-4" /> Selected for Compare
                            </>
                          ) : (
                            <>
                              <GitCompare className="w-4 h-4" /> Add to Compare
                            </>
                          )}
                        </button>
                      </div>

                      <div className="px-5 pb-5 mt-2 flex gap-3">
                        <Link
                          href={`/merchant-banker/${banker.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 h-11 rounded-xl font-black text-sm border transition-all flex items-center justify-center hover:text-white"
                          style={{ borderColor: "rgba(0,21,41,0.2)", color: N }}
                        >
                          View Details
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/merchant-contact?ipo_type=${isSME ? "SME-IPO" : "Mainboard-IPO"}`
                            );
                          }}
                          className="flex-1 h-11 rounded-xl font-black text-sm transition-all hover:scale-105 cursor-pointer text-white"
                          style={{
                            background: `linear-gradient(135deg, ${G}, ${G2})`,
                            boxShadow: "0 4px 12px rgba(245,158,8,0.3)",
                          }}
                        >
                          Connect
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={loadingMore}
                      className="inline-flex items-center gap-2 px-10 h-14 rounded-xl font-black text-base text-white transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                      style={{
                        background: `linear-gradient(135deg, ${N}, #003380)`,
                        boxShadow: "0 8px 32px rgba(0,21,41,0.25)",
                      }}
                    >
                      {loadingMore ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />{" "}
                          Loading…
                        </>
                      ) : (
                        <>
                          Load More Bankers <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section
          className="py-20 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${N}, #002147, #003380)`,
          }}
        >
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 pointer-events-none"
            style={{
              background: G,
              filter: "blur(80px)",
              transform: "translate(20%,-30%)",
            }}
          />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to <span style={{ color: G }}>Go Public?</span>
            </h2>
            <p className="text-white/65 max-w-xl mx-auto font-medium mb-10 text-base leading-relaxed">
              Our team of expert advisors and merchant bankers will guide you
              through every step of your IPO journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base transition-all hover:scale-105 text-[#001529]"
                style={{
                  background: `linear-gradient(135deg, ${G}, ${G2})`,
                  boxShadow: "0 8px 32px rgba(245,158,8,0.35)",
                }}
              >
                Get Free Consultation <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/ipo-eligibility-check"
                className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base text-white border border-white/25 hover:bg-white/10 transition-all"
              >
                Check Eligibility
              </Link>
            </div>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {connectBanker && (
          <ConnectModal
            banker={connectBanker}
            onClose={() => setConnectBanker(null)}
            isSME={isSME}
          />
        )}
        {compareList.length > 0 && (
          <CompareBar
            selected={compareList}
            onRemove={removeFromCompare}
            onClear={() => setCompareList([])}
            onCompare={handleCompareNow}
          />
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}
