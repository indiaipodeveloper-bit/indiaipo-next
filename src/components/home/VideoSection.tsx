"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

const VideoCard = ({
    v,
}: {
    v: { id: string; title: string; youtube_id: string };
}) => {
    const [playing, setPlaying] = useState(false);
    return (
        <div className="w-[300px] md:w-[380px] group cursor-pointer flex-shrink-0">
            <div className="relative rounded-2xl overflow-hidden mb-4 h-52 md:h-60 shadow-xl border border-white/5">
                {playing ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${v.youtube_id}?autoplay=1&rel=0`}
                        title={v.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                    />
                ) : (
                    <button
                        onClick={() => setPlaying(true)}
                        className="absolute inset-0 w-full h-full cursor-pointer"
                    >
                        <img
                            src={`https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`}
                            loading="lazy"
                            alt={v.title}
                            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-500"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-xl transition-transform">
                                <Play className="h-6 w-6 text-white fill-white ml-0.5" />
                            </div>
                        </div>
                        <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-white">
                            12:45
                        </div>
                    </button>
                )}
            </div>
            <h3 className="font-bold text-base md:text-lg mb-2 text-white line-clamp-2 leading-tight group-hover:text-blue-300 transition-colors uppercase tracking-tight">
                {v.title}
            </h3>
        </div>
    );
};

const VideoSection = () => {
    const [videos, setVideos] = useState<
        { id: string; title: string; youtube_id: string }[]
    >([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollButtons = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 5);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
        }
    };

    useEffect(() => {
        const load = async () => {
            try {
                const ytRes = await fetch("/api/videos/youtube/playlistItems?maxResults=6");
                if (ytRes.ok) {
                    const ytData = await ytRes.json();
                    if (ytData.items && ytData.items.length > 0) {
                        setVideos(
                            ytData.items.map((i: any) => ({
                                id: i.id || i.snippet.resourceId.videoId,
                                title: i.snippet.title,
                                youtube_id: i.snippet.resourceId.videoId,
                            })),
                        );
                        return;
                    }
                }
                const r = await fetch("/api/videos");
                const d = await r.json();
                if (Array.isArray(d) && d.length)
                    setVideos(
                        d.map((v: any) => ({
                            id: String(v.id),
                            title: v.title,
                            youtube_id: v.youtube_id || "",
                        })),
                    );
            } catch (_) { }
        };
        load();
    }, []);

    useEffect(() => {
        checkScrollButtons();
        window.addEventListener("resize", checkScrollButtons);
        return () => window.removeEventListener("resize", checkScrollButtons);
    }, [videos]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollRef.current && window.innerWidth < 768) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                const maxScroll = scrollWidth - clientWidth;
                let nextScroll = scrollLeft + clientWidth;
                if (scrollLeft >= maxScroll - 10) nextScroll = 0;
                scrollRef.current.scrollTo({ left: nextScroll, behavior: "smooth" });
            }
        }, 3500);
        return () => clearInterval(interval);
    }, [videos]);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const move = clientWidth * 0.8;
            const scrollTo =
                direction === "left" ? scrollLeft - move : scrollLeft + move;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
            setTimeout(checkScrollButtons, 400);
        }
    };

    if (!videos.length) return null;
    return (
        <section className="py-24 px-4 bg-[#0f172a] text-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div
                    className="flex justify-between items-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                        <strong style={{ color: "#f99810" }}>IPO</strong> Analysis Videos
                    </h2>
                    <div className="flex gap-4">
                        <button
                            onClick={() => scroll("left")}
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all active:scale-95 ${!canScrollLeft ? 'opacity-0 pointer-events-none' : ''} cursor-pointer`}
                            aria-label="Scroll Left"
                        >
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all active:scale-95 ${!canScrollRight ? 'opacity-0 pointer-events-none' : ''} cursor-pointer`}
                            aria-label="Scroll Right"
                        >
                            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                    </div>
                </div>
                <div
                    ref={scrollRef}
                    onScroll={checkScrollButtons}
                    className="overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
                    style={
                        {
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        } as React.CSSProperties
                    }
                >
                    <div className="flex gap-6 md:gap-8">
                        {videos.map((v, i) => (
                            <div key={`${v.id}-${i}`} className="snap-center">
                                <VideoCard v={v} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default React.memo(VideoSection);
