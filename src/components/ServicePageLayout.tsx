"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { servicesData } from "@/data/servicesData";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/utils";
import {
  ArrowRight,
  ChevronRight,
  Phone,
  Home,
  Shield,
  Users,
  Zap,
  Target,
  Globe,
  BookOpen,
  Building2,
  TrendingUp,
  Award,
  Clock,
  Star,
} from "lucide-react";
import LatestNews from "@/components/home/LatestNews";

const categoryConfig: Record<string, { accent: string; bg: string; gradient: string; badgeBg: string }> = {
  "IPO": {
    accent: "#f59e08",
    bg: "#fff8e6",
    gradient: "from-[#001529] via-[#002147] to-[#003380]",
    badgeBg: "rgba(245,158,8,0.18)",
  },
  "CAPITAL RAISING": {
    accent: "#f59e08",
    bg: "#fff8e6",
    gradient: "from-[#001529] via-[#002147] to-[#003380]",
    badgeBg: "rgba(245,158,8,0.18)",
  },
  "FINANCE ADVISORY": {
    accent: "#f59e08",
    bg: "#fff8e6",
    gradient: "from-[#001529] via-[#002147] to-[#003380]",
    badgeBg: "rgba(245,158,8,0.18)",
  },
};

const trustStats = [
  { value: "8+", label: "Years", icon: Award },
  { value: "140+", label: "IPOs", icon: TrendingUp },
  { value: "9.2K +", label: "Consultancies", icon: Clock },
  { value: "98%", label: "Success", icon: Star },
];

const whyUs = [
  {
    icon: Shield,
    title: "Expert Advisory Team",
    desc: "Our advisors bring extensive experience across capital markets, operating within a strong compliance framework to ensure clarity, accuracy and confidence at every step.",
  },
  {
    icon: Users,
    title: "Dedicated Deal Team",
    desc: "A focused team of bankers, legal experts and CAs is assigned to your mandate, ensuring seamless coordination and consistent execution throughout the engagement.",
  },
  {
    icon: Zap,
    title: "Efficient Execution Timelines",
    desc: "Our structured processes are designed to streamline the regulatory, documentation and execution phases while maintaining the highest quality standards.",
  },
  {
    icon: Target,
    title: "Strong Investor Network",
    desc: "Access to a wide network of institutional investors, HNIs and family offices, enabling effective capital raising and strong investor participation.",
  },
  {
    icon: Globe,
    title: "Pan-India Presence",
    desc: "With teams across major cities, we support clients nationwide, combining local market understanding with centralised expertise.",
  },
  {
    icon: BookOpen,
    title: "End-to-End Documentation",
    desc: "We manage the complete documentation process from drafting and filings to regulatory submissions and ongoing compliance support.",
  },
];

