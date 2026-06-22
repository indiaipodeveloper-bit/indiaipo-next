"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn, getLatestGmpValue } from "@/lib/utils";
import Ribbon from "@/components/Ribbon";
import { ChevronLeft, ChevronRight } from "lucide-react";

const statusRibbonBg: Record<string, string> = {
    Active: "linear-gradient(135deg, #10b981, #059669)",
    Upcoming: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    "Issue Closed (Unlisted)": "linear-gradient(135deg, #f59e0b, #d97706)",
    Listed: "linear-gradient(135deg, #64748b, #475569)",
    Inactive: "linear-gradient(135deg, #f43f5e, #be123c)",
    "Listing Today": "linear-gradient(135deg, #ef4444, #b91c1c)",
    "Date Not Declared": "linear-gradient(135deg, #f97316, #c2410c)",
};

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

const actionBtn: Record<string, { label: string; cls: string }> = {
    Active: {
        label: "View Details",
        cls: "bg-blue-900 text-white hover:bg-blue-800",
    },
    Upcoming: {
        label: "View Details",
        cls: "bg-slate-200 text-slate-700 hover:bg-slate-300",
    },
    "Issue Closed (Unlisted)": {
        label: "View Details",
        cls: "border border-blue-900 text-blue-900 hover:bg-blue-50",
    },
    Listed: {
        label: "View Details",
        cls: "bg-blue-900 text-white hover:bg-blue-800",
    },
    Inactive: {
        label: "Inactive",
        cls: "bg-rose-50 text-rose-300 cursor-not-allowed",
    },
    "Date Not Declared": {
        label: "View Details",
        cls: "bg-orange-600 text-white hover:bg-orange-700",
    },
};

interface LiveIPOsProps {
    ipos?: any[];
    isLoading?: boolean;
}

