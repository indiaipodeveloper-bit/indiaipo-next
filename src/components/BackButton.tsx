"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  className?: string;
  variant?: "light" | "dark";
}

export default function BackButton({ className, variant = "light" }: BackButtonProps) {
  const router = useRouter();
  
  if (variant === "dark") {
    return (
      <button
        onClick={() => router.back()}
        className={className || "inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-[#001529] text-white rounded-xl text-sm font-semibold hover:bg-[#002147] transition-all cursor-pointer"}
      >
        <ArrowLeft className="w-4 h-4" /> Go Back
      </button>
    );
  }

  return (
    <button
      onClick={() => router.back()}
      className={className || "flex items-center gap-2 text-white/60 hover:text-white text-xs font-semibold uppercase tracking-wider mb-6 transition-colors cursor-pointer"}
    >
      <ArrowLeft className="w-3.5 h-3.5" /> Back
    </button>
  );
}
