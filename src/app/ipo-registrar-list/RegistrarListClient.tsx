"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, MapPin, Calendar, ArrowRight, Search, Activity, Globe, ChevronLeft, ChevronRight, Shield, Home, CheckCircle, Users } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface Registrar {
  id: number;
  name: string;
  image: string;
  slug: string;
  sme_ipo: string;
  mainboard_ipo: string;
  location: string;
  dic: string;
  registrar_year: string;
  latest_sme: string;
  latest_mainbord: string;
  status: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

interface RegistrarListClientProps {
  initialRegistrars: Registrar[];
  initialPagination: PaginationData | null;
  initialBannerVideo: string | null;
}

export default function RegistrarListClient({
  initialRegistrars,
  initialPagination,
  initialBannerVideo
}: RegistrarListClientProps) {
  const router = useRouter();
  const [registrars, setRegistrars] = useState<Registrar[]>(initialRegistrars);
  const [pagination, setPagination] = useState<PaginationData | null>(initialPagination);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (page === 1 && debouncedSearch === "") {
      setRegistrars(initialRegistrars);
      setPagination(initialPagination);
      return;
    }

    const fetchRegistrars = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/registrars?page=${page}&limit=9&search=${encodeURIComponent(debouncedSearch)}`);
        if (res.ok) {
          const body = await res.json();
          setRegistrars(body.data || []);
          setPagination(body.pagination || null);
        }
      } catch (err) {
        console.error("Failed to load registrars client-side:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrars();
  }, [page, debouncedSearch, initialRegistrars, initialPagination]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main>
        {/* Banner Section */}
        <section className="py-16 lg:py-24 relative overflow-hidden bg-[#001529]">
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
              style={{ background: "#f59e08", filter: "blur(100px)", transform: "translate(25%,-25%)" }}
            />
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-1 z-10"
            style={{ background: `linear-gradient(90deg, #001529, #f59e08, #001529)` }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-8 flex-wrap justify-center">
              <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
                <Home className="h-3.5 w-3.5 text-[#f59e08]" /> Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/90 font-semibold">IPO Registrars</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
                List Of <span className="text-[#f59e08]"> IPO Registrars</span>
              </h1>
              <p className="text-white/65 max-w-2xl mx-auto mb-8 text-base md:text-lg font-medium leading-relaxed text-sm">
                Explore SEBI-registered IPO registrars managing share allotment, refunds and investor registry services across Mainboard and SME issues.
              </p>

              <div className="max-w-xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  placeholder="Search by Registrar Name or Location…"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm font-medium focus:outline-none focus:bg-white/15 focus:border-[#f59e08]/50 transition-all outline-none"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="bg-gradient-to-r from-[#001529] to-[#003380] py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Shield, value: "100%", label: "Official RTAs" },
                { icon: Building2, value: "20+", label: "Active Registrars" },
                { icon: Activity, value: "1000+", label: "IPOs Processed" },
                { icon: Globe, value: "Pan-India", label: "Coverage" },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center text-center py-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-2">
                    <s.icon className="h-5 w-5 text-[#f59e08]" />
                  </div>
                  <p className="text-xl font-black text-white mb-0.5">{s.value}</p>
                  <p className="text-xs text-white/50 font-bold uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Listing Section */}
        <section className="py-14">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 rounded-full bg-[#f59e08]" />
              <h2 className="text-2xl font-black text-[#001529]">
                List of IPO Registrars
                <span className="text-slate-400 text-base font-semibold ml-2">
                  ({pagination ? pagination.totalItems : registrars.length} listed)
                </span>
              </h2>
            </div>

            {loading ? (
              <div className="overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[13px] font-black uppercase tracking-wider text-slate-500">
                        <th className="px-6 py-4">Registrar & Logo</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4 text-center">Established</th>
                        <th className="px-6 py-4 text-center">Mainboard IPOs</th>
                        <th className="px-6 py-4 text-center">SME IPOs</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(6)].map((_, i) => (
                        <tr key={i} className="border-b border-slate-100 animate-pulse">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-slate-200 shrink-0" />
                              <div className="space-y-1.5">
                                <div className="h-4 bg-slate-200 rounded w-40" />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-slate-200 rounded w-24" />
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <div className="h-5 bg-slate-200 rounded-full w-14 mx-auto" />
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <div className="h-6 bg-slate-200 rounded w-8 mx-auto" />
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <div className="h-6 bg-slate-200 rounded w-8 mx-auto" />
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="h-9 bg-slate-200 rounded-lg w-28 ml-auto" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : registrars.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
                <Building2 className="h-14 w-14 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-black mb-2 text-[#001529]">No registrars found</h3>
                <p className="text-slate-400 font-medium">Try adjusting your search criteria.</p>
                <button
                  onClick={() => handleSearchChange("")}
                  className="mt-4 text-sm font-black text-[#f59e08] hover:underline cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-[#001529]/5 text-xs md:text-sm font-black uppercase tracking-wider text-[#001529]">
                        <th className="px-6 py-4">Registrar & Logo</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4 text-center">Established</th>
                        <th className="px-6 py-4 text-center">Mainboard IPOs</th>
                        <th className="px-6 py-4 text-center">SME IPOs</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {registrars.map((r, idx) => (
                        <tr
                          key={r.id}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                          onClick={() => router.push(`/ipo-registrar-list/${r.slug}`)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-lg border border-slate-200 bg-white p-1.5 flex items-center justify-center shadow-sm group-hover:border-[#f59e08]/40 transition-colors overflow-hidden shrink-0">
                                {r.image ? (
                                  <img src={getImageUrl(r.image)} alt={r.name} className="w-full h-full object-contain" />
                                ) : (
                                  <Building2 className="h-7 w-7 text-slate-300" />
                                )}
                              </div>
                              <div>
                                <span className="font-black text-sm md:text-base lg:text-lg group-hover:text-[#f59e08] transition-colors text-[#001529]">
                                  {r.name}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-slate-700 text-xs md:text-sm lg:text-base font-semibold">
                              <MapPin className="h-4 w-4 text-[#f59e08]" />
                              {r.location || "Head Office, India"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            {r.registrar_year ? (
                              <span className="inline-flex items-center gap-1 text-[11px] md:text-xs lg:text-sm font-black px-3 py-1.5 rounded-full bg-[#001529]/5 text-[#001529]">
                                <Calendar className="h-3.5 w-3.5" /> {r.registrar_year}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-sm font-medium">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <span className="inline-flex items-center justify-center font-black text-sm md:text-base lg:text-lg px-3.5 py-1.5 rounded-lg bg-slate-100/70 text-[#001529]">
                              {r.mainboard_ipo || "0"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <span className="inline-flex items-center justify-center font-black text-sm md:text-base lg:text-lg px-3.5 py-1.5 rounded-lg bg-[#f59e08]/10 text-[#d97706]">
                              {r.sme_ipo || "0"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div
                              className="inline-flex items-center gap-1.5 px-4 h-10 rounded-lg font-black text-xs md:text-sm transition-all group-hover:scale-105 bg-gradient-to-r from-[#001529] to-[#003380] text-white"
                              style={{ boxShadow: "0 2px 8px rgba(0,21,41,0.15)" }}
                            >
                              View Details <ArrowRight className="h-4 w-4" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="flex items-center gap-1 px-5 h-11 rounded-xl font-black text-sm text-white transition-all disabled:opacity-40 bg-[#001529] cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className="w-11 h-11 rounded-xl font-black text-sm transition-all cursor-pointer border-0"
                    style={
                      page === p
                        ? { background: "#f59e08", color: "#001529", boxShadow: "0 4px 12px rgba(245,158,8,0.35)" }
                        : { background: "#f1f5f9", color: "#475569" }
                    }
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={page === pagination.totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  className="flex items-center gap-1 px-5 h-11 rounded-xl font-black text-sm text-white transition-all disabled:opacity-40 bg-[#001529] cursor-pointer"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Roles details section */}
        <section className="py-20 bg-white border-t border-slate-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-black mb-8 leading-tight text-[#001529]">
                  Role of a Registrar in <span className="text-[#f59e08]">IPO Allotment</span>
                </h2>
                <div className="space-y-6">
                  {[
                    {
                      icon: Users,
                      title: "Share Processing",
                      color: "#001529",
                      desc: "Registrars manage IPO applications, validate bids, and reconcile investor data across retail, HNI, and institutional categories."
                    },
                    {
                      icon: Activity,
                      title: "Basis of Allotment",
                      color: "#d97706",
                      desc: "They finalise the allotment in coordination with stock exchanges and SEBI, ensuring fair and compliant distribution."
                    },
                    {
                      icon: Globe,
                      title: "Fund Blocking & Refund Handling",
                      color: "#001529",
                      desc: "During the IPO process, they manage ASBA/UPI fund blocking and ensure timely refunds or mandate revocations for unsuccessful applicants."
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm bg-[#001529]/5"
                      >
                        <item.icon className="h-7 w-7" style={{ color: item.color }} />
                      </div>
                      <div>
                        <h4 className="font-black text-lg mb-1 text-[#001529]">{item.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                    alt="Market Analysis"
                    className="w-full h-72 object-cover"
                  />
                  <div className="p-8 bg-[#001529]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-[#f59e08]" />
                      </div>
                      <div>
                        <p className="font-black text-white text-base">Official Registrar Support</p>
                        <p className="text-white/55 text-xs font-medium">Connected with all major RTA agents in India</p>
                      </div>
                    </div>
                    <Link
                      href="/contact"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-sm mt-4 transition-all hover:scale-105 bg-gradient-to-r from-[#f59e08] to-[#d97706] text-[#001529]"
                    >
                      Get Registrar Guidance <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Strip */}
        <section
          className="py-16 relative overflow-hidden bg-gradient-to-r from-[#001529] via-[#002147] to-[#003380]"
        >
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl font-black text-white mb-3">
              Need Help Choosing a <span className="text-[#f59e08]">Registrar?</span>
            </h2>
            <p className="text-white/60 max-w-lg mx-auto font-medium mb-8 text-sm">
              Our experts help you select the right registrar for your IPO and ensure smooth allotment processes.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base transition-all hover:scale-105 bg-gradient-to-r from-[#f59e08] to-[#d97706] text-[#001529]"
              style={{ boxShadow: "0 8px 32px rgba(245,158,8,0.35)" }}
            >
              Contact Our Experts <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
