"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import EditorialTeamInfo from "@/components/EditorialTeamInfo";
import {
  Loader2,
  Calendar,
  TrendingUp,
  IndianRupee,
  Download,
  FileText,
  Info,
  BarChart3,
  Activity,
  Wallet,
  CheckCircle2,
  HelpCircle,
  Star,
  Shield,
  ChevronRight,
  Tag,
  Flame,
  Database,
  Globe,
  User,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MessageCircle,
  Newspaper,
} from "lucide-react";
import { formatIndianNumber, getImageUrl } from "@/lib/utils";
import { getImgSrc } from "@/utils/image";
import Ribbon from "@/components/Ribbon";
import { API_URL, BASE_URL } from "@/lib/constants";

const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};


interface RelatedBlog {
  id: string;
  title: string;
  slug: string;
  image: string;
  category: string;
  upcoming: string;
  gmp_ipo_price: string;
  gmp_date: string;
  created_at: string;
  updated_at?: string;
}

interface AdminBlogFull {
  id: string;
  title: string;
  slug: string;
  image: string;
  content: string;
  faqs: string;
  status: string;
  confidential: string;
  upcoming: string;
  category: string;
  new_highlight_text: string;
  gmp_date: string;
  gmp_ipo_price: string;
  gmp: string;
  gmp_last_updated: string;
  ipo_details: string;
  ipo_description: string;
  ipo_timeline_details: string;
  ipo_timeline_description: string;
  ipo_lots_application: string;
  ipo_lots: string;
  ipo_lots_share: string;
  ipo_lots_amount: string;
  promotor_hold_pre_issue: string;
  promotor_hold_post_issue: string;
  finantial_information_ended: string;
  finantial_information_assets: string;
  finantial_information_revenue: string;
  finantial_information_profit_tax: string;
  financial_info_reserves_surplus: string;
  finantial_information_networth: string;
  finantial_information_borrowing: string;
  key_kpi: string;
  key_value: string;
  key_pri_ipo_eps: string;
  key_pos_ipo_eps: string;
  key_pre_ipo_pe: string;
  key_post_ipo_pe: string;
  competative_strenght: string;
  meta_title: string;
  description: string;
  keyword: string;
  rhp: string;
  drhp: string;
  confidential_drhp: string;
  confidential_drhp_description: string;
  confidential_drhp_date: string;
  state: string;
  city: string;
  pincode: string;
  drhp_status: string;
  linked_digest_id: string;
  linked_digest_pdf?: string;
  recientipo: string;
  private_equity: string;
  business_economics_update: string;
  geopolitical_update: string;
  source: string;
  created_at: string;
  updated_at?: string;
  new_slug?: string;
  ipo_subscription?: string;
}

const isValid = (val: any) => {
  if (val === null || val === undefined) return false;
  const s = String(val).trim().toLowerCase();

  if (
    s === "null" ||
    s === "[null]" ||
    s === "" ||
    s === "undefined" ||
    s === "[]" ||
    s === '["null"]' ||
    s === '[""]' ||
    s === '["undefined"]' ||
    s === '[" "]' ||
    s === '["null","null"]'
  )
    return false;

  if (
    s.length > 25 &&
    !s.includes("/") &&
    !s.includes(".") &&
    !s.includes(" ")
  ) {
    return false;
  }

  if (/^\d{10,}$/.test(s)) return false;

  return true;
};

const isValidRealData = (val: any) => {
  if (!isValid(val)) return false;
  const s = String(val).toLowerCase();
  return (
    !s.includes("holding pre") &&
    !s.includes("holding post") &&
    s.replace(/[%\s]/g, "").length > 0
  );
};

const cleanGarbledText = (text: string) => {
  if (!text) return "";
  const s = String(text);
  if (
    s.toLowerCase() === "null" ||
    s.toLowerCase() === "[null]" ||
    s === "undefined" ||
    s === "[]" ||
    s === '["null"]' ||
    s === '[""]'
  )
    return "";
  let result = s
    .replace(/\\u20b9/g, "₹")
    .replace(/\\u20b5/g, "₹")
    .replace(/&nbsp;/g, " ")
    .replace(/\["null"\]/g, "")
    .replace(/\[""\]/g, "")
    .trim();

  if (result.startsWith('"') && result.endsWith('"') && result.length >= 2) {
    result = result.substring(1, result.length - 1);
  }

  return result;
};

const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
};

const parseArrayData = (data: any): string[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data.map((d) => cleanGarbledText(String(d)));
  const s = String(data).trim();
  if (s === "" || s === "[]") return [];

  if (s.toLowerCase() === "null") return [""];
  if (s.startsWith("[") && s.endsWith("]")) {
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) {
        return parsed.map((d) => cleanGarbledText(String(d)));
      }
    } catch (e) { }
  }
  if (s.includes(",")) {
    return s
      .split(",")
      .map((item) => cleanGarbledText(item.trim()))
      .filter((item) => item !== "");
  }
  return [cleanGarbledText(s)];
};

