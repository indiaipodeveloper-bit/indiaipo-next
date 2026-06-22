import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronRight, FileSearch, CheckCircle } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

const BASE_URL = "https://www.indiaipo.in";

async function getBannerVideo() {
  const isDev = process.env.NODE_ENV === 'development';
  const apiBase = isDev ? "http://localhost:5000" : BASE_URL;

  try {
    const bannerRes = await fetch(`${apiBase}/api/banners?page=%2Fpre-ipo-process-guidance`, {
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
  title: "Pre-IPO Process Guidance | Complete Readiness for Unlisted Companies",
  description: "Comprehensive Pre-IPO consulting. Discover how to prepare your company financially, legally, and strategically 1-2 years before an Initial Public Offering in India.",
  keywords: "Pre-IPO preparation, IPO readiness, Corporate governance, Private Equity before IPO, HNI funding, Financial Restructuring, SME IPO preparation",
  alternates: {
    canonical: `${BASE_URL}/pre-ipo-process-guidance`,
  },
  openGraph: {
    title: "Pre-IPO Process Guidance | Complete Readiness for Unlisted Companies",
    description: "Comprehensive Pre-IPO consulting. Discover how to prepare your company financially, legally, and strategically 1-2 years before an Initial Public Offering in India.",
    url: `${BASE_URL}/pre-ipo-process-guidance`,
    type: "website",
  }
};

export default async function PreIpoProcessPage() {
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
                <FileSearch className="w-12 h-12 md:w-16 md:h-16" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-white/70 mb-4 font-medium">
                  <Link href="/" className="hover:text-white transition-colors">Home</Link>
                  <ChevronRight className="w-4 h-4 text-white/35" />
                  <span className="text-white">Pre-IPO Guidance</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                  Pre-IPO Guidance for a Successful Public Listing
                </h1>
                <p className="text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed text-sm">
                  Our Pre-IPO guidance helps companies navigate the 18–24 month journey to listing through structured financial preparation, governance alignment, and strategic positioning for public markets.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-background relative -mt-10 rounded-t-[40px] z-20">
          <div className="container mx-auto px-4 space-y-16">
            <div className="prose prose-lg prose-headings:text-foreground prose-p:text-muted-foreground max-w-none">
              <h2 className="text-3xl font-bold mb-3 flex items-center gap-3 text-[#001529]">
                <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                Pre IPO Process Guidance - Roadmap to a Successful IPO
              </h2>
              <p className="leading-relaxed text-slate-600 text-sm">
                Going public is one of the most defining moments in a company's history. It opens the doors to large-scale capital infusion, enhanced market credibility and long-term strategic growth. However, the path to a successful IPO does not begin on the day of filing; it begins well before, with thorough and structured preparation.
              </p>
              <p className="leading-relaxed mt-4 text-slate-600 text-sm">
                The pre-IPO process is not merely about assembling documents. It requires the company to be ready from within, legally, financially, operationally and strategically to meet the rigorous standards of India's capital markets. At India IPO, we offer specialised Pre-IPO Process Guidance to help you transition from a private enterprise to a publicly listed company in a structured, compliant, and well-timed manner.
              </p>
            </div>

            <div className="space-y-12">
              <div className="py-4">
                <h2 className="text-3xl font-bold mb-3 flex items-center gap-3 text-[#001529]">
                  <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                  Why Pre-IPO Guidance Is Essential
                </h2>
                <p className="text-slate-500 leading-relaxed mb-6 text-sm">
                  Many companies approach the IPO process without a clear understanding of what SEBI, stock exchanges and investors actually expect. This lack of preparation often leads to avoidable and costly consequences:
                </p>
                <ul className="space-y-4">
                  {[
                    {
                      title: "Regulatory Delays",
                      desc: "Incomplete or non-compliant filings invite queries from SEBI or stock exchanges, potentially pushing your IPO timeline back by several months"
                    },
                    {
                      title: "Higher Costs",
                      desc: "Last-minute document rework, emergency audits and unplanned legal revisions add significant expense to the process"
                    },
                    {
                      title: "Missed Market Windows",
                      desc: "Poor readiness can cause a company to miss the optimal market cycle, resulting in lower investor interest and subdued valuations"
                    },
                    {
                      title: "Investor Scepticism",
                      desc: "Weak corporate governance, inconsistent financial records, or a lack of disclosure transparency can undermine investor confidence before the IPO even opens"
                    }
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-4">
                      <CheckCircle className="w-6 h-6 shrink-0 mt-1 text-emerald-500" />
                      <div>
                        <h4 className="font-bold text-lg text-slate-800">{item.title}</h4>
                        <p className="text-slate-500 text-sm">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="text-[#001529] leading-relaxed mt-8 font-medium italic text-sm">
                  With structured pre-IPO guidance, these risks are identified and addressed well in advance, allowing your company to enter the market prepared, credible and strategically positioned.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-3 flex items-center gap-3 text-[#001529]">
                  <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                  Our Pre-IPO Process Guidance Services
                </h2>
                <p className="text-slate-500 mb-10 text-sm">
                  We provide end-to-end pre-IPO support across all critical dimensions of IPO preparation.
                </p>

                <div className="grid grid-cols-1 gap-8">
                  <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                    <h3 className="text-2xl font-bold mb-6 text-[#001529]">IPO Readiness Assessment</h3>
                    <p className="text-slate-500 mb-6 text-sm">
                      We begin with a comprehensive evaluation of your company's current readiness for a public offering. This includes:
                    </p>
                    <ul className="grid md:grid-cols-2 gap-6 text-slate-500 text-sm">
                      <li className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-[#f59e08] mt-2 shrink-0" />
                        <span>Reviewing financial performance, revenue trends and profitability metrics</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-[#f59e08] mt-2 shrink-0" />
                        <span>Assessing the quality of corporate governance practices and internal controls</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-[#f59e08] mt-2 shrink-0" />
                        <span>Identifying gaps in SEBI compliance and stock exchange listing requirements</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-[#f59e08] mt-2 shrink-0" />
                        <span>Evaluating market positioning, business scalability and investor appeal</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                    <h3 className="text-2xl font-bold mb-6 text-[#001529]">IPO Structuring and Strategic Planning</h3>
                    <p className="text-slate-500 mb-6 text-sm">
                      No two companies are alike and therefore no two IPO strategies should be identical. We work closely with your leadership team to customise an approach that aligns with your business objectives:
                    </p>
                    <ul className="grid md:grid-cols-2 gap-6 text-slate-500 text-sm">
                      <li className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-[#f59e08] mt-2 shrink-0" />
                        <span><strong>IPO Route:</strong> Determining whether a Mainboard IPO, SME IPO, or another listing platform is most appropriate for your company's size and stage</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-[#f59e08] mt-2 shrink-0" />
                        <span><strong>Timing:</strong> Identifying the right market cycle to maximise investor interest and achieve the best possible valuation</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-[#f59e08] mt-2 shrink-0" />
                        <span><strong>Issue Size and Valuation:</strong> Striking the right balance between the quantum of funds raised and the promoter's shareholding post-listing</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-[#f59e08] mt-2 shrink-0" />
                        <span><strong>Shareholding Structure:</strong> Ensuring that promoter, investor and public shareholding proportions are aligned with SEBI norms</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                    <h3 className="text-2xl font-bold mb-6 text-[#001529]">Financial Preparation and Compliance Alignment</h3>
                    <p className="text-slate-500 mb-6 text-sm">
                      Investors and regulators demand complete financial transparency. We guide your finance team through:
                    </p>
                    <ul className="grid md:grid-cols-2 gap-6 text-slate-500 text-sm">
                      <li className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-[#f59e08] mt-2 shrink-0" />
                        <span>Restating financial accounts in accordance with SEBI requirements and Ind-AS (Indian Accounting Standards) norms</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-[#f59e08] mt-2 shrink-0" />
                        <span>Conducting and coordinating statutory and internal audits</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-[#f59e08] mt-2 shrink-0" />
                        <span>Resolving historical compliance issues that could attract regulatory scrutiny</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-[#f59e08] mt-2 shrink-0" />
                        <span>Establishing systems for quarterly financial disclosures and investor reporting post-listing</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-6">
              <h2 className="text-3xl font-bold mb-3 flex items-center gap-3 text-[#001529]">
                <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                Our Step-by-Step Pre-IPO Roadmap
              </h2>
              <p className="text-slate-500 mb-12 text-sm">
                We follow a structured, phased methodology to ensure complete IPO preparedness:
              </p>

              <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 hidden md:block" />
                {[
                  { step: 1, title: "Eligibility Study and Initial Consultation", desc: "Understanding your business goals, fundraising objectives and current readiness" },
                  { step: 2, title: "Strategic Structuring", desc: "Finalising the IPO route, issue size, valuation approach and fundraising targets" },
                  { step: 3, title: "Compliance and Governance Audit", desc: "Identifying and closing regulatory gaps before SEBI scrutiny" },
                  { step: 4, title: "Financial and Legal Preparation", desc: "Ensuring all financial records, legal filings and corporate documents meet public company standards" },
                  { step: 5, title: "DRHP Drafting and Filing", desc: "Preparing a clear, compliant and compelling prospectus for SEBI submission" },
                  { step: 6, title: "SEBI and Exchange Approval Coordination", desc: "Managing regulatory queries and facilitating timely approvals" },
                  { step: 7, title: "Pre-IPO Marketing", desc: "Engaging institutional investors, analysts and retail audiences to build demand" },
                  { step: 8, title: "IPO Launch Support", desc: "Overseeing the subscription period through to successful listing on the stock exchange" }
                ].map((item, idx) => (
                  <div key={idx} className={`relative flex items-start gap-6 ${idx % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="w-12 h-12 rounded-full bg-[#001529] text-[#f59e08] flex items-center justify-center shrink-0 font-bold text-xl shadow-lg z-10">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-xl mb-2 text-slate-800">{item.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-3 flex items-center gap-3 text-[#001529]">
                <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                The Phenomenon of "Pre-IPO Funding"
              </h2>
              <div className="prose prose-lg prose-p:text-muted-foreground max-w-none">
                <p className="leading-relaxed text-slate-600 text-sm">
                  Apart from operational readiness, one of the most critical aspects of the Pre-IPO phase is <strong>Pre-IPO Placement or Funding</strong>. Rather than waiting for the public issue to discover the company's valuation, promoters opt to raise emergency or growth capital 6 to 12 months prior to the IPO from select High Net Worth Individuals (HNIs), Private Equity (PE) funds, or Sovereign wealth funds.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-8 mb-4">
                  {[
                    "Establishes a solid valuation floor before pricing the main IPO.",
                    "Brings strategic institutional investors onto the cap table.",
                    "Reduces the public issue size, minimizing absolute listing risk.",
                    "Improves market sentiment when retail investors see large funds backing it."
                  ].map((benefit, bidx) => (
                    <div key={bidx} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex items-start gap-4">
                      <CheckCircle className="w-6 h-6 shrink-0 text-emerald-500" />
                      <span className="font-medium text-slate-700 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm italic border-l-4 border-amber-500 pl-4 py-2 bg-amber-500/5 rounded-r-lg mt-8 text-slate-600">
                  <strong>Regulatory Note:</strong> If a Pre-IPO placement is completed after the filing of the Draft Red Herring Prospectus (DRHP) with SEBI, the size of the fresh issue in the IPO is proportionately reduced. Furthermore, shares allotted to pre-IPO investors are subject to strict lock-in periods post-listing.
                </p>
              </div>
            </div>

            <div className="py-12 border-t border-slate-200 mt-12">
              <div className="bg-[#F8FAFC] p-8 rounded-3xl border border-slate-200">
                <h4 className="text-xl font-bold mb-4 text-[#001529]">Maximise Valuation. Minimise Delays. List with Confidence with India IPO's Pre-IPO Guidance.</h4>
                <p className="text-slate-500 leading-relaxed text-sm">
                  Understand how IPOs work through our <Link href="/ipo-process" className="text-[#f59e08] font-bold hover:underline">IPO Process</Link> guide. Stay updated with upcoming listings via the <Link href="/all-ipos" className="text-[#f59e08] font-bold hover:underline">IPO Calendar</Link> and read expert analysis at <Link href="/ipo-blogs" className="text-[#f59e08] font-bold hover:underline">IPO Company Reviews — GMP, Subscription Status & Allotment</Link>. Explore our Corporate Finance Services, Business Valuation Services and Rights Issue Advisory for comprehensive IPO guidance.
                </p>
              </div>
            </div>

            <div className="mt-20 p-12 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #001529 0%, #002147 55%, #003380 100%)' }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5" style={{ background: '#f59e08', filter: 'blur(60px)', transform: 'translate(30%,-30%)' }} />
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 relative z-10 flex items-center justify-center gap-3">
                <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                Don't Wait Until the <strong className="text-[#f59e08]">Last Minute</strong>
              </h2>
              <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto font-medium relative z-10 text-sm">
                A botched DRHP filing due to poor preparation can delay your IPO by years. Engage with our Pre-IPO experts today to architect a foolproof listing strategy.
              </p>
              <div className="flex flex-wrap gap-4 justify-center relative z-10">
                <Link href="/contact">
                  <button className="px-10 py-4 text-lg font-black rounded-xl transition-all hover:scale-105 shadow-xl bg-gradient-to-r from-[#f59e08] to-[#d97706] text-[#001529] cursor-pointer border-0">
                    Start Pre-IPO Advisory
                  </button>
                </Link>
                <Link href="/ipo-eligibility-check">
                  <button className="px-10 py-4 bg-transparent border-2 border-white text-white text-lg font-black rounded-xl transition-all hover:bg-white/5 shadow-sm hidden md:inline-block cursor-pointer">
                    Check IPO Eligibility
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
