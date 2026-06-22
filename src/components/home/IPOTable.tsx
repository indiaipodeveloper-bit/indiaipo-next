"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Ribbon from "@/components/Ribbon";
import { ArrowRight, Activity, Newspaper } from "lucide-react";
import { getImgSrc } from "@/utils/image";
import { cn, getLatestGmpValue } from "@/lib/utils";

const getCalculatedStatus = (item: any) => {
    if (item.status === "Inactive") return "Inactive";

    if (
        item.date_declared === "No" ||
        item.date_declared === "Date Not Declared" ||
        !item.date_declared ||
        item.date_declared === "" ||
        item.date_declared === "0" ||
        item.date_declared === 0
    ) {
        return "Date Not Declared";
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const openDate = item.open_date ? new Date(item.open_date) : null;
    const closeDate = item.close_date ? new Date(item.close_date) : null;
    const listingDate = item.listing_date ? new Date(item.listing_date) : null;

    openDate?.setHours(0, 0, 0, 0);
    closeDate?.setHours(0, 0, 0, 0);
    listingDate?.setHours(0, 0, 0, 0);

    if (openDate && now < openDate) {
        return "Upcoming";
    }

    if (openDate && closeDate && now >= openDate && now <= closeDate) {
        return "Active";
    }

    if (closeDate && listingDate && now > closeDate && now < listingDate) {
        return "Issue Closed (Unlisted)";
    }

    if (listingDate && now.getTime() === listingDate.getTime()) {
        return "Listing Today";
    }

    if (listingDate && now > listingDate) {
        return "Listed";
    }

    return item.status || "Upcoming";
};

const rowBgColor: Record<string, string> = {
    Active: "bg-emerald-100 hover:bg-emerald-200",
    Upcoming: "bg-blue-100 hover:bg-blue-200",
    "Issue Closed (Unlisted)": "bg-yellow-100 hover:bg-yellow-200",
    Listed: "bg-white hover:bg-slate-100",
    Inactive: "bg-rose-100 hover:bg-rose-200",
    "Listing Today": "bg-red-100 hover:bg-red-200",
    "Date Not Declared": "bg-orange-50 hover:bg-orange-100/70",
};

const formatDate = (open: string, close: string) => {
    if (!open || !close) return "TBA";
    const o = new Date(open);
    const c = new Date(close);
    const options: any = { day: "2-digit", month: "short" };
    return `${o.toLocaleDateString("en-IN", options)} - ${c.toLocaleDateString("en-IN", options)}`;
};

const formatPrice = (low: any, high: any) => {
    if ((!low || low === '0' || low === 0) && (!high || high === '0' || high === 0)) return "TBA";
    if (!low || low === '0' || low === 0) return `₹${high}`;
    if (!high || high === '0' || high === 0 || low === high) return `₹${low}`;
    return `₹${low} to ₹${high}`;
};

interface IPOTableProps {
    ipos?: any[];
    isLoading?: boolean;
}

const IPOTable: React.FC<IPOTableProps> = ({ ipos: ipoList = [], isLoading: loading = true }) => {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const processedIpoList = useMemo(() => {
        return ipoList.map((ipo) => {
            const status = getCalculatedStatus(ipo);

            return {
                ...ipo,
                calculatedStatus: status,
                formattedDate: formatDate(
                    ipo.open_date,
                    ipo.close_date
                ),
                formattedPrice: formatPrice(
                    ipo.issue_lowest_price,
                    ipo.issue_highest_price
                ),
                latestGmp: getLatestGmpValue(ipo.gmp),
            };
        });
    }, [ipoList]);

    return (
        <section className="py-24 px-4 container mx-auto">
            <div
                className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6"
            >
                <div>
                    <Ribbon
                        fontSize="11px"
                        cutout="0.5em"
                        className="inline-flex items-center gap-2 text-blue-300 font-bold border border-blue-500/30"
                    >
                        <Activity className="h-4 w-4" />
                        To Be Listed
                    </Ribbon>
                    <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
                        Open / Upcoming <span className="text-blue-900">IPOs</span>
                    </h2>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-4 justify-between min-w-[200px]">
                        <span className="text-slate-500 font-medium">
                            Date Not Declared
                        </span>
                        <span className="w-10 h-3 bg-orange-400 rounded-full border border-orange-500"></span>
                    </div>
                    <div className="flex items-center gap-4 justify-between min-w-[200px]">
                        <span className="text-slate-500 font-medium">Issue Open</span>
                        <span className="w-10 h-3 bg-green-400 rounded-full border border-green-500"></span>
                    </div>
                    <div className="flex items-center gap-4 justify-between min-w-[200px]">
                        <span className="text-slate-500 font-medium">
                            Issue Closed But Unlisted
                        </span>
                        <span className="w-10 h-3 bg-amber-400 rounded-full border border-amber-500"></span>
                    </div>
                    <div className="flex items-center gap-4 justify-between min-w-[200px]">
                        <span className="text-slate-500 font-medium">Listing Today</span>
                        <span className="w-10 h-3 bg-red-400 rounded-full border border-red-500"></span>
                    </div>
                    <div className="flex items-center gap-4 justify-between min-w-[200px]">
                        <span className="text-slate-500 font-medium">Upcoming Listing</span>
                        <span className="w-10 h-3 bg-blue-400 rounded-full border border-blue-500"></span>
                    </div>
                </div>
            </div>

            {!isMobile && (
                <div
                    className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200 shadow-md max-h-[600px] overflow-y-auto bg-white"
                >
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead className="sticky top-0 z-20">
                            <tr className="bg-slate-100/90 text-slate-600 border-b border-slate-200">
                                <th className="px-6 py-5 font-bold text-[11px] uppercase tracking-widest text-left w-24">
                                    Logo
                                </th>
                                <th className="px-6 py-5 font-bold text-[11px] uppercase tracking-widest text-left">
                                    UPCOMING IPO LIST
                                </th>
                                <th className="px-6 py-5 font-bold text-[11px] uppercase tracking-widest text-left">
                                    DATE
                                </th>
                                <th className="px-6 py-5 font-bold text-[11px] uppercase tracking-widest text-center">
                                    GMP(₹)
                                </th>
                                <th className="px-6 py-5 font-bold text-[11px] uppercase tracking-widest text-center">
                                    SIZE
                                </th>
                                <th className="px-6 py-5 font-bold text-[11px] uppercase tracking-widest text-center whitespace-nowrap">
                                    PRICE BAND
                                </th>
                                <th className="px-6 py-5 font-bold text-[11px] uppercase tracking-widest text-center">
                                    TYPE
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading
                                ? Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={7} className="px-6 py-8">
                                            <div className="h-4 bg-slate-100 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                                : processedIpoList.map((ipo, idx) => {
                                    return (
                                        <tr
                                            key={ipo.id || idx}
                                            onClick={() =>
                                                router.push(
                                                    ipo.blog_slug
                                                        ? `/ipo-blogs/${ipo.blog_slug}`
                                                        : "/all-ipos",
                                                )
                                            }
                                            className={cn(
                                                "transition-colors border-b border-slate-100 cursor-pointer",
                                                rowBgColor[String(ipo.calculatedStatus)] || "bg-white",
                                            )}
                                        >
                                            <td className="px-6 py-6 text-center">
                                                <div
                                                    className={`w-10 h-10 mx-auto bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center font-bold text-xs ${ipo.calculatedStatus === "Active" ? "shadow-sm text-green-700" : "text-slate-400"}`}
                                                >
                                                    {ipo.logo ? (
                                                        <img
                                                            src={getImgSrc(ipo.logo) || ""}
                                                            alt=""
                                                            className="w-full h-full object-contain rounded"
                                                        />
                                                    ) : (
                                                        ipo.issuer_company?.[0] || "I"
                                                    )}
                                                </div>
                                            </td>
                                            <td
                                                className={`px-6 py-6 font-semibold text-[15px] text-slate-900 ${ipo.calculatedStatus === "Active" ? "font-bold" : ""}`}
                                            >
                                                <Link
                                                    href={
                                                        ipo.blog_slug
                                                            ? `/ipo-blogs/${ipo.blog_slug}`
                                                            : "/all-ipos"
                                                    }
                                                    className="hover:text-blue-700 transition-colors uppercase"
                                                >
                                                    {ipo.issuer_company}
                                                </Link>
                                                <div className="flex flex-wrap gap-1 mt-1.5">
                                                    <span className="bg-slate-100 text-slate-600 text-[8px] font-bold px-1.5 py-0.5 rounded border border-slate-200 uppercase">
                                                        {ipo.exchange || "BSE, NSE"}
                                                    </span>
                                                    <span className="bg-blue-50 text-blue-600 text-[8px] font-bold px-1.5 py-0.5 rounded border border-blue-100 uppercase">
                                                        {ipo.sector_name ||
                                                            ipo.sector_names ||
                                                            ipo.sector ||
                                                            ipo.issue_category ||
                                                            "Mainline"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-2 text-[14px] text-slate-600 whitespace-nowrap">
                                                    <Newspaper className="h-4 w-4" />{" "}
                                                    {ipo.formattedDate}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <div
                                                    className={cn(
                                                        "text-[14px] font-bold flex items-center justify-center gap-1",
                                                        ipo.gmp && ipo.gmp !== "—"
                                                            ? "text-green-900"
                                                            : "text-slate-700",
                                                    )}
                                                >
                                                    {ipo.latestGmp}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-center font-bold text-[15px] text-blue-800">
                                                ₹{ipo.issue_size || "—"} Cr.
                                            </td>
                                            <td className="px-6 py-6 text-center text-[14px] text-slate-600 font-medium whitespace-nowrap">
                                                {ipo.formattedPrice}
                                            </td>
                                            <td className="px-6 py-6 text-center text-[14px] text-slate-600 font-medium whitespace-nowrap uppercase">
                                                {ipo.issue_category || ipo.exchange}
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            )}

            {isMobile && (
                <div className="md:hidden space-y-3">
                    {loading
                        ? Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-40 bg-slate-100 rounded-2xl animate-pulse"
                            />
                        ))
                        : processedIpoList.map((ipo, idx) => {
                            const statusConfig: Record<
                                string,
                                { border: string; badge: string; dot: string }
                            > = {
                                Active: {
                                    border: "border-l-4 border-l-emerald-500",
                                    badge: "bg-emerald-100 text-emerald-800",
                                    dot: "bg-emerald-500",
                                },
                                Upcoming: {
                                    border: "border-l-4 border-l-blue-500",
                                    badge: "bg-blue-100 text-blue-800",
                                    dot: "bg-blue-500",
                                },
                                "Issue Closed (Unlisted)": {
                                    border: "border-l-4 border-l-yellow-500",
                                    badge: "bg-yellow-100 text-yellow-800",
                                    dot: "bg-yellow-500",
                                },
                                Listed: {
                                    border: "border-l-4 border-l-slate-300",
                                    badge: "bg-slate-50 text-slate-700",
                                    dot: "bg-slate-400",
                                },
                                "Listing Today": {
                                    border: "border-l-4 border-l-red-500",
                                    badge: "bg-red-100 text-red-800",
                                    dot: "bg-red-500",
                                },
                                "Date Not Declared": {
                                    border: "border-l-4 border-l-orange-500",
                                    badge: "bg-orange-100 text-orange-800",
                                    dot: "bg-orange-500",
                                },
                            };
                            const sc = statusConfig[ipo.calculatedStatus] || statusConfig.Listed;
                            const initials = ipo.issuer_company
                                .split(" ")
                                .slice(0, 2)
                                .map((w: string) => w[0])
                                .join("")
                                .toUpperCase();
                            return (
                                <div
                                    key={ipo.id || idx}
                                    onClick={() =>
                                        router.push(
                                            ipo.blog_slug
                                                ? `/ipo-blogs/${ipo.blog_slug}`
                                                : "/all-ipos",
                                        )
                                    }
                                    className={cn(
                                        "rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer",
                                        sc.border,
                                        rowBgColor[String(ipo.calculatedStatus)] || "bg-white",
                                    )}
                                >
                                    <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center font-extrabold text-white text-xs flex-shrink-0">
                                            {initials}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={
                                                    ipo.blog_slug
                                                        ? `/ipo-blogs/${ipo.blog_slug}`
                                                        : "/all-ipos"
                                                }
                                            >
                                                <p className="font-bold text-slate-900 text-[14px] leading-snug line-clamp-2 uppercase hover:text-blue-700 transition-colors">
                                                    {ipo.issuer_company}
                                                </p>
                                            </Link>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${sc.badge}`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}
                                                />
                                                {ipo.calculatedStatus === "Active" ? "Open" : ipo.calculatedStatus}
                                            </span>
                                            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-800 text-white rounded-md mb-1">
                                                {ipo.exchange || "BSE, NSE"}
                                            </span>
                                            <span className="text-[9px] font-black italic text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-tight">
                                                {ipo.sector_name ||
                                                    ipo.sector_names ||
                                                    ipo.sector ||
                                                    ipo.issue_category ||
                                                    "Mainline"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mx-4 h-px bg-slate-100" />
                                    <div className="grid grid-cols-2 gap-2 p-4">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600">
                                                Date
                                            </span>
                                            <span className="text-[11px] font-semibold text-slate-700">
                                                {ipo.formattedDate}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600">
                                                Issue Size
                                            </span>
                                            <span className="text-[11px] font-bold text-blue-700">
                                                ₹{ipo.issue_size || "—"} Cr.
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600">
                                                Price Band
                                            </span>
                                            <span className="text-[11px] font-semibold text-slate-700">
                                                {ipo.formattedPrice}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600">
                                                GMP
                                            </span>
                                            <span
                                                className={`text-[11px] font-bold ${ipo.gmp && ipo.gmp !== "—" ? "text-green-800" : "text-slate-600"}`}
                                            >
                                                {ipo.latestGmp}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}
            <div className="mt-6 flex justify-end">
                <Link
                    href="/all-ipos"
                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-900 hover:text-blue-700 transition-colors group"
                >
                    View All Listings
                    <ArrowRight className="h-4 w-4 transition-colors group-hover:translate-x-1" />
                </Link>
            </div>

            <div className="mt-8 bg-red-50 border border-red-100 rounded-xl overflow-hidden shadow-sm py-4">
                <div className="marquee-wrapper">
                    <div className="marquee-track text-[13px] font-semibold text-red-900 italic">
                        <div className="marquee-item">
                            Note: The data provided on Grey Market Premium (GMP) is solely for informational purposes related to the grey market news.
                        </div>
                        <div className="marquee-item">
                            Note: The data provided on Grey Market Premium (GMP) is solely for informational purposes related to the grey market news.
                        </div>
                        <div className="marquee-item">
                            Note: The data provided on Grey Market Premium (GMP) is solely for informational purposes related to the grey market news.
                        </div>
                        <div className="marquee-item">
                            Note: The data provided on Grey Market Premium (GMP) is solely for informational purposes related to the grey market news.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default React.memo(IPOTable);