const SectionHeader = ({
  icon: Icon,
  title,
  accent = "blue",
  compact = false,
}: {
  icon: any;
  title: string;
  accent?: string;
  compact?: boolean;
}) => {
  const accents: Record<string, string> = {
    blue: "bg-[#1e40af] text-white",
    gold: "bg-[#b45309] text-white",
    green: "bg-[#10b981] text-white",
    purple: "bg-[#10b981] text-white",
  };
  return (
    <div
      className={`flex items-center justify-between ${compact ? "px-4 py-2.5" : "px-6 py-4"} ${accents[accent]} border-b border-white/10 shadow-md relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
      <div className="flex items-center gap-2 relative z-10">
        <Icon className={`${compact ? "w-4 h-4" : "w-5 h-5"} text-white/90`} />
        <h2 className={`${compact ? "text-xs md:text-sm" : "text-sm md:text-base"} font-black tracking-wider uppercase font-heading line-clamp-1`}>
          {title}
        </h2>
      </div>
      <div className="hidden sm:flex items-center gap-1 relative z-10">
        <div className="w-1 h-1 rounded-full bg-white/30" />
        <div className="w-1 h-1 rounded-full bg-white/50" />
        <div className="w-1 h-1 rounded-full bg-white/70" />
      </div>
    </div>
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
        className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-emerald-50/20 group"
      >
        <div className="flex gap-3">
          <span
            className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white mt-0.5 shadow-sm"
            style={{ background: "#10b981" }}
          >
            Q
          </span>
          <span className="font-bold text-slate-800 text-sm leading-tight transition-colors ">
            {faq.question}
          </span>
        </div>
        <div
          className={`shrink-0 w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center transition-transform duration-300 ${isOpen ? "rotate-180 bg-emerald-50" : ""}`}
        >
          <HelpCircle
            className={`w-3 h-3 ${isOpen ? "text-[#10b981]" : "text-slate-300"}`}
          />
        </div>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-5 pb-5 pl-[44px]">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-600 leading-relaxed">
            {faq.answer}
          </div>
        </div>
      </div>
    </div>
  );
};
const hasHtmlTags = (str: string) => /<[a-z][\s\S]*>?/i.test(str);

const getCleanBlogContent = (html: string | null | undefined) => {
  if (!html) return "";

  // 1. Convert paragraphs acting as headings (having font-size 24px/26px/etc.) into actual <h2> tags for perfect SEO hierarchy
  let cleaned = html
    .replace(
      /<p[^>]*>\s*<span[^>]*font-size\s*:\s*(?:24px|26px|18pt|20px)[^>]*>\s*(?:<strong>|<b>)?\s*(.*?)\s*(?:<\/strong>|<\/b>)?\s*<\/span>\s*<\/p>/gi,
      "<h2>$1</h2>",
    )
    .replace(
      /<p[^>]*>\s*(?:<strong>|<b>)?\s*<span[^>]*font-size\s*:\s*(?:24px|26px|18pt|20px)[^>]*>\s*(.*?)\s*<\/span>\s*(?:<\/strong>|<\/b>)?\s*<\/p>/gi,
      "<h2>$1</h2>",
    );

  // 2. Replace <h1> tags with <h2> tags to avoid duplicate H1 on the page (primary H1 is the article title)
  cleaned = cleaned
    .replace(/<h1([^>]*)>/gi, "<h2>")
    .replace(/<\/h1>/gi, "</h2>");

  // 3. Clean inline styles (font-family, font-size, color, background) which break responsive design and dark mode
  cleaned = cleaned.replace(/style="[^"]*"/gi, (match) => {
    // Keep alignment if present (e.g., text-align: center) but strip typography styles
    const alignment = match.match(/text-align\s*:\s*[^;"]*/i);
    return alignment ? `style="${alignment[0]}"` : "";
  });

  // 4. Remove empty style tags or empty spans that can cause spacing anomalies
  cleaned = cleaned.replace(/<span\s*>\s*<\/span>/gi, "");

  return cleaned;
};

const linkifyMerchantBankers = (html: string, bankers: any[]) => {
  if (!html || !bankers || bankers.length === 0) return html;

  // Filter out invalid entries and map each banker to include its core name length for descending sorting
  const sortedBankers = [...bankers]
    .filter((b) => b && b.title && b.slug)
    .map((b) => {
      let core = b.title.trim().replace(/\s+/g, " ");
      const suffixRegex = /\s+(?:Private\s+Limited|Private\s+Ltd|Pvt\.?\s*Ltd\.?|Ltd\.?|Limited)$/i;
      core = core.replace(suffixRegex, "").trim();
      return { ...b, coreLength: core.length, coreName: core };
    })
    // Filter out core names that are too short to avoid false positives
    .filter((b) => b.coreName.length >= 3)
    .sort((a, b) => b.coreLength - a.coreLength);

  let tempHtml = html;

  sortedBankers.forEach((banker) => {
    // 1. Normalize core name spaces
    let temp = banker.coreName.trim().replace(/\s+/g, " ");

    // 2. Escape standard regex characters first (excluding &)
    temp = temp.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

    // 3. Replace & and and with simple spaces around the group first
    temp = temp.replace(/\s+(?:&|and)\s+/gi, " (?:&|and) ");

    // 4. Replace single spaces with standard whitespace matcher \s+
    temp = temp.replace(/ /g, "\\s+");

    // 5. Make ending 's' optional for plural words
    temp = temp.replace(/(\w+)s\b/gi, "$1s?");

    // 6. Construct core name base pattern, allowing optional "(India)" at the end
    const corePattern = `(?:${temp})(?:\\s*\\(India\\))?`;

    // 7. Construct optional corporate suffix pattern (fully double-escaped for RegExp constructor!)
    const suffixPattern = `(?:\\s+(?:Private\\s+Limited|Private\\s+Ltd|Pvt\\.?\\s*Ltd\\.?|Ltd\\.?|Limited))?`;

    const patternStr = `${corePattern}${suffixPattern}`;

    // Match HTML tags/existing links OR the banker's title.
    const regex = new RegExp(
      `(<a[^>]*>[\\s\\S]*?</a>|<[^>]+>)|(${patternStr})`,
      "gi"
    );

    tempHtml = tempHtml.replace(regex, (match, tag, text) => {
      if (tag) {
        return match;
      }
      return `<a href="/merchant-banker/${banker.slug}" class="font-bold hover:underline text-[#1e40af]" style="font-weight: 800; text-decoration: underline; color: #1e40af;"><strong>${match}</strong></a>`;
    });
  });

  return tempHtml;
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

const SmartBlogRenderer = ({
  content,
  bankers,
  timelineTable,
  ipoDetailsTable,
  financialInfoTable,
  gmpTrendTable,
  kpiTable,
  valuationTable,
}: {
  content: string;
  bankers?: any[];
  timelineTable?: React.ReactNode;
  ipoDetailsTable?: React.ReactNode;
  financialInfoTable?: React.ReactNode;
  gmpTrendTable?: React.ReactNode;
  kpiTable?: React.ReactNode;
  valuationTable?: React.ReactNode;
}) => {
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

  if (!content)
    return <p className="text-slate-400 italic">No content available.</p>;

  const cleanContent = cleanGarbledText(content);

  if (hasHtmlTags(cleanContent)) {
    let processedContent = getCleanBlogContent(cleanContent);
    processedContent = linkifyMerchantBankers(processedContent, bankers || []);
    processedContent = seoInterlink(processedContent);

    // Find Timeline, Board, and GMP insertion indexes
    const timelineHeadingRegex = /<(h[2-4])[^>]*>(?:\s*|<[^>]+>)*[^<]*(?:Date\s*(?:&|&amp;|and)\s*Timeline|Timeline)[^<]*(?:\s*|<[^>]+>)*<\/\1>/i;
    const boardHeadingRegex = /<(h[2-4])[^>]*>(?:\s*|<[^>]+>)*[^<]*Board\s*(?:&|&amp;|and)\s*Key\s*Management[^<]*(?:\s*|<[^>]+>)*<\/\1>/i;
    const gmpHeadingRegex = /<(h[2-4])[^>]*>(?:\s*|<[^>]+>)*[^<]*(?:Grey\s*Market\s*Premium|GMP)[^<]*(?:\s*|<[^>]+>)*<\/\1>/i;

    let timelineInsertIdx = -1;
    let boardInsertIdx = -1;
    let gmpInsertIdx = -1;

    if (timelineTable) {
      const match = processedContent.match(timelineHeadingRegex);
      if (match) {
        const headingIdx = match.index!;
        const headingLen = match[0].length;
        const rest = processedContent.slice(headingIdx + headingLen);
        const nextHeadingMatch = rest.match(/<(h[2-4])[^>]*>/i);
        if (nextHeadingMatch) {
          timelineInsertIdx = headingIdx + headingLen + nextHeadingMatch.index!;
        } else {
          timelineInsertIdx = processedContent.length;
        }
      }
    }

    if (ipoDetailsTable) {
      const match = processedContent.match(boardHeadingRegex);
      if (match) {
        const headingIdx = match.index!;
        const headingLen = match[0].length;
        const rest = processedContent.slice(headingIdx + headingLen);
        const nextHeadingMatch = rest.match(/<(h[2-4])[^>]*>/i);
        if (nextHeadingMatch) {
          boardInsertIdx = headingIdx + headingLen + nextHeadingMatch.index!;
        } else {
          boardInsertIdx = processedContent.length;
        }
      }
    }

    if (gmpTrendTable) {
      const match = processedContent.match(gmpHeadingRegex);
      if (match) {
        const headingIdx = match.index!;
        const headingLen = match[0].length;
        const rest = processedContent.slice(headingIdx + headingLen);
        const nextHeadingMatch = rest.match(/<(h[2-4])[^>]*>/i);
        if (nextHeadingMatch) {
          gmpInsertIdx = headingIdx + headingLen + nextHeadingMatch.index!;
        } else {
          gmpInsertIdx = processedContent.length;
        }
      }
    }

    const insertions: { idx: number; type: "timeline" | "board" | "gmp" }[] = [];
    if (timelineInsertIdx !== -1) insertions.push({ idx: timelineInsertIdx, type: "timeline" });
    if (boardInsertIdx !== -1) insertions.push({ idx: boardInsertIdx, type: "board" });
    if (gmpInsertIdx !== -1) insertions.push({ idx: gmpInsertIdx, type: "gmp" });

    insertions.sort((a, b) => a.idx - b.idx);

    const styleBlock = (
      <style>{`
        .ipo-blog-prose p { margin-bottom: 1.4rem; color: #475569; line-height: 1.9; font-size: 1rem; font-weight: 500; }
        .ipo-blog-prose h2 { font-size: 1.4rem; font-weight: 900; color: #1e40af; margin-top: 2.8rem; margin-bottom: 1.2rem; padding: 0.85rem 1.25rem; background: #EEF2FF; border-left: 6px solid #1e40af; border-radius: 0 0.75rem 0.75rem 0; display: block; }
        .ipo-blog-prose h3,
        .ipo-blog-prose h5 { font-weight: 800; margin-top: 2rem; margin-bottom: 1rem; padding: 0.6rem 1rem; background: #f0f7ff; border-radius: 0 0.5rem 0.5rem 0; display: block; }
        .ipo-blog-prose h3 { font-size: 1.15rem; color: #1e3a8a; border-left: 4px solid #60a5fa; }
        .ipo-blog-prose h5 { font-size: 1.025rem; color: #475569; border-left: 4px solid #f59e08; }
        .ipo-blog-prose h4 { font-size: 1rem; font-weight: 800; color: #1e3a8a; margin-top: 1.5rem; margin-bottom: 0.6rem; padding-left: 0.75rem; border-left: 3px solid #93c5fd; }
        .ipo-blog-prose strong, .ipo-blog-prose b { color: #1e3a8a; font-weight: 700; }
        .ipo-blog-prose a { color: #1d4ed8; font-weight: 600; text-decoration: underline; text-decoration-color: #93c5fd; }
        .ipo-blog-prose a:hover { color: #1e40af; }
        .ipo-blog-prose ul { list-style: none !important; padding: 0 !important; margin: 1rem 0 1.4rem; }
        .ipo-blog-prose ul li { list-style: none !important; margin-bottom: 0.65rem; color: #475569; font-size: 0.96rem; font-weight: 500; line-height: 1.6; }
        .ipo-blog-prose ol { padding-left: 1.5rem; margin: 1rem 0 1.4rem; }
        .ipo-blog-prose ol li { margin-bottom: 0.6rem; color: #475569; font-weight: 500; line-height: 1.7; }
        .ipo-blog-prose blockquote { margin: 1.75rem 0; padding: 1.25rem 1.5rem; border-left: 5px solid #1e40af; background: rgba(30,64,175,0.05); border-radius: 0 0.75rem 0.75rem 0; font-style: italic; color: #334155; font-weight: 500; }
        .ipo-blog-prose img { border-radius: 1rem; width: 100%; margin: 1.75rem 0; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
        .ipo-blog-prose table { width: 100%; border-collapse: collapse; margin: 1.75rem 0; font-size: 0.875rem; overflow: hidden; box-shadow: 0 1px 8px rgba(30,64,175,0.08); }
        .ipo-blog-prose th { background: #1e40af; color: #fff; font-weight: 800; padding: 0.75rem 1rem; text-align: left; font-size: 0.8rem; letter-spacing: 0.05em; text-transform: uppercase; }
        .ipo-blog-prose td { border: 1px solid #e2e8f0; padding: 0.65rem 1rem; color: #475569; }
        .ipo-blog-prose tr:nth-child(even) td { background: #f8fafc; }
        .ipo-blog-prose tr:hover td { background: #EEF2FF; }
        .ipo-blog-prose > *:first-child { margin-top: 0 !important; }
      `}</style>
    );

    const renderTablesForType = (type: "timeline" | "board" | "gmp") => {
      if (type === "timeline") {
        return (
          <>
            {timelineTable}
            {ipoDetailsTable}
          </>
        );
      }
      if (type === "gmp") return gmpTrendTable;
      return (
        <>
          {timelineInsertIdx === -1 && ipoDetailsTable}
          {financialInfoTable}
          {gmpInsertIdx === -1 && gmpTrendTable}
          {kpiTable}
          {valuationTable}
        </>
      );
    };

    if (insertions.length === 0) {
      return (
        <>
          {styleBlock}
          <div
            className="ipo-blog-prose"
            dangerouslySetInnerHTML={{ __html: processedContent }}
            onClick={handleContentClick}
          />
        </>
      );
    }

    const segments: React.ReactNode[] = [];
    let lastIdx = 0;

    insertions.forEach((insertion, index) => {
      const segmentHtml = processedContent.slice(lastIdx, insertion.idx);
      if (segmentHtml.trim()) {
        segments.push(
          <div
            key={`segment-${index}`}
            className="ipo-blog-prose"
            dangerouslySetInnerHTML={{ __html: segmentHtml }}
            onClick={handleContentClick}
          />
        );
      }
      segments.push(
        <div key={`table-${insertion.type}-${index}`} className="my-6">
          {renderTablesForType(insertion.type)}
        </div>
      );
      lastIdx = insertion.idx;
    });

    const finalHtml = processedContent.slice(lastIdx);
    if (finalHtml.trim()) {
      segments.push(
        <div
          key="segment-final"
          className="ipo-blog-prose mt-6"
          dangerouslySetInnerHTML={{ __html: finalHtml }}
          onClick={handleContentClick}
        />
      );
    }

    return (
      <>
        {styleBlock}
        {segments}
      </>
    );
  }

  const rawParagraphs = cleanContent
    .split(/\n{2,}|\r\n\r\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const paragraphs =
    rawParagraphs.length <= 1
      ? cleanContent
        .split(/\n/)
        .map((p) => p.trim())
        .filter(Boolean)
      : rawParagraphs;
  const rendered: React.ReactNode[] = [];

  let boardHeadingIdx = -1;
  let nextHeadingAfterBoardIdx = -1;
  let timelineHeadingIdx = -1;
  let nextHeadingAfterTimelineIdx = -1;
  let gmpHeadingIdx = -1;
  let nextHeadingAfterGmpIdx = -1;

  paragraphs.forEach((para, idx) => {
    const isHeading =
      (para.length < 80 && para === para.toUpperCase() && para.length > 5) ||
      (para.endsWith(":") && para.length < 80 && !para.includes(".")) ||
      (para.length < 55 && !para.includes(".") && !para.includes(",") && idx > 0);

    if (isHeading) {
      if (/Board\s*(?:&|and)\s*Key\s*Management/i.test(para)) {
        boardHeadingIdx = idx;
      } else if (boardHeadingIdx !== -1 && nextHeadingAfterBoardIdx === -1) {
        nextHeadingAfterBoardIdx = idx;
      }

      if (/(?:Date\s*(?:&|and)\s*Timeline|Timeline)/i.test(para)) {
        timelineHeadingIdx = idx;
      } else if (timelineHeadingIdx !== -1 && nextHeadingAfterTimelineIdx === -1) {
        nextHeadingAfterTimelineIdx = idx;
      }

      if (/(?:Grey\s*Market\s*Premium|GMP)/i.test(para)) {
        gmpHeadingIdx = idx;
      } else if (gmpHeadingIdx !== -1 && nextHeadingAfterGmpIdx === -1) {
        nextHeadingAfterGmpIdx = idx;
      }
    }
  });

  paragraphs.forEach((para, i) => {
    const isHeading =
      (para.length < 80 && para === para.toUpperCase() && para.length > 5) ||
      (para.endsWith(":") && para.length < 80 && !para.includes(".")) ||
      (para.length < 55 && !para.includes(".") && !para.includes(",") && i > 0);

    if (i === nextHeadingAfterTimelineIdx && timelineTable) {
      rendered.push(<div key="timeline-table-inserted" className="my-6">{timelineTable}</div>);
      if (ipoDetailsTable) {
        rendered.push(<div key="ipo-details-table-inserted" className="my-6">{ipoDetailsTable}</div>);
      }
    }
    if (i === nextHeadingAfterGmpIdx && gmpTrendTable) {
      rendered.push(<div key="gmp-table-inserted" className="my-6">{gmpTrendTable}</div>);
    }
    if (i === nextHeadingAfterBoardIdx) {
      if (ipoDetailsTable && timelineHeadingIdx === -1) {
        rendered.push(<div key="ipo-details-table-inserted" className="my-6">{ipoDetailsTable}</div>);
      }
      if (financialInfoTable) {
        rendered.push(<div key="financial-info-table-inserted" className="my-6">{financialInfoTable}</div>);
      }
      if (gmpTrendTable && gmpHeadingIdx === -1) {
        rendered.push(<div key="gmp-trend-table-inserted" className="my-6">{gmpTrendTable}</div>);
      }
      if (kpiTable) {
        rendered.push(<div key="kpi-table-inserted" className="my-6">{kpiTable}</div>);
      }
      if (valuationTable) {
        rendered.push(<div key="valuation-table-inserted" className="my-6">{valuationTable}</div>);
      }
    }

    if (isHeading) {
      rendered.push(
        <h2
          key={i}
          style={{
            color: "#1e40af",
            background: "#EEF2FF",
            borderLeft: "6px solid #1e40af",
            borderRadius: "0 0.75rem 0.75rem 0",
            fontSize: "1.35rem",
            fontWeight: 900,
            margin: "2.5rem 0 1.2rem",
            padding: "0.85rem 1.25rem",
            display: "block",
          }}
        >
          {para.replace(/:$/, "")}
        </h2>,
      );
    } else {
      const isFirst = i === 0;
      rendered.push(
        <p
          key={i}
          style={{
            color: "#475569",
            lineHeight: 1.9,
            marginBottom: "1.3rem",
            fontSize: isFirst ? "1.05rem" : "0.97rem",
            fontWeight: 500,
          }}
          onClick={handleContentClick}
        >
          {isFirst && (
            <span
              style={{
                float: "left",
                fontSize: "4.5rem",
                fontWeight: 900,
                lineHeight: 0.75,
                marginRight: "0.5rem",
                marginTop: "0.25rem",
                color: "#1e40af",
                opacity: 0.85,
              }}
            >
              {para[0]}
            </span>
          )}
          <span
            dangerouslySetInnerHTML={{
              __html: seoInterlink(linkifyMerchantBankers(isFirst ? para.slice(1) : para, bankers || [])),
            }}
          />
        </p>,
      );
    }
  });

  if (timelineHeadingIdx !== -1 && nextHeadingAfterTimelineIdx === -1 && timelineTable) {
    rendered.push(<div key="timeline-table-inserted-end" className="mt-6">{timelineTable}</div>);
    if (ipoDetailsTable) {
      rendered.push(<div key="ipo-details-table-inserted-end" className="mt-6">{ipoDetailsTable}</div>);
    }
  }
  if (gmpHeadingIdx !== -1 && nextHeadingAfterGmpIdx === -1 && gmpTrendTable) {
    rendered.push(<div key="gmp-table-inserted-end" className="mt-6">{gmpTrendTable}</div>);
  }
  if (boardHeadingIdx !== -1 && nextHeadingAfterBoardIdx === -1) {
    if (ipoDetailsTable && timelineHeadingIdx === -1) {
      rendered.push(<div key="ipo-details-table-inserted-end" className="mt-6">{ipoDetailsTable}</div>);
    }
    if (financialInfoTable) {
      rendered.push(<div key="financial-info-table-inserted-end" className="mt-6">{financialInfoTable}</div>);
    }
    if (gmpTrendTable && gmpHeadingIdx === -1) {
      rendered.push(<div key="gmp-trend-table-inserted-end" className="mt-6">{gmpTrendTable}</div>);
    }
    if (kpiTable) {
      rendered.push(<div key="kpi-table-inserted-end" className="mt-6">{kpiTable}</div>);
    }
    if (valuationTable) {
      rendered.push(<div key="valuation-table-inserted-end" className="mt-6">{valuationTable}</div>);
    }
  }

  return <div>{rendered}</div>;
};

const ReporterSection = ({
  title,
  icon: Icon,
  content,
}: {
  title: string;
  icon: any;
  content: string;
}) => {
  const getPoints = (val: string) => {
    if (!val || val.trim() === "") return [];
    if (val.startsWith("[") && val.endsWith("]")) {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [val];
      } catch {
        return [val];
      }
    }
    return [val];
  };

  const points = getPoints(content);
  if (points.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-10 relative">
      <div className="flex items-center gap-4 px-6 py-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
          style={{ background: "linear-gradient(135deg, #0284c7, #2563eb)" }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-black text-slate-800 tracking-tight">
          {title}
        </h3>
      </div>

      <div className="mx-6 h-1 bg-blue-600 rounded-full opacity-90" />

      <div className="px-6 py-4 md:px-8 md:py-6">
        <ul className="reporter-content">
          {points.map((point, idx) => (
            <li
              key={idx}
              className="animate-in fade-in slide-in-from-left duration-500"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const SocialIcon = ({
  icon: Icon,
  href,
  color,
}: {
  icon: any;
  href: string;
  color: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm border border-blue-50"
    style={{ background: "#f0f7ff", color: color }}
  >
    <Icon className="w-4 h-4" />
  </a>
);

export default function IPOBlogDetailsClient({
  initialBlog,
  slug,
}: {
  initialBlog: AdminBlogFull;
  slug: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [blog, setBlog] = useState<AdminBlogFull>(initialBlog);
  useEffect(() => {
    setBlog(initialBlog);
  }, [initialBlog]);
  const [loading, setLoading] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState<RelatedBlog[]>([]);
  const [bankers, setBankers] = useState<any[]>([]);
  const [trendingNews, setTrendingNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "subscription">("all");
  const [selectedSubDate, setSelectedSubDate] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "subscription") {
        setActiveTab("subscription");
      } else {
        setActiveTab("all");
      }
    }
  }, []);

  const handleTabChange = (tab: "all" | "subscription") => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (tab === "subscription") {
        url.searchParams.set("tab", "subscription");
      } else {
        url.searchParams.delete("tab");
      }
      window.history.pushState({}, "", url.toString());
    }
  };

  const scrollToSection = (id: string) => {
    if (activeTab !== "all") {
      handleTabChange("all");
      let attempts = 0;
      const interval = setInterval(() => {
        const element = document.getElementById(id);
        attempts++;
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          clearInterval(interval);
        } else if (attempts > 30) {
          clearInterval(interval);
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${API_URL}/api/news?limit=9`);
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
  const [comparisonData, setComparisonData] = useState<{
    currentIpo: any;
    similarIpos: any[];
    similarBlogsData: Record<string, { roe: string; roce: string }>;
    loading: boolean;
  }>({
    currentIpo: null,
    similarIpos: [],
    similarBlogsData: {},
    loading: false,
  });

  useEffect(() => {
    const fetchAllBankers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/bankers?all=true`);
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

  useEffect(() => {
    if (!blog?.id) return;

    const fetchComparisonData = async () => {
      try {
        setComparisonData(prev => ({ ...prev, loading: true }));
        // 1. Fetch current IPO matching the blog id
        const ipoRes = await fetch(`${API_URL}/api/ipo-lists?admin_blog_id=${blog.id}`);
        if (!ipoRes.ok) {
          setComparisonData(prev => ({ ...prev, loading: false }));
          return;
        }
        const ipoData = await ipoRes.json();
        const currentIpo = ipoData.data?.find(
          (ipo: any) => String(ipo.admin_blog_id) === String(blog.id)
        );

        if (!currentIpo) {
          setComparisonData(prev => ({ ...prev, loading: false }));
          return;
        }

        // 2. Fetch similar IPOs in the same sector (limit to 10 to ensure we get enough non-upcoming ones)
        const sectorRes = await fetch(
          `${API_URL}/api/ipo-lists?sector_id=${currentIpo.sector_id}&upcoming=0&limit=10`
        );
        if (!sectorRes.ok) {
          setComparisonData(prev => ({ ...prev, currentIpo, loading: false }));
          return;
        }
        const sectorData = await sectorRes.json();
        const rawSimilar = sectorData.data || [];

        // Filter out current IPO, ensure no upcoming IPOs are included, and limit to 3 similar IPOs
        const similarIpos = rawSimilar
          .filter(
            (ipo: any) =>
              String(ipo.id) !== String(currentIpo.id) &&
              String(ipo.upcoming) !== "1"
          )
          .slice(0, 3);

        // 3. For each similar IPO, fetch its corresponding blog to extract ROE & ROCE
        const blogsData: Record<string, { roe: string; roce: string }> = {};
        await Promise.all(
          similarIpos.map(async (ipo: any) => {
            if (ipo.blog_slug) {
              try {
                const blogRes = await fetch(`${API_URL}/api/admin-blogs/${ipo.blog_slug}`);
                if (blogRes.ok) {
                  const bData = await blogRes.json();
                  const kpis = parseArrayData(bData.key_kpi);
                  const values = parseArrayData(bData.key_value);

                  const getKpiValue = (kpisList: string[], valuesList: string[], target: string) => {
                    const idx = kpisList.findIndex(
                      (k) => k.trim().toUpperCase() === target.toUpperCase()
                    );
                    return idx !== -1 ? valuesList[idx] || "—" : "—";
                  };

                  blogsData[ipo.id] = {
                    roe: getKpiValue(kpis, values, "ROE"),
                    roce: getKpiValue(kpis, values, "ROCE"),
                  };
                }
              } catch (e) {
                console.error("Error fetching similar blog:", e);
              }
            }
          })
        );

        setComparisonData({
          currentIpo,
          similarIpos,
          similarBlogsData: blogsData,
          loading: false,
        });
      } catch (err) {
        console.error("Failed to fetch comparison data:", err);
        setComparisonData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchComparisonData();
  }, [blog]);



  useEffect(() => {
    if (!blog) return;

    const fetchRelated = async () => {
      try {
        const currentCat = (blog.category || "")
          .toLowerCase()
          .replace(/\s+/g, "_");

        const url = currentCat === "daily_reporter"
          ? `${API_URL}/api/admin-blogs?category=daily_reporter&limit=50&summary=1&all_categories=1`
          : `${API_URL}/api/admin-blogs?limit=100&summary=1&all_categories=1`;

        const res = await fetch(url);

        if (res.ok) {
          const data = await res.json();
          const all: RelatedBlog[] = data.data || [];

          let filtered = all.filter((b) => {
            const bCat = (b.category || "")
              .toLowerCase()
              .replace(/\s+/g, "_");

            return (
              b.slug !== blog.slug &&
              bCat === currentCat &&
              b.upcoming !== "1"
            );
          });

          // fallback if less related blogs
          if (filtered.length < 3 && currentCat !== "daily_reporter") {
            filtered = all.filter((b) => b.slug !== blog.slug);
          }

          // REMOVE DUPLICATES
          const uniqueBlogs = filtered.filter((item, index, self) => {
            return (
              index ===
              self.findIndex((b) => {
                const sameSlug =
                  b.slug?.trim().toLowerCase() ===
                  item.slug?.trim().toLowerCase();

                const sameTitleAndDate =
                  b.title?.trim().toLowerCase() ===
                  item.title?.trim().toLowerCase() &&
                  (b.created_at && item.created_at
                    ? String(b.created_at).split("T")[0] === String(item.created_at).split("T")[0]
                    : false);

                return sameSlug || sameTitleAndDate;
              })
            );
          });

          // latest first (fallback to id if created_at is missing/null)
          uniqueBlogs.sort((a, b) => {
            const valA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const valB = b.created_at ? new Date(b.created_at).getTime() : 0;

            if (valA && valB && !isNaN(valA) && !isNaN(valB)) {
              return valB - valA;
            }
            return Number(b.id) - Number(a.id);
          });

          setRelatedBlogs(uniqueBlogs.slice(0, 6));
        }
      } catch (err) {
        console.error("Failed to fetch related blogs:", err);
      }
    };

    fetchRelated();
  }, [blog]);

  if (loading || !blog) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f0f5ff]">
        <div className="flex-1 flex flex-col items-center justify-center p-20">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-[#1e40af]/20 border-t-[#1e40af] animate-spin" />
            <div className="w-8 h-8 rounded-full border-4 border-[#f59e0b]/20 border-b-[#f59e0b] animate-spin absolute top-4 left-4" />
          </div>
          <p className="mt-6 text-[#1e40af] font-semibold animate-pulse font-heading">
            Loading IPO Insights...
          </p>
        </div>
      </div>
    );
  }

  const timelineLabels = parseArrayData(blog.ipo_timeline_details);
  const timelineDates = parseArrayData(blog.ipo_timeline_description);
  const lots = parseArrayData(blog.ipo_lots);
  const lotShares = parseArrayData(blog.ipo_lots_share);
  const lotAmounts = parseArrayData(blog.ipo_lots_amount);
  const kpiNames = parseArrayData(blog.key_kpi);
  const kpiValues = parseArrayData(blog.key_value);
  const strengths = parseArrayData(blog.competative_strenght);

  const getDisplayVal = (data: any, takeLast = false) => {
    const parsed = parseArrayData(data);
    if (parsed.length === 0)
      return isValid(data) ? cleanGarbledText(String(data)) : "";
    const val = takeLast ? parsed[parsed.length - 1] : parsed[0];
    return cleanGarbledText(val);
  };

  const gmpPrice = getDisplayVal(blog.gmp_ipo_price, true);
  const latestGmp = getDisplayVal(blog.gmp, true);
  const gmpDate = getDisplayVal(blog.gmp_date, true);
  const gmpUpdated = getDisplayVal(blog.gmp_last_updated, true);

  const gmpDates = parseArrayData(blog.gmp_date);
  const gmpPrices = parseArrayData(blog.gmp_ipo_price);
  const gmpValues = parseArrayData(blog.gmp);
  const gmpLastUpdates = parseArrayData(blog.gmp_last_updated);
  const gmpHistory = gmpDates
    .map((date, i) => ({
      date,
      price: gmpPrices[i] || "",
      gmp: gmpValues[i] || "",
      updated: gmpLastUpdates[i] || "",
    }))
    .filter((h) => isValid(h.date) || isValid(h.gmp))
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

  const finEnded = parseArrayData(blog.finantial_information_ended);
  const finAssets = parseArrayData(blog.finantial_information_assets);
  const finRevenue = parseArrayData(blog.finantial_information_revenue);
  const finProfit = parseArrayData(blog.finantial_information_profit_tax);
  const finReserves = parseArrayData(blog.financial_info_reserves_surplus);
  const finNetworth = parseArrayData(blog.finantial_information_networth);
  const finBorrowing = parseArrayData(blog.finantial_information_borrowing);

  const getFirstFinVal = (arr: string[], rawFallback: string) => {
    const first = arr.find((v) => v && v.trim() && v.toLowerCase() !== "null");
    if (first) return formatIndianNumber(cleanGarbledText(first));
    // Don't fall back to the raw DB string if it looks like a JSON array
    const raw = String(rawFallback || "").trim();
    if (!raw || raw.startsWith("[") || raw === "null" || raw === "undefined")
      return "";
    return formatIndianNumber(cleanGarbledText(raw));
  };
  const revenue = getFirstFinVal(
    finRevenue,
    blog.finantial_information_revenue,
  );
  const profit = getFirstFinVal(
    finProfit,
    blog.finantial_information_profit_tax,
  );
  const networth = getFirstFinVal(
    finNetworth,
    blog.finantial_information_networth,
  );
  const borrowing = getFirstFinVal(
    finBorrowing,
    blog.finantial_information_borrowing,
  );
  const rawPreHolding = parseArrayData(blog.promotor_hold_pre_issue);
  const rawPostHolding = parseArrayData(blog.promotor_hold_post_issue);
  const isHoldingGarbage = (s: string) =>
    s.toLowerCase().includes("holding") ||
    s.toLowerCase().includes("promotor") ||
    !/\d/.test(s);

  const preNums = rawPreHolding.filter((s) => !isHoldingGarbage(s));
  const postNums = rawPostHolding.filter((s) => !isHoldingGarbage(s));

  let preHolding = "";
  let postHolding = "";

  if (preNums.length === 0 && postNums.length >= 2) {
    preHolding = postNums[0];
    postHolding = postNums[1];
  } else if (preNums.length === 0 && postNums.length === 1) {
    preHolding = postNums[0];
    postHolding = "";
  } else {
    preHolding = preNums[0] || "";
    postHolding = postNums[0] || "";
  }
  const preEps = cleanGarbledText(blog.key_pri_ipo_eps || "");
  const postEps = cleanGarbledText(blog.key_pos_ipo_eps || "");
  const prePe = cleanGarbledText(blog.key_pre_ipo_pe || "");
  const postPe = cleanGarbledText(blog.key_post_ipo_pe || "");
  const appInfoArray = parseArrayData(blog.ipo_lots_application);

  const isUpcoming = blog.upcoming === "1";

  const defaultLabels = [
    "IPO Date",
    "Listing Date",
    "Face Value",
    "Issue Price Band",
    "Lot Size",
    "Sale Type",
    "Total Issue Size",
    "Reserved for Market Maker",
    "Fresh Issue(Ex Market Maker)",
    "Offer for Sale",
    "Net Offered to Public",
    "Issue Type",
    "Listing At",
    "Share Holding Pre Issue",
    "Share Holding Post Issue",
  ];
  const ipoDetailsLabels = parseArrayData(blog.ipo_details);
  const ipoDescItems = parseArrayData(blog.ipo_description);

  const getSmartIpoDetails = () => {
    const labels =
      ipoDetailsLabels.length > 0 ? ipoDetailsLabels : defaultLabels;
    const finalMap: Record<string, string> = {};
    const usedIndices = new Set<number>();

    if (labels.length === ipoDescItems.length) {
      return labels.map((l, i) => ({
        label: l,
        value: isValid(ipoDescItems[i]) ? ipoDescItems[i] : "-",
      }));
    }

    ipoDescItems.forEach((item, idx) => {
      const parts = item.split(/[:–-](.+)/);
      if (parts.length > 1) {
        const key = parts[0].trim();
        const val = parts.slice(1).join("").trim();
        if (isValid(val)) {
          finalMap[key] = val;
          usedIndices.add(idx);
        }
      }
    });

    const allDescValues = ipoDescItems.map((v, i) => ({
      v,
      i,
      l: v.toLowerCase(),
    }));

    ipoDescItems.forEach((item, idx) => {
      if (usedIndices.has(idx) || !isValid(item)) return;
      const val = item.toLowerCase();
      let targetLabel = "";

      if (val.includes("₹") && !val.includes("cr") && !val.includes("agg")) {
        const numMatch = val.match(/\d+/);
        const numericValue = numMatch ? parseInt(numMatch[0]) : 0;

        if (val.includes("to") || val.includes("-")) {
          targetLabel = "Issue Price Band";
        } else if (val.includes("per share") || val.includes("per equity")) {
          if (numericValue <= 10) targetLabel = "Face Value";
          else targetLabel = "Issue Price Band";
        }
      } else if (
        val.includes("shares") &&
        (item.length < 15 || val.includes("lot"))
      )
        targetLabel = "Lot Size";
      else if (val.includes("bse") || val.includes("nse"))
        targetLabel = "Listing At";
      else if (val.includes("building") || val.includes("fixed price"))
        targetLabel = "Issue Type";
      else if (
        val.includes("fresh") ||
        val.includes("ofs") ||
        val.includes("capital")
      )
        targetLabel = "Sale Type";
      else if (
        /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/.test(val)
      ) {
        if (val.includes("to") || val.includes("-")) targetLabel = "IPO Date";
        else targetLabel = "Listing Date";
      } else if (val.includes("shares")) {
        if (
          val.includes("market maker") ||
          val.includes("markets") ||
          val.includes("arihant") ||
          val.includes("nikunj") ||
          val.includes("stock brokers")
        ) {
          targetLabel = "Reserved for Market Maker";
        } else if (
          val.includes("ofs") ||
          val.includes("offer for sale") ||
          val.includes("shares of ₹")
        ) {
          targetLabel = "Offer for Sale";
        } else if (val.includes("fresh") && val.includes("issue")) {
          targetLabel = "Fresh Issue(Ex Market Maker)";
        } else if (val.includes("net") || val.includes("public")) {
          targetLabel = "Net Offered to Public";
        } else if (val.includes("agg") || val.includes("up to")) {
          const upTos = allDescValues.filter(
            (x) =>
              x.l.includes("shares") &&
              (x.l.includes("agg") || x.l.includes("up to")),
          );
          const uIdx = upTos.findIndex((x) => x.i === idx);

          if (uIdx === 0) targetLabel = "Total Issue Size";
          else if (uIdx === upTos.length - 1)
            targetLabel = "Net Offered to Public";
          else {
            if (
              !finalMap["Reserved for Market Maker"] ||
              finalMap["Reserved for Market Maker"] === "-"
            )
              targetLabel = "Reserved for Market Maker";
            else if (
              !finalMap["Fresh Issue(Ex Market Maker)"] ||
              finalMap["Fresh Issue(Ex Market Maker)"] === "-"
            )
              targetLabel = "Fresh Issue(Ex Market Maker)";
            else if (
              !finalMap["Offer for Sale"] ||
              finalMap["Offer for Sale"] === "-"
            )
              targetLabel = "Offer for Sale";
          }
        } else {
          const hldings = allDescValues.filter(
            (x) =>
              x.l.includes("shares") &&
              !x.l.includes("market") &&
              !x.l.includes("public") &&
              !x.l.includes("lot") &&
              !x.l.includes("agg") &&
              !x.l.includes("up to"),
          );
          const hIdx = hldings.findIndex((x) => x.i === idx);
          if (hIdx === hldings.length - 2)
            targetLabel = "Share Holding Pre Issue";
          else if (hIdx === hldings.length - 1)
            targetLabel = "Share Holding Post Issue";
        }
      }

      if (
        targetLabel &&
        (!finalMap[targetLabel] || finalMap[targetLabel] === "-")
      ) {
        finalMap[targetLabel] = item;
        usedIndices.add(idx);
      }
    });

    if (!finalMap["IPO Date"] && isValidRealData(gmpDate))
      finalMap["IPO Date"] = gmpDate;
    if (!finalMap["Issue Price Band"] && isValidRealData(gmpPrice))
      finalMap["Issue Price Band"] = gmpPrice;
    if (!finalMap["Share Holding Pre Issue"] && isValidRealData(preHolding))
      finalMap["Share Holding Pre Issue"] = preHolding;
    if (!finalMap["Share Holding Post Issue"] && isValidRealData(postHolding))
      finalMap["Share Holding Post Issue"] = postHolding;

    const result: { label: string; value: string }[] = labels.map((l) => ({
      label: l,
      value: finalMap[l] || "-",
    }));

    // Extra details removed as per user request
    /*
    ipoDescItems.forEach((item, idx) => {
      if (!usedIndices.has(idx)) {
        result.push({ label: `Extra Detail`, value: formatIndianNumber(item) });
      }
    });
    */

    return result;
  };

  const finalIpoDetails = getSmartIpoDetails();



  const getSmartTimeline = () => {
    const labels =
      timelineLabels.length > 0
        ? timelineLabels
        : [
          "IPO Open Date",
          "IPO Close Date",
          "Tentative Allotment",
          "Initiation of Refunds",
          "Credit of Shares to Demat",
          "Tentative Listing Date",
          "Cut-off time for UPI mandate confirmation",
        ];
    const finalMap: Record<string, string> = {};
    const usedIndices = new Set<number>();

    timelineDates.forEach((item, idx) => {
      const parts = item.split(/[:–-](.+)/);
      if (parts.length > 1) {
        const key = parts[0].trim();
        const val = parts.slice(1).join("").trim();
        if (isValid(val)) {
          finalMap[key] = val;
          usedIndices.add(idx);
        }
      }
    });

    timelineDates.forEach((item, idx) => {
      if (usedIndices.has(idx)) return;
      const lower = item.toLowerCase();

      if (
        lower.includes("5:00 pm") ||
        lower.includes("cut-off") ||
        lower.includes("mandate")
      ) {
        finalMap["Cut-off time for UPI mandate confirmation"] = item;
        usedIndices.add(idx);
      } else if (
        /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/.test(lower) ||
        /\d{1,2}[\/\-]\d{1,2}/.test(lower)
      ) {
        const emptySlot = labels.find(
          (l) =>
            !finalMap[l] && l !== "Cut-off time for UPI mandate confirmation",
        );
        if (emptySlot) {
          finalMap[emptySlot] = item;
          usedIndices.add(idx);
        }
      }
    });

    labels.forEach((l, i) => {
      if (!finalMap[l] && timelineDates[i] && !usedIndices.has(i)) {
        finalMap[l] = timelineDates[i];
        usedIndices.add(i);
      }
    });

    return labels.map((l) => ({ label: l, value: finalMap[l] || "-" }));
  };

  const getSmartKpis = () => {
    const defaultLabels = [
      "ROE",
      "ROCE",
      "Debt/Equity",
      "RoNW",
      "PAT Margin",
      "EBITDA Margin",
      "Price to Book Value",
    ];
    const labels = kpiNames.length > 0 ? kpiNames : defaultLabels;
    const finalMap: Record<string, string> = {};

    if (labels.length === kpiValues.length) {
      return labels.map((l, i) => ({
        label: l,
        value: isValid(kpiValues[i]) ? kpiValues[i] : "-",
      }));
    }

    let valPtr = 0;
    labels.forEach((label) => {
      if (valPtr >= kpiValues.length) return;

      const lowerL = label.toLowerCase();
      const currentVal = kpiValues[valPtr];
      const isValPercentage = currentVal.includes("%");

      const expectsPercentage =
        lowerL.includes("roe") ||
        lowerL.includes("roce") ||
        lowerL.includes("ronw") ||
        lowerL.includes("margin");

      if (expectsPercentage === isValPercentage) {
        finalMap[label] = currentVal;
        valPtr++;
      } else {
        finalMap[label] = "-";
      }
    });

    return labels.map((l) => ({ label: l, value: finalMap[l] || "-" }));
  };

  const finalTimeline = getSmartTimeline();
  const finalKpis = getSmartKpis();
  const displayTitle = blog.title.replace(/\s+IPO$/i, "").trim();

  // --- Article Schema (JSON-LD) for Google Rich Results ---
  const siteUrl = BASE_URL;
  const blogImage = getImageUrl(blog.image);
  const resolvedImage = blogImage
    ? blogImage.startsWith("http")
      ? blogImage
      : `${siteUrl}${blogImage.startsWith("/") ? "" : "/"}${blogImage}`
    : `${siteUrl}/favicon.png`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: stripHtml(blog.meta_title || blog.title),
    description: stripHtml(
      blog.description || `Read details and updates about ${blog.title}`,
    ),
    datePublished:
      blog.created_at && !String(blog.created_at).startsWith("0000") && !isNaN(new Date(blog.created_at).getTime())
        ? new Date(blog.created_at).toISOString()
        : blog.updated_at && !String(blog.updated_at).startsWith("0000") && !isNaN(new Date(blog.updated_at).getTime())
          ? new Date(blog.updated_at).toISOString()
          : new Date().toISOString(),
    dateModified: new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "India IPO",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "India IPO",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/${blog.category === "daily_reporter" ? "daily-reporter" : "ipo-blogs"}/${blog.new_slug || blog.slug}`,
    },
    keywords: blog.keyword || "IPO, SME IPO, India IPO, stock market",
    articleSection: (blog.category || "IPO").replace(/_/g, " "),
    inLanguage: "en-IN",
  };

  // --- FAQPage Schema (JSON-LD) for Google FAQ Rich Results ---
  let faqSchemaItems: { question: string; answer: string }[] = [];
  if (blog.faqs && typeof blog.faqs === "string") {
    try {
      const parsed = JSON.parse(blog.faqs);
      if (Array.isArray(parsed)) {
        faqSchemaItems = parsed
          .filter((f: any) => f && f.question && f.answer)
          .map((f: any) => ({
            question: stripHtml(String(f.question)),
            answer: stripHtml(String(f.answer)),
          }));
      }
    } catch (e) {
      /* ignore parse errors */
    }
  }
  const faqSchema =
    faqSchemaItems.length > 0
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqSchemaItems.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
        })),
      }
      : null;

  const timelineHeadingRegex = /<(h[2-4])[^>]*>(?:\s*|<[^>]+>)*[^<]*(?:Date\s*(?:&|&amp;|and)\s*Timeline|Timeline)[^<]*(?:\s*|<[^>]+>)*<\/\1>/i;
  const timelineHeadingRegexPlain = /(?:Date\s*(?:&|&amp;|and)\s*Timeline|Timeline)/i;

  const hasTimelineHeading = blog && blog.content ? (
    timelineHeadingRegex.test(blog.content) || timelineHeadingRegexPlain.test(blog.content)
  ) : false;

  const renderTimelineTable = () => (
    blog.category !== "daily_reporter" &&
      finalTimeline.length > 0 ? (
      <div
        className="bg-white rounded-2xl overflow-hidden shadow-sm mb-6"
        style={{ border: "1px solid #e2e8f0" }}
      >
        <SectionHeader
          icon={Calendar}
          title={`${displayTitle} IPO Timeline`}
          accent="blue"
        />
        <table className="w-full text-sm">
          <tbody>
            {finalTimeline.map((item, idx) => (
              <tr
                key={idx}
                className="transition-colors hover:bg-blue-50/30"
                style={{
                  borderBottom: "1px solid #f1f5f9",
                  background: idx % 2 === 0 ? "#fff" : "#fafbff",
                }}
              >
                <td className="py-2.5 px-5 text-slate-500 font-medium text-xs">
                  {item.label}
                </td>
                <td className="py-2.5 px-5 text-right font-bold text-[#1e40af] text-[11px] leading-tight">
                  {item.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : null
  );

  const headingRegex = /<(h[2-4])[^>]*>(?:\s*|<[^>]+>)*[^<]*Board\s*(?:&|&amp;|and)\s*Key\s*Management[^<]*(?:\s*|<[^>]+>)*<\/\1>/i;
  const headingRegexPlain = /Board\s*(?:&|&amp;|and)\s*Key\s*Management/i;

  const hasBoardManagementHeading = blog && blog.content ? (
    headingRegex.test(blog.content) || headingRegexPlain.test(blog.content)
  ) : false;

  const gmpHeadingRegex = /<(h[2-4])[^>]*>(?:\s*|<[^>]+>)*[^<]*(?:Grey\s*Market\s*Premium|GMP)[^<]*(?:\s*|<[^>]+>)*<\/\1>/i;
  const gmpHeadingRegexPlain = /(?:Grey\s*Market\s*Premium|GMP)/i;

  const hasGmpHeading = blog && blog.content ? (
    gmpHeadingRegex.test(blog.content) || gmpHeadingRegexPlain.test(blog.content)
  ) : false;

  const renderIpoDetailsTable = () => (
    blog.category !== "daily_reporter" &&
      finalIpoDetails.length > 0 ? (
      <div
        id="details"
        className="bg-white rounded-2xl shadow-sm mb-6 mt-4 scroll-mt-24"
        style={{ border: "1px solid #e2e8f0" }}
      >
        <SectionHeader
          icon={Info}
          title={`${blog.title.replace(/\s+IPO$/i, "").trim()} IPO Details`}
          accent="blue"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                <th
                  className="py-2.5 px-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-2/5"
                  style={{ borderRight: "1px solid #e2e8f0" }}
                >
                  Detail
                </th>
                <th className="py-2.5 px-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {finalIpoDetails.map((detail, idx) => (
                <tr
                  key={idx}
                  className="transition-colors hover:bg-blue-50/40"
                  style={{
                    borderBottom: "1px solid #f1f5f9",
                    background: idx % 2 === 0 ? "#fff" : "#fafbff",
                  }}
                >
                  <td
                    className="py-3 px-5 font-semibold text-slate-500 text-sm"
                    style={{ borderRight: "1px solid #f1f5f9" }}
                  >
                    {detail.label}
                  </td>
                  <td className="py-3 px-5 font-bold text-slate-800 text-sm">
                    {formatIndianNumber(detail.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ) : null
  );

  const renderFinancialInfoTable = () => (
    blog.category !== "daily_reporter" &&
      (isValid(blog.finantial_information_assets) ||
        finEnded.length > 0) ? (
      <div
        className="bg-white rounded-2xl overflow-hidden shadow-sm mb-6"
        style={{ border: "1px solid #e2e8f0" }}
      >
        <SectionHeader
          icon={BarChart3}
          title={`${blog.title} Financial Information`}
          accent="green"
        />
        <div className="p-5">
          {(isValid(revenue) ||
            isValid(profit) ||
            isValid(networth) ||
            isValid(borrowing)) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  {
                    label: "Latest Revenue",
                    val: revenue,
                    color: "#1e40af",
                    bg: "#eff6ff",
                    border: "#bfdbfe",
                  },
                  {
                    label: "Profit After Tax",
                    val: profit,
                    color: "#065f46",
                    bg: "#f0fdf4",
                    border: "#bbf7d0",
                  },
                  {
                    label: "Net Worth",
                    val: networth,
                    color: "#4c1d95",
                    bg: "#f5f3ff",
                    border: "#ddd6fe",
                  },
                  {
                    label: "Total Borrowing",
                    val: borrowing,
                    color: "#9a3412",
                    bg: "#fff7ed",
                    border: "#fed7aa",
                  },
                ]
                  .filter((m) => isValid(m.val))
                  .map((m, i) => (
                    <div
                      key={i}
                      className="rounded-xl p-4 text-center"
                      style={{
                        background: m.bg,
                        border: `1px solid ${m.border}`,
                      }}
                    >
                      <p
                        className="text-[9px] font-black uppercase tracking-wider mb-1.5"
                        style={{ color: m.color }}
                      >
                        {m.label}
                      </p>
                      <p
                        className="text-lg font-black"
                        style={{ color: "#0f172a" }}
                      >
                        {m.val}
                      </p>
                      <p className="text-[9px] text-slate-400 mt-0.5">
                        ₹ Crore
                      </p>
                    </div>
                  ))}
              </div>
            )}

          <div
            className="overflow-x-auto rounded-xl"
            style={{ border: "1px solid #e2e8f0" }}
          >
            {finEnded.length > 0 ? (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr
                    style={{
                      background:
                        "linear-gradient(135deg, #1e3a8a, #1e40af)",
                    }}
                  >
                    {[
                      "Period Ended",
                      ...(finAssets.length > 0 ? ["Assets"] : []),
                      ...(finRevenue.length > 0
                        ? ["Total Income"]
                        : []),
                      ...(finProfit.length > 0
                        ? ["Profit After Tax"]
                        : []),
                      ...(finNetworth.length > 0
                        ? ["Net Worth"]
                        : []),
                      ...(finReserves.length > 0
                        ? ["Reserves & Surplus"]
                        : []),
                      ...(finBorrowing.length > 0
                        ? ["Total Borrowing"]
                        : []),
                    ].map((h, i) => (
                      <th
                        key={i}
                        className="p-3 text-left text-xs font-bold text-blue-100 uppercase tracking-wide whitespace-nowrap"
                        style={{
                          borderRight:
                            "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {finEnded.map((date, idx) => (
                    <tr
                      key={idx}
                      className="transition-colors hover:bg-blue-50/50"
                      style={{
                        background:
                          idx % 2 === 0 ? "#fff" : "#f8faff",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      <td
                        className="p-3 font-bold text-[#1e40af] text-xs whitespace-nowrap"
                        style={{ borderRight: "1px solid #e2e8f0" }}
                      >
                        {date}
                      </td>
                      {finAssets.length > 0 && (
                        <td
                          className="p-3 text-slate-700 text-xs"
                          style={{ borderRight: "1px solid #e2e8f0" }}
                        >
                          {formatIndianNumber(finAssets[idx]) || "—"}
                        </td>
                      )}
                      {finRevenue.length > 0 && (
                        <td
                          className="p-3 text-slate-700 text-xs"
                          style={{ borderRight: "1px solid #e2e8f0" }}
                        >
                          {formatIndianNumber(finRevenue[idx]) || "—"}
                        </td>
                      )}
                      {finProfit.length > 0 && (
                        <td
                          className="p-3 font-semibold text-emerald-700 text-xs"
                          style={{ borderRight: "1px solid #e2e8f0" }}
                        >
                          {formatIndianNumber(finProfit[idx]) || "—"}
                        </td>
                      )}
                      {finNetworth.length > 0 && (
                        <td
                          className="p-3 text-slate-700 text-xs"
                          style={{ borderRight: "1px solid #e2e8f0" }}
                        >
                          {formatIndianNumber(finNetworth[idx]) ||
                            "—"}
                        </td>
                      )}
                      {finReserves.length > 0 && (
                        <td
                          className="p-3 text-slate-700 text-xs"
                          style={{ borderRight: "1px solid #e2e8f0" }}
                        >
                          {formatIndianNumber(finReserves[idx]) ||
                            "—"}
                        </td>
                      )}
                      {finBorrowing.length > 0 && (
                        <td className="p-3 text-slate-700 text-xs">
                          {formatIndianNumber(finBorrowing[idx]) ||
                            "—"}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: "#f8fafc" }}>
                    <td
                      colSpan={10}
                      className="p-2.5 text-right text-[10px] font-bold italic"
                      style={{ color: "#ef4444" }}
                    >
                      Amount in ₹ Crore
                    </td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <div
                className="prose prose-sm max-w-none p-4 [&_table]:w-full [&_table]:border-collapse [&_th]:p-3 [&_th]:text-left [&_th]:font-bold [&_th]:text-white [&_th]:border [&_th]:border-blue-700 [&_td]:p-3 [&_td]:border [&_td]:border-slate-200 [&_td]:text-slate-700"
                style={{
                  ["--tw-prose-th-background" as any]: "#1e40af",
                }}
                dangerouslySetInnerHTML={{
                  __html: cleanGarbledText(
                    blog.finantial_information_assets,
                  ),
                }}
              />
            )}
          </div>
        </div>
      </div>
    ) : null
  );

  const renderSubscriptionTables = () => {
    if (!blog.ipo_subscription) return null;
    let parsedRows: any[] = [];
    try {
      parsedRows = typeof blog.ipo_subscription === 'string' ? JSON.parse(blog.ipo_subscription) : blog.ipo_subscription;
    } catch {
      return null;
    }
    if (!Array.isArray(parsedRows) || parsedRows.length === 0) return null;

    // We have the rows. Let's find the upper price band.
    const priceBandRow = finalIpoDetails.find(r => r.label.toLowerCase().includes('price band') || r.label.toLowerCase().includes('issue price'));
    let upperPrice = 0;
    if (priceBandRow) {
      const prices = priceBandRow.value.match(/(\d+)/g);
      if (prices && prices.length > 0) {
        upperPrice = Math.max(...prices.map(p => parseInt(p)));
      }
    }

    // Let's compute the Live Status Table using the selected entry (or latest if not selected).
    const latestRow = parsedRows[parsedRows.length - 1];
    const activeSubRow = parsedRows.find(r => r.date === selectedSubDate) || latestRow;
    
    const getFloatVal = (val: any) => parseFloat(val) || 0;

    const computeCategoryRow = (label: string, offeredStr: any, bidStr: any) => {
      const offered = getFloatVal(offeredStr);
      const bid = getFloatVal(bidStr);
      const sub = offered > 0 ? (bid / offered).toFixed(2) + 'x' : '0.00x';
      const amt = upperPrice > 0 ? ((bid * upperPrice) / 10000000).toFixed(3) + ' Cr' : '—';
      return {
        label,
        offered: offered > 0 ? formatIndianNumber(offered.toString()) : '0',
        bid: bid > 0 ? formatIndianNumber(bid.toString()) : '0',
        sub,
        amt
      };
    };

    const anchor = computeCategoryRow('Anchor', activeSubRow.anchor_offered, activeSubRow.anchor_bid);
    const qib = computeCategoryRow('QIB (Ex Anchor)', activeSubRow.qib_offered, activeSubRow.qib_bid);
    
    // NII calculations
    const bniiOffered = getFloatVal(activeSubRow.bnii_offered);
    const sniiOffered = getFloatVal(activeSubRow.snii_offered);
    const bniiBid = getFloatVal(activeSubRow.bnii_bid);
    const sniiBid = getFloatVal(activeSubRow.snii_bid);

    const niiOfferedVal = bniiOffered + sniiOffered;
    const niiBidVal = bniiBid + sniiBid;
    const niiSub = niiOfferedVal > 0 ? (niiBidVal / niiOfferedVal).toFixed(2) + 'x' : '0.00x';
    const niiAmt = upperPrice > 0 ? ((niiBidVal * upperPrice) / 10000000).toFixed(3) + ' Cr' : '—';
    const nii = {
      label: 'NII',
      offered: niiOfferedVal > 0 ? formatIndianNumber(niiOfferedVal.toString()) : '0',
      bid: niiBidVal > 0 ? formatIndianNumber(niiBidVal.toString()) : '0',
      sub: niiSub,
      amt: niiAmt
    };

    const bnii = computeCategoryRow('bNII (> ₹10L)', activeSubRow.bnii_offered, activeSubRow.bnii_bid);
    const snii = computeCategoryRow('sNII (< ₹10L)', activeSubRow.snii_offered, activeSubRow.snii_bid);
    const retail = computeCategoryRow('Retail', activeSubRow.retail_offered, activeSubRow.retail_bid);

    // Total calculations (excluding Anchor)
    const qibOffered = getFloatVal(activeSubRow.qib_offered);
    const qibBid = getFloatVal(activeSubRow.qib_bid);
    const retailOffered = getFloatVal(activeSubRow.retail_offered);
    const retailBid = getFloatVal(activeSubRow.retail_bid);

    const totalOfferedVal = qibOffered + niiOfferedVal + retailOffered;
    const totalBidVal = qibBid + niiBidVal + retailBid;
    const totalSub = totalOfferedVal > 0 ? (totalBidVal / totalOfferedVal).toFixed(2) + 'x' : '0.00x';
    const totalAmt = upperPrice > 0 ? ((totalBidVal * upperPrice) / 10000000).toFixed(3) + ' Cr' : '—';
    const total = {
      label: 'Total **',
      offered: totalOfferedVal > 0 ? formatIndianNumber(totalOfferedVal.toString()) : '0',
      bid: totalBidVal > 0 ? formatIndianNumber(totalBidVal.toString()) : '0',
      sub: totalSub,
      amt: totalAmt
    };

    const liveTableRows = [anchor, qib, nii, bnii, snii, retail, total];

    // Day-wise table calculations
    const dayWiseRows = parsedRows.map((row) => {
      const qOff = getFloatVal(row.qib_offered);
      const qB = getFloatVal(row.qib_bid);
      const qSub = qOff > 0 ? (qB / qOff).toFixed(2) : '0.00';

      const bOff = getFloatVal(row.bnii_offered);
      const bB = getFloatVal(row.bnii_bid);
      const bSub = bOff > 0 ? (bB / bOff).toFixed(2) : '0.00';

      const sOff = getFloatVal(row.snii_offered);
      const sB = getFloatVal(row.snii_bid);
      const sSub = sOff > 0 ? (sB / sOff).toFixed(2) : '0.00';

      const nOff = bOff + sOff;
      const nB = bB + sB;
      const nSub = nOff > 0 ? (nB / nOff).toFixed(2) : '0.00';

      const rOff = getFloatVal(row.retail_offered);
      const rB = getFloatVal(row.retail_bid);
      const rSub = rOff > 0 ? (rB / rOff).toFixed(2) : '0.00';

      const tOff = qOff + nOff + rOff;
      const tB = qB + nB + rB;
      const tSub = tOff > 0 ? (tB / tOff).toFixed(2) : '0.00';

      return {
        date: row.date || 'Day',
        qib: qSub,
        nii: nSub,
        bnii: bSub,
        snii: sSub,
        retail: rSub,
        total: tSub
      };
    });

    return (
      <div className="space-y-8 mb-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
        {/* Live Subscription Status Table */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wider">
                {blog.title.replace(/\s+IPO$/i, "").trim()} IPO Subscription Status Live
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-semibold">
                Showing data for: <span className="text-emerald-700 font-bold">{activeSubRow.date || 'Latest'}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 justify-center shrink-0">
              <span className="text-xs font-bold text-slate-600">Select Date:</span>
              <select
                value={selectedSubDate || latestRow.date}
                onChange={(e) => setSelectedSubDate(e.target.value)}
                className="text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg px-3 py-1.5 bg-slate-50 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {parsedRows.map((r, index) => (
                  <option key={index} value={r.date}>
                    {r.date} {index === parsedRows.length - 1 ? '(Latest)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">Category</th>
                  <th className="py-3 px-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">Subscription (x)</th>
                  <th className="py-3 px-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">Shares Offered*</th>
                  <th className="py-3 px-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">Shares bid for</th>
                  <th className="py-3 px-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Total Amt* (₹ Cr.)</th>
                </tr>
              </thead>
              <tbody>
                {liveTableRows.map((row, idx) => {
                  const isTotal = row.label.includes('Total');
                  const isNiiTotal = row.label === 'NII';
                  return (
                    <tr
                      key={idx}
                      className="transition-colors hover:bg-slate-50/50"
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        background: isTotal ? "#f0fdf4" : isNiiTotal ? "#f0f9ff" : idx % 2 === 0 ? "#fff" : "#fafafa",
                        fontWeight: isTotal || isNiiTotal ? "bold" : "normal"
                      }}
                    >
                      <td className="py-3 px-5 text-slate-700 font-medium border-r border-slate-100">{row.label}</td>
                      <td className="py-3 px-5 text-slate-800 border-r border-slate-100 font-bold">{row.sub}</td>
                      <td className="py-3 px-5 text-slate-700 border-r border-slate-100">{row.offered}</td>
                      <td className="py-3 px-5 text-slate-700 border-r border-slate-100">{row.bid}</td>
                      <td className="py-3 px-5 text-slate-800 font-bold">{row.amt}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-6 text-[11px] text-slate-500 space-y-1 bg-white border-t border-slate-100 leading-relaxed font-medium">
            <p>*: "Shares Offered" and "Total Amount" are calculated based on the upper price of the issue price range (₹{upperPrice || '—'}).</p>
            <p>**: The portion of anchor investors (or market makers) is not included in the total number of shares offered.</p>
          </div>
        </div>

        {/* Day-wise Subscription Details Table */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 text-center uppercase tracking-wider">
              Day-wise Subscription Details (times)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">Date</th>
                  <th className="py-3 px-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">QIB (Ex Anchor)</th>
                  <th className="py-3 px-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">NII</th>
                  <th className="py-3 px-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">bNII (&gt; ₹10L)</th>
                  <th className="py-3 px-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">sNII (&lt; ₹10L)</th>
                  <th className="py-3 px-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">Retail</th>
                  <th className="py-3 px-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody>
                {dayWiseRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="transition-colors hover:bg-slate-50/50"
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      background: idx % 2 === 0 ? "#fff" : "#fafafa",
                    }}
                  >
                    <td className="py-3 px-5 text-slate-700 font-bold border-r border-slate-100">{row.date}</td>
                    <td className="py-3 px-5 text-slate-700 border-r border-slate-100 font-medium">{row.qib}</td>
                    <td className="py-3 px-5 text-slate-700 border-r border-slate-100 font-bold text-sky-800 bg-sky-50/20">{row.nii}</td>
                    <td className="py-3 px-5 text-slate-700 border-r border-slate-100 font-medium">{row.bnii}</td>
                    <td className="py-3 px-5 text-slate-700 border-r border-slate-100 font-medium">{row.snii}</td>
                    <td className="py-3 px-5 text-slate-700 border-r border-slate-100 font-medium">{row.retail}</td>
                    <td className="py-3 px-5 text-emerald-800 font-extrabold bg-emerald-50/20">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderGmpTrendTable = () => (
    blog.category !== "daily_reporter" &&
      gmpHistory.length > 0 ? (
      <>
        <div className="flex justify-center mb-4">
          <a
            href="/blogs/what-is-ipo-gmp-and-how-to-use-gmp"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-blue-500 group-hover:text-blue-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Know More About GMP
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>
        </div>
        <div id="gmp" className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 mb-6 scroll-mt-24">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 text-center uppercase tracking-wider">
              {blog.title.replace(/\s+IPO$/i, "").trim()} GMP TREND
              (DAILY UPDATES)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3 px-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">
                    GMP Date
                  </th>
                  <th className="py-3 px-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">
                    IPO Price
                  </th>
                  <th className="py-3 px-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-r border-slate-200">
                    GMP
                  </th>
                  <th className="py-3 px-5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {gmpHistory.map((row, idx) => (
                  <tr
                    key={idx}
                    className="transition-colors hover:bg-slate-50/50"
                    style={{
                      borderBottom: "1px solid #f1f5f9",
                      background:
                        idx % 2 === 0 ? "#fff" : "#fafafa",
                    }}
                  >
                    <td className="py-3 px-5 text-slate-700 font-medium border-r border-slate-100">
                      {row.date || "-"}
                    </td>
                    <td className="py-3 px-5 text-slate-700 border-r border-slate-100">
                      {String(row.price || "").includes("₹")
                        ? row.price
                        : `₹${row.price || "0"}`}
                    </td>
                    <td className="py-3 px-5 font-bold text-slate-800 border-r border-slate-100">
                      {String(row.gmp || "").includes("₹")
                        ? row.gmp
                        : `₹${row.gmp || "0"}`}
                    </td>
                    <td className="py-3 px-5 text-slate-600">
                      {row.updated ? (
                        row.updated.includes("|") ? (
                          <span className="flex items-center gap-2">
                            <span>
                              {row.updated.split("|")[0].trim()}
                            </span>
                            <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 font-bold">
                              {row.updated.split("|")[1].trim()}
                            </span>
                          </span>
                        ) : (
                          row.updated
                        )
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 text-[11px] text-red-600 font-medium leading-relaxed bg-white border-t border-slate-100">
            **The GMP prices displayed here are solely for
            informational purposes related to the grey market news.
            India IPO does not engage in or facilitate grey market
            trading, nor do we endorse it. The premiums shown are
            unofficial and can fluctuate significantly until the
            listing date.
          </div>
        </div>
      </>
    ) : null
  );

  const renderKpiTable = () => (
    blog.category !== "daily_reporter" && finalKpis.length > 0 ? (
      <div
        className="bg-white rounded-2xl overflow-hidden shadow-sm mb-6"
        style={{ border: "1px solid #e2e8f0" }}
      >
        <SectionHeader
          icon={Activity}
          title={`${displayTitle} Key Performance Indicator`}
          accent="blue"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                <th className="text-left py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  KPI
                </th>
                <th className="text-right py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Values
                </th>
              </tr>
            </thead>
            <tbody>
              {finalKpis.map((kpi, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/50 transition-colors"
                  style={{
                    borderBottom: "1px solid #f1f5f9",
                    background: idx % 2 !== 0 ? "#fafbff" : "#fff",
                  }}
                >
                  <td className="py-3 px-5 font-semibold text-slate-600">
                    {kpi.label}
                  </td>
                  <td className="py-3 px-5 text-right font-black text-slate-800">
                    {kpi.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ) : null
  );

  const renderValuationTable = () => (
    blog.category !== "daily_reporter" &&
      (isValidRealData(prePe) || isValidRealData(preEps)) ? (
      <div
        className="bg-white rounded-2xl overflow-hidden shadow-sm mb-6"
        style={{ border: "1px solid #e2e8f0" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                <th className="py-3 px-5 w-1/3"></th>
                <th className="text-center py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Pre IPO
                </th>
                <th className="text-center py-3 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Post IPO
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                className="hover:bg-blue-50/40 transition-colors"
                style={{ borderBottom: "1px solid #f1f5f9" }}
              >
                <td className="py-3.5 px-5 font-bold text-slate-800">
                  EPS (Rs)
                </td>
                <td className="py-3.5 px-5 text-center font-black text-slate-700">
                  {isValidRealData(preEps) ? preEps : "-"}
                </td>
                <td className="py-3.5 px-5 text-center font-black text-slate-700">
                  {isValidRealData(postEps) ? postEps : "-"}
                </td>
              </tr>
              <tr
                className="hover:bg-blue-50/40 transition-colors"
                style={{
                  borderBottom: "1px solid #f1f5f9",
                  background: "#fafbff",
                }}
              >
                <td className="py-3.5 px-5 font-bold text-slate-800">
                  P/E (x)
                </td>
                <td className="py-3.5 px-5 text-center font-black text-slate-700">
                  {isValidRealData(prePe) ? prePe : "-"}
                </td>
                <td className="py-3.5 px-5 text-center font-black text-slate-700">
                  {isValidRealData(postPe) ? postPe : "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ) : null
  );

  const renderComparisonTable = () => {
    const { currentIpo, similarIpos, similarBlogsData } = comparisonData;
    if (!currentIpo || similarIpos.length === 0) return null;

    const getPriceBandStr = (ipo: any) => {
      const low = parseFloat(ipo.issue_lowest_price);
      const high = parseFloat(ipo.issue_highest_price);
      if (low > 0 && high > 0) {
        return low === high ? `₹${low}` : `₹${low} - ₹${high}`;
      } else if (high > 0) {
        return `₹${high}`;
      } else if (low > 0) {
        return `₹${low}`;
      }
      return "—";
    };

    const getListingGainPercent = (ipo: any) => {
      if (ipo.listing_day_gain_percentage !== undefined && ipo.listing_day_gain_percentage !== null && ipo.listing_day_gain_percentage !== '') {
        return ipo.listing_day_gain_percentage;
      }
      const issuePrice = parseFloat(ipo.issue_highest_price || ipo.issue_lowest_price);
      if (!issuePrice || issuePrice <= 0) return null;

      const closePrice = parseFloat(ipo.listing_day_close_nse) || parseFloat(ipo.listing_day_close_bse);
      if (!closePrice || closePrice <= 0) return null;

      return ((closePrice - issuePrice) / issuePrice) * 100;
    };

    const formatListingGain = (ipo: any) => {
      const pctVal = getListingGainPercent(ipo);
      if (pctVal === null || pctVal === '') return <span className="text-slate-400 font-medium">—</span>;

      let isPositive = false;
      let isNegative = false;
      let formatted = "";

      if (typeof pctVal === 'string') {
        formatted = pctVal.trim();
        if (formatted.includes("-") || (formatted.startsWith("(") && formatted.endsWith(")")) || formatted.toLowerCase().includes("loss")) {
          isNegative = true;
        } else {
          isPositive = true;
        }
      } else {
        isPositive = pctVal > 0;
        isNegative = pctVal < 0;
        formatted = `${pctVal > 0 ? "+" : ""}${pctVal.toFixed(2)}%`;
      }

      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${isPositive ? "bg-emerald-50 text-emerald-700" : isNegative ? "bg-rose-50 text-rose-700" : "bg-slate-50 text-slate-600"}`}>
          {formatted}
        </span>
      );
    };

    const getKpiValue = (kpisList: string[], valuesList: string[], target: string) => {
      const idx = kpisList.findIndex(
        (k) => k.trim().toUpperCase() === target.toUpperCase()
      );
      return idx !== -1 ? valuesList[idx] || "—" : "—";
    };

    const currentRoe = getKpiValue(kpiNames, kpiValues, "ROE");
    const currentRoce = getKpiValue(kpiNames, kpiValues, "ROCE");

    const rows = [
      {
        label: "Issue Size",
        currentVal: currentIpo.issue_size ? `₹${currentIpo.issue_size} Cr` : "—",
        similarVals: similarIpos.map(ipo => ipo.issue_size ? `₹${ipo.issue_size} Cr` : "—")
      },
      {
        label: "Price Band",
        currentVal: getPriceBandStr(currentIpo),
        similarVals: similarIpos.map(ipo => getPriceBandStr(ipo))
      },
      {
        label: "Listing Gain",
        currentVal: formatListingGain(currentIpo),
        similarVals: similarIpos.map(ipo => formatListingGain(ipo))
      },
      {
        label: "ROE",
        currentVal: currentRoe,
        similarVals: similarIpos.map(ipo => similarBlogsData[ipo.id]?.roe || "—")
      },
      {
        label: "ROCE",
        currentVal: currentRoce,
        similarVals: similarIpos.map(ipo => similarBlogsData[ipo.id]?.roce || "—")
      }
    ];

    const currentName = currentIpo.issuer_company.replace(/\s+IPO$/i, "").trim();

    return (
      <div
        className="bg-white rounded-2xl shadow-sm mb-6 border border-slate-200 overflow-hidden"
      >
        <SectionHeader
          icon={TrendingUp}
          title="Recently Listed Similar IPOs"
          accent="blue"
        />
        <div className="p-5 md:p-6">
          <h3 className="text-sm md:text-base font-bold text-slate-800 mb-5 leading-snug">
            Compare {currentName} vs {similarIpos.map(s => s.issuer_company.replace(/\s+IPO$/i, "").trim()).join(" vs ")}
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200">
                  <th className="py-3 px-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-1/4 border-r border-slate-100">
                    Metric / Features
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-bold text-[#1e40af] uppercase tracking-wider w-1/4 border-r border-slate-100 bg-blue-50/30">
                    <Link href={`/ipo-blogs/${blog.new_slug || blog.slug}`} className="hover:underline hover:text-[#1e40af] transition-colors">
                      {currentName}
                    </Link>
                    <span className="block text-[9px] font-normal text-slate-400 mt-0.5">(Current)</span>
                  </th>
                  {similarIpos.map((ipo, idx) => (
                    <th key={idx} className="py-3 px-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider w-1/4 border-r border-slate-100 last:border-r-0">
                      {ipo.blog_slug ? (
                        <Link href={`/ipo-blogs/${ipo.blog_slug}`} className="hover:underline hover:text-[#1e40af] transition-colors">
                          {ipo.issuer_company.replace(/\s+IPO$/i, "").trim()}
                        </Link>
                      ) : (
                        ipo.issuer_company.replace(/\s+IPO$/i, "").trim()
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/40 transition-colors"
                    style={{
                      borderBottom: idx === rows.length - 1 ? "none" : "1px solid #f1f5f9",
                      background: idx % 2 === 0 ? "#fff" : "#fafbff"
                    }}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-500 text-xs border-r border-[#f1f5f9]">
                      {row.label}
                    </td>
                    <td className="py-3.5 px-4 text-center font-black text-[#1e40af] text-xs border-r border-[#f1f5f9] bg-blue-50/10">
                      {row.currentVal}
                    </td>
                    {row.similarVals.map((val, sIdx) => (
                      <td key={sIdx} className="py-3.5 px-4 text-center font-bold text-slate-700 text-xs border-r border-[#f1f5f9] last:border-r-0">
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f5ff]">

      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0c1e4a 0%, #1e3a8a 45%, #1e40af 70%, #1d4ed8 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)",
            transform: "translate(30%, -40%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-8"
          style={{
            background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
            transform: "translate(-30%, 40%)",
          }}
        />

        {isValid(getImageUrl(blog.image)) && (
          <div className="absolute inset-0">
            <img
              src={getImageUrl(blog.image)!}
              alt=""
              className="w-full h-full object-cover opacity-[0.07]"
            />
          </div>
        )}

        <div className="relative container mx-auto px-4 py-10 lg:py-14">


          <nav className="flex items-center gap-1.5 text-xs mb-8 text-blue-200/70">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            {blog.category === "daily_reporter" ? (
              <Link
                href="/daily-ipo-digest"
                className="hover:text-white transition-colors"
              >
                Daily IPO Digest
              </Link>
            ) : (
              <Link
                href="/ipo-blogs"
                className="hover:text-white transition-colors"
              >
                IPO Blogs
              </Link>
            )}
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/90 truncate max-w-[200px]">
              {blog.title}
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1 ">






              <div className="flex flex-wrap gap-x-4 gap-y-2 mb-5">
                <Ribbon
                  fontSize="13px"
                  cutout="0.6em"
                  color={isUpcoming ? "linear-gradient(135deg, #f59e08, #d97706)" : "linear-gradient(135deg, #10b981, #047857)"}
                  className="inline-flex items-center gap-1.5 text-white font-bold tracking-wide"
                >
                  {isUpcoming ? "⏳ UPCOMING IPO" : "✅ CURRENT IPO"}
                </Ribbon>
                <Ribbon
                  fontSize="13px"
                  cutout="0.6em"
                  color="rgba(255,255,255,0.12)"
                  className="inline-flex items-center gap-1.5 text-blue-100 font-bold border border-white/15"
                >
                  <Tag className="w-3 h-3 text-blue-100" />
                  {(blog.category || "IPO").replace(/_/g, " ").toUpperCase()}
                </Ribbon>
                {blog.confidential === "1" && (
                  <Ribbon
                    fontSize="13px"
                    cutout="0.6em"
                    color="rgba(239,68,68,0.25)"
                    className="inline-flex items-center gap-1.5 text-red-200 font-bold border border-red-500/30"
                  >
                    <Shield className="w-3 h-3 text-red-200" /> CONFIDENTIAL
                  </Ribbon>
                )}
                {isValid(blog.new_highlight_text) && (
                  <Ribbon
                    fontSize="13px"
                    cutout="0.6em"
                    color="linear-gradient(135deg, #f59e0b, #d97706)"
                    className="inline-flex items-center gap-1.5 text-white font-bold"
                  >
                    <Star className="w-3 h-3 text-white" /> {blog.new_highlight_text}
                  </Ribbon>
                )}
              </div>



              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-5 font-heading">
                {blog.title}
              </h1>

              {(isValid(blog.description) || isValid(blog.ipo_details)) && (
                <p className="text-blue-200/75 text-sm md:text-base leading-relaxed max-w-2xl mb-7">
                  {stripHtml(
                    cleanGarbledText(
                      isValid(blog.description)
                        ? blog.description
                        : blog.ipo_details,
                    ),
                  ).substring(0, 220)}
                  {stripHtml(
                    cleanGarbledText(
                      isValid(blog.description)
                        ? blog.description
                        : blog.ipo_details,
                    ),
                  ).length > 220
                    ? "..."
                    : ""}
                </p>
              )}

              {blog.category !== "daily_reporter" && (
                <div className="flex flex-wrap gap-4 mb-8 mt-2 items-center">
                  <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes fluctuate {
                      0%, 100% {
                        transform: translateY(0) scale(1);
                        filter: brightness(1);
                      }
                      50% {
                        transform: translateY(-4px) scale(1.03);
                        filter: brightness(1.1);
                      }
                    }
                  `}} />
                  <Ribbon
                    fontSize="15px"
                    cutout="0.75em"
                    color={activeTab === "all" ? "linear-gradient(135deg, #002a52 0%, #0052a3 60%, #0080ff 100%)" : "rgba(255,255,255,0.12)"}
                    className="inline-flex items-center gap-2 text-white font-bold tracking-wide cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-md border border-white/10"
                    style={{ animation: 'fluctuate 3s ease-in-out infinite', padding: '0.45rem 1.5rem' }}
                    onClick={() => scrollToSection("details")}
                  >
                    <Info className="w-4 h-4 text-blue-200" /> IPO Details
                  </Ribbon>

                  {gmpHistory.length > 0 && (
                    <Ribbon
                      fontSize="15px"
                      cutout="0.75em"
                      color={activeTab === "all" ? "linear-gradient(135deg, #002a52 0%, #0052a3 60%, #0080ff 100%)" : "rgba(255,255,255,0.12)"}
                      className="inline-flex items-center gap-2 text-white font-bold tracking-wide cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-md border border-white/10"
                      style={{ animation: 'fluctuate 3s ease-in-out infinite', animationDelay: '0.2s', padding: '0.45rem 1.5rem' }}
                      onClick={() => scrollToSection("gmp")}
                    >
                      <TrendingUp className="w-4 h-4 text-amber-300" /> GMP
                    </Ribbon>
                  )}

                  {blog.ipo_subscription && (
                    <Ribbon
                      fontSize="15px"
                      cutout="0.75em"
                      color={activeTab === "subscription" ? "linear-gradient(135deg, #002a52 0%, #0052a3 60%, #0080ff 100%)" : "rgba(255,255,255,0.12)"}
                      className="inline-flex items-center gap-2 text-white font-bold tracking-wide cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-md border border-white/10"
                      style={{ animation: 'fluctuate 3s ease-in-out infinite', animationDelay: '0.4s', padding: '0.45rem 1.5rem' }}
                      onClick={() => handleTabChange(activeTab === "subscription" ? "all" : "subscription")}
                    >
                      <Activity className="w-4 h-4 text-emerald-300" /> Subscription
                    </Ribbon>
                  )}
                </div>
              )}

              {blog.category === "daily_reporter" ? (
                <div className="flex flex-wrap gap-3">
                  {blog.linked_digest_id && (
                    <>
                      <Link
                        href={`/daily-ipo-digest/view/${blog.linked_digest_id}`}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all hover:scale-105 shadow-xl font-black text-sm"
                        style={{
                          background:
                            "linear-gradient(135deg, #f59e08, #d97706)",
                          color: "#001529",
                        }}
                      >
                        <Download className="w-4 h-4" /> Download Report
                      </Link>
                    </>
                  )}
                </div>
              ) : null}
            </div>

            {isValid(getImageUrl(blog.image)) && (
              <div className="w-full max-w-[320px] mx-auto lg:w-72 shrink-0 self-center lg:self-start">
                <div
                  className="rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02]"
                  style={{
                    border: "2px solid rgba(245,158,11,0.4)",
                    background: "rgba(0,0,0,0.1)",
                  }}
                >
                  <div className="bg-black/20 flex items-center justify-center aspect-square md:aspect-auto">
                    <img
                      src={getImageUrl(blog.image)!}
                      alt={blog.title}
                      className="w-full h-full object-contain max-h-[350px]"
                    />
                  </div>
                  <div
                    className="p-3 text-center"
                    style={{ background: "rgba(0,0,0,0.4)" }}
                  >
                    <p className="text-white font-bold text-xs truncate">
                      {blog.title}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 28L1440 28L1440 0C1200 22 720 28 360 14C180 7 60 0 0 0L0 28Z"
              fill="#f0f5ff"
            />
          </svg>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 pt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`lg:col-span-8 space-y-5 ${activeTab === "subscription" ? "lg:sticky lg:top-24 self-start" : ""}`}>
            {activeTab === "subscription" ? (
              renderSubscriptionTables()
            ) : (
              <>
            {blog.category !== "daily_reporter" &&
              finalIpoDetails.length > 0 &&
              !hasBoardManagementHeading &&
              !hasTimelineHeading && (
                <div
                  className="bg-white rounded-2xl  shadow-sm"
                  style={{ border: "1px solid #e2e8f0" }}
                >
                  <SectionHeader
                    icon={Info}
                    title={`${blog.title.replace(/\s+IPO$/i, "").trim()} IPO Details`}
                    accent="blue"
                  />
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr
                          style={{
                            background: "#f8fafc",
                            borderBottom: "2px solid #e2e8f0",
                          }}
                        >
                          <th
                            className="py-2.5 px-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-2/5"
                            style={{ borderRight: "1px solid #e2e8f0" }}
                          >
                            Detail
                          </th>
                          <th className="py-2.5 px-5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {finalIpoDetails.map((detail, idx) => (
                          <tr
                            key={idx}
                            className="transition-colors hover:bg-blue-50/40"
                            style={{
                              borderBottom: "1px solid #f1f5f9",
                              background: idx % 2 === 0 ? "#fff" : "#fafbff",
                            }}
                          >
                            <td
                              className="py-3 px-5 font-semibold text-slate-500 text-sm"
                              style={{ borderRight: "1px solid #f1f5f9" }}
                            >
                              {detail.label}
                            </td>
                            <td className="py-3 px-5 font-bold text-slate-800 text-sm">
                              {formatIndianNumber(detail.value)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            {blog.category === "daily_reporter" ? (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-100 shadow-inner flex items-center justify-center bg-blue-50">
                      <img
                        src="/logo.png"
                        alt="India IPO"
                        className="w-10 h-10 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://ui-avatars.com/api/?name=India+IPO&background=0284c7&color=fff";
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-800 flex items-center gap-1.5 leading-tight">
                        <User className="w-4 h-4 text-blue-600" /> India IPO
                      </p>
                      <p className="text-xs text-slate-500 font-bold flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />{" "}
                        {(() => {
                          const validCreated = !!(blog.created_at && !isNaN(new Date(blog.created_at).getTime()));
                          const validUpdated = !!(blog.updated_at && !isNaN(new Date(blog.updated_at).getTime()));
                          const displayDate = (validCreated && blog.created_at) 
                            ? new Date(blog.created_at) 
                            : (validUpdated && blog.updated_at ? new Date(blog.updated_at) : new Date());
                          return formatDate(displayDate);
                        })()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <SocialIcon
                      icon={Facebook}
                      color="#1877f2"
                      href="https://www.facebook.com/01indiapo"
                    />
                    <SocialIcon
                      icon={() => <span className="text-sm font-black">𝕏</span>}
                      color="#000000"
                      href="https://x.com/india_ipo1"
                    />
                    <SocialIcon
                      icon={Linkedin}
                      color="#0077b5"
                      href="https://www.linkedin.com/company/india-ipo/"
                    />
                    <SocialIcon
                      icon={Instagram}
                      color="#e4405f"
                      href="https://www.instagram.com/india_ipo1"
                    />
                    <SocialIcon
                      icon={MessageCircle}
                      color="#25d366"
                      href="https://wa.me/917428337280"
                    />
                  </div>
                </div>

                <ReporterSection
                  title="Recent IPO Updates"
                  icon={TrendingUp}
                  content={blog.recientipo}
                />
                <ReporterSection
                  title="P.E. & Funding Updates"
                  icon={Activity}
                  content={blog.private_equity}
                />
                <ReporterSection
                  title="Business & Economic Updates"
                  icon={Database}
                  content={blog.business_economics_update}
                />
                <ReporterSection
                  title="Geopolitical Updates"
                  icon={Globe}
                  content={blog.geopolitical_update}
                />

                {blog.source && (
                  <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                    <div className=" p-4 rounded-xl  bg-slate-50 flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="text-sm font-semibold text-slate-500 whitespace-nowrap">
                        Source:
                      </span>

                      <p className="text-slate-800 font-medium">
                        {blog.source}
                      </p>
                    </div>
                    <Link
                      href="/news"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-10 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95 mx-auto"
                    >
                      <Globe className="w-4 h-4" /> Latest IPO News
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <>
                {isValid(blog.content) && (
                  <div className="bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100 mb-12 relative">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />
                    <SectionHeader
                      icon={FileText}
                      title={`About ${blog.title}`}
                      accent="blue"
                    />
                    <div className="px-6 py-5 md:px-10 md:py-6 relative z-10">
                      <SmartBlogRenderer
                        content={blog.content}
                        bankers={bankers}
                        timelineTable={renderTimelineTable()}
                        ipoDetailsTable={renderIpoDetailsTable()}
                        financialInfoTable={renderFinancialInfoTable()}
                        gmpTrendTable={renderGmpTrendTable()}
                        kpiTable={renderKpiTable()}
                        valuationTable={renderValuationTable()}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {blog.category !== "daily_reporter" &&
              (isValid(blog.finantial_information_assets) ||
                finEnded.length > 0) &&
              !hasBoardManagementHeading &&
              renderFinancialInfoTable()}

            {blog.category !== "daily_reporter" &&
              gmpHistory.length > 0 &&
              !hasBoardManagementHeading &&
              !hasGmpHeading &&
              renderGmpTrendTable()}

            {blog.category !== "daily_reporter" && finalKpis.length > 0 && !hasBoardManagementHeading && renderKpiTable()}

            {blog.category !== "daily_reporter" &&
              (isValidRealData(prePe) || isValidRealData(preEps)) &&
              !hasBoardManagementHeading &&
              renderValuationTable()}

            {blog.category !== "daily_reporter" && renderComparisonTable()}

            {isValid(blog.faqs) &&
              (() => {
                let faqItems: { question: string; answer: string }[] = [];
                try {
                  const parsed = JSON.parse(blog.faqs);
                  if (Array.isArray(parsed)) {
                    faqItems = parsed
                      .filter((f) => f && f.question && f.answer)
                      .map((f) => ({
                        question: cleanGarbledText(f.question),
                        answer: cleanGarbledText(f.answer),
                      }));
                  }
                } catch (e) { }
                if (faqItems.length === 0) return null;
                return (
                  <div
                    className="bg-white rounded-2xl overflow-hidden shadow-sm"
                    style={{ border: "1px solid #e2e8f0" }}
                  >
                    <SectionHeader
                      icon={HelpCircle}
                      title="Frequently Asked Questions"
                      accent="green"
                    />
                    <div
                      className="divide-y"
                      style={{ borderColor: "#f1f5f9" }}
                    >
                      {faqItems.map((faq, idx) => (
                        <FAQAccordionItem key={idx} faq={faq} index={idx} />
                      ))}
                    </div>
                  </div>
                );
              })()}



            {/* Internal Linking: Services Section */}
            {blog.category !== "daily_reporter" && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 mt-8">
                <SectionHeader
                  icon={Shield}
                  title="Recommended Advisory Services"
                  accent="green"
                />
                <div className="p-6">
                  <p className="text-sm text-slate-500 mb-6 font-medium">
                    Ready to take your company public? Explore our specialized
                    IPO advisory services tailored for Indian enterprises.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        title: "SME IPO Advisory",
                        slug: "sme-ipo-consultant",
                        desc: "End-to-end support for NSE Emerge & BSE SME listings.",
                        icon: TrendingUp,
                      },
                      {
                        title: "Mainline IPO",
                        slug: "mainline-ipo-consultant",
                        desc: "Strategic advisory for large-cap public offerings.",
                        icon: Activity,
                      },
                      {
                        title: "Business Valuation",
                        slug: "business-valuation-services",
                        desc: "SEBI-compliant valuation reports for transactions.",
                        icon: IndianRupee,
                      },
                      {
                        title: "Pre-IPO Funding",
                        slug: "pre-ipo-consultant",
                        desc: "Capital raising and structuring before the public issue.",
                        icon: Wallet,
                      },
                    ].map((srv, idx) => (
                      <Link
                        key={idx}
                        href={`/${srv.slug}`}
                        className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <srv.icon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm group-hover:text-emerald-700">
                            {srv.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {srv.desc}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 ml-auto self-center group-hover:text-emerald-500" />
                      </Link>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                    <Button
                      asChild
                      variant="outline"
                      className="text-xs font-bold text-white bg-[#f99810]"
                    >
                      <Link href="/services">View All Advisory Services</Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <EditorialTeamInfo />
              </>
            )}
          </div>




          <div className="lg:col-span-4 relative space-y-5 flex flex-col">
            {blog.category !== "daily_reporter" && strengths.length > 0 && (
              <div
                className="bg-white rounded-2xl overflow-hidden shadow-sm"
                style={{ border: "1px solid #e2e8f0" }}
              >
                <SectionHeader
                  icon={CheckCircle2}
                  title="Competitive Strengths"
                  accent="green"
                />
                <div className="p-4 space-y-3">
                  {strengths.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 items-start p-3.5 rounded-xl transition-all hover:bg-emerald-50/50"
                      style={{
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                      }}
                    >
                      <div
                        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white mt-0.5 shadow-sm"
                        style={{
                          background:
                            "linear-gradient(135deg, #065f46, #047857)",
                        }}
                      >
                        {idx + 1}
                      </div>
                      <p className="text-[13px] font-bold text-slate-700 leading-snug">
                        {" "}
                        {String(s).replace(/^[•●▪◦]\s*/, "")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {blog.category !== "daily_reporter" &&
              (blog.confidential === "1"
                ? (() => {
                  // Parse multi-entry confidential DRHP arrays
                  const BAD = new Set([
                    "",
                    "null",
                    "undefined",
                    "[]",
                    '[""]',
                    '["null"]',
                  ]);
                  const cleanArr = (raw: string): string[] => {
                    if (!raw || BAD.has(raw.trim().toLowerCase()))
                      return [];
                    try {
                      const parsed = JSON.parse(raw);
                      if (Array.isArray(parsed))
                        return parsed
                          .map((v) => String(v ?? "").trim())
                          .filter((v) => v && v.toLowerCase() !== "null");
                    } catch {
                      /* not JSON */
                    }
                    return [raw.trim()].filter(
                      (v) => v && v.toLowerCase() !== "null",
                    );
                  };
                  const cPdfs = cleanArr(blog.confidential_drhp || "");
                  const cDescs = cleanArr(
                    blog.confidential_drhp_description || "",
                  );
                  const cDates = cleanArr(
                    blog.confidential_drhp_date || "",
                  );

                  let rows: {
                    pdf: string;
                    description: string;
                    date: string;
                  }[] = [];

                  // Check if cPdfs actually contains the full objects (new unified format)
                  try {
                    const raw = blog.confidential_drhp;
                    if (raw && raw.startsWith("[") && raw.includes("{")) {
                      const parsed = JSON.parse(raw);
                      if (
                        Array.isArray(parsed) &&
                        parsed.length > 0 &&
                        typeof parsed[0] === "object"
                      ) {
                        rows = parsed.map((r: any) => ({
                          pdf: r.pdf || r.drhp_file || "",
                          description:
                            r.description || r.drhp_description || "",
                          date: r.date || r.drhp_date || "",
                        }));
                      }
                    }
                  } catch (e) { }

                  if (rows.length === 0) {
                    const maxLen = Math.max(
                      cPdfs.length,
                      cDescs.length,
                      cDates.length,
                    );
                    // Build rows from parallel arrays (fallback)
                    rows = Array.from({ length: maxLen }, (_, i) => ({
                      pdf: cPdfs[i] || "",
                      description: cDescs[i] || "",
                      date: cDates[i] || "",
                    }));
                  }

                  const filteredRows = rows
                    .filter((r) => r.pdf || r.description || r.date)
                    .sort((a, b) => {
                      if (!a.date && !b.date) return 0;
                      if (!a.date) return 1;
                      if (!b.date) return -1;
                      return (
                        new Date(b.date).getTime() -
                        new Date(a.date).getTime()
                      );
                    });
                  if (filteredRows.length === 0) return null;
                  return (
                    <div
                      className="bg-white rounded-2xl overflow-hidden shadow-sm"
                      style={{ border: "1px solid #e2e8f0" }}
                    >
                      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">
                          IPO DRHP Status
                        </span>
                        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                          CONFIDENTIAL
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr
                              style={{
                                background: "#f8fafc",
                                borderBottom: "2px solid #e2e8f0",
                              }}
                            >
                              <th className="py-2 px-3 text-left text-[11px] font-bold text-slate-500 uppercase w-8">
                                Sr.no
                              </th>
                              <th className="py-2 px-3 text-left text-[11px] font-bold text-slate-500 uppercase">
                                Description
                              </th>
                              <th className="py-2 px-3 text-left text-[11px] font-bold text-slate-500 uppercase whitespace-nowrap">
                                Date
                              </th>
                              <th className="py-2 px-3 text-left text-[11px] font-bold text-slate-500 uppercase">
                                File
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredRows.map((row, idx) => {
                              const rawLink = String(row.pdf || "").trim();
                              let href = "";
                              if (rawLink) {
                                if (rawLink.startsWith("http"))
                                  href = rawLink;
                                else if (
                                  rawLink.startsWith("/uploads") ||
                                  rawLink.startsWith("uploads/")
                                )
                                  href = rawLink.startsWith("/")
                                    ? rawLink
                                    : `/${rawLink}`;
                                else href = `/uploads/${rawLink}`;
                              }
                              const fmtDate = row.date
                                ? (() => {
                                  try {
                                    return new Date(
                                      row.date,
                                    ).toLocaleDateString("en-IN", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    });
                                  } catch {
                                    return row.date;
                                  }
                                })()
                                : "-";
                              return (
                                <tr
                                  key={idx}
                                  className="hover:bg-amber-50/30 transition-colors"
                                  style={{
                                    borderBottom: "1px solid #f1f5f9",
                                    background:
                                      idx % 2 === 0 ? "#fff" : "#fffdf7",
                                  }}
                                >
                                  <td className="py-2.5 px-3 font-bold text-amber-600 text-xs">
                                    {idx + 1}
                                  </td>
                                  <td className="py-2.5 px-3 text-slate-700 text-xs">
                                    {row.description || "-"}
                                  </td>
                                  <td className="py-2.5 px-3 text-slate-600 text-xs whitespace-nowrap">
                                    {fmtDate}
                                  </td>
                                  <td className="py-2.5 px-3">
                                    {href ? (
                                      <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-bold text-white transition-all hover:opacity-90"
                                        style={{
                                          background:
                                            "linear-gradient(135deg, #1e40af, #1d4ed8)",
                                        }}
                                      >
                                        View DRHP
                                      </a>
                                    ) : (
                                      <span className="text-slate-400 text-xs">
                                        -
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()
                : (isValid(blog.drhp) || isValid(blog.rhp)) && (
                  <div
                    className="rounded-2xl overflow-hidden shadow-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #0c1e4a 0%, #1e3a8a 60%, #1e40af 100%)",
                      border: "1px solid rgba(245,158,11,0.3)",
                    }}
                  >
                    <div
                      className="px-5 py-4"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <div className="flex items-center gap-2 text-white font-bold text-sm font-heading">
                        <FileText className="w-4 h-4 text-amber-400" />{" "}
                        Official Documents
                      </div>
                      <p className="text-[10px] text-blue-300/60 mt-0.5">
                        Download regulatory filings
                      </p>
                    </div>
                    <div className="p-4 space-y-2.5">
                      {[
                        {
                          label: "Download DRHP",
                          icon: "📄",
                          link: blog.drhp,
                        },
                        {
                          label: "Download RHP",
                          icon: "📋",
                          link: blog.rhp,
                        },
                      ].map((doc, idx) => {
                        if (!isValid(doc.link)) return null;
                        const rawLink = String(doc.link || "").trim();
                        const isExternal = rawLink.startsWith("http");
                        let href: string;
                        if (isExternal) {
                          href = rawLink;
                        } else if (
                          rawLink.startsWith("/uploads") ||
                          rawLink.startsWith("uploads/")
                        ) {
                          href = rawLink.startsWith("/")
                            ? rawLink
                            : `/${rawLink}`;
                        } else {
                          href = `/uploads/${rawLink}`;
                        }
                        return (
                          <a
                            key={idx}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-white text-sm font-semibold transition-all group hover:scale-[1.02]"
                            style={{
                              background: "rgba(255,255,255,0.1)",
                              border: "1px solid rgba(255,255,255,0.12)",
                            }}
                            onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              "rgba(245,158,11,0.2)")
                            }
                            onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                              "rgba(255,255,255,0.1)")
                            }
                          >
                            <span className="flex items-center gap-2">
                              <span>{doc.icon}</span>
                              {doc.label}
                            </span>
                            <Download className="w-4 h-4 text-amber-400 group-hover:-translate-y-0.5 transition-transform" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}

            {blog.category !== "daily_reporter" &&
              finalTimeline.length > 0 &&
              !hasTimelineHeading && (
                <div
                  className="bg-white rounded-2xl overflow-hidden shadow-sm"
                  style={{ border: "1px solid #e2e8f0" }}
                >
                  <SectionHeader
                    icon={Calendar}
                    title={`${displayTitle} IPO Timeline`}
                    accent="blue"
                  />
                  <table className="w-full text-sm">
                    <tbody>
                      {finalTimeline.map((item, idx) => (
                        <tr
                          key={idx}
                          className="transition-colors hover:bg-blue-50/30"
                          style={{
                            borderBottom: "1px solid #f1f5f9",
                            background: idx % 2 === 0 ? "#fff" : "#fafbff",
                          }}
                        >
                          <td className="py-2.5 px-5 text-slate-500 font-medium text-xs">
                            {item.label}
                          </td>
                          <td className="py-2.5 px-5 text-right font-bold text-[#1e40af] text-[11px] leading-tight">
                            {item.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            {blog.category !== "daily_reporter" && lots.length > 0 && (
              <div
                className="bg-white rounded-2xl overflow-hidden shadow-sm"
                style={{ border: "1px solid #e2e8f0" }}
              >
                <SectionHeader
                  icon={TrendingUp}
                  title="IPO Lot Size"
                  accent="green"
                />
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      style={{
                        background: "#f0fdf4",
                        borderBottom: "1px solid #bbf7d0",
                      }}
                    >
                      <th className="text-left py-2.5 px-5 text-xs font-bold text-emerald-700 uppercase">
                        Investors
                      </th>
                      <th className="text-center py-2.5 px-3 text-xs font-bold text-emerald-700 uppercase">
                        No.of lots
                      </th>
                      <th className="text-center py-2.5 px-3 text-xs font-bold text-emerald-700 uppercase">
                        Shares Offered
                      </th>
                      <th className="text-right py-2.5 px-5 text-xs font-bold text-emerald-700 uppercase">
                        Max Bid Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lots.map((lot, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-emerald-50/30 transition-colors"
                        style={{
                          borderBottom: "1px solid #f1f5f9",
                          background: idx % 2 === 0 ? "#fff" : "#fafffb",
                        }}
                      >
                        <td className="py-3 px-5 font-semibold text-slate-700 text-xs">
                          {appInfoArray[idx] || "—"}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-emerald-700 text-xs">
                          {lot}
                        </td>
                        <td className="py-3 px-3 text-center text-slate-600 font-semibold text-xs">
                          {cleanGarbledText(lotShares[idx] || "—")}
                        </td>
                        <td className="py-3 px-5 text-right font-black text-slate-900 text-xs">
                          {cleanGarbledText(lotAmounts[idx] || "—")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="lg:sticky space-y-3 pb-4 z-10" style={{ top: "min(90px, calc(100vh - 1480px))" }}>
              {relatedBlogs.length > 0 && (
                <div
                  className="bg-white rounded-2xl overflow-hidden shadow-sm"
                  style={{ border: "1px solid #e2e8f0" }}
                >
                  <SectionHeader
                    icon={Flame}
                    title={
                      blog.category === "daily_reporter"
                        ? "Related Daily Reporter"
                        : "Related IPO Blogs"
                    }
                    accent="blue"
                  />
                  <div className="max-h-[180px] overflow-y-auto">
                    <div
                      className="divide-y"
                      style={{ borderColor: "#f1f5f9" }}
                    >
                      {relatedBlogs.map((rb, idx) => {
                        const rbImg = getImageUrl(rb.image);
                        const isUp = rb.upcoming === "1";
                        return (
                          <Link
                            key={`${rb.id}-${idx}`}
                            href={
                              rb.category === "daily_reporter"
                                ? `/daily-reporter/${rb.slug}`
                                : `/ipo-blogs/${rb.slug}`
                            }
                            className="flex gap-2 p-2 hover:bg-blue-50/40 transition-colors group block shrink-0"
                          >
                            <div
                              className="shrink-0 w-10 h-10 rounded-lg overflow-hidden"
                              style={{
                                background: "#eff6ff",
                                border: "1px solid #bfdbfe",
                              }}
                            >
                              {rbImg ? (
                                <img
                                  src={getImageUrl(rb.image)}
                                  alt={rb.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <BarChart3
                                    className="w-5 h-5"
                                    style={{ color: "#1e40af" }}
                                  />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-800 leading-tight line-clamp-2 group-hover:text-[#1e40af] transition-colors">
                                {rb.title}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#1e40af] shrink-0 self-center transition-colors" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                  <div
                    className="px-4 py-2"
                    style={{
                      background: "#f8fafc",
                      borderTop: "1px solid #e2e8f0",
                    }}
                  >
                    <Link
                      href={
                        blog.category === "daily_reporter"
                          ? "/daily-ipo-digest"
                          : "/ipo-blogs"
                      }
                      className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#1e40af] hover:text-[#1d4ed8] transition-colors"
                    >
                      {blog.category === "daily_reporter"
                        ? "View All Daily Reports"
                        : "View All IPO Blogs"}{" "}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {blog.category !== "daily_reporter" &&
                (isValidRealData(preHolding) ||
                  isValidRealData(postHolding)) && (
                  <div
                    className="bg-white rounded-2xl overflow-hidden shadow-sm"
                    style={{ border: "1px solid #e2e8f0" }}
                  >
                    <SectionHeader
                      icon={Wallet}
                      title="Promoter Holding"
                      accent="purple"
                    />
                    <div className="p-4 space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-500">
                            Pre-Issue Holding
                          </span>
                          <span style={{ color: "#4c1d95" }}>
                            {isValidRealData(preHolding) ? preHolding : "-"}
                            {isValidRealData(preHolding) &&
                              !preHolding.includes("%")
                              ? "%"
                              : ""}
                          </span>
                        </div>
                        {isValidRealData(preHolding) && (
                          <div
                            className="h-2 w-full rounded-full overflow-hidden"
                            style={{ background: "#f1f5f9" }}
                          >
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: preHolding.includes("%")
                                  ? preHolding
                                  : `${preHolding}%`,
                                background:
                                  "linear-gradient(90deg, #4c1d95, #7c3aed)",
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-500">
                            Post-Issue Holding
                          </span>
                          <span style={{ color: "#065f46" }}>
                            {isValidRealData(postHolding) ? postHolding : "-"}
                            {isValidRealData(postHolding) &&
                              !postHolding.includes("%")
                              ? "%"
                              : ""}
                          </span>
                        </div>
                        {isValidRealData(postHolding) && (
                          <div
                            className="h-2 w-full rounded-full overflow-hidden"
                            style={{ background: "#f1f5f9" }}
                          >
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: postHolding.includes("%")
                                  ? postHolding
                                  : `${postHolding}%`,
                                background:
                                  "linear-gradient(90deg, #065f46, #059669)",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              <div
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200"
              >
                <SectionHeader
                  icon={TrendingUp}
                  title="Quick IPO Resources"
                  accent="blue"
                />
                <div className="p-3 space-y-2.5">
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
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-blue-50/40 hover:border-blue-200 text-slate-800 hover:text-[#1e40af] transition-all hover:scale-[1.01] active:scale-95 group"
                    >
                      <div>
                        <p className="font-bold text-xs leading-tight">{item.label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium group-hover:text-blue-500/80 transition-colors">{item.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#1e40af] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>

              <div
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200"
              >
                <SectionHeader
                  icon={Newspaper}
                  title="Trending News"
                  accent="blue"
                />
                <div className="p-3 space-y-2.5">
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
                          className="flex gap-3 items-center p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-blue-50/40 hover:border-blue-200 text-slate-800 hover:text-[#1e40af] transition-all hover:scale-[1.01] active:scale-95 group block"
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
                            <p className="font-bold text-xs leading-tight line-clamp-2">{item.title}</p>
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

                  <div className="pt-2 text-center">
                    <Link
                      href="/news"
                      className="text-[11px] font-bold text-[#1e40af] uppercase tracking-widest hover:text-[#1d4ed8] transition-colors inline-block"
                    >
                      View All News
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};


