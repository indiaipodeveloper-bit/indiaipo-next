"use client";

import { useState, useEffect, useRef } from "react";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Loader2,
  Clock,
  Building2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Shield,
  Users,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { API_URL } from "@/lib/constants";
import { getImgSrc } from "@/utils/image";

const customEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: customEase,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } }
};

const faqs = [
  {
    q: "What services does India IPO offer?",
    a: "India IPO provides end-to-end IPO advisory services including pre-IPO funding, DRHP preparation, regulatory compliance, merchant banking, and post-listing support for both SME and Mainboard IPOs.",
  },
  {
    q: "How can I apply for an IPO through India IPO?",
    a: "You can apply through our platform by creating an account, linking your ASBA-enabled bank account or UPI ID, and submitting your application for any open IPO. Our team is available to guide you at every step.",
  },
  {
    q: "What is the typical response time for enquiries?",
    a: "We typically respond to all queries within 24 business hours. For urgent matters, you can reach us on our WhatsApp or call our office directly during business hours.",
  },
  {
    q: "Does India IPO assist with SME IPOs?",
    a: "Yes, we have a dedicated SME IPO desk that assists companies in raising capital through NSE Emerge and BSE SME platforms, offering complete end-to-end support.",
  },
  {
    q: "Is India IPO registered with SEBI?",
    a: "India IPO works in collaboration with official merchant bankers and intermediaries. We ensure all project execution follows the regulatory guidelines strictly.",
  },
];

