"use client";

import { useState, useEffect } from "react";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CheckCircle, ArrowRight, Building2, TrendingUp, Shield, BarChart3, PieChart, FileText, ArrowUpRight, Calendar, Sparkles, AlertCircle, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";
import { getImgSrc } from "@/utils/image";
import eligibilityBanner from "@/assets/eligibilty-check banners.webp";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { API_URL } from "@/lib/constants";

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  created_at: string;
}

const isValid = (val: any) => {
  if (val === null || val === undefined) return false;
  const s = String(val).toLowerCase().trim();
  return s !== "null" && s !== "[null]" && s !== "" && s !== "undefined";
};

export default function EligibilityCheckClient() {
  const [formData, setFormData] = useState({
    business_name: "",
    mobile: "",
    email: "",
    business_type: "",
    vintage: "",
    profit: "",
    networth: "",
  });

  const [loading, setLoading] = useState(false);
  const [recentNews, setRecentNews] = useState<NewsItem[]>([]);
  const [currentIpoBlogs, setCurrentIpoBlogs] = useState<any[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [eligibilityStatus, setEligibilityStatus] = useState<"Eligible" | "Not Eligible Yet" | null>(null);
  const { getToken } = useRecaptcha();

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetch(`${API_URL}/api/news?limit=6`);
        if (res.ok) {
          const data = await res.json();
          setRecentNews(data.data || data);
        }
      } catch (err) {
        console.error("Failed to fetch recent insights");
      }
    };
    const fetchIpoBlogs = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin-blogs?page=1&limit=3&summary=1&category=ipo_updates&upcoming=0`);
        if (res.ok) {
          const data = await res.json();
          setCurrentIpoBlogs(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch current IPO blogs");
      }
    };
    fetchInsights();
    fetchIpoBlogs();
  }, []);

  const countWords = (str: string) => {
    return str.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const calculateEligibility = (data: typeof formData) => {
    const { vintage, profit, networth } = data;

    // Basic Eligibility Rule:
    // 1. Must have more than 3 years of vintage
    // 2. Must be profitable (any level > 0)
    // 3. Networth must be at least 1.5 Crore+

    const hasVintage = vintage === "more than 3 year";
    const isProfitable = profit !== "not profitable";
    const hasMinNetworth = networth === "1.5 crore to 5 crore" || networth === "above crores";

    if (hasVintage && isProfitable && hasMinNetworth) {
      return "Eligible";
    }

    return "Not Eligible Yet";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(formData.mobile)) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }

    if (countWords(formData.business_name) > 40) {
      toast.error("Business name should not exceed 40 words.");
      return;
    }

    if (!formData.business_type || !formData.vintage || !formData.profit || !formData.networth) {
      toast.error("Please select all eligibility criteria");
      return;
    }

    setLoading(true);
    try {
      const recaptchaToken = await getToken("ipo_feasibility_form");
      const eligibilityResult = calculateEligibility(formData);

      const submissionData = {
        ...formData,
        name: formData.business_name,
        company_name: formData.business_name,
        eligibility: eligibilityResult,
        recaptchaToken
      };

      const res = await fetch(`${API_URL}/api/ipo_feasibility`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (res.ok) {
        setEligibilityStatus(eligibilityResult);
        setShowResultModal(true);
        setFormData({
          business_name: "",
          mobile: "",
          email: "",
          business_type: "",
          vintage: "",
          profit: "",
          networth: "",
        });
      } else {
        toast.error("Failed to submit request. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    if (field === "mobile") {
      const sanitized = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, mobile: sanitized }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">

      <main className="flex-1 space-y-20 pb-20">
        <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden bg-foreground text-background">
          <div className="absolute inset-0 z-0">
            <img
              src={typeof eligibilityBanner === "string" ? eligibilityBanner : eligibilityBanner.src}
              alt="Eligibility Banner"
              className="w-full h-full object-cover opacity-20 object-center mix-blend-overlay"
            />
            <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-background/20 to-transparent" />
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-accent/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 -ml-20 mb-20 w-[400px] h-[400px] bg-primary/20 blur-[100px] rounded-full" />
          </div>

          <div className="container relative z-10 px-4 mx-auto">
            <div className="max-w-8xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-heading tracking-tight mb-8" style={{ fontFamily: "var(--font-heading)" }}>
                  Evaluate Your Potential For An <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-gold-light">
                    Initial Public Offering
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-10">
                  Take the first step towards massive capital scaling. Our expert Eligibility check accurately gauges your readiness for the Mainboard or SME exchanges.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button 
                    size="lg" 
                    className="h-14 px-8 text-lg bg-accent text-accent-foreground hover:bg-accent/90 rounded-full w-full sm:w-auto font-bold cursor-pointer" 
                    onClick={() => document.getElementById("Eligibility-form")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Start Assessment Now
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="relative !mt-0 pt-10 md:pt-12 pb-20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-black font-heading text-foreground mb-5 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                Eligibility Check for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  SME and Mainboard IPO
                </span>{" "}
                in India
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Understand Your Company's IPO Readiness Before Going Public
              </p>
              <div className="flex items-center justify-center gap-3 mt-8">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/40" />
                <div className="w-2 h-2 rounded-full bg-accent" />
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/40" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border/60 rounded-3xl p-8 md:p-10 mb-8 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 blur-2xl" />
              <div className="space-y-5 text-muted-foreground leading-8 text-[1.03rem] relative z-10">
                <p>
                  Going public is one of the biggest achievements by a business, but not all companies qualify for it.
                  An IPO Eligibility Check is a systematic evaluation of whether a company complies with the financial,
                  legal and governance criteria established by SEBI and stock exchanges in order to list its shares on a public market.
                  Before dedicating time and resources to the IPO process, promoters need to evaluate whether they need to bridge gaps,
                  resolve compliance issues and create a credible narrative for public markets.
                </p>
                <p>
                  India's capital market regulator — the Securities and Exchange Board of India (SEBI) governs IPO eligibility through
                  the SEBI (Issue of Capital and Disclosure Requirements) Regulations, 2018 (ICDR Regulations).
                  These regulations define the listing criteria for both Mainboard and SME platforms.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-card border border-border/60 rounded-3xl p-8 md:p-10 mb-8 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary via-primary/60 to-transparent rounded-l-3xl" />
              <div className="pl-4">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    Who Should Use IPO Eligibility Check Services?
                  </h3>
                </div>

                <p className="text-muted-foreground mb-7 leading-7 text-[1.03rem]">
                  Any company considering a public listing within the next 12–36 months should
                  undertake an IPO eligibility check, not just those planning to list immediately.
                  Key candidates include:
                </p>

                <ul className="space-y-3">
                  {[
                    "Any company planning for a public listing on the NSE or BSE",
                    "Manufacturing companies looking to raise growth capital",
                    "NBFCs and financial businesses (subject to additional criteria)",
                    "Healthcare and pharma companies seeking capital for expansion",
                    "Technology and SaaS companies targeting the NSE Emerge ITP platform",
                  ].map((item, idx) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.07 }}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/40 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <CheckCircle className="w-3.5 h-3.5 text-primary group-hover:text-white" />
                      </div>
                      <span className="text-muted-foreground text-[0.97rem] leading-relaxed">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-card border border-border/60 rounded-3xl p-8 md:p-10 mb-8 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-accent via-accent/60 to-transparent rounded-l-3xl" />
              <div className="pl-4">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    Benefits of Conducting an IPO Eligibility Check
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { label: "Identify the Right Platform", icon: <BarChart3 className="w-4 h-4" /> },
                    { label: "Reduce IPO Risks", icon: <Shield className="w-4 h-4" /> },
                    { label: "Improve Compliance Readiness", icon: <CheckCircle className="w-4 h-4" /> },
                    { label: "Boost Investor Confidence", icon: <TrendingUp className="w-4 h-4" /> },
                    { label: "Enhance Valuation Potential", icon: <PieChart className="w-4 h-4" /> },
                    { label: "Strengthen Capital-Raising Plans", icon: <Building2 className="w-4 h-4" /> },
                  ].map((benefit, idx) => (
                    <motion.div
                      key={benefit.label}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.06 }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/40 hover:border-accent/30 hover:bg-accent/5 transition-all duration-200 group cursor-default"
                    >
                      <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
                        {benefit.icon}
                      </div>
                      <span className="font-semibold text-foreground text-sm">{benefit.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/95 to-foreground/90" />
              <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-accent/15 rounded-full blur-[100px] -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[80px] -ml-20 -mb-20" />

              <div className="relative z-10 p-8 md:p-12 text-background">
                <h3 className="text-3xl md:text-4xl font-black font-heading mb-5 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                  Get Your IPO Eligibility{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-300">
                    Assessment Today
                  </span>
                </h3>

                <p className="text-background/75 text-[1.03rem] leading-relaxed mb-8 max-w-2xl">
                  Thinking of raising capital or going public? IndiaIPO offers comprehensive IPO advisory services
                  and SME IPO consulting, including strategic corporate finance support to enable confident growth.
                  Whether you are looking at NSE Emerge, BSE SME or a Mainboard listing, we assess your IPO readiness
                  in financial, legal and governance dimensions and deliver a clear, actionable roadmap.
                </p>

                <h4 className="text-lg font-bold mb-5 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-accent rounded-full" />
                  Our Services Include:
                </h4>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    "IPO From Education to Execution",
                    "IPO Readiness Review",
                    "SME IPO Advisory",
                    "Mainboard IPO Consulting",
                    "Compliance Consultation",
                  ].map((service, idx) => (
                    <motion.div
                      key={service}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.07 }}
                      className="flex items-center gap-2.5 p-3.5 rounded-xl bg-white/8 border border-white/10 backdrop-blur-sm hover:bg-white/12 hover:border-accent/30 transition-all duration-200 group"
                    >
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                        <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <span className="text-background/85 text-sm font-medium leading-snug">{service}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <Button
                    size="lg"
                    className="h-14 px-8 bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-bold shadow-lg shadow-accent/20 transition-all hover:shadow-accent/30 hover:scale-[1.02] cursor-pointer"
                    onClick={() => document.getElementById("Eligibility-form")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Start Free Assessment
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="container mx-auto px-4">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Why Assess Your <strong className="text-accent">IPO</strong> Readiness?
            </h2>
            <p className="text-muted-foreground text-lg">An IPO is a critical milestone. Assessing Eligibility ensures you understand the regulatory, financial, and strategic transformations required.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <TrendingUp className="h-6 w-6" />, title: "Valuation Insights", desc: "Understand your potential market cap and equity value before proceeding." },
              { icon: <Shield className="h-6 w-6" />, title: "Regulatory Check", desc: "Identify compliance gaps against stringent SEBI exchange norms." },
              { icon: <PieChart className="h-6 w-6" />, title: "Capital Structuring", desc: "Optimize your existing cap table for institutional investor attractiveness." },
              { icon: <Building2 className="h-6 w-6" />, title: "Market Timing", desc: "Gauge the current market sentiment for your specific industry sector." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border hover:border-primary/30 transition-all hover:shadow-xl group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="Eligibility-form" className="container mx-auto px-4 scroll-mt-28 md:scroll-mt-32">
          <div className="bg-card rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col lg:flex-row relative">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />

            <div className="lg:w-2/5 bg-foreground text-background p-10 md:p-14 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554200876-56c2f25224fa?q=80&w=1000')] opacity-10 bg-cover bg-center mix-blend-overlay" />
              <div className="relative z-10 w-full">
                <h3 className="text-3xl font-bold font-heading mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                  Uncover Your Potential
                </h3>
                <p className="text-primary-foreground/70 text-lg mb-10 leading-relaxed">
                  Enter your company's core financial and structural details. Our advisory board will run a comprehensive diagnostic and revert with an executive summary.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center shrink-0 font-bold">1</div>
                    <div>
                      <h4 className="font-bold text-lg">Submit Data</h4>
                      <p className="text-primary-foreground/60 text-sm">Provide accurate recent metrics.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 font-bold">2</div>
                    <div>
                      <h4 className="font-bold text-lg">Expert Analysis</h4>
                      <p className="text-primary-foreground/60 text-sm">We benchmark against listed peers.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 font-bold">3</div>
                    <div>
                      <h4 className="font-bold text-lg">Eligibility Report</h4>
                      <p className="text-primary-foreground/60 text-sm">Receive a strategic consultation call.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-3/5 p-10 md:p-14 bg-card/80 backdrop-blur-md">
              <h2 className="text-2xl font-bold font-heading text-foreground mb-8 border-b border-border pb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Confidential Assessment Form
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Business Name *</label>
                    <Input required className="h-12 bg-background border-border" value={formData.business_name} onChange={(e) => handleChange("business_name", e.target.value)} placeholder="Enter your business name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Contact Number *</label>
                    <Input required className="h-12 bg-background border-border" value={formData.mobile} onChange={(e) => handleChange("mobile", e.target.value)} placeholder="Enter your contact number" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-foreground">Email Address *</label>
                    <Input required type="email" className="h-12 bg-background border-border" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="Enter your email address" />
                  </div>
                </div>

                <div className="pt-8 pb-4">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                    <h3 className="text-xl font-bold font-heading text-primary" style={{ fontFamily: "var(--font-heading)" }}>
                      Eligibility Criteria
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Entity Status</label>
                    <select
                      required
                      className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.business_type}
                      onChange={(e) => handleChange("business_type", e.target.value)}
                    >
                      <option value="">Select Entity Status</option>
                      <option value="private limited">Private Limited</option>
                      <option value="public limited">Public Limited</option>
                      <option value="partnership firm">Partnership Firm</option>
                      <option value="proprietorship firm">Proprietorship Firm</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Vintage</label>
                    <select
                      required
                      className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.vintage}
                      onChange={(e) => handleChange("vintage", e.target.value)}
                    >
                      <option value="">Select Vintage</option>
                      <option value="less than 3 year">Less than 3 year</option>
                      <option value="more than 3 year">More than 3 year</option>
                      <option value="just started">Just started</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      Operating Profit (EBITDA)
                      <div className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] cursor-help font-bold" title="Earnings Before Interest, Taxes, Depreciation, and Amortization">i</div>
                    </label>
                    <select
                      required
                      className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.profit}
                      onChange={(e) => handleChange("profit", e.target.value)}
                    >
                      <option value="">Select Operating Profit</option>
                      <option value="not profitable">Not profitable</option>
                      <option value="less than 1 crore">Less than 1 crore</option>
                      <option value="1 -15 crore">1 - 15 crore</option>
                      <option value="more than 15 crore">More than 15 crore</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Net Worth</label>
                    <select
                      required
                      className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.networth}
                      onChange={(e) => handleChange("networth", e.target.value)}
                    >
                      <option value="">Select Net Worth</option>
                      <option value="not positive">Not positive</option>
                      <option value="less than 1. crore">Less than 1. crore</option>
                      <option value="1.5 crore to 5 crore">1.5 crore to 5 crore</option>
                      <option value="above crores">Above 5 Crores</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6">
                  <Button type="submit" size="lg" disabled={loading} className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-primary/20 cursor-pointer">
                    {loading ? "Submitting assessment..." : "Submit"}
                    {!loading && <CheckCircle className="ml-2 h-5 w-5" />}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {recentNews.length > 0 && (
          <section className="bg-muted/30 py-20 mt-20 border-t border-border">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    Latest Market Insights
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-2xl">Stay Updated with The Latest IPO Trends, Market Announcements, and Financial News Curated by Our Team.</p>
                </div>
                <Button variant="outline" asChild className="shrink-0 rounded-full h-12 px-6 cursor-pointer">
                  <Link href="/news">
                    View All News <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentNews.slice(0, 3).map((news) => (
                  <Link href={`/news/detail/${news.slug}`} key={news.id} className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300">
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      {getImgSrc(news.image) ? (
                        <img src={getImgSrc(news.image)!} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5">
                          <FileText className="w-12 h-12 text-primary/20" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-3">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(news.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                      <h3 className="font-bold text-lg font-heading text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                        {news.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                        {news.excerpt || "Read more about this latest update inside..."}
                      </p>
                      <div className="mt-auto flex items-center text-sm font-semibold text-primary">
                        Read Full Article <ArrowUpRight className="ml-1 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {currentIpoBlogs.length > 0 && (
          <section className="">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    Current IPO Blogs &amp; Updates
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-2xl">Get Detailed Reviews, GMP Tracking, And Expert Analysis for Active Initial Public Offerings.</p>
                </div>
                <Button variant="outline" asChild className="shrink-0 rounded-full h-12 px-6 cursor-pointer">
                  <Link href="/ipo-blogs">
                    View All Blogs <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentIpoBlogs.map((blog) => (
                  <Link href={`/ipo-blogs/${blog.slug || blog.id}`} key={blog.id} className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300">
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      {isValid(getImgSrc(blog.image)) ? (
                        <img src={getImgSrc(blog.image)!} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5">
                          <TrendingUp className="w-12 h-12 text-primary/20" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-3">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(blog.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                      <h3 className="font-bold text-lg font-heading text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                        {blog.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                        {blog.description || "Read comprehensive reviews and analysis about this IPO..."}
                      </p>
                      <div className="mt-auto flex items-center text-sm font-semibold text-primary">
                        Read Full Details <ArrowUpRight className="ml-1 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <ResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        status={eligibilityStatus}
        companyName={formData.business_name}
      />

    </div>
  );
}

const ResultModal = ({ isOpen, onClose, status, companyName }: { isOpen: boolean; onClose: () => void; status: "Eligible" | "Not Eligible Yet" | null; companyName: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isOpen && !isHovered) {
      timeoutId = setTimeout(() => {
        onClose();
      }, 6000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOpen, isHovered, onClose]);

  if (!status) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[90%] sm:max-w-[460px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl max-h-[90vh] overflow-y-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`h-2 w-full ${status === "Eligible" ? "bg-emerald-500" : "bg-amber-500"}`} />

        <div className="p-5 md:p-7">
          <div className="flex justify-center mb-4 md:mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-lg ${status === "Eligible"
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                : "bg-amber-50 text-amber-600 border border-amber-100"
              }`}
            >
              {status === "Eligible" ? <Sparkles className="w-8 h-8 md:w-9 md:h-9" /> : <AlertCircle className="w-8 h-8 md:w-9 md:h-9" />}
            </motion.div>
          </div>

          <div className="text-center space-y-2 mb-6">
            <DialogTitle className="text-xl md:text-2xl font-black font-heading tracking-tight text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              {status === "Eligible" ? "Strong Potential!" : "Assessment Complete"}
            </DialogTitle>
            <DialogDescription className="text-xs md:text-sm text-muted-foreground leading-relaxed px-2 md:px-4">
              {status === "Eligible"
                ? "Excellent news! Your company meets the primary indicators for a successful IPO listing. You are ready to explore the next phase of growth."
                : "Based on the initial metrics, your company might need additional structuring to meet the elite standards for an immediate IPO listing."}
            </DialogDescription>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className={`p-3 md:p-4 rounded-xl border transition-all ${status === "Eligible" ? "bg-emerald-50/50 border-emerald-100" : "bg-slate-50 border-slate-100"}`}>
              <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-0.5 md:mb-1">Status</span>
              <span className={`text-sm md:text-base font-black uppercase ${status === "Eligible" ? "text-emerald-700" : "text-slate-700"}`}>
                {status}
              </span>
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-0.5 md:mb-1">Exchange</span>
              <span className="text-sm md:text-base font-black text-slate-700">
                {status === "Eligible" ? "SME / Mainboard" : "Consultancy Req."}
              </span>
            </div>
          </div>

          <div className="bg-foreground text-background p-4 md:p-5 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-accent/20 transition-all" />
            <h4 className="text-xs md:text-sm font-bold mb-2 flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" /> Next Strategic Steps:
            </h4>
            <ul className="space-y-2 text-[10px] md:text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" /> Our elite advisor will call you within 24 hours.
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" /> Prepare your last 3 years of audited financials.
              </li>
            </ul>
          </div>

          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3">
            <Button className="flex-1 h-11 md:h-12 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-sm md:text-base cursor-pointer" onClick={onClose}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
