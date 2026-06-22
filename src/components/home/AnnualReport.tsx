"use client";

import React, { useState } from "react";
import { TrendingUp, ShieldCheck, Zap, Download, Activity, BarChart } from "lucide-react";
import report from "@/assets/coverIm2.jpg";
import customBg1 from "@/assets/custom-bg-11.webp";
import customBg2 from "@/assets/custom-bg-21.webp";
import ReportModal from "@/components/ReportModal";
import Ribbon from "@/components/Ribbon";

const AnnualReport = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const reportSrc = typeof report === "string" ? report : report.src;
    const customBg1Src = typeof customBg1 === "string" ? customBg1 : customBg1.src;
    const customBg2Src = typeof customBg2 === "string" ? customBg2 : customBg2.src;

    return (
        <section className="py-32 px-4 container mx-auto relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-amber-400/10 rounded-full blur-[100px] pointer-events-none" />

            <div
                className="relative z-10 bg-gradient-to-br from-slate-900 via-[#0f172a] to-blue-950 rounded-[4rem] p-8 md:p-16 text-white flex flex-col lg:flex-row items-center gap-16 overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,10,0.5)] border border-white/5"
            >
                <div
                    className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"
                />

                <div className="lg:w-1/2 space-y-10 relative z-10">
                    <div className="space-y-4 ">
                        <Ribbon
                            fontSize="12px"
                            cutout="0.5em"
                            color="rgba(238, 172, 6, 0.2)"
                            className="inline-flex items-center gap-2 text-amber-300 font-black uppercase tracking-[0.3em] border border-amber-400/20"
                        >
                            <Zap className="w-3.5 h-3.5 fill-amber-300" />
                            2025-26 Intelligence Access
                        </Ribbon>

                        <h2
                            className="text-4xl md:text-6xl font-black leading-[1.2] tracking-tight pt-1"
                        >
                            The Strategic <br />
                            <span className="box-decoration-clone text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-300 italic pr-4">
                                IPO Annual Report
                            </span>
                        </h2>

                        <p
                            className="text-blue-100/60 text-lg md:text-xl font-medium leading-relaxed max-w-xl"
                        >
                            Master the upcoming bull run with India's most comprehensive IPO
                            analysis. Deep-dive into 50+ sector projections and curated
                            high-conviction picks.
                        </p>
                    </div>

                    {/* Feature Points */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
                        {[
                            {
                                icon: <TrendingUp className="w-5 h-5" />,
                                label: "Sector Projections",
                            },
                            {
                                icon: <Activity className="w-5 h-5" />,
                                label: "GMP Trend Analysis",
                            },
                            {
                                icon: <ShieldCheck className="w-5 h-5" />,
                                label: "Risk Assessments",
                            },
                            {
                                icon: <BarChart className="w-5 h-5" />,
                                label: "Valuation Models",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 text-sm font-bold text-blue-200/80"
                            >
                                <div className="w-8 h-8 rounded-lg bg-blue-50/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                                    {item.icon}
                                </div>
                                {item.label}
                            </div>
                        ))}
                    </div>

                    <div
                        className="flex flex-col sm:flex-row gap-5"
                    >
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_20px_50px_-10px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        >
                            <Download className="w-5 h-5 group-hover:bounce" />
                            Download Full PDF
                        </button>

                        <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                            <span className="text-[10px] font-black text-blue-200/50 uppercase tracking-wider">
                                Used by <span className="text-white">12,000+</span> Investors
                            </span>
                        </div>
                    </div>
                </div>

                <div className="lg:w-1/2 relative">
                    <div
                        className="relative group animate-on-scroll"
                    >
                        {/* Main Card */}
                        <div className="w-72 md:w-80 aspect-[3/4] bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border-[12px] border-white relative z-20 transition-transform duration-700 group-hover:rotate-0 group-hover:scale-105">
                            <div className="h-1/2 bg-slate-900 relative">
                                <img
                                    src={reportSrc}
                                    alt="Report Cover"
                                    className="w-full h-full object-cover opacity-80"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <span className="px-2 py-1 bg-amber-400 rounded text-[8px] font-black text-slate-900 uppercase mb-2 inline-block">
                                        Q4 2025 Edition
                                    </span>
                                    <h4 className="text-lg font-black text-white leading-tight">
                                        The India IPO Market Standard
                                    </h4>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <p className="text-xs leading-relaxed text-slate-600 font-medium">
                                        Comprehensive IPO research, GMP trends, sector analysis,
                                        institutional insights and exclusive market intelligence.
                                    </p>
                                </div>
                                <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-slate-400 uppercase">
                                            Pages
                                        </span>
                                        <span className="text-xs font-bold text-slate-900">
                                            10+
                                        </span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-[8px] font-black text-slate-400 uppercase">
                                            Data Points
                                        </span>
                                        <span className="text-xs font-bold text-blue-600">5k+</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Back Cards */}
                        <div className="absolute inset-0 rounded-[2.5rem] rotate-[-6deg] -z-10 bg-slate-800 overflow-hidden border border-white/10 transition-transform duration-700 group-hover:-rotate-12 group-hover:-translate-x-8">
                            <img
                                src={customBg1Src}
                                alt=""
                                className="w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                        </div>

                        <div className="absolute inset-0 rounded-[2.5rem] rotate-[12deg] -z-20 bg-slate-800 overflow-hidden border border-white/10 transition-transform duration-700 group-hover:rotate-12 group-hover:translate-x-8">
                            <img
                                src={customBg2Src}
                                alt=""
                                className="w-full h-full object-cover opacity-40"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                        </div>
                    </div>
                </div>
                <ReportModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        </section>
    );
};

export default React.memo(AnnualReport);
