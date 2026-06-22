import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, ChevronRight, TrendingUp } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

const BASE_URL = "https://www.indiaipo.in";

async function getBannerVideo() {
  const isDev = process.env.NODE_ENV === 'development';
  const apiBase = isDev ? "http://localhost:5000" : BASE_URL;

  try {
    const bannerRes = await fetch(`${apiBase}/api/banners?page=%2Fipo-process`, {
      next: { revalidate: 60 }
    });
    if (bannerRes.ok) {
      const bannerData = await bannerRes.json();
      const videoBanner = bannerData.find((b: any) => b.video_url);
      if (videoBanner) return videoBanner.video_url;
    }
  } catch (err) {
    console.warn("Failed to fetch banners on server:", err);
  }
  return null;
}

export const metadata: Metadata = {
  title: "The Complete IPO Process in India | India IPO",
  description: "Understand the step-by-step Initial Public Offering (IPO) process in India. From Eligibility and DRHP filing to listing on BSE/NSE, learn how to take your company public.",
  keywords: "IPO Process, How to go public, DRHP, SEBI guidelines, Book Building, Listing in India, SME IPO process",
  alternates: {
    canonical: `${BASE_URL}/ipo-process`,
  },
  openGraph: {
    title: "The Complete IPO Process in India | India IPO",
    description: "Understand the step-by-step Initial Public Offering (IPO) process in India. From Eligibility and DRHP filing to listing on BSE/NSE, learn how to take your company public.",
    url: `${BASE_URL}/ipo-process`,
    type: "website",
  }
};

