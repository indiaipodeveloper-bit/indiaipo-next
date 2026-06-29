"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getImageUrl } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Home,
  ChevronRight,
  FileText,
  Download,
  ExternalLink,
  ArrowRight,
  Phone,
  Mail,
  Shield,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("@/components/pdf/SimplePdfViewer"), {
  ssr: false,
});

interface NotificationPdf {
  id: string | number;
  title: string;
  slug: string;
  pdf_url: string | null;
  link: string | null;
  description: string | null;
}

interface NotificationClientProps {
  pdf: NotificationPdf | null;
  allPdfs: NotificationPdf[];
  slug: string | null;
  bannerVideo: string | null;
}

export default function NotificationClient({
  pdf,
  allPdfs,
  slug,
  bannerVideo,
}: NotificationClientProps) {
  const pathname = usePathname();

  const pdfSrc = pdf?.pdf_url
    ? pdf.pdf_url.startsWith("http") || pdf.pdf_url.startsWith("/")
      ? pdf.pdf_url
      : `/${pdf.pdf_url}`
    : null;

  const extLink = pdf?.link
    ? pdf.link.startsWith("http")
      ? pdf.link
      : `https://${pdf.link}`
    : null;

  const getLinkUrl = (pSlug: string) => {
    if (pSlug === "bse-sme-ipo-eligibility") return "/bse-sme-ipo-eligibility";
    if (pSlug === "nse-emerge-eligibility-criteria")
      return "/nse-emerge-eligibility-criteria";
    return `/notifications/${pSlug}`;
  };

  const isLinkActive = (pSlug: string) => {
    if (pSlug === "bse-sme-ipo-eligibility")
      return pathname === "/bse-sme-ipo-eligibility";
    if (pSlug === "nse-emerge-eligibility-criteria")
      return pathname === "/nse-emerge-eligibility-criteria";
    return pathname === `/notifications/${pSlug}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main>
        {/* Banner Section */}
        <section className="bg-[#001529] py-14 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-30"
              src={getImageUrl(bannerVideo || "video/ccvindia1.mp4")}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#001529]/80 via-[#001529]/40 to-[#001529]" />
          </div>

          <div className="absolute inset-0 pointer-events-none z-10">
            <div
              className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-5"
              style={{
                background: "#f59e08",
                filter: "blur(80px)",
                transform: "translate(25%,-25%)",
              }}
            />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-6 flex-wrap">
              <Link
                href="/"
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                <Home className="h-3.5 w-3.5 text-[#f59e08]" /> Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/70">Notifications / Circulars</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/90 font-semibold line-clamp-1 max-w-[200px]">
                {pdf?.title || "Loading…"}
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-2xl md:text-4xl font-black text-white leading-tight flex items-start gap-4 max-w-4xl">
                <div className="w-12 h-12 rounded-xl bg-[#f59e08]/20 flex items-center justify-center shrink-0 mt-1">
                  <FileText className="h-6 w-6 text-[#f59e08]" />
                </div>
                {pdf?.title || "Notification"}
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Main Document / View */}
            <div className="flex-1 min-w-0">
              {pdfSrc ? (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div
                    className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3"
                    style={{
                      background: "linear-gradient(135deg, #001529, #003380)",
                    }}
                  >
                    <span className="text-sm font-bold text-white line-clamp-1 flex-1">
                      {pdf?.title}
                    </span>
                    <div className="flex gap-2">
                      <a
                        href={pdfSrc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black border border-white/25 text-white hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Open in New Tab
                      </a>
                      {/* <a */}
                      {/*   href={pdfSrc} */}
                      {/*   download */}
                      {/*   className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all hover:scale-105 cursor-pointer bg-gradient-to-r from-[#f59e08] to-[#d97706] text-[#001529] border-0" */}
                      {/* > */}
                      {/*   <Download className="h-3.5 w-3.5" /> Download */}
                      {/* </a> */}
                    </div>
                  </div>
                  {/* <iframe src={pdfSrc} className="w-full border-0" style={{ height: "80vh" }} title={pdf?.title} /> */}

                  <PdfViewer pdfUrl={pdfSrc} className="h-[80vh]" />
                </div>
              ) : extLink ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
                  <div className="w-20 h-20 rounded-2xl bg-[#001529]/10 flex items-center justify-center mx-auto mb-5">
                    <ExternalLink className="h-10 w-10 text-[#001529]/40" />
                  </div>
                  <h3 className="text-xl font-black text-[#001529] mb-3">
                    External Document Available
                  </h3>
                  <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto text-sm">
                    This notification is available as an external link. Click
                    the button below to open it.
                  </p>
                  <a
                    href={extLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 h-14 rounded-xl font-black text-[#001529] transition-all hover:scale-105 shadow-xl bg-gradient-to-r from-[#f59e08] to-[#d97706] cursor-pointer"
                    style={{ boxShadow: "0 8px 32px rgba(245,158,8,0.35)" }}
                  >
                    Open External Link <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
              ) : slug === "nse-emerge-eligibility-criteria" ? (
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="bg-gradient-to-r from-[#003366] to-[#0052a3] p-10 md:p-16 text-white text-center relative overflow-hidden">
                    <div
                      className="absolute top-0 left-0 w-full h-full opacity-10"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, #f59e08 1px, transparent 1px)",
                        backgroundSize: "30px 30px",
                      }}
                    />
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-[100px]" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-[100px]" />

                    <Shield className="h-20 w-20 text-[#f59e08] mx-auto mb-6 relative z-10" />
                    <h2 className="text-4xl md:text-5xl font-black mb-4 relative z-10 leading-tight">
                      NSE Emerge Eligibility Criteria
                    </h2>
                    <p className="text-white/80 max-w-3xl mx-auto relative z-10 text-lg font-medium">
                      Official listing requirements and financial benchmarks for
                      the National Stock Exchange (NSE) SME Platform.
                    </p>
                  </div>

                  <div className="p-6 md:p-12 space-y-16">
                    <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12 border border-slate-200 space-y-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#003366]/10 flex items-center justify-center shrink-0">
                          <Info className="h-7 w-7 text-[#003366]" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-[#003366]">
                            Statutory Compliance
                          </h3>
                          <p className="text-slate-500 text-sm font-medium">
                            Conditions precedent to listing based on Indian
                            statutes.
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        The issuer must adhere to all conditions arising from
                        the following statutes and their subordinate
                        instruments:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          "Securities Contracts (Regulations) Act, 1956",
                          "Companies Act, 1956 / 2013",
                          "Securities and Exchange Board of India Act, 1992",
                          "Rules, regulations, and circulars by relevant authorities",
                        ].map((text, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm"
                          >
                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                            <span className="text-xs font-bold text-slate-700">
                              {text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-7 w-7 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl md:text-3xl font-black text-[#001529]">
                            01. Professional Eligibility
                          </h3>
                          <p className="text-slate-500 text-sm font-medium">
                            Primary requirements for incorporation, capital, and
                            track record.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-3">
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                            Incorporation
                          </p>
                          <p className="text-xl font-black text-[#001529]">
                            Indian Entity
                          </p>
                          <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            Issuer must be incorporated in India under Companies
                            Act, 1956/2013.
                          </p>
                        </div>
                        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-3">
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                            Post-Issue Capital
                          </p>
                          <p className="text-xl font-black text-[#001529]">
                            ₹25 Crores
                          </p>
                          <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            Post-issue paid-up capital (face value) must not
                            exceed this limit.
                          </p>
                        </div>
                        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-3">
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                            Track Record
                          </p>
                          <p className="text-xl font-black text-[#001529]">
                            3 Years
                          </p>
                          <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            For the company, promoters, or converted predecessor
                            entity.
                          </p>
                        </div>
                      </div>

                      <div className="bg-blue-50/50 border border-blue-100 p-8 rounded-3xl space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-black text-blue-900">
                            Critical Notes on Track Record:
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="text-xs text-blue-800/80 leading-relaxed px-4 border-l-2 border-blue-200">
                            <b>Promoters:</b> One or more persons with 3+ years
                            experience in the same line of business holding 20%+
                            post-issue equity individually or severally.
                          </div>
                          <div className="text-xs text-blue-800/80 leading-relaxed px-4 border-l-2 border-blue-200">
                            <b>Conversion & Audits:</b> Must have 1 full FY
                            operations after incorporation. Converted entities
                            must comply with Schedule III certified by ICAI Peer
                            Review auditor.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-7 w-7 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl md:text-3xl font-black text-[#001529]">
                            02. Financial Performance
                          </h3>
                          <p className="text-slate-500 text-sm font-medium">
                            Benchmarks for operating profit, net worth, and cash
                            flows.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 text-center space-y-2 group hover:bg-white hover:shadow-xl transition-all duration-300">
                          <p className="text-[10px] font-black text-orange-600 uppercase mb-3">
                            Operating Profit (EBIDT)
                          </p>
                          <p className="text-4xl font-black text-[#001529]">
                            ₹1.00 Cr+
                          </p>
                          <p className="text-xs text-slate-500 font-medium">
                            In any 2 out of 3 previous financial years.
                          </p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 text-center space-y-2 group hover:bg-white hover:shadow-xl transition-all duration-300">
                          <p className="text-[10px] font-black text-orange-600 uppercase mb-3">
                            Free Cash Flow (FCFE)
                          </p>
                          <p className="text-4xl font-black text-[#001529]">
                            Positive
                          </p>
                          <p className="text-xs text-slate-500 font-medium">
                            FCFE must be positive for at least 2 of 3 previous
                            years.
                          </p>
                        </div>
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 text-center space-y-2 group hover:bg-white hover:shadow-xl transition-all duration-300">
                          <p className="text-[10px] font-black text-orange-600 uppercase mb-3">
                            Net Worth
                          </p>
                          <p className="text-4xl font-black text-[#001529]">
                            Positive
                          </p>
                          <p className="text-xs text-slate-500 font-medium">
                            Company's net worth must be in positive territory.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm space-y-6">
                        <h3 className="text-xl font-black text-[#001529] flex items-center gap-3">
                          <div className="w-1.5 h-6 bg-red-600 rounded-full" />{" "}
                          OFS & Convertibles
                        </h3>
                        <ul className="space-y-4">
                          <li className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="text-xs font-bold text-slate-500">
                              OFS Component Limit
                            </span>
                            <span className="text-sm font-black text-red-600">
                              Max 20%
                            </span>
                          </li>
                          <li className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="text-xs font-bold text-slate-500">
                              Shareholder Portfolio Exit
                            </span>
                            <span className="text-sm font-black text-red-600">
                              Max 50%
                            </span>
                          </li>
                        </ul>
                        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex gap-3">
                          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                          <p className="text-[10px] text-red-700 font-medium">
                            <b>No Convertibles:</b> No outstanding convertible
                            securities (excl. ESOPs) are allowed at the time of
                            filing.
                          </p>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm space-y-6">
                        <h3 className="text-xl font-black text-[#001529] flex items-center gap-3">
                          <div className="w-1.5 h-6 bg-green-600 rounded-full" />{" "}
                          Promoter Lock-ins
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-start gap-4 p-4 bg-green-50/50 rounded-2xl border border-green-100">
                            <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                              1
                            </span>
                            <p className="text-xs font-bold text-green-900 leading-normal">
                              Minimum 20% contribution locked for <b>3 Years</b>{" "}
                              post allotment.
                            </p>
                          </div>
                          <div className="flex items-start gap-4 p-4 bg-green-50/50 rounded-2xl border border-green-100">
                            <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                              2
                            </span>
                            <p className="text-xs font-bold text-green-900 leading-normal">
                              Excess over 20% locked in phases: 50% for 1 year,
                              50% for 2 years.
                            </p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] text-slate-400 font-black uppercase mb-1">
                              Non-Promoter Lock-in
                            </p>
                            <p className="text-xs font-black text-[#001529]">
                              6 Months from date of allotment
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <h3 className="text-2xl font-black text-[#001529] border-b border-slate-200 pb-4">
                        IPO Proceeds & Financial Proof
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
                            <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest">
                              GCP Limits
                            </h4>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-slate-500">
                                General Corporate Purpose
                              </span>
                              <span className="text-sm font-black text-[#001529]">
                                Max 15% or ₹10 Cr
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-slate-500">
                                Aggregate GCP + Unidentified
                              </span>
                              <span className="text-sm font-black text-[#001529]">
                                Max 25%
                              </span>
                            </div>
                            <div className="pt-4 border-t border-slate-200">
                              <p className="text-[10px] text-red-600 font-bold uppercase mb-1">
                                Strict Prohibition
                              </p>
                              <p className="text-[10px] text-slate-500 font-medium">
                                Proceeds cannot be used for repayment of loans
                                from promoters or related parties.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-center bg-gradient-to-br from-[#003366] to-[#0052a3] p-8 rounded-3xl text-white relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                          <h4 className="text-lg font-black mb-4">
                            Firm Financial Arrangements
                          </h4>
                          <p className="text-sm text-white/70 leading-relaxed mb-6">
                            The issuer must make firm arrangements through
                            verifiable means for:
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="text-4xl font-black text-[#f59e08]">
                              75%
                            </div>
                            <div className="text-xs text-white/60 font-medium font-mono uppercase leading-tight tracking-wider">
                              Of Proposed Means <br /> of Finance (Excl. IPO)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-3">
                        <div className="p-8 border-b md:border-b-0 md:border-r border-slate-100 space-y-4">
                          <h4 className="font-black text-blue-600 text-[10px] uppercase tracking-widest">
                            Regulatory Clean Slate
                          </h4>
                          <ul className="space-y-3">
                            {[
                              "No regulatory actions against promoters.",
                              "No Wilful Defaulters or Economic Offenders.",
                              "No BIFR/IBC proceedings against company.",
                              "No winding-up petition in court.",
                            ].map((txt, i) => (
                              <li
                                key={i}
                                className="flex gap-2 items-start text-[11px] text-slate-600"
                              >
                                <Shield className="h-3.5 w-3.5 text-blue-400 mt-0.5 shrink-0" />{" "}
                                {txt}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-8 border-b md:border-b-0 md:border-r border-slate-100 space-y-4">
                          <h4 className="font-black text-blue-600 text-[10px] uppercase tracking-widest">
                            Listing Mandates
                          </h4>
                          <ul className="space-y-3">
                            {[
                              "Functional corporate website is required.",
                              "100% Promoter demat holding mandatory.",
                              "Market Maker appointment for 3 years.",
                              "100% Issue underwriting by Merchant Banker.",
                            ].map((txt, i) => (
                              <li
                                key={i}
                                className="flex gap-2 items-start text-[11px] text-slate-600"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-400 mt-0.5 shrink-0" />{" "}
                                {txt}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-8 space-y-4">
                          <h4 className="font-black text-blue-600 text-[10px] uppercase tracking-widest">
                            Documentation Norms
                          </h4>
                          <ul className="space-y-3">
                            {[
                              "21-day public review of SME IPO DRHP.",
                              "Auditor certificate for fund utilization.",
                              "Monitoring Agency if issue > ₹50 Cr.",
                              "6 months cooling gap for re-application.",
                            ].map((txt, i) => (
                              <li
                                key={i}
                                className="flex gap-2 items-start text-[11px] text-slate-600"
                              >
                                <FileText className="h-3.5 w-3.5 text-orange-400 mt-0.5 shrink-0" />{" "}
                                {txt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-4 flex-wrap gap-4">
                        <h3 className="text-2xl md:text-3xl font-black text-[#001529]">
                          Specialized Business Segments
                        </h3>
                        <span className="px-4 py-1.5 bg-[#f59e08]/10 text-[#f59e08] text-[10px] font-black uppercase rounded-full tracking-widest">
                          NSE Emerge Exclusive
                        </span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl space-y-6">
                          <h4 className="text-lg font-black text-[#003366] flex items-center gap-2">
                            <div className="w-2 h-6 bg-[#003366] rounded-full" />{" "}
                            A. Technology Startups
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white rounded-2xl border border-slate-100 text-center">
                              <p className="text-[10px] font-black text-slate-400 uppercase">
                                Revenue
                              </p>
                              <p className="text-lg font-black text-[#003366]">
                                ₹10 Cr+
                              </p>
                            </div>
                            <div className="p-4 bg-white rounded-2xl border border-slate-100 text-center">
                              <p className="text-[10px] font-black text-slate-400 uppercase">
                                Annual Growth
                              </p>
                              <p className="text-lg font-black text-[#003366]">
                                20%+
                              </p>
                            </div>
                          </div>
                          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                            <p className="text-[10px] text-[#003366] font-black uppercase mb-1">
                              Pre-Issue Capital Requirement
                            </p>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">
                              At least 10% held by QIBs, or Angel Investor
                              Network/PE Firm (with 25+ startups & ₹50 Cr+
                              investment portfolio).
                            </p>
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl space-y-6">
                          <h4 className="text-lg font-black text-purple-700 flex items-center gap-2">
                            <div className="w-2 h-6 bg-purple-700 rounded-full" />{" "}
                            B. Institutional Trading (ITP)
                          </h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            Dedicated segment for tech and innovative entities
                            with significant institutional backing.
                          </p>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                              <div className="px-2 py-1 bg-purple-100 text-purple-700 text-[10px] font-black rounded uppercase">
                                Cat A
                              </div>
                              <p className="text-xs font-bold text-slate-700">
                                Tech/Innovation (25% QIB shareholding)
                              </p>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                              <div className="px-2 py-1 bg-purple-100 text-purple-700 text-[10px] font-black rounded uppercase">
                                Cat B
                              </div>
                              <p className="text-xs font-bold text-slate-700">
                                Other Entities (50% QIB shareholding)
                              </p>
                            </div>
                          </div>
                          <p className="text-[10px] italic text-slate-400 font-medium">
                            Standard EBIDT/FCFE criteria do not apply to
                            ITP-listed entities.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#001529] p-8 md:p-12 rounded-[2.5rem] text-white">
                      <h3 className="text-xl font-black mb-8 border-b border-white/10 pb-4">
                        Offer Document Disclosure Requirements
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        <div className="space-y-3">
                          <h4 className="text-xs font-black text-[#f59e08] uppercase tracking-widest">
                            Regulatory actions
                          </h4>
                          <p className="text-xs text-white/60 leading-relaxed font-medium">
                            Disclosure of any material disciplinary action by a
                            stock exchange or regulator in the past year for
                            promoters and group companies.
                          </p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-xs font-black text-[#f59e08] uppercase tracking-widest">
                            Financial Defaults
                          </h4>
                          <p className="text-xs text-white/60 leading-relaxed font-medium">
                            Defaults in payment of interest/principal to banks
                            or financial institutions during the past three
                            years. Auditor's Certificate required.
                          </p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-xs font-black text-[#f59e08] uppercase tracking-widest">
                            Litigation Record
                          </h4>
                          <p className="text-xs text-white/60 leading-relaxed font-medium">
                            Complete record of pending litigation for the
                            applicant, promoters, and group companies including
                            nature and current status.
                          </p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-xs font-black text-[#f59e08] uppercase tracking-widest">
                            Director Integrity
                          </h4>
                          <p className="text-xs text-white/60 leading-relaxed font-medium">
                            Status of criminal cases or investigations against
                            directors involving serious offences (Murder, Rape,
                            Forgery, or Economic offences).
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-8 md:p-12 rounded-[2.5rem] space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center md:text-left space-y-2">
                          <p className="text-xs font-black text-slate-400 uppercase">
                            Min Allottees
                          </p>
                          <p className="text-2xl font-black text-[#001529]">
                            200 Investors
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            At the time of allotment
                          </p>
                        </div>
                        <div className="text-center md:text-left space-y-2">
                          <p className="text-xs font-black text-slate-400 uppercase">
                            Min Application
                          </p>
                          <p className="text-2xl font-black text-[#001529]">
                            ₹2.00 Lakhs+
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            Minimum lot size requirement
                          </p>
                        </div>
                        <div className="text-center md:text-left space-y-2">
                          <p className="text-xs font-black text-slate-400 uppercase">
                            Public Float
                          </p>
                          <p className="text-2xl font-black text-[#001529]">
                            25% Shares
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            Minimum post-issue shareholding
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : slug === "bse-sme-ipo-eligibility" ? (
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="bg-gradient-to-r from-[#001529] to-[#032e57] p-10 md:p-16 text-white text-center relative overflow-hidden">
                    <div
                      className="absolute top-0 left-0 w-full h-full opacity-10"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, #f59e08 1px, transparent 1px)",
                        backgroundSize: "30px 30px",
                      }}
                    />
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#f59e08]/10 rounded-full blur-[100px]" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#f59e08]/10 rounded-full blur-[100px]" />

                    <Shield className="h-20 w-20 text-[#f59e08] mx-auto mb-6 relative z-10" />
                    <h2 className="text-4xl md:text-5xl font-black mb-4 relative z-10 leading-tight">
                      BSE SME Eligibility Criteria
                    </h2>
                    <p className="text-white/80 max-w-3xl mx-auto relative z-10 text-lg font-medium">
                      Comprehensive listing requirements based on ICDR
                      Regulations and Exchange norms for the BSE SME Platform.
                    </p>
                  </div>

                  <div className="p-6 md:p-12 space-y-16">
                    <div className="space-y-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-7 w-7 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl md:text-3xl font-black text-[#001529]">
                            01. Core Financial Eligibility
                          </h3>
                          <p className="text-slate-500 text-sm font-medium">
                            Primary financial benchmarks required for BSE SME
                            listing.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl group hover:bg-white hover:shadow-xl transition-all duration-300">
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">
                            Post-Issue Capital
                          </p>
                          <p className="text-3xl font-black text-[#001529] mb-2">
                            ₹25 Cr
                          </p>
                          <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            Post-issue paid-up capital must not exceed this
                            amount.
                          </p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl group hover:bg-white hover:shadow-xl transition-all duration-300">
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">
                            Min Net Worth
                          </p>
                          <p className="text-3xl font-black text-[#001529] mb-2">
                            ₹1 Cr
                          </p>
                          <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            For each of the two preceding full financial years.
                          </p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl group hover:bg-white hover:shadow-xl transition-all duration-300">
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">
                            Tangible Assets
                          </p>
                          <p className="text-3xl font-black text-[#001529] mb-2">
                            ₹3 Cr
                          </p>
                          <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            Net tangible assets in the last preceding financial
                            year.
                          </p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl group hover:bg-white hover:shadow-xl transition-all duration-300">
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">
                            Leverage Ratio
                          </p>
                          <p className="text-3xl font-black text-[#001529] mb-2">
                            3:1
                          </p>
                          <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            Total debt to equity ratio should not exceed 3:1
                            limit.
                          </p>
                        </div>
                      </div>

                      <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-3xl flex items-start gap-4">
                        <Info className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-blue-900 font-semibold mb-1">
                            Company Incorporation & Conversion Note:
                          </p>
                          <p className="text-sm text-blue-800/80 leading-relaxed">
                            Must be incorporated under Companies Act, 2013/1956.
                            For converted entities
                            (Proprietorship/LLP/Partnership), the predecessor
                            must have maintained a net worth of ₹1 Cr for the 2
                            preceding years.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-7 w-7 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl md:text-3xl font-black text-[#001529]">
                            02. Track Record & Performance
                          </h3>
                          <p className="text-slate-500 text-sm font-medium">
                            Operational history and earnings requirements.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                          <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-4">
                            <h4 className="text-lg font-black text-[#001529] flex items-center gap-2">
                              <div className="w-2 h-6 bg-orange-500 rounded-full" />{" "}
                              Operational History
                            </h4>
                            <ul className="space-y-4">
                              <li className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                                <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0 font-bold text-orange-700 text-[10px]">
                                  1
                                </div>
                                <p>
                                  Minimum <b>3 years</b> operational track
                                  record (including tenure of predecessor
                                  entities converted into company).
                                </p>
                              </li>
                              <li className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                                <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0 font-bold text-orange-700 text-[10px]">
                                  2
                                </div>
                                <p>
                                  Must have completed at least{" "}
                                  <b>one full financial year</b> of operations
                                  after incorporation with audited results.
                                </p>
                              </li>
                              <li className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                                <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center shrink-0 font-bold text-orange-700 text-[10px]">
                                  3
                                </div>
                                <p>
                                  Financials must comply with{" "}
                                  <b>Schedule III</b> of Companies Act, 2013 and
                                  be certified by ICAI Peer Review auditor.
                                </p>
                              </li>
                            </ul>
                          </div>

                          <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-4">
                            <h4 className="text-lg font-black text-[#001529] flex items-center gap-2">
                              <div className="w-2 h-6 bg-orange-500 rounded-full" />{" "}
                              Profitability (EBIDT)
                            </h4>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                              The company (or predecessor) must have generated
                              an operating profit (EBIDT) of at least:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                                <p className="text-xl font-black text-[#001529]">
                                  ₹1.00 Cr+
                                </p>
                                <p className="text-[10px] text-slate-500 uppercase font-black mt-1">
                                  In 2 of 3 latest years
                                </p>
                              </div>
                              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                                <p className="text-xl font-black text-green-600">
                                  Positive
                                </p>
                                <p className="text-[10px] text-slate-500 uppercase font-black mt-1">
                                  In year immediately preceding
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#001529] to-[#004276] p-8 rounded-3xl text-white relative overflow-hidden">
                          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                          <h4 className="text-xl font-black mb-6">
                            Alternative Route
                          </h4>
                          <p className="text-sm text-white/70 leading-relaxed mb-8">
                            Where the company does not meet the 3-year track
                            record, the project must be appraised and funded by:
                          </p>
                          <ul className="space-y-4">
                            {[
                              "NABARD / SIDBI",
                              "Scheduled Banks",
                              "Financial Institutions",
                            ].map((item, idx) => (
                              <li
                                key={idx}
                                className="flex items-center gap-3 text-sm font-bold"
                              >
                                <CheckCircle2 className="h-5 w-5 text-[#f59e08]" />{" "}
                                {item}
                              </li>
                            ))}
                          </ul>
                          <div className="mt-8 p-4 rounded-2xl bg-white/10 border border-white/10 text-[11px] text-white/60">
                            Even in this case, 1 full financial year of
                            operation + audited results are mandatory.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                          <AlertCircle className="h-7 w-7 text-red-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl md:text-3xl font-black text-[#001529]">
                            03. Disciplinary Action & Defaults
                          </h3>
                          <p className="text-slate-500 text-sm font-medium">
                            Mandatory clean-slate requirements for promoters and
                            directors.
                          </p>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                          <div className="p-8 border-b md:border-b-0 md:border-r border-slate-100 space-y-6">
                            <h4 className="font-black text-red-600 text-sm uppercase tracking-widest">
                              Restricted Entities
                            </h4>
                            <ul className="space-y-4">
                              {[
                                "No disciplinary action taken by any Stock Exchange against promoters.",
                                "No promoter/director as a 'Wilful Defaulter' or 'Fraudulent Borrower'.",
                                "No classification as a 'Fugitive Economic Offender'.",
                                "No debarment by SEBI from accessing capital markets.",
                              ].map((txt, i) => (
                                <li
                                  key={i}
                                  className="flex gap-3 items-start text-sm text-slate-600"
                                >
                                  <Shield className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />{" "}
                                  {txt}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-8 space-y-6">
                            <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">
                              Default Compliance
                            </h4>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                              The company, promoters, and subsidiaries must have{" "}
                              <b>NO pending defaults</b> in payment of interest
                              or principal to:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {[
                                "Debenture Holders",
                                "Bond Holders",
                                "Fixed Deposit Holders",
                              ].map((tag, i) => (
                                <span
                                  key={i}
                                  className="px-4 py-2 bg-slate-100 rounded-full text-[11px] font-black text-[#001529] uppercase"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
                              <p className="text-[11px] text-red-800 font-bold uppercase mb-1">
                                Insolvency Status
                              </p>
                              <p className="text-xs text-red-700">
                                Must not be referred to NCLT under IBC and no
                                winding-up petition admitted by court.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6 bg-slate-50 p-8 rounded-3xl border border-slate-200">
                        <h3 className="text-xl font-black text-[#001529] flex items-center gap-2">
                          <div className="w-1.5 h-6 bg-blue-600 rounded-full" />{" "}
                          OFS Restrictions
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <span className="text-sm font-bold text-slate-500">
                              OFS Component Cap
                            </span>
                            <span className="text-lg font-black text-blue-600">
                              Max 20%
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <span className="text-sm font-bold text-slate-500">
                              Per Shareholder Exit
                            </span>
                            <span className="text-lg font-black text-blue-600">
                              Max 50%
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 italic">
                            OFS calculation based on total issue size and
                            pre-issue shareholding.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6 bg-slate-50 p-8 rounded-3xl border border-slate-200">
                        <h3 className="text-xl font-black text-[#001529] flex items-center gap-2">
                          <div className="w-1.5 h-6 bg-green-600 rounded-full" />{" "}
                          Use of IPO Proceeds
                        </h3>
                        <div className="space-y-4">
                          <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-bold text-slate-500">
                                GCP Limit
                              </span>
                              <span className="text-sm font-black text-green-600">
                                15% or ₹10 Cr
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400">
                              Whichever is lower of the amount raised.
                            </p>
                          </div>
                          <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-bold text-slate-500">
                                Aggregate GCP + Unidentified
                              </span>
                              <span className="text-sm font-black text-green-600">
                                Max 25%
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400">
                              Total cap on flexible fund usage.
                            </p>
                          </div>
                          <div className="p-3 bg-red-100/50 rounded-xl border border-red-200">
                            <p className="text-[10px] text-red-800 font-bold uppercase">
                              Prohibition
                            </p>
                            <p className="text-[10px] text-red-700">
                              Funds cannot be used for repayment of loans from
                              promoters or related parties.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                      <div className="px-8 py-5 border-b border-slate-100 bg-[#001529]">
                        <h3 className="text-lg font-black text-white">
                          Special Criteria for Businesses
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="p-8 border-b md:border-b-0 md:border-r border-slate-100">
                          <h4 className="font-black text-blue-600 text-sm mb-4 uppercase">
                            A. Broking Companies
                          </h4>
                          <div className="space-y-3">
                            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                              <p className="text-[10px] font-black text-blue-800 uppercase mb-1">
                                Path 1: Mid-tier
                              </p>
                              <p className="text-xs text-blue-900 font-bold">
                                ₹5 Cr NW + ₹5 Cr PBT (2 of 3 years)
                              </p>
                            </div>
                            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                              <p className="text-[10px] font-black text-blue-800 uppercase mb-1">
                                Path 2: Large-tier
                              </p>
                              <p className="text-xs text-blue-900 font-bold">
                                ₹25 Cr Net Worth (3 of 5 years)
                              </p>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed pt-2">
                              Min post-issue capital: ₹3 Cr. Net tangible
                              assets: ₹3 Cr.
                            </p>
                          </div>
                        </div>
                        <div className="p-8">
                          <h4 className="font-black text-purple-600 text-sm mb-4 uppercase">
                            B. Micro Finance (MFI)
                          </h4>
                          <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                              <CheckCircle2 className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                                  Minimum AUM
                                </p>
                                <p className="text-sm font-black text-purple-700">
                                  ₹100 Crores+
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start gap-3">
                              <CheckCircle2 className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                                  Client Base
                                </p>
                                <p className="text-sm font-black text-purple-700">
                                  10,000+ Active Clients
                                </p>
                              </div>
                            </li>
                            <li className="flex items-start gap-3">
                              <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                              <p className="text-xs text-slate-500 font-medium">
                                Must NOT have accepted or held any public
                                deposits.
                              </p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <h3 className="text-2xl font-black text-[#001529] border-b border-slate-200 pb-4">
                        Additional Compliance Terms
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8">
                        <div className="space-y-4 text-sm">
                          <div className="font-black text-xs text-blue-600 uppercase tracking-widest">
                            Shareholding & Lock-in
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <b>Promoter Contribution:</b> Min 20% (MPC) locked
                            for 3 years; excess released in 2 phases - 50% after
                            Year 1, 50% after Year 2.
                          </p>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <b>Non-Promoter Capital:</b> Subject to 6 months
                            lock-in post allotment.
                          </p>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <b>Demat Form:</b> 100% of promoter holding must be
                            in dematerialised form.
                          </p>
                        </div>
                        <div className="space-y-4 text-sm">
                          <div className="font-black text-xs text-blue-600 uppercase tracking-widest">
                            Listing Operations
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <b>Market Maker:</b> Official appointment mandatory
                            for at least 3 years post-listing.
                          </p>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <b>Underwriting:</b> 100% underwritten issue; Banker
                            min 15% from own account.
                          </p>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <b>Monitoring Agency:</b> Mandatory if issue size
                            exceeds ₹50 Crores.
                          </p>
                        </div>
                        <div className="space-y-4 text-sm">
                          <div className="font-black text-xs text-blue-600 uppercase tracking-widest">
                            Procedural Norms
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <b>Name Change:</b> If name changed in last year,
                            50% revenue must come from activity in new name.
                          </p>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <b>Convertibles:</b> No outstanding convertible
                            securities (excl. ESOPs) allowed at time of filing.
                          </p>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <b>Cooling-Off:</b> 6 months gap required after any
                            withdrawal/rejection of issue.
                          </p>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <b>DRHP Review:</b> 21-day public review mandate
                            with QR code for access.
                          </p>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <b>Fin. Arrangement:</b> Firm resource proof for 75%
                            of project cost (excl. IPO).
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-8 md:p-12 rounded-[2.5rem] space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center md:text-left space-y-2">
                          <p className="text-xs font-black text-slate-400 uppercase">
                            Min Allottees
                          </p>
                          <p className="text-2xl font-black text-[#001529]">
                            200 Investors
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            At the time of allotment
                          </p>
                        </div>
                        <div className="text-center md:text-left space-y-2">
                          <p className="text-xs font-black text-slate-400 uppercase">
                            Min Application
                          </p>
                          <p className="text-2xl font-black text-[#001529]">
                            ₹2.00 Lakhs+
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            Minimum lot size requirement
                          </p>
                        </div>
                        <div className="text-center md:text-left space-y-2">
                          <p className="text-xs font-black text-slate-400 uppercase">
                            Public Float
                          </p>
                          <p className="text-2xl font-black text-[#001529]">
                            25% Shares
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            Minimum post-issue shareholding
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-16 text-center shadow-sm">
                  <FileText className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                  <h3 className="text-lg font-black text-[#001529] mb-2">
                    Document Not Yet Available
                  </h3>
                  <p className="text-sm text-slate-400 font-medium">
                    The admin will upload the PDF or link for &quot;
                    {pdf?.title || "this circular"}&quot; soon. Please check
                    back later.
                  </p>
                </div>
              )}

              {pdf?.description && !slug?.includes("eligibility") && (
                <div className="mt-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-5 rounded-full bg-[#f59e08]" />
                    <span className="text-sm font-black text-[#001529]">
                      About this Document
                    </span>
                  </div>
                  <div
                    className="text-sm text-slate-600 leading-relaxed prose prose-slate max-w-none 
                      [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-2xl [&_img]:my-6 [&_img]:shadow-md
                      [&_p]:mb-4 [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base"
                    dangerouslySetInnerHTML={{
                      __html: (pdf.description || "")
                        .replace(/^"(.*)"$/, "$1")
                        .replace(/\\n/g, ""),
                    }}
                  />
                </div>
              )}
            </div>

            {/* Right Column - Sidebar List & Contact */}
            <div className="w-full lg:w-72 shrink-0 space-y-5 lg:sticky lg:top-28 self-start">
              {/* All Notifications List */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2 bg-[#001529]">
                  <FileText className="h-4 w-4 text-[#f59e08]" />
                  <h3 className="font-black text-white text-sm uppercase tracking-widest">
                    All Notifications
                  </h3>
                </div>
                <div className="p-3 space-y-1 max-h-[60vh] overflow-y-auto">
                  {allPdfs.map((p) => {
                    const isActive = isLinkActive(p.slug);
                    return (
                      <Link
                        key={p.id}
                        href={getLinkUrl(p.slug)}
                        className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? "text-[#001529] font-black bg-[#f59e08]/10 border border-[#f59e08]/25"
                            : "text-slate-500 hover:text-[#001529] hover:bg-slate-50"
                        }`}
                      >
                        <FileText
                          className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${isActive ? "text-[#f59e08]" : "text-slate-300"}`}
                        />
                        <span className="leading-snug">{p.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Consultation Card */}
              <div className="bg-[#001529] rounded-2xl p-6 overflow-hidden relative border border-white/5">
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10"
                  style={{
                    background: "#f59e08",
                    filter: "blur(20px)",
                    transform: "translate(30%,-30%)",
                  }}
                />
                <div className="w-12 h-12 rounded-xl bg-[#f59e08]/20 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-[#f59e08]" />
                </div>
                <h3 className="font-black text-white text-base mb-2">
                  Need IPO Consultation?
                </h3>
                <p className="text-white/55 text-xs mb-5 leading-relaxed">
                  Get expert guidance on SEBI regulations and IPO compliance
                  from our registered advisors.
                </p>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-black text-[#001529] transition-all hover:scale-105 mb-3 bg-gradient-to-r from-[#f59e08] to-[#d97706] cursor-pointer"
                >
                  Contact Us <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="space-y-2 pt-3 border-t border-white/10">
                  <a
                    href="mailto:info@indiaipo.in"
                    className="flex items-center gap-2 text-white/60 text-xs hover:text-white transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5 text-[#f59e08]" />{" "}
                    info@indiaipo.in
                  </a>
                  <a
                    href="tel:+917428337280"
                    className="flex items-center gap-2 text-white/60 text-xs hover:text-white transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-[#f59e08]" />{" "}
                    +91-74283-37280
                  </a>
                </div>
              </div>

              {/* Eligibility Check Card */}
              {(slug === "nse-emerge-eligibility-criteria" ||
                slug === "bse-sme-ipo-eligibility") && (
                <div className="bg-gradient-to-br from-[#0B1528] to-[#1E2E4A] rounded-2xl p-6 overflow-hidden relative border border-slate-800 shadow-xl transition-all duration-300 hover:scale-[1.02] group">
                  <div
                    className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20 bg-[#f59e08]"
                    style={{
                      filter: "blur(25px)",
                      transform: "translate(20%,-20%)",
                    }}
                  />
                  <div className="w-12 h-12 rounded-xl bg-[#f59e08]/10 flex items-center justify-center mb-4 border border-[#f59e08]/20">
                    <Shield className="h-6 w-6 text-[#f59e08]" />
                  </div>
                  <h3 className="font-black text-white text-base mb-2">
                    Check IPO Eligibility
                  </h3>
                  <p className="text-slate-400 text-xs mb-5 leading-relaxed">
                    Check if your company meets all financial & statutory
                    requirements to list on BSE/NSE.
                  </p>
                  <Link
                    href="/ipo-eligibility-check"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-black text-[#001529] transition-all hover:shadow-lg hover:shadow-[#f59e08]/20 group-hover:scale-105 bg-gradient-to-r from-[#f59e08] to-[#d97706] cursor-pointer"
                  >
                    Check IPO Eligibility{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
