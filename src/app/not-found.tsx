"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  ArrowLeft,
  Search,
  TrendingUp,
  BarChart2,
  Activity,
} from "lucide-react";

import notFoundImg from "@/assets/404_illustration1.webp";

const quickLinks = [
  {
    label: "IPO Calendar",
    href: "/all-ipos",
    icon: <BarChart2 className="h-4 w-4" />,
  },
  {
    label: "IPO Blogs",
    href: "/ipo-blogs",
    icon: <Activity className="h-4 w-4" />,
  },
  // {
  //   label: "Market Insights",
  //   href: "/ipo-knowledge",
  //   icon: <TrendingUp className="h-4 w-4" />,
  // },
];

export default function NotFound() {
  const pathname = usePathname();
  const [dots, setDots] = useState(".");

  useEffect(() => {
    console.error("404:", pathname);
  }, [pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-4 py-16">
      {/* Background */}
      <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-amber-700/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-blue-800/15 blur-3xl" />

      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px),linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-700/30 bg-amber-700/20 px-4 py-1.5 text-xs font-bold text-amber-400"
        >
          <Search className="h-3.5 w-3.5" />
          Page Not Found
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="bg-clip-text text-[120px] font-extrabold leading-none tracking-tighter text-transparent md:text-[180px]"
          style={{
            backgroundImage:
              "linear-gradient(135deg,#f59e0b 0%,#d97706 30%,#e2e8f0 60%,#94a3b8 100%)",
          }}
        >
          404
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mx-auto my-2 max-w-md"
        >
          <motion.img
            src={notFoundImg.src}
            alt="404 Illustration"
            className="max-h-64 w-full object-contain drop-shadow-2xl"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="absolute bottom-0 left-1/2 h-8 w-3/4 -translate-x-1/2 rounded-full bg-amber-600/20 blur-2xl" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto mb-2 max-w-lg text-lg text-slate-400 md:text-xl"
        >
          Oops! The page you're looking for doesn't exist or has been moved.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-10 font-mono text-sm text-slate-600"
        >
          Searching for{" "}
          <span className="font-bold text-amber-500">
            {pathname}
          </span>
          {dots}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-14 flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-700 px-8 py-4 font-bold text-white shadow-lg shadow-amber-900/30 transition hover:bg-amber-600"
          >
            <Home className="h-5 w-5" />
            Return Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-bold text-slate-300 backdrop-blur-sm transition hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
        </motion.div>

        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
            Or explore these sections
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/60 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-700/80 hover:text-white"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
