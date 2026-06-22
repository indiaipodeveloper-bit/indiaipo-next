"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Info, 
  CheckCircle, 
  UserPlus, 
  ClipboardList, 
  Users, 
  Briefcase, 
  ShieldCheck,
  ChevronRight
} from "lucide-react";

const sseLinks = [
  { 
    title: "SSE Introduction", 
    path: "/social-stock-exchange/sse-introduction",
    icon: Info 
  },
  { 
    title: "Eligibility Criteria", 
    path: "/social-stock-exchange/eligibility-criteria-to-qualify-social-enterprise",
    icon: CheckCircle
  },
  { 
    title: "Registration of NPO", 
    path: "/social-stock-exchange/registration-of-npo-on-sse",
    icon: UserPlus
  },
  { 
    title: "Listing Process of ZCZP", 
    path: "/social-stock-exchange/listing-process-of-zczp-on-sse",
    icon: ClipboardList
  },
  { 
    title: "Listed & Registered NPOs", 
    path: "/social-stock-exchange/listed-npos-and-registered-npos",
    icon: Users
  },
  { 
    title: "Intermediaries Involved", 
    path: "/social-stock-exchange/intermediaries-involved-in-the-listing-of-zczp",
    icon: Briefcase
  },
  { 
    title: "Post Listing Requirements", 
    path: "/social-stock-exchange/post-listing-requirements-for-npo",
    icon: ShieldCheck
  }
];

const SSESidebar = () => {
  const pathname = usePathname();

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-32">
      <h3 className="text-xl font-black text-[#001529] mb-6 flex items-center gap-2">
        <span className="w-2 h-8 bg-[#f59e08] rounded-full"></span>
        Chapters For SSE
      </h3>
      <div className="flex flex-col gap-2">
        {sseLinks.map((link, idx) => {
          const isActive = pathname === link.path;
          const Icon = link.icon;
          return (
            <Link
              key={idx}
              href={link.path}
              className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 ${
                isActive
                  ? "bg-[#001529] border-[#001529] text-white shadow-lg shadow-blue-900/10"
                  : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-white hover:border-[#f59e08] hover:text-[#001529]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${
                  isActive ? "bg-white/10" : "bg-white group-hover:bg-[#fff7ed]"
                }`}>
                  <Icon className={`h-4 w-4 ${isActive ? "text-[#f59e08]" : "text-slate-400 group-hover:text-[#f59e08]"}`} />
                </div>
                <span className="text-[13.5px] font-bold leading-tight">{link.title}</span>
              </div>
              <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${
                isActive ? "text-[#f59e08] translate-x-1" : "text-slate-300 group-hover:text-[#f59e08] group-hover:translate-x-1"
              }`} />
            </Link>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-gradient-to-br from-[#001529] to-[#003366] rounded-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <ShieldCheck className="h-16 w-16" />
        </div>
        <p className="text-xs font-medium text-blue-200 mb-1">Expert Assistance</p>
        <p className="text-sm font-bold mb-3">Need help with SSE Registration?</p>
        <Link 
          href="/contact" 
          className="inline-block w-full py-2 bg-[#f59e08] hover:bg-[#d97706] text-[#001529] text-center rounded-lg text-xs font-black transition-colors"
        >
          GET FREE CONSULTATION
        </Link>
      </div>
    </div>
  );
};

export default SSESidebar;
