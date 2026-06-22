"use client";

import React from "react";
import Link from "next/link";
import ServicePageLayout from "@/components/ServicePageLayout";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Phone,
  Mail,
  Home,
  Shield,
  Clock,
  Users,
  Star,
  Award,
  Zap,
  Target,
  Wallet,
  ChevronDown,
  ChevronUp,
  BookOpen,
  FileText,
  TrendingUp,
  MessageSquare,
  Building2,
  Globe,
  BarChart3,
  LayoutDashboard,
  AreaChart,
  ShieldCheck,
  Lock,
  UserCheck,
  Scale,
  HeartPulse,
  Calendar,
  Coins,
  Landmark,
} from "lucide-react";

const MainstreamReitClient = () => {
  const slug = "mainstream-reit-structuring";
  const cfg = { accent: "#f59e08" };

  return (
    <ServicePageLayout slug={slug}>
      <div className="flex flex-col gap-12 relative">
                    <div className="w-full space-y-20">
                      <div
                        id="reit-overview"
                        className="service-content-box service-content scroll-mt-24"
                      >
                        <div className="mb-0">
                          <div className="row pt-2">
                            <div className="col-lg-12" id="e1">
                              <h2>
                                Bringing Institutional Real Estate to the Public
                                Markets{" "}
                              </h2>
                              <p className="mt-3">
                                The real estate industry in India is
                                transforming asset-based models to
                                capital-intensive approaches. To developers,
                                asset owners and investment platforms with
                                large-scale income-generating assets, Real
                                Estate Investment Trusts (REITs) provide an
                                opportunity of a lifetime to raise long-term
                                capital without losing property control.
                              </p>
                              <p className="mt-2">
                                REITs unlock the value of stabilized rental
                                portfolios by turning them into publicly traded
                                units that allow constant income distributions
                                to investors and liquidity to sponsors. Now its
                                the right time to consider issuing REITs in
                                India with a strong regulatory framework of SEBI
                                and an increasing appetite of investors.
                              </p>
                              <p className="mt-2">
                                India IPO being one of the best REIT issue
                                consultants India enables you to design,
                                structure and list your REIT in a fully
                                regulatory-compliant, investor-friendly friendly
                                and execution-assisted manner- from concept to
                                IPO and beyond.
                              </p>
                            </div>
                          </div>
                          <div className="row mt-4">
                            <div className="col-lg-12" id="e2">
                              <h2>What is a REIT?</h2>
                              <p className="mt-2">
                                A REIT (Real Estate Investment Trust) is an
                                investment vehicle that is based on trusts that
                                own and manage income-producing real estate and
                                pass most of its income to the unit holders.
                                REITs are listed on the stock exchange and are
                                governed by SEBI to provide transparency,
                                governance and retail/institutional investor
                                confidence.
                              </p>
                            </div>
                          </div>
                          <div className="row mt-4">
                            <div className="col-lg-12" id="e3">
                              <h3>Key Highlights:</h3>
                              <div className="orhp m-2">
                                <ul>
                                  <li id="faster-process">
                                    {" "}
                                    Pooling of capital in a trust structure by
                                    public investors
                                  </li>
                                  <li id="confidentiality">
                                    {" "}
                                    Portfolio consists of office parks, malls,
                                    warehouses, etc.
                                  </li>
                                  <li id="targeted-investor-base">
                                    Compulsory listing and income distribution
                                    quarterly
                                  </li>
                                  <li id="targeted-investor-base">
                                    Units are traded on NSE/BSE just as equity
                                    shares
                                  </li>
                                  <li id="targeted-investor-base">
                                    Open to retail, HNI and institutional
                                    investors
                                  </li>
                                </ul>
                              </div>
                              <div className="row mt-3">
                                <div className="col-lg-12" id="e4">
                                  <h2>
                                    India IPO’s End-to-End REIT Advisory
                                    Services
                                  </h2>
                                  <p>
                                    As a real estate developer, sponsor group,
                                    private equity owner or asset manager, we
                                    support you to transfer your
                                    yield-generating asset portfolio to the REIT
                                    market in India in an efficient and
                                    compliant way.
                                  </p>
                                  <div className="row mt-2">
                                    <div className="col-lg-12" id="e5">
                                      <h3>
                                        1. Initial Eligibility & Structuring
                                      </h3>
                                      <div className="orhp m-2">
                                        <ul>
                                          <li id="faster-process">
                                            Technical and commercial due
                                            diligence on assets
                                          </li>
                                          <li id="confidentiality">
                                            Lease audit and tenant quality
                                            analysis
                                          </li>
                                          <li id="targeted-investor-base">
                                            Title verification and legal
                                            documentation review{" "}
                                          </li>
                                          <li id="targeted-investor-base">
                                            Capital structuring & income
                                            simulation models
                                          </li>
                                          <li id="targeted-investor-base">
                                            SPV consolidation and property
                                            transfer planning
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row mt-2">
                                    <div className="col-lg-12" id="e6">
                                      <h3>2. REIT Trust & Entity Formation</h3>
                                      <div className="orhp m-2">
                                        <ul>
                                          <li id="faster-process">
                                            Drafting and registration of the
                                            REIT Trust under the Indian Trusts
                                            Act
                                          </li>
                                          <li id="confidentiality">
                                            Formation of SPVs (Special Purpose
                                            Vehicles)
                                          </li>
                                          <li id="targeted-investor-base">
                                            Appointment of Sponsor, Manager and
                                            Trustee
                                          </li>
                                          <li id="targeted-investor-base">
                                            Defining scheme structure and
                                            segregation of assets
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row mt-2">
                                    <div className="col-lg-12" id="e7">
                                      <h3>
                                        3. Regulatory Advisory & SEBI Compliance
                                      </h3>
                                      <div className="orhp m-2">
                                        <ul>
                                          <li id="faster-process">
                                            Preparation and filing of REIT Offer
                                            Document via SEBI-registered
                                            Merchant Banker
                                          </li>
                                          <li id="faster-process">
                                            Coordination with legal, financial
                                            and valuation experts
                                          </li>
                                          <li id="confidentiality">
                                            <p className="text-[#001529] uppercase font-bold tracking-wide">
                                              Filing under:
                                            </p>
                                            <ul className="nested-list">
                                              <li>
                                                SEBI (REIT) Regulations, 2014
                                              </li>
                                              <li>SEBI (ICDR) Regulations</li>
                                              <li>Companies Act, 2013</li>
                                            </ul>
                                          </li>
                                          <li id="faster-process">
                                            Approval management with SEBI and
                                            stock exchanges
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row mt-2">
                                    <div className="col-lg-12" id="e8">
                                      <h3>
                                        4. Intermediary Management & Due Process
                                      </h3>
                                      <div className="orhp m-2">
                                        <ul>
                                          <li id="confidentiality">
                                            <p className="text-[#001529] uppercase font-bold tracking-wide">
                                              Appointment of:
                                            </p>
                                            <ul className="nested-list">
                                              <li>
                                                Independent Trustee
                                                (SEBI-registered,
                                                non-affiliated)
                                              </li>
                                              <li>
                                                {" "}
                                                Valuer (5+ years in commercial
                                                real estate)
                                              </li>
                                              <li>
                                                Custodians, Registrars,
                                                Auditors, Legal Advisors
                                              </li>
                                            </ul>
                                          </li>
                                          <li id="faster-process">
                                            Setting up escrow, depository and
                                            investor communication systems
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row mt-2">
                                    <div className="col-lg-12" id="e9">
                                      <h3>
                                        5. Listing, Distribution & Post-Issue
                                        Support
                                      </h3>
                                      <div className="orhp m-2">
                                        <ul>
                                          <li id="faster-process">
                                            Listing of REIT units on the NSE/BSE
                                            mainboard
                                          </li>
                                          <li id="faster-process">
                                            Coordination with broker networks
                                            for IPO subscription
                                          </li>
                                          <li id="faster-process">
                                            Ongoing compliance: disclosures,
                                            audits, governance
                                          </li>
                                          <li id="faster-process">
                                            Quarterly distribution management to
                                            unit holders
                                          </li>
                                          <li id="faster-process">
                                            Support for rights issues,
                                            acquisitions and mergers
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row mt-10">
                          <div className="col-lg-12" id="e10">
                            {/* Main Container */}
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                              {/* Header */}
                              <div className="bg-[#001529] px-8 py-5">
                                <h2 className="text-3xl font-black text-white">
                                  SEBI REIT Regulatory Requirements
                                </h2>
                              </div>

                              {/* Table Wrapper */}
                              <div className="overflow-x-auto">
                                <table className="w-full min-w-[1000px] border-collapse">
                                  {/* Table Head */}
                                  <thead className="bg-slate-100 border-b border-slate-200">
                                    <tr>
                                      <th className="px-8 py-5 text-left text-sm font-black uppercase tracking-wide text-slate-800 w-[35%]">
                                        Regulatory Parameter
                                      </th>

                                      <th className="px-8 py-5 text-left text-sm font-black uppercase tracking-wide text-[#f59e08] w-[65%]">
                                        Requirement
                                      </th>
                                    </tr>
                                  </thead>

                                  {/* Table Body */}
                                  <tbody>
                                    {[
                                      {
                                        param: "Minimum Asset Value",
                                        req: "₹500 crore or more of completed rent-generating assets",
                                      },

                                      {
                                        param: "Minimum Issue Size",
                                        req: "₹250 crore or more public offer",
                                      },

                                      {
                                        param: "Sponsor Commitment",
                                        req: "Minimum 15% holding for 3 years",
                                      },

                                      {
                                        param: "Public Holding",
                                        req: "At least 25% of post-issue capital",
                                      },

                                      {
                                        param: "Distribution Mandate",
                                        req: "90% of Net Distributable Cash Flow (NDCF) must be distributed semi-annually",
                                      },

                                      {
                                        param: "Leverage Limit",
                                        req: "Up to 49% of asset value. Above 25% requires credit rating",
                                      },

                                      {
                                        param: "Valuation",
                                        req: "Half-yearly valuation and upon acquisitions or disposals",
                                      },

                                      {
                                        param: "Related Party Transactions",
                                        req: "Allowed only with unit-holder and Trustee approval",
                                      },

                                      {
                                        param: "Trustee",
                                        req: "Must remain independent of Sponsor and Manager",
                                      },

                                      {
                                        param: "Investment Restrictions",
                                        req: "Maximum 20% in under-construction assets and minimum 80% in completed income-generating properties",
                                      },
                                    ].map((row, index) => (
                                      <tr
                                        key={index}
                                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                                      >
                                        {/* Left Column */}
                                        <td className="px-8 py-6 align-top">
                                          <div className="font-bold text-slate-800 leading-7">
                                            {row.param}
                                          </div>
                                        </td>

                                        {/* Right Column */}
                                        <td className="px-8 py-6 align-top">
                                          <div className="text-slate-600 leading-7 font-medium">
                                            {row.req}
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row mt-4">
                          <div className="col-lg-12" id="e11">
                            <h2>Ideal Use Cases for REIT Structuring</h2>
                            <div className="orhp m-2">
                              <ul>
                                <li id="faster-process">
                                  Institutional-grade
                                  <b> office parks, IT SEZs, retail malls</b>
                                </li>
                                <li id="confidentiality">
                                  <b>Industrial parks, logistics hubs</b> and
                                  warehousing facilities
                                </li>
                                <li id="targeted-investor-base">
                                  Portfolios of leased assets held by{" "}
                                  <b> developers or private equity funds</b>
                                </li>
                                <li id="targeted-investor-base">
                                  <b>Yield-focused </b>investors looking to exit
                                  or partially monetize income assets
                                </li>
                                <li>
                                  {" "}
                                  Conversion of{" "}
                                  <b>
                                    {" "}
                                    privately pooled real estate platforms
                                  </b>{" "}
                                  into public REITs
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="row mt-4">
                          <div className="col-lg-12" id="e12">
                            <h3>
                              Conversion & Listing of Existing Real Estate
                              Platforms
                            </h3>
                            <p>
                              If you're managing a{" "}
                              <b> Fractional Ownership Platform (FOP),</b>{" "}
                              YieldCo, or private asset pool:
                            </p>
                            <div className="orhp m-2">
                              <ul>
                                <li id="faster-process">
                                  We offer <b> migration advisory</b> to align
                                  with REIT norms
                                </li>
                                <li id="confidentiality">
                                  We support{" "}
                                  <b>
                                    SEBI-compliant trust setup, investor
                                    conversion & filing
                                  </b>
                                </li>
                                <li id="targeted-investor-base">
                                  We help align SPV ownership, asset vetting and
                                  unit listing
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="row mt-4">
                          <div className="col-lg-12" id="e13">
                            <h3>Governance, Lock-In & Investor Protection</h3>
                            <div className="orhp m-2">
                              <ul>
                                <li id="faster-process">
                                  <b>Trustee-led control </b> for transparency
                                  and accountability
                                </li>
                                <li id="confidentiality">
                                  <b> Sponsor lock-in </b> of 15% units for 3
                                  years (minimum)
                                </li>
                                <li id="targeted-investor-base">
                                  <b> Quarterly reporting,</b> annual AGMs &
                                  mandatory financial disclosures
                                </li>
                                <li id="targeted-investor-base">
                                  <b>No related party transactions </b> without
                                  prior approval
                                </li>
                                <li id="targeted-investor-base">
                                  <b>Valuation reports & audit schedules </b>{" "}
                                  enforced under SEBI guidelines
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="row mt-4">
                          <div className="col-lg-12" id="e14">
                            <h3>Why India IPO?</h3>
                            <div className="orhp m-2">
                              <ul>
                                <li id="faster-process">
                                  Proven track record in listing large-scale
                                  capital market instruments
                                </li>
                                <li id="confidentiality">
                                  Strong compliance frameworks and regulatory
                                  network
                                </li>
                                <li id="targeted-investor-base">
                                  Partner ecosystem of SEBI-registered
                                  intermediaries
                                </li>
                                <li id="targeted-investor-base">
                                  {" "}
                                  Full handholding from idea to public market
                                  debut
                                </li>
                                <li id="targeted-investor-base">
                                  Post-issue support for governance, investor
                                  relations and reporting
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="row pt-2">
                          <div className="col-lg-12" id="e15">
                            <h3>
                              Let’s Take Your Real Estate Assets to the Public
                              Market
                            </h3>
                            <p className="mt-2">
                              If you have ₹500 crore+ in leased assets or want
                              to build a REIT-ready portfolio — India IPO will
                              walk with you across structuring, SEBI approval,
                              public issue and SEBI REIT listing.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        id="regulatory"
                        className="bg-[#001529] rounded-[3rem] p-10 md:p-14 text-white overflow-hidden relative scroll-mt-24"
                      >
                        <div
                          className="absolute inset-0 opacity-5 pointer-events-none"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle, #f59e08 1px, transparent 1px)",
                            backgroundSize: "25px 25px",
                          }}
                        />
                        <div className="relative z-10 space-y-10">
                          <div className="text-center space-y-3">
                            <h3 className="text-3xl font-black">
                              SEBI REIT Regulatory Framework
                            </h3>
                            <p className="text-white/40 text-sm font-medium">
                              Core parameters for listing a successful REIT in
                              India
                            </p>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-white/10">
                                  <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-[#f59e08]">
                                    Parameter
                                  </th>
                                  <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-[#f59e08]">
                                    SEBI Requirement
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {[
                                  {
                                    l: "Minimum Asset Value",
                                    r: "₹500 crore+ (primarily completed, income-generating assets)",
                                  },
                                  {
                                    l: "Minimum Issue Size",
                                    r: "₹250 crore public issue",
                                  },
                                  {
                                    l: "Sponsor Commitment",
                                    r: "Minimum 15% holding for at least 3 years",
                                  },
                                  {
                                    l: "Public Holding",
                                    r: "At least 25% of total units post-issue",
                                  },
                                  {
                                    l: "Distribution Mandate",
                                    r: "Minimum 90% of Net Distributable Cash Flows (NDCF) to be distributed (typically quarterly in practice)",
                                  },
                                  {
                                    l: "Leverage Limit",
                                    r: "Up to 49% of asset value; extendable up to 70% with unitholder approval and credit rating",
                                  },
                                  {
                                    l: "Investment Rule",
                                    r: "Minimum 80% in completed, income-generating assets",
                                  },
                                ].map((row, ri) => (
                                  <tr
                                    key={ri}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                  >
                                    <td className="py-4 px-6 text-sm font-bold text-white/80">
                                      {row.l}
                                    </td>
                                    <td className="py-4 px-6 text-sm font-medium text-white/60">
                                      {row.r}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      <div id="use-cases" className="space-y-8 scroll-mt-24">
                        <div className="flex items-center gap-3 pt-10">
                          <div
                            className="w-1.5 h-8 rounded-full"
                            style={{ background: cfg.accent }}
                          />
                          <h2 className="text-3xl md:text-4xl font-black text-[#001529]">
                            Ideal REIT Use Cases
                          </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {[
                            "Grade-A Office Parks & IT SEZs",
                            "Retail Malls & High-Street Portfolios",
                            "Industrial Logistics & Warehousing Assets",
                            "Stabilised, Income-Generating Real Estate Portfolios",
                          ].map((ind, ii) => (
                            <div
                              key={ii}
                              className="p-6 shadow-2xl bg-slate-50 border border-slate-200 rounded-3xl flex items-center gap-4 group hover:bg-[#f59e08]/10 transition-all"
                            >
                              <div className="w-1.5 h-8 bg-slate-200 group-hover:bg-[#f59e08] rounded-full transition-colors" />
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#001529]">
                                {ind}
                              </h4>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div
                        id="why-us"
                        className="bg-[linear-gradient(135deg,_rgb(245,158,8),_rgb(217,119,6))] border border-orange-100 p-12 md:p-16 rounded-[3rem] flex flex-col md:flex-row items-center gap-12 scroll-mt-24"
                      >
                        <div className="flex-1 space-y-6 text-center md:text-left">
                          <h3 className="text-3xl font-black text-[#001529]">
                            Why{" "}
                            <strong style={{ color: "#fff" }}>
                              India IPO?
                            </strong>
                          </h3>
                          <div className="grid grid-cols-1 gap-4">
                            {[
                              "Proven track record in listing large-scale capital market instruments.",
                              "Strong compliance frameworks and extensive regulatory network.",
                              "Elite partner ecosystem of professional Merchant Bankers and Trustees.",
                              "Post-issue support for Governance, Investor Relations, and Reporting.",
                            ].map((point, pi) => (
                              <div key={pi} className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-[#f59e08] shrink-0" />
                                <span className="text-sm font-bold text-slate-700">
                                  {point}
                                </span>
                              </div>
                            ))}
                          </div>
                          <Button
                            asChild
                            className="bg-[#001529] hover:bg-[#003366] text-white h-14 rounded-2xl px-10 font-bold mt-4 w-full md:w-auto"
                          >
                            <Link href="/contact">
                              Monetize Your Leased Assets{" "}
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                          </Button>
                        </div>
                        <div className="w-full md:w-1/3 bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 text-center space-y-4">
                          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto">
                            <div style={{ color: cfg.accent }}>
                              <Target className="h-8 w-8" />
                            </div>
                          </div>
                          <h4 className="font-black text-[#001529]">
                            Launch Your REIT
                          </h4>
                          <p className="text-slate-400 text-xs font-bold leading-relaxed">
                            For portfolios of ₹500 crore+ in leased assets.
                          </p>
                          <div className="text-2xl font-black text-[#001529]">
                            +91-74283-37280
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
    </ServicePageLayout>
  );
};

export default MainstreamReitClient;
