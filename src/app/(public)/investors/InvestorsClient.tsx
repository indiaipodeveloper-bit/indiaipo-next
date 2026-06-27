"use client";

import { useState, useEffect, useRef } from "react";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, TrendingUp, Shield, CheckCircle, BarChart3, Briefcase, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import investor from "@/assets/investor.webp";
import { API_URL } from "@/lib/constants";

const benefits = [
  { icon: TrendingUp, title: "Expert Market Analysis", desc: "Access real-time GMP data, subscription status, and listing performance analysis." },
  { icon: Shield, title: "SEBI Compliant", desc: "All our advisory services are fully compliant with SEBI regulations and guidelines." },
  { icon: Users, title: "Dedicated Support", desc: "Get personalized IPO investment guidance from our expert wealth management team." },
  { icon: CheckCircle, title: "Proven Track Record", desc: "Over 450+ successful IPO listings evaluated with a 98% accuracy rate." },
];

export default function InvestorsClient() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    ticket_size: "",
    industry: "",
    roi: "",
    tenure: "",
    inv_type: "",
    buss_type: "",
    vintage: "",
    query: ""
  });
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { getToken } = useRecaptcha();

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

  const countChars = (str: string = "") => {
    return str.length;
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateMobile = (mobile: string) => {
    return /^[6-9]\d{9}$/.test(mobile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.mobile) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!validateMobile(formData.mobile)) {
      toast.error("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (formData.query.length > 150) {
      toast.error("Message must not exceed 150 characters");
      return;
    }

    const fieldsToCheck = [
      formData.ticket_size,
      formData.industry,
      formData.roi,
      formData.tenure,
      formData.inv_type,
      formData.buss_type,
      formData.vintage,
    ];

    for (let field of fieldsToCheck) {
      if (field && field.length > 30) {
        toast.error("Each field must not exceed 30 characters");
        return;
      }
    }

    setLoading(true);

    try {
      const recaptchaToken = await getToken("investor_form");
      const res = await fetch(`${API_URL}/api/investor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit enquiry");
      }

      toast.success("Thank you! Your enquiry has been submitted.");

      setFormData({
        name: "", mobile: "", email: "",
        ticket_size: "", industry: "", roi: "",
        tenure: "", inv_type: "", buss_type: "",
        vintage: "", query: ""
      });

    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 bg-background">
        <section className="relative h-[340px] sm:h-[450px] md:h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 bg-black">
            <img
              src={typeof investor === "string" ? investor : investor.src}
              alt="Investors"
              className="w-full h-full object-cover opacity-50"
            />
          </div>
          <div className="absolute inset-0 z-0 bg-gradient-to-t md:h-32 mt-auto" />

          <div className="container relative z-10 px-4 pt-4 md:pt-8 -mt-6 md:-mt-12 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold font-heading text-white mb-3 md:mb-6 leading-tight drop-shadow-lg" style={{ fontFamily: "var(--font-heading)" }}>
                Maximize Your <br className="hidden sm:inline" />
                <span className="text-accent text-transparent bg-clip-text bg-gradient-to-r from-accent to-gold-light">
                  Investment Potential
                </span>
              </h1>
              <p className="text-xs sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl leading-relaxed drop-shadow-md">
                Join India's leading platform for data-driven IPO analysis, unlisted shares, and exclusive wealth creation opportunities tailored for discerning investors.
              </p>
              <div className="flex flex-wrap gap-2.5 md:gap-4 ">
                <Button 
                  className="bg-accent text-accent-foreground hover:bg-gold-light font-bold h-9 md:h-12 px-5 md:px-8 rounded-full shadow-lg text-xs md:text-base cursor-pointer"
                  onClick={() => document.getElementById("enquiry-form")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Partner With Us
                </Button>
                <Button 
                  variant="outlineWhite" 
                  className="h-9 md:h-12 px-5 md:px-8 rounded-full shadow-md backdrop-blur-sm transition-all text-xs md:text-base cursor-pointer"
                  onClick={() => document.getElementById("benefits")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Explore Benefits
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[500px]">
                  <img
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1000"
                    alt="Corporate Meeting"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                    <div className="text-white">
                      <h3 className="text-2xl font-bold font-heading mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                        Institutional Grade Research
                      </h3>
                      <p className="text-white/80">Delivering actionable insights backed by rigorous fundamental analysis.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  Why High Net-Worth Individuals Choose Us
                </h2>
                <div className="w-20 h-1.5 bg-accent rounded-full mb-6" />
                <p className="text-lg text-muted-foreground leading-relaxed">
                  In today's dynamic capital markets, securing alpha requires more than just public data. It demands proprietary insights, priority access, and a deep understanding of market sentiment.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our investor services are designed exclusively for HNIs, family offices, and institutional investors seeking curated opportunities in upcoming IPOs, Pre-IPO placements, and unlisted equities. We provide end-to-end advisory—from early-stage evaluation to optimal listing-day exit strategies.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <BarChart3 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">Data-Driven</h4>
                      <p className="text-sm text-muted-foreground mt-1">Quantitative models for precise valuations.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Briefcase className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">Exclusive Access</h4>
                      <p className="text-sm text-muted-foreground mt-1">Priority allocation networks.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="benefits" className="py-24 scroll-mt-28">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Our Core Competencies
              </h2>
              <p className="text-lg text-muted-foreground">Comprehensive coverage across the entire spectrum of primary market investments.</p>
            </div>

            <div className="overflow-hidden">
              <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8">
                {benefits.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="shrink-0 w-[280px] md:w-auto group bg-card shadow-lg border border-border rounded-2xl p-8 hover:shadow-xl hover:border-primary/40 transition-all duration-300 relative overflow-hidden snap-center"
                    >
                      <div className="absolute top-0 right-0 p-6 opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none">
                        <Icon className="w-32 h-32 text-yellow-200" />
                      </div>
                      <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          <Icon className="h-8 w-8 text-primary shadow-primary/20 drop-shadow-sm" />
                        </div>
                        <h3 className="text-xl font-bold font-heading text-foreground mb-3">{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="enquiry-form" className="py-24 bg-foreground text-background scroll-mt-28">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
              <div className="lg:col-span-3">
                <div className="bg-background text-foreground rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary" />
                  <h2 className="text-3xl font-bold font-heading mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    Request Investor Advisory
                  </h2>
                  <p className="text-muted-foreground mb-8">Leave your details and our senior wealth manager will connect with you.</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Full Name *</label>
                        <Input
                          placeholder="John Doe"
                          className="bg-muted/50 border-transparent focus:bg-background h-12"
                          value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Email Address *</label>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          className="bg-muted/50 border-transparent focus:bg-background h-12"
                          value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Mobile Number *</label>
                        <Input
                          type="tel"
                          placeholder="98765 43210"
                          maxLength={10}
                          className="bg-muted/50 border-transparent focus:bg-background h-12"
                          value={formData.mobile} onChange={e => {
                            const val = e.target.value.replace(/\D/g, "");
                            if (val.length <= 10) setFormData({ ...formData, mobile: val });
                          }}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Ticket Size</label>
                        <Input
                          placeholder="e.g. ₹50 Lakhs - ₹1 Crore"
                          className="bg-muted/50 border-transparent focus:bg-background h-12"
                          value={formData.ticket_size} onChange={(e) => {
                            const value = e.target.value.slice(0, 30);
                            setFormData({ ...formData, ticket_size: value });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Industry</label>
                        <Input
                          placeholder="e.g. IT, Healthcare, Real Estate"
                          className="bg-muted/50 border-transparent focus:bg-background h-12"
                          value={formData.industry} onChange={(e) => {
                            const value = e.target.value.slice(0, 30);
                            setFormData({ ...formData, industry: value });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Expected ROI</label>
                        <Input
                          placeholder="e.g. 15-20% annually"
                          className="bg-muted/50 border-transparent focus:bg-background h-12"
                          value={formData.roi} onChange={(e) => {
                            const value = e.target.value.slice(0, 30);
                            setFormData({ ...formData, roi: value });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Investment Tenure</label>
                        <Input
                          placeholder="e.g. 3-5 Years"
                          className="bg-muted/50 border-transparent focus:bg-background h-12"
                          value={formData.tenure} onChange={(e) => {
                            const value = e.target.value.slice(0, 30);
                            setFormData({ ...formData, tenure: value });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Investment Type</label>
                        <Input
                          placeholder="e.g. Equity, Debt, Hybrid"
                          className="bg-muted/50 border-transparent focus:bg-background h-12"
                          value={formData.inv_type} onChange={(e) => {
                            const value = e.target.value.slice(0, 30);
                            setFormData({ ...formData, inv_type: value });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Business Type</label>
                        <Input
                          placeholder="e.g. B2B, B2C, SaaS"
                          className="bg-muted/50 border-transparent focus:bg-background h-12"
                          value={formData.buss_type} onChange={(e) => {
                            const value = e.target.value.slice(0, 30);
                            setFormData({ ...formData, buss_type: value });
                          }}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold">Vintage</label>
                        <Input
                          placeholder="e.g. 5+ Years"
                          className="bg-muted/50 border-transparent focus:bg-background h-12"
                          value={formData.vintage} onChange={(e) => {
                            const value = e.target.value.slice(0, 30);
                            setFormData({ ...formData, vintage: value });
                          }}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-semibold">Query / Message</label>
                          <span className={`text-[10px] font-bold ${countChars(formData.query) > 150 ? "text-red-500" : "text-muted-foreground"}`}>
                            {countChars(formData.query)} / 150 characters
                          </span>
                        </div>

                        <Textarea
                          placeholder="Briefly describe your investment goals..."
                          className={`bg-muted/50 border-transparent focus:bg-background min-h-[120px] resize-none ${countChars(formData.query) > 150 ? "border-red-500 ring-1 ring-red-500" : ""}`}
                          value={formData.query}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 150) {
                              setFormData({ ...formData, query: value });
                            }
                          }}
                        />
                      </div>
                    </div>
                    <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-primary hover:bg-primary/90 rounded-xl cursor-pointer">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...
                        </>
                      ) : (
                        "Submit Enquiry"
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center sm:text-left mt-4">
                      By submitting this form, you agree to our privacy policy and consent to being contacted by our team.
                    </p>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-2 flex flex-col justify-center">
                <h3 className="text-2xl font-bold font-heading mb-6 text-white" style={{ fontFamily: "var(--font-heading)" }}>
                  Investor Resources
                </h3>
                <p className="text-white/70 mb-8 max-w-md leading-relaxed">
                  Access our suite of tools designated to guide your market decisions and maintain an edge in capital allocation.
                </p>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "View IPO Calendar", desc: "Track upcoming listings", href: "/all-ipos" },
                    { label: "Live GMP Tracker", desc: "Real-time grey market premium", href: "/#gmp" },
                    { label: "Valuation Calculator", desc: "Compute potential listing gains", href: "/ipo-calculator" },
                    { label: "Deep-dive Reports", desc: "Institutional grade DRHP analysis", href: "/reports" },
                  ].map((link) => (
                    <Link key={link.label} href={link.href} className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-accent/50 transition-all flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-lg text-white group-hover:text-accent transition-colors">{link.label}</h4>
                        <p className="text-white/60 text-sm mt-1">{link.desc}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