const LiveIPOs: React.FC<LiveIPOsProps> = ({ ipos: initialIpos = [], isLoading = true }) => {
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScrollButtons = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 5);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
        }
    };

    const ipos = useMemo(() => {
        if (!initialIpos || initialIpos.length === 0) return [];
        return initialIpos.slice(0, 3).map((item: any) => {
            const calculatedStatus = getCalculatedStatus(item);

            return {
                id: item.id,
                companyName: item.issuer_company,
                status: calculatedStatus,
                priceRange: (() => {
                    const low = item.issue_lowest_price;
                    const high = item.issue_highest_price;
                    if ((!low || low === '0' || low === 0) && (!high || high === '0' || high === 0)) return "TBA";
                    if (!low || low === '0' || low === 0) return `₹${high}`;
                    if (!high || high === '0' || high === 0 || low === high) return `₹${low}`;
                    return `₹${low} - ₹${high}`;
                })(),
                gmp: getLatestGmpValue(item.gmp),
                subscription: item.subscription || "Check Details",
                lotSize: item.lot_size || "—",
                issue_highest_price: item.issue_highest_price || 100,
                slug: item.blog_slug,
            };
        });
    }, [initialIpos]);

    useEffect(() => {
        const timer = setTimeout(checkScrollButtons, 100);
        window.addEventListener("resize", checkScrollButtons);
        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", checkScrollButtons);
        };
    }, [ipos, isLoading]);

    return (
        <section className="py-20 px-4 container mx-auto">
            <div
                className="flex justify-between items-end mb-12"
            >
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
                        Live <strong style={{ color: "#2557C5" }}>IPO</strong> Listings
                    </h2>
                    <p className="text-gray-600 pt-4">
                        Track ongoing, upcoming and closed IPOs with key details including
                        price band, GMP and subscription status
                    </p>
                </div>
                <Link
                    href="/all-ipos"
                    className="hidden md:flex text-blue-900 font-bold items-center gap-1 hover:underline"
                >
                    View all listings <ChevronRight className="h-4 w-4" />
                </Link>
            </div>
            <div
                ref={scrollRef}
                className="overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            >
                <div className="flex gap-6 md:grid md:grid-cols-3 md:gap-8">
                    {isLoading
                        ? Array.from({ length: 3 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="flex-shrink-0 w-[85vw] md:w-auto snap-center bg-white p-6 rounded-2xl shadow-[0_12px_40px_rgba(25,28,30,0.06)] border border-slate-100 flex flex-col animate-pulse"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-16 h-16 rounded-xl bg-slate-100" />
                                    <div className="w-20 h-6 rounded-full bg-slate-100" />
                                </div>
                                <div className="h-7 bg-slate-100 rounded w-3/4 mb-4" />
                                <div className="grid grid-cols-2 gap-y-4 mb-6 flex-1">
                                    <div>
                                        <div className="h-3 bg-slate-100 rounded w-16 mb-1" />
                                        <div className="h-4 bg-slate-100 rounded w-24" />
                                    </div>
                                    <div>
                                        <div className="h-3 bg-slate-100 rounded w-10 mb-1" />
                                        <div className="h-4 bg-slate-100 rounded w-16" />
                                    </div>
                                    <div>
                                        <div className="h-3 bg-slate-100 rounded w-20 mb-1" />
                                        <div className="h-4 bg-slate-100 rounded w-20" />
                                    </div>
                                    <div>
                                        <div className="h-3 bg-slate-100 rounded w-12 mb-1" />
                                        <div className="h-4 bg-slate-100 rounded w-12" />
                                    </div>
                                </div>
                                <div className="w-full h-12 bg-slate-100 rounded-xl mt-auto" />
                            </div>
                        ))
                        : ipos.map((ipo, idx) => {
                            const btn = actionBtn[ipo.status] || actionBtn.Upcoming;

                            return (
                                <div
                                    key={ipo.id}
                                    onClick={() =>
                                        router.push(ipo.slug ? `/ipo-blogs/${ipo.slug}` : "/all-ipos")
                                    }
                                    className="flex-shrink-0 w-[85vw] md:w-auto snap-center bg-white p-6 rounded-2xl shadow-[0_12px_40px_rgba(25,28,30,0.06)] transition-all group border border-slate-100 flex flex-col cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-blue-900 text-lg group-hover:bg-blue-900 group-hover:text-white transition-colors duration-200 text-center p-2">
                                            {ipo.companyName.slice(0, 2).toUpperCase()}
                                        </div>
                                        <Ribbon
                                            fontSize="10px"
                                            cutout="0.5em"
                                            color={statusRibbonBg[ipo.status] || "linear-gradient(135deg, #64748b, #475569)"}
                                            className="inline-flex items-center text-white font-black uppercase tracking-tighter"
                                        >
                                            {ipo.status === "Active" ? "Open" : ipo.status}
                                        </Ribbon>
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 group-hover:text-blue-900 transition-colors text-slate-900 line-clamp-1">
                                        {ipo.companyName}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-y-4 mb-6 flex-1">
                                        <div>
                                            <p className="text-xs text-slate-500">Price Band</p>
                                            <p className="text-sm font-bold text-slate-900">
                                                {ipo.priceRange}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">GMP</p>
                                            <p className="text-sm font-bold text-green-700">
                                                {ipo.gmp !== "—" ? ipo.gmp : ""}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Subscription</p>
                                            <p className="text-sm font-bold text-slate-900">
                                                {ipo.subscription}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Lot Size</p>
                                            <p className="text-sm font-bold text-slate-900">
                                                {ipo.lotSize} shares
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href={ipo.slug ? `/ipo-blogs/${ipo.slug}` : "/all-ipos"}
                                        className={`w-full py-3 rounded-xl font-bold transition-all active:scale-95 mt-auto flex items-center justify-center ${btn.cls}`}
                                    >
                                        {btn.label}
                                    </Link>
                                </div>
                            );
                        })}
                </div>
            </div>
        </section>
    );
};

export default React.memo(LiveIPOs);
