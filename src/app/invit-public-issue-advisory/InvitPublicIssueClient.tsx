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

const InvitPublicIssueClient = () => {
  const slug = "invit-public-issue-advisory";
  const cfg = { accent: "#f59e08" };

  return (
    <ServicePageLayout slug={slug}>
      <div className="flex flex-col gap-12 relative">
                    <div className="service-content-box service-content">
                      {" "}
                      <div className="space-y-10">
                        {/* e1 */}
                        <div className="row pt-2">
                          <div className="col-lg-12" id="e1">
                            <h2 className="text-2xl md:text-3xl font-black text-[#001529] mb-4">
                              Unlocking Capital via SEBI‑Compliant Public Issues
                              for Public or Privately‑Listed InvITs{" "}
                            </h2>
                            <p className="mt-3 text-slate-600 text-lg leading-relaxed">
                              A listed or private-listed InvIT can raise capital
                              in a public issue using a fresh issue and/or an
                              offer-for-sale to institutional, anchor and retail
                              investors. In the case of privately listed InvITs,
                              it transforms them into public InvITs under SEBI
                              guidelines, which provide liquidity, scale and
                              public float requirements.
                            </p>
                            <p className="mt-4 text-slate-600 text-lg leading-relaxed font-medium">
                              At India IPO, we deliver full‑service InvIT Public
                              Issue Advisory, providing capital structuring,
                              drafting of the Offer Document, SEBI coordination,
                              investor engagement, execution and post-listing
                              assurance.
                            </p>
                          </div>
                        </div>

                        {/* e2 */}
                        <div className="row mt-10">
                          <div className="col-lg-12" id="e2">
                            <h2 className="text-2xl md:text-3xl font-black text-[#001529] mb-4">
                              What is an InvIT Public Issue?
                            </h2>
                            <p className="mt-2 text-slate-600 leading-relaxed">
                              The InvIT public issue is a capital raising
                              process through the public issue of units to the
                              investors through a duly filed offer document with
                              SEBI and exchanges. When done by a privately
                              listed InvIT, this provides it with a public InvIT
                              status, which is also subject to SEBI eligibility
                              requirements, including unitholder consent,
                              lock-in of the sponsor, minimum public float
                              levels and disclosure standards consistent with
                              follow-on offerings.
                            </p>
                          </div>
                        </div>

                        {/* e3-e7 */}
                        <div className="row mt-10">
                          <div className="col-lg-12" id="e3">
                            <h2 className="text-2xl md:text-3xl font-black text-[#001529] mb-6">
                              InvIT Public Issue: Eligibility & Regulatory
                              Criteria
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                <h3
                                  id="e4"
                                  className="text-xl font-black text-[#001529] flex items-center gap-2"
                                >
                                  <ShieldCheck className="h-5 w-5 text-[#f59e08]" />{" "}
                                  Conversion & Eligibility Requirements
                                </h3>
                                <div className="orhp ml-2">
                                  <ul className="space-y-3">
                                    <li
                                      id="faster-process"
                                      className="text-sm text-slate-600 flex gap-2"
                                    >
                                      <CheckCircle className="h-4 w-4 text-[#f59e08] shrink-0 mt-0.5" />
                                      <span>
                                        <b>Unitholder Approval:</b> A privately
                                        listed InvIT will not be eligible to
                                        issue a public issue unless it obtains
                                        the approval of at least 75% of the
                                        unitholders (by value).
                                      </span>
                                    </li>
                                    <li
                                      id="confidentiality"
                                      className="text-sm text-slate-600 flex gap-2"
                                    >
                                      <CheckCircle className="h-4 w-4 text-[#f59e08] shrink-0 mt-0.5" />
                                      <span>
                                        <b>No Distribution Defaults:</b> InvIT
                                        should not have defaulted on payments in
                                        the last 3 financial years.
                                      </span>
                                    </li>
                                    <li
                                      id="targeted-investor-base"
                                      className="text-sm text-slate-600 flex gap-2"
                                    >
                                      <CheckCircle className="h-4 w-4 text-[#f59e08] shrink-0 mt-0.5" />
                                      <span>
                                        <b>SEBI Compliance:</b> Full adherence
                                        to SEBI (Infrastructure Investment
                                        Trusts) Regulations, including
                                        continuous listing requirements.
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h3
                                  id="e5"
                                  className="text-xl font-black text-[#001529] flex items-center gap-2"
                                >
                                  <AreaChart className="h-5 w-5 text-[#f59e08]" />{" "}
                                  Under-Construction Asset Exposure
                                </h3>
                                <div className="orhp ml-2">
                                  <ul className="space-y-3">
                                    <li
                                      id="faster-process"
                                      className="text-sm text-slate-600 flex gap-2"
                                    >
                                      <CheckCircle className="h-4 w-4 text-[#f59e08] shrink-0 mt-0.5" />
                                      <span>
                                        <b>Threshold Limit:</b> Listed InvITs
                                        will not be allowed to invest more than
                                        10% of the asset value in
                                        under-construction infrastructure.
                                      </span>
                                    </li>
                                    <li
                                      id="confidentiality"
                                      className="text-sm text-slate-600 flex gap-2"
                                    >
                                      <CheckCircle className="h-4 w-4 text-[#f59e08] shrink-0 mt-0.5" />
                                      <span>
                                        <b>Breach of Limit:</b> In case this
                                        limit is exceeded, the capital raising
                                        will have to take place through a
                                        private placement rather than a public
                                        issue.
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h3
                                  id="e6"
                                  className="text-xl font-black text-[#001529] flex items-center gap-2"
                                >
                                  <Lock className="h-5 w-5 text-[#f59e08]" />{" "}
                                  Sponsor Unitholding & Lock-In Norms
                                </h3>
                                <div className="orhp ml-2">
                                  <ul className="space-y-3">
                                    <li
                                      id="faster-process"
                                      className="text-sm text-slate-600 flex gap-2"
                                    >
                                      <CheckCircle className="h-4 w-4 text-[#f59e08] shrink-0 mt-0.5" />
                                      <span>
                                        <b>Minimum Holding:</b> Sponsors are
                                        required to hold 15% of post-issue
                                        units, which are locked in for 18
                                        months.
                                      </span>
                                    </li>
                                    <li
                                      id="confidentiality"
                                      className="text-sm text-slate-600 flex gap-2"
                                    >
                                      <CheckCircle className="h-4 w-4 text-[#f59e08] shrink-0 mt-0.5" />
                                      <span>
                                        <b>Relaxation Proposed:</b> Proposals by
                                        SEBI in August 2023 and April 2025 are
                                        to eliminate both sponsor and
                                        non-sponsor lock-ins, but only after the
                                        quality of disclosures and trust
                                        structure.
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h3
                                  id="e7"
                                  className="text-xl font-black text-[#001529] flex items-center gap-2"
                                >
                                  <Users className="h-5 w-5 text-[#f59e08]" />{" "}
                                  Public Float & Investor Limits
                                </h3>
                                <div className="orhp ml-2">
                                  <ul className="space-y-3">
                                    <li
                                      id="faster-process"
                                      className="text-sm text-slate-600 flex gap-2"
                                    >
                                      <CheckCircle className="h-4 w-4 text-[#f59e08] shrink-0 mt-0.5" />
                                      <span>
                                        <b>Minimum Public Holding:</b> At least
                                        25% of units must be held by public
                                        unitholders within 3 years of listing.
                                      </span>
                                    </li>
                                    <li
                                      id="confidentiality"
                                      className="text-sm text-slate-600 flex gap-2"
                                    >
                                      <CheckCircle className="h-4 w-4 text-[#f59e08] shrink-0 mt-0.5" />
                                      <span>
                                        <b>Cap on Institutional Holding:</b> No
                                        institutional or non-sponsor investor
                                        will hold more than 25% of the total
                                        units after issue.
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* e8 */}
                        <div className="row mt-10">
                          <div className="col-lg-12" id="e8">
                            <h2 className="text-2xl md:text-3xl font-black text-[#001529] mb-4">
                              Offer Document & Disclosure Standards
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                <div className="orhp">
                                  <ul className="space-y-2">
                                    <li id="confidentiality">
                                      <b className="text-[#001529] block mb-2">
                                        Disclosure Mandates:
                                      </b>
                                      <ul className="space-y-2 ml-4">
                                        <li className="text-sm text-slate-600 flex items-center gap-2">
                                          <ArrowRight className="h-3 w-3 text-[#f59e08]" />{" "}
                                          3 years of audited financials.
                                        </li>
                                        <li className="text-sm text-slate-600 flex items-center gap-2">
                                          <ArrowRight className="h-3 w-3 text-[#f59e08]" />{" "}
                                          Pro forma financials for acquired
                                          assets.
                                        </li>
                                        <li className="text-sm text-slate-600 flex items-center gap-2">
                                          <ArrowRight className="h-3 w-3 text-[#f59e08]" />{" "}
                                          Working capital sufficiency
                                          statements.
                                        </li>
                                        <li className="text-sm text-slate-600 flex items-center gap-2">
                                          <ArrowRight className="h-3 w-3 text-[#f59e08]" />{" "}
                                          Valuation methodology and asset NAV.
                                        </li>
                                        <li className="text-sm text-slate-600 flex items-center gap-2">
                                          <ArrowRight className="h-3 w-3 text-[#f59e08]" />{" "}
                                          Sponsor and related-party disclosures.
                                        </li>
                                      </ul>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex items-center">
                                <div className="orhp">
                                  <ul className="space-y-2">
                                    <li
                                      id="faster-process"
                                      className="text-sm text-slate-600 leading-relaxed"
                                    >
                                      <b className="text-[#001529] block mb-2 text-base">
                                        Follow-On Offer Alignment:
                                      </b>
                                      SEBI mandates that conversion of a private
                                      to a public issue will be as per follow-on
                                      public offer norms and is subject to
                                      faster and easier regulatory processing.
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* e9 */}
                        <div className="row mt-10">
                          <div className="col-lg-12" id="e9">
                            <h2 className="text-2xl md:text-3xl font-black text-[#001529] mb-4">
                              Distribution Norms
                            </h2>
                            <div className="bg-white shadow-2xl border border-slate-100 p-8 rounded-3xl">
                              <div className="orhp">
                                <ul className="space-y-6">
                                  <li className="text-slate-600 leading-relaxed">
                                    <b className="text-[#001529] text-lg block mb-1">
                                      Minimum Distribution:
                                    </b>
                                    The company is required to pay out 90% of
                                    its net distributable cash flows to
                                    unitholders every year.
                                  </li>
                                  <li id="confidentiality">
                                    <b className="text-[#001529] text-lg block mb-3">
                                      Distribution Frequency:
                                    </b>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <span className="font-bold text-[#001529] block">
                                          Public InvITs:
                                        </span>
                                        <span className="text-sm text-slate-600">
                                          Quarterly distributions.
                                        </span>
                                      </div>
                                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <span className="font-bold text-[#001529] block">
                                          Private InvITs:
                                        </span>
                                        <span className="text-sm text-slate-600">
                                          Semi-annual distributions.
                                        </span>
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* e10 */}
                        <div className="row mt-10">
                          <div className="col-lg-12" id="e10">
                            <h2 className="text-2xl md:text-3xl font-black text-[#001529] mb-4">
                              Accelerated Listing Timeline (T+3)
                            </h2>
                            <div className="bg-[#001529] text-white p-8 rounded-3xl relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f59e08] opacity-10 rounded-full -mr-16 -mt-16" />
                              <div className="orhp relative z-10">
                                <p className="text-lg leading-relaxed">
                                  With effect from November 1, 2025, InvITs that
                                  are publicly issued are required to be listed
                                  within 3 working days or T+3 of allotment,
                                  enhancing the liquidity of the market and
                                  confidence of investors.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* e11 */}
                        <div className="row mt-10">
                          <div className="col-lg-12" id="e11">
                            <h2 className="text-2xl md:text-3xl font-black text-[#001529] mb-4">
                              Trustee Oversight & Governance (as per Schedule X,
                              Reg 9(23))
                            </h2>
                            <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl">
                              <div className="orhp">
                                <p className="text-lg font-bold text-[#001529] mb-4">
                                  Trustees now have enhanced responsibilities
                                  under SEBI’s 2025 amendments:
                                </p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <li className="flex gap-3 text-slate-600 font-medium bg-white p-4 rounded-xl border border-slate-100">
                                    <CheckCircle className="h-5 w-5 text-[#f59e08] shrink-0" />{" "}
                                    Quarterly reviews of compliance.
                                  </li>
                                  <li className="flex gap-3 text-slate-600 font-medium bg-white p-4 rounded-xl border border-slate-100">
                                    <CheckCircle className="h-5 w-5 text-[#f59e08] shrink-0" />{" "}
                                    Monitoring of Investment Manager
                                    Appointments.
                                  </li>
                                  <li className="flex gap-3 text-slate-600 font-medium bg-white p-4 rounded-xl border border-slate-100">
                                    <CheckCircle className="h-5 w-5 text-[#f59e08] shrink-0" />{" "}
                                    Observation of Related-Party Transactions.
                                  </li>
                                  <li className="flex gap-3 text-slate-600 font-medium bg-white p-4 rounded-xl border border-slate-100">
                                    <CheckCircle className="h-5 w-5 text-[#f59e08] shrink-0" />{" "}
                                    In case of compliance issues, Direct
                                    Communication with Unitholders.
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* e12 */}
                        <div className="row mt-10">
                          <div className="col-lg-12" id="e12">
                            <h2 className="text-2xl md:text-3xl font-black text-[#001529] mb-4">
                              Post-Issue Communication & SEBI Compliance
                            </h2>
                            <div className="orhp bg-white border border-slate-200 p-8 rounded-3xl">
                              <ul className="space-y-4">
                                <li className="flex gap-4">
                                  <div className="w-10 h-10 rounded-full bg-[#f59e08]/10 flex items-center justify-center shrink-0">
                                    <FileText className="h-5 w-5 text-[#f59e08]" />
                                  </div>
                                  <span className="text-slate-600 leading-relaxed">
                                    <b>Allotment Disclosure:</b> Merchant
                                    bankers are required to disclose
                                    oversubscription information and allotment
                                    position within 10 days of listing.
                                  </span>
                                </li>
                                <li className="flex gap-4">
                                  <div className="w-10 h-10 rounded-full bg-[#f59e08]/10 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="h-5 w-5 text-[#f59e08]" />
                                  </div>
                                  <span className="text-slate-600 leading-relaxed">
                                    <b>Marketing Restrictions:</b> During the
                                    subscription window, only the offer document
                                    may be referenced in public communication—no
                                    advertisements, teasers, or promotional
                                    media.
                                  </span>
                                </li>
                                <li className="flex gap-4">
                                  <div className="w-10 h-10 rounded-full bg-[#f59e08]/10 flex items-center justify-center shrink-0">
                                    <UserCheck className="h-5 w-5 text-[#f59e08]" />
                                  </div>
                                  <span className="text-slate-600 leading-relaxed">
                                    <b>Compliance Officer:</b> A nominated
                                    officer is required to take care of legal,
                                    SEBI and post-listing disclosures till all
                                    units are completely dematerialised and
                                    listed.
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* e13-e18 */}
                        <div className="row mt-16 pt-10 border-t border-slate-200">
                          <div className="col-lg-12" id="e13">
                            <h2 className="text-3xl md:text-4xl font-black text-[#001529] mb-8 text-center">
                              <b>
                                India IPO InvIT Public Issue Advisory Service
                              </b>{" "}
                            </h2>

                            <div className="space-y-8">
                              <div className="row mt-2" id="e14">
                                <div className="col-lg-12">
                                  <h3 className="text-xl font-black text-[#001529] mb-3 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-[#001529] text-[#f59e08] flex items-center justify-center text-sm">
                                      1
                                    </span>
                                    Strategic Structuring & Eligibility
                                  </h3>
                                  <div className="orhp ml-10">
                                    <ul className="space-y-2">
                                      <li
                                        id="faster-process"
                                        className="text-slate-600 text-sm flex gap-2"
                                      >
                                        <CheckCircle className="h-4 w-4 text-[#f59e08] shrink-0 mt-0.5" />{" "}
                                        Evaluate public issue Eligibility vs.
                                        follow-on or private placement routes.
                                      </li>
                                      <li
                                        id="confidentiality"
                                        className="text-slate-600 text-sm flex gap-2"
                                      >
                                        <CheckCircle className="h-4 w-4 text-[#f59e08] shrink-0 mt-0.5" />{" "}
                                        Model capital raise size, dilution,
                                        sponsor shareholding, public float
                                        adherence and valuation impact.
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>

                              <div className="row mt-2" id="e15">
                                <div className="col-lg-12">
                                  <h3 className="text-xl font-black text-[#001529] mb-3 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-[#001529] text-[#f59e08] flex items-center justify-center text-sm">
                                      2
                                    </span>
                                    Offer Document Drafting & SEBI Coordination
                                  </h3>
                                  <div className="orhp ml-10">
                                    <ul className="space-y-2">
                                      <li
                                        id="faster-process"
                                        className="text-slate-600 text-sm flex gap-2"
                                      >
                                        <CheckCircle className="h-4 w-4 text-[#f59e08] shrink-0 mt-0.5" />{" "}
                                        Draft Offer Document compliant with SEBI
                                        Schedule A, inclusive of sponsor
                                        lock-ins, float targets and valuation
                                        disclosures.
                                      </li>
                                      <li
                                        id="confidentiality"
                                        className="text-slate-600 text-sm flex gap-2"
                                      >
                                        <CheckCircle className="h-4 w-4 text-[#f59e08] shrink-0 mt-0.5" />{" "}
                                        Manage SEBI comment handling, merchant
                                        banker coordination, underwriting terms,
                                        escrow settings and listing approvals.
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>

                              <div className="row mt-2" id="e16">
                                <div className="col-lg-12">
                                  <h3 className="text-xl font-black text-[#001529] mb-3 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-[#001529] text-[#f59e08] flex items-center justify-center text-sm">
                                      3
                                    </span>
                                    Investor Allocation & Pricing Strategy
                                  </h3>
                                  <div className="orhp ml-10">
                                    <ul className="space-y-2">
                                      <li
                                        id="faster-process"
                                        className="text-slate-600 text-sm flex gap-2"
                                      >
                                        <CheckCircle className="h-4 w-4 text-[#f59e08] shrink-0 mt-0.5" />{" "}
                                        Define allocation split—typically 75%
                                        institutional/anchor and 25%
                                        public/retail.
                                      </li>
                                      <li
                                        id="faster-process"
                                        className="text-slate-600 text-sm flex gap-2"
                                      >
                                        <CheckCircle className="h-4 w-4 text-[#f59e08] shrink-0 mt-0.5" />{" "}
                                        Recommend pricing methodology such as
                                        NAV or VWAP-based, aligned with investor
                                        demand and regulatory comfort.
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>

                              <div className="row mt-2" id="e17">
                                <div className="col-lg-12">
                                  <h3 className="text-xl font-black text-[#001529] mb-3 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-[#001529] text-[#f59e08] flex items-center justify-center text-sm">
                                      4
                                    </span>
                                    Subscription & Allotment Execution
                                  </h3>
                                  <div className="orhp ml-10">
                                    <ul className="space-y-2">
                                      <li
                                        id="faster-process"
                                        className="text-slate-600 text-sm flex gap-2"
                                      >
                                        <CheckCircle className="h-4 w-4 text-[#f59e08] shrink-0 mt-0.5" />{" "}
                                        Oversee the ASBA-based subscription
                                        process across categories.
                                      </li>
                                      <li
                                        id=""
                                        className="text-slate-600 text-sm flex gap-2"
                                      >
                                        <CheckCircle className="h-4 w-4 text-[#f59e08] shrink-0 mt-0.5" />{" "}
                                        Administer allotment basis, refund
                                        triggers, dematerialisation and
                                        registrar coordination; ensure timely
                                        listing and regulatory filings.
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>

                              <div className="row mt-2" id="e18">
                                <div className="col-lg-12">
                                  <h3 className="text-xl font-black text-[#001529] mb-3 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-[#001529] text-[#f59e08] flex items-center justify-center text-sm">
                                      5
                                    </span>
                                    Post‑Listing Governance & Compliance Setup
                                  </h3>
                                  <div className="orhp ml-10">
                                    <ul className="space-y-2">
                                      <li
                                        id="faster-process"
                                        className="text-slate-600 text-sm flex gap-2"
                                      >
                                        <CheckCircle className="h-4 w-4 text-[#f59e08] shrink-0 mt-0.5" />{" "}
                                        Support ongoing public float monitoring
                                        compliance until the three-year horizon.
                                      </li>
                                      <li
                                        id="faster-process"
                                        className="text-slate-600 text-sm flex gap-2"
                                      >
                                        <CheckCircle className="h-4 w-4 text-[#f59e08] shrink-0 mt-0.5" />{" "}
                                        Enable trustee oversight, investor
                                        grievance redressal system, periodic NAV
                                        reporting, quarterly financial filings
                                        and LODR-aligned compliance.
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* e19 */}
                        <div className="row mt-12 bg-slate-50 p-8 rounded-3xl border border-slate-200">
                          <div className="col-lg-12" id="e19">
                            <h3 className="text-2xl font-black text-[#001529] mb-6">
                              Benefits: What Clients Gain
                            </h3>
                            <div className="orhp">
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <li
                                  id="faster-process"
                                  className="text-sm text-slate-600 flex gap-2"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />{" "}
                                  <b>Broader Capital Access:</b> Enables
                                  fundraising from institutional, anchor and
                                  retail segments, enhancing liquidity and
                                  valuation.
                                </li>
                                <li
                                  id="faster-process"
                                  className="text-sm text-slate-600 flex gap-2"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />{" "}
                                  <b>Regulatory Compliance Assurance:</b> Fully
                                  aligned with SEBI’s 2022 conversion framework,
                                  August 2023 lock-in reforms and potential July
                                  2025 relaxations.
                                </li>
                                <li className="text-sm text-slate-600 flex gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />{" "}
                                  <b>Sponsor Integrity & Governance:</b>{" "}
                                  Structured unitholding and float obligations
                                  integrated into issuance strategy.
                                </li>
                                <li className="text-sm text-slate-600 flex gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />{" "}
                                  <b>Administrative Efficiency:</b> End-to-end
                                  orchestration—from structuring to
                                  documentation, issuance and governance.
                                </li>
                                <li className="text-sm text-slate-600 flex gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />{" "}
                                  <b>Modular Engagement Options:</b> Clients can
                                  choose from full-service execution, offer
                                  document-only, or strategic advisory.{" "}
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* e20 */}
                        <div className="row mt-12">
                          <div className="col-lg-12" id="e20">
                            <h3 className="text-2xl font-black text-[#001529] mb-6 text-center">
                              Why Choose India IPO InvIT Advisory
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                <b className="text-[#001529] block mb-2">
                                  Regulatory Precision:
                                </b>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                  Deep expertise in the SEBI InvIT regime and
                                  evolving conversion norms.
                                </p>
                              </div>
                              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                <b className="text-[#001529] block mb-2">
                                  Institutional Network:
                                </b>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                  Access to high-quality institutional, anchor
                                  and retail investor participation.
                                </p>
                              </div>
                              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                <b className="text-[#001529] block mb-2">
                                  Governance Focus:
                                </b>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                  Compliance architecture from inception to
                                  post-listing float monitoring and trustee
                                  coordination.
                                </p>
                              </div>
                              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                <b className="text-[#001529] block mb-2">
                                  Flexible Advisory Model:
                                </b>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                  Engage us for full turnkey projects,
                                  documentation support, or standalone advisory.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* e21 */}
                        <div className="row mt-12 pt-10 border-t border-slate-200">
                          <div className="col-lg-12" id="e21">
                            <h3 className="text-2xl font-black text-[#001529] mb-4">
                              Build Your Public InvIT With Confidence
                            </h3>
                            <p className="text-slate-600 text-lg leading-relaxed">
                              Our InvIT advisory model prepares sponsors to
                              execute a smooth transformation of their private
                              InvITs to public units within the emerging SEBI
                              framework. We assist you in bringing the compliant
                              and successful InvIT public issue through
                              strategic structuring, preparation of the Offer
                              Document, engagement of investors, execution and
                              governance of the issue.{" "}
                            </p>
                          </div>

                          <div className="col-lg-12 mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                            <p className="text-sm text-slate-600 leading-relaxed">
                              Understand how IPOs work through our{" "}
                              <Link href="/ipo-process"
                                className="text-[#f59e08] font-bold hover:underline"
                              >
                                IPO Process
                              </Link>{" "}
                              guide. Stay updated with upcoming listings in the{" "}
                              <Link href="/reports"
                                className="text-[#f59e08] font-bold hover:underline"
                              >
                                IPO Calendar
                              </Link>
                              and read insights on our{" "}
                              <Link href="/ipo-blogs"
                                className="text-[#f59e08] font-bold hover:underline"
                              >
                                IPO Company Reviews — GMP, Subscription Status &
                                Allotment.
                              </Link>
                              Explore our blog for IPO guidance.
                            </p>
                          </div>
                        </div>

                        <div className="container my-10">
                          <div className="row justify-content-center">
                            <div className="col-md-6 text-center">
                              <Button
                                asChild
                                className="bg-[#f59e08] hover:bg-[#d97706] text-[#001529] font-black rounded-full px-12 h-14 shadow-lg hover:scale-105 transition-all"
                              >
                                <Link href="/contact">Contact Us</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
    </ServicePageLayout>
  );
};

export default InvitPublicIssueClient;
