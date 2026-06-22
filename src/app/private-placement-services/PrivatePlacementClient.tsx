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

const PrivatePlacementClient = () => {
  const slug = "private-placement-services";
  const cfg = { accent: "#f59e08" };

  return (
    <ServicePageLayout slug={slug}>
      <div className="flex flex-col gap-12 relative">
                    <div className="w-full space-y-20">
                      <div
                        id="placement-overview"
                        className="service-content-box service-content scroll-mt-24"
                      >
                        <div className="row pt-2">
                          <div className="col-lg-12" id="private-placement">
                            <p>
                              At India IPO, IPO advisory is what we are known
                              for, but raising capital does not always have to
                              begin with a public listing. Private Placement
                              Service is for companies that would like to raise
                              growth capital in a quick, discreet & efficient
                              manner from a select pool of investors that meet
                              their strategic requirements and at the same time
                              remain 100% compliant with Indian regulations.
                            </p>
                            <p>
                              Private placement is often the smartest route for
                              founders who want speed, flexibility and long-term
                              partners without the visibility and rigidity of an
                              IPO.
                            </p>
                          </div>
                          <div
                            className="col-lg-12"
                            id="what-is-private-placement"
                          >
                            <h2>What Is a Private Placement? </h2>
                            <p>
                              A Private Placement Service or “PPS” allows
                              companies to raise debt and equity capital through
                              the sale of securities to investors directly
                              instead of through a public offering. These
                              investors typically include:
                            </p>
                            <div className="orhp">
                              <ul>
                                <li id="private-placement-advisory">
                                  Institutional investors
                                </li>
                                <li id="investor-network">
                                  Private equity and venture capital funds
                                </li>
                                <li id="regulatory-compliance">
                                  High-Net-Worth Individuals (HNIs)
                                </li>
                                <li id="valuation-and-negotiation">
                                  Strategic or sector-focused investors
                                </li>
                              </ul>

                              <p>
                                Unlike going to the public market, private
                                placements are customized transactions
                                structured around your business stage, capital
                                raising requirement and future listing plans in
                                mind.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="row mt-4">
                          <div
                            className="col-lg-12"
                            id="private-placement-services"
                          >
                            <h2>India IPO’s Private Placement Services</h2>
                            <p id="pps-advisory">
                              <b>1. End-to-End Private Placement Advisory</b>
                            </p>
                            <p>
                              We advise promoters and management teams on{" "}
                              <b>whether, when and how</b> to raise capital via
                              private placement. This includes:
                            </p>

                            <div className="orhp">
                              <ul>
                                <li id="private-placement-advisory">
                                  Capital structuring (equity, CCPS, CCDs,
                                  debentures)
                                </li>
                                <li id="investor-network">
                                  Determining optimal fund size and dilution
                                </li>
                                <li id="regulatory-compliance">
                                  Aligning private placement with future IPO or
                                  exit plans
                                </li>
                              </ul>
                            </div>
                            <p id="pps-investor-network">
                              Our approach ensures the raise strengthens your
                              balance sheet{" "}
                              <b>
                                without compromising long-term control or
                                valuation discipline
                              </b>
                              .
                            </p>

                            <p id="pps-investor-network">
                              <b>2. Access to a Strong Investor Network</b>
                            </p>
                            <p>
                              India IPO brings access to a{" "}
                              <b>deep and relevant investor ecosystem</b>,
                              including:
                            </p>

                            <div className="orhp">
                              <ul>
                                <li id="private-placement-advisory">
                                  Domestic and global institutional investors
                                </li>
                                <li id="investor-network">
                                  Family offices and HNWIs
                                </li>
                                <li id="regulatory-compliance">
                                  Growth-stage PE and VC funds
                                </li>
                              </ul>
                            </div>
                            <p>
                              Instead of broad outreach, we focus on{" "}
                              <strong>targeted</strong> investor matchmaking,
                              bringing you together with investors that match
                              your sector, stage and strategy.
                            </p>
                            <p id="pps-valuation">
                              <b>
                                3. Valuation Support & Commercial Negotiation
                              </b>
                            </p>
                            <p>
                              Valuation is where nearly all private placements
                              make it or break it. Our Private Placement Service
                              includes:
                            </p>

                            <div className="orhp">
                              <ul>
                                <li id="private-placement-advisory">
                                  Independent valuation benchmarking
                                </li>
                                <li id="investor-network">
                                  Structuring downside protection without
                                  excessive promoter risk
                                </li>
                                <li id="regulatory-compliance">
                                  Negotiating shareholder rights, exits and
                                  governance terms
                                </li>
                              </ul>
                            </div>
                            <p>
                              The objective is simple:
                              <b>
                                {" "}
                                fair valuation, clean structures and balanced
                                investor rights.
                              </b>
                            </p>
                            <p id="pps-compliance">
                              <b>4. Regulatory & Compliance Advisory</b>
                            </p>
                            <p>
                              Private placements in India must comply with the
                              Companies Act, 2013 and applicable securities and
                              foreign investment norms. India IPO ensures:
                            </p>

                            <div className="orhp">
                              <ul>
                                <li id="private-placement-advisory">
                                  Proper structuring under Indian private
                                  placement rules
                                </li>
                                <li id="investor-network">
                                  Compliance with{" "}
                                  <b>
                                    Securities and Exchange Board of India
                                    (SEBI)
                                  </b>{" "}
                                  regulations, where applicable
                                </li>
                                <li id="regulatory-compliance">
                                  Adherence to{" "}
                                  <b>Reserve Bank of India (RBI)</b> and FDI
                                  guidelines for foreign investors
                                </li>
                              </ul>
                            </div>
                            <p>
                              We coordinate closely with legal and tax advisors
                              to ensure <b>zero regulatory friction.</b>
                            </p>
                            <p id="pps-execution">
                              <b>5. Transaction Execution & Closure</b>
                            </p>
                            <p>
                              From term sheet to fund infusion, India IPO
                              manages the full lifecycle:
                            </p>

                            <div className="orhp">
                              <ul>
                                <li id="private-placement-advisory">
                                  Investor presentations and data rooms
                                </li>
                                <li id="investor-network">
                                  Term sheet finalization
                                </li>
                                <li id="regulatory-compliance">
                                  Shareholder approvals and allotment
                                </li>
                                <li id="regulatory-compliance">
                                  Closing coordination with legal, audit and
                                  secretarial teams
                                </li>
                              </ul>
                            </div>
                            <p>
                              Our focus is execution certainty, not just
                              introductions.
                            </p>
                          </div>

                          <div
                            className="col-lg-12"
                            id="private-placement-services"
                          >
                            <h2>
                              Key Benefits of Using a Private Placement Service
                            </h2>
                            <div>
                              <p id="faster-capital">
                                <b>Faster Capital Raise</b>
                              </p>
                              <p>
                                Compared to an IPO, private placements involve:
                              </p>
                              <div className="orhp">
                                <ul>
                                  <li id="private-placement-advisory">
                                    Fewer disclosures
                                  </li>
                                  <li id="investor-network">
                                    Shorter timelines
                                  </li>
                                  <li id="regulatory-compliance">
                                    Lower execution risk
                                  </li>
                                </ul>
                              </div>
                              <p>
                                This makes them ideal for{" "}
                                <b>
                                  growth capital, deleveraging, or bridge
                                  financing.
                                </b>
                              </p>
                            </div>
                            <div>
                              <p id="confidentiality-control">
                                <b>Confidentiality & Control</b>
                              </p>
                              <p>Private placements allow companies to:</p>
                              <div className="orhp">
                                <ul>
                                  <li id="private-placement-advisory">
                                    Avoid public disclosure of sensitive
                                    financials
                                  </li>
                                  <li id="investor-network">
                                    Control investor communication
                                  </li>
                                  <li id="regulatory-compliance">
                                    Maintain strategic confidentiality during
                                    expansion or restructuring
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div>
                              <p id="targeted-investors">
                                <b>Targeted, High-Quality Investors</b>
                              </p>
                              <p>
                                Rather than raising from the market at large,
                                private placements enable you to:
                              </p>
                              <div className="orhp">
                                <ul>
                                  <li id="private-placement-advisory">
                                    Choose investors with sector expertise
                                  </li>
                                  <li id="investor-network">
                                    Bring in long-term capital partners
                                  </li>
                                  <li id="regulatory-compliance">
                                    Avoid unnecessary shareholder fragmentation
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div>
                              <p id="ipo-ready-structuring">
                                <b>IPO-Ready Capital Structuring:</b>
                              </p>
                              <p>
                                For companies planning a future IPO, private
                                placement acts as a{" "}
                                <b>strategic pre-IPO step</b>:
                              </p>
                              <div className="orhp">
                                <ul>
                                  <li id="private-placement-advisory">
                                    Strengthens balance sheet
                                  </li>
                                  <li id="investor-network">
                                    Establishes valuation benchmarks
                                  </li>
                                  <li id="regulatory-compliance">
                                    Brings credible investors onto the cap table
                                  </li>
                                </ul>
                              </div>
                              <p>
                                India IPO structures private placements with a{" "}
                                <b>clear public market lens.</b>
                              </p>
                            </div>
                          </div>

                          <div className="col-lg-12" id="who-should-use-pps">
                            <h2>
                              Who Should Use India IPO’s Private Placement
                              Service?
                            </h2>
                            <div>
                              <p>Our Private Placement Service is ideal for:</p>
                              <div className="orhp">
                                <ul>
                                  <li id="private-placement-advisory">
                                    Promoter-led growth companies
                                  </li>
                                  <li id="investor-network">
                                    Pre-IPO and late-stage businesses
                                  </li>
                                  <li id="regulatory-compliance">
                                    Companies seeking institutional validation
                                  </li>
                                  <li id="regulatory-compliance">
                                    Firms looking to optimize leverage or fund
                                    expansion without going public immediately
                                  </li>
                                </ul>
                              </div>
                              <p>
                                This makes them ideal for{" "}
                                <b>
                                  growth capital, deleveraging, or bridge
                                  financing.
                                </b>
                              </p>
                            </div>
                          </div>
                          <div className="col-lg-12" id="why-india-ipo">
                            <h2>Why India IPO?</h2>
                            <div>
                              <p>
                                What differentiates India IPO is our{" "}
                                <b>capital markets DNA.</b> Unlike pure
                                investment brokers, we approach private
                                placements with:
                              </p>
                              <div className="orhp">
                                <ul>
                                  <li id="private-placement-advisory">
                                    IPO-grade financial discipline
                                  </li>
                                  <li id="investor-network">
                                    Institutional investor expectations
                                  </li>
                                  <li id="regulatory-compliance">
                                    Long-term listing and exit clarity
                                  </li>
                                </ul>
                              </div>
                              <p>
                                Every private placement we advise is designed
                                not just to raise money, but to{" "}
                                <b>
                                  build credibility, governance and valuation
                                  sustainability
                                </b>
                                .
                              </p>
                            </div>
                          </div>

                          <div
                            className="col-lg-12"
                            id="raise-capital-privately"
                          >
                            <h2>Looking to Raise Capital Privately?</h2>
                            <p>
                              India IPO's Private Placement Service brings
                              together strategic advisory, investor access,
                              regulatory compliance and execution capabilities
                              that help companies raise the right capital from
                              the right investors at the right time.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        id="smart-capital"
                        className="bg-[#001529] rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden scroll-mt-24"
                      >
                        <div
                          className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle, #f59e08 0.5px, transparent 0.5px)",
                            backgroundSize: "16px 16px",
                          }}
                        />
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                          <div className="space-y-6">
                            <h3 className="text-2xl md:text-3xl font-black leading-tight">
                              Smart Capital for{" "}
                              <span className="text-[#f59e08]">
                                High-Growth Founders
                              </span>
                            </h3>
                            <div className="space-y-4">
                              {[
                                {
                                  t: "Speed to Capital",
                                  d: "Faster execution with fewer public disclosures and lower friction.",
                                },
                                {
                                  t: "Total Confidentiality",
                                  d: "Strategic expansion stays private during sensitive restructuring phases.",
                                },
                                {
                                  t: "IPO-Ready DNA",
                                  d: "We structure private placements to strengthen balance sheets for future public listings.",
                                },
                                {
                                  t: "Strategic Alignment",
                                  d: "Chosen investors bring sector expertise, not just currency.",
                                },
                              ].map((ben, bi) => (
                                <div key={bi} className="flex gap-4">
                                  <div className="w-5 h-5 rounded-full bg-[#f59e08] flex items-center justify-center shrink-0 mt-1">
                                    <CheckCircle className="h-3 w-3 text-[#001529]" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-white text-sm">
                                      {ben.t}
                                    </h4>
                                    <p className="text-white/40 text-[10px] uppercase font-black leading-relaxed">
                                      {ben.d}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-sm space-y-6">
                            <div className="flex items-center gap-3 ">
                              <Award className="h-6 w-6 text-[#f59e08]" />
                              <h4 className="text-xl font-black text-white">
                                Difference with the India IPO
                              </h4>
                            </div>
                            <p className="text-white/60 text-xs font-semibold leading-relaxed">
                              We approach private placements with
                              institutional-grade discipline and structured
                              execution. Unlike traditional brokers, we focus on
                              governance, valuation alignment and long-term
                              capital strategy so that every transaction
                              strengthens your future growth and market
                              positioning.
                            </p>
                            <div className="pt-4 border-t border-white/10">
                              <p className="text-[10px] text-[#f59e08] font-black uppercase tracking-widest mb-4">
                                Ideal For:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  "Promoter-led Growth",
                                  "Pre-IPO Companies",
                                  "Late-stage Expansion",
                                  "CAPEX Optimization",
                                ].map((tag, ti) => (
                                  <span
                                    key={ti}
                                    className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-bold text-white/80"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        id="consultation"
                        className="bg-[#f59e08] border border-orange-100 p-10 md:p-14 rounded-[3rem] text-center space-y-6 scroll-mt-24"
                      >
                        <h3 className="text-3xl font-black text-[#001529]">
                          Looking to Raise Capital Privately?
                        </h3>
                        <p className="text-slate-600 text-sm max-w-xl mx-auto font-medium">
                          Our Private Placement Service brings together
                          strategic advisory, investor access, and zero-friction
                          regulatory compliance.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                          <Button
                            asChild
                            className="bg-[#001529] hover:bg-slate-800 text-[#f59e08] font-black px-10 h-14 rounded-2xl"
                          >
                            <Link href="/contact">
                              Get Free Consultation{" "}
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                          </Button>
                          <div className="flex items-center gap-4 px-8 border border-slate-200 rounded-2xl bg-white h-14 shadow-sm">
                            <Phone className="h-5 w-5 text-[#f59e08]" />
                            <div className="text-left leading-none">

                              <div className="text-lg font-black text-[#001529]">
                                +91-74283-37280
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
    </ServicePageLayout>
  );
};

export default PrivatePlacementClient;
