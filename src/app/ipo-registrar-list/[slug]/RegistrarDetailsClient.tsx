"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2, MapPin, Calendar, Activity, ArrowLeft,
  Globe, Info, CheckCircle2, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getImageUrl } from "@/lib/utils";

interface IPO {
  id: number;
  issuer_company: string;
  listing_date?: string;
  exchange?: string;
  lot_size?: string;
  issue_size?: string;
  blog_slug?: string;
  logo?: string;
}

interface Registrar {
  id: number;
  name: string;
  image: string;
  slug: string;
  meta_title: string;
  meta_desc: string;
  meta_keywords: string;
  sme_ipo: string;
  mainboard_ipo: string;
  sme_ipo_parentage: string;
  mainboard_ipo_parentage: string;
  avgsubscription_sme: string;
  avgsubscription_mainboard: string;
  location: string;
  dic: string;
  registrar_year: string;
  latest_sme: string;
  latest_mainbord: string;
  latest_sme_ipos?: IPO[];
  latest_mainboard_ipos?: IPO[];
  faqs: string;
  status: string;
}

interface RegistrarDetailsClientProps {
  registrar: Registrar;
  faqs: { question: string; answer: string }[];
}

const formatDate = (dateStr: any) => {
  if (!dateStr || dateStr === "0") return "TBA";
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "TBA" : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return "TBA"; }
};

