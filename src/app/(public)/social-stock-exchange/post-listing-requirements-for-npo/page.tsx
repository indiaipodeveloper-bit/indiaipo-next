import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SSESidebar from "../SSESidebar";
import Link from "next/link";
import {
  ChevronRight,
  Home,
  ClipboardList,
  Clock,
  FileCheck,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Target
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post Listing Requirements for NPO | India IPO",
  description: "Learn about post-listing compliance and disclosure requirements for NPOs on the Social Stock Exchange.",
};

export default function PostListingRequirementsPage() {
  const complianceItems = [
    {
      title: "Annual Disclosures",
      registered: "Within 60 days from end of financial year (Format to be specified by SEBI)",
      listed: "Within 60 days from end of financial year (Format to be specified by SEBI)",
      nature: "Annual disclosures covering General, Governance and Financial aspects.",
      icon: <FileCheck className="h-5 w-5 text-blue-600" />
    },
    {
      title: "Quarterly Disclosures",
      registered: "Not Applicable",
      listed: "Within 45 days from end of each quarter (Format to be specified by SEBI)",
      nature: "Statement showing: Utilization of funds raised, Category-wise usage, Amount of unutilized funds remaining",
      icon: <Clock className="h-5 w-5 text-orange-600" />
    },
    {
      title: "Event-Based Disclosures",
      registered: "Not Applicable",
      listed: "Within 7 days of the event’s occurrence",
      nature: "Disclosure of any material event impacting planned outcomes or outputs, including steps taken by the Social Enterprise to address such events.",
      icon: <AlertCircle className="h-5 w-5 text-rose-600" />
    },
    {
      title: "Policy for Determination of Materiality",
      registered: "Not Applicable",
      listed: "NPO must frame a policy for determining materiality and share it with the Social Stock Exchange",
      nature: "Ensures timely disclosure of significant developments.",
      icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />
    },
    {
      title: "Annual Impact Report",
      registered: "Submit an audited report by a Social Audit Firm (registered with SSE) within 90 days.",
      listed: "Same as for registered NPOs",
      nature: "The report must be audited by a social auditor and submitted in a SEBI-specified format and timeline.",
      icon: <Target className="h-5 w-5 text-purple-600" />
    }
  ];

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
            <span className="text-[#001529] font-bold">Post Listing Requirements for NPO</span>
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
                      Post-Listing Compliance for NPOs
                    </h1>
                    <div className="flex items-center gap-4 text-slate-500 text-sm font-semibold">
                      <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                        <ClipboardList className="h-4 w-4 text-[#f59e08]" />
                        Disclosure Norms
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                        <ShieldCheck className="h-4 w-4 text-[#f59e08]" />
                        Transparency Rules
                      </span>
                    </div>
                  </div>
                </div>

                <div className="service-content">
                  <p className="text-lg text-slate-600 leading-relaxed font-medium mb-12">
                    Here are the post issue compliance requirements for NPO which has listed its securities on SSE.
                  </p>

                  <div className="overflow-x-auto -mx-4 md:mx-0">
                    <table className="w-full text-left border-separate border-spacing-y-4">
                      <thead>
                        <tr className="text-[#001529] text-sm font-black uppercase tracking-wider">
                          <th className="px-6 py-2">Particulars</th>
                          <th className="px-6 py-2">For NPOs Registered on SSE</th>
                          <th className="px-6 py-2">For NPOs with Listed Securities on SSE</th>
                          <th className="px-6 py-2">Nature of Compliance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {complianceItems.map((item, index) => (
                          <tr key={index} className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                            <td className="px-6 py-6 rounded-l-2xl border-y border-l border-slate-100 bg-slate-50/50">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                                  {item.icon}
                                </div>
                                <span className="font-black text-[#001529] text-sm">{item.title}</span>
                              </div>
                            </td>
                            <td className="px-6 py-6 border-y border-slate-100">
                              <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg inline-block">
                                {item.registered}
                              </div>
                            </td>
                            <td className="px-6 py-6 border-y border-slate-100">
                              <div className="text-xs font-bold text-[#001529] bg-[#f59e08]/10 px-3 py-1.5 rounded-lg inline-block">
                                {item.listed}
                              </div>
                            </td>
                            <td className="px-6 py-6 rounded-r-2xl border-y border-r border-slate-100">
                              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs">
                                {item.nature}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Special CTA Card */}
                  <div className="mt-20 p-8 md:p-12 rounded-3xl bg-white border border-slate-200 relative overflow-hidden shadow-2xl">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#f59e08]/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                      {/* Left Content */}
                      <div className="max-w-2xl">
                        <h3 className="text-2xl md:text-3xl font-black mb-4 text-[#001529]">
                          Driving Social Impact
                        </h3>
                        <p className="text-slate-700 text-lg leading-8 font-medium">
                          If you are a registered NGO, Society, or Trust working in the fields
                          of health and education, you can raise funds up to
                          <span className="font-black text-[#f59e08]"> ₹10–20 crore </span>
                          through the Social Stock Exchange. For more details, contact IndiaIPO.
                        </p>
                      </div>

                      {/* CTA Button */}
                      <Link
                        href="/contact"
                        className="bg-[#f59e08] text-[#001529] px-8 py-4 rounded-full font-black flex items-center gap-2 hover:bg-[#001529] hover:text-white transition-all duration-300 transform hover:scale-105 shadow-xl whitespace-nowrap"
                      >
                        Contact Experts
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
