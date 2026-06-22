import React from "react";
import { Users, ShieldCheck } from "lucide-react";

export default function EditorialTeamInfo() {
  return (
    <div className="mt-8 rounded-[2rem] p-6 md:p-8 border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50/80 backdrop-blur-sm shadow-sm hover:shadow-md overflow-hidden relative transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-50/30 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-5">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 shadow-inner">
          <Users className="w-6 h-6" />
        </div>
        
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
              Published By
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-slate-200" />
            <div className="flex items-center gap-1 text-slate-800 font-extrabold text-sm tracking-wide">
              <span>India IPO Editorial Team</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            </div>
          </div>

          <p className="text-slate-600 text-sm md:text-[14.5px] leading-relaxed font-medium">
            The India IPO Publication is managed by an editorial team that includes highly experienced finance journalists, market researchers and professionals from the capital markets industry who strive to create high-quality content based on credible sources. Our editors write about IPOs, capital markets, corporate news, capital-raising strategies, regulations and other business matters to ensure our audience stays updated with the latest information. We conduct detailed research and fact-check all information before publishing any content to ensure credibility.
          </p>
        </div>
      </div>
    </div>
  );
}
