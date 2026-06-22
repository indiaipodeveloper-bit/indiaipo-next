"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  MapPin,
  TrendingUp,
  ArrowRight,
  Shield,
  Building2,
  Phone,
  Users,
  Globe,
  MessageSquare,
  Mail,
  X,
  ChevronRight,
  BarChart3,
  PieChart,
  LineChart,
  Home,
  Award,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
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
  meta_title: string;
  meta_desc: string;
  meta_keywords: string;
  noOfiposofar: string;
  ipos: string;
  totalfundraised: string;
  avgiposize: string;
  avglisting_gain: string;
  avgsubscription: string;
  faqs: string;
  nseemer: string;
  bsesme: string;
  yearwise_ipolisting: string;
  sme_ipos_by_size: string;
  sme_ipos_by_subscription: string;
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
  avg_listing_gain?: string | number;
}

const safeParseJSON = (str: string) => {
  if (!str) return [];
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
};

const N = "#001529";
const G = "#f59e08";
const G2 = "#d97706";

const Accordion = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full divide-y divide-slate-100">{children}</div>;
};

const AccordionItem = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={className}>{children}</div>;
};

const AccordionTrigger = ({
  children,
  isOpen,
  onClick,
  className,
  style,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between py-4 text-left font-medium transition-all cursor-pointer ${className}`}
      style={style}
    >
      {children}
      <ChevronDown
        className="h-4 w-4 shrink-0 transition-transform duration-200"
        style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
      />
    </button>
  );
};

const AccordionContent = ({
  children,
  isOpen,
  className,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
}) => {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className={className}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ConnectModal = ({
  banker,
  onClose,
}: {
  banker: Banker;
  onClose: () => void;
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
          Connect with {banker.title} through <strong style={{ color: "#f59e08" }}>India IPO</strong>
        </h2>
        <div className="text-white/50 font-bold text-lg my-1">&</div>
        <p className="font-extrabold text-sm uppercase tracking-wide animate-pulse" style={{ color: G }}>
          Save upto 20% on IPO Listing Expenses.
        </p>
      </div>
      <div className="p-8">
        <div className="pt-2">
          <Link
            href={`/merchant-contact?ipo_type=${
              banker.mcat_id === "list-of-sme-merchant-bankers" || banker.mcat_id === "SME"
                ? "SME IPO"
                : "Mainboard IPO"
            }&banker=${encodeURIComponent(banker.title)}`}
            className="block"
          >
            <button
              className="w-full h-12 rounded-xl font-black transition-all hover:scale-105 shadow-lg text-sm cursor-pointer text-white"
              style={{
                background: `linear-gradient(135deg, ${G}, ${G2})`,
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

export default function MerchantBankerDetailClient({
  banker,
  relatedBankers,
}: {
  banker: Banker;
  relatedBankers: Banker[];
}) {
  const [connectBanker, setConnectBanker] = useState<Banker | null>(null);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const router = useRouter();

  const isMainboardCategory = banker.mcat_id === "list-of-mainboard-merchant-bankers" || banker.mcat_id === "Mainboard";

  const yearwise = safeParseJSON(banker.yearwise_ipolisting);
  const sizeData = safeParseJSON(banker.sme_ipos_by_size);
  const subData = safeParseJSON(banker.sme_ipos_by_subscription);
  const faqsData = safeParseJSON(banker.faqs);

  const hasDesc = banker.description && banker.description.trim().length > 10;
  const imgSrc = getImageUrl(banker.image || banker.logo_url);
  const webUrl = (w: string | undefined) =>
    !w ? "#" : w.startsWith("http") ? w : `https://${w}`;

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  const SecHdr = ({ icon: Icon, label }: { icon: any; label: string }) => (
    <div className="flex items-center gap-3 px-5 py-4" style={{ background: N }}>
      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
        <Icon className="w-4 h-4" style={{ color: G }} />
      </div>
      <h3 className="font-black text-sm uppercase tracking-widest text-white">{label}</h3>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <style>{`
        .bd p { margin-bottom: 1rem; color: #475569; line-height: 1.8; font-size: .95rem; font-weight: 500; }
        .bd h2, .bd h3, .bd h4 { color: #001529; font-weight: 900; margin: 1.2rem 0 .5rem; }
        .bd h2 { font-size: 1.3rem; border-bottom: 2px solid #f59e08; padding-bottom: .4rem; }
        .bd ul { list-style: none; padding: 0; margin: .8rem 0; }
        .bd ul li { display: flex; align-items: flex-start; gap: .5rem; margin-bottom: .4rem; color: #475569; font-size: .9rem; }
        .bd ul li::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #f59e08; flex-shrink: 0; margin-top: .4rem; }
        .bd table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
        .bd th { background: #001529; color: #f59e08; padding: .5rem 1rem; text-align: left; font-size: .8rem; font-weight: 800; }
        .bd td { border: 1px solid #e2e8f0; padding: .5rem 1rem; color: #475569; font-size: .85rem; }
        .bd a { color: #001529; text-decoration: underline; text-decoration-color: #f59e08; font-weight: 600; }
        .bd strong, .bd b { color: #001529; font-weight: 700; }
        .bd img { max-width: 100%; border-radius: 1rem; margin: 1rem 0; box-shadow: 0 4px 20px rgba(0,0,0,.1); }
      `}</style>

      <Header />
      <main className="flex-1">
        <div
          className="pt-6 md:pt-12 pb-28 px-4 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${N} 0%, #002147 55%, #003380 100%)` }}
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ background: `linear-gradient(90deg, ${N}, ${G}, ${N})` }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-8 text-xs text-white/60 font-bold justify-start">
              <Link href="/" className="hover:text-white flex items-center gap-1.5 transition-colors">
                <Home className="h-3.5 w-3.5 text-[#f59e08]" /> Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-white/20" />
              <Link
                href={
                  isMainboardCategory
                    ? "/merchant-bankers/list-of-mainboard-merchant-bankers"
                    : "/merchant-bankers/list-of-sme-merchant-bankers"
                }
                className="hover:text-white transition-colors"
              >
                Merchant Bankers
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-white/20" />
              <span className="text-white/80 transition-colors">
                {isMainboardCategory ? "Mainboard" : "SME"}
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-white/20" />
              <span className="text-white truncate max-w-[200px] sm:max-w-[400px]">
                {banker.title}
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="w-full max-w-[320px] aspect-square md:w-44 md:h-44 rounded-2xl bg-white flex items-center justify-center p-3 shadow-2xl shrink-0 border-4 border-white/10 overflow-hidden">
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={banker.title}
                    className="w-full h-full object-contain p-2"
                    onError={(e: any) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-5xl font-black" style={{ color: N }}>
                    {banker.title?.[0]}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <div
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-4 text-xs font-black uppercase tracking-widest"
                  style={{
                    background: "rgba(245,158,8,0.2)",
                    color: G,
                    border: "1px solid rgba(245,158,8,0.35)",
                  }}
                >
                  <Shield className="h-3.5 w-3.5" /> Expert Merchant Banker
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight">
                  {banker.title}
                </h1>
                {banker.sub_title && (
                  <p className="text-white/65 text-base font-semibold mb-5">{banker.sub_title}</p>
                )}
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => setConnectBanker(banker)}
                    className="flex items-center gap-2 px-6 h-11 rounded-xl font-black text-sm transition-all hover:scale-105 shadow-lg cursor-pointer text-white"
                    style={{
                      background: `linear-gradient(135deg, ${G}, ${G2})`,
                    }}
                  >
                    <Mail className="w-4 h-4" /> Connect Now
                  </button>
                  {(banker.cweblink || banker.website) && (
                    <a
                      href={webUrl(banker.cweblink || banker.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 h-11 rounded-xl font-black text-sm text-white border border-white/25 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <Globe className="w-4 h-4" /> Visit Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-14 relative z-20 pb-20">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 mb-8 overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {[
                {
                  label: "Total IPOs",
                  value: banker.noOfiposofar || banker.total_ipos || "—",
                },
                {
                  label: "Total Fund Raised(CR)",
                  value: formatIndianNumber(banker.totalfundraised || banker.total_raised) || "—",
                },
                {
                  label: "Avg IPO Size(CR)",
                  value: formatIndianNumber(banker.avgiposize || banker.avg_size) || "—",
                },
                {
                  label: "Avg Subscription",
                  value: banker.avgsubscription
                    ? `${banker.avgsubscription}x`
                    : banker.avg_subscription
                    ? `${banker.avg_subscription}x`
                    : "—",
                },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center text-center py-6 px-4">
                  <p
                    className="text-3xl md:text-4xl font-black mb-1"
                    style={{ color: i % 2 === 0 ? N : G2 }}
                  >
                    {s.value}
                  </p>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {hasDesc && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-none">
                  <SecHdr icon={Building2} label="About this Merchant Banker" />
                  <div className="p-6 bd" dangerouslySetInnerHTML={{ __html: banker.description }} />
                </div>
              )}

              {(banker.nseemer || banker.bsesme) && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-none">
                  <SecHdr icon={Building2} label="IPO Listing by Exchange" />
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className="rounded-xl p-6 text-center"
                        style={{
                          background: "rgba(0,21,41,0.05)",
                          border: "1px solid rgba(0,21,41,0.1)",
                        }}
                      >
                        <p className="text-4xl font-black mb-1" style={{ color: N }}>
                          {banker.nseemer || "—"}
                        </p>
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-1">
                          NSE Emerge
                        </p>
                      </div>
                      <div
                        className="rounded-xl p-6 text-center"
                        style={{
                          background: "rgba(245,158,8,0.08)",
                          border: "1px solid rgba(245,158,8,0.2)",
                        }}
                      >
                        <p className="text-4xl font-black mb-1" style={{ color: G2 }}>
                          {banker.bsesme || "—"}
                        </p>
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-1">
                          BSE SME
                        </p>
                      </div>
                    </div>
                    {banker.avglisting_gain && (
                      <div
                        className="mt-4 p-4 rounded-xl text-center"
                        style={{
                          background: "rgba(34,197,94,0.08)",
                          border: "1px solid rgba(34,197,94,0.2)",
                        }}
                      >
                        <p className="text-2xl font-black" style={{ color: "#16a34a" }}>
                          {banker.avglisting_gain}
                        </p>
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-1">
                          Avg Listing Gain
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {yearwise.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-none">
                  <SecHdr icon={LineChart} label="Year-wise IPO Listing" />
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ background: "#F8FAFC" }}>
                          <th className="px-5 py-4 text-left text-sm font-black uppercase tracking-widest text-slate-500">
                            Year
                          </th>
                          <th className="px-5 py-4 text-center text-sm font-black uppercase tracking-widest text-slate-500">
                            IPOs
                          </th>
                          {yearwise[0]?.amount !== undefined && (
                            <th className="px-5 py-4 text-right text-sm font-black uppercase tracking-widest text-slate-500">
                              Amount
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {yearwise.map((item: any, idx: number) => (
                          <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}>
                            <td className="px-5 py-4 font-black text-base" style={{ color: N }}>
                              {item.year || item.label || `Year ${idx + 1}`}
                            </td>
                            <td className="px-5 py-4 text-center">
                              <span
                                className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-black"
                                style={{ background: "rgba(245,158,8,0.12)", color: G2 }}
                              >
                                {item.count ||
                                  item.value ||
                                  item.ipos ||
                                  item.no_of_ipos ||
                                  0}{" "}
                                IPOs
                              </span>
                            </td>
                            {item.amount !== undefined && (
                              <td className="px-5 py-4 text-right font-bold text-base text-slate-600">
                                {item.amount}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {subData.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-none">
                  <SecHdr icon={PieChart} label="IPOs by Subscription Rate" />
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ background: "#F8FAFC" }}>
                          <th className="px-5 py-4 text-left text-sm font-black uppercase tracking-widest text-slate-500">
                            Category
                          </th>
                          <th className="px-5 py-4 text-right text-sm font-black uppercase tracking-widest text-slate-500">
                            Count / Rate
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {subData.map((item: any, idx: number) => {
                          const colors = [N, G2, "#0369a1", "#15803d", "#7c3aed", "#dc2626"];
                          return (
                            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}>
                              <td className="px-5 py-4 font-semibold text-base text-slate-700">
                                {item.title || item.category || item.label || `Category ${idx + 1}`}
                              </td>
                              <td className="px-5 py-4 text-right">
                                <span
                                  className="font-black text-base"
                                  style={{ color: colors[idx % colors.length] }}
                                >
                                  {item.subscription || item.count || item.value || "—"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {sizeData.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-none">
                  <SecHdr icon={BarChart3} label="IPOs by Size Category" />
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ background: "#F8FAFC" }}>
                          <th className="px-5 py-4 text-left text-sm font-black uppercase tracking-widest text-slate-500">
                            Size Range
                          </th>
                          <th className="px-5 py-4 text-right text-sm font-black uppercase tracking-widest text-slate-500">
                            No. of IPOs
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sizeData.map((item: any, idx: number) => (
                          <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}>
                            <td className="px-5 py-4 font-semibold text-base text-slate-700">
                              {item.title || item.label || item.category || `Range ${idx + 1}`}
                            </td>
                            <td className="px-5 py-4 text-right">
                              <span className="font-black text-base" style={{ color: N }}>
                                {item.size || item.count || item.value || "—"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {faqsData.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-none">
                  <SecHdr icon={MessageSquare} label="Frequently Asked Questions" />
                  <div className="p-2">
                    <Accordion>
                      {faqsData.map((faq: any, idx: number) => {
                        const isOpen = openFaqIdx === idx;
                        return (
                          <AccordionItem key={idx} className="border-b border-slate-100 last:border-0">
                            <AccordionTrigger
                              isOpen={isOpen}
                              onClick={() => toggleFaq(idx)}
                              className="px-4 py-4 text-left font-black text-sm hover:text-[#f59e08] transition-colors"
                              style={{ color: N }}
                            >
                              {faq.question || faq.q || "Question?"}
                            </AccordionTrigger>
                            <AccordionContent isOpen={isOpen} className="px-4 pb-4 text-slate-500 text-sm leading-relaxed font-medium">
                              {faq.answer || faq.a || "Answer goes here."}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </div>
                </div>
              )}

              {relatedBankers.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6 animate-none">
                  <SecHdr icon={Users} label="Top Merchant Bankers" />
                  <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedBankers.map((rb) => (
                      <Link
                        key={rb.id}
                        href={`/merchant-banker/${rb.slug}`}
                        className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                          {rb.logo_url || rb.image ? (
                            <img
                              src={getImageUrl(rb.logo_url || rb.image)}
                              alt={rb.title || rb.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Building2 className="w-6 h-6 text-slate-200" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-base text-[#001529] group-hover:text-primary transition-colors truncate">
                            {rb.title || rb.name}
                          </p>
                          <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-0.5">
                            View Profile <ChevronRight className="inline-block w-4 h-4" />
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-24 animate-none">
                <div
                  className="h-1.5 w-full"
                  style={{ background: `linear-gradient(90deg, ${N}, ${G})` }}
                />
                <div className="p-6">
                  <h3 className="font-black text-base mb-5" style={{ color: N }}>
                    Contact Details
                  </h3>
                  <div className="space-y-4">
                    {(banker.cemail || banker.email) && (
                      <a href={`mailto:${banker.cemail || banker.email}`} className="flex items-center gap-3 group">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: "rgba(0,21,41,0.06)" }}
                        >
                          <Mail className="h-4 w-4" style={{ color: N }} />
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-widest text-slate-400 mb-0.5">Email</p>
                          <p className="text-base font-semibold break-all group-hover:text-[#f59e08] transition-colors" style={{ color: N }}>
                            {banker.cemail || banker.email}
                          </p>
                        </div>
                      </a>
                    )}
                    {(banker.cmobile || banker.phone) && (
                      <a href={`tel:${banker.cmobile || banker.phone}`} className="flex items-center gap-3 group">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: "rgba(245,158,8,0.08)" }}
                        >
                          <Phone className="h-4 w-4" style={{ color: G2 }} />
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-widest text-slate-400 mb-0.5">Phone</p>
                          <p className="text-base font-semibold group-hover:text-[#f59e08] transition-colors" style={{ color: N }}>
                            {banker.cmobile || banker.phone}
                          </p>
                        </div>
                      </a>
                    )}
                    {(banker.caddress || banker.location) && (
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: "rgba(0,21,41,0.06)" }}
                        >
                          <MapPin className="h-4 w-4" style={{ color: N }} />
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-widest text-slate-400 mb-0.5">Address</p>
                          <p className="text-base font-medium text-slate-600 leading-relaxed">
                            {banker.caddress || banker.location}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setConnectBanker(banker)}
                    className="flex items-center justify-center gap-2 w-full h-12 rounded-xl font-black text-sm mt-6 transition-all hover:scale-105 cursor-pointer text-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${N}, #003380)`,
                      boxShadow: "0 4px 16px rgba(0,21,41,0.3)",
                    }}
                  >
                    <Mail className="h-4 w-4" /> Send Enquiry
                  </button>
                </div>

                <div className="border-t border-slate-100 p-6">
                  <p className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">
                    Quick Summary
                  </p>
                  <div className="space-y-3">
                    {[
                      { label: "Total IPOs", val: banker.noOfiposofar || banker.total_ipos },
                      {
                        label: "Fund Raised",
                        val: formatIndianNumber(banker.totalfundraised || banker.total_raised),
                      },
                      {
                        label: "Avg IPO Size",
                        val: formatIndianNumber(banker.avgiposize || banker.avg_size),
                      },
                      { label: "Avg Subscription", val: banker.avgsubscription || banker.avg_subscription },
                      { label: "Avg Listing Gain", val: banker.avglisting_gain || banker.avg_listing_gain },
                      { label: "NSE Emerge", val: banker.nseemer },
                      { label: "BSE SME", val: banker.bsesme },
                    ]
                      .filter((s) => s.val && String(s.val).trim() && String(s.val) !== "0")
                      .map((s, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-400">{s.label}</span>
                          <span className="text-sm font-black" style={{ color: N }}>
                            {s.val}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-6 relative overflow-hidden bg-[#001529] animate-none">
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
                  style={{
                    background: G,
                    filter: "blur(30px)",
                    transform: "translate(30%,-30%)",
                  }}
                />
                <Award className="h-10 w-10 mb-4" style={{ color: G }} />
                <h4 className="font-black text-white text-lg mb-2">Planning Your IPO?</h4>
                <p className="text-white/65 text-sm mb-6 leading-relaxed">
                  Connect with top expert merchant bankers for a seamless IPO journey.
                </p>
                <Link
                  href="/ipo-eligibility-check"
                  className="flex items-center justify-center gap-2 w-full h-11 rounded-xl font-black text-sm transition-all hover:scale-105 text-[#001529] font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${G}, ${G2})`,
                  }}
                >
                  Check Your IPO Eligibility <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {connectBanker && <ConnectModal banker={connectBanker} onClose={() => setConnectBanker(null)} />}
      </AnimatePresence>
      <Footer />
    </div>
  );
}
