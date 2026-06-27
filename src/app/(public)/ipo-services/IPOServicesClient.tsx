"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import {
  Building2,
  TrendingUp,
  BarChart3,
  Wallet,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Shield,
  Clock,
  Users,
  Star,
  Target,
  Zap,
  Home,
  FileText,
  Award,
  BookOpen,
  Globe,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/utils";
import LatestNews from "@/components/home/LatestNews";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: "easeOut" },
  }),
};

const useCountUp = (target: number, duration = 2500) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function: easeOutExpo
            const eased = 1 - Math.pow(2, -10 * progress);

            setCount(Math.floor(eased * target));

            if (progress < 1) requestAnimationFrame(animate);
          };

          animate();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
};

const CountingNumber = ({
  target,
  prefix = "",
  suffix = "",
}: {
  target: number;
  prefix?: string;
  suffix?: string;
}) => {
  const { count, ref } = useCountUp(target);
  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
};

const defaultStats = [
  {
    target: 141,
    prefix: "",
    suffix: "+",
    label: "IPOs Advised",
    icon: TrendingUp,
  },
  {
    target: 10,
    prefix: "",
    suffix: "K+",
    label: "Consultancies",
    icon: IndianRupee,
  },
  {
    target: 9,
    prefix: "",
    suffix: "+",
    label: "Years Experience",
    icon: Award,
  },
  {
    target: 98,
    prefix: "",
    suffix: "%",
    label: "Success Rate",
    icon: Star,
  },
];

const defaultComparison = [
  {
    label: "Company Stage",
    values: [
      "Growth-stage / Pre-IPO companies",
      "Established companies",
      "Growing SMEs",
      "Established companies",
      "Listed company",
    ],
  },
  {
    label: "Exchange / Platform",
    values: [
      "Unlisted / Private Markets",
      "NSE / BSE Mainboard",
      "BSE SME / NSE Emerge",
      "NSE / BSE Mainboard",
      "NSE / BSE Mainboard",
    ],
  },
  {
    label: "Min. Issue Size",
    values: [
      "Deal-specific (no fixed minimum)",
      "₹50 Cr+",
      "₹10–25 Cr (typical)",
      "₹50 Cr+",
      "Market-driven",
    ],
  },
  {
    label: "Typical Timeline",
    values: [
      "2–6 months",
      "12–24 months",
      "4–6 months",
      "12–24 months",
      "2–4 months",
    ],
  },
  {
    label: "Filing Required",
    values: [
      "✗ No",
      "✓ Yes (DRHP)",
      "✓ Yes (DRHP)",
      "✓ Yes (DRHP)",
      "✓ Yes (Offer Document)",
    ],
  },
  {
    label: "Institutional Investors",
    values: [
      "Select / Case-by-case",
      "Strong (FIIs, Mutual Funds)",
      "Limited participation",
      "Strong (FIIs, Mutual Funds)",
      "✓ Yes",
    ],
  },
  {
    label: "Promoter Lock-in",
    values: [
      "Not applicable",
      "As per SEBI ICDR regulations",
      "As per SEBI norms",
      "As per SEBI ICDR regulations",
      "Not applicable",
    ],
  },
  {
    label: "Complexity",
    values: ["Low–Moderate", "High", "Low–Moderate", "High", "Moderate"],
  },
  {
    label: "Best Suited For",
    values: [
      "Pre-listing capital & strategic investors",
      "Large-scale capital raising",
      "SMEs scaling operations",
      "Large-scale capital raising",
      "Already listed companies",
    ],
  },
];

