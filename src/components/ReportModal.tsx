import React, { useState } from "react";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, Download, Loader2, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { API_URL } from "@/lib/constants";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { getToken } = useRecaptcha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Please enter your email address");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.error("Please enter a valid email address");
    }

    setLoading(true);
    try {
      const recaptchaToken = await getToken('annual_report_form');
      const response = await fetch(`${API_URL}/api/annual-report-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, recaptchaToken }),
      });

      if (response.ok) {
        toast.success("Annual Report has been sent to your email!");
        setEmail("");
        onClose();
      } else {
        const data = await response.json();
        toast.error(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to send request. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none bg-transparent shadow-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all duration-300"
          >
            ✕
          </button>
          {/* Header Image/Pattern */}
          <div className="h-32 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-blue-400" />
            </div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-2">
                <Download className="w-6 h-6 text-white" />
              </div>
            </motion.div>
          </div>

          <div className="p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider mb-4">
                <Zap className="w-3 h-3 fill-blue-700" />
                Exclusive Access
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-3">
                Download Annual <br />
                <span className="text-blue-900">IPO Report 2025-26</span>
              </h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Enter your professional email below. We'll send the full 142+ page report directly to your inbox.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  type="email"
                  placeholder="Enter your professional email"
                  className="pl-11 h-14 bg-slate-50 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all text-slate-900 font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="flex items-center space-x-3 px-1">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 border-slate-300 accent-blue-900 rounded cursor-pointer"
                />
                <label
                  htmlFor="agree"
                  className="text-xs font-medium text-slate-600 leading-tight cursor-pointer select-none"
                >
                  I agree to receive Daily Reporter updates on email.
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading || !agreed}
                className={`w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${agreed
                  ? "bg-blue-900 hover:bg-blue-800 text-white shadow-blue-900/20"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Receive Report Now
                    <Download className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-green-500" />
                Trusted by 12k+
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-blue-500" />
                2025-2026 Edition
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