export default async function IpoProcessPage() {
  const bannerVideo = await getBannerVideo();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow">
        <section className="pt-20 pb-28 px-4 relative overflow-hidden bg-[#001529]">
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

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div 
              className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full"
              style={{ background: '#f59e08', filter: 'blur(100px)', opacity: 0.05, transform: 'translate(25%,-25%)' }} 
            />
            <div 
              className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
              style={{ background: '#3b82f6', filter: 'blur(80px)', opacity: 0.05, transform: 'translate(-20%,20%)' }} 
            />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
              <div
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, hsl(35 95% 52%), hsl(45 93% 65%))',
                  color: 'white'
                }}
              >
                <TrendingUp className="w-12 h-12 md:w-16 md:h-16" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-white/70 mb-4 font-medium">
                  <Link href="/" className="hover:text-white transition-colors">Home</Link>
                  <ChevronRight className="w-4 h-4 text-white/35" />
                  <span className="text-white">IPO Process</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                  Step-by-Step IPO Process in India
                </h1>
                <p className="text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed text-sm">
                  A complete breakdown of the IPO journey from private company to public listing, covering every stage, regulation and stakeholder involved.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-background relative -mt-10 rounded-t-[40px] z-20">
          <div className="container mx-auto px-4 space-y-16">
            <div className="prose prose-lg prose-headings:text-foreground prose-p:text-muted-foreground max-w-none">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-[#001529]">
                <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                What is an Initial Public Offering (IPO)?
              </h2>
              <p className="leading-relaxed text-slate-600 text-sm">
                An Initial Public Offering (IPO) is the process through which a privately held company offers its shares to the public for the first time, becoming a publicly listed entity. Beyond capital raising, an IPO reshapes the company’s ownership structure, governance standards and market visibility.
              </p>
              <p className="leading-relaxed mt-4 text-slate-600 text-sm">
                In India, IPOs are regulated by the Securities and Exchange Board of India. Based on size, financial track record and eligibility, companies may list on the Mainboard (BSE & NSE) or SME platforms (BSE SME & NSE Emerge).
              </p>
            </div>

            <div className="py-8">
              <h2 className="text-2xl font-bold mb-10 flex items-center gap-3 text-[#001529]">
                <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                Why Do Companies Go Public?
              </h2>

              <div className="flex flex-col gap-6">
                {[
                  {
                    title: "Capital Expansion",
                    desc: "Raise large-scale equity capital to fund growth, reduce debt, or support working capital without increasing leverage.",
                  },
                  {
                    title: "Exit for Early Investors",
                    desc: "Provides liquidity for promoters, venture capitalists and private equity investors through structured share sales (OFS).",
                  },
                  {
                    title: "Acquisition Currency",
                    desc: "Listed shares can be used as a strategic currency for mergers and acquisitions without significant cash outflow.",
                  },
                  {
                    title: "Enhanced Corporate Stature",
                    desc: "Improves credibility, brand visibility and stakeholder trust through regulatory compliance and public market presence.",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-5 py-2 rounded-xl transition-all">
                    <div className="w-12 h-12 rounded-full bg-[#001529] text-[#f59e08] flex items-center justify-center font-bold text-lg shrink-0">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-bold text-xl mb-2 text-slate-800">
                        {item.title}
                      </h4>
                      <p className="text-slate-500 leading-relaxed text-sm">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-10 flex items-center gap-3 text-[#001529]">
                <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                Step-by-Step Process to Launch an IPO in India
              </h2>
              <p className="text-slate-500 leading-relaxed mb-10 text-sm">
                An Initial Public Offering (IPO) is a significant milestone in a company's growth journey. It allows a privately held company to offer its shares to the general public for the first time, thereby raising capital from a wide base of investors. While the process presents considerable opportunities, it also demands careful planning, strict regulatory compliance and coordination among multiple stakeholders. The following steps outline how the IPO process works in India.
              </p>

              <div className="space-y-12">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg bg-[#001529] text-[#f59e08]">
                    1
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">Decision to Go Public</h3>
                    <p className="text-slate-500 leading-relaxed mb-4 text-sm">
                      The IPO process begins with a well-considered decision by the company's board and senior management. Before committing to a public offering, they evaluate the following key factors:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-500 leading-relaxed mb-4 text-sm">
                      <li><strong>Capital Requirements:</strong> If the company requires substantial funds for business expansion, infrastructure development, or entering new markets, an IPO offers an effective route to raise large-scale capital from public investors.</li>
                      <li><strong>Financial Strength:</strong> The company must demonstrate consistent revenue growth, profitability and a sound balance sheet, all of which are essential to building investor confidence.</li>
                      <li><strong>Market Conditions:</strong> Timing the IPO during favourable market conditions and positive investor sentiment can significantly enhance the offering's success and valuation.</li>
                      <li><strong>Regulatory Compliance:</strong> The company must meet all eligibility norms prescribed by the Securities and Exchange Board of India (SEBI) before initiating the process.</li>
                      <li><strong>Evaluation of Alternatives:</strong> Management also considers other funding options, such as venture capital, private equity, or debt financing, before concluding that an IPO is the most suitable course of action.</li>
                    </ul>
                    <p className="text-slate-500 leading-relaxed text-sm">
                      Once the decision is finalised, the company begins assembling a team of professionals to manage the IPO process.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg bg-[#001529] text-[#f59e08]">
                    2
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">Appointing a Merchant Banker (Lead Manager)</h3>
                    <p className="text-slate-500 leading-relaxed mb-4 text-sm">
                      The first formal step in the IPO process is to appoint a SEBI-registered Merchant Banker, also known as the <strong>Book Running Lead Manager (BRLM)</strong>. Under SEBI (Merchant Bankers) Regulations, 1992, any entity managing a public issue in India must hold a valid SEBI registration as a merchant banker.
                    </p>
                    <p className="text-slate-500 leading-relaxed mb-4 text-sm">
                      The merchant banker plays a central role in the IPO and is responsible for:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-500 leading-relaxed mb-4 text-sm">
                      <li>Assessing the company's readiness for a public offering</li>
                      <li>Structuring the issue - determining the offer size, price band and issue type</li>
                      <li>Drafting and executing the underwriting agreement</li>
                      <li>Coordinating with SEBI, stock exchanges, legal advisors and auditors</li>
                      <li>Managing the book-building process and investor outreach</li>
                      <li>Providing support during and after the listing</li>
                    </ul>
                    <p className="text-slate-500 leading-relaxed text-sm">
                      Selecting a credible and experienced merchant banker is critical, as their expertise and market standing directly affect the success of the IPO.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg bg-[#001529] text-[#f59e08]">
                    3
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">Appointment of Key Advisors</h3>
                    <p className="text-slate-500 leading-relaxed mb-4 text-sm">
                      In addition to the merchant banker, the company appoints a team of specialists, each with a defined role in the IPO process:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-500 leading-relaxed mb-4 text-sm">
                      <li><strong>Legal Advisors:</strong> Draft transaction documents and ensure compliance with SEBI regulations and applicable laws</li>
                      <li><strong>Statutory Auditors:</strong> Certify the company's financial statements and conduct requisite due diligence</li>
                      <li><strong>Registrar and Transfer Agent (RTA):</strong> Manages share allotment, refund processing and demat-related operations</li>
                      <li><strong>PR and Marketing Firms:</strong> Handle investor communications, media relations and retail investor awareness campaigns</li>
                    </ul>
                    <p className="text-slate-500 leading-relaxed text-sm">
                      These professionals work in coordination throughout the IPO lifecycle to ensure a seamless and compliant process.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg bg-[#001529] text-[#f59e08]">
                    4
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">Due Diligence</h3>
                    <p className="text-slate-500 leading-relaxed mb-4 text-sm">
                      Before filing any regulatory documents, a thorough due diligence exercise is conducted. This involves a comprehensive review of the company's financial records, legal structure, corporate governance practices, pending litigation and material risk factors.
                    </p>
                    <p className="text-slate-500 leading-relaxed text-sm">
                      The objective of due diligence is to ensure that all information that may influence an investor's decision is identified, verified and accurately disclosed. This process also protects the company from potential legal liability arising from any omission or misrepresentation in the offer documents.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg bg-[#001529] text-[#f59e08]">
                    5
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">Preparation of the Draft Red Herring Prospectus (DRHP)</h3>
                    <p className="text-slate-500 leading-relaxed mb-4 text-sm">
                      The Draft Red Herring Prospectus (DRHP) is one of the most important documents in the IPO process. It is a comprehensive disclosure document that provides investors and regulatory authorities with detailed information about the company's business, financials and the terms of the offering.
                    </p>
                    <p className="text-slate-500 leading-relaxed mb-4 text-sm">
                      A DRHP typically covers the following:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-500 leading-relaxed mb-4 text-sm">
                      <li><strong>Company Overview:</strong> Business model, key products and services, revenue sources, competitive strengths and management profile</li>
                      <li><strong>Financial Statements:</strong> Audited profit and loss accounts, balance sheets and cash flow statements for a minimum of three preceding financial years</li>
                      <li><strong>Risk Factors:</strong> Clear disclosure of business, market, regulatory and operational risks that may affect the company's performance</li>
                      <li><strong>Objects of the Issue:</strong> A detailed breakdown of how the IPO proceeds will be utilised, whether for capital expenditure, debt repayment, acquisitions, or working capital requirements</li>
                      <li><strong>Industry and Market Analysis:</strong> An overview of the sector, market size, growth trends and competitive landscape</li>
                      <li><strong>Legal and Regulatory Disclosures:</strong> Details of ongoing litigation, regulatory orders and corporate governance framework</li>
                    </ul>
                    <p className="text-slate-500 leading-relaxed text-sm">
                      The DRHP is jointly prepared by the merchant banker, legal advisors and auditors and is filed with SEBI upon completion.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg bg-[#001529] text-[#f59e08]">
                    6
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">SEBI Review and Approval</h3>
                    <p className="text-slate-500 leading-relaxed mb-4 text-sm">
                      Upon receipt of the DRHP, SEBI undertakes a detailed review to ensure that the document complies with its regulations and adequately protects investor interests. The review process involves the following:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-500 leading-relaxed mb-4 text-sm">
                      <li><strong>Document Scrutiny:</strong> SEBI examines the financial disclosures, risk factors and compliance status to verify accuracy and completeness</li>
                      <li><strong>Queries and Clarifications:</strong> If SEBI identifies any gaps or requires additional information, it issues an observation letter with specific queries, which the company must address within the prescribed timeline</li>
                      <li><strong>Modifications:</strong> Where disclosures are found to be insufficient, SEBI may direct the company to revise and resubmit the document</li>
                      <li><strong>Public Availability:</strong> The DRHP is made publicly accessible on SEBI's website, allowing investors, analysts and other stakeholders to review and raise concerns if required</li>
                    </ul>
                    <p className="text-slate-500 leading-relaxed text-sm">
                      Once SEBI is satisfied with the disclosures, it issues a formal observation letter, which serves as the regulatory clearance to proceed with the IPO.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg bg-[#001529] text-[#f59e08]">
                    7
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">Stock Exchange Listing Application</h3>
                    <p className="text-slate-500 leading-relaxed mb-4 text-sm">
                      Following SEBI's approval, the company applies for listing on one or more recognised stock exchanges in India, the National Stock Exchange (NSE), the Bombay Stock Exchange (BSE), or both. The stock exchange conducts its own review, assessing the following:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-500 leading-relaxed mb-4 text-sm">
                      <li><strong>Financial Eligibility:</strong> Compliance with the minimum net worth, profitability and paid-up capital requirements prescribed by the exchange</li>
                      <li><strong>Minimum Public Shareholding:</strong> For mainboard IPOs, at least 25% of the post-issue capital must be offered to the public</li>
                      <li><strong>Document Submission:</strong> Submission of the approved DRHP, financial statements and applicable compliance certificates</li>
                      <li><strong>In-Principle Approval:</strong> Upon satisfactory review, the stock exchange grants in-principle approval for listing, clearing the way for the IPO to open for subscription</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg bg-[#001529] text-[#f59e08]">
                    8
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">Roadshows and Pre-IPO Marketing</h3>
                    <p className="text-slate-500 leading-relaxed mb-4 text-sm">
                      With all approvals in place, the company and its merchant banker conduct a structured marketing campaign to generate investor interest ahead of the subscription period. This phase is critical for building demand and establishing the right valuation.
                    </p>
                    <p className="text-slate-500 leading-relaxed mb-4 text-sm">
                      Key activities during the pre-IPO marketing phase include:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-500 leading-relaxed mb-4 text-sm">
                      <li><strong>Investor Roadshows:</strong> The company's leadership team and merchant banker meet with institutional investors, mutual funds and high-net-worth individuals (HNIs) across major financial centres, both domestically and internationally</li>
                      <li><strong>Analyst and Media Briefings:</strong> Structured presentations for financial analysts and journalists to provide clarity on the company's business model, financials and growth prospects</li>
                      <li><strong>Retail Investor Campaigns:</strong> Public advertisements, digital outreach and media appearances to create awareness among retail investors</li>
                      <li><strong>Price Band Finalisation:</strong> Demand feedback gathered during roadshows is used to finalise the IPO price band in consultation with the merchant banker</li>
                      <li><strong>Publication of the Red Herring Prospectus (RHP):</strong> The final prospectus containing the confirmed price band, issue size and subscription schedule is published before the subscription window opens</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg bg-[#001529] text-[#f59e08]">
                    9
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">Price Band and Book-Building Process</h3>
                    <p className="text-slate-500 leading-relaxed mb-4 text-sm">
                      Most IPOs in India are conducted through the book-building mechanism, which enables market-driven price discovery. The company sets a price band consisting of a floor price and a cap price. Investors categorised as Qualified Institutional Buyers (QIBs), Non-Institutional Investors (NIIs) and retail investors submit their bids within this range.
                    </p>
                    <p className="text-slate-500 leading-relaxed text-sm">
                      Once the bidding period closes, all bids are aggregated to determine the final issue price, known as the cut-off price. This price reflects genuine investor demand and ensures a fair and transparent pricing process.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg bg-[#001529] text-[#f59e08]">
                    10
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">IPO Subscription Period</h3>
                    <p className="text-slate-500 leading-relaxed mb-4 text-sm">
                      The IPO is open for public subscription for a period of three working days, during which investors may apply for shares through the following mechanisms:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-500 leading-relaxed mb-4 text-sm">
                      <li><strong>ASBA (Application Supported by Blocked Amount):</strong> The bid amount is blocked in the investor's bank account at the time of application and is only debited upon successful allotment. In cases where allotment is not received, the blocked amount is released automatically.</li>
                      <li><strong>UPI-Based Applications:</strong> Retail investors may apply through their stockbroker platforms or banking applications using a UPI payment mandate, enabling a seamless, paperless application experience.</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg bg-[#001529] text-[#f59e08]">
                    11
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">Share Allotment and Stock Exchange Listing</h3>
                    <p className="text-slate-500 leading-relaxed mb-4 text-sm">
                      Once the subscription window closes, the Registrar and Transfer Agent processes all applications and allots shares in accordance with SEBI's prescribed methodology:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-500 leading-relaxed mb-6 text-sm">
                      <li><strong>Oversubscribed IPOs:</strong> In the retail investor category, allotment is carried out through a computerised lottery system. In the QIB and NII categories, shares are allotted on a proportionate basis.</li>
                      <li><strong>Refunds and Unblocking:</strong> Investors who do not receive an allotment have their ASBA amounts unblocked or refunded within the stipulated regulatory timeline.</li>
                      <li><strong>Demat Credit:</strong> Allotted shares are credited to successful applicants' demat accounts before the listing date.</li>
                      <li><strong>Listing Day:</strong> The company's shares are officially listed and begin trading on the stock exchange, marking its formal transition from a privately held entity to a publicly listed company.</li>
                    </ul>

                    <div className="bg-[#F8FAFC] border border-slate-200 p-6 rounded-2xl">
                      <p className="text-slate-500 leading-relaxed text-sm">
                        Stay updated with upcoming IPOs through the <Link href="/all-ipos" className="text-[#f59e08] font-bold hover:underline">IPO Calendar</Link> and explore detailed analysis at <Link href="/ipo-blogs" className="text-[#f59e08] font-bold hover:underline">IPO Company Reviews — GMP, Subscription Status & Allotment</Link>. For professional assistance, explore our Advisory Services, <Link href="/pre-ipo-consultant" className="text-[#f59e08] font-bold hover:underline">Pre-IPO Consulting</Link> and Advisory services.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-20 p-12 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #001529 0%, #002147 55%, #003380 100%)' }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5" style={{ background: '#f59e08', filter: 'blur(60px)', transform: 'translate(30%,-30%)' }} />
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 relative z-10 flex items-center justify-center gap-3">
                <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                Are You Ready for the <strong className="text-[#f59e08]">Next Leap?</strong>
              </h2>
              <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto font-medium relative z-10 text-sm">
                Let India IPO's expert advisory team guide you through the intricacies of the DRHP, SEBI filings, and merchant banker selection.
              </p>
              <div className="flex flex-wrap gap-4 justify-center relative z-10">
                <Link href="/contact">
                  <button className="px-10 py-4 text-lg font-black rounded-xl transition-all hover:scale-105 shadow-xl bg-gradient-to-r from-[#f59e08] to-[#d97706] text-[#001529] cursor-pointer border-0">
                    Consult Our Experts
                  </button>
                </Link>
                <Link href="/ipo-eligibility-check">
                  <button className="px-10 py-4 bg-transparent border-2 border-white text-white text-lg font-black rounded-xl transition-all hover:bg-white/5 shadow-md hidden md:inline-block cursor-pointer">
                    Check Eligibility First
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
