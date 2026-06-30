"use client";

import { useState, useEffect, useCallback } from "react";
import { getImgSrc } from "@/utils/image";
import {
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import Ribbon from "@/components/Ribbon";
import type { Banner } from "./Hero";
import { AnimatePresence, motion } from "motion/react";

interface Props {
  banners: Banner[];
}

export default function HeroCarousel({ banners }: Props) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const banner = banners[current];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 1,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 1,
    }),
  };

  const next = useCallback(() => {
    if (banners.length <= 1) return;

    setDirection(1);
    setCurrent((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    if (banners.length <= 1) return;

    setDirection(-1);
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(next, 7000);

    return () => clearInterval(timer);
  }, [next, banners.length]);

  if (!banner) {
    return (
      <section className="relative overflow-hidden flex items-center bg-slate-950 aspect-[215/225] md:aspect-auto md:min-h-[720px]">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-slate-900" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden flex items-center bg-slate-950 aspect-[215/225] md:aspect-auto md:min-h-[720px]">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={banner.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: {
              duration: 0.7,
              ease: [0.32, 0.72, 0, 1],
            },
          }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 z-0 overflow-hidden">
            {banner.video_url ? (
              <video
                src={getImgSrc(banner.video_url) || ""}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster={getImgSrc(banner.image_url) || ""}
                className="w-full h-full object-cover"
              />
            ) : (
              <picture className="w-full h-full">
                {banner.mobile_image_url && (
                  <source
                    media="(max-width:767px)"
                    srcSet={getImgSrc(banner.mobile_image_url) || ""}
                  />
                )}

                <img
                  src={getImgSrc(banner.image_url) || ""}
                  alt={banner.title || ""}
                  className="w-full h-full object-cover"
                />
              </picture>
            )}

            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="relative z-10 container mx-auto px-4 py-8 md:py-32 w-full h-full flex flex-col justify-center">
            <div className="max-w-3xl">
              {banner.badge_text && (
                <div className="mb-6">
                  <Ribbon
                    fontSize="12px"
                    cutout="0.5em"
                    color="rgba(59,130,246,.25)"
                    className="inline-flex items-center gap-2 text-blue-300 font-bold border border-blue-500/30"
                  >
                    <ShieldCheck className="h-4 w-4 text-blue-300" />
                    {banner.badge_text}
                  </Ribbon>
                </div>
              )}

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-3 md:mb-6">
                {banner.title}
              </h1>

              <p className="text-lg md:text-3xl text-white leading-relaxed mb-5 md:mb-10 max-w-lg">
                {banner.subtitle}
              </p>

              <div className="flex flex-wrap gap-2 md:gap-4">
                {banner.cta_text && (
                  <Link
                    href={banner.cta_link || "/all-ipos"}
                    className="px-5 py-2.5 md:px-8 md:py-4 bg-orange-600 text-white rounded-lg md:rounded-xl font-bold text-sm md:text-lg shadow-lg hover:bg-orange-700 hover:shadow-orange-900/20 transition-colors flex items-center gap-2 active:scale-95"
                  >
                    {banner.cta_text}
                    <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                  </Link>
                )}

                {banner.cta2_text && (
                  <Link
                    href={banner.cta2_link || "/all-ipos"}
                    className="px-5 py-2.5 md:px-8 md:py-4 bg-[#008cbf] text-blue-100 rounded-lg md:rounded-xl font-bold text-sm md:text-lg shadow-lg hover:opacity-90 transition-colors active:scale-95"
                  >
                    {banner.cta2_text}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {banners.length > 1 && (
        <div className="absolute bottom-4 md:bottom-10 left-4 md:left-8 z-20 flex gap-2 md:gap-4">
          <button
            type="button"
            aria-label="Previous banner"
            onClick={prev}
            className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/10 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
          </button>

          <button
            type="button"
            aria-label="Next banner"
            onClick={next}
            className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/10 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
          </button>
        </div>
      )}
    </section>
  );
}
