"use client";

import { useState, useEffect } from "react";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ChevronLeft, Send, Users, Building2, Mail, Phone,
  MessageSquare, CheckCircle2, Award, Briefcase,
  MapPin, Star, ShieldCheck, TrendingUp, Sparkles,
  Target, Rocket, ClipboardCheck, BarChart3, Globe2,
  FileText, ShieldAlert, Zap, Home, ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Consultant {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  experience_years: number;
  specialization: string | null;
  office_location: string | null;
  success_stories: string | null;
  tags: string | null;
  cemail: string | null;
  cmobile: string | null;
  caddress: string | null;
  cweblink: string | null;
  meta_title: string | null;
  meta_desc: string | null;
  meta_keywords: string | null;
  methodology: string | null;
  roadmap: string | null;
  blog_content?: string | null;
  blog_title?: string | null;
}

export default function ConsultantDetailsClient() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { getToken } = useRecaptcha();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organisation: "",
    message: ""
  });

  useEffect(() => {
    const fetchConsultant = async () => {
      try {
        const res = await fetch(`/api/consultants/${slug}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setConsultant(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        try {
          const blogRes = await fetch(`/api/admin-blogs/${slug}`);
          if (blogRes.ok) {
            const blogData = await blogRes.json();
            const category = blogData.category;
            if (category === "ipo_updates") {
              router.replace(`/ipo-blogs/${slug}`);
              return;
            } else if (category === "ipo_blogs") {
              router.replace(`/blogs/${slug}`);
              return;
            } else if (category === "daily_reporter") {
              router.replace(`/daily-reporter/${slug}`);
              return;
            }
          }
        } catch (blogErr) {
          console.error("Failed to check fallback blog:", blogErr);
        }

        toast.error("Consultant not found");
        router.push("/consultant");
      }
    };
    if (slug) fetchConsultant();
  }, [slug, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message || !formData.phone) {
      return toast.error("Please fill in all required fields.");
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      return toast.error("Phone must be exactly 10 digits");
    }

    if (formData.organisation.length > 100) {
      return toast.error("Organisation max 100 characters");
    }

    if (formData.message.length > 400) {
      return toast.error("Message max 400 characters");
    }

    if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      return toast.error("Name should contain only letters");
    }

    setSubmitting(true);
    try {
      const recaptchaToken = await getToken('consultant_enquiry_form');
      const res = await fetch("/api/consultant-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultant_id: consultant?.id,
          ...formData,
          recaptchaToken
        })
      });

      if (res.ok) {
        setSubmitted(true);
        toast.success("Enquiry submitted successfully!");
      } else {
        throw new Error("Failed to submit");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getCleanBlogContent = (html: string | null | undefined) => {
    if (!html) return "";

    let cleaned = html
      .replace(/<p[^>]*>\s*<span[^>]*font-size\s*:\s*(?:24px|26px|18pt|20px)[^>]*>\s*(?:<strong>|<b>)?\s*(.*?)\s*(?:<\/strong>|<\/b>)?\s*<\/span>\s*<\/p>/gi, '<h2>$1</h2>')
      .replace(/<p[^>]*>\s*(?:<strong>|<b>)?\s*<span[^>]*font-size\s*:\s*(?:24px|26px|18pt|20px)[^>]*>\s*(.*?)\s*<\/span>\s*(?:<\/strong>|<\/b>)?\s*<\/p>/gi, '<h2>$1</h2>');

    cleaned = cleaned
      .replace(/<h1([^>]*)>/gi, '<h2>')
      .replace(/<\/h1>/gi, '</h2>');

    cleaned = cleaned.replace(/style="[^"]*"/gi, (match) => {
      const alignment = match.match(/text-align\s*:\s*[^;"]*/i);
      return alignment ? `style="${alignment[0]}"` : '';
    });

    cleaned = cleaned.replace(/<span\s*>\s*<\/span>/gi, '');

    return cleaned;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-6 md:pt-12 pb-24 bg-gradient-to-b from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-2 mb-8 text-xs text-muted-foreground font-bold">
            <Link href="/" className="hover:text-primary flex items-center gap-1.5 transition-colors">
              <Home className="h-3.5 w-3.5" /> Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30" />
            <Link href="/consultant" className="hover:text-primary transition-colors">Consultants</Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30" />
            <span className="text-foreground truncate max-w-[200px] sm:max-w-[400px]">{consultant?.name}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-[1.1] tracking-tight mb-10 max-w-4xl">
            {consultant?.name}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
            <div className="lg:col-span-2 space-y-12">
              <div className="w-full max-w-[750px] aspect-[16/10] rounded-[3rem] bg-gradient-to-tr from-card to-background border-4 border-background shadow-2xl shadow-primary/10 overflow-hidden flex items-center justify-center shrink-0 relative transition-all duration-500 hover:scale-[1.01] hover:shadow-primary/20 group">
                {consultant?.image_url ? (
                  <img
                    src={consultant.image_url.startsWith('http') || consultant.image_url.startsWith('/') ? consultant.image_url : `/${consultant.image_url}`}
                    alt={consultant.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = '/consultant-placeholder.png';
                    }}
                  />
                ) : (
                  <img
                    src="/consultant-placeholder.png"
                    alt={consultant?.name || "Consultant"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>

              <section className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="service-content max-w-none">
                  {consultant?.blog_content ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: getCleanBlogContent(consultant.blog_content) }}
                    />
                  ) : (
                    <p className="text-xl text-muted-foreground leading-relaxed whitespace-pre-wrap font-medium border-l-4 border-primary/30 pl-6 italic">
                      {consultant?.description || "With a focus on delivering end-to-end IPO solutions, our consultancy specializes in preparing companies for the public markets."}
                    </p>
                  )}
                </div>
                {consultant?.specialization && (
                  <div className="space-y-4">
                    <h2 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                      <Target className="h-4 w-4" /> Areas of Expertise
                    </h2>
                    <div className="flex flex-wrap gap-2.5">
                      {consultant.specialization.split(',').map((spec, i) => (
                        <Badge key={i} variant="secondary" className="px-6 py-2.5 rounded-2xl text-sm font-bold bg-muted border border-border/50 text-foreground hover:bg-primary/10 hover:border-primary/30 transition-all cursor-default shadow-sm text-center">
                          {spec.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </div>

            <div className="lg:col-span-1 lg:sticky lg:top-8">
              <div className="bg-card border-2 border-primary/20 rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-10 md:p-12 shadow-2xl shadow-primary/10 relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/5 rounded-full blur-2xl" />
                <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-accent/5 rounded-full blur-xl" />

                {submitted ? (
                  <div className="text-center py-12 space-y-8 relative z-10">
                    <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-inner border-2 border-green-200">
                      <CheckCircle2 className="h-14 w-14 text-green-600 animate-bounce" />
                    </div>
                    <div className="space-y-3">
                      <p className="text-4xl font-black font-heading tracking-tight">Success!</p>
                      <p className="text-muted-foreground font-semibold text-lg">
                        Your strategic interest in <span className="text-primary">{consultant?.name}</span> has been securely transmitted.
                      </p>
                      <p className="text-sm text-muted-foreground pt-4">
                        A senior deployment partner will contact you within
                        <span className="text-foreground font-bold"> 4-6 business hours</span>.
                      </p>
                    </div>
                    <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-8 rounded-2xl px-10 py-6 h-auto text-lg font-bold border-primary/20 hover:bg-primary/5 transition-all">
                      Open New Enquiry
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                    <div className="text-center md:text-left space-y-3">
                      <p className="text-4xl font-black font-heading tracking-tight leading-none text-foreground">Secure Listing Consultation</p>
                      <p className="text-base text-muted-foreground font-semibold">Ready to scale? Connect with our top-tier advisory team today.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2.5">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                          <Users className="h-3.5 w-3.5" /> Full Name <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <Input
                          placeholder="Rajesh Kumar"
                          required
                          maxLength={50}
                          className="bg-muted/30 border-border/50 rounded-2xl h-14 focus:ring-primary/20 text-base font-medium transition-all hover:bg-muted/50"
                          value={formData.name}
                          onChange={(e) => {
                            const value = e.target.value;
                            const filtered = value.replace(/[^a-zA-Z\s]/g, "");
                            setFormData({ ...formData, name: filtered });
                          }}
                        />
                      </div>

                      <div className="space-y-2.5">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5" /> Work Email <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <Input
                          type="email"
                          placeholder="rajesh@fortune500.in"
                          required
                          className="bg-muted/30 border-border/50 rounded-2xl h-14 focus:ring-primary/20 text-base font-medium transition-all hover:bg-muted/50"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2.5">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5" /> Mobile <span className="text-red-500 ml-0.5">*</span>
                          </label>
                          <Input
                            type="tel"
                            placeholder="Enter 10 digit Number"
                            required
                            maxLength={10}
                            className="bg-muted/30 border-border/50 rounded-2xl h-14 focus:ring-primary/20 text-base font-medium transition-all hover:bg-muted/50"
                            value={formData.phone}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              setFormData({ ...formData, phone: value });
                            }}
                          />
                        </div>

                        <div className="space-y-2.5">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                            <Building2 className="h-3.5 w-3.5" /> Organisation <span className="text-red-500 ml-0.5">*</span>
                          </label>
                          <Input
                            placeholder="Org Name"
                            required
                            className="bg-muted/30 border-border/50 rounded-2xl h-14 focus:ring-primary/20 text-base font-medium transition-all hover:bg-muted/50"
                            value={formData.organisation}
                            onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <div className="flex justify-between items-center ml-1">
                          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <MessageSquare className="h-3.5 w-3.5" /> Why Listing Now? <span className="text-red-500 ml-0.5">*</span>
                          </label>
                          <span
                            className={`text-[10px] font-bold ${formData.message.length > 350
                              ? "text-destructive"
                              : "text-muted-foreground"
                              }`}
                          >
                            {formData.message.length}/400
                          </span>
                        </div>

                        <textarea
                          className="w-full min-h-[160px] px-5 py-4 rounded-[2rem] border border-border/50 bg-muted/30 text-base font-medium ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all hover:bg-muted/50 resize-none"
                          placeholder="Describe your current capital needs or listing questions..."
                          required
                          maxLength={400}
                          value={formData.message}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 400) {
                              setFormData({ ...formData, message: value });
                            }
                          }}
                        />

                        <p className="text-[10px] text-muted-foreground font-medium">
                          Maximum 400 characters allowed
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Button type="submit" className="w-full h-auto min-h-16 py-4 px-6 text-base sm:text-lg lg:text-xl font-black rounded-2xl shadow-2xl shadow-primary/30 group relative overflow-hidden transition-all active:scale-[0.98] whitespace-normal" disabled={submitting}>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-shimmer" />
                        <span className="relative z-10 flex items-center justify-center flex-wrap gap-x-2 gap-y-1 text-center">
                          {submitting ? "Processing..." : (
                            <>
                              <span>Initialize Consultation</span> <Send className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-1.5 group-hover:-translate-y-0.5 shrink-0" />
                            </>
                          )}
                        </span>
                      </Button>

                      <p className="text-[10px] text-center text-muted-foreground leading-relaxed px-4 font-bold border border-muted p-2.5 rounded-2xl bg-muted/20">
                        Disclaimer: India IPO facilitates expert connections. Strategic decisions should be made in consultation with certified financial stakeholders.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
