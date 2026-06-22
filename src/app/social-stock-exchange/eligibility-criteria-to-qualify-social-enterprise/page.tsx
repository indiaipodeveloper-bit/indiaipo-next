import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SSESidebar from "../SSESidebar";
import Link from "next/link";
import { ChevronRight, Home, CheckCircle2, Target, PieChart, Users, ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eligibility Criteria to qualify as Social Enterprise | India IPO",
  description: "Learn about the eligibility criteria to qualify as a Social Enterprise (SE) on the Social Stock Exchange.",
};

export default function EligibilityCriteriaPage() {
  const eligibleActivities = [
    "Ending hunger, poverty, malnutrition and inequality",
    "Improving healthcare, including mental health, sanitation and clean drinking water",
    "Supporting education, job skills and ways for people to earn a living",
    "Promoting equal rights and opportunities for women and LGBTQIA+ people",
    "Protecting the environment, fighting climate change and saving forests and wildlife",
    "Preserving India’s heritage, art and culture",
    "Training and encouraging participation in rural, national, Olympic and Paralympic sports",
    "Helping startups and organizations that work on social good",
    "Supporting platforms that help non-profits grow and raise funds",
    "Creating more job opportunities for the poor in cities and villages and helping small farmers and workers earn more",
    "Improving slum areas, building affordable housing and making cities stronger and safer",
    "Helping people during disasters through rescue, recovery and rebuilding",
    "Making banking and financial services available to everyone",
    "Helping disadvantaged groups get land and property",
    "Making sure everyone can access the internet and mobile services and stay safe from misinformation and data misuse",
    "Supporting the rights and welfare of migrants and people forced to move",
    "Any other important cause decided by the Board or the Government of India"
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
            <span className="text-[#001529] font-bold">Eligibility Criteria to Qualify as a Social Enterprise (SE)</span>
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
                      Characteristics of Social Enterprises (SE)
                    </h1>
                    <div className="flex items-center gap-4 text-slate-500 text-sm font-semibold">
                      <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                        <CheckCircle2 className="h-4 w-4 text-[#f59e08]" />
                        Criteria for Qualifying
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                        <Target className="h-4 w-4 text-[#f59e08]" />
                        SE Identification
                      </span>
                    </div>
                  </div>
                </div>

                <div className="service-content">
                  <p className="text-lg text-slate-600 leading-relaxed font-medium mb-4">
                    Entities that are engaged in:
                  </p>
                  <p className="text-slate-600 mb-12 italic text-sm">
                    Here are the activities considered “eligible activities” for an entity to be identified as SE
                  </p>

                  <div className="mt-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {eligibleActivities.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-[#f59e08]/30 transition-colors group">
                          <div className="mt-1 bg-white p-1 rounded-md shadow-sm border border-slate-100 group-hover:bg-[#f59e08] transition-colors shrink-0">
                            <CheckCircle2 className="h-3 w-3 text-[#f59e08] group-hover:text-white" />
                          </div>
                          <span className="text-sm font-bold text-slate-700 leading-relaxed">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-20">
                    <h2 className="flex items-center gap-3 mb-6 text-2xl font-black text-[#001529]">
                      Additional Eligibility Conditions to Qualify as a Social Enterprise
                    </h2>
                    <p className="text-slate-600 mb-12">
                      To be officially recognized as a Social Enterprise on the Social Stock Exchange, an organization must also meet the following detailed conditions:
                    </p>

                    <div className="space-y-10">
                      {/* Section 1 */}
                      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden relative">
                        {/* Header */}
                        <div className="bg-[#001529] px-8 py-6 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-40 h-40 bg-[#f59e08]/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                          <h3 className="relative z-10 text-2xl font-black text-white flex items-center gap-3">
                            <Users className="h-6 w-6 text-[#f59e08]" />
                            1. Targeting Underserved Communities
                          </h3>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                          <p className="text-slate-700 text-lg leading-8 font-medium">
                            The enterprise should primarily focus on supporting underserved,
                            underprivileged or backward communities and regions where development
                            has remained slow or limited based on government development priorities.
                          </p>
                        </div>
                      </div>

                      {/* Section 2 */}
                      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-[#001529] px-8 py-6">
                          <h3 className="text-2xl font-black text-white flex items-center gap-3">
                            <PieChart className="h-6 w-6 text-[#f59e08]" />
                            2. Minimum 67% Rule
                          </h3>
                        </div>

                        {/* Main Content */}
                        <div className="p-8">
                          <p className="text-slate-700 text-lg leading-8 mb-10 font-medium">
                            To demonstrate a genuine commitment towards social impact, the enterprise
                            must satisfy at least one of the following three conditions during the
                            previous three financial years.
                          </p>

                          {/* Cards Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Card 1 */}
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 hover:shadow-lg transition-all duration-300">
                              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#f59e08]/10 text-[#f59e08] text-xs font-black uppercase tracking-widest mb-5">
                                Revenue Condition
                              </div>
                              <div className="text-4xl font-black text-[#001529] mb-4">
                                67%
                              </div>
                              <p className="text-slate-700 leading-7 font-medium">
                                At least 67% of the average revenue during the last three years
                                should come from services or activities benefiting the target population.
                              </p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 hover:shadow-lg transition-all duration-300">
                              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#f59e08]/10 text-[#f59e08] text-xs font-black uppercase tracking-widest mb-5">
                                Expenditure Condition
                              </div>
                              <div className="text-4xl font-black text-[#001529] mb-4">
                                67%
                              </div>
                              <p className="text-slate-700 leading-7 font-medium">
                                At least 67% of the average expenditure during the last three years
                                should be utilized for activities benefiting the target population.
                              </p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 hover:shadow-lg transition-all duration-300">
                              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#f59e08]/10 text-[#f59e08] text-xs font-black uppercase tracking-widest mb-5">
                                Beneficiary Base Condition
                              </div>
                              <div className="text-4xl font-black text-[#001529] mb-4">
                                67%
                              </div>
                              <p className="text-slate-700 leading-7 font-medium">
                                At least 67% of the average beneficiaries or customers during the
                                last three years should belong to the target population.
                              </p>
                            </div>
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
                          Raise Funds for Social Impact
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
