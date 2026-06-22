"use client";

import React from "react";
import Link from "next/link";
import ServicePageLayout from "@/components/ServicePageLayout";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Phone,
  Mail,
  Home,
  Shield,
  Clock,
  Users,
  Star,
  Award,
  Zap,
  Target,
  Wallet,
  ChevronDown,
  ChevronUp,
  BookOpen,
  FileText,
  TrendingUp,
  MessageSquare,
  Building2,
  Globe,
  BarChart3,
  LayoutDashboard,
  AreaChart,
  ShieldCheck,
  Lock,
  UserCheck,
  Scale,
  HeartPulse,
  Calendar,
  Coins,
  Landmark,
} from "lucide-react";

const SocialStockExchangeClient = () => {
  const slug = "social-stock-exchange";
  const cfg = { accent: "#f59e08" };

  return (
    <ServicePageLayout slug={slug}>
      <div className="w-full space-y-10">
        <div className="space-y-6">
          {[
            {
              t: "Overview of Social Stock Exchange (SSE)",
              d: "The Social Stock Exchange (SSE) segment on the NSE & BSE is changing the way social enterprises can raise funds from the public to maximize their impact.",
              c: "bg-orange-50 border-orange-100",
              link: "/social-stock-exchange/sse-introduction",
            },
            {
              t: "Social Enterprise Eligibility Framework",
              d: "To be officially recognized as a Social Enterprise on the Social Stock Exchange, an organization must meet SE eligibility set by exchanges.",
              c: "bg-green-50 border-green-100",
              link: "/social-stock-exchange/eligibility-criteria-to-qualify-social-enterprise",
            },
            {
              t: "How NPOs Register on the Social Stock Exchange",
              d: "All Not-for-Profit (NPOs) require a formal registration with the SSE platform hosted by Indian stock exchanges like NSE and BSE",
              c: "bg-orange-50 border-orange-100",
              link: "/social-stock-exchange/registration-of-npo-on-sse",
            },
            {
              t: "ZCZP Listing Process on SSE",
              d: "Zero Coupon Zero Principal instrument is among the innovative securities that have been introduced by the SSE framework of SEBI in India",
              c: "bg-green-50 border-green-100",
              link: "/social-stock-exchange/listing-process-of-zczp-on-sse",
            },
            {
              t: "Registered and Listed NPOs on BSE SSE and NSE SSE",
              d: "Several NPOs are registered on the SSE platforms of BSE and NSE to showcase their governance, transparency and impact metrics.",
              c: "bg-orange-50 border-orange-100",
              link: "/social-stock-exchange/listed-npos-and-registered-npos",
            },
            {
              t: "Key Intermediaries in SSE Listings",
              d: "For listing ZCZPs on the Social Stock Exchange (SSE) framework, several intermediaries are involved to ensure regulatory compliance, transparency and smooth operations.",
              c: "bg-green-50 border-green-100",
              link: "/social-stock-exchange/intermediaries-involved-in-the-listing-of-zczp",
            },
            {
              t: "Post-Listing Compliance for NPOs",
              d: "Non-profit organizations (NPOs) have to comply with the post listing regulations after listing their instruments on SSE",
              c: "bg-orange-50 border-orange-100",
              link: "/social-stock-exchange/post-listing-requirements-for-npo",
            },
          ].map((item, idx) => (
            <Link href={item.link}
              key={idx}
              id={
                [
                  "sse-overview",
                  "eligibility",
                  "registration",
                  "zczp",
                  "npos",
                  "intermediaries",
                  "compliance",
                ][idx]
              }
              className={`block ${item.c} border p-8 rounded-3xl space-y-3 relative overflow-hidden group hover:shadow-md transition-shadow scroll-mt-24`}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-green-600 shadow-sm">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <h4 className="font-black text-[#001529] text-lg group-hover:text-[#f59e08] transition-colors">
                  {item.t}
                </h4>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed font-medium pl-9">
                {item.d}
              </p>
            </Link>
          ))}
        </div>

        <div className="bg-[#001529] p-10 md:p-14 rounded-[3rem] text-white space-y-6 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, #f59e08 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl font-black">
              Is Your Organization Ready for SSE?
            </h3>
            <p className="text-white/60 text-xs font-semibold leading-relaxed max-w-xl">
              We guide NGOs, Societies, and Trusts through the
              complexities of registration and ZCZP issuance.
              Access capital that matches your impact goals.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                className="bg-[#f59e08] hover:bg-[#d97706] text-[#001529] font-black h-12 rounded-xl px-8"
              >
                <Link href="/contact">
                  Schedule Eligibility Sync
                </Link>
              </Button>
              <div className="flex items-center gap-3 px-6 py-2 bg-white/5 rounded-xl border border-white/10">
                <Phone className="h-4 w-4 text-[#f59e08]" />
                <span className="text-xs font-black">
                  +91-74283-37280
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ServicePageLayout>
  );
};

export default SocialStockExchangeClient;
