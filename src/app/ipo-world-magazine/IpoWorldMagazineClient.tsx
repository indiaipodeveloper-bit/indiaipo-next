"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Calendar, Lock, Unlock, ArrowRight, ChevronLeft, ChevronRight, X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { toast } from "sonner";

interface Magazine {
  id: string | number;
  title: string;
  pdf: string;
  language: string;
  pdf_lock: boolean | number;
  report_images: string;
  created_at?: string;
  updated_at?: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

interface IpoWorldMagazineClientProps {
  initialMagazines: Magazine[];
  initialPagination: PaginationData | null;
  initialLanguage: "english" | "hindi";
}

const translations = {
  english: {
    heroBadge: "Monthly Publication",
    heroTitle: "IPO World Magazine",
    heroSubtitle: "India's only magazine dedicated 100% to IPOs. From education to execution, we cover everything you need to know.",
    englishEdition: "English Edition",
    hindiEdition: "Hindi Edition",
    noMagazines: "No Magazines Found",
    noMagazinesDesc: "We haven't uploaded any english magazines yet. Please check back later.",
    subscribeToRead: "Subscribe to Read",
    readNow: "Read Now",
    premiumEdition: "Premium Edition",
    readMagazine: "Read Magazine",
    previous: "Previous",
    next: "Next",
    neverMiss: "Never Miss An Edition",
    neverMissDesc: "Subscribe to IPO World and get exclusive access to all premium editions, in-depth reports, and market insights delivered to you.",
    subscribeNow: "SUBSCRIBE NOW",
    joinNewsletter: "Join Newsletter",
    premiumContent: "Premium Content",
    premiumContentDesc: "This edition of IPO World Magazine is exclusive to our premium subscribers. Subscribe now to unlock this and all other premium editions.",
    maybeLater: "Maybe Later",
    free: "FREE",
    premium: "PREMIUM"
  },
  hindi: {
    heroBadge: "मासिक प्रकाशन",
    heroTitle: "आईपीओ वर्ल्ड मैगजीन",
    heroSubtitle: "भारत की एकमात्र मैगजीन जो 100% आईपीओ को समर्पित है। शिक्षा से लेकर क्रियान्वयन तक, हम वह सब कुछ कवर करते हैं जो आपको जानना आवश्यक है।",
    englishEdition: "अंग्रेजी संस्करण",
    hindiEdition: "हिंदी संस्करण",
    noMagazines: "कोई मैगजीन नहीं मिली",
    noMagazinesDesc: "हमने अभी तक कोई हिंदी मैगजीन अपलोड नहीं की है। कृपया बाद में दोबारा जांचें।",
    subscribeToRead: "पढ़ने के लिए सब्सक्राइब करें",
    readNow: "अभी पढ़ें",
    premiumEdition: "प्रीमियम संस्करण",
    readMagazine: "मैगजीन पढ़ें",
    previous: "पिछला",
    next: "अगला",
    neverMiss: "कभी कोई अंक न चूकें",
    neverMissDesc: "आईपीओ वर्ल्ड को सब्सक्राइब करें और सभी प्रीमियम संस्करणों, गहन रिपोर्टों और बाजार अंतर्दृष्टि तक विशेष पहुंच प्राप्त करें जो आप तक पहुंचाई जाएगी।",
    subscribeNow: "अभी सब्सक्राइब करें",
    joinNewsletter: "न्यूज़लेटर से जुड़ें",
    premiumContent: "प्रीमियम सामग्री",
    premiumContentDesc: "आईपीओ वर्ल्ड मैगजीन का यह संस्करण हमारे प्रीमियम ग्राहकों के लिए विशिष्ट है। इसे और अन्य सभी प्रीमियम संस्करणों को अनलॉक करने के लिए अभी सब्सक्राइब करें।",
    maybeLater: "बाद में",
    free: "मुफ्त",
    premium: "प्रीमियम"
  }
};

export default function IpoWorldMagazineClient({
  initialMagazines,
  initialPagination,
  initialLanguage
}: IpoWorldMagazineClientProps) {
  const [language, setLanguage] = useState<"english" | "hindi">(initialLanguage);
  const [page, setPage] = useState(1);
  const [magazines, setMagazines] = useState<Magazine[]>(initialMagazines);
  const [pagination, setPagination] = useState<PaginationData | null>(initialPagination);
  const [loading, setLoading] = useState(false);

  const t = translations[language];
  const [showLockModal, setShowLockModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { getToken } = useRecaptcha();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      return toast.error("Please enter your email address");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.error("Please enter a valid email address");
    }

    setSubmitting(true);
    try {
      const recaptchaToken = await getToken('magazine_subscribe');
      const r = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, recaptchaToken }),
      });

      if (r.ok) {
        toast.success("Thank you for subscribing!");
        setEmail("");
        setShowSubscribeModal(false);
      } else {
        const err = await r.json();
        toast.error(err.error || "Subscription failed. Please try again.");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchMagazines = async (lang: "english" | "hindi", currentPage: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/magazines?page=${currentPage}&limit=8&language=${lang}`);
      if (res.ok) {
        const body = await res.json();
        setMagazines(body.data || []);
        setPagination(body.pagination || null);
      }
    } catch (err) {
      console.error("Failed to load magazines client-side:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (lang: "english" | "hindi") => {
    setLanguage(lang);
    setPage(1);
    fetchMagazines(lang, 1);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    fetchMagazines(language, p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-[#001529] text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#003366_0%,transparent_100%)]" />
            <div className="grid grid-cols-8 h-full">
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-white/20" />
              ))}
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                {language === 'hindi' ? (
                  <>आईपीओ <span className="text-blue-400">वर्ल्ड</span> मैगजीन</>
                ) : (
                  <>IPO <span className="text-blue-400">World</span> Magazine</>
                )}
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed text-sm">
                {t.heroSubtitle}
              </p>
            </motion.div>

            {/* Language Switcher */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => handleLanguageChange("english")}
                className={`px-8 py-3 rounded-full font-bold transition-all duration-300 cursor-pointer ${language === "english"
                    ? "bg-white text-[#001529] shadow-xl shadow-white/10 scale-105"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  }`}
              >
                {t.englishEdition}
              </button>
              <button
                onClick={() => handleLanguageChange("hindi")}
                className={`px-8 py-3 rounded-full font-bold transition-all duration-300 cursor-pointer ${language === "hindi"
                    ? "bg-[#e6b800] text-[#001529] shadow-xl shadow-[#e6b800]/20 scale-105"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  }`}
              >
                {t.hindiEdition}
              </button>
            </div>
          </div>
        </div>

        {/* Magazine Grid */}
        <div className="container mx-auto px-4 py-16">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted rounded-2xl mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : magazines.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
              <h3 className="text-xl font-semibold mb-2">{t.noMagazines}</h3>
              <p className="text-muted-foreground">{t.noMagazinesDesc}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
                {magazines.map((mag, idx) => (
                  <motion.div
                    key={mag.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
                      {/* Cover Image */}
                      <div className="relative aspect-[3/4.2] overflow-hidden bg-muted">
                        <img
                          src={getImageUrl(mag.report_images)}
                          alt={mag.title}
                          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Overlay Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          <Badge className={`${mag.language === 'hindi' ? "bg-orange-500" : "bg-blue-600"} border-none text-white font-bold px-3 py-1`}>
                            {mag.language === 'hindi' ? 'हिंदी' : 'ENGLISH'}
                          </Badge>
                          {Number(mag.pdf_lock) === 1 ? (
                            <Badge className="bg-amber-500 border-none text-white font-bold px-3 py-1 flex items-center gap-1.5 shadow-lg">
                              <Lock className="h-3 w-3" /> {t.premium}
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-500 border-none text-white font-bold px-3 py-1 flex items-center gap-1.5 shadow-lg">
                              <Unlock className="h-3 w-3" /> {t.free}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Details & Actions */}
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                          <Calendar className="h-3 w-3 text-[#f59e08]" />
                          {mag.created_at
                            ? new Date(mag.created_at).toLocaleDateString(
                              language === "hindi" ? "hi-IN" : "en-IN",
                              { month: "long", year: "numeric" }
                            )
                            : "N/A"}
                        </div>
                        <h3 className="text-lg font-bold mb-6 line-clamp-2 leading-tight group-hover:text-primary transition-colors text-[#001529]">
                          {mag.title}
                        </h3>

                        <div className="mt-auto space-y-3">
                          {Number(mag.pdf_lock) === 1 ? (
                            <Button
                              onClick={() => setShowLockModal(true)}
                              className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold py-6 border-none shadow-lg transition-all cursor-pointer"
                            >
                              {t.subscribeToRead}
                            </Button>
                          ) : (
                            <Button
                              asChild
                              className="w-full rounded-xl bg-[#001529] text-white hover:bg-[#003366] font-bold py-6 shadow-lg transition-all cursor-pointer border-0"
                            >
                              <Link href={`/ipo-world-magazine/view/${mag.id}`}>
                                {t.readNow}
                              </Link>
                            </Button>
                          )}

                          <div className="pt-2">
                            {Number(mag.pdf_lock) === 1 ? (
                              <Button
                                onClick={() => setShowLockModal(true)}
                                variant="ghost"
                                className="w-full justify-between text-amber-600 hover:text-amber-700 hover:bg-amber-50 group/btn font-bold rounded-xl cursor-pointer"
                              >
                                <span>{t.premiumEdition}</span>
                                <Lock className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                              </Button>
                            ) : (
                              <Button
                                asChild
                                variant="ghost"
                                className="w-full justify-between text-primary hover:text-primary hover:bg-primary/5 group/btn font-bold rounded-xl cursor-pointer"
                              >
                                <Link href={`/ipo-world-magazine/view/${mag.id}`}>
                                  <span>{t.readMagazine}</span>
                                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-16">
                  <Button
                    variant="outline"
                    className="rounded-xl border-border h-11 px-4 cursor-pointer"
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-5 w-5 mr-1" /> {t.previous}
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                      <Button
                        key={p}
                        variant={page === p ? "default" : "outline"}
                        className={`w-11 h-11 rounded-xl font-bold cursor-pointer ${page === p ? "bg-[#001529] text-white shadow-lg border-0" : "border-border"
                          }`}
                        onClick={() => handlePageChange(p)}
                      >
                        {p}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="rounded-xl border-border h-11 px-4 cursor-pointer"
                    onClick={() => handlePageChange(Math.min(pagination.totalPages, page + 1))}
                    disabled={page === pagination.totalPages}
                  >
                    {t.next} <ChevronRight className="h-5 w-5 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Subscription Promo */}
        <section className="bg-muted/30 py-20 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="bg-[#001529] rounded-[2rem] p-8 md:p-16 relative overflow-hidden text-center text-white border border-white/5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 blur-[100px]" />
              <h2 className="text-3xl md:text-5xl font-bold mb-6">{t.neverMiss}</h2>
              <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
                {t.neverMissDesc}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-[#e6b800] text-[#001529] font-black px-10 py-7 rounded-2xl text-lg shadow-2xl shadow-[#e6b800]/40 uppercase hover:bg-amber-400 transition-all cursor-pointer border-0"
                >
                  <a href="https://ipoworld.indiaipo.in/" target="_blank" rel="noopener noreferrer">
                    {t.subscribeNow}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Lock Modal */}
      <Dialog open={showLockModal} onOpenChange={setShowLockModal}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none rounded-3xl bg-transparent">
          <div className="bg-gradient-to-br from-[#001529] to-[#003366] p-10 text-center text-white relative border border-white/10 rounded-3xl">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />

            <div className="w-20 h-20 bg-amber-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-amber-500/30 shadow-lg">
              <Lock className="h-10 w-10 text-amber-500" />
            </div>

            <h2 className="text-3xl font-bold mb-4">{t.premiumContent}</h2>
            <p className="text-white/70 mb-8 leading-relaxed text-sm">
              This edition of IPO World Magazine is exclusive to our premium subscribers. Subscribe now to unlock this and all other premium editions.
            </p>

            <div className="space-y-4">
              <Button
                className="w-full bg-[#e6b800] hover:bg-[#ffcc00] text-[#001529] font-black py-7 rounded-2xl text-lg shadow-xl shadow-[#e6b800]/20 cursor-pointer border-0"
              >
                <a href="https://ipoworld.indiaipo.in/">SUBSCRIBE NOW</a>
              </Button>
              <Button
                variant="ghost"
                className="w-full text-white/50 hover:text-white hover:bg-white/5 font-bold py-6 rounded-2xl cursor-pointer"
                onClick={() => setShowLockModal(false)}
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
