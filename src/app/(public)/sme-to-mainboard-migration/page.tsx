import type { Metadata } from "next";
import Link from "next/link";
import MigrationClient from "./MigrationClient";
import { ArrowRight, ChevronRight, TrendingUp } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { API_URL, BASE_URL } from "@/lib/constants";

async function getBannerVideo() {
  try {
    const bannerRes = await fetch(`${API_URL}/api/banners?page=%2Fsme-to-mainboard-migration`, {
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
  title: "SME to Mainboard Migration Guide | India IPO",
  description: "Comprehensive guide for migrating from BSE SME or NSE Emerge platforms to the Mainboard exchange in India. Check eligibility, regulatory norms, and process.",
  keywords: "SME to Mainboard migration, BSE SME migration, NSE Emerge migration, SEBI ICDR Chapter XB, SEBI LODR, IPO consultancy India",
  alternates: {
    canonical: `${BASE_URL}/sme-to-mainboard-migration`,
  },
  openGraph: {
    title: "SME to Mainboard Migration Guide | India IPO",
    description: "Comprehensive guide for migrating from BSE SME or NSE Emerge platforms to the Mainboard exchange in India. Check eligibility, regulatory norms, and process.",
    url: `${BASE_URL}/sme-to-mainboard-migration`,
    type: "website",
  }
};

export default async function MigrationPage() {
  const bannerVideo = await getBannerVideo();

  return (
    <div className="min-h-screen bg-background flex flex-col">

      <main className="flex-grow">
        {/* Hero Section */}
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
                <div className="flex items-center gap-2 text-md text-white/70 mb-4 font-medium">
                  <Link href="/" className="hover:text-white transition-colors">Home</Link>
                  <ChevronRight className="w-4 h-4 text-white/35" />
                  <span className="text-white">Migration From SME to Mainboard</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight font-heading">
                  Migration From SME to Mainboard
                </h1>
                <p className="text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed text-md">
                  A Complete Guide to Migration in India's Capital Markets. Learn how small and medium enterprises transition to the primary national stock exchanges.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-background relative -mt-10 rounded-t-[40px] z-20">
          <MigrationClient>

            {/* Introduction */}
            <div className="prose prose-lg prose-headings:text-foreground prose-p:text-muted-foreground max-w-none">
              <p className="leading-relaxed text-slate-600 text-md">
                Imagine a company that was small in size and raised a small amount of capital from a few investors through its SME IPO on the BSE SME or the NSE Emerge. The same company now has an opportunity to move to the biggest exchanges in the country. This is the story of small companies of India migrating to the mainboard exchanges. The journey from SME to the Mainboard of stock exchanges means a lot for these smaller companies - it is a public declaration of scale, governance, and permanence. It is a clear signal that the company has successfully developed to the point where it is ready to compete with leading companies being traded on national stock exchanges.
              </p>
              <p className="leading-relaxed mt-4 text-slate-600 text-md">
                This article provides a comprehensive overview of everything you need to know about the SME-to-Mainboard migration route, covering the regulatory framework, migration requirements, procedures, documentation, challenges, and the latest trends shaping this pathway as of 2026.
              </p>
            </div>

            {/* What is Migration */}
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-[#001529] font-heading">
                <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                What Is SME-to-Mainboard Migration?
              </h2>
              <p className="leading-relaxed mb-6 text-slate-600 text-md">
                Migration, in the capital markets context, refers to the formal shift of a company listed on the SME platform of BSE (BSE SME) or NSE (NSE Emerge) to the mainboard of the respective exchange - BSE or NSE.
              </p>
              <p className="leading-relaxed mb-6 text-slate-600 text-md">
                India has two distinct listing ecosystems for equity:
              </p>
              <ul className="list-disc pl-5 space-y-3 text-slate-500 leading-relaxed text-md">
                <li><strong>SME Platform (BSE SME / NSE Emerge):</strong> Designed for small and medium enterprises with lower eligibility thresholds, lighter compliance requirements, and a mandatory market-making mechanism to ensure liquidity.</li>
                <li><strong>Mainboard (BSE / NSE):</strong> The primary exchange for larger, established companies with significantly higher financial, governance, and disclosure standards.</li>
              </ul>
              <p className="leading-relaxed mt-6 text-slate-600 text-md">
                The SME platform was always conceived as a launchpad, not a permanent home. SEBI and the exchanges designed it with migration as the intended end-state for successful companies - a structured graduation pathway.
              </p>
            </div>

            {/* Regulatory Framework */}
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-[#001529] font-heading">
                <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                Regulatory Framework Governing Migration
              </h2>
              <p className="leading-relaxed mb-6 text-slate-600 text-md">
                Migration is governed by a multi-layered regulatory framework, which includes:
              </p>

              <h3 className="text-2xl font-bold mb-3 text-slate-800 font-heading">SEBI Regulations</h3>
              <ul className="list-disc pl-5 space-y-3 text-slate-500 leading-relaxed text-md mb-8">
                <li><strong>SEBI (Issue of Capital and Disclosure Requirements) Regulations, 2018 (ICDR Regulations):</strong> Chapter XB governs the framework for SME platforms and migration to the mainboard.</li>
                <li><strong>SEBI (Listing Obligations and Disclosure Requirements) Regulations, 2015 (LODR Regulations):</strong> Once the migration process is complete, the company must comply with the full LODR requirements applicable to mainboard-listed companies, including quarterly reporting, board composition, and continuous disclosure obligations.</li>
                <li><strong>SEBI Circular dated May 18, 2010:</strong> The foundational circular that established the initial migration policy; subsequent exchange-specific updates build upon this framework.</li>
              </ul>

              <h3 className="text-2xl font-bold mb-3 text-slate-800 font-heading">Exchange-Specific Circulars</h3>
              <p className="leading-relaxed mb-4 text-slate-600 text-md">
                Both BSE and NSE have issued their own updated eligibility circulars:
              </p>
              <ul className="list-disc pl-5 space-y-3 text-slate-500 leading-relaxed text-md">
                <li><strong>NSE Circular NSE/CML/67671 dated April 24, 2025</strong> (effective May 1, 2025) - comprehensively revised NSE SME migration eligibility criteria.</li>
                <li><strong>BSE August 2025 Circular</strong> - significantly raised BSE SME migration thresholds, particularly on EBITDA and shareholder count.</li>
                <li><strong>SEBI-revised BSE norms effective March 1, 2026</strong> - the latest round of tightening for BSE SME migration.</li>
              </ul>
            </div>

            {/* Voluntary vs. Mandatory Migration */}
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-[#001529] font-heading">
                <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                Voluntary vs. Mandatory Migration
              </h2>
              <p className="leading-relaxed mb-6 text-slate-600 text-md">
                SEBI has clearly defined the migration triggers based on paid-up capital:
              </p>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl mb-8">
                <table className="w-full text-left border-collapse text-md text-slate-600">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                      <th className="py-3 px-4 font-bold text-[#001529]">Paid-Up Capital Range</th>
                      <th className="py-3 px-4 font-bold text-[#001529]">Migration Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-4">Less than ₹10 crore</td>
                      <td className="py-3 px-4">Must remain on the SME platform</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Between ₹10 crore and ₹25 crore</td>
                      <td className="py-3 px-4">Voluntary migration permitted</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Exceeding ₹25 crore</td>
                      <td className="py-3 px-4">Must migrate or comply with full LODR</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Alert Update */}
              <div className="bg-amber-50 border-l-4 border-[#f59e08] p-5 rounded-r-xl">
                <p className="text-slate-700 text-md leading-relaxed">
                  <strong>Important 2025 update:</strong> With the latest changes to the SEBI ICDR, SMEs with paid-up capital exceeding ₹25 crore are eligible to raise additional funding without migrating to the mainboard exchange, provided they comply with the SEBI LODR Regulations, 2015.
                </p>
              </div>
            </div>

            {/* Criteria BSE SME */}
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-[#001529] font-heading">
                <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                Migration Criteria From BSE SME to BSE Mainboard
              </h2>
              <p className="leading-relaxed mb-6 text-slate-600 text-md">
                The most updated BSE migration norms (effective August 2025, with further SEBI revisions from March 2026) are substantially tighter than what existed even two years ago. The key eligibility conditions are:
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800 font-heading">Financial Criteria</h3>
                  <ul className="list-disc pl-5 space-y-2 text-slate-500 leading-relaxed text-md">
                    <li><strong>Paid-up capital:</strong> Minimum ₹10 crore</li>
                    <li><strong>Market capitalisation:</strong> Minimum average market capitalisation of ₹100 crore for the last 6 months (total of all trading days' market capitalisation ÷ number of trading days) - higher from the previous ₹25 crore requirement</li>
                    <li><strong>Operating profit (EBITDA):</strong> Average EBITDA of ₹15 crore over the last 3 financial years, with a minimum of ₹10 crore in each individual year - significantly tightened from the earlier requirement of simply positive EBITDA in 2 of 3 years</li>
                    <li><strong>Net tangible assets:</strong> Minimum ₹3 crore in each of the last 3 financial years</li>
                    <li><strong>PAT:</strong> Positive profit after tax in the most recent financial year</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800 font-heading">Listing Track Record</h3>
                  <ul className="list-disc pl-5 space-y-2 text-slate-500 leading-relaxed text-md">
                    <li>Minimum <strong>3 years of listing</strong> on the BSE SME platform (effective January 2024, raised from 2 years)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800 font-heading">Shareholder Requirements</h3>
                  <ul className="list-disc pl-5 space-y-2 text-slate-500 leading-relaxed text-md">
                    <li>Minimum <strong>1,000 public shareholders</strong> (raised from the earlier 250 threshold, four times the original bar)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800 font-heading">Promoter Requirements</h3>
                  <ul className="list-disc pl-5 space-y-2 text-slate-500 leading-relaxed text-md">
                    <li>Promoters must hold at least <strong>20% of the total equity share capital</strong> at the time of application</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800 font-heading">Liquidity Requirements (New)</h3>
                  <ul className="list-disc pl-5 space-y-2 text-slate-500 leading-relaxed text-md">
                    <li>Trading must have occurred on at least <strong>80% of trading days</strong> in the last 6 months</li>
                    <li>At least <strong>5% of the weighted average number of equity shares listed</strong> must have traded in the preceding 6 months</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800 font-heading">Governance and Compliance</h3>
                  <ul className="list-disc pl-5 space-y-2 text-slate-500 leading-relaxed text-md">
                    <li>The company should <strong>not be under BIFR, IBC, or NCLT winding-up proceedings</strong></li>
                    <li><strong>No material regulatory or disciplinary action</strong> by any stock exchange or regulatory authority in the past 3 years against the company, its promoters, or promoting companies</li>
                    <li><strong>No debarment by SEBI</strong> for the company, its directors, or promoters</li>
                    <li><strong>No pending investor complaints</strong> on SEBI's SCORES platform</li>
                    <li><strong>Certification by a SEBI-registered credit rating agency</strong> confirming utilisation of IPO proceeds</li>
                    <li><strong>No default</strong> on interest or principal repayments to debenture, bond, or fixed deposit holders</li>
                    <li>A <strong>2-month cooling period</strong> must have elapsed since the company was removed from any surveillance/trade-to-trade category</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800 font-heading">Special Condition: Name Change</h3>
                  <p className="text-slate-500 leading-relaxed text-md">
                    If the company has changed its name in the last 1 year, it must demonstrate revenue of at least <strong>₹1 crore in each of the preceding 3 financial years</strong> (restated and consolidated) from the activity suggested by the new name.
                  </p>
                </div>
              </div>
            </div>

            {/* Criteria NSE Emerge */}
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-[#001529] font-heading">
                <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                Migration Criteria From NSE Emerge to NSE Mainboard
              </h2>
              <p className="leading-relaxed mb-6 text-slate-600 text-md">
                NSE issued its revised migration criteria vide Circular NSE/CML/67671, effective <strong>May 1, 2025</strong>.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800 font-heading">Financial Criteria</h3>
                  <ul className="list-disc pl-5 space-y-2 text-slate-500 leading-relaxed text-md">
                    <li><strong>Paid-up capital:</strong> Minimum ₹10 crore</li>
                    <li><strong>Market capitalisation:</strong> Average market cap of at least ₹100 crore (based on the average of the weekly high and low closing prices over the 3 months preceding the application date, multiplied by the post-issue number of equity shares)</li>
                    <li><strong>Revenue from operations:</strong> Must exceed ₹100 crore in the last financial year</li>
                    <li><strong>EBITDA:</strong> Positive operating profit from operations for at least <strong>2 out of 3 financial years</strong> preceding the application</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800 font-heading">Listing Track Record</h3>
                  <ul className="list-disc pl-5 space-y-2 text-slate-500 leading-relaxed text-md">
                    <li>Minimum <strong>3 years</strong> on the NSE SME/Emerge platform</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800 font-heading">Shareholder Requirements</h3>
                  <ul className="list-disc pl-5 space-y-2 text-slate-500 leading-relaxed text-md">
                    <li><strong>Minimum 500 public shareholders on the date of application</strong>. While NSE relaxed its requirement from 1,000 to 500 public shareholders in 2024, BSE has taken the opposite approach by requiring 1,000 public shareholders for SME-to-mainboard migration.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800 font-heading">Promoter Requirements</h3>
                  <ul className="list-disc pl-5 space-y-2 text-slate-500 leading-relaxed text-md">
                    <li>The promoter and promoter group must hold at least <strong>20% of the equity share capital</strong> at the time of application</li>
                    <li>On the date of application, promoters must hold <strong>at least 50% of the shares they held at the time of the company's original listing</strong> (i.e., promoters cannot have offloaded more than half their stake since listing)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800 font-heading">Net Worth</h3>
                  <ul className="list-disc pl-5 space-y-2 text-slate-500 leading-relaxed text-md">
                    <li>At least <strong>₹75 crore</strong> (per SEBI guidelines)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-800 font-heading">Other Conditions</h3>
                  <ul className="list-disc pl-5 space-y-2 text-slate-500 leading-relaxed text-md">
                    <li>No IBC, winding-up petition, or BIFR proceedings</li>
                    <li>No material regulatory action or trading suspension in the past 3 years</li>
                    <li>No SEBI debarment for the company, promoters, subsidiaries, or directors</li>
                    <li>No pending SCORES complaints</li>
                    <li>A 2-month cooling period after removal from the trade-to-trade or surveillance category</li>
                    <li>No default on debenture, bond, or fixed deposit payments</li>
                    <li>NSE retains the right to reject applications if criteria are not met, information is incomplete or misleading, or for any other reason it deems fit</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div>
              <h2 className="text-3xl font-bold mb-10 flex items-center gap-3 text-[#001529] font-heading">
                <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                BSE vs. NSE Migration Criteria: A Comparison
              </h2>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left border-collapse text-md text-slate-600">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                      <th className="py-3.5 px-4 font-bold text-[#001529] border-r border-slate-200">Parameter</th>
                      <th className="py-3.5 px-4 font-bold text-[#001529] border-r border-slate-200">BSE SME → BSE Mainboard</th>
                      <th className="py-3.5 px-4 font-bold text-[#001529]">NSE Emerge → NSE Mainboard</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-800 border-r border-slate-200">Min. Paid-up Capital</td>
                      <td className="py-3 px-4 border-r border-slate-200">₹10 crore</td>
                      <td className="py-3 px-4">₹10 crore</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-800 border-r border-slate-200">Min. Market Cap</td>
                      <td className="py-3 px-4 border-r border-slate-200">₹100 crore (6-month average)</td>
                      <td className="py-3 px-4">₹100 crore (3-month average)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-800 border-r border-slate-200">Revenue Threshold</td>
                      <td className="py-3 px-4 border-r border-slate-200">Not explicitly specified</td>
                      <td className="py-3 px-4">&gt;₹100 crore in the last FY</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-800 border-r border-slate-200">EBITDA Requirement</td>
                      <td className="py-3 px-4 border-r border-slate-200">Avg. ₹15 crore (3 years); min ₹10 crore/year</td>
                      <td className="py-3 px-4">Positive in 2 of 3 financial years</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-800 border-r border-slate-200">Net Worth</td>
                      <td className="py-3 px-4 border-r border-slate-200">Not separately stated</td>
                      <td className="py-3 px-4">₹75 crore</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-800 border-r border-slate-200">Public Shareholders</td>
                      <td className="py-3 px-4 border-r border-slate-200">1,000</td>
                      <td className="py-3 px-4">500</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-800 border-r border-slate-200">Listing Period</td>
                      <td className="py-3 px-4 border-r border-slate-200">3 years</td>
                      <td className="py-3 px-4">3 years</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-800 border-r border-slate-200">Promoter Holding</td>
                      <td className="py-3 px-4 border-r border-slate-200">Min. 20%</td>
                      <td className="py-3 px-4">Min. 20%; ≥50% of listing-day holding</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-800 border-r border-slate-200">Liquidity</td>
                      <td className="py-3 px-4 border-r border-slate-200">5% traded; 80% trading days</td>
                      <td className="py-3 px-4">Not explicitly quantified</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-800 border-r border-slate-200">SCORES Complaints</td>
                      <td className="py-3 px-4 border-r border-slate-200">Nil</td>
                      <td className="py-3 px-4">Nil</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-slate-800 border-r border-slate-200">IPO Proceeds Certification</td>
                      <td className="py-3 px-4 border-r border-slate-200">Required (credit rating agency)</td>
                      <td className="py-3 px-4">Required</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step-by-Step process */}
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-[#001529] font-heading">
                <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                The Migration Process: Step by Step
              </h2>
              <p className="leading-relaxed mb-10 text-slate-600 text-md">
                The typical SME-to-mainboard migration timeline is <strong>3.5 to 6 months</strong>, depending on company readiness and exchange approval timelines.
              </p>

              <div className="space-y-12">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg bg-[#001529] text-[#f59e08]">
                    1
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">Step 1: Internal Eligibility Assessment</h3>
                    <p className="text-slate-500 leading-relaxed text-md">
                      The company does a comprehensive self-assessment in coordination with its merchant banker or compliance advisor against the relevant exchange's checklist in relation to its financials, shareholding pattern, market capitalisation, governance track record and SCORES status.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg bg-[#001529] text-[#f59e08]">
                    2
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">Step 2: Shareholder Approval via Special Resolution</h3>
                    <p className="text-slate-500 leading-relaxed text-md">
                      A special resolution must be passed at least two-thirds of non-promoter shareholders (public shareholders) must vote in favour of the migration. This is typically done at an Annual General Meeting (AGM) or an Extraordinary General Meeting (EGM).
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg bg-[#001529] text-[#f59e08]">
                    3
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">Step 3: Appointment of Intermediaries</h3>
                    <p className="text-slate-500 leading-relaxed mb-3 text-md">
                      The company typically appoints:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-500 leading-relaxed text-md">
                      <li>A <strong>SEBI-registered Merchant Banker</strong> to manage the process and due diligence</li>
                      <li>A <strong>Compliance Officer / Company Secretary</strong> to coordinate regulatory filings</li>
                      <li>A <strong>SEBI-registered Credit Rating Agency</strong> (for IPO proceeds certification)</li>
                      <li>A <strong>Registrar and Transfer Agent (RTA)</strong></li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg bg-[#001529] text-[#f59e08]">
                    4
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">Step 4: Document Preparation</h3>
                    <p className="text-slate-500 leading-relaxed mb-3 text-md">
                      This is the most intensive phase. Required documents include:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-500 leading-relaxed text-md">
                      <li>Audited financial statements for the last 3 years</li>
                      <li>Shareholding pattern (latest quarter)</li>
                      <li>Board resolution and special resolution passed by shareholders</li>
                      <li>Certificate from a credit rating agency on IPO proceeds utilisation</li>
                      <li>Compliance certificate from a practising company secretary</li>
                      <li>No-objection certificate (if applicable) from the existing stock exchange</li>
                      <li>Disclosure of all pending litigation, regulatory actions, and SCORES status</li>
                      <li>PAN and DIN of all directors</li>
                      <li>Details of any change in control or name change in the last year</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg bg-[#001529] text-[#f59e08]">
                    5
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">Step 5: Application to the Exchange</h3>
                    <p className="text-slate-500 leading-relaxed text-md">
                      The company applies for a migration to the mainboard exchange (BSE or NSE) with all necessary documents and fees.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg bg-[#001529] text-[#f59e08]">
                    6
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">Step 6: Exchange Review and Due Diligence</h3>
                    <p className="text-slate-500 leading-relaxed text-md">
                      The exchange conducts its due diligence by reviewing the financials, compliance report and governance documentation. It can ask for further clarification if needed. Both the NSE and BSE have the right to refuse migration applications for any reason if anything is found inappropriate.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg bg-[#001529] text-[#f59e08]">
                    7
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">Step 7: In-Principle Approval</h3>
                    <p className="text-slate-500 leading-relaxed text-md">
                      Once satisfied, the exchange issues an in-principle approval for migration.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg bg-[#001529] text-[#f59e08]">
                    8
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">Step 8: Compliance Transition</h3>
                    <p className="text-slate-500 leading-relaxed text-md">
                      The company moves from the SME-specific compliance to LODR Regulations of SEBI, 2015, which includes a change in board structure (independent directors, audit committee), quarterly financials and continuous disclosure obligations.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 font-bold text-2xl shadow-lg bg-[#001529] text-[#f59e08]">
                    9
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-800">Step 9: Delisting from SME + Listing on Mainboard</h3>
                    <p className="text-slate-500 leading-relaxed text-md">
                      The company gets delisted from the SME platform and listed on the mainboard simultaneously. The market-making arrangement, which is mandatory on SME platforms, is discontinued.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Post-Migration Compliance Obligations */}
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-[#001529] font-heading">
                <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                Important Post-Migration Compliance Obligations
              </h2>
              <p className="leading-relaxed mb-6 text-slate-600 text-md">
                Once the company is listed on the mainboard, it shifts to the LODR framework from the relatively lighter SME framework. The major changes include:
              </p>
              <ul className="list-disc pl-5 space-y-3 text-slate-500 leading-relaxed text-md">
                <li><strong>Board composition:</strong> Must include independent directors for meeting LODR requirements</li>
                <li><strong>Audit committee, Nomination & Remuneration Committee (NRC):</strong> Mandatory under LODR</li>
                <li><strong>Quarterly financial results:</strong> Must be published as per LODR timelines</li>
                <li><strong>Related-party transactions:</strong> Full LODR disclosure and shareholder approval requirements apply</li>
                <li><strong>Corporate governance report:</strong> Must be submitted with the annual report</li>
                <li><strong>SCORES compliance:</strong> Must maintain an active grievance redressal mechanism</li>
                <li><strong>Market making is no longer required:</strong> But the stock must have natural liquidity</li>
                <li><strong>Minimum public shareholding (MPS) of 25%:</strong> Must be maintained under SEBI norms</li>
                <li><strong>Minimum investment lot restriction:</strong> The restriction that existed on the SME platform (minimum ₹1 lakh application) is lifted - retail investors can buy even a single share</li>
              </ul>
            </div>

            {/* Why Migrate: Benefits */}
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-[#001529] font-heading">
                <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                Why Companies Migrate from SME to Mainboard: The Benefits
              </h2>
              <p className="leading-relaxed mb-8 text-slate-600 text-md">
                Graduating to the Mainboard opens up a new paradigm of growth, capital access, and brand reputation for a company:
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800 font-heading">Access to a Larger and More Diverse Investor Base</h3>
                  <p className="text-slate-500 leading-relaxed text-md">
                    The mainboard opens the company to institutional investors - domestic mutual funds, foreign portfolio investors (FPIs), insurance companies, and pension funds that are restricted from investing in SME-listed companies due to internal mandates.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800 font-heading">Enhanced Market Capitalisation and Liquidity</h3>
                  <p className="text-slate-500 leading-relaxed text-md">
                    When more players participate without any restrictions on minimum lot size, it leads to improved liquidity. Improved liquidity usually leads to stable and even better valuations.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800 font-heading">Brand Credibility and Visibility</h3>
                  <p className="text-slate-500 leading-relaxed text-md">
                    A listing on the NSE/BSE mainboard brings in a different brand perception compared to an SME listing. For B2B firms and their large enterprise clients, a mainboard listing works as an essential means to convey a message of financial stability and institutional credibility.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800 font-heading">Easier Capital Raising</h3>
                  <p className="text-slate-500 leading-relaxed text-md">
                    On the mainboard, companies can raise follow-on capital through Qualified Institutional Placements (QIPs), rights issues, and Offer for Sale (OFS) mechanisms - all at significantly lower cost and with a much wider pool of potential investors.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800 font-heading">Talent Attraction</h3>
                  <p className="text-slate-500 leading-relaxed text-md">
                    ESOPs from a mainboard-listed company are far more attractive to senior talent than those from an SME-listed entity, both in terms of liquidity and perceived market value.
                  </p>
                </div>
              </div>
            </div>

            {/* Migration Statistics */}
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-[#001529] font-heading">
                <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                Migration Statistics: A Market in Transition
              </h2>
              <p className="leading-relaxed mb-6 text-slate-600 text-md">
                The migration pipeline tells a fascinating story of regulatory evolution:
              </p>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl mb-8 max-w-md">
                <table className="w-full text-left border-collapse text-md text-slate-600">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                      <th className="py-3 px-4 font-bold text-[#001529] border-r border-slate-200">Year</th>
                      <th className="py-3 px-4 font-bold text-[#001529]">No. of Migrations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-4 border-r border-slate-200">2020–2022 (avg.)</td>
                      <td className="py-3 px-4">~50 per year</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-r border-slate-200">2022</td>
                      <td className="py-3 px-4">62</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-r border-slate-200">2023</td>
                      <td className="py-3 px-4">38</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-r border-slate-200">2024</td>
                      <td className="py-3 px-4">12–14</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-r border-slate-200">2025</td>
                      <td className="py-3 px-4">3</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 border-r border-slate-200">June 2025–May 2026</td>
                      <td className="py-3 px-4">23</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 text-slate-600 text-md leading-relaxed">
                <p>
                  Between 2015 and 2025, of approximately 1,420 companies listed on BSE SME and NSE Emerge, only 336, about 24%, eventually migrated to the mainboard. As of early 2026, around 199 companies from the BSE SME and 158 from the NSE Emerge have migrated, for a total of approximately 360.
                </p>
                <p>
                  The sharp decline observed between 2024 and 2025 comes directly after changes to the norms, specifically the increase in the minimum listing requirement from 2 to 3 years (January 2024), the increase in the market capitalisation requirement from ₹25 crore to ₹100 crore, and the significant increase in the number of public shareholders.
                </p>
                <p>
                  However, migration numbers are recovering: 23 companies migrated in the 12 months ending May 2026, compared to just 13 the year before, suggesting the first cohort of companies that listed in 2021–2022 under the new norms is now beginning to qualify.
                </p>
                <p>
                  <strong>Sector-wise</strong>, textile companies have led all migrations at 44 companies, followed by machinery and equipment (33) and food and tobacco (29).
                </p>
              </div>
            </div>

            {/* Challenges in Migration */}
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-[#001529] font-heading">
                <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                What Are The Challenges in Migration for SMEs
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800 font-heading">Stricter Financial Bars</h3>
                  <p className="text-slate-500 leading-relaxed text-md">
                    The combination of higher EBITDA floors, revenue thresholds, and net worth requirements means that many SMEs that were once migration-eligible under older norms no longer qualify today.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800 font-heading">Market Cap Volatility</h3>
                  <p className="text-slate-500 leading-relaxed text-md">
                    The 6-month average market cap requirement (BSE) and 3-month average (NSE) means that even a financially eligible company could fail to migrate purely due to a period of stock price weakness.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800 font-heading">Promoter Lock-In and Exit Restrictions</h3>
                  <p className="text-slate-500 leading-relaxed text-md">
                    NSE now requires promoters to hold at least 50% of their listing-day shareholding at the time of migration, penalising promoters who have sold down their stakes aggressively post-listing.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800 font-heading">SCORES Compliance</h3>
                  <p className="text-slate-500 leading-relaxed text-md">
                    Even a single unresolved investor complaint on SEBI SCORES can block migration. Companies with a history of poor investor communication are often caught off guard by this condition.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800 font-heading">Surveillance Category Overhang</h3>
                  <p className="text-slate-500 leading-relaxed text-md">
                    If a stock has been placed under enhanced surveillance or trade-to-trade categories, a mandatory 2-month cooling period must be observed even after the surveillance is lifted, before migration can be applied for.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800 font-heading">Operational and Governance Transition</h3>
                  <p className="text-slate-500 leading-relaxed text-md">
                    Migrating from SME compliance to full LODR compliance requires a meaningful upgrade in board governance, internal controls, and financial reporting infrastructure and this takes time and incurs costs.
                  </p>
                </div>
              </div>
            </div>

            {/* The 2025-2026 Regulatory Reset */}
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-[#001529] font-heading">
                <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                The 2025–2026 Regulatory Reset: What Changed
              </h2>
              <p className="leading-relaxed mb-6 text-slate-600 text-md">
                SEBI and the exchanges have fundamentally redefined what SME-to-mainboard migration means:
              </p>
              <ul className="list-disc pl-5 space-y-3 text-slate-500 leading-relaxed text-md">
                <li><strong>January 2024:</strong> Minimum listing tenure raised from 2 to 3 years.</li>
                <li><strong>March 2024:</strong> NSE reduced the minimum public shareholders from 1,000 to 500.</li>
                <li><strong>May 2025:</strong> NSE overhauled its entire migration criteria with Circular NSE/CML/67671 - adding revenue threshold (&gt;₹100 crore), higher net worth (₹75 crore), and tighter promoter conditions.</li>
                <li><strong>August 2025:</strong> BSE raised the market cap bar to ₹100 crore, EBITDA to ₹15 crore average, and public shareholder count to 1,000.</li>
                <li><strong>March 2026:</strong> SEBI further revised BSE SME migration norms.</li>
              </ul>
            </div>

            {/* Mainboard Migration Benefit For Investors */}
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-[#001529] font-heading">
                <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                Mainboard Migration Benefit For Investors: What Migration Means for Your Holdings
              </h2>
              <p className="leading-relaxed mb-6 text-slate-600 text-md">
                When an SME-listed company migrates to the mainboard, existing shareholders automatically hold mainboard shares - no action is required. However, there are several practical implications:
              </p>
              <ul className="list-disc pl-5 space-y-3 text-slate-500 leading-relaxed text-md">
                <li><strong>Lot size restriction removed:</strong> Shares can now be bought or sold in any quantity, which often increases trading volumes.</li>
                <li><strong>Wider institutional participation:</strong> FPIs and mutual funds can now invest, which typically supports price discovery.</li>
                <li><strong>Valuation re-rating:</strong> Companies often see a re-rating in valuation multiples post-migration as liquidity and investor base improve.</li>
                <li><strong>Higher compliance scrutiny:</strong> Increased reporting requirements mean greater transparency, which benefits long-term investors.</li>
                <li><strong>No market maker:</strong> The market-making mechanism that guaranteed liquidity on the SME platform ends; the stock now relies entirely on natural demand and supply.</li>
              </ul>
            </div>

            {/* Conclusion */}
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-[#001529] font-heading">
                <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                Conclusion
              </h2>
              <div className="space-y-4 text-slate-600 text-md leading-relaxed">
                <p>
                  The SME-to-mainboard migration pathway is India's structured mechanism for recognising corporate growth and rewarding it with access to deeper capital. But as the regulatory architecture has matured significantly since 2024, migration is no longer an automatic entitlement - it is a competitive milestone.
                </p>
                <p>
                  The lessons are clear for promoters: migration requires consistent financial performance in several years, clean corporate governance, diversified public shareholding, and active communication with investors. For investors, a company that is preparing itself for or undergoing migration is a strong indicator of readiness and confidence in growth on the part of management.
                </p>
                <p>
                  Given that there are already 23 migrations from June 2025 to May 2026, and with a sizeable number of 2021-2022 SME listings now coming up to their three-year periods of eligibility, migration will undoubtedly become more common, but only for those companies that have built the financial and governance foundations the new rules demand.
                </p>
              </div>
            </div>

            {/* CTA Box */}
            <div className="mt-20 p-12 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #001529 0%, #002147 55%, #003380 100%)' }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5" style={{ background: '#f59e08', filter: 'blur(60px)', transform: 'translate(30%,-30%)' }} />
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 relative z-10 flex items-center justify-center gap-3">
                <div className="w-1 h-8 rounded-full bg-[#f59e08] shrink-0" />
                Are You Ready for the <strong className="text-[#f59e08]">Next Leap?</strong>
              </h2>
              <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto font-medium relative z-10 text-md">
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

          </MigrationClient>
        </section>
      </main>

    </div>
  );
}