const services = [
  {
    id: "pre-ipo-consultant",
    badge: "Pre-Listing",
    title: "Pre-IPO Advisory",
    shortTitle: "Pre-IPO",
    icon: Wallet,
    color: "#1a56db",
    bgClass: "bg-[#001529]",
    tagline: "Unlock capital before your IPO launch",
    description:
      "Pre-IPO funding allows companies to raise capital from institutional investors, HNIs, family offices, and strategic partners before listing publicly. We help you discover optimal pre-IPO valuation, structure the round efficiently, and bring on board investors who add both capital and strategic value.",
    eligibility: [
      {
        criteria: "Company Stage",
        requirement: "Growth-stage or Pre-IPO ready",
      },
      {
        criteria: "Revenue",
        requirement: "Consistent revenue model preferred",
      },
      { criteria: "IPO Intent", requirement: "Clear 12–36 month IPO timeline" },
      {
        criteria: "Investor Type",
        requirement: "PE, VC, HNI, Family Offices, Angels",
      },
      { criteria: "Instrument", requirement: "Equity, CCD, CCPS, or Warrants" },
      {
        criteria: "Compliance",
        requirement: "As per Companies Act 2013 & FEMA",
      },
    ],
    process: [
      {
        step: 1,
        title: "Company Profiling",
        desc: "Deep-dive into business model & financials",
      },
      {
        step: 2,
        title: "Valuation Discovery",
        desc: "Pre-IPO valuation benchmarking",
      },
      {
        step: 3,
        title: "Investor Identification",
        desc: "Target investor pool mapping",
      },
      {
        step: 4,
        title: "Pitch Deck & Data Room",
        desc: "Investment material preparation",
      },
      {
        step: 5,
        title: "Term Sheet & Negotiation",
        desc: "Deal structure & term negotiation",
      },
      {
        step: 6,
        title: "Due Diligence & Closure",
        desc: "Legal/financial DD & investment closure",
      },
    ],
    benefits: [
      "Early capital without public market pressure",
      "Strategic investor alignment",
      "Valuation benchmarking before IPO",
      "Strengthens IPO prospectus narrative",
      "Reduces dependence on IPO market window",
      "Flexible instrument structuring",
    ],
    timeline: "2–6 months",
    minInvestment: "Investor-specific (₹25 Lakh+)",
  },
  {
    id: "ipo",
    badge: "Most Popular",
    title: "Initial Public Offering (IPO)",
    shortTitle: "IPO",
    icon: TrendingUp,
    color: "#1a56db",
    bgClass: "bg-[#001529]",
    tagline: "List your company on NSE/BSE Mainboard",
    description:
      "An IPO is the process by which a private company offers shares to the public for the first time to raise capital. Our end-to-end advisory covers every critical milestone — from Eligibility to post-listing compliance — ensuring a seamless, SEBI-compliant public offering.",
    eligibility: [
      {
        criteria: "Eligibility Norms",
        requirement: "As per SEBI ICDR regulations",
      },
      {
        criteria: "Track Record",
        requirement:
          "Profitability or alternative eligibility routes (QIB route)",
      },
      {
        criteria: "Issue Size",
        requirement: "Varies by Mainboard or SME platform",
      },
      {
        criteria: "Exchange",
        requirement: "NSE / BSE Mainboard or SME platforms",
      },
      { criteria: "DRHP Filing", requirement: "Mandatory with SEBI" },
      {
        criteria: "Promoter Lock-in",
        requirement: "As per applicable SEBI norms",
      },
    ],
    process: [
      {
        step: 1,
        title: "Eligibility Study",
        desc: "Capital needs & IPO readiness assessment",
      },
      {
        step: 2,
        title: "DRHP Preparation",
        desc: "Draft Red Herring Prospectus with all disclosures",
      },
      {
        step: 3,
        title: "SEBI Filing & Review",
        desc: "Regulatory approval & observation letter",
      },
      {
        step: 4,
        title: "Roadshows",
        desc: "Institutional & HNI investor outreach",
      },
      {
        step: 5,
        title: "Book Building",
        desc: "Price discovery via bidding mechanism",
      },
      {
        step: 6,
        title: "Allotment & Listing",
        desc: "Basis of allotment & stock exchange listing",
      },
    ],
    benefits: [
      "Access to broad capital markets",
      "Enhanced brand credibility & visibility",
      "Liquidity for existing shareholders",
      "Enables future M&A via stock-based deals",
      "Employee stock option programs (ESOPs)",
      "Improved PE/VC exit opportunities",
    ],
    timeline: "9–18 months",
    minInvestment: "₹10 Cr (Issue Size)",
  },
  {
    id: "sme-ipo-consultant",
    badge: "SME Friendly",
    title: "SME IPO Consultation",
    shortTitle: "SME IPO",
    icon: Building2,
    color: "#f59e08",
    bgClass: "bg-[#f59e08]",
    tagline: "List on BSE SME or NSE Emerge platform",
    description:
      "The SME IPO platform is specifically designed for Small & Medium Enterprises. With relaxed eligibility norms and a streamlined approval process, SME IPO is the fastest way to tap public capital markets, build brand recognition, and enhance your company's growth trajectory.",
    eligibility: [
      { criteria: "Post-Issue Paid-up Capital", requirement: "₹1 Cr – ₹25 Cr" },
      { criteria: "Net Tangible Assets", requirement: "Exchange Dependent" },
      { criteria: "Net Worth", requirement: "Positive Net Worth" },
      { criteria: "Distributable Profits", requirement: "2 of last 3 years" },
      { criteria: "Exchange", requirement: "BSE SME / NSE Emerge" },
      { criteria: "Market Maker", requirement: "Mandatory appointment" },
    ],
    process: [
      {
        step: 1,
        title: "Eligibility Check",
        desc: "Assess financials against platform norms",
      },
      {
        step: 2,
        title: "Due Diligence",
        desc: "Statutory & legal review of company",
      },
      {
        step: 3,
        title: "Banker Coordination",
        desc: "Expert merchant banker appointment",
      },
      {
        step: 4,
        title: "Exchange Filing",
        desc: "BSE SME / NSE Emerge in-principle approval",
      },
      {
        step: 5,
        title: "Marketing & Roadshows",
        desc: "Investor targeting & subscription campaign",
      },
      {
        step: 6,
        title: "Listing Support",
        desc: "Allotment, refunds, and exchange listing",
      },
    ],
    benefits: [
      "Lower listing requirements vs. Mainboard",
      "Faster process — 4 to 6 months",
      "Market maker ensures liquidity",
      "Tax benefits for QIB investors",
      "Stepping stone to Mainboard migration",
      "Enhanced credibility for B2B deals",
    ],
    timeline: "4–6 months",
    minInvestment: "₹1 Cr (Paid-up Capital)",
  },
  {
    id: "mainline-ipo-consultant",
    badge: "Large Scale",
    title: "Mainline IPO Consultation",
    shortTitle: "Mainline IPO",
    icon: Globe,
    color: "#1a56db",
    bgClass: "bg-[#001529]",
    tagline: "Full-scale public listing on NSE/BSE Mainboard",
    description:
      "Mainline IPO is for established companies targeting large-scale capital raising on the NSE or BSE Mainboard. Our team of expert professionals manages the entire lifecycle — from DRHP to post-listing ongoing compliance — with precision and expertise that comes from decades of deal experience.",
    eligibility: [
      {
        criteria: "Net Tangible Assets",
        requirement: "₹3 Cr (in each of last 3 years)",
      },
      {
        criteria: "Distributable Profits",
        requirement:
          "Distributable profits in at least 3 of last 5 years (or QIB route eligibility)",
      },
      {
        criteria: "Net Worth",
        requirement: "Minimum ₹1 Crore (each of 3 years)",
      },
      { criteria: "Issue Size", requirement: "Typically ₹50 Crore+" },
      {
        criteria: "IPO Application Size",
        requirement: "Minimum ₹10,000 per application",
      },
      {
        criteria: "Promoter Lock-in",
        requirement: "18 months for 20% post-issue capital",
      },
    ],
    process: [
      {
        step: 1,
        title: "Valuation & Structuring",
        desc: "Independent valuation & capital structure optimization",
      },
      {
        step: 2,
        title: "DRHP Drafting",
        desc: "Comprehensive SEBI draft prospectus",
      },
      {
        step: 3,
        title: "SEBI Review",
        desc: "SEBI comments, clarifications & observation letter",
      },
      {
        step: 4,
        title: "Exchange Filing",
        desc: "NSE/BSE in-principle listing approval",
      },
      {
        step: 5,
        title: "Institutional Roadshows",
        desc: "FII, DII, MF, and HNI outreach",
      },
      {
        step: 6,
        title: "Book-Building & Listing",
        desc: "Price band, GMP, subscriptions & listing",
      },
    ],
    benefits: [
      "Access to institutional capital (FIIs, mutual funds, institutions)",
      "Deep public market liquidity",
      "Efficient price discovery and valuation benchmarking",
      "Strong national brand visibility and credibility",
      "Equity as currency for ESOPs and strategic acquisitions",
    ],
    timeline: "12–24 months",
    minInvestment: "₹50 Cr+ (Issue Size)",
  },
  {
    id: "ipo-advisory-services",
    badge: "For Listed Cos.",
    title: "Follow-On Public Offer (FPO)",
    shortTitle: "FPO",
    icon: BarChart3,
    color: "#f59e08",
    bgClass: "bg-[#78340a]",
    tagline: "Secondary capital raise for listed companies",
    description:
      "A Follow-On Public Offer (FPO) allows an already-listed company to raise additional equity capital from the public. Whether for expansion, debt reduction, or improving public float, our FPO advisory ensures optimal pricing, regulatory compliance, and maximum subscription success.",
    eligibility: [
      { criteria: "Company Status", requirement: "Must be listed on NSE/BSE" },
      {
        criteria: "Listed History",
        requirement: "Minimum 1 year of listing required",
      },
      {
        criteria: "FPO Type",
        requirement: "Dilutive (fresh issue) or Non-Dilutive (OFS)",
      },
      {
        criteria: "Shareholder Approval",
        requirement: "Ordinary/Special resolution required",
      },
      { criteria: "Pricing", requirement: "As per SEBI ICDR Regulations" },
      { criteria: "SEBI Filing", requirement: "DRHP submission mandatory" },
    ],
    process: [
      {
        step: 1,
        title: "Capital Need Assessment",
        desc: "Determine purpose, size & FPO structure",
      },
      {
        step: 2,
        title: "Board Approvals",
        desc: "Board, shareholder & regulatory approvals",
      },
      {
        step: 3,
        title: "Pricing Strategy",
        desc: "Determine floor price or price band",
      },
      {
        step: 4,
        title: "SEBI Filing",
        desc: "Draft prospectus, SEBI review & approval",
      },
      {
        step: 5,
        title: "Offer Execution",
        desc: "Subscription management & allotment",
      },
      {
        step: 6,
        title: "Post-Issue Compliance",
        desc: "Listing, refunds & compliance filings",
      },
    ],
    benefits: [
      "Efficient secondary capital raise",
      "Improved public float & liquidity",
      "Strengthen balance sheet",
      "Reduce promoter/bank debt",
      "Re-rate company valuation",
      "Non-dilutive OFS option available",
    ],
    timeline: "4–8 months",
    minInvestment: "Already listed company",
  },
];

