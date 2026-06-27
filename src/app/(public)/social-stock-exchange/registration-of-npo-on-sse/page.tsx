import React from "react";
import SSESidebar from "../SSESidebar";
import Link from "next/link";
import {
  ChevronRight,
  Home,
  UserPlus,
  CheckCircle,
  FileText,
  Building2,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Search,
  Users
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registration of NPO on SSE | India IPO",
  description: "Learn about registration of Not-for-Profit Organizations (NPOs) on the Social Stock Exchange.",
};

export default function RegistrationNPOPage() {
  const benefits = [
    {
      title: "Enhanced Visibility & Trust",
      desc: "Registration on SSE provides NPOs with a platform to showcase their social impact, attracting institutional and individual donors.",
      icon: <Search className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Resource Mobilization",
      desc: "NPOs can raise funds by issuing Zero Coupon Zero Principal (ZCZP) instruments, which are dedicated to social causes.",
      icon: <TrendingUp className="h-6 w-6 text-emerald-600" />
    },
    {
      title: "Standardized Reporting",
      desc: "The SSE framework ensures transparency through standardized reporting on social and financial performance.",
      icon: <FileText className="h-6 w-6 text-orange-600" />
    },
    {
      title: "Access to New Donor Base",
      desc: "Provides access to impact investors and philanthropic organizations that are specifically looking for verified social enterprises.",
      icon: <Users className="h-6 w-6 text-purple-600" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">

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
            <span className="text-[#001529] font-bold">Registration of NPO on SSE</span>
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
                      Registration of NPO on Social Stock Exchange
                    </h1>
                    <div className="flex items-center gap-4 text-slate-500 text-sm font-semibold">
                      <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                        <UserPlus className="h-4 w-4 text-[#f59e08]" />
                        Onboarding
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                        <ShieldCheck className="h-4 w-4 text-[#f59e08]" />
                        Verification
                      </span>
                    </div>
                  </div>
                </div>

                <div className="service-content">
                  <p className="text-lg text-slate-600 leading-relaxed font-medium mb-12">
                    A Not-for-Profit Organization (NPO) can register on the Social Stock Exchange (SSE) segment of a recognized stock exchange (like BSE or NSE). This registration is a prerequisite for NPOs to list their instruments and raise funds.
                  </p>

                  <h2 className="text-2xl font-black text-[#001529] mb-8">Benefits of Registration</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                    {benefits.map((benefit, idx) => (
                      <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all group">
                        <div className="mb-4 bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          {benefit.icon}
                        </div>
                        <h3 className="text-lg font-black text-[#001529] mb-2">{benefit.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">{benefit.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* BSE Section */}
                    <div className="p-8 rounded-3xl border border-slate-200 bg-white shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform"></div>
                      <div className="relative z-10">
                        <h2 className="text-2xl font-black text-[#001529] mb-6 flex items-center gap-2">
                          <Building2 className="h-6 w-6 text-blue-600 animate-pulse" />
                          Registration on BSE
                        </h2>

                        <div className="space-y-6">
                          <div>
                            <h4 className="font-black text-[#001529] mb-3 text-sm uppercase tracking-wider">Requirements</h4>
                            <ul className="space-y-2">
                              {[
                                "Legal Form: Must be a registered trust, society, or Section 8 company.",
                                "Operational History: Minimum 3 years of active operations.",
                                "IT Registration: Valid registration under Section 12A/12AA/12AB and 80G.",
                                "NGO Darpan: Registration on the NGO Darpan portal is mandatory."
                              ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="pt-6 border-t border-slate-100">
                            <h4 className="font-black text-[#001529] mb-3 text-sm uppercase tracking-wider">Documents</h4>
                            <ul className="space-y-2">
                              {[
                                "Copy of Registration Certificate",
                                "Trust Deed / By-laws / MoA & AoA",
                                "PAN Card of the organization",
                                "Audited Financial Statements for the last 3 years",
                                "Annual Impact Report (if any)"
                              ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                                  <FileText className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* NSE Section */}
                    <div className="p-8 rounded-3xl border border-slate-200 bg-white shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform"></div>
                      <div className="relative z-10">
                        <h2 className="text-2xl font-black text-[#001529] mb-6 flex items-center gap-2">
                          <Building2 className="h-6 w-6 text-emerald-600 animate-pulse" />
                          Registration on NSE
                        </h2>

                        <div className="space-y-6">
                          <div>
                            <h4 className="font-black text-[#001529] mb-3 text-sm uppercase tracking-wider">Requirements</h4>
                            <ul className="space-y-2">
                              {[
                                "Entity Type: Open to Trust, Society, and Section 8 Companies.",
                                "Social Activity: Must be engaged in eligible social activities specified by SEBI.",
                                "Financial Health: Minimum fund flow requirements as specified by the exchange."
                              ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="pt-6 border-t border-slate-100">
                            <h4 className="font-black text-[#001529] mb-3 text-sm uppercase tracking-wider">Documents</h4>
                            <ul className="space-y-2">
                              {[
                                "NSE SSE Registration Form",
                                "Constitutional Documents",
                                "Income Tax Registration Certificates",
                                "Fund Flow Statements for the last 3 years",
                                "Declaration of non-disqualification"
                              ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                                  <FileText className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
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
                          Launch Your Social Offering
                        </h3>
                        <p className="text-slate-700 text-lg leading-8 font-medium">
                          If you are a registered NGO, Society, or Trust working in the fields
                          of health and education, you can raise funds up to ₹10–20 crore
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

    </div>
  );
}
