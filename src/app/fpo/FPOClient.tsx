"use client";

import React from "react";
import Link from "next/link";
import ServicePageLayout from "@/components/ServicePageLayout";

const FPOClient = () => {
  const slug = "fpo";

  return (
    <ServicePageLayout slug={slug}>
      <div className="col-lg-12 content-side text-slate-800">
        <div className="service-details-content">
          <div className="content-style-one mb-0 ipo-process space-y-6">
            <div className="pt-2" id="fpo">
              <h2 className="text-2xl md:text-3xl font-black text-[#001529] mb-4">
                What is an FPO (Follow‑On Public Offer)?
              </h2>
              <p className="text-base leading-relaxed text-slate-600">
                Follow-On Public Offer (FPO) is a situation where a listed company on a stock exchange offers more stock to
                the public to raise more capital through a fresh issue of new shares, an Offer for Sale (OFS) of existing
                stocks, or a combination of both.
              </p>
            </div>

            <div className="pt-4" id="why-company">
              <h2 className="text-2xl md:text-3xl font-black text-[#001529] mb-4">Why Companies Opt for FPOs</h2>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">1. Raising Funds for Expansion</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Suitable for expansion efforts such as a new project, infrastructure development, or debt repayment.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">2. Leveraging Market Conditions</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    When stock prices are favorable, companies can seek capital at competitive valuations.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">3. Facilitating Promoter Exit</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Existing stakeholders use OFS as a liquidity route without diluting equity.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4" id="features-sme">
              <h2 className="text-2xl md:text-3xl font-black text-[#001529] mb-4">Key Features of FPOs</h2>
              <ul className="list-disc pl-5 space-y-3 text-base text-slate-600">
                <li>
                  <strong className="text-slate-900">Fresh Issue:</strong> The Company sells new shares, where money is
                  received by the company.
                </li>
                <li>
                  <strong className="text-slate-900">Offer for Sale (OFS):</strong> Existing shareholders sell their
                  holdings; proceeds go to them.
                </li>
                <li>
                  <strong className="text-slate-900">Book-Building & Fixed-Price Options:</strong> Pricing determined
                  through institutional demand or fixed slab.
                </li>
                <li>
                  <strong className="text-slate-900">Market Eligibility:</strong> FPOs can be offered to Qualified
                  Institutional Buyers (QIBs), Non-Institutional Investors (NIIs) and Retail Investors.
                </li>
                <li>
                  <strong className="text-slate-900">Allotment Mechanism:</strong> Open allocation as per SEBI
                  guidelines; in many cases, a retail discount is also given.
                </li>
              </ul>
            </div>

            <div className="pt-4" id="fpo-ipo">
              <h2 className="text-2xl md:text-3xl font-black text-[#001529] mb-4">FPO vs. IPO</h2>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm mb-4">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 font-bold text-[#001529] uppercase tracking-wider">Aspect</th>
                      <th className="px-6 py-4 font-bold text-[#001529] uppercase tracking-wider">IPO</th>
                      <th className="px-6 py-4 font-bold text-[#001529] uppercase tracking-wider">FPO</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-800 font-bold">Issuer</td>
                      <td className="px-6 py-4 text-slate-600">Unlisted private company</td>
                      <td className="px-6 py-4 text-slate-600">Already a publicly listed company</td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-800 font-bold">Capital Flow</td>
                      <td className="px-6 py-4 text-slate-600">Entirely to the company</td>
                      <td className="px-6 py-4 text-slate-600">Fresh issue → company; OFS → selling promoters</td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-800 font-bold">Purpose</td>
                      <td className="px-6 py-4 text-slate-600">Debut fundraising, listing</td>
                      <td className="px-6 py-4 text-slate-600">Expansion, recapitalization, promoter exit</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-800 font-bold">Pricing</td>
                      <td className="px-6 py-4 text-slate-600">Based on pre‑IPO valuation</td>
                      <td className="px-6 py-4 text-slate-600">Based on the current stock price</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-4" id="why-advisory">
              <h2 className="text-2xl md:text-3xl font-black text-[#001529] mb-4">
                Why Do Companies Need FPO Advisory Services?
              </h2>
              <p className="text-base leading-relaxed text-slate-600 mb-6">
                A Follow-On Public Offer (FPO) may appear simple, particularly when you are an already listed company, but
                the truth is, it is a tricky, high-stakes procedure that directly affects your valuation, investor
                confidence and future growth. This is why professional FPO advisory is not only useful, but necessary:
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Strategic Guidance at Every Step</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mt-1">
                    FPOs are not “just another funding round.” You must determine the appropriate time, amount, form and
                    price, but at the same time, it must be in line with your current financial standing and the market
                    conditions. In the absence of professional contribution, there is a greater probability of
                    underperformance or market rejection.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Regulatory Maze Simplified</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mt-1">
                    Filing a compliant FPO means dealing with SEBI, ROC, stock exchanges, merchant bankers, auditors,
                    legal advisors, etc. A single delay or documentation mistake will upset your schedule. Advisory makes
                    sure that everything is filed, cleared and approved without a setback.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Capital Raise with Market Confidence</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mt-1">
                    Investors not only evaluate FPOs based on figures, but also on their presentation. Advisory makes your
                    growth story, business model and plans compelling and compliant, so the market knows your value.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Single Window Coordination</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mt-1">
                    Whether it is internal teams or external agencies, an FPO needs cross-functional coordination, which
                    tends to overwhelm the company leadership. Your dedicated advisory firm, such as India IPO, will be
                    your project owner and keep everything and everyone on track.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4" id="benefit-fpo">
              <h2 className="text-2xl md:text-3xl font-black text-[#001529] mb-4">
                Our Follow-On Public Offer (FPO) Advisory Services Include:
              </h2>
              <div className="space-y-6 mt-4">
                <div id="fpo-readiness" className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-xl font-bold text-[#001529] mb-3">1. FPO Readiness Assessment and Strategic Fit</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Before launching an FPO, it is important to evaluate the extent to which your business is in its best
                    position to raise follow-on capital. We begin by assessing where your company is in the market and how
                    it can fit into future fundraising ambitions.
                  </p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                    <li>FPO Eligibility and timing analysis</li>
                    <li>Business performance and capital needs review</li>
                    <li>Shareholder expectations and dilution impact study</li>
                    <li>Long-term growth alignment and FPO fit</li>
                  </ul>
                </div>

                <div id="fpo-structuring" className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-xl font-bold text-[#001529] mb-3">2. Structuring and Planning the FPO</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    We help design the most effective FPO structure suited to your growth strategy, shareholder objectives
                    and market conditions. Our team crafts a detailed plan, aligning compliance, capital market trends and
                    stakeholder interests.
                  </p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                    <li>Optimal issue size and share pricing strategy</li>
                    <li>Type of FPO: Dilutive vs. Non-dilutive</li>
                    <li>Capital structure review and post-issue shareholding analysis</li>
                    <li>Legal, tax and regulatory framework planning</li>
                  </ul>
                </div>

                <div id="fpo-regulatory" className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-xl font-bold text-[#001529] mb-3">3. Regulatory & Documentation Support</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    A smooth and compliant FPO requires detailed documentation and close coordination with regulatory
                    bodies. We manage this entire process end-to-end to ensure full SEBI and exchange compliance.
                  </p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                    <li>Preparation and filing of offer documents (RHP/LODR filings)</li>
                    <li>Coordination with SEBI, Stock Exchanges, ROC and depositories</li>
                    <li>Liaising with legal advisors, auditors and merchant bankers</li>
                    <li>Ensuring disclosures meet public market requirements</li>
                  </ul>
                </div>

                <div id="fpo-execution" className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-xl font-bold text-[#001529] mb-3">4. Stakeholder Coordination and End-to-End Execution</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Managing an FPO involves numerous internal and external stakeholders. India IPO acts as your execution
                    partner, streamlining communication and managing deliverables across all parties.
                  </p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                    <li>Merchant banker and legal advisor coordination</li>
                    <li>Audit and registrar alignment</li>
                    <li>Timelines, documentation and compliance tracking</li>
                    <li>Real-time updates and stakeholder reporting</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4" id="key-fpo">
              <h2 className="text-2xl md:text-3xl font-black text-[#001529] mb-4">Key FPO Examples from India</h2>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Vodafone Idea (April 2024)</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    The largest FPO in India so far sought to raise 18,000 - 20,000 crore (~ US$2.16 bn) in new equity. Price
                    band of 10-11/share; subscription was moderate - 1.05x overall, but institutions were heavy.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Yes Bank (July 2020)</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Introduced 15,000 crore dilutive FPO at very heavy discount (₹12-13/share) during restructuring after the
                    crisis. Subscribed almost to the full (~95%) before allotment.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4" id="choose-fpo">
              <h2 className="text-2xl md:text-3xl font-black text-[#001529] mb-4">Why Choose Our FPO Advisory Services?</h2>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">End-to-End Execution</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    We manage the entire lifecycle including structuring fresh issue vs OFS blend, book-building pricing
                    strategy, and SEBI compliance.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Post-Listing Support</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Detailed performance analytics, guidance on shareholding, and lock-in unwind trading strategies.
                  </p>
                </div>
              </div>
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

export default FPOClient;
