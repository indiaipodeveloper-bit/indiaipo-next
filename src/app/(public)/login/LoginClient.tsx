"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  LogIn, Mail, Lock, Eye, EyeOff, TrendingUp,
  ShieldCheck, BarChart2, Zap, ChevronRight,
} from "lucide-react";
import loginPanelImg from "@/assets/login_panel1.webp";
import logoImg from "@/assets/India IPO Company Logo.jpg";

const stats = [
  { icon: <TrendingUp className="h-4 w-4" />, label: "Live IPO Tracking" },
  { icon: <ShieldCheck className="h-4 w-4" />, label: "SEBI Registered" },
  { icon: <BarChart2 className="h-4 w-4" />, label: "Real-time GMP" },
  { icon: <Zap className="h-4 w-4" />, label: "Instant Alerts" },
];

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login successful!");
      router.push("/admin");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const loginPanelImgSrc = typeof loginPanelImg === "string" ? loginPanelImg : loginPanelImg.src;
  const logoImgSrc = typeof logoImg === "string" ? logoImg : logoImg.src;

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col">
        {/* background image */}
        <img
          src={loginPanelImgSrc}
          alt="IPO Market"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* dark overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.75) 60%, rgba(15,23,42,0.95) 100%)",
          }}
        />

        {/* content over image */}
        <div className="relative z-10 flex flex-col justify-between h-full p-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <img src={logoImgSrc} alt="IndiaIPO Logo" className="h-9 w-auto" />
            <span className="text-white font-extrabold text-xl tracking-tight">
              India<span className="text-amber-400">IPO</span>
            </span>
          </motion.div>

          {/* Middle copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-700/20 border border-amber-600/30 text-amber-400 text-xs font-bold mb-5">
              <ShieldCheck className="h-3.5 w-3.5" />
              Official IPO Consultancy Platform
            </span>
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
              India's Premier<br />
              <span className="text-amber-400">IPO Intelligence</span><br />
              Platform
            </h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
              Track real-time GMP, analyse deep market insights, and invest in
              India's growth story with confidence.
            </p>

            {/* feature pills */}
            <div className="mt-8 flex flex-wrap gap-3">
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-amber-500/20 backdrop-blur-sm text-slate-200 text-sm shadow-[0_0_15px_rgba(251,191,36,0.05)]"
                >
                  <motion.span
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                      delay: i * 0.2
                    }}
                    className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                  >
                    {s.icon}
                  </motion.span>
                  <span className="font-medium">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="border-t border-white/10 pt-6"
          >
            <p className="text-slate-500 text-xs">
              © {new Date().getFullYear()} India IPO · Trusted by 10,000+ investors
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT PANEL (Form) ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 relative overflow-hidden">
        {/* subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* glow blobs */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-amber-700/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-blue-800/15 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <img src={logoImgSrc} alt="IndiaIPO" className="h-8 w-auto" />
            <span className="text-white font-extrabold text-lg">
              India<span className="text-amber-400">IPO</span>
            </span>
          </div>

          {/* Card */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-7">
              <div className="w-12 h-12 rounded-xl bg-amber-700/20 border border-amber-600/30 flex items-center justify-center mb-4">
                <LogIn className="h-6 w-6 text-amber-400" />
              </div>
              <h1 className="text-2xl font-extrabold text-white">Welcome Back</h1>
              <p className="text-slate-400 text-sm mt-1">
                Sign in to continue to your dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/50 focus:border-amber-600/60 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/50 focus:border-amber-600/60 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                id="login-submit"
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full py-3.5 bg-amber-700 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30 transition-all text-sm cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
