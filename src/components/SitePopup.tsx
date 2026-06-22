"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2, ChevronLeft, ChevronRight, Newspaper, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { getImageUrl } from "@/lib/utils";
import Ribbon from "@/components/Ribbon";
import simpleChatbotImg from "@/assets/simple_chatbot_image2.jpeg";

interface PopupData {
  title: string;
  description: string;
  image_url: string | null;
  button_text: string;
  button_link: string;
  is_active: boolean;
}

interface DailyDigest {
  id: number;
  title: string;
  image: string | null;
  pdf: string | null;
  created_at: string;
  linked_blog_slug: string | null;
}

const SitePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<PopupData | null>(null);
  const [latestDigest, setLatestDigest] = useState<DailyDigest | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const chatbotImgSrc = typeof simpleChatbotImg === "string" ? simpleChatbotImg : simpleChatbotImg.src;

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    const trigger = () => {
      setHasInteracted(true);
      window.removeEventListener("scroll", trigger);
      window.removeEventListener("click", trigger);
    };

    window.addEventListener("scroll", trigger);
    window.addEventListener("click", trigger);

    return () => {
      window.removeEventListener("scroll", trigger);
      window.removeEventListener("click", trigger);
    };
  }, []);

  useEffect(() => {
    if (!hasInteracted) return;

    const fetchData = async () => {
      try {
        // Fetch Popup Data
        const popupRes = await fetch(`/api/popup`);
        if (popupRes.ok) {
          const popupData = await popupRes.json();
          if (popupData.is_active) {
            setData(popupData);
          }
        }

        // Fetch Latest Daily Digest
        const digestRes = await fetch(`/api/daily-digests?page=1&limit=1`);
        if (digestRes.ok) {
          const digestResult = await digestRes.json();
          if (digestResult.data && digestResult.data.length > 0) {
            setLatestDigest(digestResult.data[0]);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    setTimeout(fetchData, 1000);
  }, [hasInteracted]);

  useEffect(() => {
    if (data || latestDigest) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [data, latestDigest]);

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!api || isHovered) return;
    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [api, isHovered]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleRedirect = () => {
    if (data?.button_link) {
      setIsOpen(false);
      window.location.href = data.button_link;
    }
  };

  if (!data && !latestDigest) return null;

  const totalSlides = (data ? 1 : 0) + (latestDigest ? 1 : 0) + 1;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 overflow-y-auto ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
    >
      <div
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ background: "linear-gradient(135deg, #001a33 0%, #002a52 40%, #0052a3 100%)" }}
        className={`relative w-[90%] max-w-[380px] rounded-3xl overflow-y-auto shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-white/10 max-h-[90vh] transition-all duration-300 ${isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-[50] p-2 bg-white/70 hover:bg-white rounded-full transition-colors shadow-sm"
        >
          <X className="h-5 w-5 text-gray-800" />
        </button>

        <Carousel setApi={setApi} className="w-full">
          <CarouselContent className="-ml-0">

            {data && (
              <CarouselItem className="pl-0">
                <div className="flex flex-col h-full">
                  <div
                    onClick={handleRedirect}
                    className="relative w-full aspect-[4/5] flex items-center justify-center cursor-pointer overflow-hidden"
                  >
                    {data.image_url ? (
                      <img
                        src={getImageUrl(data.image_url)}
                        alt={data.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-lg font-bold">{data.title}</span>
                      </div>
                    )}

                    <div className="absolute top-4 left-4">
                      <Ribbon
                        fontSize="13px"
                        cutout="0.5em"
                        color="linear-gradient(135deg, #f59e0b, #d97706)"
                        className="inline-flex items-center text-white font-black uppercase tracking-wider shadow-sm"
                      >
                        New Release
                      </Ribbon>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                      <h3 className="text-white text-lg font-bold line-clamp-1">
                        {data.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="text-sm text-slate-300 line-clamp-3">
                      {data.description.split("\n").map((line, i) => (
                        <p key={i} className={i > 0 ? "mt-2" : ""}>
                          {line}
                        </p>
                      ))}
                    </div>

                    <div className="bg-white/5 p-4 rounded-2xl space-y-2 border border-white/10 backdrop-blur-sm">
                      <div className="flex gap-2 items-center">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <p className="text-xs font-medium text-slate-200">Premium research insights</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <p className="text-xs font-medium text-slate-200">Exclusive IPO analysis</p>
                      </div>
                    </div>

                    <Button className="w-full h-12 rounded-xl font-bold text-base shadow-lg bg-[#f97316] hover:bg-[#f97316] text-white border-none" onClick={handleRedirect}>
                      {data.button_text || "Read More"}
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            )}

            {/* Slide 2: Latest Daily Digest */}
            {latestDigest && (
              <CarouselItem className="pl-0">
                <div className="flex flex-col h-full">
                  <div
                    className="relative w-full aspect-[4/5] flex items-center justify-center overflow-hidden"
                  >
                    {latestDigest.image ? (
                      <img
                        src={getImageUrl(latestDigest.image)}
                        alt={latestDigest.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                        <Newspaper className="h-16 w-16 text-white/20 mb-4" />
                        <span className="text-white font-bold">{latestDigest.title}</span>
                      </div>
                    )}

                    <div className="absolute top-4 left-4">
                      <Ribbon
                        fontSize="13px"
                        cutout="0.5em"
                        color="linear-gradient(135deg, #3b82f6, #1d4ed8)"
                        className="inline-flex items-center text-white font-black uppercase tracking-wider shadow-sm"
                      >
                        Daily Digest
                      </Ribbon>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 pt-16">
                      <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Latest Market Report</p>
                      <h3 className="text-white text-xl font-black leading-tight line-clamp-2">
                        {latestDigest.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col justify-between flex-1 space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="text-[10px] font-bold uppercase tracking-widest">Published On</span>
                        <div className="h-[1px] flex-1 bg-white/10" />
                        <span className="text-xs font-black text-white">
                          {new Date(latestDigest.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        Get your daily market summary and professional IPO analysis delivered straight to your fingertips. Stay ahead of the curve with our expert insights.
                      </p>
                    </div>

                    <Button
                      className="w-full h-12 rounded-xl font-black text-base shadow-lg bg-[#f97316] hover:bg-[#f97316] text-white border-none flex items-center justify-center gap-2"
                      onClick={() => {
                        if (latestDigest.linked_blog_slug != null) {
                          window.location.href = "/daily-reporter/" + latestDigest.linked_blog_slug;
                        } else {
                          window.open(getImageUrl(latestDigest.pdf), "_blank")
                        }
                      }}
                    >
                      View Report <ArrowRight className="h-4 w-4 " />
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            )}

            {/* Slide 3: Jigyasa AI Chatbot */}
            <CarouselItem className="pl-0">
              <div className="flex flex-col h-full">
                <div className="relative w-full aspect-[4/5] flex items-center justify-center overflow-hidden">
                  <img
                    src={chatbotImgSrc}
                    alt="Jigyasa AI Chatbot"
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute top-4 left-4">
                    <Ribbon
                      fontSize="13px"
                      cutout="0.5em"
                      color="linear-gradient(135deg, #0f766e, #059669)"
                      className="inline-flex items-center text-white font-black uppercase tracking-wider shadow-sm"
                    >
                      Jigyasa AI
                    </Ribbon>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 pt-16">
                    <p className="text-teal-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                      India's First IPO AI
                    </p>
                    <h3 className="text-white text-xl font-black leading-tight line-clamp-2">
                      Chat with Jigyasa
                    </h3>
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-between flex-1 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-[10px] font-bold uppercase tracking-widest">AI Assistant</span>
                      <div className="h-[1px] flex-1 bg-white/10" />
                      <span className="text-xs font-black text-white">Online</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Get instant AI-powered answers on IPOs, SME & Mainboard Listings, Valuation, Fundraising, Compliance and Market Insights.
                    </p>
                  </div>

                  <Button
                    className="w-full h-12 rounded-xl font-black text-base shadow-lg bg-[#0f766e] hover:bg-[#0d645d] text-white border-none flex items-center justify-center gap-2"
                    onClick={() => {
                      setIsOpen(false);
                      window.open("https://indiaipo.ai/chats", "_blank", "noopener,noreferrer");
                    }}
                  >
                    Start Chat <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          {totalSlides > 1 && (
            <>
              <button
                onClick={() => api?.scrollPrev()}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all z-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => api?.scrollNext()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all z-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </Carousel>
      </div>
    </div>
  );
};

export default SitePopup;
