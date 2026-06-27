"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Mail,
  GitCompare,
  TrendingUp,
  Users,
  BarChart3,
  LineChart,
  PieChart,
  Star,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { getImageUrl, formatIndianNumber } from "@/lib/utils";

interface Banker {
  id: string | number;
  title: string;
  slug?: string;
  sub_title?: string;
  image?: string;
  logo_url?: string;
  noOfiposofar?: string;
  totalfundraised?: string;
  avgiposize?: string;
  avgsubscription?: string;
  avglisting_gain?: string;
  nseemer?: string;
  bsesme?: string;
  cemail?: string;
  cmobile?: string;
  caddress?: string;
  cweblink?: string;
  yearwise_ipolisting?: string;
  sme_ipos_by_size?: string;
  sme_ipos_by_subscription?: string;
  ipos?: string;
  total_ipos?: string | number;
  total_raised?: string | number;
  avg_size?: string | number;
  avg_subscription?: string | number;
  avg_listing_gain?: string | number;
  website?: string;
  location?: string;
  email?: string;
  phone?: string;
}

const N = "#001529";
const G = "#f59e08";
const G2 = "#d97706";
const colorA = "#10b981";
const colorB = "#3b82f6";

const safeJSON = (s?: string) => {
  try {
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
};

const v = (val: any) =>
  val !== undefined && val !== null && String(val).trim() !== "" && String(val) !== "0"
    ? String(val)
    : "—";

const Row = ({
  label,
  va,
  vb,
  hi,
  isLong,
}: {
  label: string;
  va: string;
  vb: string;
  hi?: boolean;
  isLong?: boolean;
}) => {
  const diff = va !== vb && va !== "—" && vb !== "—";
  return (
    <div
      className={`border-b border-slate-100 last:border-0 ${
        hi ? "bg-amber-50/40" : "bg-white"
      } transition-all hover:bg-slate-50/80`}
    >
      <div className="px-4 py-2 border-b border-slate-100" style={{ background: "rgba(0,21,41,0.02)" }}>
        <p className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">
          {label}
        </p>
      </div>
      <div className="grid grid-cols-2 divide-x divide-slate-100">
        <div className="px-3 md:px-6 py-4 md:py-8 flex flex-col items-center justify-center text-center">
          <span
            className={`${
              isLong ? "text-xs md:text-base font-semibold" : "text-base md:text-2xl font-black"
            } leading-relaxed break-all md:break-normal ${diff ? "text-emerald-600" : "text-slate-700"}`}
          >
            {va}
          </span>
        </div>
        <div className="px-3 md:px-6 py-4 md:py-8 flex flex-col items-center justify-center text-center">
          <span
            className={`${
              isLong ? "text-xs md:text-base font-semibold" : "text-base md:text-2xl font-black"
            } leading-relaxed break-all md:break-normal ${diff ? "text-blue-600" : "text-slate-700"}`}
          >
            {vb}
          </span>
        </div>
      </div>
    </div>
  );
};

const BkCard = ({ bk, color, label }: { bk: Banker; color: string; label: string }) => {
  const img = getImageUrl(bk.image || bk.logo_url);
  return (
    <div className="flex flex-col items-center gap-4 p-6 w-full">
      <span
        className="text-[12px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-sm"
        style={{ color, borderColor: `${color}40`, background: `${color}15` }}
      >
        {label}
      </span>
      <div className="w-24 h-24 rounded-2xl bg-white border border-white/20 flex items-center justify-center p-3 shadow-2xl overflow-hidden transition-transform">
        {img ? (
          <img
            src={img}
            alt={bk.title}
            className="w-full h-full object-contain"
            onError={(e: any) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <span className="text-4xl font-black" style={{ color: N }}>
            {bk.title?.[0]}
          </span>
        )}
      </div>
      <div className="text-center">
        <p className="text-white font-black text-lg md:text-xl leading-tight line-clamp-2 mb-1">
          {bk.title}
        </p>
        {bk.sub_title && <p className="text-white/60 text-sm font-medium line-clamp-1">{bk.sub_title}</p>}
      </div>
    </div>
  );
};

const Sec = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <div className="flex items-center gap-3 px-4 py-3" style={{ background: N }}>
    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
      <Icon className="w-3.5 h-3.5" style={{ color: G }} />
    </div>
    <h3 className="font-black text-sm uppercase tracking-widest text-white">{label}</h3>
  </div>
);

export default function MerchantBankerCompareClient({
  a,
  b,
  type,
}: {
  a: Banker;
  b: Banker;
  type: string;
}) {
  const router = useRouter();

  const isMainboard = type === "mainboard";
  const backUrl = isMainboard
    ? "/merchant-bankers/list-of-mainboard-merchant-bankers"
    : "/merchant-bankers/list-of-sme-merchant-bankers";

  const yearA = safeJSON(a.yearwise_ipolisting);
  const yearB = safeJSON(b.yearwise_ipolisting);
  const sizeA = safeJSON(a.sme_ipos_by_size);
  const sizeB = safeJSON(b.sme_ipos_by_size);
  const subA = safeJSON(a.sme_ipos_by_subscription);
  const subB = safeJSON(b.sme_ipos_by_subscription);
  const iposA = safeJSON(a.ipos);
  const iposB = safeJSON(b.ipos);

  const allYears = Array.from(
    new Set([...yearA.map((y: any) => y.year || y.label), ...yearB.map((y: any) => y.year || y.label)])
  )
    .sort()
    .reverse();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <main className="flex-1 pb-20">
        <section
          className="relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${N} 0%, #002147 60%, #003380 100%)` }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5"
              style={{ background: G, filter: "blur(60px)", transform: "translate(30%,-30%)" }}
            />
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5"
            style={{ background: `linear-gradient(90deg, ${N}, ${G}, ${N})` }}
          />

          <div className="container mx-auto px-4 pt-8 pb-12 relative z-10">
            <button
              onClick={() => router.push(backUrl)}
              className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors text-sm font-black group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full border border-white/25 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/50 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </div>
              Back to Directory
            </button>

            <div className="flex items-center justify-center gap-3 mb-12">
              <div className="w-12 h-0.5 rounded-full bg-gradient-to-r from-transparent to-amber-500/50" />
              <GitCompare className="w-6 h-6" style={{ color: G }} />
              <h1 className="text-xl md:text-3xl font-black text-white tracking-tight">
                Merchant Banker Comparison
              </h1>
              <div className="w-12 h-0.5 rounded-full bg-gradient-to-l from-transparent to-amber-500/50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_60px_1fr] items-center gap-4 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md group"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <BkCard bk={a} color={colorA} label="Merchant Banker A" />
              </motion.div>

              <div className="flex items-center justify-center py-4">
                <div className="w-14 h-14 rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-xl flex items-center justify-center shadow-2xl relative">
                  <div className="absolute inset-0 rounded-full animate-pulse bg-amber-500/10" />
                  <span className="text-white font-black text-sm relative z-10">VS</span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md group"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <BkCard bk={b} color={colorB} label="Merchant Banker B" />
              </motion.div>
            </div>
          </div>
        </section>

        <div className="sticky top-0 z-20 shadow-2xl">
          <div className="grid grid-cols-2 h-12 md:h-16">
            <div
              className="px-2 md:px-6 flex items-center justify-center text-center font-black text-[10px] md:text-lg text-white truncate shadow-[inset_-4px_0_12px_rgba(0,0,0,0.1)]"
              style={{ background: colorA }}
            >
              {a.title}
            </div>
            <div
              className="px-2 md:px-6 flex items-center justify-center text-center font-black text-[10px] md:text-lg text-white truncate"
              style={{ background: colorB }}
            >
              {b.title}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 mt-12 space-y-12">
          {/* Key Stats */}
          <div className="rounded-3xl border border-slate-200 shadow-2xl overflow-hidden bg-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[80px] pointer-events-none" />
            <Sec icon={TrendingUp} label="Key Performance Stats" />
            <Row
              label="Total IPOs"
              va={v(a.noOfiposofar || a.total_ipos)}
              vb={v(b.noOfiposofar || b.total_ipos)}
              hi
            />
            <Row
              label="Total Fund Raised (Cr)"
              va={formatIndianNumber(a.totalfundraised || a.total_raised) || "—"}
              vb={formatIndianNumber(b.totalfundraised || b.total_raised) || "—"}
            />
            <Row
              label="Avg IPO Size (Cr)"
              va={formatIndianNumber(a.avgiposize || a.avg_size) || "—"}
              vb={formatIndianNumber(b.avgiposize || b.avg_size) || "—"}
              hi
            />
            <Row
              label="Avg Subscription"
              va={a.avgsubscription ? `${a.avgsubscription}x` : a.avg_subscription ? `${a.avg_subscription}x` : "—"}
              vb={b.avgsubscription ? `${b.avgsubscription}x` : b.avg_subscription ? `${b.avg_subscription}x` : "—"}
            />
            <Row
              label="Avg Listing Gain"
              va={v(a.avglisting_gain || a.avg_listing_gain)}
              vb={v(b.avglisting_gain || b.avg_listing_gain)}
              hi
            />
          </div>

          {/* Exchange */}
          <div className="rounded-3xl border border-slate-200 shadow-2xl overflow-hidden bg-white relative">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 blur-[80px] pointer-events-none" />
            <Sec icon={BarChart3} label="Exchange-wise Listing" />
            <Row label="NSE Emerge IPOs" va={v(a.nseemer)} vb={v(b.nseemer)} hi />
            <Row label="BSE SME IPOs" va={v(a.bsesme)} vb={v(b.bsesme)} />
          </div>

          {/* Year-wise Listing */}
          {allYears.length > 0 && (
            <div className="rounded-3xl border border-slate-200 shadow-2xl overflow-hidden bg-white">
              <Sec icon={LineChart} label="Year-wise IPO Listing" />
              <div
                className="grid grid-cols-[1fr_80px_1fr] md:grid-cols-[1fr_120px_1fr] border-b border-slate-100"
                style={{ background: "rgba(0,21,41,0.03)" }}
              >
                <div
                  className="px-2 md:px-6 py-3 md:py-5 text-[10px] md:text-sm font-black text-center truncate"
                  style={{ color: colorA }}
                >
                  {a.title}
                </div>
                <div className="px-1 md:px-2 py-3 md:py-5 text-[10px] md:text-sm font-black text-center text-slate-400 border-x border-slate-100">
                  Year
                </div>
                <div
                  className="px-2 md:px-6 py-3 md:py-5 text-[10px] md:text-sm font-black text-center truncate"
                  style={{ color: colorB }}
                >
                  {b.title}
                </div>
              </div>
              {allYears.map((yr: any, idx) => {
                const ra = yearA.find((y: any) => (y.year || y.label) === yr);
                const rb = yearB.find((y: any) => (y.year || y.label) === yr);
                const ca = ra ? ra.count || ra.value || ra.ipos || ra.no_of_ipos || 0 : "—";
                const cb = rb ? rb.count || rb.value || rb.ipos || rb.no_of_ipos || 0 : "—";
                return (
                  <div
                    key={yr}
                    className={`grid grid-cols-[1fr_80px_1fr] md:grid-cols-[1fr_120px_1fr] border-b border-slate-100 last:border-0 ${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                    }`}
                  >
                    <div
                      className="px-2 md:px-6 py-4 md:py-8 text-sm md:text-2xl font-black text-center"
                      style={{ color: colorA }}
                    >
                      {ca !== "—" ? `${ca} IPOs` : "—"}
                    </div>
                    <div className="px-1 md:px-2 py-4 md:py-8 text-[10px] md:text-lg font-bold text-center text-slate-500 border-x border-slate-100">
                      {yr}
                    </div>
                    <div
                      className="px-2 md:px-6 py-4 md:py-8 text-sm md:text-2xl font-black text-center"
                      style={{ color: colorB }}
                    >
                      {cb !== "—" ? `${cb} IPOs` : "—"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* By Size */}
          {Math.max(sizeA.length, sizeB.length) > 0 && (
            <div className="rounded-3xl border border-slate-200 shadow-2xl overflow-hidden bg-white">
              <Sec icon={BarChart3} label="IPOs by Size Category" />
              <div
                className="grid grid-cols-[1fr_100px_1fr] md:grid-cols-[1fr_140px_1fr] border-b border-slate-100"
                style={{ background: "rgba(0,21,41,0.03)" }}
              >
                <div
                  className="px-2 md:px-6 py-3 md:py-5 text-[10px] md:text-sm font-black text-center truncate"
                  style={{ color: colorA }}
                >
                  {a.title}
                </div>
                <div className="px-1 md:px-2 py-3 md:py-5 text-[10px] md:text-sm font-black text-center text-slate-400 border-x border-slate-100">
                  Range
                </div>
                <div
                  className="px-2 md:px-6 py-3 md:py-5 text-[10px] md:text-sm font-black text-center truncate"
                  style={{ color: colorB }}
                >
                  {b.title}
                </div>
              </div>
              {Array.from({ length: Math.max(sizeA.length, sizeB.length) }).map((_, idx) => {
                const ra = sizeA[idx];
                const rb = sizeB[idx];
                const lbl = (ra || rb)?.title || (ra || rb)?.label || (ra || rb)?.category || `R${idx + 1}`;
                return (
                  <div
                    key={idx}
                    className={`grid grid-cols-[1fr_100px_1fr] md:grid-cols-[1fr_140px_1fr] border-b border-slate-100 last:border-0 ${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                    }`}
                  >
                    <div
                      className="px-2 md:px-6 py-4 md:py-8 text-sm md:text-2xl font-black text-center"
                      style={{ color: colorA }}
                    >
                      {ra ? ra.size || ra.count || ra.value || "—" : "—"}
                    </div>
                    <div className="px-1 md:px-2 py-4 md:py-8 text-[10px] md:text-sm font-bold text-center text-slate-500 border-x border-slate-100 leading-tight">
                      {lbl}
                    </div>
                    <div
                      className="px-2 md:px-6 py-4 md:py-8 text-sm md:text-2xl font-black text-center"
                      style={{ color: colorB }}
                    >
                      {rb ? rb.size || rb.count || rb.value || "—" : "—"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* By Subscription */}
          {Math.max(subA.length, subB.length) > 0 && (
            <div className="rounded-3xl border border-slate-200 shadow-2xl overflow-hidden bg-white">
              <Sec icon={PieChart} label="IPOs by Subscription Rate" />
              <div
                className="grid grid-cols-[1fr_100px_1fr] md:grid-cols-[1fr_140px_1fr] border-b border-slate-100"
                style={{ background: "rgba(0,21,41,0.03)" }}
              >
                <div
                  className="px-2 md:px-6 py-3 md:py-5 text-[10px] md:text-sm font-black text-center truncate"
                  style={{ color: colorA }}
                >
                  {a.title}
                </div>
                <div className="px-1 md:px-2 py-3 md:py-5 text-[10px] md:text-sm font-black text-center text-slate-400 border-x border-slate-100">
                  Category
                </div>
                <div
                  className="px-2 md:px-6 py-3 md:py-5 text-[10px] md:text-sm font-black text-center truncate"
                  style={{ color: colorB }}
                >
                  {b.title}
                </div>
              </div>
              {Array.from({ length: Math.max(subA.length, subB.length) }).map((_, idx) => {
                const ra = subA[idx];
                const rb = subB[idx];
                const lbl = (ra || rb)?.title || (ra || rb)?.category || (ra || rb)?.label || `C${idx + 1}`;
                return (
                  <div
                    key={idx}
                    className={`grid grid-cols-[1fr_100px_1fr] md:grid-cols-[1fr_140px_1fr] border-b border-slate-100 last:border-0 ${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                    }`}
                  >
                    <div
                      className="px-2 md:px-6 py-4 md:py-8 text-sm md:text-2xl font-black text-center"
                      style={{ color: colorA }}
                    >
                      {ra ? ra.subscription || ra.count || ra.value || "—" : "—"}
                    </div>
                    <div className="px-1 md:px-2 py-4 md:py-8 text-[10px] md:text-sm font-bold text-center text-slate-500 border-x border-slate-100 leading-tight">
                      {lbl}
                    </div>
                    <div
                      className="px-2 md:px-6 py-4 md:py-8 text-sm md:text-2xl font-black text-center"
                      style={{ color: colorB }}
                    >
                      {rb ? rb.subscription || rb.count || rb.value || "—" : "—"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Notable IPOs */}
          {Math.max(iposA.length, iposB.length) > 0 && (
            <div className="rounded-3xl border border-slate-200 shadow-2xl overflow-hidden bg-white">
              <Sec icon={Star} label="Notable IPOs Managed" />
              <div
                className="grid grid-cols-2 border-b border-slate-100"
                style={{ background: "rgba(0,21,41,0.03)" }}
              >
                <div
                  className="px-2 md:px-6 py-3 md:py-5 text-[10px] md:text-sm font-black text-center truncate border-r border-slate-100"
                  style={{ color: colorA }}
                >
                  {a.title}
                </div>
                <div
                  className="px-2 md:px-6 py-3 md:py-5 text-[10px] md:text-sm font-black text-center truncate"
                  style={{ color: colorB }}
                >
                  {b.title}
                </div>
              </div>
              {Array.from({ length: Math.min(Math.max(iposA.length, iposB.length), 15) }).map((_, idx) => {
                const ia = iposA[idx];
                const ib = iposB[idx];
                return (
                  <div
                    key={idx}
                    className={`grid grid-cols-2 border-b border-slate-100 last:border-0 divide-x divide-slate-100 ${
                      idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                    }`}
                  >
                    <div
                      className="px-4 py-6 md:py-10 text-sm md:text-2xl font-black text-center leading-tight"
                      style={{ color: N }}
                    >
                      {ia ? ia.company || ia.name || ia.title || `IPO ${idx + 1}` : <span className="text-slate-300">—</span>}
                    </div>
                    <div
                      className="px-4 py-6 md:py-10 text-sm md:text-2xl font-black text-center leading-tight"
                      style={{ color: N }}
                    >
                      {ib ? ib.company || ib.name || ib.title || `IPO ${idx + 1}` : <span className="text-slate-300">—</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { bk: a, color: colorA, label: "Merchant Banker A" },
              { bk: b, color: colorB, label: "Merchant Banker B" },
            ].map(({ bk, color, label }) => (
              <div
                key={bk.id}
                className="rounded-3xl p-8 border-2 flex flex-col gap-5 transition-all hover:shadow-2xl hover:-translate-y-1 bg-white"
                style={{
                  borderColor: `${color}30`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-black uppercase tracking-widest" style={{ color }}>
                    {label}
                  </div>
                  <CheckCircle className="w-6 h-6" style={{ color }} />
                </div>
                <p className="font-black text-xl md:text-2xl leading-tight" style={{ color: N }}>
                  {bk.title}
                </p>
                <Link
                  href={`/merchant-contact?ipo_type=${
                    isMainboard ? "Mainboard-IPO" : "SME-IPO"
                  }`}
                  className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl font-black text-base text-white shadow-lg transition-all hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                    boxShadow: `0 8px 20px ${color}30`,
                  }}
                >
                  <Mail className="w-5 h-5" /> Contact {bk.title}
                </Link>
                <Link
                  href={`/merchant-banker/${bk.slug}`}
                  className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl font-black text-base transition-all hover:bg-slate-50 border-2"
                  style={{ color: N, borderColor: `${color}20` }}
                >
                  <Users className="w-5 h-5" /> View Full Profile
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center pt-2 pb-4">
            <button
              onClick={() => router.push(backUrl)}
              className="inline-flex items-center gap-2 px-8 h-12 rounded-xl font-black text-sm text-white transition-all hover:scale-105 cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${N}, #003380)` }}
            >
              <ChevronLeft className="w-4 h-4" /> Back to Directory
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
