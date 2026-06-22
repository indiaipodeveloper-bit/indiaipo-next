"use client";

import React from "react";
import Link from "next/link";
import ServicePageLayout from "@/components/ServicePageLayout";

const PreIpoClient = () => {
  const slug = "pre-ipo-consultant";

  return (
    <ServicePageLayout slug={slug}>
      <div className="col-lg-12 content-side text-slate-800">
        <div className="service-details-content">
          <div className="content-style-one mb-0 ipo-process space-y-6">
            <div className="pt-2" id="pre-ipo-consultation">
              <p className="text-base leading-relaxed text-slate-600">
                Is your company ready to go public and looking to raise funds, or do you want to know your real
                valuation before your company goes to the stock market? At India IPO, we are experts in taking businesses
                through the important pre IPO stage with experienced pre IPO funding consultants and dedicated pre IPO
                valuation advisory.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                We provide strategic advice, extensive financial expertise and an end-to-end service to enable
                businesses to unlock capital, build investor confidence and achieve the correct price before an IPO.
              </p>
            </div>

            <div className="pt-4" id="what-pre-ipo-funding">
              <h2 className="text-2xl md:text-3xl font-black text-[#001529] mb-4">What is Pre IPO Funding?</h2>
              <p className="text-base leading-relaxed text-slate-600 mb-4">
                Pre IPO funding refers to the money a firm raises before its initial public offering (IPO). Such capital
                enables the company to prepare for listing by strengthening its balance sheet, enhancing operations,
                financing growth, or simply meeting regulatory and investor-readiness requirements.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Pre IPO funding is generally raised through:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-base text-slate-600">
                <li>Private placements to institutional investors</li>
                <li>Financing by private equity (PE) or venture capital (VC) firms</li>
                <li>Structured instruments such as convertible debentures</li>
                <li>Mezzanine capital or bridge financing</li>
              </ul>
            </div>

            <div className="pt-4" id="why-pre-ipo-funding">
              <h2 className="text-2xl md:text-3xl font-black text-[#001529] mb-4">Why Pre IPO Funding Matters?</h2>
              <p className="text-base leading-relaxed text-slate-600 mb-4">
                Listing on the stock exchange is not just about compliance; it is a market-readiness and perception
                issue. A strong pre IPO fundraise will enable you to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-base text-slate-600 mb-4">
                <li>Debt reduction and working capital needs</li>
                <li>Improve valuation through growth potential and operations</li>
                <li>Invest in technology, team and infrastructure before public scrutiny</li>
                <li>Increase investor confidence via strategic partners</li>
                <li>Listing requirements fulfillment (Profitability/Net Worth)</li>
              </ul>
              <p className="text-base leading-relaxed text-slate-600">
                Pre IPO funding gives the necessary financial muscle and makes the company appear growth-ready to public
                market investors.
              </p>
            </div>

            <div className="pt-4" id="pre-ipo-services">
              <h2 className="text-2xl md:text-3xl font-black text-[#001529] mb-4">Our Pre IPO Consulting Services Include:</h2>
              
              <div className="space-y-6 mt-4">
                <div id="capital-raising-strategy" className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-xl font-bold text-[#001529] mb-3">1. Capital Raising Strategy & Planning</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    We assist you in creating a growth-oriented and IPO-compliant capital structure. Our pre IPO funding
                    consultants work with management to determine the optimal funding size and the right mix of investors.
                  </p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                    <li>Instrument selection (Equity, Debentures, CCDs)</li>
                    <li>Optimal fundraise sizing calculation</li>
                    <li>Funding roadmap alignment with listing timelines</li>
                  </ul>
                </div>

                <div id="investor-targeting" className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-xl font-bold text-[#001529] mb-3">2. Investor Targeting & Deal Structuring</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    India IPO helps you connect with institutional investors, family offices and high-net-worth individuals
                    (HNIs) for your pre IPO round.
                  </p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                    <li>Deal structuring and term sheet support</li>
                    <li>Development of investor pitch decks and growth stories</li>
                    <li>Investor meeting management and negotiation support</li>
                  </ul>
                </div>

                <div id="due-diligence-support" className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-xl font-bold text-[#001529] mb-3">3. Due Diligence Support</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    A pre IPO round involves rigorous due diligence. We provide hands-on support to make sure your financial and
                    legal data is clean and prepared for investor scrutiny.
                  </p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                    <li>Financial and tax cleanup for investor-readiness</li>
                    <li>Due diligence checklist management</li>
                    <li>Assistance in closing investor audits and legal review</li>
                  </ul>
                </div>

                <div id="regulatory-compliance" className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-xl font-bold text-[#001529] mb-3">4. Compliance & Regulatory Handholding</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    The way you raise pre IPO funds must align with SEBI regulations, the Companies Act and stock exchange
                    norms. We handle the complexity for you.
                  </p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                    <li>Private placement and preferential allotment advisory</li>
                    <li>Adhering to convertible instrument norms</li>
                    <li>Liaison with SEBI, ROC and Exchanges for necessary disclosures</li>
                  </ul>
                </div>

                <div id="valuation-advisory" className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-xl font-bold text-[#001529] mb-3">5. Pre IPO Valuation Advisory</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    How do you know what your company is worth? Our pre IPO valuation advisory team gives a professional
                    estimation of your company value, considering regulatory measures, market trends and peer benchmarks.
                  </p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                    <li>Valuation using DCF, market multiples and NAV methods</li>
                    <li>Peer group benchmarking and sector-wise analysis</li>
                    <li>Fair value assessment for investor negotiations</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4" id="avail-pre-ipo">
              <h2 className="text-2xl md:text-3xl font-black text-[#001529] mb-4">Who Should Use Our Pre IPO Services?</h2>
              <ul className="list-disc pl-5 space-y-2 text-base text-slate-600">
                <li>Mid-sized private firms launching IPO in the next 12-24 months</li>
                <li>Private equity-funded firms planning exit via IPO</li>
                <li>Unicorns and soonicorns scaling for the public market</li>
                <li>Traditional firms modernizing for market visibility</li>
                <li>SMEs planning to join the BSE SME or NSE Emerge platforms</li>
              </ul>
            </div>

            <div className="pt-4" id="when-start">
              <h2 className="text-2xl md:text-3xl font-black text-[#001529] mb-4">When Should You Start?</h2>
              <p className="text-base leading-relaxed text-slate-600">
                An effective IPO begins way before the listing date. It starts with the correct strategy, correct valuation
                and correct capital. We recommend companies begin working with pre IPO funding consultants at least 12-18
                months before the planned filing.
              </p>
            </div>

            <div className="pt-4" id="choose-pre-ipo">
              <h2 className="text-2xl md:text-3xl font-black text-[#001529] mb-4">Why Choose India IPO?</h2>
              <p className="text-base text-slate-600 mb-4">
                India IPO is your strategic bridge between your business and the capital markets.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 mb-6">
                <li>
                  <strong className="text-slate-900">End-to-End Expertise:</strong> We understand the full IPO cycle—from
                  DRHP to listing.
                </li>
                <li>
                  <strong className="text-slate-900">Investor Access:</strong> Strong network of institutional and strategic
                  investors involved in pre IPO funding.
                </li>
                <li>
                  <strong className="text-slate-900">SEBI-Aligned Advisory:</strong> We make sure that your actions today are
                  compliant with what stock exchanges expect tomorrow.
                </li>
                <li>
                  <strong className="text-slate-900">Sector Experience:</strong> Experience across Fintech, Pharma, Tech,
                  Manufacturing and FMCG.
                </li>
                <li>
                  <strong className="text-slate-900">Confidential Advisory:</strong> Customized advisory fully aligned with
                  your promoter objectives.
                </li>
              </ul>
              <h3 className="text-xl font-bold text-[#001529] mb-3">🚀 Ready to Raise Capital & Go Public?</h3>
              <p className="text-base leading-relaxed text-slate-600">
                Let us make sure that your IPO journey begins strong with the right pre IPO funding and a valuation that
                reflects your true potential.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Understand how IPOs work through our{" "}
                <Link href="/ipo-process" className="text-blue-600 hover:underline">
                  IPO Process
                </Link>{" "}
                guide. Stay updated with upcoming listings in the{" "}
                <Link href="/all-ipos" className="text-blue-600 hover:underline">
                  IPO Calendar
                </Link>{" "}
                and read insights on our{" "}
                <Link href="/ipo-blogs" className="text-blue-600 hover:underline">
                  IPO Company Reviews — GMP, Subscription Status & Allotment.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </ServicePageLayout>
  );
};

export default PreIpoClient;
