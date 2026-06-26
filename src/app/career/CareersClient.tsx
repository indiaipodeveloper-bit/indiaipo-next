"use client";

import { useState, useEffect } from "react";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Send,
  Upload,
  CheckCircle2,
  Briefcase,
  User,
  Mail,
  Phone,
  GraduationCap,
  FileText,
  ArrowRight,
  Home,
  ChevronRight,
  Zap,
  Users,
  TrendingUp,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";
import { API_URL } from "@/lib/constants";

const N = "#001529",
  G = "#f59e08",
  G2 = "#d97706";

const inputClass = `w-full bg-[#F8FAFC] border border-slate-200 hover:border-[#001529]/30 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 text-sm font-medium`;

export default function CareersClient() {
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    email: "",
    phone: "",
    position_applied: "",
    experience: "",
    resume: "",
    coverletter: "",
  });
  const [roles, setRoles] = useState<string[]>([]);
  const { getToken } = useRecaptcha();

  useEffect(() => {
    const fetchActiveRoles = async () => {
      try {
        const res = await fetch(`${API_URL}/api/career/roles`);
        if (res.ok) {
          const data = await res.json();
          setRoles(data.map((r: any) => r.title));
        }
      } catch (err) {
        console.error("Failed to load active roles:", err);
      }
    };
    fetchActiveRoles();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Resume file size must be less than 5MB");
      return;
    }

    const fd = new FormData();
    fd.append("folder", "career");
    fd.append("file", file);
    setUploading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, resume: data.url }));
        toast.success("Resume uploaded successfully");
      } else {
        toast.error("Failed to upload resume");
      }
    } catch {
      toast.error("Error uploading file");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveResume = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData((prev) => ({ ...prev, resume: "" }));
    toast.info("Uploaded resume removed");
  };

  const getWordCount = (text: string) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      return toast.error("Mobile number must be exactly 10 digits");
    }

    if (formData.experience) {
      if (isNaN(Number(formData.experience))) {
        toast.error("Experience must be a valid number (e.g. 2, 2.5)");
        return;
      }
      const parts = formData.experience.split(".");
      if (parts[0].length > 2) {
        toast.error("Experience cannot have more than 2 digits before the decimal point");
        return;
      }
      if (parts.length === 2 && parts[1].length > 2) {
        toast.error("Experience can only have up to 2 decimal places");
        return;
      }
    }

    if (!formData.resume) {
      toast.error("Please upload your resume");
      return;
    }

    if (getWordCount(formData.coverletter) > 200) {
      toast.error("Cover letter must be less than 200 words");
      return;
    }

    setSubmitting(true);
    try {
      const recaptchaToken = await getToken("career_form");
      const res = await fetch("/api/career/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      });
      if (res.ok) {
        toast.success("Application submitted!");
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error("Failed to submit application");
      }
    } catch {
      toast.error("Error submitting application");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ background: "#F8FAFC" }}
      >
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center space-y-6 p-10 bg-white border border-slate-200 rounded-3xl shadow-xl"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
              style={{ background: "rgba(245,158,8,0.12)" }}
            >
              <CheckCircle2 className="h-10 w-10" style={{ color: G }} />
            </div>
            <h2 className="text-3xl font-black" style={{ color: N }}>
              Application Submitted!
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              Thank you for your interest in joining India IPO. Our HR team will
              review your application and get back to you soon.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="inline-flex items-center gap-2 px-8 h-12 rounded-xl font-black text-sm transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${N}, #003380)`,
                color: "white",
              }}
            >
              Return to Careers
            </button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#F8FAFC" }}
    >
      <Header />
      <main className="flex-grow">
        <section
          className="py-16 lg:py-24 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${N} 0%, #002147 55%, #003380 100%)`,
          }}
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-5"
              style={{
                background: G,
                filter: "blur(100px)",
                transform: "translate(25%,-25%)",
              }}
            />
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ background: `linear-gradient(90deg, ${N}, ${G}, ${N})` }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-8 flex-wrap">
              <Link
                href="/"
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/90 font-semibold">Careers</span>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-3xl"
            >
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
                Elevate Your Career with <span style={{ color: G }}>India IPO</span>
              </h1>
              <p className="text-white/65 text-base md:text-xl leading-relaxed mb-8">
                Be part of a dynamic team reshaping the future of capital
                markets in India. We value expertise, innovation, and passion
                for finance.
              </p>

              <div className="flex flex-wrap gap-3">
                {[
                  "Growth-Focused Culture",
                  "SEBI Expertise",
                  "Top-tier Finance Roles",
                  "Pan-India Offices",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.8)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    <Star className="h-3.5 w-3.5 mr-1" style={{ color: G }} fill={G} />
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section
          style={{ background: `linear-gradient(135deg, ${N}, #003380)` }}
          className="py-8"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, value: "50+", label: "Team Members" },
                { icon: TrendingUp, value: "500+", label: "IPOs Advised" },
                { icon: Zap, value: "8+", label: "Yrs Experience" },
                { icon: Star, value: "Pan-India", label: "Office Presence" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center py-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-2">
                    <s.icon className="h-5 w-5" style={{ color: G }} />
                  </div>
                  <p className="text-xl font-black text-white mb-0.5">
                    {s.value}
                  </p>
                  <p className="text-xs text-white/50 font-bold uppercase tracking-wide">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-4 space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="w-1 h-7 rounded-full"
                      style={{ background: G }}
                    />
                    <h2 className="text-2xl font-black" style={{ color: N }}>
                      Why Join Us?
                    </h2>
                  </div>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Join a collaborative environment where your ideas matter. We
                    offer competitive growth opportunities, a premium work
                    culture, and the chance to work with India's most dynamic
                    capital markets team.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      icon: CheckCircle2,
                      title: "Professional Growth",
                      desc: "Structured mentoring, training programs, and clear career advancement paths.",
                    },
                    {
                      icon: TrendingUp,
                      title: "Dynamic Environment",
                      desc: "Fast-paced, innovation-driven culture with real-world capital market exposure.",
                    },
                    {
                      icon: Star,
                      title: "Impactful Work",
                      desc: "Shape India's economic future by helping companies successfully list on exchanges.",
                    },
                    {
                      icon: Users,
                      title: "Elite Network",
                      desc: "Connect with SEBI professionals, merchant bankers, and top-tier consultants.",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-[#f59e08]/40 hover:shadow-md transition-all"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "rgba(0,21,41,0.06)" }}
                      >
                        <item.icon className="h-5 w-5" style={{ color: N }} />
                      </div>
                      <div>
                        <h4
                          className="font-black text-sm mb-1"
                          style={{ color: N }}
                        >
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="p-7 rounded-2xl text-white relative overflow-hidden"
                  style={{ background: N }}
                >
                  <div
                    className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10"
                    style={{
                      background: G,
                      filter: "blur(20px)",
                      transform: "translate(30%,-30%)",
                    }}
                  />
                  <h4 className="font-black text-lg mb-2">Have Questions?</h4>
                  <p className="text-white/55 text-sm mb-5 leading-relaxed font-medium">
                    Our HR team is here to help you throughout the application
                    process.
                  </p>
                  <a
                    href="mailto:info@indiaipo.in"
                    className="flex items-center gap-2 font-black text-sm transition-colors "
                    style={{ color: G }}
                  >
                    info@indiaipo.in
                  </a>
                </div>
              </div>

              <div className="lg:col-span-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden"
                >
                  <div
                    className="p-8 border-b border-slate-100"
                    style={{
                      background: `linear-gradient(135deg, ${N}, #003380)`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                        <Briefcase className="h-6 w-6" style={{ color: G }} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white">
                          Submit Your Application
                        </h3>
                        <p className="text-white/55 text-sm font-medium">
                          Complete the form below and attach your resume.
                        </p>
                      </div>
                    </div>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="p-8 md:p-10 space-y-7"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                          <User className="h-3 w-3" /> First Name *
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="John"
                          className={inputClass}
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                          <User className="h-3 w-3" /> Last Name
                        </label>
                        <input
                          type="text"
                          placeholder="Doe"
                          className={inputClass}
                          value={formData.last_name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              last_name: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                          <Mail className="h-3 w-3" /> Email Address *
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="john.doe@example.com"
                          className={inputClass}
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                          <Phone className="h-3 w-3" /> Phone Number *
                        </label>
                        <input
                          required
                          type="tel"
                          placeholder="Enter 10 digit mobile number"
                          maxLength={10}
                          className={inputClass}
                          value={formData.phone}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 10) {
                              setFormData({ ...formData, phone: value });
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                          <Briefcase className="h-3 w-3" /> Position Applied For
                        </label>
                        <select
                          required
                          className={`${inputClass} appearance-none cursor-pointer`}
                          value={formData.position_applied}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              position_applied: e.target.value,
                            })
                          }
                        >
                          <option value="" disabled>Select Position</option>
                          {roles.length > 0 ? (
                            roles.map((role) => (
                              <option key={role} value={role}>{role}</option>
                            ))
                          ) : (
                            <>
                              <option value="CEO">CEO</option>
                              <option value="Business Analyst">Business Analyst</option>
                              <option value="MERN Stack Developer">MERN Stack Developer</option>
                              <option value="IPO Advisory Specialist">IPO Advisory Specialist</option>
                              <option value="Sales Executive">Sales Executive</option>
                              <option value="HR Manager">HR Manager</option>
                              <option value="SEO & Content Writer">SEO & Content Writer</option>
                            </>
                          )}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                          <GraduationCap className="h-3 w-3" /> Experience (years)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 3.5"
                          className={inputClass}
                          value={formData.experience}
                          onChange={(e) => {
                            const value = e.target.value;
                            const sanitized = value.replace(/[^0-9.]/g, "");
                            const parts = sanitized.split(".");
                            let finalValue = sanitized;
                            if (parts.length > 2) {
                              finalValue = `${parts[0]}.${parts.slice(1).join("")}`;
                            }

                            const finalParts = finalValue.split(".");
                            if (finalParts[0].length > 2) {
                              finalParts[0] = finalParts[0].slice(0, 2);
                            }
                            if (finalParts.length === 2 && finalParts[1].length > 2) {
                              finalParts[1] = finalParts[1].slice(0, 2);
                            }
                            finalValue = finalParts.join(".");
                            setFormData({ ...formData, experience: finalValue });
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                        <FileText className="h-3 w-3" /> Resume / CV (PDF Only) *
                      </label>
                      <input
                        type="file"
                        accept=".pdf"
                        id="resume"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <label
                        htmlFor="resume"
                        className={`flex flex-col items-center justify-center w-full min-h-[120px] border-2 border-dashed rounded-2xl cursor-pointer transition-all ${formData.resume
                          ? "border-green-400/50 bg-green-50/30"
                          : "border-slate-200 bg-[#F8FAFC] hover:border-[#f59e08]/50 hover:bg-[#f59e08]/03"
                          }`}
                      >
                        {uploading ? (
                          <div className="flex flex-col items-center gap-2">
                            <div
                              className="h-8 w-8 border-4 rounded-full animate-spin"
                              style={{
                                borderColor: `${N} transparent transparent transparent`,
                              }}
                            />
                            <span className="text-xs font-black text-slate-400">
                              Uploading Resume…
                            </span>
                          </div>
                        ) : formData.resume ? (
                          <div className="flex flex-col items-center gap-3 p-4 w-full">
                            <div className="flex items-center gap-2 bg-green-50 px-4 py-2.5 rounded-xl border border-green-200">
                              <CheckCircle2
                                className="h-5 w-5 shrink-0"
                                style={{ color: "#16a34a" }}
                              />
                              <span
                                className="text-xs font-black truncate max-w-[250px]"
                                style={{ color: "#16a34a" }}
                              >
                                {formData.resume.split('/').pop() || "Resume Uploaded"}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest hover:text-[#001529] transition-colors">
                                Click to change
                              </span>
                              <div className="h-3 w-[1px] bg-slate-200" />
                              <button
                                type="button"
                                onClick={handleRemoveResume}
                                className="text-[10px] text-red-500 font-black uppercase tracking-widest hover:text-red-700 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="h-8 w-8 text-slate-300" />
                            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                              Click to select or drag PDF here
                            </span>
                          </div>
                        )}
                      </label>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                        <FileText className="h-3 w-3" /> Cover Letter / Why Join Us? (Max 200 words)
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Share your story and career goals…"
                        className={`${inputClass} resize-none`}
                        value={formData.coverletter}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (getWordCount(val) <= 205) {
                            setFormData({ ...formData, coverletter: val });
                          }
                        }}
                      />
                      <div className="flex justify-end">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${getWordCount(formData.coverletter) > 200 ? "text-red-500" : "text-slate-400"}`}
                        >
                          {getWordCount(formData.coverletter)} / 200 words
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting || uploading}
                        className="w-full h-14 rounded-2xl text-base font-black transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        style={{
                          background: `linear-gradient(135deg, ${N}, #003380)`,
                          color: "white",
                          boxShadow: "0 8px 32px rgba(0,21,41,0.25)",
                        }}
                      >
                        {submitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                            Processing…
                          </>
                        ) : (
                          <>
                            Send My Application <Send className="h-5 w-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