const whyChooseUs = [
  {
    icon: Shield,
    title: "Expert IPO Advisors",
    desc: "All our merchant bankers & advisors are highly experienced professionals with unimpeachable compliance records.",
  },
  {
    icon: Clock,
    title: "End-to-End Management",
    desc: "From initial Eligibility to post-listing compliance, we manage everything — you focus on running your business.",
  },
  {
    icon: Users,
    title: "Dedicated Deal Team",
    desc: "A dedicated team of senior bankers, legal experts, and CA professionals assigned to your deal from day one.",
  },
  {
    icon: Star,
    title: "Proven Track Record",
    desc: "500+ successful IPOs across SME and Mainboard categories spanning 18+ years and every major industry sector.",
  },
  {
    icon: Target,
    title: "Investor Network",
    desc: "Deep relationships with major institutional investors, mutual funds, HNIs, and retail investor networks across India.",
  },
  {
    icon: Zap,
    title: "Timeline Mastery",
    desc: "Our streamlined process models ensure fastest possible SEBI timelines without compromising regulatory quality.",
  },
];

const faqs = [
  {
    q: "What is the difference between SME IPO and Mainline IPO?",
    a: "SME IPO is for companies with post-issue paid-up capital between ₹1–25 Cr, listed on BSE SME or NSE Emerge. Mainline IPO is for larger companies listing on NSE/BSE main board with higher eligibility requirements and larger issue sizes.",
  },
  {
    q: "How long does the entire IPO process take?",
    a: "SME IPO typically takes 4–6 months. A Mainline IPO usually takes 9–18 months from start to listing. Pre-IPO funding can be completed in 2–6 months depending on investor readiness.",
  },
  {
    q: "What are the typical costs involved in an IPO?",
    a: "IPO costs include merchant banker fees (1–2% of issue size), legal fees, registrar charges, stock exchange fees, SEBI filing fees, advertising, and roadshow expenses. We provide a detailed cost breakdown specific to your company.",
  },
  {
    q: "Can an SME company later migrate to the Mainboard?",
    a: "Yes. After at least 2 years of listing on BSE SME or NSE Emerge, companies meeting Mainboard eligibility criteria can migrate through a simplified process without another public offering.",
  },
  {
    q: "What is a Follow-On Public Offer (FPO)?",
    a: "An FPO is a mechanism for an already-listed company to issue additional shares to the public. It can be dilutive (fresh issue) or non-dilutive (Offer for Sale by existing shareholders).",
  },
  {
    q: "Why do companies opt for Pre-IPO funding?",
    a: "Pre-IPO funding helps companies raise capital at favorable valuations before listing, bring in strategic investors, strengthen their balance sheet, and build a credible investor base that supports the IPO narrative.",
  },
];

