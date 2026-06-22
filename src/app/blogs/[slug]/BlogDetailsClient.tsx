"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EditorialTeamInfo from "@/components/EditorialTeamInfo";
import {
  Loader2, Calendar, TrendingUp, ArrowRight,
  HelpCircle, Flame, Zap, Home, Newspaper, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { getImgSrc } from "@/utils/image";

interface RelatedBlog {
  id: string;
  title: string;
  slug: string;
  image: string;
  category: string;
  created_at: string;
  updated_at?: string;
  description?: string;
}

interface AdminBlogFull {
  id: string; title: string; slug: string;
  image: string; content: string; faqs: string; status: string;
  category: string; description: string;
  meta_title: string; keyword: string;
  created_at: string;
  updated_at?: string;
}

const cleanGarbledText = (text: string) => {
  if (!text) return "";
  let result = String(text)
    .replace(/\\u20b9/g, "₹")
    .replace(/\\u20b5/g, "₹")
    .replace(/&nbsp;/g, " ")
    .trim();

  if (result.startsWith('"') && result.endsWith('"') && result.length >= 2) {
    result = result.substring(1, result.length - 1);
  }
  return result;
};

const hasHtmlTags = (str: string) => /<[a-z][\s\S]*>?/i.test(str);

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

const linkifyMerchantBankers = (html: string, bankers: any[]) => {
  return html;
};

const seoInterlink = (html: string) => {
  if (!html) return html;

  const rules = [
    {
      keyword: "check IPO eligibility",
      url: "/ipo-eligibility-check",
      limit: 2,
    },
    {
      keyword: "SME IPO consultant",
      url: "/sme-ipo-consultant",
      limit: 1,
    },
    {
      keyword: "SME IPO guide",
      url: "/blogs/sme-ipo-guide-india",
      limit: 1,
    },
    {
      keyword: "live IPO tracker",
      url: "/sme-ipos",
      limit: 1,
    },
  ];

  let tempHtml = html;

  rules.forEach(({ keyword, url, limit }) => {
    const escapedKeyword = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const patternStr = escapedKeyword.replace(/ /g, "\\s+");

    const regex = new RegExp(
      `(<a[^>]*>[\\s\\S]*?</a>|<[^>]+>)|(${patternStr})`,
      "gi"
    );

    let count = 0;
    tempHtml = tempHtml.replace(regex, (match, tag, text) => {
      if (tag) {
        return match;
      }
      if (count < limit) {
        count++;
        return `<a href="${url}" class="font-bold hover:underline text-[#1e40af]" style="font-weight: 800; text-decoration: underline; color: #1e40af;">${match}</a>`;
      }
      return match;
    });
  });

  return tempHtml;
};

const ArticleRenderer = ({ content, bankers }: { content: string; bankers?: any[] }) => {
  const router = useRouter();

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest("a");
    if (anchor && anchor.getAttribute("href")?.startsWith("/merchant-banker/")) {
      e.preventDefault();
      const href = anchor.getAttribute("href");
      if (href) {
        router.push(href);
      }
    }
  };

  if (!content) return <p className="text-slate-400 italic">No content available.</p>;

  const cleanContent = cleanGarbledText(content);

  if (hasHtmlTags(cleanContent)) {
    let processedContent = getCleanBlogContent(cleanContent);
    processedContent = linkifyMerchantBankers(processedContent, bankers || []);
    processedContent = seoInterlink(processedContent);
    return (
      <>
        <style>{`
          .article-prose { color: #334155; }
          .article-prose p { margin-bottom: 2rem; line-height: 2; font-size: 1.125rem; font-weight: 400; color: #475569; }
          .article-prose h2 {
            font-size: 1.45rem;
            font-weight: 900;
            color: #001529;
            margin-top: 2.5rem;
            margin-bottom: 1rem;
            padding: 0.85rem 1.25rem;
            background: linear-gradient(90deg, #f0f6ff 0%, #f8fafc 100%);
            border-left: 4px solid #f59e08;
            border-radius: 0 0.75rem 0.75rem 0;
            position: relative;
            overflow: hidden;
            line-height: 1.35;
          }
          .article-prose h2::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(180deg, #f59e08, #d97706);
            border-radius: 2px;
          }
          .article-prose h3,
          .article-prose h5 {
            font-weight: 800;
            margin-top: 2rem;
            margin-bottom: 0.75rem;
            padding: 0.6rem 1rem;
            background: #f8fafc;
            border-radius: 0 0.5rem 0.5rem 0;
            line-height: 1.35;
          }
          .article-prose h3 {
            font-size: 1.15rem;
            color: #001529;
            border-left: 3px solid #001529;
          }
          .article-prose h5 {
            font-size: 1.025rem;
            color: #475569;
            border-left: 3px solid #f59e08;
          }
          .article-prose strong { color: #0f172a; font-weight: 700; }
          .article-prose ul { list-style-type: none !important; padding: 0; margin: 2rem 0; background: #f8fafc; padding: 2rem; border-radius: 1.5rem; border: 1px solid #f1f5f9; }
          .article-prose ul li { align-items: flex-start; gap: 0.75rem; margin-bottom: 1rem; color: #475569; font-size: 1.05rem; list-style: none !important; }
          .article-prose ul li:last-child { margin-bottom: 0; }
          .article-prose ul li::before { content: '→'; color: #3b82f6; font-weight: 900; flex-shrink: 0; margin-top: 0.1rem; }
          .article-prose ol { padding-left: 1.5rem; margin: 2rem 0; counter-reset: item; list-style-type: none !important; }
          .article-prose ol li { margin-bottom: 1rem; color: #475569; font-size: 1.05rem; position: relative; list-style: none !important; }
          .article-prose ol li::before { content: counter(item) "."; counter-increment: item; position: absolute; left: -1.75rem; font-weight: 800; color: #3b82f6; }
          .article-prose blockquote { margin: 3rem 0; padding: 2.5rem; border-left: 6px solid #f59e0b; background: linear-gradient(to right, #fffbeb, transparent); border-radius: 0 1.5rem 1.5rem 0; font-style: italic; color: #78350f; font-size: 1.25rem; line-height: 1.6; font-weight: 500; }
          .article-prose img { border-radius: 1.5rem; width: 100%; margin: 3.5rem 0; box-shadow: 0 20px 50px -15px rgba(0,0,0,0.15); border: 1px solid #f1f5f9; }
          .article-prose table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 3rem 0; font-size: 0.95rem; border-radius: 1rem; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .article-prose th { background: #1e293b; color: #ffffff; font-weight: 600; padding: 1.25rem; text-align: left; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem; }
          .article-prose td { background: #ffffff; border-bottom: 1px solid #f1f5f9; padding: 1.25rem; color: #475569; font-weight: 500; }
          .article-prose tr:last-child td { border-bottom: none; }
          .article-prose tr:hover td { background: #f8fafc; }
          @media (max-width: 768px) {
            .article-prose h2 { font-size: 1.75rem; margin-top: 3rem; }
            .article-prose h3 { font-size: 1.4rem; }
            .article-prose h5 { font-size: 1.2rem; }
            .article-prose p { font-size: 1rem; }
          }
        `}</style>
        <div className="article-prose" dangerouslySetInnerHTML={{ __html: processedContent }} onClick={handleContentClick} />
      </>
    );
  }

  return (
    <div
      className="text-slate-600 whitespace-pre-wrap leading-relaxed text-lg"
      dangerouslySetInnerHTML={{ __html: seoInterlink(linkifyMerchantBankers(cleanContent, bankers || [])) }}
      onClick={handleContentClick}
    />
  );
};

