"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    TrendingUp,
    Activity,
    BarChart2,
    BarChart,
} from "lucide-react";

import { getLatestGmpValue } from "@/lib/utils";

const bgs = [
    "bg-green-100",
    "bg-blue-100",
    "bg-amber-100",
    "bg-slate-100",
];
const icons = [
    <TrendingUp key="1" className="h-5 w-5 text-green-700" />,
    <BarChart2 key="2" className="h-5 w-5 text-blue-700" />,
    <Activity key="3" className="h-5 w-5 text-amber-700" />,
    <BarChart key="4" className="h-5 w-5 text-slate-600" />,
];

interface GMPSectionProps {
    ipos?: any[];
    isLoading?: boolean;
}

const GMPSection: React.FC<GMPSectionProps> = ({ ipos: initialIpos = [], isLoading = true }) => {
    const router = useRouter();

    const displayItems = useMemo(() => {
        if (!initialIpos || initialIpos.length === 0) {
            return [
                {
                    name: "Indegene Limited",
                    date: "12 May",
                    gmp: "+₹125",
                    pct: "28%",
                    icon: icons[0],
                    bg: bgs[0],
                    slug: "",
                },
                {
                    name: "Aadhar Housing",
                    date: "15 May",
                    gmp: "+₹42",
                    pct: "14%",
                    icon: icons[1],
                    bg: bgs[1],
                    slug: "",
                },
                {
                    name: "Go Digit Insure",
                    date: "20 May",
                    gmp: "+₹15",
                    pct: "5%",
                    icon: icons[2],
                    bg: bgs[2],
                    slug: "",
                },
                {
                    name: "TBO Tek Ltd",
                    date: "19 May",
                    gmp: "+₹540",
                    pct: "60%",
                    icon: icons[3],
                    bg: bgs[3],
                    slug: "",
                },
            ];
        }

        const sortedData = initialIpos
            .map((item: any) => {
                let gmpValue = 0;
                const latestGmpStr = getLatestGmpValue(item.gmp);
                if (latestGmpStr && latestGmpStr !== "—") {
                    const pctMatch = latestGmpStr.match(/([\d.]+)\s*%/);
                    if (pctMatch) {
                        gmpValue = parseFloat(pctMatch[1]) * 100;
                    } else {
                        const numMatch = latestGmpStr.match(/[\d,.]+/);
                        if (numMatch)
                            gmpValue = parseFloat(numMatch[0].replace(/,/g, ""));
                    }
                }
                return { ...item, gmpValue };
            })
            .sort((a: any, b: any) => b.gmpValue - a.gmpValue)
            .slice(0, 4);

        return sortedData.map((item: any, i: number) => {
            let gmpVal = "—";
            let pct = "—";

            const latestGmpStr = getLatestGmpValue(item.gmp);
            if (latestGmpStr && latestGmpStr !== "—") {
                const gmpMatch = latestGmpStr.match(/([₹]*[\d,.]+)/);
                const pctMatch = latestGmpStr.match(/([\d.]+%\s*)/);

                if (gmpMatch)
                    gmpVal = gmpMatch[1].startsWith("₹")
                        ? gmpMatch[1]
                        : `+₹${gmpMatch[1]}`;
                if (pctMatch) pct = pctMatch[1];
            }

            return {
                name: item.issuer_company,
                date: item.open_date
                    ? new Date(item.open_date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                    })
                    : "Check Details",
                gmp: gmpVal,
                pct: pct,
                icon: icons[i % 4],
                bg: bgs[i % 4],
                slug: item.blog_slug,
            };
        });
    }, [initialIpos]);

    return (
        <section className="bg-slate-50 py-24 px-6 overflow-hidden border-y border-slate-200 scroll-mt-28" id="gmp">
            <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-16 items-center">
                <div className="lg:w-1/3">
                    <h2 className="text-4xl font-extrabold tracking-tight mb-6 text-slate-900">
                        Top <strong style={{ color: "#2557C5" }}>GMP</strong> Performers
                    </h2>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        Grey Market Premium (GMP) reflects demand for IPO shares before
                        listing and helps indicate market sentiment.{" "}
                    </p>
                    <Link
                        href="/all-ipos"
                        className="flex items-center gap-3 text-slate-900 font-bold group"
                    >
                        View Real-time GMP Dashboard
                        <span className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center transition-colors">
                            <TrendingUp className="h-4 w-4" />
                        </span>
                    </Link>
                </div>
                <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 w-full">
                    {isLoading
                        ? Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-white p-3 md:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm border border-slate-100 gap-3 animate-pulse"
                            >
                                <div className="flex items-center gap-3 md:gap-4 w-full overflow-hidden">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-slate-100 flex-shrink-0" />
                                    <div className="min-w-0 flex-1 space-y-2">
                                        <div className="h-4 bg-slate-100 rounded w-3/4" />
                                        <div className="h-3 bg-slate-100 rounded w-1/2" />
                                    </div>
                                </div>
                                <div className="w-full sm:w-auto space-y-1.5 flex flex-col items-start sm:items-end">
                                    <div className="h-4 bg-slate-100 rounded w-16" />
                                    <div className="h-3 bg-slate-100 rounded w-12" />
                                </div>
                            </div>
                        ))
                        : displayItems.map((item, i) => (
                            <div
                                key={i}
                                onClick={() =>
                                    router.push(item.slug ? `/ipo-blogs/${item.slug}` : "/all-ipos")
                                }
                                className="bg-white p-3 md:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm border border-slate-100 transition-colors gap-3 cursor-pointer"
                            >
                                <div className="flex items-center gap-3 md:gap-4 w-full overflow-hidden">
                                    <div
                                        className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${item.bg} flex-shrink-0 flex items-center justify-center`}
                                    >
                                        {item.icon}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-slate-900 text-xs md:text-base truncate uppercase">
                                            {item.name}
                                        </p>
                                        <p className="text-[9px] md:text-[10px] text-slate-500 truncate">
                                            Date: {item.date}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-left sm:text-right w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-50">
                                    <p className="text-green-700 font-black text-xs md:text-base flex items-center gap-1 sm:justify-end">
                                        <TrendingUp className="h-3 md:h-3.5 w-3 md:w-3.5" />
                                        {item.gmp}
                                    </p>
                                    <p className="text-[9px] md:text-[10px] font-medium text-slate-500">
                                        GMP ({item.pct})
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
};

export default React.memo(GMPSection);