interface ServicePageLayoutProps {
  slug: string;
  children?: React.ReactNode;
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { API_URL } from "@/lib/constants";

const ServicePageLayout: React.FC<ServicePageLayoutProps> = ({ slug, children }) => {
  const service = servicesData.find((s) => s.slug === slug);
  const pathname = usePathname();
  const [bannerVideo, setBannerVideo] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  useEffect(() => {
    const fetchRecentBlogs = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin-blogs?limit=3&summary=1&category=ipo_blogs`);
        if (res.ok) {
          const data = await res.json();
          setRecentBlogs(data.data || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecentBlogs();
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_URL}/api/banners?page=${encodeURIComponent(pathname || "")}`);
        if (res.ok) {
          const data = await res.json();
          const activeBanner = data.find((b: any) => b.video_url || b.image_url);
          if (activeBanner) {
            if (activeBanner.video_url) setBannerVideo(activeBanner.video_url);
            if (activeBanner.image_url) setBannerImage(activeBanner.image_url);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBanners();
  }, [pathname]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const cfg = categoryConfig[service.category] || categoryConfig["IPO"];

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <main className="flex-grow">
        <section className={`bg-gradient-to-br ${cfg.gradient} pt-14 pb-40 relative overflow-hidden`}>
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
              <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient} opacity-80 mix-blend-multiply`} />
            </div>
          ) : bannerImage ? (
            <div className="absolute inset-0 z-0">
              <div
                className="w-full h-full bg-cover bg-center opacity-40 mix-blend-overlay"
                style={{ backgroundImage: `url(${getImageUrl(bannerImage)})` }}
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient} opacity-80 mix-blend-multiply`} />
            </div>
          ) : (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              <div
                className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-5"
                style={{
                  background: cfg.accent,
                  filter: "blur(120px)",
                  transform: "translate(30%,-20%)",
                }}
              />
              <div
                className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-5"
                style={{
                  background: "#3b82f6",
                  filter: "blur(80px)",
                  transform: "translate(-20%,20%)",
                }}
              />
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#F8FAFC] z-0" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-2 text-sm text-white/50 mb-8 flex-wrap">
              <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/services" className="hover:text-white transition-colors">
                Services
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/80">{service.title}</span>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
                  {service.title}
                </h1>
                <p className="text-lg md:text-xl text-white/70 max-w-3xl leading-relaxed mb-8">
                  {service.shortDescription}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    className="font-black rounded-xl px-8 h-12 text-sm shadow-2xl transition-transform hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${cfg.accent}, #d97706)`,
                      color: "#001529",
                      boxShadow: `0 8px 24px ${cfg.accent}40`,
                    }}
                    asChild
                  >
                    <Link href="/contact">
                      Book Your {service.category === "IPO" ? "IPO" : "Service"} Consultancy
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outlineWhite" className="rounded-xl px-8 h-12 text-sm font-bold shadow-md">
                    <a href="tel:+917428337280">
                      <Phone className="mr-2 h-4 w-4" /> Call Us Now
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#001529] to-[#003380] py-10 -mt-1 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {trustStats.map((s, i) => (
                <div
                  key={i}
                  className="bg-white/8 backdrop-blur-sm border border-white/12 rounded-2xl p-5 text-center hover:bg-white/12 transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#f59e08]/20 flex items-center justify-center mx-auto mb-3">
                    <s.icon className="h-5 w-5 text-[#f59e08]" />
                  </div>
                  <div className="text-2xl font-black text-white mb-1">{s.value}</div>
                  <div className="text-white/55 text-xs font-semibold">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 relative -mt-6 rounded-t-[40px] bg-[#F8FAFC] z-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-14">{children}</div>

              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-5">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                    <div
                      className="h-2"
                      style={{ background: `linear-gradient(90deg, #001529, ${cfg.accent})` }}
                    />
                    <div className="p-7 text-center">
                      <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-5" style={{ background: "#001529" }}>
                        <Phone className="w-7 h-7 text-[#f59e08]" />
                      </div>
                      <h3 className="text-2xl font-black text-[#001529] mb-2">Ready to Start?</h3>
                      <p className="text-slate-500 mb-7 text-sm leading-relaxed">
                        Consult with our experts to understand how our <strong>{service.title}</strong> advisory can accelerate your growth journey.
                      </p>
                      <Button
                        className="w-full py-6 text-base font-black rounded-xl shadow-lg transition-transform hover:scale-105"
                        style={{
                          background: `linear-gradient(135deg, ${cfg.accent}, #d97706)`,
                          color: "#001529",
                          boxShadow: `0 4px 20px ${cfg.accent}40`,
                        }}
                        asChild
                      >
                        <Link href="/contact">
                          Contact Us <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                      </Button>
                      <div className="mt-5 pt-5 border-t border-slate-100">
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Or Call Us Directly At</p>
                        <a
                          href="tel:+917428337280"
                          className="text-lg font-black hover:underline"
                          style={{ color: "#001529" }}
                        >
                          +91-74283-37280
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div
                      className="px-6 py-4 border-b border-slate-100 flex items-center gap-3"
                      style={{ background: "#001529" }}
                    >
                      <Building2 className="h-4 w-4 text-[#f59e08]" />
                      <h3 className="font-black text-white text-sm uppercase tracking-widest">Related Services</h3>
                    </div>
                    <div className="p-3">
                      {servicesData
                        .filter((s) => s.slug !== slug && s.category === service.category)
                        .slice(0, 4)
                        .map((s, i) => (
                          <Link
                            key={i}
                            href={`/${s.slug}`}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{ background: `${cfg.accent}15` }}
                            >
                              <div
                                style={{ color: cfg.accent }}
                                className="[&>svg]:h-4 [&>svg]:w-4 flex items-center justify-center"
                              >
                                {s.id === "sme-ipo-consultant" ? (
                                  <Building2 className="h-4 w-4" />
                                ) : s.id === "mainline-ipo-consultant" ? (
                                  <TrendingUp className="h-4 w-4" />
                                ) : s.id === "fpo" ? (
                                  <TrendingUp className="h-4 w-4" />
                                ) : (
                                  <Globe className="h-4 w-4" />
                                )}
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-slate-700 group-hover:text-[#001529] leading-tight">
                              {s.title}
                            </span>
                            <ChevronRight className="h-4 w-4 text-slate-300 ml-auto group-hover:text-[#f59e08] transition-colors shrink-0" />
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 border-t border-slate-200">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-[#001529] mb-4">
              Benefits of Choosing <span className="text-[#f59e08]">India IPO</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {whyUs.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="bg-[#F8FAFC] rounded-2xl p-7 border border-slate-200 hover:shadow-lg transition-all group text-left"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#001529] to-[#003380] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <Icon className="h-7 w-7 text-[#f59e08]" />
                    </div>
                    <h3 className="text-base font-black text-[#001529] mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {recentBlogs.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-black text-[#001529] mb-12">
                Latest IPO <span className="text-[#f59e08]">Insights & Blogs</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentBlogs.map((blog, i) => (
                  <Link
                    key={i}
                    href={`/blogs/${blog.slug}`}
                    className="group bg-[#F8FAFC] border border-slate-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-[#f59e08]/30 transition-all flex flex-col h-full"
                  >
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img
                        src={
                          blog.image?.startsWith("http")
                            ? blog.image
                            : blog.image?.startsWith("uploads")
                            ? `/${blog.image}`
                            : blog.image?.startsWith("/uploads")
                            ? blog.image
                            : blog.image
                            ? `/uploads/${blog.image}`
                            : "/placeholder-ipo.jpg"
                        }
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-black text-[#001529] mb-3 group-hover:text-[#f59e08] transition-colors line-clamp-2 leading-tight">
                        {blog.title}
                      </h3>
                      <div className="mt-auto pt-5 border-t border-slate-200 flex items-center text-[#f59e08] font-black text-xs uppercase tracking-widest gap-2">
                        Read Full Insight <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <LatestNews />

        <section className="bg-gradient-to-r from-[#001529] via-[#002147] to-[#003380] py-20 text-center relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-5">
              Ready to Unlock Your Company's <span className="text-[#f59e08]">Full Financial Potential?</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto mb-10">
              Our first consultation is always free. Let our advisors assess your eligibility and explain the roadmap in detail.
            </p>
            <Button
              className="font-black rounded-xl px-10 h-14 text-base shadow-2xl transition-transform hover:scale-105"
              style={{ background: "linear-gradient(135deg, #f59e08, #d97706)", color: "#001529" }}
              asChild
            >
              <Link href="/contact">
                <Phone className="mr-2 h-5 w-5" /> Talk to an Expert
              </Link>
            </Button>
          </div>
        </section>
      </main>
      </div>
    </QueryClientProvider>
  );
};

export default ServicePageLayout;
