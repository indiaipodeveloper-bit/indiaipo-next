import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SSESidebar from "../SSESidebar";
import Link from "next/link";
import {
  ChevronRight,
  Home,
  Building2,
  Briefcase,
  Search,
  Star,
  Database,
  Users,
  ClipboardCheck,
  Scale,
  Calculator,
  ArrowRight,
  ShieldCheck,
  Globe
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intermediaries Involved in the Listing of ZCZP | India IPO",
  description: "Learn about the key intermediaries involved in the listing of Zero Coupon Zero Principal (ZCZP) instruments.",
};

export default function IntermediariesPage() {
  const intermediaries = [
    {
      title: "1. Social Stock Exchange (SSE)",
      description: "SSE is a separate segment under exchanges like BSE & NSE that provides NPOs a platform to list ZCZPs for raising social funds. SSE ensures NPOs meet the eligibility, disclosure and reporting compliance norms.",
      icon: <Globe className="h-6 w-6" />,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "2. Stock Exchange (BSE/NSE)",
      description: "Stock exchanges like NSE & BSE that host the SSE segment and facilitate the listing, trading and distribution of ZCZPs, along with maintaining investor grievance redressal.",
      icon: <Building2 className="h-6 w-6" />,
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      title: "3. Merchant Banker / Lead Manager",
      description: "Merchant bankers are SEBI-registered entities that manage the issue process and help in preparing offer documents, getting approval, liaising with SEBI/SSE and marketing the issue.",
      icon: <Briefcase className="h-6 w-6" />,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "4. Social Auditors / Social Impact Assessors",
      description: "Social auditors or impact assessors are responsible for evaluating and verifying the intended social impact of the Non-Profit Organization (NPO) and the use of Zero Coupon Zero Principal Instruments (ZCZPs).",
      icon: <Search className="h-6 w-6" />,
      color: "bg-amber-50 text-amber-600"
    },
    {
      title: "5. Credit Rating Agencies (CRAs) (If applicable)",
      description: "Although CRAs are not mandatory for ZCZPs since there is no repayment obligation, credit rating agencies may still be involved to provide ratings for the NPO or the impact of the project.",
      icon: <Star className="h-6 w-6" />,
      color: "bg-rose-50 text-rose-600"
    },
    {
      title: "6. Depositories (CDSL / NSDL)",
      description: "Depositories like CDSL and NSDL play a vital role in the dematerialization of ZCZPs. They maintain records of investor holdings, enable electronic transfer of these instruments and are responsible for recording all corporate actions and beneficiary positions related to the ZCZPs.",
      icon: <Database className="h-6 w-6" />,
      color: "bg-cyan-50 text-cyan-600"
    },
    {
      title: "7. Brokers / Trading Members",
      description: "Registered brokers or trading members may be involved in the distribution of ZCZPs to potential donors or investors. They act as intermediaries in executing transactions, especially if these instruments are made tradable in the future, thereby facilitating wider market access.",
      icon: <Users className="h-6 w-6" />,
      color: "bg-purple-50 text-purple-600"
    },
    {
      title: "8. Registrar and Transfer Agent (RTA)",
      description: "The RTA manages the investor interface during the ZCZP issuance process. This includes handling investor applications, maintaining detailed records, overseeing the allotment process, managing refunds and facilitating all communications with ZCZP holders.",
      icon: <ClipboardCheck className="h-6 w-6" />,
      color: "bg-orange-50 text-orange-600"
    },
    {
      title: "9. Legal Advisors",
      description: "Legal advisors play an essential role in structuring the ZCZP instrument and preparing all required documentation. They ensure compliance with regulatory frameworks, including those of SEBI, the Companies Act and other applicable legal provisions, safeguarding the legality and enforceability of the issue.",
      icon: <Scale className="h-6 w-6" />,
      color: "bg-slate-50 text-slate-600"
    },
    {
      title: "10. Financial & Statutory Auditors",
      description: "Financial auditors certify the financial statements submitted by the NPO during the listing process. They are also involved in monitoring post-issue fund utilization to ensure that the proceeds are being used effectively and transparently for the declared social objectives.",
      icon: <Calculator className="h-6 w-6" />,
      color: "bg-lime-50 text-lime-600"
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
            <span className="text-[#001529] font-bold">Intermediaries Involved in the Listing of ZCZP</span>
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
                      Intermediaries Involved in the Listing of ZCZP
                    </h1>
                    <div className="flex items-center gap-4 text-slate-500 text-sm font-semibold">
                      <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                        <Users className="h-4 w-4 text-[#f59e08]" />
                        Market Participants
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                        <ShieldCheck className="h-4 w-4 text-[#f59e08]" />
                        Listing Entities
                      </span>
                    </div>
                  </div>
                </div>

                <div className="service-content">
                  <p className="text-lg text-slate-600 leading-relaxed font-medium mb-12">
                    When Zero Coupon Zero Principal Instruments (ZCZP) are listed on a stock exchange in India, such as those issued by Not-for-Profit Organizations (NPOs) under the Social Stock Exchange (SSE) framework, several intermediaries are involved to ensure regulatory compliance, transparency and smooth operations.
                  </p>

                  <h2 className="text-2xl font-black text-[#001529] mb-8">Here’s a list of key intermediaries involved in the listing of ZCZPs:</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                    {intermediaries.map((item, index) => (
                      <div key={index} className="p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-xl transition-all group hover:-translate-y-1">
                        <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                          {item.icon}
                        </div>
                        <h3 className="text-lg font-black text-[#001529] mb-3 leading-tight">{item.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Special CTA Card */}
                  <div className="mt-20 p-8 md:p-12 rounded-3xl bg-white border border-slate-200 relative overflow-hidden shadow-2xl">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#f59e08]/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                      {/* Left Content */}
                      <div className="max-w-2xl">
                        <h3 className="text-2xl md:text-3xl font-black mb-4 text-[#001529]">
                          Empowering NPOs through SSE
                        </h3>
                        <p className="text-slate-700 leading-8 font-medium text-lg">
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
                        Contact Us
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