export default function RegistrarDetailsClient({ registrar, faqs }: RegistrarDetailsClientProps) {
  const [slug] = useState(registrar.slug);

  const renderIPOGrid = (ipos: IPO[] | undefined, title: string) => {
    if (!ipos || ipos.length === 0) return null;

    const scrollContainerId = `scroll-${title.replace(/\s+/g, '-').toLowerCase()}`;

    const scroll = (direction: 'left' | 'right') => {
      const container = document.getElementById(scrollContainerId);
      if (container) {
        const scrollAmount = 450;
        container.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
      }
    };

    return (
      <div className="mt-20 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black font-heading text-slate-800 mb-4 tracking-tight">
            {title}
          </h2>
          <div className="w-28 h-2 bg-[#f59e08] mx-auto rounded-full"></div>
        </div>
        
        <div className="group/scroll-section relative">
          {/* Navigation Buttons */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/90 border border-border shadow-xl rounded-full flex items-center justify-center text-[#001529] hover:bg-[#001529] hover:text-white transition-all -left-6 hidden md:flex cursor-pointer"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/90 border border-border shadow-xl rounded-full flex items-center justify-center text-[#001529] hover:bg-[#001529] hover:text-white transition-all -right-6 hidden md:flex cursor-pointer"
          >
            <ArrowLeft className="h-6 w-6 rotate-180" />
          </button>

          <div 
            id={scrollContainerId}
            className="flex gap-6 overflow-x-auto pb-10 pt-4 px-4 -mx-4 scrollbar-hide scroll-smooth"
          >
            {ipos.map((ipo) => (
              <motion.div
                key={ipo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-[2rem] p-6 md:p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all group/card overflow-hidden relative min-w-[300px] md:min-w-[340px] flex-shrink-0 bg-white"
              >
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-[#001529]/5 text-[#001529] text-[10px] font-black px-3 py-1 rounded-full border border-[#001529]/10 uppercase tracking-widest">
                    {ipo.exchange || "BSE, NSE"}
                  </span>
                </div>

                <div className="mb-6 mt-2">
                  <h3 className="text-lg md:text-xl font-black font-heading text-slate-800 group-hover/card:text-[#f59e08] transition-colors leading-snug">
                    {String(ipo.issuer_company).toLowerCase().includes('ipo') ? ipo.issuer_company : `${ipo.issuer_company} IPO`}
                  </h3>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between py-3 border-b border-border/50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Listing Date</span>
                    <span className="text-sm font-black text-slate-800">{formatDate(ipo.listing_date)}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border/50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lot Size</span>
                    <span className="text-sm font-black text-slate-800">{ipo.lot_size || 'TBA'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Issue Size</span>
                    <span className="text-base font-black text-[#001529] italic">₹{ipo.issue_size || '0'} Cr.</span>
                  </div>
                </div>

                <Button asChild className="w-full h-12 rounded-xl font-black bg-[#001529]/10 hover:bg-[#001529] text-[#001529] hover:text-white transition-all border-none text-sm cursor-pointer">
                  <Link href={ipo.blog_slug ? `/ipo-blogs/${ipo.blog_slug}` : `/ipo-registrar-list/${slug}`}>
                    View Details
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="absolute top-0 right-0 bottom-12 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none opacity-40 group-hover/scroll-section:opacity-0 transition-opacity"></div>
          <div className="absolute top-0 left-0 bottom-12 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none opacity-40 group-hover/scroll-section:opacity-0 transition-opacity"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pb-20">
        <div className="h-48 md:h-64 bg-[#001529] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#001529] to-[#003380]"></div>
          <div className="container mx-auto px-4 h-full flex items-end pb-8 relative z-10">
            <Link href="/ipo-registrar-list" className="mb-auto mt-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium">
              <ArrowLeft className="h-4 w-4" /> Back to list
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-12 relative z-20">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 md:p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="w-full max-w-[280px] aspect-square md:w-40 md:h-40 rounded-3xl bg-white border border-slate-200 shadow-inner p-4 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src={getImageUrl(registrar.image)}
                  alt={registrar.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-5xl font-black font-heading text-[#001529] mb-4 leading-tight">
                  {registrar.name}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-slate-500 font-medium">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#f59e08]" />
                    {registrar.location || "Head Office, India"}
                  </div>
                </div>
              </div>
              <div className="w-full md:w-auto">
                <Button asChild className="w-full md:w-auto bg-[#001529] hover:bg-[#002a52] text-white font-bold px-8 py-7 rounded-2xl shadow-lg text-lg border-0 cursor-pointer">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-12 mb-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
              >
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 font-heading">SME IPOs Serviced</p>
                <p className="text-4xl font-black text-[#001529] font-heading">{registrar.sme_ipo || '0'}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
              >
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 font-heading">Mainboard IPOs</p>
                <p className="text-4xl font-black text-orange-500 font-heading">{registrar.mainboard_ipo || '0'}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
              >
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 font-heading">SME Parentage</p>
                <p className="text-4xl font-black text-[#001529] font-heading">{registrar.sme_ipo_parentage && String(registrar.sme_ipo_parentage).includes('%') ? registrar.sme_ipo_parentage : (registrar.sme_ipo_parentage || '0') + '%'}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
              >
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 font-heading">Mainboard Parentage</p>
                <p className="text-4xl font-black text-[#001529] font-heading">{registrar.mainboard_ipo_parentage && String(registrar.mainboard_ipo_parentage).includes('%') ? registrar.mainboard_ipo_parentage : (registrar.mainboard_ipo_parentage || '0') + '%'}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm"
              >
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 font-heading">SME Avg. Subscription</p>
                <p className="text-4xl font-black text-blue-500 font-heading">{registrar.avgsubscription_sme && String(registrar.avgsubscription_sme).includes('x') ? registrar.avgsubscription_sme : (registrar.avgsubscription_sme || '0') + 'x'}</p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <div className="container mx-auto px-4">
            <div className="bg-[#001529] rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden text-center border border-white/5">
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black font-heading mb-8 tracking-tight">
                  {registrar.name} IPOs Assisted So Far
                </h2>
                <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 min-w-[200px]">
                    <p className="text-6xl font-black mb-2">{Number(registrar.mainboard_ipo || 0) + Number(registrar.sme_ipo || 0)}</p>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">Total IPOs Processed</p>
                  </div>
                  <div className="flex gap-8">
                    <div className="text-center">
                      <p className="text-4xl font-black mb-1 text-[#f59e08]">{registrar.mainboard_ipo || '0'}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Mainboard IPOs</p>
                    </div>
                    <div className="w-px h-12 bg-white/20"></div>
                    <div className="text-center">
                      <p className="text-4xl font-black mb-1 text-emerald-400">{registrar.sme_ipo || '0'}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">SME IPOs</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-3xl font-bold font-heading text-[#001529] mb-6 flex items-center gap-3">
                <Info className="h-7 w-7 text-[#001529]" />
                About {registrar.name}
              </h2>
              <div
                className="prose prose-lg max-w-none text-slate-600 leading-relaxed registrar-description text-sm"
                dangerouslySetInnerHTML={{
                  __html: registrar.dic || `<p>Information about ${registrar.name} is currently being updated by our research team.</p>`
                }}
              />
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#001529] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-white/5">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Building2 className="h-32 w-32" />
              </div>
              <h3 className="text-xl font-bold mb-6 relative z-10 text-[#f59e08]">Registry Services</h3>
              <ul className="space-y-4 relative z-10 opacity-90 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-[#f59e08]" />
                  <span>IPO Application Processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-[#f59e08]" />
                  <span>Basis of Allotment Finalization</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-[#f59e08]" />
                  <span>Refund & Share Credit</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-[#f59e08]" />
                  <span>Dividend Disbursal</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <section className="mb-24">
          <div className="container mx-auto px-4">
            {renderIPOGrid(registrar.latest_sme_ipos, "Latest SME IPOs")}
            {renderIPOGrid(registrar.latest_mainboard_ipos, "Latest Mainboard IPOs")}
          </div>
        </section>

        {faqs.length > 0 && (
          <section className="mb-24">
            <div className="container mx-auto px-4 max-w-5xl">
              <h2 className="text-3xl md:text-4xl font-black font-heading text-slate-800 mb-8 flex items-center gap-4">
                <HelpCircle className="h-8 w-8 text-[#001529]" />
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                    <AccordionTrigger className="px-6 py-5 hover:no-underline font-black text-[#001529] hover:bg-slate-50 transition-colors text-left text-base cursor-pointer">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-5 text-slate-500 leading-relaxed pb-8 text-sm">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