const useCountUp = (target: number, duration = 4000) => {
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

            const eased = progress;

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

export default function ContactClient() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [bannerVideo, setBannerVideo] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { getToken } = useRecaptcha();

  const statsData = [
    { icon: <TrendingUp className="h-5 w-5" />, val: 500, suffix: "+", label: "IPOs Advised" },
    { icon: <Users className="h-5 w-5" />, val: 10000, suffix: "+", label: "Investors Served" },
    { icon: <Building2 className="h-5 w-5" />, val: 2, suffix: "", label: "Office Locations" },
    { icon: <Shield className="h-5 w-5" />, val: 24, suffix: "hrs", label: "Response Time" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current && window.innerWidth < 768) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        let nextScroll = scrollLeft + clientWidth;
        if (scrollLeft >= maxScroll - 10) nextScroll = 0;
        scrollRef.current.scrollTo({ left: nextScroll, behavior: 'smooth' });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_URL}/api/banners?page=${encodeURIComponent(pathname)}`);
        if (res.ok) {
          const data = await res.json();
          const activeBanner = data[0];
          if (activeBanner) {
            setBannerVideo(activeBanner.video_url);
            setBannerImage(activeBanner.image_url);
          }
        }
      } catch (err) { console.error(err); }
    };
    fetchBanners();
  }, [pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (form.phone && !phoneRegex.test(form.phone)) {
      toast.error("Please enter a valid 10-digit phone number (Numbers only).");
      setLoading(false);
      return;
    }

    if (form.message.length > 150) {
      toast.error(`Message is too long (${form.message.length}/150 characters). Please shorten it.`);
      setLoading(false);
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(form.name.trim())) {
      toast.error("Full name should contain only letters (no numbers allowed).");
      setLoading(false);
      return;
    }

    try {
      const recaptchaToken = await getToken('contact_form');
      const res = await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          company: form.company.trim() || null,
          subject: form.subject.trim() || null,
          message: form.message.trim(),
          recaptchaToken,
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      toast.success("Thank you! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", phone: "", company: "", subject: "", message: "" });
      console.log(res);
    } catch (err: any) {
      toast.error("Failed to submit. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const StatItem = ({ s }: { s: any }) => {
    const { count, ref } = useCountUp(s.val);
    return (
      <motion.div
        ref={ref}
        variants={fadeUp}
        whileHover={{ scale: 1.06, y: -4 }}
        className="flex flex-col items-center gap-2 py-5 px-4 rounded-2xl cursor-default"
        style={{
          background: "linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.06))",
          border: "1px solid rgba(255,255,255,0.25)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
      >
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, hsl(35 95% 52% / 0.3), hsl(45 93% 60% / 0.15))",
            color: "hsl(35 95% 45%)",
            border: "1px solid hsl(35 95% 52% / 0.25)",
          }}
        >
          {s.icon}
        </div>
        <span className="text-black font-extrabold text-2xl tracking-tight">
          {count.toLocaleString("en-IN")}{s.suffix}
        </span>
        <span className="text-black/65 text-xs text-center font-medium tracking-wide uppercase">{s.label}</span>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">

      <main>
        <section
          className="relative overflow-hidden"
          style={{
            minHeight: "520px",
          }}
        >
          {/* Background banner with blur */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: (!bannerVideo && bannerImage)
                ? ` url('${bannerImage}')`
                : "linear-gradient(135deg, hsl(222 47% 11%), hsl(222 47% 15%))",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: (!bannerVideo && bannerImage) ? "blur(5px)" : "none",
              transform: (!bannerVideo && bannerImage) ? "scale(1.05)" : "none",
            }}
          />
          {bannerVideo && (
            <div className="absolute inset-0 z-0">
              <video autoPlay muted loop playsInline
                className="w-full h-full object-cover opacity-25"
                src={getImgSrc(bannerVideo)}
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, hsl(222 47% 11% / 0.95) 0%, hsl(222 47% 15% / 0.5) 50%, hsl(222 47% 11% / 0.95) 100%)" }} />
            </div>
          )}

          {/* Animated gradient orbs */}
          <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-100px] right-[-60px] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
            style={{ background: "radial-gradient(circle, hsl(35 95% 52%) 0%, transparent 70%)" }}
          />
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.16, 0.08] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full pointer-events-none z-0"
            style={{ background: "radial-gradient(circle, hsl(222 47% 25%) 0%, transparent 70%)" }}
          />
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.06, 0.12, 0.06] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            className="absolute top-[30%] left-[40%] w-[300px] h-[300px] rounded-full pointer-events-none z-0"
            style={{ background: "radial-gradient(circle, hsl(222 47% 20%) 0%, transparent 70%)" }}
          />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

          <div className="container mx-auto px-4 text-center relative z-10 py-28">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black mb-5 leading-[1.12] tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Get In{" "}
              <span style={{ color: "#f99810" }}>
                Touch
              </span>{" "}
              With Us
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-black text-lg max-w-2xl mx-auto leading-relaxed mb-14"
            >
              Whether you're planning your IPO journey or looking for capital market advisory —
              our expert team is just a message away.
            </motion.p>

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-4 font-black max-w-3xl mx-auto"
            >
              {statsData.map((s) => (
                <StatItem key={s.label} s={s} />
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-16" style={{ background: "linear-gradient(180deg, #f0f4ff 0%, #f8faff 100%)" }}>
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: "hsl(220 72% 20%)", fontFamily: "var(--font-heading)" }}>
                Find Us <span style={{ color: "#f99810" }}>Anywhere</span>
              </h2>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {[
                {
                  icon: <MapPin className="h-5 w-5" />,
                  title: "Corporate Office",
                  lines: ["808, 8th Floor, D-Mall,", "Netaji Subhash Place, Pitampura,", "Delhi – 110034"],
                  gradient: "linear-gradient(135deg, hsl(35 95% 52%), hsl(45 93% 58%))",
                  accent: true,
                },
                {
                  icon: <Building2 className="h-5 w-5" />,
                  title: "Regional Office",
                  lines: ["Office No. 601,", "Shagun Insignia, Ulwe, Sector-19,", "Navi Mumbai – 410206"],
                  gradient: "linear-gradient(135deg, hsl(222 47% 11%), hsl(222 47% 20%))",
                  accent: false,
                },
                {
                  icon: <Mail className="h-5 w-5" />,
                  title: "Email Us",
                  lines: ["info@indiaipo.in"],
                  link: "mailto:info@indiaipo.in",
                  gradient: "linear-gradient(135deg, hsl(222 47% 11%), hsl(222 47% 20%))",
                  accent: false,
                },
                {
                  icon: <Phone className="h-5 w-5" />,
                  title: "Call Us",
                  lines: ["+91-74283-37280", "+91-9650637280"],
                  link: "tel:+917428337280",
                  gradient: "linear-gradient(135deg, hsl(222 47% 11%), hsl(222 47% 20%))",
                  accent: false,
                },
              ].map((card) => (
                <motion.div
                  key={card.title}
                  variants={fadeUp}
                  whileHover={{ y: -7, boxShadow: "0 20px 50px rgba(0,0,0,0.13)" }}
                  className="rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden shadow-2xl group cursor-default"
                  style={{
                    background: "white",
                    border: "1px solid hsl(222 47% 11% / 0.1)",
                    boxShadow: "0 4px 24px hsl(222 47% 11% / 0.05)",
                  }}
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ background: card.gradient }} />
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md"
                    style={{ background: card.gradient }}
                  >
                    {card.icon}
                  </div>
                  <h3 className="font-bold text-sm tracking-wide" style={{ color: "hsl(222 47% 11%)", fontFamily: "var(--font-heading)" }}>
                    {card.title}
                  </h3>
                  <div className="space-y-1">
                    {card.lines.map((l) =>
                      card.link ? (
                        <a key={l} href={card.link}
                          className="block text-sm font-semibold transition-colors hover:opacity-80"
                          style={{ color: "hsl(222 47% 30%)" }}>
                          {l}
                        </a>
                      ) : (
                        <p key={l} className="text-sm leading-relaxed" style={{ color: "hsl(220 15% 45%)" }}>{l}</p>
                      )
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Business hours bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-6 rounded-2xl p-5 flex flex-wrap items-center gap-4"
              style={{
                background: "linear-gradient(135deg, hsl(222 47% 11% / 0.06), hsl(35 95% 52% / 0.04))",
                border: "1px solid hsl(222 47% 11% / 0.12)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, hsl(222 47% 11%), hsl(222 47% 20%))", color: "white" }}>
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: "hsl(222 47% 11%)" }}>Business Hours</p>
                <p className="text-sm" style={{ color: "hsl(220 15% 50%)" }}>
                  Monday – Saturday &nbsp;|&nbsp; 10:00 AM – 6:00 PM IST &nbsp;|&nbsp; Sunday: Closed
                </p>
              </div>
              <a href="https://wa.me/917428337280" target="_blank" rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 shadow-md"
                style={{ background: "linear-gradient(135deg, #25D366, #128C7E)", color: "white" }}>
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-extrabold mb-3"
                style={{ color: "hsl(222 47% 11%)", fontFamily: "var(--font-heading)" }}
              >
                Find Us &amp;{" "}
                <span style={{ color: "#f99810" }}>
                  Send a Message
                </span>
              </motion.h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                Visit our offices or fill in the form — we will get back to you promptly.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
              <div className="flex flex-col gap-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="rounded-2xl overflow-hidden shadow-lg"
                  style={{ border: "1px solid rgba(220,228,255,0.8)", boxShadow: "0 8px 32px rgba(30,60,120,0.1)" }}
                >
                  <div className="px-5 py-3.5 flex items-center gap-3"
                    style={{ background: "linear-gradient(135deg, hsl(222 47% 11%), hsl(222 47% 20%))" }}>
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white font-bold text-sm tracking-wide">Corporate Office — Delhi</span>
                  </div>
                  <iframe
                    title="India IPO Corporate Office - Delhi"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3499.8902859954105!2d77.15012597626958!3d28.69292838133413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0319a7a9e009%3A0x98bb1b24bd793311!2sIndia%20IPO!5e0!3m2!1sen!2sin!4v1777024690897!5m2!1sen!2sin"
                    width="100%" height="240" style={{ border: 0, display: "block" }}
                    allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                  className="rounded-2xl overflow-hidden shadow-lg"
                  style={{ border: "1px solid rgba(255,220,180,0.6)", boxShadow: "0 8px 32px rgba(180,100,30,0.1)" }}
                >
                  <div className="px-5 py-3.5 flex items-center gap-3"
                    style={{ background: "linear-gradient(135deg, hsl(35 95% 52%), hsl(45 93% 60%))" }}>
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white font-bold text-sm tracking-wide">Regional Office — Navi Mumbai</span>
                  </div>
                  <iframe
                    title="India IPO Regional Office - Navi Mumbai"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.3456789!2d73.0285!3d18.9985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ef63a95ea0c1%3A0x1!2sUlwe%2C%20Sector%2019%2C%20Navi%20Mumbai%2C%20Maharashtra%20410206!5e0!3m2!1sen!2sin!4v1710000000001!5m2!1sen!2sin"
                    width="100%" height="240" style={{ border: 0, display: "block" }}
                    allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl overflow-hidden shadow-2xl"
                  style={{ border: "1px solid rgba(220,228,255,0.8)", boxShadow: "0 8px 48px rgba(30,60,120,0.12)" }}
                >
                  <div className="px-8 py-5" style={{ background: "linear-gradient(135deg, hsl(222 47% 11%), hsl(222 47% 20%))" }}>
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                      Send Us a Message
                    </h3>
                    <p className="text-white/70 text-xs mt-0.5">We'll respond within 24 business hours</p>
                  </div>

                  <div className="p-8 bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-xs font-bold text-slate-600 mb-1.5 block tracking-wide uppercase">
                          Full Name <span style={{ color: "hsl(35 95% 52%)" }}>*</span>
                        </label>
                        <Input
                          required
                          value={form.name}
                          onChange={(e) => {
                            const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                            setForm({ ...form, name: filtered });
                          }}
                          placeholder="Your full name"
                          maxLength={100}
                          className="border-slate-200 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-600 mb-1.5 block tracking-wide uppercase">
                          Email Address <span style={{ color: "hsl(35 95% 52%)" }}>*</span>
                        </label>
                        <Input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="your@email.com"
                          maxLength={255}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-600 mb-1.5 block tracking-wide uppercase">
                          Phone Number <span style={{ color: "hsl(35 95% 52%)" }}>*</span>
                          <span className="text-[10px] text-slate-400 font-normal ml-1 normal-case">(10 digits)</span>
                        </label>
                        <Input
                          required
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                          placeholder="e.g. 9876543210"
                          maxLength={10}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-600 mb-1.5 block tracking-wide uppercase">
                          Company Name
                          <span className="text-[10px] text-slate-400 font-normal ml-1 normal-case">(Max 50)</span>
                        </label>
                        <Input
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                          placeholder="Your company"
                          maxLength={50}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-xs font-bold text-slate-600 mb-1.5 block tracking-wide uppercase">
                        Subject
                        <span className="text-[10px] text-slate-400 font-normal ml-1 normal-case">(Max 50)</span>
                      </label>
                      <Input
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder="e.g. IPO Advisory, SME IPO"
                        maxLength={50}
                      />
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-bold text-slate-600 block tracking-wide uppercase">
                          Your Message <span style={{ color: "hsl(35 95% 52%)" }}>*</span>
                        </label>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${form.message.length >= 150 ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'}`}>
                          {form.message.length}/150
                        </span>
                      </div>
                      <Textarea
                        required
                        value={form.message}
                        onChange={(e) => {
                          if (e.target.value.length <= 150) {
                            setForm({ ...form, message: e.target.value });
                          }
                        }}
                        placeholder="Tell us about your IPO requirements or queries..."
                        rows={5}
                        maxLength={150}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full font-bold py-3 text-sm rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:scale-[1.01]"
                      style={{
                        background: "linear-gradient(135deg, hsl(222 47% 11%), hsl(222 47% 20%))",
                        color: "white",
                        boxShadow: "0 6px 24px hsl(222 47% 11% / 0.4)",
                      }}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                      {loading ? "Sending..." : "Send Message"}
                    </Button>

                    <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1.5">
                      <span>🔒</span> Your information is safe with us. We never share your data.
                    </p>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        <section
          className="py-20 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(222 47% 8%) 0%, hsl(222 47% 11%) 45%, hsl(222 47% 15%) 100%)" }}
        >
          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, hsl(35 95% 52%), transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-8 pointer-events-none" style={{ background: "radial-gradient(circle, hsl(222 47% 40%), transparent 70%)" }} />

          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <motion.h2
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-extrabold text-white mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Why Connect With{" "}
                <span style={{ color: "#f99810" }}>
                  India IPO?
                </span>
              </motion.h2>
              <p className="text-white/55 max-w-xl mx-auto">
                India's trusted capital market advisory platform with a decade of expertise.
              </p>
            </div>

            <motion.div
              variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="overflow-hidden"
            >
              <div ref={scrollRef} className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                {[
                  { icon: <Shield className="h-5 w-5" />, title: "Regulatory Compliance", desc: "All our advisory services follow the strict guidelines of SEBI and other regulatory bodies ensuring full compliance." },
                  { icon: <TrendingUp className="h-5 w-5" />, title: "End-to-End IPO Support", desc: "From DRHP drafting to listing day, we handle every aspect of your IPO journey with precision." },
                  { icon: <Users className="h-5 w-5" />, title: "Expert Team", desc: "Our team of seasoned investment bankers, CA professionals, and market analysts ensure the best outcomes." },
                  { icon: <Building2 className="h-5 w-5" />, title: "Pan-India Presence", desc: "With offices in Delhi and Navi Mumbai, we serve clients across the country with dedicated regional support." },
                  { icon: <MessageCircle className="h-5 w-5" />, title: "24-hr Response", desc: "We value your time. All enquiries receive a dedicated response within 24 business hours." },
                  { icon: <ArrowRight className="h-5 w-5" />, title: "SME & Mainboard", desc: "Whether it's an NSE Emerge SME IPO or a Mainboard listing, our advisors cater to every scale." },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={fadeUp}
                    whileHover={{ y: -5, boxShadow: "0 16px 48px rgba(0,0,0,0.3)" }}
                    className="shrink-0 w-[280px] md:w-auto rounded-2xl p-6 text-left flex gap-4 transition-all snap-center cursor-default"
                    style={{
                      background: "linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
                      border: "1px solid rgba(255,255,255,0.1)",
                      backdropFilter: "blur(16px)",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: "linear-gradient(135deg, hsl(35 95% 52% / 0.3), hsl(45 93% 60% / 0.15))", color: "hsl(35 95% 70%)", border: "1px solid hsl(35 95% 52% / 0.2)" }}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-sm mb-1.5 tracking-tight">{item.title}</h4>
                      <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20" style={{ background: "linear-gradient(180deg, #eef2ff 0%, #f4f7ff 100%)" }}>
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
              <motion.h2
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-extrabold mb-3"
                style={{ color: "hsl(220 72% 20%)", fontFamily: "var(--font-heading)" }}
              >
                Frequently Asked{" "}
                <span style={{ color: "#f99810" }}>
                  Questions
                </span>
              </motion.h2>
              <p className="text-slate-500">Got questions? We've answered the most common ones below.</p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: "white",
                    border: openFaq === i ? "1.5px solid hsl(220 72% 45% / 0.35)" : "1px solid rgba(220,228,255,0.7)",
                    boxShadow: openFaq === i ? "0 6px 32px rgba(30,60,120,0.1)" : "0 2px 12px rgba(30,60,120,0.05)",
                    transition: "all 0.25s ease",
                  }}
                >
                  <button
                    className="w-full flex items-center justify-between px-6 py-4.5 text-left"
                    style={{ paddingTop: "1.1rem", paddingBottom: "1.1rem" }}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-semibold text-sm pr-4" style={{ color: "hsl(220 72% 22%)" }}>
                      {faq.q}
                    </span>
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all"
                      style={{
                        background: openFaq === i ? "hsl(220 72% 45%)" : "hsl(220 72% 45% / 0.08)",
                        color: openFaq === i ? "white" : "hsl(220 72% 45%)",
                      }}
                    >
                      {openFaq === i ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "hsl(220 15% 45%)", borderTop: "1px solid hsl(220 72% 45% / 0.1)" }}>
                          <p className="pt-4">{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="py-20 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(222 47% 8%) 0%, hsl(222 47% 11%) 45%, hsl(222 47% 15%) 100%)" }}
        >
          {/* Animated gold orbs */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.28, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-60px] right-[-60px] w-80 h-80 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, hsl(35 95% 52%), transparent 70%)" }}
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[-40px] left-[-40px] w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, hsl(45 93% 60%), transparent 70%)" }}
          />

          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Ready to Begin Your IPO Journey?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/65 max-w-lg mx-auto mb-10 text-lg leading-relaxed"
            >
              Connect with our experts today and take the first step towards a successful public listing.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="tel:+917428337280"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:scale-105 hover:shadow-2xl"
                style={{ background: "#f99810", color: "white", }}
              >
                <Phone className="h-4 w-4" />
                Call Now: +91-74283-37280
              </a>
              <a
                href="mailto:info@indiaipo.in"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:scale-105"
                style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1.5px solid rgba(255,255,255,0.3)", backdropFilter: "blur(8px)" }}
              >
                <Mail className="h-4 w-4" />
                info@indiaipo.in
              </a>
            </motion.div>
          </div>
        </section>
      </main>

    </div>
  );
}