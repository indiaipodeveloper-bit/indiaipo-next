"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getImgSrc } from "@/utils/image";
import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import { API_URL } from "@/lib/constants";

const catColors: Record<string, string> = {
    Strategy: "bg-amber-100 text-amber-800",
    Taxation: "bg-green-100 text-green-800",
    Analysis: "bg-blue-100 text-blue-800",
    Education: "bg-indigo-100 text-indigo-800",
    Reports: "bg-orange-100 text-orange-800",
    General: "bg-slate-100 text-slate-700",
    ipo_blogs: "bg-blue-100 text-blue-800",
};

const MarketInsights = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const blog1Src = typeof blog1 === "string" ? blog1 : blog1.src;
    const blog2Src = typeof blog2 === "string" ? blog2 : blog2.src;
    const blog3Src = typeof blog3 === "string" ? blog3 : blog3.src;

    const fallbackBlogs = [
        {
            img: blog1Src,
            category: "ipo_blogs",
            title: "5 Metrics to check before applying for a Fintech IPO",
            excerpt:
                "Understanding the burn rate and customer acquisition cost is vital when evaluating high-growth fintech companies.",
            slug: "",
        },
        {
            img: blog2Src,
            category: "ipo_blogs",
            title: "Capital Gains Tax: What IPO investors need to know",
            excerpt:
                "LTCG vs STCG—navigating the tax implications of your IPO listing gains to maximize your net profit returns.",
            slug: "",
        },
        {
            img: blog3Src,
            category: "ipo_blogs",
            title: "Why HNI subscription matters more than Retail",
            excerpt:
                "High Net-worth Individual interest often signals institutional confidence which can drive secondary market demand.",
            slug: "",
        },
        {
            img: blog1Src,
            category: "ipo_blogs",
            title: "SME IPO vs Mainline IPO: Key Differences",
            excerpt:
                "Understanding the fundamental differences between SME and Mainline IPOs to make informed investment decisions.",
            slug: "",
        },
        {
            img: blog2Src,
            category: "ipo_blogs",
            title: "IPO Market Outlook 2025: What to Expect",
            excerpt:
                "A comprehensive analysis of India's IPO pipeline and market conditions for the coming year.",
            slug: "",
        },
    ];

    const checkScrollButtons = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 5);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
        }
    };

    useEffect(() => {
        fetch(`${API_URL}/api/admin-blogs?limit=10&summary=1&category=ipo_blogs`)
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => {
                if (d && Array.isArray(d.data) && d.data.length > 0) {
                    setBlogs(d.data);
                } else {
                    setBlogs([]);
                }
            })
            .catch(() => {
                setBlogs([]);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        checkScrollButtons();
        window.addEventListener("resize", checkScrollButtons);
        return () => window.removeEventListener("resize", checkScrollButtons);
    }, [blogs, loading]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollRef.current && window.innerWidth < 768) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                const maxScroll = scrollWidth - clientWidth;
                let nextScroll = scrollLeft + clientWidth;
                if (scrollLeft >= maxScroll - 10) nextScroll = 0;
                scrollRef.current.scrollTo({ left: nextScroll, behavior: "smooth" });
            }
        }, 4000);
        return () => clearInterval(interval);
    }, [blogs, loading]);

    const displayBlogs = blogs.length > 0 ? blogs : fallbackBlogs;

    const scroll = (dir: "left" | "right") => {
        if (!scrollRef.current) return;
        const move = scrollRef.current.clientWidth * 0.75;
        scrollRef.current.scrollBy({
            left: dir === "left" ? -move : move,
            behavior: "smooth",
        });
        setTimeout(checkScrollButtons, 400);
    };

    return (
        <section className="py-24 bg-slate-50 border-y border-slate-200 overflow-hidden">
            <div className="container mx-auto px-4">
                <div
                    className="flex justify-between items-center mb-12"
                >
                    <div>
                        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
                            Market <span className="text-blue-900">Insights</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => scroll("left")}
                            className={`w-10 h-10 rounded-full border border-slate-300 bg-white flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95 shadow-sm ${!canScrollLeft ? 'opacity-0 pointer-events-none' : ''} cursor-pointer`}
                            aria-label="Scroll Left"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className={`w-10 h-10 rounded-full border border-slate-300 bg-white flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95 shadow-sm ${!canScrollRight ? 'opacity-0 pointer-events-none' : ''} cursor-pointer`}
                            aria-label="Scroll Right"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                        <Link
                            href="/blogs"
                            className="hidden md:inline-flex items-center gap-1.5 px-5 py-2 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-700 transition-colors ml-2 shadow-md"
                        >
                            View All <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    onScroll={checkScrollButtons}
                    className="overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                >
                    <div className="flex gap-6">
                        {loading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex-shrink-0 w-[300px] md:w-[340px] snap-center bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse"
                                >
                                    <div className="h-48 bg-slate-200" />
                                    <div className="p-5 space-y-3">
                                        <div className="h-3 bg-slate-200 rounded w-1/3" />
                                        <div className="h-4 bg-slate-200 rounded w-full" />
                                        <div className="h-4 bg-slate-200 rounded w-3/4" />
                                    </div>
                                </div>
                            ))
                            : displayBlogs.map((item: any, i: number) => {
                                const category = item.category || "General";
                                const image =
                                    getImgSrc(item.image_url || item.image || item.img) ||
                                    blog1Src;
                                const slug = item.slug || item.new_slug || "";
                                const blogUrl = slug ? `/blogs/${slug}` : "/blogs";

                                const dateObj = item.created_at
                                    ? new Date(item.created_at)
                                    : null;
                                const formattedDate =
                                    dateObj && !isNaN(dateObj.getTime())
                                        ? dateObj.toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })
                                        : "India IPO";

                                return (
                                    <div
                                        key={i}
                                        className="flex-shrink-0 w-[300px] md:w-[340px] snap-center"
                                    >
                                        <Link
                                            href={blogUrl}
                                            className="group block bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full"
                                        >
                                            <div className="h-48 overflow-hidden relative">
                                                <img
                                                    src={image}
                                                    alt={item.title}
                                                    loading="lazy"
                                                    decoding="async"
                                                    width="340"
                                                    height="192"
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = blog1Src;
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                            </div>

                                            <div className="p-5">
                                                <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-blue-900 transition-colors">
                                                    {item.title}
                                                </h3>
                                                <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-4">
                                                    {item.excerpt || item.description || item.title}
                                                </p>
                                                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                                                    <span className="text-[11px] text-slate-600 font-medium">
                                                        {formattedDate}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 group-hover:gap-2 transition-all">
                                                        Read More <ArrowRight className="h-3.5 w-3.5" />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                    </div>
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link
                        href="/ipo-blogs"
                        className="inline-flex items-center gap-1.5 px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-700 transition-colors"
                    >
                        View All Blogs <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default React.memo(MarketInsights);