const FAQAccordionItem = ({
  faq,
  index,
}: {
  faq: { question: string; answer: string };
  index: number;
}) => {
  const [isOpen, setIsOpen] = useState(index === 0);
  return (
    <div className="border-b border-slate-100 last:border-0 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left transition-colors hover:bg-slate-50/50 group"
      >
        <div className="flex gap-3">
          <span
            className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white mt-0.5 shadow-sm"
            style={{ background: "#3b82f6" }}
          >
            Q
          </span>
          <span className="font-bold text-slate-800 text-sm leading-tight transition-colors group-hover:text-blue-600">
            {faq.question}
          </span>
        </div>
        <div
          className={`shrink-0 w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center transition-transform duration-300 ${isOpen ? "rotate-180 bg-blue-50" : ""}`}
        >
          <HelpCircle
            className={`w-3 h-3 ${isOpen ? "text-blue-600" : "text-slate-300"}`}
          />
        </div>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="pb-5 pl-[44px]">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-600 leading-relaxed">
            {faq.answer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BlogDetailsClient({
  initialBlog,
  slug,
}: {
  initialBlog: AdminBlogFull;
  slug: string;
}) {
  const router = useRouter();
  const [blog, setBlog] = useState<AdminBlogFull>(initialBlog);
  useEffect(() => {
    setBlog(initialBlog);
  }, [initialBlog]);
  const [loading, setLoading] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<RelatedBlog[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [bankers, setBankers] = useState<any[]>([]);
  const [trendingNews, setTrendingNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news?limit=9");
        if (res.ok) {
          const data = await res.json();
          const items = data.data || [];
          const trending = items.filter((item: any) => item.trending_news === 1 || item.trending_news === "1");
          if (trending.length > 0) {
            setTrendingNews(trending.slice(0, 4));
          } else {
            setTrendingNews(items.slice(0, 4));
          }
        }
      } catch (err) {
        console.error("Failed to fetch trending news for sidebar:", err);
      } finally {
        setNewsLoading(false);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const fetchAllBankers = async () => {
      try {
        const res = await fetch("/api/bankers?all=true");
        if (res.ok) {
          const data = await res.json();
          setBankers(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch bankers:", err);
      }
    };
    fetchAllBankers();
  }, []);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.pageYOffset;
        setScrollProgress((currentScroll / totalScroll) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [slug]);

  useEffect(() => {
    if (!blog) return;
    const fetchRelated = async () => {
      try {
        const res = await fetch(`/api/admin-blogs?limit=5&category=ipo_blogs&summary=1`);
        if (res.ok) {
          const data = await res.json();
          setRelatedArticles((data.data || []).filter((b: any) => b.slug !== slug).slice(0, 6));
        }
      } catch { }
    };
    fetchRelated();
  }, [blog, slug]);

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-blue-100 selection:text-blue-900">
      <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-slate-100">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <Header />

      <div className="relative overflow-hidden pt-6 md:pt-12 pb-16 bg-slate-50 group">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 -skew-x-12 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50/30 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex flex-wrap items-center gap-2 mb-8 text-xs text-slate-500 font-bold">
                <Link href="/" className="hover:text-blue-600 flex items-center gap-1.5 transition-colors">
                  <Home className="h-3.5 w-3.5" /> Home
                </Link>
                <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                <Link href="/blogs" className="hover:text-blue-600 transition-colors">Blogs</Link>
                <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                <span className="text-slate-800 truncate max-w-[200px] sm:max-w-[400px]">{blog.title}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-4xl font-black text-slate-900 leading-[1.1] tracking-tight mb-10 max-w-4xl">
                {blog.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 mb-16 relative z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-7xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group/hero-img flex items-center justify-center min-h-[300px] md:min-h-[400px]"
        >
          <img
            src={getImgSrc(blog.image) || "/placeholder.jpg"}
            alt={blog.title}
            className="w-full h-full max-h-[600px] object-contain transition-transform duration-1000 group-hover/hero-img:scale-105"
          />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-8">
          <div className="mb-16">
            <ArticleRenderer content={blog.content} bankers={bankers} />
            <style>{`
              .article-prose {
                font-family: 'Inter', sans-serif;
                color: #1e293b;
                line-height: 1.8;
              }
              .article-prose h2 {
                font-size: 1.875rem;
                font-weight: 900;
                color: #0f172a;
                margin-top: 3rem;
                margin-bottom: 1.5rem;
                letter-spacing: -0.025em;
              }
              .article-prose p {
                margin-bottom: 1.5rem;
                font-size: 1.125rem;
              }
              .article-prose img {
                border-radius: 1rem;
                margin: 3rem 0;
                box-shadow: 0 20px 50px rgba(0,0,0,0.1);
                max-width: 100%;
                height: auto;
                display: block;
                margin-left: 0;
                max-height: 500px;
                object-fit: contain;
              }
              .article-prose strong {
                color: #0f172a;
                font-weight: 700;
              }
            `}</style>
          </div>

          {blog.faqs && (() => {
            let faqItems: { question: string; answer: string }[] = [];
            try {
              const parsed = JSON.parse(blog.faqs);
              if (Array.isArray(parsed)) {
                faqItems = parsed
                  .filter((f: any) => f && f.question && f.answer)
                  .map((f: any) => ({
                    question: cleanGarbledText(String(f.question)),
                    answer: cleanGarbledText(String(f.answer)),
                  }));
              }
            } catch (e) { }
            if (faqItems.length === 0) return null;
            return (
              <div className="mb-16 bg-white rounded-[2rem] p-6 md:p-8 border border-slate-200 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">Frequently Asked Questions</h3>
                    <p className="text-xs text-slate-500 font-medium">Find answers to common questions about this article</p>
                  </div>
                </div>
                <div className="divide-y divide-slate-100">
                  {faqItems.map((faq, idx) => (
                    <FAQAccordionItem key={idx} faq={faq} index={idx} />
                  ))}
                </div>
              </div>
            );
          })()}

          <EditorialTeamInfo />
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-28 space-y-8">
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden group/side">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center justify-between">
                <span>Next Reading</span>
                <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              </p>

              <div className="space-y-8">
                {relatedArticles.map((item) => (
                  <Link key={item.id} href={`/blogs/${item.slug}`} className="group/item block relative">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-md border-2 border-white group-hover/item:scale-105 transition-all duration-500">
                        <img
                          src={getImgSrc(item.image) || "/placeholder.jpg"}
                          alt={item.title}
                          className="w-full h-full object-cover grayscale-[0.5] group-hover/item:grayscale-0 transition-all duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1.5 block">
                          Blogs
                        </span>
                        <p className="text-[13px] font-black text-slate-800 line-clamp-2 leading-[1.3] group-hover/item:text-blue-600 transition-colors">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-2 mt-2 opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all">
                          <span className="text-[10px] font-black text-slate-400">READ NOW</span>
                          <ArrowRight className="w-3 h-3 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                <Link href="/blogs" className="text-[11px] font-black text-blue-600 uppercase tracking-widest hover:tracking-[0.25em] transition-all">
                  Explore Full Archive
                </Link>
              </div>
            </div>

            <div className="bg-[#001529] rounded-[2.5rem] p-10 text-white relative overflow-hidden group/cta shadow-2xl shadow-blue-900/40">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-[80px] opacity-20 group-hover/cta:opacity-40 transition-opacity" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500 rounded-full blur-[80px] opacity-10" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-amber-400 fill-amber-400" />
                </div>
                <p className="text-2xl font-black mb-3 leading-[1.1]">Strategic IPO Planning</p>
                <p className="text-white/50 text-[11px] font-medium mb-8 leading-relaxed">
                  Join hundreds of founders who scaled their vision with India's most trusted public listing advisory network.
                </p>
                <Link href="/ipo-eligibility-check" className="group/btn relative w-full h-14 flex items-center justify-center bg-white text-[#001529] rounded-2xl font-black text-xs uppercase tracking-widest overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-white/5">
                  <span className="relative z-10 flex items-center gap-2">Verify Eligibility <ArrowRight className="w-4 h-4" /></span>
                  <div className="absolute inset-0 bg-blue-50 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden group/side">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center justify-between">
                <span>Quick IPO Resources</span>
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </p>

              <div className="space-y-4">
                {[
                  {
                    label: "Check IPO Eligibility",
                    url: "/ipo-eligibility-check",
                    desc: "Verify if your company is ready for IPO",
                    bg: "bg-blue-50/50 hover:bg-blue-100/50 border-blue-100 text-blue-700",
                  },
                  {
                    label: "SME IPO Consultant",
                    url: "/sme-ipo-consultant",
                    desc: "Get expert advice for SME listing",
                    bg: "bg-emerald-50/50 hover:bg-emerald-100/50 border-emerald-100 text-emerald-700",
                  },
                  {
                    label: "SME IPO Guide",
                    url: "/blogs/sme-ipo-guide-india",
                    desc: "Complete guide on Indian SME IPOs",
                    bg: "bg-amber-50/50 hover:bg-amber-100/50 border-amber-100 text-amber-700",
                  },
                  {
                    label: "Live IPO Tracker",
                    url: "/sme-ipos",
                    desc: "Track active & upcoming SME IPOs",
                    bg: "bg-purple-50/50 hover:bg-purple-100/50 border-purple-100 text-purple-700",
                  },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.url}
                    className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-blue-50/40 hover:border-blue-200 text-slate-800 hover:text-[#1e40af] transition-all hover:scale-[1.01] active:scale-95 group"
                  >
                    <div>
                      <p className="font-black text-xs leading-tight">{item.label}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium group-hover:text-blue-500/80 transition-colors">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#1e40af] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm relative overflow-hidden group/side">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center justify-between">
                <span>Trending News</span>
                <Newspaper className="w-4 h-4 text-blue-600" />
              </p>

              <div className="space-y-4">
                {newsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  </div>
                ) : trendingNews.length > 0 ? (
                  trendingNews.map((item) => {
                    const fallbackImage = "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1000&auto=format&fit=crop";
                    const imageSrc = getImgSrc(item.image) || fallbackImage;
                    return (
                      <Link
                        key={item.id}
                        href={`/news/detail/${item.slug || item.id}`}
                        className="flex gap-3 items-center p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-blue-50/40 hover:border-blue-200 text-slate-800 hover:text-[#1e40af] transition-all hover:scale-[1.01] active:scale-95 group block"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-sm border border-slate-200 bg-slate-100">
                          <img
                            src={imageSrc}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = fallbackImage;
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="font-black text-xs leading-tight line-clamp-2">{item.title}</p>
                          <span className="text-[9px] font-bold text-slate-400 mt-1 block">
                            {item.category || "General"}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#1e40af] group-hover:translate-x-0.5 transition-all shrink-0 self-center" />
                      </Link>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 text-center py-2">No trending news available.</p>
                )}

                <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                  <Link
                    href="/news"
                    className="text-[11px] font-black text-blue-600 uppercase tracking-widest hover:tracking-[0.15em] transition-all inline-block"
                  >
                    View All News
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
