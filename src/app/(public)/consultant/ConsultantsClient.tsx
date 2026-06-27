"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight, Users, MapPin, Award, ArrowRight,
  Home, Zap, Star, CheckCircle2, Shield
} from "lucide-react";
import Ribbon from "@/components/Ribbon";
import { getImgSrc } from "@/utils/image";
import { API_URL } from "@/lib/constants";

interface Consultant {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  specialization: string | null;
  office_location: string | null;
  experience_years: number;
  blog_title?: string | null;
}

const N = "#001529", G = "#f59e08", G2 = "#d97706";

export default function ConsultantsClient() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/consultants`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setConsultants(data.filter((c: any) => c.is_active));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>

      <main>
        <section className="py-16 lg:py-24 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${N} 0%, #002147 55%, #003380 100%)` }}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-5"
              style={{ background: G, filter: "blur(100px)", transform: "translate(25%,-25%)" }} />
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-5"
              style={{ background: "#3b82f6", filter: "blur(80px)", transform: "translate(-20%,20%)" }} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1"
            style={{ background: `linear-gradient(90deg, ${N}, ${G}, ${N})` }} />

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-8 flex-wrap justify-start">
              <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/90 font-semibold">IPO Consultant</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-left max-w-6xl">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
                Professional <span style={{ color: G }}>IPO Consultants</span> for Your Growth Journey
              </h1>
              <p className="text-white/65 text-base md:text-xl mb-10 leading-relaxed max-w-4xl font-medium">
                Partner with India's most trusted IPO specialists. We connect ambitious businesses with the right consultants to ensure a successful public listing.
              </p>

              <div className="flex flex-wrap justify-start gap-4">
                {[
                  { icon: Star, label: "4.9/5 Average Rating", color: G },
                  { icon: CheckCircle2, label: "SEBI Compliant Advisory", color: "#86efac" },
                  { icon: Shield, label: "100% Registered Experts", color: G },
                ].map((b, i) => (
                  <Ribbon key={i} fontSize="13px" cutout="0.5em" color="linear-gradient(135deg, #002a52 0%, #0052a3 60%, #0080ff 100%)"
                    className="inline-flex items-center gap-2 text-white font-black border border-white/10 px-4 py-2">
                    <b.icon className="h-4 w-4" style={{ color: b.color }} />
                    {b.label}
                  </Ribbon>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 rounded-full" style={{ background: G }} />
              <h2 className="text-2xl font-black" style={{ color: N }}>Our Expert Consultants</h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-white border border-slate-200 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : consultants.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <Users className="w-14 h-14 mx-auto mb-4 text-slate-200" />
                <h3 className="text-xl font-black mb-2" style={{ color: N }}>No consultants available</h3>
                <p className="text-slate-400 font-medium">Please check back soon for our expert listing.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {consultants.map((c, idx) => (
                  <Link
                    key={c.id}
                    href={`/consultant/${c.slug}`}
                    className="block no-underline text-inherit"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: idx * 0.07 }}
                      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all flex flex-col h-full cursor-pointer">

                      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${N}, ${G})` }} />

                      <div className="h-52 bg-slate-100 overflow-hidden relative">
                        {getImgSrc(c.image_url) ? (
                          <img src={getImgSrc(c.image_url)!} alt={c.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"
                            style={{ background: `linear-gradient(135deg, rgba(0,21,41,0.06), rgba(245,158,8,0.06))` }}>
                            <Users className="h-16 w-16 text-slate-200" />
                          </div>
                        )}
                        {c.office_location && (
                          <div className="absolute top-3 right-0 z-10">
                            <Ribbon
                              fontSize="11px"
                              cutout="0.4em"
                              color="linear-gradient(135deg, #002a52 0%, #0052a3 60%, #0080ff 100%)"
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-white font-black border-y border-l border-white/15"
                            >
                              <MapPin className="h-3 w-3" style={{ color: G }} /> {c.office_location}
                            </Ribbon>
                          </div>
                        )}
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <h2 className="text-lg font-black leading-snug mb-3 line-clamp-2 transition-colors group-hover:text-[#f59e08]"
                          style={{ color: N }}>
                          {c.blog_title || c.name}
                        </h2>
                        <p className="text-slate-500 text-sm line-clamp-3 mb-5 leading-relaxed font-medium">
                          {c.description || "Leading strategic IPO advisory firm focused on helping companies achieve successful listings on NSE Emerge and BSE SME platforms."}
                        </p>

                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div className="text-xs">
                            <span className="text-slate-400 block mb-0.5 font-medium">Experience</span>
                            <span className="font-black" style={{ color: N }}>
                              {c.experience_years ? `${c.experience_years}+ Years` : "Expert Team"}
                            </span>
                          </div>
                          <div
                            className="flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all group-hover:scale-105"
                            style={{ background: `linear-gradient(135deg, ${N}, #003380)`, color: "white" }}>
                            View Details <ArrowRight className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-20 bg-white border-t border-slate-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black mb-3" style={{ color: N }}>Trusted by <span style={{ color: G }}>Hundreds of Companies</span></h2>
              <p className="text-slate-500 max-w-xl mx-auto font-medium">Our team brings unmatched expertise in capital markets, regulatory compliance, and successful IPO execution.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Users, value: "100+", label: "Companies Guided", desc: "Successfully guided through their IPO journey with end-to-end support." },
                { icon: MapPin, value: "Pan-India", label: "Coverage", desc: "Expert consultants in Mumbai, Delhi, Ahmedabad, Kolkata, and more." },
                { icon: Award, value: "SEBI", label: "Compliance", desc: "Ensuring all advisory follows stringent regulatory frameworks for transparency." },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group text-center p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-[#f59e08]/40 hover:-translate-y-1 transition-all">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all group-hover:scale-110"
                    style={{ background: "rgba(0,21,41,0.06)" }}>
                    <item.icon className="h-8 w-8" style={{ color: N }} />
                  </div>
                  <p className="text-2xl font-black mb-1" style={{ color: G }}>{item.value}</p>
                  <h3 className="text-lg font-black mb-3" style={{ color: N }}>{item.label}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${N}, #002147, #003380)` }}>
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
            style={{ background: G, filter: "blur(80px)", transform: "translate(20%,-30%)" }} />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              Ready to <span style={{ color: G }}>Go Public?</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto font-medium mb-8 leading-relaxed">
              Connect with our expert IPO consultants today and take the first step toward a successful public listing on NSE or BSE.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${G}, ${G2})`, color: N, boxShadow: "0 8px 32px rgba(245,158,8,0.35)" }}>
                Get Free Consultation <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/ipo-eligibility-check"
                className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-base text-white border border-white/25 hover:bg-white/10 transition-all">
                <Zap className="h-5 w-5" style={{ color: G }} /> Check IPO Eligibility
              </Link>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