const StatCard = ({ target, prefix, suffix, label, icon: Icon, index }: any) => (
  <motion.div
    custom={index}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={fadeUp}
    className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6 text-center group hover:bg-white/15 transition-all"
  >
    <div className="w-12 h-12 rounded-xl bg-[#f59e08]/20 flex items-center justify-center mx-auto mb-3">
      <Icon className="h-6 w-6 text-[#f59e08]" />
    </div>
    <div className="text-3xl font-black text-white mb-1">
      <CountingNumber target={target} prefix={prefix} suffix={suffix} />
    </div>
    <div className="text-white/60 text-sm font-semibold">{label}</div>
  </motion.div>
);

const ServiceSection = ({ svc, index }: { svc: typeof services[0]; index: number }) => {
  const Icon = svc.icon;

  return (
    <motion.section
      id={svc.id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      className="scroll-mt-44 md:scroll-mt-52"
    >
      <div className="mb-8 border-b border-slate-100 pb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${svc.color}15`, color: svc.color }}
          >
            <Icon className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-2">{svc.title}</h2>
            <p className="text-slate-500 text-base font-medium">{svc.tagline}</p>
          </div>
        </div>
      </div>

      <p className="text-slate-600 text-base leading-relaxed mb-10 max-w-4xl font-medium">{svc.description}</p>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div
            className="px-6 py-4 border-b border-slate-100 flex items-center gap-3"
            style={{ background: svc.color + "08" }}
          >
            <FileText className="h-5 w-5" style={{ color: svc.color }} />
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Eligibility Criteria</h3>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {svc.eligibility.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-slate-50 last:border-0 ${i % 2 === 0 ? "bg-slate-50/40" : "bg-white"}`}
                >
                  <td className="px-5 py-3.5 font-bold text-slate-700 w-2/5 align-top">{row.criteria}</td>
                  <td className="px-5 py-3.5 text-slate-500 font-medium">{row.requirement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div
            className="px-6 py-4 border-b border-slate-100 flex items-center gap-3"
            style={{ background: svc.color + "08" }}
          >
            <BookOpen className="h-5 w-5" style={{ color: svc.color }} />
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Step-by-Step Process</h3>
          </div>
          <div className="p-5 space-y-4">
            {svc.process.map((p, i) => (
              <div key={i} className="flex items-start gap-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 mt-0.5"
                  style={{ background: svc.color }}
                >
                  {p.step}
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">{p.title}</div>
                  <div className="text-slate-500 text-xs mt-0.5 leading-relaxed">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div
            className="px-6 py-4 border-b border-slate-100 flex items-center gap-3"
            style={{ background: svc.color + "08" }}
          >
            <CheckCircle className="h-5 w-5" style={{ color: svc.color }} />
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Key Benefits</h3>
          </div>
          <div className="p-5 space-y-3">
            {svc.benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: svc.color + "20" }}
                >
                  <CheckCircle className="h-3 w-3" style={{ color: svc.color }} />
                </div>
                <span className="text-sm text-slate-600 font-medium leading-snug">{b}</span>
              </div>
            ))}
          </div>
          <div className="px-5 pb-5">
            <Button
              className="w-full font-bold text-white rounded-xl mt-2"
              style={{ background: svc.color }}
              asChild
            >
              <Link href="/contact">
                Schedule Free Consultation <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="lg:hidden flex gap-4 mb-6">
        <div className="flex-1 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
          <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Timeline</div>
          <div className="text-lg font-black text-slate-800">{svc.timeline}</div>
        </div>
        <div className="flex-1 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
          <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Min. Requirement</div>
          <div className="text-sm font-bold text-slate-800">{svc.minInvestment}</div>
        </div>
      </div>
    </motion.section>
  );
};

const FAQItem = ({ faq, index }: { faq: typeof faqs[0]; index: number }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="border border-slate-200 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors gap-4"
      >
        <span className="font-bold text-slate-800 text-sm leading-snug">{faq.q}</span>
        {open ? (
          <ChevronUp className="h-5 w-5 text-[#1a56db] shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
          {faq.a}
        </div>
      )}
    </motion.div>
  );
};

export default function IPOServicesClient() {
  const [activeTab, setActiveTab] = useState(services[0].id);
  const [comparisonData, setComparisonData] = useState<any[]>(defaultComparison);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [bannerVideo, setBannerVideo] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current && window.innerWidth < 768) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        let nextScroll = scrollLeft + clientWidth;
        if (scrollLeft >= maxScroll - 10) nextScroll = 0;
        scrollRef.current.scrollTo({ left: nextScroll, behavior: "smooth" });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const catRes = await fetch("/api/knowledge/categories");
        if (catRes.ok) {
          const categories = await catRes.json();
          const comparisonCat = categories.find((c: any) => c.slug === "service-comparison");

          if (comparisonCat) {
            const itemsRes = await fetch(`/api/knowledge/items?category_id=${comparisonCat.id}`);
            if (itemsRes.ok) {
              const items = await itemsRes.json();
              if (items && items.length > 0) {
                const mapped = items.map((item: any) => ({
                  label: item.title,
                  values: [item.col5, item.col1, item.col2, item.col3, item.col4].filter(Boolean),
                }));
                setComparisonData(mapped);
              }
            }
          }
        }

        const bannerRes = await fetch(`/api/banners?page=${encodeURIComponent(pathname || "")}`);
        if (bannerRes.ok) {
          const bannerData = await bannerRes.json();
          const activeBanner = bannerData.find((b: any) => b.video_url || b.image_url);
          if (activeBanner) {
            if (activeBanner.video_url) setBannerVideo(activeBanner.video_url);
            if (activeBanner.image_url) setBannerImage(activeBanner.image_url);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main>
        <section className="bg-[#001529] pt-16 pb-20 relative overflow-hidden">
          {bannerVideo ? (
            <div className="absolute inset-0 z-0">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                src={getImageUrl(bannerVideo)}
              />
              <div className="absolute inset-0 bg-[#001529] opacity-80 mix-blend-multiply" />
            </div>
          ) : bannerImage ? (
            <div className="absolute inset-0 z-0">
              <div
                className="w-full h-full bg-cover bg-center opacity-40 mix-blend-overlay"
                style={{ backgroundImage: `url(${getImageUrl(bannerImage)})` }}
              />
              <div className="absolute inset-0 bg-[#001529] opacity-80 mix-blend-multiply" />
            </div>
          ) : (
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none z-0">
              <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-[#f59e08] blur-3xl" />
              <div className="absolute bottom-0 right-1/3 w-72 h-72 rounded-full bg-blue-400 blur-3xl" />
            </div>
          )}

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-8">
              <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
                <Home className="h-3 w-3" /> Home
              </Link>
              <span>/</span>
              <span className="text-white">IPO Services</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight max-w-5xl">
                IPO Advisory for a Strong Listing on the Stock Exchange
              </h1>
              <p className="text-white/60 max-w-2xl text-base md:text-lg font-medium leading-relaxed mb-10">
                From Pre-IPO Funding to Mainboard listing — we provide end-to-end, SEBI-compliant IPO consultation for
                SMEs and large enterprises across all sectors and exchanges in India.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  className="bg-[#f59e08] hover:bg-[#d97706] text-[#001529] font-black rounded-xl px-8 h-12 text-sm shadow-xl shadow-[#f59e08]/20"
                  asChild
                >
                  <Link href="/contact">
                    Get Free Consultation <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outlineWhite" className="rounded-xl px-8 h-12 text-sm font-bold shadow-lg">
                  <Link href="/all-ipos">View Live IPOs</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-[#001529] py-12 -mt-1 border-t border-white/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {defaultStats.map((s, i) => (
                <StatCard key={i} {...s} index={i} />
              ))}
            </div>
          </div>
        </section>

        <section className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3">
              {services.map((svc) => {
                const Icon = svc.icon;
                return (
                  <button
                    key={svc.id}
                    onClick={() => {
                      setActiveTab(svc.id);
                      document.getElementById(svc.id)?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                      activeTab === svc.id
                        ? "bg-[#001529] text-white shadow-md"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {svc.shortTitle}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 border-b border-slate-200">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                <span className="text-[#f59e08]">Quick Comparison</span> — All Services
              </h2>
              <p className="text-slate-500 font-medium">Side-by-side overview to help you choose the right IPO pathway</p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm"
            >
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#001529] text-white">
                    <th className="px-6 py-5 text-left font-bold text-xs uppercase tracking-widest">Parameter</th>
                    {services.map((s) => (
                      <th
                        key={s.id}
                        className="px-6 py-5 text-center font-bold text-xs uppercase tracking-widest whitespace-nowrap"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <s.icon className="h-5 w-5 text-[#f59e08]" />
                          {s.shortTitle}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, ri) => (
                    <tr
                      key={ri}
                      className={`border-b border-slate-100 ${ri % 2 === 0 ? "bg-slate-50/50" : "bg-white"}`}
                    >
                      <td className="px-6 py-4 font-bold text-slate-700 whitespace-nowrap">{row.label}</td>
                      {row.values.map((v: string, vi: number) => (
                        <td
                          key={vi}
                          className={`px-6 py-4 text-center font-medium ${
                            v?.startsWith("✓") ? "text-green-600" : v?.startsWith("✗") ? "text-red-400" : "text-slate-600"
                          }`}
                        >
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 space-y-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-slate-900 text-lg md:text-xl font-extrabold leading-8 max-w-3xl mx-auto">
              Choose the right listing pathway for your company. Each service comes with a dedicated deal team,
              comprehensive documentation support, and 360-degree advisory throughout the process.
            </p>
          </motion.div>

          {services.map((svc, i) => (
            <ServiceSection key={svc.id} svc={svc} index={i} />
          ))}
        </section>

        <section className="py-20 bg-[#F8FAFC]">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center mb-14"
            >
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                Why <span className="text-[#1a56db]">India IPO</span> Advisors?
              </h2>
              <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                Our edge comes from deep domain expertise, a verified professional compliance framework, and a
                relentless focus on client success.
              </p>
            </motion.div>
            <div className="overflow-hidden">
              <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6"
              >
                {whyChooseUs.map((item, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    className="shrink-0 w-[280px] md:w-auto bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group snap-center"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#001529] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <item.icon className="h-7 w-7 text-[#f59e08]" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white border-t border-slate-200">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                Frequently Asked <span className="text-[#f59e08]">Questions</span>
              </h2>
              <p className="text-slate-500 font-medium">Everything you need to know about IPO advisory services in India.</p>
            </motion.div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <FAQItem key={i} faq={faq} index={i} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#001529] py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                Ready to <span className="text-[#f59e08]">Go Public?</span>
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto text-base font-medium mb-10">
                Talk to our expert IPO advisors today. Free initial consultation — no strings attached. We'll assess
                your company's IPO readiness and chart the ideal listing roadmap.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  className="bg-[#f59e08] hover:bg-[#d97706] text-[#001529] font-black rounded-xl px-10 h-14 text-base shadow-2xl shadow-[#f59e08]/30"
                  asChild
                >
                  <Link href="/contact">
                    <Phone className="mr-2 h-5 w-5" /> Talk to an Expert
                  </Link>
                </Button>
                <Button asChild variant="outlineWhite" className="rounded-xl px-10 h-14 text-base font-bold shadow-lg">
                  <a href="mailto:info@indiaipo.in">
                    <Mail className="mr-2 h-5 w-5" /> info@indiaipo.in
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
