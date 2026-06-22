"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Ribbon from "@/components/Ribbon";

import gmpAlertsBg from "@/assets/gmp_alerts_bg.png";
import { ShieldCheck, Zap, Monitor, Shield, Download, Lightbulb } from "lucide-react";
import verifiedDataBg from "@/assets/verified_data_bg.png";
import expertAnalysisBg from "@/assets/expert_analysis_bg.png";
import seamlessInterfaceBg from "@/assets/seamless_interface_bg.png";
import appPreviewImg from "@/assets/app_preview.png";
import sebiAnalystBg from "@/assets/sebi_analyst_bg.png";

const BentoGrid = () => {
    const router = useRouter();

    const gmpAlertsBgSrc = typeof gmpAlertsBg === "string" ? gmpAlertsBg : gmpAlertsBg.src;
    const verifiedDataBgSrc = typeof verifiedDataBg === "string" ? verifiedDataBg : verifiedDataBg.src;
    const expertAnalysisBgSrc = typeof expertAnalysisBg === "string" ? expertAnalysisBg : expertAnalysisBg.src;
    const seamlessInterfaceBgSrc = typeof seamlessInterfaceBg === "string" ? seamlessInterfaceBg : seamlessInterfaceBg.src;
    const appPreviewImgSrc = typeof appPreviewImg === "string" ? appPreviewImg : appPreviewImg.src;
    const sebiAnalystBgSrc = typeof sebiAnalystBg === "string" ? sebiAnalystBg : sebiAnalystBg.src;

    return (
        <section className="py-4 px-4 container mx-auto">
            <h2
                className="text-4xl font-extrabold tracking-tight mb-16 text-center text-slate-900"
            >
                Built for India’s Next Public Companies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div
                    onClick={() => router.push("/ipo-services")}
                    className="md:col-span-2 lg:col-span-2 relative overflow-hidden group bg-blue-900 text-white p-6 sm:p-10 rounded-3xl flex flex-col justify-between min-h-[320px] h-full transition-colors duration-500 hover:shadow-2xl cursor-pointer"
                >
                    <img
                        src={gmpAlertsBgSrc}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-90 transition-opacity duration-300"
                        alt=""
                    />
                    <div className="absolute inset-0 bg-blue-900/60 group-hover:bg-blue-900/40 transition-colors" />
                    <div className="relative z-10">
                        <Zap className="h-10 w-10 fill-white" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-3">IPO Advisory</h3>
                        <p
                            className="opacity-90 text-sm leading-relaxed cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        >
                            End-to-end support for IPOs, including SME and Mainboard listings,
                            from preparation to execution.
                        </p>
                    </div>
                </div>
                <div
                    onClick={() => router.push("/pre-ipo-consultant")}
                    className="bg-white relative overflow-hidden group p-6 sm:p-8 rounded-3xl flex flex-col justify-between min-h-[320px] h-full shadow-sm border border-slate-100 transition-colors duration-500 hover:shadow-md cursor-pointer"
                >
                    <img
                        src={verifiedDataBgSrc}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-90 transition-opacity duration-300"
                        alt=""
                    />
                    <div className="absolute inset-0 bg-white/40" />
                    <div className="relative z-10">
                        <ShieldCheck className="h-10 w-10 text-green-700" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2 text-slate-900">
                            Pre-IPO & Funding Support
                        </h3>
                        <p
                            className="text-slate-600 text-sm font-medium cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Advisory on private placements, pre-IPO funding and capital
                            structuring to prepare for public markets.
                        </p>
                    </div>
                </div>

                <div
                    onClick={() => router.push("/invit-rights-issue-advisory-services")}
                    className="bg-amber-100 relative overflow-hidden group text-amber-950 p-6 sm:p-8 rounded-3xl flex flex-col justify-between min-h-[320px] h-full transition-colors duration-500 hover:shadow-md cursor-pointer"
                >
                    <img
                        src={expertAnalysisBgSrc}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-90 transition-opacity duration-300"
                        alt=""
                    />
                    <div className="absolute inset-0 bg-amber-100/60" />
                    <div className="relative z-10">
                        <Lightbulb className="h-10 w-10" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">
                            Capital Raising Solutions
                        </h3>
                        <p
                            className="text-amber-900/80 text-sm font-medium cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Support across REITs, InvITs, rights issues and debt instruments
                            for diverse fundraising needs
                        </p>
                    </div>
                </div>

                <div
                    className="md:col-span-2 lg:col-span-2 bg-slate-200 relative overflow-hidden group p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 min-h-[320px] h-full transition-colors duration-500 hover:shadow-md"
                >
                    <img
                        src={seamlessInterfaceBgSrc}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-90 transition-opacity duration-300"
                        alt=""
                    />
                    <div className="absolute inset-0 bg-slate-200/50" />
                    <div className="flex-1 relative z-10 text-center md:text-left">
                        <Monitor className="h-10 w-10 text-blue-900 mb-6 mx-auto md:mx-0" />
                        <h3 className="text-2xl font-bold mb-3 text-slate-900">
                            Structured Execution
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed font-medium">
                            Assistance with compliance, documentation and coordination to
                            ensure a smooth transaction process.
                        </p>
                    </div>
                </div>

                <div
                    onClick={() => router.push("/financial-modelling-services")}
                    className="md:col-span-2 lg:col-span-2 relative overflow-hidden group bg-green-800 text-white p-6 sm:p-10 rounded-3xl flex flex-col justify-between min-h-[320px] h-full transition-colors duration-500 hover:shadow-lg cursor-pointer"
                >
                    <img
                        src={sebiAnalystBgSrc}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-90 transition-opacity duration-300"
                        alt=""
                    />
                    <div className="absolute inset-0 bg-green-800/70 group-hover:bg-green-800/50 transition-colors" />
                    <div className="flex justify-between items-start relative z-10">
                        <Shield className="h-10 w-10 text-green-300" />
                        <Ribbon
                            fontSize="12px"
                            cutout="0.5em"
                            color="rgba(255,255,255,0.2)"
                            className="inline-flex items-center text-white font-black tracking-[0.2em] uppercase"
                        >
                            Trust Factor
                        </Ribbon>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-3">Financial Advisory</h3>
                        <p
                            className="opacity-90 text-sm leading-relaxed cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Services include valuation, financial modelling and corporate
                            finance to support informed decisions
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default React.memo(BentoGrid);
