"use client";

import React from "react";
import Link from "next/link";
import ServicePageLayout from "@/components/ServicePageLayout";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Phone,
} from "lucide-react";

const PrivateMunicipalDebtClient = () => {
  const slug = "privately-issued-municipal-debt-securities";
  const cfg = { accent: "#f59e08" };

  return (
    <ServicePageLayout slug={slug}>
      <div className="flex flex-col gap-12 relative">
                    <div className="w-full space-y-20">
                      {/* Section 1 */}
                      <div
                        id="private-empowering"
                        className="service-content-box service-content scroll-mt-24"
                      >
                        <div className="row pt-2">
                          <div className="col-lg-12">
                            <h2 className="text-3xl font-black text-[#001529] mb-6 leading-tight">
                              Secured and Highly Targeted Capital Sourcing for
                              Indian Municipalities
                            </h2>
                            <p className="text-lg leading-relaxed text-slate-700">
                              Rapid urban growth demands swift, efficient, and
                              substantial funding channels. India IPO acts as a
                              strategic advisory partner for Urban Local Bodies
                              (ULBs), smart city special purpose vehicles, and
                              public utilities, enabling them to raise targeted
                              capital via Private Placements of Municipal Debt
                              Securities (MDS). This compliant and streamlined
                              mechanism bridges the gap between major
                              institutional investors and critical city
                              development initiatives.
                            </p>
                          </div>
                        </div>

                        <div className="row mt-12">
                          <div className="col-lg-12">
                            <h2 className="text-2xl font-black mb-4">
                              What Are Privately Issued Municipal Debt
                              Securities?
                            </h2>
                            <p className="mt-2 text-slate-600 leading-relaxed">
                              Privately Issued Municipal Debt Securities
                              (Private MDS) are debt instruments issued by city
                              corporations, development authorities, or
                              municipal bodies to a select group of qualified
                              institutional buyers (QIBs), such as banks, mutual
                              funds, insurance companies, and pension funds.
                              Unlike public issues, private placement focuses on
                              high-value, sophisticated investors, significantly
                              reducing execution timelines and administrative
                              overhead while unlocking secure financing for key
                              infrastructure.
                            </p>
                          </div>
                        </div>

                        <div className="row mt-16">
                          <div className="col-lg-12">
                            <h2 className="text-2xl font-black mb-6">
                              Expert Advisory Across Every Stage
                            </h2>
                            <p className="text-slate-500 mb-10">
                              Our dedicated municipal finance team guides public
                              entities through the complex structuring, rating,
                              and regulatory requirements of private debt
                              issuance. We provide complete advisory including:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                <h3 className="text-lg font-black text-[#001529]">
                                  Institutional Investor Mapping
                                </h3>
                                <div className="orhp text-sm text-slate-600">
                                  <ul className="space-y-2">
                                    <li>
                                      Identifying active institutional debt
                                      investors, pension funds, and domestic
                                      financial institutions.
                                    </li>
                                    <li>
                                      Pre-placement engagement to align
                                      interest, terms, and expectations.
                                    </li>
                                    <li>
                                      Securing anchor commitments to ensure
                                      successful issue subscription.
                                    </li>
                                  </ul>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h3 className="text-lg font-black text-[#001529]">
                                  Custom Instrument Structuring
                                </h3>
                                <div className="orhp text-sm text-slate-600">
                                  <ul className="space-y-2">
                                    <li>
                                      Tailoring debt terms – coupon rates,
                                      amortization schedules, escrow structures,
                                      and redemption plans.
                                    </li>
                                    <li>
                                      Designing credit enhancement features like
                                      state government guarantees or debt
                                      service reserve funds (DSRF).
                                    </li>
                                    <li>
                                      Structuring revenue-backed bonds tied to
                                      specific city receipts (e.g., water
                                      tariffs, property tax).
                                    </li>
                                  </ul>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h3 className="text-lg font-black text-[#001529]">
                                  Offer Document & Regulatory Advisory
                                </h3>
                                <div className="orhp text-sm text-slate-600">
                                  <ul className="space-y-2">
                                    <li>
                                      Drafting premium Private Placement Offer
                                      Letters (PPOL) in compliance with SEBI MDS
                                      Regulations.
                                    </li>
                                    <li>
                                      Managing coordination with SEBI-registered
                                      trustees, CAs, legal advisors, and credit
                                      rating agencies.
                                    </li>
                                    <li>
                                      Securing listing permissions on recognized
                                      exchanges (NSE/BSE) for secondary market
                                      liquidity.
                                    </li>
                                  </ul>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h3 className="text-lg font-black text-[#001529]">
                                  Escrow & Cash Flow Engineering
                                </h3>
                                <div className="orhp text-sm text-slate-600">
                                  <ul className="space-y-2">
                                    <li>
                                      Setting up secure, structured escrow
                                      accounts to manage revenue flows and debt
                                      servicing.
                                    </li>
                                    <li>
                                      Engineering payment waterfall mechanisms
                                      to guarantee investor safety and enhance
                                      bond ratings.
                                    </li>
                                    <li>
                                      Ensuring transparent project monitoring
                                      and ongoing compliance reporting.
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row mt-20">
                          <div className="col-lg-12">
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
                              <div className="bg-[#001529] px-8 py-5">
                                <h3 className="text-2xl font-black text-white">
                                  Key Parameters: Private Placement vs Public
                                  Issue
                                </h3>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px] border-collapse">
                                  <thead className="bg-slate-100 border-b border-slate-200">
                                    <tr>
                                      <th className="px-8 py-5 text-left text-sm font-black text-slate-800 uppercase tracking-wide w-[25%]">
                                        Feature
                                      </th>
                                      <th className="px-8 py-5 text-left text-sm font-black text-[#f59e08] uppercase tracking-wide w-[37.5%]">
                                        Private Placement MDS
                                      </th>
                                      <th className="px-8 py-5 text-left text-sm font-black text-slate-800 uppercase tracking-wide w-[37.5%]">
                                        Public Issue MDS
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {[
                                      {
                                        f: "Target Investor Base",
                                        priv: "Select qualified institutional buyers (pension funds, insurance, banks, mutual funds)",
                                        pub: "Retail public, HNIs, and broad institutional pools",
                                      },
                                      {
                                        f: "Time to Market",
                                        priv: "Fast-track execution (typically 4–8 weeks)",
                                        pub: "Longer execution (typically 12–20 weeks) due to mandatory public reviews",
                                      },
                                      {
                                        f: "Issuance Costs",
                                        priv: "Highly cost-effective (minimal marketing, printing, and retail fees)",
                                        pub: "Higher costs (large advertising, distribution, syndicate, and retail underwriting fees)",
                                      },
                                      {
                                        f: "Structuring Flexibility",
                                        priv: "Highly customizable to match specific institutional covenants",
                                        pub: "Standardized structures to suit retail risk-return preferences",
                                      },
                                      {
                                        f: "Minimum Credit Rating",
                                        priv: "Mandatory rating from at least one SEBI-registered agency",
                                        pub: "Mandatory investment-grade rating (typically from two agencies)",
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
                                          {row.priv}
                                        </td>
                                        <td className="px-8 py-6 text-slate-600 leading-7 align-top">
                                          {row.pub}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row mt-16 text-center">
                          <div className="col-lg-12">
                            <h3 className="text-2xl font-black text-[#001529] mb-4">
                              Partner with India IPO
                            </h3>
                            <p className="text-slate-600 max-w-2xl mx-auto mb-6">
                              Whether you are planning a smart city
                              infrastructure project, expanding public
                              utilities, or seeking to optimize urban cash flows
                              — India IPO provides the legal, financial, and
                              market expertise required to successfully place
                              your Municipal Debt Securities.
                            </p>
                            <p className="font-black text-[#f59e08]">
                              Let’s build a future-ready India — city by city,
                              bond by bond.
                            </p>
                          </div>
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
    </ServicePageLayout>
  );
};

export default PrivateMunicipalDebtClient;
