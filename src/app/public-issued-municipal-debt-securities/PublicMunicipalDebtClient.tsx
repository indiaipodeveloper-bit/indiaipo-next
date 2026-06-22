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

const PublicMunicipalDebtClient = () => {
  const slug = "public-issued-municipal-debt-securities";
  const cfg = { accent: "#f59e08" };

  return (
    <ServicePageLayout slug={slug}>
      <div className="flex flex-col gap-12 relative">
                    <div className="w-full space-y-20">
                      {/* Section 1 */}
                      <div
                        id="empowering"
                        className="service-content-box service-content scroll-mt-24"
                      >
                        <div className="flex items-center gap-3 mb-6"></div>
                        <div className="row pt-2">
                          <div className="col-lg-12" id="e1">
                            <h2>
                              Empowering Indian Cities to Raise Capital for the
                              Public Good{" "}
                            </h2>
                            <p>
                              Urban India is once again on the fast track to
                              growth, but the entire system is struggling to
                              meet the demand for sustainable, contemporary
                              infrastructure. India IPO provides a platform for
                              the municipal bodies of India to access the
                              capital markets via Public Issues of Municipal
                              Debt Securities (MDS) — a regulated, transparent
                              and inclusive mechanism for financing public
                              infrastructure projects.
                            </p>
                          </div>
                        </div>
                        <div className="row mt-4">
                          <div className="col-lg-12" id="e2">
                            <h2>What Are Municipal Debt Securities?</h2>
                            <p className="mt-2">
                              Municipal Debt Securities Public Issue (MDS) are
                              the bonds issued by Urban Local Bodies (ULBs) such
                              as city corporations to fetch capital from the
                              general public to finance various important and
                              essential infrastructure projects such as roads,
                              water supply systems, waste collection systems,
                              transport hubs and green energy, etc.
                            </p>
                            <p className="mt-2">
                              With the help of Public Issued Municipal Debt
                              Securities, cities will no longer need to depend
                              only on government grants or rely on internal
                              revenues, but will now have direct access to
                              retail and institutional investor interest,
                              meaning citizens will have a direct stake in the
                              development of their city.
                            </p>
                          </div>
                        </div>

                        <div className="row mt-4">
                          <div className="col-lg-12" id="e3">
                            <h2>India IPO: Your End-to-End Advisory Partner</h2>
                            <p>
                              India IPO serves as a strategic advisory partner
                              to municipalities, smart city projects and
                              state-level urban development bodies. Our services
                              include:
                            </p>
                            <div className="orhp m-2" id="e4">
                              <h3> Eligibility Assessment</h3>
                              <ul>
                                <li id="faster-process">
                                  {" "}
                                  Assessment of Financial Health and
                                  Creditworthiness
                                </li>
                                <li id="confidentiality">
                                  Regulatory compliance review as per SEBI
                                  (Issue and Listing of Municipal Debt
                                  Securities) Regulations, 2015
                                </li>
                                <li id="targeted-investor-base">
                                  Review of Revenue models and ability to
                                  service Debt
                                </li>
                              </ul>
                            </div>

                            <div className="orhp m-2" id="e5">
                              <h3>Structuring the Bond Issue</h3>
                              <ul>
                                <li id="faster-process">
                                  {" "}
                                  Instrument design – secured/unsecured, tenure,
                                  coupon rate
                                </li>
                                <li id="confidentiality">
                                  Assistance in selecting the right bond
                                  category (general obligation, revenue bonds,
                                  etc.)
                                </li>
                                <li id="targeted-investor-base">
                                  Evaluation of tax-free bond eligibility
                                </li>
                              </ul>
                            </div>
                            <div className="orhp m-2" id="e6">
                              <h3>Drafting & Regulatory Filings</h3>
                              <ul>
                                <li id="faster-process">
                                  {" "}
                                  Preparation and Review of Draft Offer Document
                                  (DOD)
                                </li>
                                <li id="confidentiality">
                                  Coordination with{" "}
                                  <b>SEBI and designated stock exchanges </b>
                                </li>
                                <li id="targeted-investor-base">
                                  Integration of disclosures, project details,
                                  risk factors and repayment schedules
                                </li>
                              </ul>
                            </div>

                            <div className="orhp m-2" id="e7">
                              <h3>Intermediary Coordination</h3>
                              <ul>
                                <li id="faster-process">
                                  {" "}
                                  Liaison with{" "}
                                  <b>
                                    {" "}
                                    merchant bankers, credit rating agencies,
                                    legal advisors and debenture trustees{" "}
                                  </b>
                                </li>
                                <li id="confidentiality">
                                  End-to-end project management from approval to
                                  launch
                                </li>
                              </ul>
                            </div>

                            <div className="orhp m-2" id="e8">
                              <h3>
                                Investor Outreach & Subscription Management
                              </h3>
                              <ul>
                                <li id="faster-process">
                                  {" "}
                                  Investor education and marketing to increase
                                  retail and institutional participation
                                </li>
                                <li id="confidentiality">
                                  Digital and offline subscription management,
                                  including UPI-based platforms
                                </li>
                                <li id="confidentiality">
                                  Roadshows and webinars to raise awareness and
                                  trust
                                </li>
                              </ul>
                            </div>
                            <div className="orhp m-2" id="e9">
                              <h3>Listing & Post-Issue Support</h3>
                              <ul>
                                <li id="faster-process">
                                  {" "}
                                  Bond listing support on recognized stock
                                  exchanges (like NSE/BSE)
                                </li>
                                <li id="confidentiality">
                                  Assistance with secondary market trading
                                  readiness and disclosure compliance
                                </li>
                                <li id="confidentiality">
                                  Ongoing investor reporting and trustee
                                  coordination
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="row mt-20">
                          <div className="col-lg-12" id="e10">
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
                              {/* Heading */}
                              <div className="bg-[#001529] px-8 py-5">
                                <h3 className="text-2xl font-black text-white">
                                  Why Public Issue Over Private Placement?
                                </h3>
                              </div>

                              {/* Table */}
                              <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px] border-collapse">
                                  <thead className="bg-slate-100 border-b border-slate-200">
                                    <tr>
                                      <th className="px-8 py-5 text-left text-sm font-black text-slate-800 uppercase tracking-wide w-[25%]">
                                        Feature
                                      </th>

                                      <th className="px-8 py-5 text-left text-sm font-black text-[#f59e08] uppercase tracking-wide w-[37.5%]">
                                        Public Issue
                                      </th>

                                      <th className="px-8 py-5 text-left text-sm font-black text-slate-800 uppercase tracking-wide w-[37.5%]">
                                        Private Placement
                                      </th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {[
                                      {
                                        f: "Investor Base",
                                        pub: "General public & institutional investors",
                                        priv: "Select institutional investors",
                                      },

                                      {
                                        f: "Regulatory Oversight",
                                        pub: "Strict SEBI compliance with mandatory disclosures",
                                        priv: "Relatively relaxed compliance framework",
                                      },

                                      {
                                        f: "Market Visibility",
                                        pub: "Higher visibility through exchange listing",
                                        priv: "Lower visibility due to private trading",
                                      },

                                      {
                                        f: "Transparency",
                                        pub: "Detailed disclosures, reporting & ratings",
                                        priv: "Moderate transparency",
                                      },

                                      {
                                        f: "Fundraising Potential",
                                        pub: "Larger and scalable capital raising opportunity",
                                        priv: "Limited to selected investors",
                                      },
                                    ].map((row, ri) => (
                                      <tr
                                        key={ri}
                                        className="border-b border-slate-100 hover:bg-slate-50 transition"
                                      >
                                        <td className="px-8 py-6 font-bold text-slate-800 align-top">
                                          {row.f}
                                        </td>

                                        <td className="px-8 py-6 text-[#f59e08] font-semibold leading-7 align-top">
                                          {row.pub}
                                        </td>

                                        <td className="px-8 py-6 text-slate-600 leading-7 align-top">
                                          {row.priv}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row pt-2">
                          <div className="col-lg-12" id="e11">
                            <h3>Partner with India IPO</h3>
                            <p className="mt-3">
                              Whether you are a municipal commissioner, an urban
                              development official, or a smart city executive,
                              India IPO provides the knowledge, tools and
                              execution support to bring your Municipal Debt
                              Securities Public Issue to market seamlessly and
                              successfully.
                            </p>
                            <p>
                              Let’s build a future-ready India — city by city,
                              bond by bond.
                            </p>
                          </div>
                        </div>

                        <div className="row pt-2">
                          <div className="col-lg-12" id="e12">
                            <h4>Get Started Today</h4>
                            <p className="mt-2">
                              Book a free consultation with our Municipal
                              Finance Advisory Team.
                            </p>
                          </div>
                          <div className="col-lg-12">
                            <p>
                              Understand how IPOs work through our{" "}
                              <Link href="/ipo-process">IPO Process</Link> guide.
                              Stay updated with upcoming listings in the{" "}
                              <Link href="/reports">IPO Calendar</Link>
                              and read insights on our{" "}
                              <Link href="/ipo-blogs">
                                IPO Company Reviews — GMP, Subscription Status &
                                Allotment.
                              </Link>
                              Explore our blog for IPO guidance.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="bg-[#001529] p-12 md:p-20 rounded-[4rem] text-center space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f59e08] opacity-10 rounded-full -mr-32 -mt-32 blur-3xl" />
                        <h3 className="text-3xl font-black text-white">
                          Get Started Today
                        </h3>
                        <p className="text-white/60 text-lg max-w-xl mx-auto font-medium">
                          Book a free consultation with our Municipal Finance
                          Advisory Team.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
                          <Button
                            asChild
                            className="bg-[#f59e08] hover:bg-[#d97706] text-[#001529] font-black px-12 h-16 rounded-2xl text-lg"
                          >
                            <Link href="/contact">
                              Contact Us <ArrowRight className="ml-2 h-6 w-6" />
                            </Link>
                          </Button>
                          <div className="flex items-center gap-4 px-10 border border-white/10 rounded-2xl bg-white/5 h-16">
                            <Phone className="h-6 w-6 text-[#f59e08]" />
                            <span className="text-xl font-black text-white">
                              +91-74283-37280
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
    </ServicePageLayout>
  );
};

export default PublicMunicipalDebtClient;
