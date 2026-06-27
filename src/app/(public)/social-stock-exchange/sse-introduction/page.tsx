import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SSESidebar from "../SSESidebar";
import Link from "next/link";
import { ChevronRight, Home, Zap, Globe, ArrowRight, Info, ShieldCheck } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Stock Exchange (SSE) Introduction | India IPO",
  description: "Learn about the Social Stock Exchange (SSE) segment on NSE & BSE, helping social enterprises raise funds for social impact.",
};

export default function SSEIntroductionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />

      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-10 flex-wrap font-medium">
            <Link href="/" className="hover:text-[#f59e08] flex items-center gap-1 transition-colors">
              <Home className="h-4 w-4" /> Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/social-stock-exchange" className="hover:text-[#f59e08] transition-colors">Social Stock Exchange</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#001529] font-bold">Introduction to SSE</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <SSESidebar />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="service-content-box bg-white">
                <div className="flex justify-between items-start mb-8 flex-wrap gap-4 border-b border-slate-100 pb-8">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-black text-[#001529] mb-4 leading-tight">
                      Introduction to Social Stock Exchange (SSE)
                    </h1>
                    <div className="flex items-center gap-4 text-slate-500 text-sm font-semibold">
                      <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                        <Info className="h-4 w-4 text-[#f59e08]" />
                        Overview
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                        <Globe className="h-4 w-4 text-[#f59e08]" />
                        Social Impact
                      </span>
                    </div>
                  </div>
                </div>

                <div className="service-content">
                  <p className="text-lg text-slate-600 leading-relaxed font-medium mb-8">
                    The Social Stock Exchange (SSE) segment on the NSE & BSE is changing the way social enterprises can raise funds from the public to maximize their impact on society's well-being. These social enterprises can be any non-profit organizations (NPOs) as well as For-Profit Enterprises (FPEs).
                  </p>
                  <p className="text-slate-600 leading-relaxed font-medium mb-8">
                    SSE acts as a distinct digital platform for social enterprises to register and raise funds through recognized exchanges by meeting the eligibility criteria outlined in SEBI’s ICDR Regulations, so that they can be more impactful. But, notably, FPEs need to be listed on Mainboard/SME platforms as they fall under for-profit entities.
                  </p>

                  <div className="mt-12">
                    <h2 className="flex items-center gap-3 text-2xl font-black text-[#001529] mb-6">
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                        <Zap className="h-6 w-6 text-[#f59e08]" />
                      </div>
                      What is a Social Enterprise?
                    </h2>
                    <p className="text-slate-600 leading-relaxed font-medium mb-4">
                      Social Enterprise is an organisation that focuses on making a positive social impact on humans and the environment's well-being while also applying commercial strategies to maximize this impact. These enterprises generally target the underserved or less privileged population regions that are not performing well as per the record of central and state governments’ priorities.
                    </p>
                    <p className="text-slate-600 leading-relaxed font-medium mb-8">
                      In India, social enterprises include organisations that are working in sectors such as education, healthcare, poverty alleviation, gender equality and environmental sustainability. These organisations reinvest the profits in their core mission rather than redistributing them to owners or shareholders.
                    </p>
                  </div>

                  <div className="mt-12">
                    <h3 className="text-xl font-black text-[#001529] mb-6">Characteristics of Social Enterprises</h3>
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                      <ul className="space-y-4">
                        {[
                          "Social enterprises are purpose-driven and prioritize making a positive social or environmental impact rather than profit.",
                          "They generate revenue through business activities that make them financially sustainable and less reliant on donations or grants like traditional charities do.",
                          "Profits are primarily reinvested to increase their social or environmental goals, not distributed to shareholders.",
                          "They often involve stakeholders, including employees and beneficiaries, in decision-making processes.",
                          "Social enterprises can have various legal forms such as cooperative, limited companies or associations, depending on local regulations."
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-slate-700 font-medium leading-relaxed">
                            <span className="mt-1.5 w-2 h-2 rounded-full bg-[#f59e08] shrink-0"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-12">
                    <h2 className="text-2xl font-black text-[#001529] mb-6">Categories of Social Enterprises</h2>
                    <p className="text-slate-600 leading-relaxed font-medium mb-8">
                      Various legal forms of NPOs are recognised by SSE as social enterprises that enable a broader range of organisations to participate in fundraising through SSE. The primary categories include:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h4 className="text-[#001529] font-black mb-3">1. Charitable Trusts</h4>
                        <p className="text-sm text-slate-600 font-medium">Registered under the Indian Trusts Act, 1882, focused on charitable objectives.</p>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h4 className="text-[#001529] font-black mb-3">2. Societies</h4>
                        <p className="text-sm text-slate-600 font-medium">Registered under the Societies Registration Act, 1860, managed by a governing body.</p>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h4 className="text-[#001529] font-black mb-3">3. Section 8 Companies</h4>
                        <p className="text-sm text-slate-600 font-medium">Incorporated under the Companies Act, 2013, operating as not-for-profit companies.</p>
                      </div>
                    </div>

                    <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-2xl italic font-medium text-blue-900 leading-relaxed">
                      <strong>Eligibility Note:</strong> To be eligible for SSE listing, NPOs must have a minimum of three years operational record and have served at least 67% of their target populations through identified social activities and meet strict documentation along compliance standards.
                    </div>
                  </div>

                  <div className="mt-12">
                    <h2 className="text-2xl font-black text-[#001529] mb-6">Objects of SSE Listing</h2>
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                      <ul className="space-y-6">
                        {[
                          { title: "Regulated Fundraising Platform", desc: "Listing on SSE provides NPOs and social enterprises a structured, transparent platform to raise funds from a diverse group of investors and institutions to achieve their social goals and targets. It also acts as a bridge between the social enterprise and fund providers (donors)." },
                          { title: "Accountability and Transparency", desc: "When an organization lists on SSE, it provides a regulated platform that brings more transparency in NPOs due to enhanced financial reporting and structured functioning. Due to enhanced transparency, a donor can choose the organizations that are making a measurable social impact and reporting such impact publicly." },
                          { title: "Wider Participation", desc: "SSE listing also bridges the gap between capital markets and social good by providing a chance for both the retail and institutional investors to participate in social impact initiatives." },
                          { title: "Helps in Informed Decision Making", desc: "SSE listing helps donors in making informed decisions after analyzing and measuring the impact of various social enterprises so that they can choose the best one that is making the most impact on society." },
                          { title: "Standardisation", desc: "It also promotes standardised disclosures and reporting, which makes it easier for investors(donors) to compare and evaluate social enterprises." }
                        ].map((item, idx) => (
                          <li key={idx} className="text-slate-700 font-medium leading-relaxed">
                            <strong className="text-[#001529] block mb-1">{item.title}:</strong>
                            {item.desc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-12">
                    <h2 className="text-2xl font-black text-[#001529] mb-6">Advantages of SSE Listing</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="text-lg font-black text-[#001529] mb-3">1. Diversified Fundraising</h3>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">Opens up new avenues for funding beyond traditional grants and donations. It attracts impact investors and CSR funds seeking measurable social returns.</p>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="text-lg font-black text-[#001529] mb-3">2. Increased Credibility</h3>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">SSE listing validates regulatory compliance and impact reporting that enhances trust among donors and partners. Due diligence by the exchange acts as a quality stamp.</p>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="text-lg font-black text-[#001529] mb-3">3. National Recognition</h3>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">Being listed on platforms like NSE/BSE provides national-level visibility and recognition.</p>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 className="text-lg font-black text-[#001529] mb-3">4. Access to Impact Investors</h3>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">Direct access to socially conscious investors looking for verified, impactful projects.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12">
                    <h2 className="text-2xl font-black text-[#001529] mb-6">Risks & Challenges of SSE Listing</h2>
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                      <ul className="space-y-4">
                        {[
                          "Increased Compliance Burden: Social enterprises have to work on two fronts, where their basic nature means generating a social impact, while maintaining financial sustainability as well. Regular disclosures, impact reporting and audits increase the administrative workload.",
                          "Cost Implications: Registration, documentation and potential advisory fees can be significant, especially for smaller organisations.",
                          "Lengthy Registration Process: The registration and listing process for social enterprises is known as very complex and time-consuming, requiring professional help.",
                          "Short Fundraising Window: Typically 3-10 days, which demands strong preparation and marketing to attract potential donors.",
                          "Risk of Unsuccessful Fundraising: There is a minimum subscription obligation (75% of the issue size). If not achieved, the round fails and funds must be refunded."
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-slate-700 font-medium leading-relaxed text-sm">
                            <span className="mt-1.5 w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-12">
                    <h2 className="flex items-center gap-3 text-2xl font-black text-[#001529] mb-8">
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                        <ShieldCheck className="h-6 w-6 text-[#f59e08]" />
                      </div>
                      SSE Listing vs. Normal IPO
                    </h2>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-[#001529]">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider border-r border-slate-700">Parameters</th>
                            <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider border-r border-slate-700">SSE Listing (NPOs)</th>
                            <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">Normal IPO</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                          {[
                            { p: "Purpose", sse: "Social impact projects", normal: "Business growth & Profit" },
                            { p: "Eligible Entities", sse: "Trusts, Societies, Sec 8 Companies", normal: "For-profit companies" },
                            { p: "Instruments", sse: "ZCZP Instruments, Grants", normal: "Equity, Debentures" },
                            { p: "Subscription", sse: "75% of issue size", normal: "90% of issue size" },
                            { p: "Merchant Banker", sse: "Not required", normal: "Mandatory" }
                          ].map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 text-sm font-bold text-[#001529] bg-slate-50/50 border-r border-slate-100">{row.p}</td>
                              <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100">{row.sse}</td>
                              <td className="px-6 py-4 text-sm text-slate-600">{row.normal}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Special CTA Card */}
                  <div className="mt-20 p-8 md:p-12 rounded-3xl bg-white border border-slate-200 relative overflow-hidden shadow-2xl">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#f59e08]/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                      {/* Left Content */}
                      <div className="max-w-2xl">
                        <h3 className="text-2xl md:text-3xl font-black mb-4 text-[#001529]">
                          Empower Your Social Mission
                        </h3>
                        <p className="text-slate-700 text-lg leading-8 font-medium">
                          If you are a registered NGO, Society, or Trust working in the fields of
                          health and education, you can raise funds up to ₹10–20 crore through
                          the Social Stock Exchange. For more details, contact IndiaIPO.
                        </p>
                      </div>

                      {/* CTA Button */}
                      <Link
                        href="/contact"
                        className="bg-[#f59e08] text-[#001529] px-8 py-4 rounded-full font-black flex items-center gap-2 hover:bg-[#001529] hover:text-white transition-all duration-300 transform hover:scale-105 shadow-xl whitespace-nowrap"
                      >
                        Contact IndiaIPO
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
