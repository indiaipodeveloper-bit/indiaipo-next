"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, ChevronLeft, ChevronRight, Layout, BarChart, Info, List, Link as LinkIcon, Database, HelpCircle, Download, FileText, Search, TrendingUp, Activity, Globe } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn, formatIndianNumber, getImageUrl } from "@/lib/utils";
import { Calendar as CalendarIcon, Upload } from "lucide-react";
import RichEditor from "@/components/ui/RichEditor";
import { API_URL } from "@/lib/constants";

const DeleteConfirmButton = ({ onDelete, className = "" }: { onDelete: () => void; className?: string }) => {
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (confirm) {
      const timer = setTimeout(() => setConfirm(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [confirm]);

  if (confirm) {
    return (
      <Button
        variant="destructive"
        size="sm"
        className={cn("h-7 px-2 text-[10px] font-bold animate-in fade-in zoom-in duration-200", className)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete();
          setConfirm(false);
        }}
      >
        Confirm?
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("h-7 w-7 p-0 text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors", className)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setConfirm(true);
      }}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  );
};

interface AdminBlog {
  id: string; title: string; new_slug: string; slug: string;
  image: string; content: string; faqs: string; status: string;
  confidential: string; upcoming: string; category: string;
  new_highlight_text: string; gmp_date: string; gmp_ipo_price: string;
  gmp: string; gmp_last_updated: string;
  ipo_details: string; ipo_description: string;
  ipo_timeline_details: string; ipo_timeline_description: string;
  ipo_lots_application: string; ipo_lots: string;
  ipo_lots_share: string; ipo_lots_amount: string;
  promotor_hold_pre_issue: string; promotor_hold_post_issue: string;
  finantial_information_ended: string; finantial_information_assets: string;
  finantial_information_revenue: string; finantial_information_profit_tax: string;
  financial_info_reserves_surplus: string; finantial_information_networth: string;
  finantial_information_borrowing: string;
  key_kpi: string; key_value: string; key_pri_ipo_eps: string;
  key_pos_ipo_eps: string; key_pre_ipo_pe: string; key_post_ipo_pe: string;
  competative_strenght: string;
  meta_title: string; description: string; keyword: string;
  rhp: string; drhp: string; confidential_drhp: string;
  confidential_drhp_description?: string;
  confidential_drhp_date?: string;
  state?: string; city?: string; pincode?: string;
  drhp_status?: string;
  recientipo?: string;
  private_equity?: string;
  business_economics_update?: string;
  geopolitical_update?: string;
  source?: string;
  user_id?: string | number;
  created_at: string;
}

const emptyForm: Partial<AdminBlog> = {
  title: "", new_slug: "", slug: "", category: "ipo_updates", status: "1", upcoming: "0", image: "",
  content: "", faqs: "", new_highlight_text: "",
  gmp_date: "", gmp_ipo_price: "", gmp: "", gmp_last_updated: "",
  ipo_details: "", ipo_description: "",
  ipo_timeline_details: "", ipo_timeline_description: "",
  ipo_lots_application: "", ipo_lots: "", ipo_lots_share: "", ipo_lots_amount: "",
  promotor_hold_pre_issue: "", promotor_hold_post_issue: "",
  finantial_information_ended: "", finantial_information_assets: "",
  finantial_information_revenue: "", finantial_information_profit_tax: "",
  financial_info_reserves_surplus: "", finantial_information_networth: "",
  finantial_information_borrowing: "",
  key_kpi: "", key_value: "", key_pri_ipo_eps: "",
  key_pos_ipo_eps: "", key_pre_ipo_pe: "", key_post_ipo_pe: "",
  competative_strenght: "",
  meta_title: "", description: "", keyword: "",
  rhp: "", drhp: "", confidential_drhp: "",
  confidential_drhp_description: "", confidential_drhp_date: "",
  confidential: "0",
  state: "", city: "", pincode: "", drhp_status: "No",
  recientipo: "", private_equity: "", business_economics_update: "", geopolitical_update: "",
  source: ""
};

const parseIPODateRange = (value: string): { startDate: Date | null, endDate: Date | null } => {
  if (!value) return { startDate: null, endDate: null };
  const val = value.trim();
  if (val.includes(' to ')) {
    const parts = val.split(' to ');
    if (parts.length < 2) return { startDate: null, endDate: null };
    const startPart = parts[0].trim();
    const endPart = parts[1].trim();

    const endDate = new Date(endPart);
    if (isNaN(endDate.getTime())) {
      const dateMatch = endPart.match(/\d{1,2}\s+[A-Za-z]{3,}\s*,?\s*\d{4}/);
      if (dateMatch) {
        const parsedEnd = new Date(dateMatch[0]);
        if (!isNaN(parsedEnd.getTime())) {
          return parseWithEndDate(startPart, parsedEnd);
        }
      }
      return { startDate: null, endDate: null };
    }
    return parseWithEndDate(startPart, endDate);
  } else {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return { startDate: d, endDate: null };
    }
  }
  return { startDate: null, endDate: null };
};

const parseWithEndDate = (startPart: string, endDate: Date): { startDate: Date | null, endDate: Date | null } => {
  const startDay = parseInt(startPart);
  if (isNaN(startDay)) {
    return { startDate: null, endDate };
  }

  const monthMatch = startPart.match(/[A-Za-z]{3,}/);
  if (monthMatch) {
    const startMonth = monthMatch[0];
    const startYear = endDate.getFullYear();
    const startDate = new Date(`${startDay} ${startMonth} ${startYear}`);
    if (!isNaN(startDate.getTime())) {
      return { startDate, endDate };
    }
  }

  const startDate = new Date(endDate);
  startDate.setDate(startDay);
  if (startDay > endDate.getDate()) {
    startDate.setMonth(startDate.getMonth() - 1);
  }
  return { startDate, endDate };
};

const formatIPODateRange = (startDate: Date | null, endDate: Date | null): string => {
  if (!startDate && !endDate) return "";
  if (startDate && !endDate) {
    return format(startDate, "d MMM, yyyy");
  }
  if (!startDate && endDate) {
    return format(endDate, "d MMM, yyyy");
  }
  if (startDate && endDate) {
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();

    if (startYear === endYear && startMonth === endMonth) {
      return `${format(startDate, "d")} to ${format(endDate, "d MMM, yyyy")}`;
    } else {
      if (startYear === endYear) {
        return `${format(startDate, "d MMM")} to ${format(endDate, "d MMM, yyyy")}`;
      } else {
        return `${format(startDate, "d MMM, yyyy")} to ${format(endDate, "d MMM, yyyy")}`;
      }
    }
  }
  return "";
};

export default function IPOBlogsClient() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const BAD_VALUES = new Set(['null', '[null]', 'undefined', '[]', '["null"]', '']);

  const fixUnicode = (s: string) =>
    s.replace(/\\u20b9/g, '₹').replace(/\\u20b5/g, '₹').replace(/\\u0026/g, '&').replace(/\\u2019/g, "'");

  const formatDisplayValue = (val: any) => {
    if (val === null || val === undefined) return '—';
    const s = String(val).trim();
    if (BAD_VALUES.has(s.toLowerCase())) return '—';

    let displayStr = s;
    if (s.startsWith('[') && s.endsWith(']')) {
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) {
          const items = parsed.filter(i => i !== null && i !== undefined && !BAD_VALUES.has(String(i).toLowerCase().trim()));
          if (items.length === 0) return '—';
          displayStr = items[0] !== undefined ? String(items[0]) : '—';
        }
      } catch (e) { }
    }
    return formatIndianNumber(fixUnicode(displayStr));
  };

  const cleanFormValue = (val: any, isFaqField = false) => {
    if (val === null || val === undefined) return '';
    const s = String(val).trim();
    if (BAD_VALUES.has(s.toLowerCase())) return '';

    if (s.startsWith('[') && s.endsWith(']')) {
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) {
          if (isFaqField) return s;
          const cleaned = parsed
            .filter(item => item !== null && item !== undefined && !BAD_VALUES.has(String(item).toLowerCase().trim()))
            .map(item => {
              if (typeof item === 'object') return JSON.stringify(item);
              return fixUnicode(String(item).trim());
            })
            .filter(item => item !== '');

          const filtered = cleaned.filter(item => {
            const lower = item.toLowerCase();
            return !lower.includes('promoter holding') &&
              !lower.includes('share holding') &&
              !lower.includes('promotor hold');
          });

          if (filtered.length > 0) {
            const numericItem = filtered.find(item => /\d/.test(item));
            return numericItem || filtered[0];
          }
          return '';
        }
      } catch (e) { }
    }

    if (s.startsWith('"') && s.endsWith('"')) {
      return s.substring(1, s.length - 1);
    }
    return fixUnicode(s);
  };

  const [form, setForm] = useState<Record<string, any>>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeTab, setActiveTab] = useState("0");
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const [lotRows, setLotRows] = useState<{ app: string; lots: string; shares: string; amount: string }[]>([]);
  const [timelineRows, setTimelineRows] = useState<{ label: string; date: string }[]>([]);
  const [kpiRows, setKpiRows] = useState<{ name: string; value: string }[]>([]);
  const [additionalDetailsRows, setAdditionalDetailsRows] = useState<{ label: string; value: string }[]>([]);
  const [financialRows, setFinancialRows] = useState<{ ended: string; assets: string; revenue: string; profit: string; networth: string; reserves: string; borrowing: string }[]>([]);
  const [strengthRows, setStrengthRows] = useState<string[]>([]);
  const [faqRows, setFaqRows] = useState<{ question: string; answer: string }[]>([]);
  const [recentIpoRows, setRecentIpoRows] = useState<string[]>([]);
  const [peFundingRows, setPeFundingRows] = useState<string[]>([]);
  const [businessEconomicRows, setBusinessEconomicRows] = useState<string[]>([]);
  const [geopoliticalRows, setGeopoliticalRows] = useState<string[]>([]);
  const [gmpRows, setGmpRows] = useState<{ date: string; price: string; gmp: string; updated: string }[]>([]);
  const [confidentialDrhpRows, setConfidentialDrhpRows] = useState<{ description: string; date: string; pdf: string }[]>([]);
  const [dailyDigests, setDailyDigests] = useState<any[]>([]);
  const [modalTab, setModalTab] = useState("basic");

  const getHeaders = (json = true) => {
    const h: Record<string, string> = {};
    if (json) h["Content-Type"] = "application/json";
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) h["Authorization"] = `Bearer ${token}`;
    }
    return h;
  };

  const splitValue = (val: any): string[] => {
    if (val === null || val === undefined) return [];
    if (Array.isArray(val)) {
      return val.map(v => {
        const s = String(v).trim();
        return (v === null || v === undefined || s.toLowerCase() === 'null') ? '' : s;
      });
    }
    const s = String(val).trim();
    if (s.startsWith('[') && s.endsWith(']')) {
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) {
          return parsed.map(v => {
            const sv = String(v).trim();
            return (v === null || v === undefined || sv.toLowerCase() === 'null') ? '' : sv;
          });
        }
      } catch (e) { }
    }
    return s.split(',').map(v => v.trim()).filter(v => v.toLowerCase() !== 'null');
  };

  const fetchBlogs = async (p = 1, upcomingTab = activeTab, searchTerm = search, cat = activeCategory) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: p.toString(),
        limit: "20",
        summary: "1",
        upcoming: upcomingTab,
        search: searchTerm
      });
      if (cat !== "all") {
        queryParams.append("category", cat);
      }
      const res = await fetch(`${API_URL}/api/admin-blogs?${queryParams.toString()}`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.data || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
        setPage(data.page || 1);
      }
    } catch (err) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(1, activeTab, search, activeCategory);
    fetchDailyDigests();
  }, [activeTab, activeCategory]);

  const fetchDailyDigests = async () => {
    try {
      const res = await fetch(`${API_URL}/api/daily-digests?limit=100`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setDailyDigests(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (search === "") {
      fetchBlogs(1, activeTab, "");
      return;
    }
    const timer = setTimeout(() => {
      fetchBlogs(1, activeTab, search, activeCategory);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const cleanNumber = (val: string) => {
    if (!val) return 0;
    return Number(val.replace(/[^0-9]/g, ""));
  };

  const toJSONArray = (val: any) => {
    if (val === null || val === undefined || val === "") return JSON.stringify([]);
    return JSON.stringify([val]);
  };

  const handleSave = async () => {
    if (!form.title) {
      toast.error("Title required");
      return;
    }

    const currentSlug = form.new_slug || form.slug;
    if (!currentSlug || currentSlug.trim() === "") {
      toast.error("invalid slug");
      return;
    }

    const newTimelineRows = [...timelineRows];
    let timelineChanged = false;

    const ipoDateRow = additionalDetailsRows.find(r => r.label.toLowerCase().includes('ipo date'));
    if (ipoDateRow && ipoDateRow.value) {
      const { startDate, endDate } = parseIPODateRange(ipoDateRow.value);
      if (startDate) {
        const openIdx = newTimelineRows.findIndex(r => r.label.toLowerCase() === 'ipo open date');
        if (openIdx !== -1 && !newTimelineRows[openIdx].date) {
          newTimelineRows[openIdx].date = format(startDate, "EEE, MMM d, yyyy");
          timelineChanged = true;
        }
      }
      if (endDate) {
        const closeIdx = newTimelineRows.findIndex(r => r.label.toLowerCase() === 'ipo close date');
        if (closeIdx !== -1 && !newTimelineRows[closeIdx].date) {
          newTimelineRows[closeIdx].date = format(endDate, "EEE, MMM d, yyyy");
          timelineChanged = true;
        }
      }
    }

    const listingDateRow = additionalDetailsRows.find(r => r.label.toLowerCase() === 'listing date');
    if (listingDateRow && listingDateRow.value) {
      const listingIdx = newTimelineRows.findIndex(r => r.label.toLowerCase() === 'listing date');
      if (listingIdx !== -1 && !newTimelineRows[listingIdx].date) {
        const parsedListing = new Date(listingDateRow.value.trim());
        if (!isNaN(parsedListing.getTime())) {
          newTimelineRows[listingIdx].date = format(parsedListing, "EEE, MMM d, yyyy");
          timelineChanged = true;
        } else {
          newTimelineRows[listingIdx].date = listingDateRow.value.trim();
          timelineChanged = true;
        }
      }
    }

    if (timelineChanged) {
      setTimelineRows(newTimelineRows);
    }

    if (ipoDateRow) {
      const { startDate, endDate } = parseIPODateRange(ipoDateRow.value);
      if (startDate && endDate && endDate < startDate) {
        toast.error("ending date kam nhi honi chiaye starting date se");
        return;
      }
    }

    let openStr = "", closeStr = "", listingStr = "";
    newTimelineRows.forEach(r => {
      const lbl = r.label.toLowerCase();
      if (lbl.includes('open date')) openStr = r.date;
      else if (lbl.includes('close date')) closeStr = r.date;
      else if (lbl.includes('listing date')) listingStr = r.date;
    });

    const parseHumanDate = (s: string) => {
      if (!s) return null;
      const clean = s.trim().replace(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s*/i, '');
      const dmyMatch = clean.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
      if (dmyMatch) {
        const day = parseInt(dmyMatch[1], 10);
        const month = parseInt(dmyMatch[2], 10);
        const year = parseInt(dmyMatch[3], 10);
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          return new Date(year, month - 1, day);
        }
      }
      const d = new Date(clean);
      return isNaN(d.getTime()) ? null : d;
    };

    const openDate = parseHumanDate(openStr);
    const closeDate = parseHumanDate(closeStr);
    const listingDate = parseHumanDate(listingStr);

    if (openDate && closeDate && openDate > closeDate) {
      toast.error(`ipo open date (${openStr || "empty"}) close date (${closeStr || "empty"}) se Jayda nhi hogi`);
      return;
    }
    if (closeDate && listingDate && listingDate <= closeDate) {
      toast.error(`listing date (${listingStr || "empty"}) close date (${closeStr || "empty"}) ke kam nhi ho sakti`);
      return;
    }

    setSaving(true);
    try {
      const updatedForm: any = { ...form };
      delete updatedForm.id;
      delete updatedForm.created_at;
      delete updatedForm.updated_at;

      if (!editingId && !updatedForm.user_id) {
        updatedForm.user_id = Number(user?.id) || 1;
      }

      updatedForm.status = Number(form.status ?? 1);
      updatedForm.upcoming = String(form.upcoming ?? "0");

      const cleanNumeric = (v: any) => String(v || "").trim();
      const cleanDateOnly = (v: any) => {
        const s = String(v || '').trim();
        const dateMatch = s.match(/\d{1,2}\s+[A-Za-z]{3,}\s*,?\s*\d{4}(\s*\|\s*\d{1,2}:\d{2}\s*[AaPp][Mm])?/);
        return dateMatch ? dateMatch[0] : "";
      };

      updatedForm.gmp = JSON.stringify(gmpRows.map(r => cleanNumeric(r.gmp)));
      updatedForm.gmp_ipo_price = JSON.stringify(gmpRows.map(r => cleanNumeric(r.price)));
      updatedForm.gmp_date = JSON.stringify(gmpRows.map(r => cleanDateOnly(r.date)));
      updatedForm.gmp_last_updated = JSON.stringify(gmpRows.map(r => cleanDateOnly(r.updated)));

      updatedForm.promotor_hold_pre_issue = toJSONArray(String(form.promotor_hold_pre_issue || "").replace(/[^0-9.]/g, ""));
      updatedForm.promotor_hold_post_issue = toJSONArray(String(form.promotor_hold_post_issue || "").replace(/[^0-9.]/g, ""));

      updatedForm.ipo_lots_application = JSON.stringify(
        lotRows.map(r => r.app?.toString().trim()).filter(Boolean)
      );
      updatedForm.ipo_lots = JSON.stringify(
        lotRows.map(r => Number(r.lots) || 0)
      );
      updatedForm.ipo_lots_share = JSON.stringify(
        lotRows.map(r => cleanNumber(r.shares))
      );
      updatedForm.ipo_lots_amount = JSON.stringify(
        lotRows.map(r => cleanNumber(r.amount))
      );

      updatedForm.ipo_timeline_details = JSON.stringify(
        timelineRows.map(r => r.label)
      );
      updatedForm.ipo_timeline_description = JSON.stringify(
        timelineRows.map(r => r.date)
      );

      updatedForm.ipo_details = JSON.stringify(
        additionalDetailsRows.map(r => r.label)
      );
      updatedForm.ipo_description = JSON.stringify(
        additionalDetailsRows.map(r => {
          let val = r.value;
          if (r.label.toLowerCase().includes('date') && !r.label.toLowerCase().includes('ipo date')) {
            const match = val.match(/\d{1,2}\s+[A-Za-z]{3,}\s*,?\s*\d{4}/);
            val = match ? match[0] : "";
          }
          return val;
        })
      );

      updatedForm.key_kpi = JSON.stringify(
        kpiRows.map(r => r.name)
      );
      updatedForm.key_value = JSON.stringify(
        kpiRows.map(r => r.value)
      );

      updatedForm.finantial_information_ended = JSON.stringify(
        financialRows.map(r => r.ended)
      );
      updatedForm.finantial_information_assets = JSON.stringify(
        financialRows.map(r => r.assets)
      );
      updatedForm.finantial_information_revenue = JSON.stringify(
        financialRows.map(r => r.revenue)
      );
      updatedForm.finantial_information_profit_tax = JSON.stringify(
        financialRows.map(r => r.profit)
      );
      updatedForm.finantial_information_networth = JSON.stringify(
        financialRows.map(r => r.networth)
      );
      updatedForm.financial_info_reserves_surplus = JSON.stringify(
        financialRows.map(r => r.reserves)
      );
      updatedForm.finantial_information_borrowing = JSON.stringify(
        financialRows.map(r => r.borrowing)
      );

      updatedForm.competative_strenght = JSON.stringify(
        strengthRows.filter(s => s.trim())
      );
      updatedForm.faqs = JSON.stringify(
        faqRows.filter(f => f.question.trim())
      );

      updatedForm.recientipo = JSON.stringify(recentIpoRows.filter(s => s.trim()));
      updatedForm.private_equity = JSON.stringify(peFundingRows.filter(s => s.trim()));
      updatedForm.business_economics_update = JSON.stringify(businessEconomicRows.filter(s => s.trim()));
      updatedForm.geopolitical_update = JSON.stringify(geopoliticalRows.filter(s => s.trim()));

      updatedForm.confidential_drhp = JSON.stringify(confidentialDrhpRows);

      updatedForm.key_pri_ipo_eps = String(form.key_pri_ipo_eps || "");
      updatedForm.key_pos_ipo_eps = String(form.key_pos_ipo_eps || "");
      updatedForm.key_pre_ipo_pe = String(form.key_pre_ipo_pe || "");
      updatedForm.key_post_ipo_pe = String(form.key_post_ipo_pe || "");

      const finalSlug = (form.new_slug || form.slug || "").trim();
      if (finalSlug) {
        updatedForm.slug = finalSlug;
        updatedForm.new_slug = finalSlug;
      }

      const url = editingId
        ? `${API_URL}/api/admin-blogs/${editingId}`
        : `${API_URL}/api/admin-blogs`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(updatedForm),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save failed");
      }

      toast.success(editingId ? "Blog updated!" : "Blog created!");
      setForm(emptyForm);
      setEditingId(null);
      setDialogOpen(false);
      fetchBlogs(page, activeTab, search, activeCategory);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (b: AdminBlog) => {
    try {
      setSaving(true);
      const res = await fetch(`${API_URL}/api/admin-blogs/id/${b.id}`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const fullData = await res.json();

        const cleanedData: Record<string, any> = {};
        for (const [key, val] of Object.entries(fullData)) {
          if (key === 'content') {
            cleanedData[key] = val ?? '';
          } else if (key === 'faqs') {
            cleanedData[key] = cleanFormValue(val, true);
          } else if (typeof val === 'string' || val === null) {
            cleanedData[key] = cleanFormValue(val);
          } else if (key === 'source') {
            cleanedData[key] = val ?? '';
          } else {
            cleanedData[key] = val;
          }
        }

        const rawPre = splitValue(fullData.promotor_hold_pre_issue);
        const rawPost = splitValue(fullData.promotor_hold_post_issue);
        const isGarbage = (s: string) => s.toLowerCase().includes('holding') || s.toLowerCase().includes('promotor') || !/\d/.test(s);

        const preNums = rawPre.filter(s => !isGarbage(s));
        const postNums = rawPost.filter(s => !isGarbage(s));

        if (preNums.length === 0 && postNums.length >= 2) {
          cleanedData.promotor_hold_pre_issue = postNums[0];
          cleanedData.promotor_hold_post_issue = postNums[1];
        } else if (preNums.length === 0 && postNums.length === 1) {
          cleanedData.promotor_hold_pre_issue = postNums[0];
          cleanedData.promotor_hold_post_issue = '';
        } else {
          cleanedData.promotor_hold_pre_issue = preNums[0] || '';
          cleanedData.promotor_hold_post_issue = postNums[0] || '';
        }

        const gmpDates = splitValue(fullData.gmp_date);
        const gmpPrices = splitValue(fullData.gmp_ipo_price);
        const gmpValues = splitValue(fullData.gmp);
        const gmpUpdates = splitValue(fullData.gmp_last_updated);
        const maxGmp = Math.max(gmpDates.length, gmpPrices.length, gmpValues.length, gmpUpdates.length);
        const newGmpRows = [];
        for (let i = 0; i < maxGmp; i++) {
          newGmpRows.push({
            date: gmpDates[i] || '',
            price: gmpPrices[i] || '',
            gmp: gmpValues[i] || '',
            updated: gmpUpdates[i] || ''
          });
        }
        setGmpRows(newGmpRows);

        setForm(cleanedData);
        setEditingId(b.id);

        const apps = splitValue(fullData.ipo_lots_application);
        const lots = splitValue(fullData.ipo_lots);
        const shares = splitValue(fullData.ipo_lots_share);
        const amounts = splitValue(fullData.ipo_lots_amount);
        const maxLots = Math.max(apps.length, lots.length, shares.length, amounts.length);
        const newLotRows = [];
        for (let i = 0; i < maxLots; i++) {
          newLotRows.push({ app: apps[i] || '', lots: lots[i] || '', shares: shares[i] || '', amount: amounts[i] || '' });
        }
        setLotRows(newLotRows);

        const timelineLabels = splitValue(fullData.ipo_timeline_details);
        const timelineDates = splitValue(fullData.ipo_timeline_description);
        const maxTimelines = Math.max(timelineLabels.length, timelineDates.length);
        const newTimelineRows = [];
        for (let i = 0; i < maxTimelines; i++) {
          newTimelineRows.push({ label: timelineLabels[i] || '', date: timelineDates[i] || '' });
        }
        setTimelineRows(newTimelineRows);

        const kpiNames = splitValue(fullData.key_kpi);
        const kpiValues = splitValue(fullData.key_value);
        const maxKpis = Math.max(kpiNames.length, kpiValues.length);
        const newKpiRows = [];
        for (let i = 0; i < maxKpis; i++) {
          newKpiRows.push({ name: kpiNames[i] || '', value: kpiValues[i] || '' });
        }
        setKpiRows(newKpiRows);

        const detailLabels = splitValue(fullData.ipo_details);
        const detailValues = splitValue(fullData.ipo_description);
        const maxDetails = Math.max(detailLabels.length, detailValues.length);
        const newDetailRows = [];
        for (let i = 0; i < maxDetails; i++) {
          newDetailRows.push({ label: detailLabels[i] || '', value: detailValues[i] || '' });
        }
        setAdditionalDetailsRows(newDetailRows);

        const finEnded = splitValue(fullData.finantial_information_ended);
        const finAssets = splitValue(fullData.finantial_information_assets);
        const finRev = splitValue(fullData.finantial_information_revenue);
        const finProfit = splitValue(fullData.finantial_information_profit_tax);
        const finNet = splitValue(fullData.finantial_information_networth);
        const finRes = splitValue(fullData.financial_info_reserves_surplus);
        const finBor = splitValue(fullData.finantial_information_borrowing);
        const maxFin = Math.max(finEnded.length, finAssets.length, finRev.length, finProfit.length, finNet.length, finRes.length, finBor.length);
        const newFinRows = [];
        for (let i = 0; i < maxFin; i++) {
          newFinRows.push({
            ended: finEnded[i] || '',
            assets: finAssets[i] || '',
            revenue: finRev[i] || '',
            profit: finProfit[i] || '',
            networth: finNet[i] || '',
            reserves: finRes[i] || '',
            borrowing: finBor[i] || ''
          });
        }
        setFinancialRows(newFinRows);

        setStrengthRows(splitValue(fullData.competative_strenght));
        let parsedFaqs = [];
        try {
          const rawFaqs = fullData.faqs;
          if (rawFaqs) {
            parsedFaqs = typeof rawFaqs === 'string' ? JSON.parse(rawFaqs) : rawFaqs;
          }
        } catch { parsedFaqs = []; }
        setFaqRows(Array.isArray(parsedFaqs) ? parsedFaqs.map((f: any) => ({ question: f.question || '', answer: f.answer || '' })) : []);

        setRecentIpoRows(splitValue(fullData.recientipo));
        setPeFundingRows(splitValue(fullData.private_equity));
        setBusinessEconomicRows(splitValue(fullData.business_economics_update));
        setGeopoliticalRows(splitValue(fullData.geopolitical_update));

        let newCDrhpRows: { pdf: string; description: string; date: string; }[] = [];
        try {
          const raw = fullData.confidential_drhp;
          if (raw && raw.startsWith('[') && raw.includes('{')) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              newCDrhpRows = parsed.map((r: any) => ({
                pdf: r.pdf || r.drhp_file || '',
                description: r.description || r.drhp_description || '',
                date: r.date || r.drhp_date || ''
              }));
            }
          }
        } catch { }

        if (newCDrhpRows.length === 0) {
          const cDrhpPdfs = splitValue(fullData.confidential_drhp);
          const cDrhpDescs = splitValue(fullData.confidential_drhp_description);
          const cDrhpDates = splitValue(fullData.confidential_drhp_date);
          const maxCDrhp = Math.max(cDrhpPdfs.length, cDrhpDescs.length, cDrhpDates.length);
          for (let i = 0; i < maxCDrhp; i++) {
            newCDrhpRows.push({ pdf: cDrhpPdfs[i] || '', description: cDrhpDescs[i] || '', date: cDrhpDates[i] || '' });
          }
        }
        if (newCDrhpRows.length === 0) newCDrhpRows.push({ description: '', date: '', pdf: '' });
        setConfidentialDrhpRows(newCDrhpRows);

        setModalTab("basic");
        setDialogOpen(true);
      } else {
        toast.error("Failed to load full details");
      }
    } catch {
      toast.error("Error fetching full details");
    } finally {
      setSaving(false);
    }
  };

  const handleAddNew = () => {
    setForm({ ...emptyForm, upcoming: activeTab });
    setEditingId(null);
    setLotRows([
      { app: 'Individual investors (Retail) (Min)', lots: '', shares: '', amount: '' },
      { app: 'Individual investors (Retail) (Max)', lots: '', shares: '', amount: '' },
      { app: 'S-HNI (Min)', lots: '', shares: '', amount: '' },
      { app: 'S-HNI (Max)', lots: '', shares: '', amount: '' },
      { app: 'B-HNI (Min)', lots: '', shares: '', amount: '' }
    ]);
    setGmpRows([{ date: '', price: '', gmp: '', updated: '' }]);
    setTimelineRows([
      { label: 'IPO Open Date', date: '' },
      { label: 'IPO Close Date', date: '' },
      { label: 'Basis of Allotment', date: '' },
      { label: 'Initiation of Refunds', date: '' },
      { label: 'Credit of Shares to Demat', date: '' },
      { label: 'Listing Date', date: '' },
      { label: 'Cut-off time for UPI mandate confirmation', date: '' }
    ]);
    setKpiRows([
      { name: 'ROE', value: '' },
      { name: 'ROCE', value: '' },
      { name: 'Debt/Equity', value: '' },
      { name: 'RoNW', value: '' },
      { name: 'PAT Margin', value: '' },
      { name: 'EBITDA Margin', value: '' },
      { name: 'Price to Book Value', value: '' }
    ]);
    setAdditionalDetailsRows([
      { label: 'IPO Date', value: '' },
      { label: 'Listing Date', value: '' },
      { label: 'Face Value', value: '₹10 Per Equity Share' },
      { label: 'Issue Price Band', value: '' },
      { label: 'Lot Size', value: '' },
      { label: 'Sale Type', value: 'Fresh Issue + Offer For Sale' },
      { label: 'Total Issue Size', value: '' },
      { label: 'Reserved for Market Maker', value: '' },
      { label: 'Fresh Issue(Ex Market Maker)', value: '' },
      { label: 'Offer for Sale', value: '' },
      { label: 'Net Offered to Public', value: '' },
      { label: 'Issue Type', value: 'Book Built Issue' },
      { label: 'Listing At', value: 'BSESME / NSESME' },
      { label: 'Share Holding Pre Issue', value: '' },
      { label: 'Share Holding Post Issue', value: '' }
    ]);
    setFinancialRows([
      { ended: '31 Mar 2024', assets: '', revenue: '', profit: '', networth: '', reserves: '', borrowing: '' },
      { ended: '31 Mar 2023', assets: '', revenue: '', profit: '', networth: '', reserves: '', borrowing: '' },
      { ended: '31 Mar 2022', assets: '', revenue: '', profit: '', networth: '', reserves: '', borrowing: '' }
    ]);
    setStrengthRows(['', '', '']);
    setFaqRows([{ question: '', answer: '' }]);
    setRecentIpoRows(['']);
    setPeFundingRows(['']);
    setBusinessEconomicRows(['']);
    setGeopoliticalRows(['']);
    setConfidentialDrhpRows([{ description: '', date: '', pdf: '' }]);
    setModalTab("basic");
    setDialogOpen(true);
  };

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  };

  const getAutoValues = () => {
    const lotSizeRow = additionalDetailsRows.find(r => r.label.toLowerCase().includes('lot size'));
    const priceBandRow = additionalDetailsRows.find(r => r.label.toLowerCase().includes('price band'));

    let lotSize = 0;
    if (lotSizeRow) {
      const match = lotSizeRow.value.match(/(\d+[,]*\d*)/);
      if (match) lotSize = parseInt(match[1].replace(/,/g, ''));
    }

    let maxPrice = 0;
    if (priceBandRow) {
      const prices = priceBandRow.value.match(/(\d+)/g);
      if (prices && prices.length > 0) {
        maxPrice = Math.max(...prices.map(p => parseInt(p)));
      }
    }
    return { lotSize, maxPrice };
  };

  const calculateLotLine = (lotsRaw: string, index: number) => {
    const lotsStr = lotsRaw.replace(/[^0-9]/g, "");
    const { lotSize, maxPrice } = getAutoValues();
    const lots = parseInt(lotsStr) || 0;
    const shares = lots * lotSize;
    const amountNum = shares * maxPrice;

    const newRows = [...lotRows];
    newRows[index].lots = lotsStr;
    newRows[index].shares = shares > 0 ? formatIndianNumber(shares) : '';
    newRows[index].amount = amountNum > 0 ? `₹${formatIndianNumber(amountNum)}` : '';
    setLotRows(newRows);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, folder = "admin_blogs", isPdf = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isPdf && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error("Please upload a PDF file");
      return;
    }

    const fileTypeLabel = isPdf ? "pdf" : "image";
    if (file.size > 25 * 1024 * 1024) {
      toast.error(`cannot upload ${fileTypeLabel} >25 mb`);
      return;
    }

    const formData = new FormData();
    formData.append("folder", folder);
    formData.append("file", file);

    const tId = toast.loading(`Uploading ${fieldName}...`);
    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: getHeaders(false),
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setForm((prev) => ({ ...prev, [fieldName]: data.url }));
      toast.success(`${fieldName} uploaded successfully!`, { id: tId });
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to upload ${fileTypeLabel}`, { id: tId });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog?")) return;
    try {
      const res = await fetch(`${API_URL}/api/admin-blogs/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (res.ok) {
        toast.success("Blog deleted");
        fetchBlogs(page);
      } else {
        throw new Error("Delete failed");
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage IPO Blogs</h1>
          <p className="text-sm text-muted-foreground">Extensive DB of {total} IPOs (Page {page} of {totalPages})</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 max-w-2xl justify-end">
          <div className="relative flex-1 w-full">
            <Input
              placeholder="Search IPOs by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-card border-border/50 text-foreground"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <Select value={activeCategory} onValueChange={setActiveCategory}>
            <SelectTrigger className="w-[180px] h-10 bg-card border-border/50 text-foreground">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="ipo_updates">IPO Blogs</SelectItem>
              <SelectItem value="ipo_blogs">Blogs</SelectItem>
              <SelectItem value="daily_reporter">Daily Reporter</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setForm(emptyForm); setEditingId(null); } }}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground font-semibold h-10" onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" /> Add IPO Blog
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-4xl max-h-[90vh] overflow-y-auto w-full bg-white text-foreground"
              onPointerDownOutside={(e) => { e.preventDefault(); }}
              onEscapeKeyDown={(e) => { e.preventDefault(); }}
            >
              <DialogHeader>
                <DialogTitle className="text-foreground">{editingId ? "Edit IPO Blog" : "Add New IPO Blog"}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <Tabs value={modalTab} onValueChange={setModalTab} defaultValue="basic" className="w-full">
                  {form.category === 'daily_reporter' ? (
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger value="basic" className="flex items-center gap-1.5 text-foreground"><Info className="w-3.5 h-3.5" /> Basic Info</TabsTrigger>
                      <TabsTrigger value="content" className="flex items-center gap-1.5 text-foreground"><Layout className="w-3.5 h-3.5" /> Content & FAQs</TabsTrigger>
                      <TabsTrigger value="seo" className="flex items-center gap-1.5 text-foreground"><LinkIcon className="w-3.5 h-3.5" /> SEO</TabsTrigger>
                    </TabsList>
                  ) : form.category === 'ipo_blogs' ? (
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger value="basic" className="flex items-center gap-1.5 text-foreground"><Info className="w-3.5 h-3.5" /> Basic</TabsTrigger>
                      <TabsTrigger value="content" className="flex items-center gap-1.5 text-foreground"><Layout className="w-3.5 h-3.5" /> Content</TabsTrigger>
                      <TabsTrigger value="seo" className="flex items-center gap-1.5 text-foreground"><LinkIcon className="w-3.5 h-3.5" /> SEO/Docs</TabsTrigger>
                    </TabsList>
                  ) : (
                    <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
                      <TabsTrigger value="basic" className="flex items-center gap-1.5 text-foreground"><Info className="w-3.5 h-3.5" /> Basic</TabsTrigger>
                      <TabsTrigger value="gmp" className="flex items-center gap-1.5 text-foreground"><BarChart className="w-3.5 h-3.5" /> GMP/Lots</TabsTrigger>
                      <TabsTrigger value="timelines" className="flex items-center gap-1.5 text-foreground"><List className="w-3.5 h-3.5" /> Timelines</TabsTrigger>
                      <TabsTrigger value="financials" className="flex items-center gap-1.5 text-foreground"><Database className="w-3.5 h-3.5" /> Financials</TabsTrigger>
                      <TabsTrigger value="content" className="flex items-center gap-1.5 text-foreground"><Layout className="w-3.5 h-3.5" /> Content</TabsTrigger>
                      <TabsTrigger value="seo" className="flex items-center gap-1.5 text-foreground"><LinkIcon className="w-3.5 h-3.5" /> SEO/Docs</TabsTrigger>
                    </TabsList>
                  )}

                  <TabsContent value="basic" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block text-foreground">Title *</label>
                        <Input
                          value={form.title || ''}
                          onChange={(e) => {
                            const newTitle = e.target.value;
                            const newSlug = slugify(newTitle);
                            setForm({
                              ...form,
                              title: newTitle,
                              meta_title: newTitle,
                              slug: editingId ? (form.slug || newSlug) : newSlug,
                              new_slug: editingId ? (form.new_slug || form.slug || newSlug) : newSlug
                            });
                          }}
                          className="text-foreground bg-card"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block text-foreground">URL Slug</label>
                        <Input
                          value={form.new_slug || form.slug || ''}
                          onChange={(e) => setForm({ ...form, new_slug: e.target.value, slug: e.target.value })}
                          placeholder="e.g. my-awesome-ipo"
                          className="text-foreground bg-card"
                        />
                      </div>
                      {form.category !== 'ipo_blogs' && (
                        <div>
                          <label className="text-sm font-medium mb-1.5 block text-foreground">Upcoming Status</label>
                          <Select value={String(form.upcoming || '0')} onValueChange={(v) => setForm({ ...form, upcoming: v })}>
                            <SelectTrigger className="text-foreground bg-card"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Current IPO</SelectItem>
                              <SelectItem value="1">Upcoming IPO</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium mb-1.5 block text-foreground">Blog Category</label>
                        <Select value={form.category || 'ipo_updates'} onValueChange={(v) => setForm({ ...form, category: v })}>
                          <SelectTrigger className="text-foreground bg-card"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ipo_updates">IPO Blogs</SelectItem>
                            <SelectItem value="ipo_blogs">Blogs</SelectItem>
                            <SelectItem value="daily_reporter">Daily Reporter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-1.5 block text-foreground">Featured Image</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Input
                              value={form.image || ''}
                              onChange={(e) => setForm({ ...form, image: e.target.value })}
                              placeholder="Image URL or path (e.g., logo.png)"
                              className="pr-10 text-foreground bg-card"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          </div>
                          <div className="relative shrink-0">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const categoryFolders: Record<string, string> = {
                                  'ipo_blogs': 'blogs',
                                  'news': 'news',
                                  'ipo_updates': 'companyblog',
                                  'daily_reporter': 'dailyreporter'
                                };
                                const dynamicFolder = categoryFolders[form.category || ''] || 'admin_blogs';
                                handleFileUpload(e, 'image', dynamicFolder);
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <Button type="button" variant="outline" className="h-10 text-foreground">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload
                            </Button>
                          </div>
                        </div>
                        {form.image && (
                          <div className="mt-3 relative inline-block">
                            <div className="w-40 h-24 rounded-xl overflow-hidden border-2 border-border shadow-sm group bg-muted/30">
                              <img
                                src={getImageUrl(form.image)}
                                alt="Featured Preview"
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="h-8 w-8 rounded-full shadow-lg"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setForm({ ...form, image: '' });
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {form.category === 'daily_reporter' && (
                      <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                        <label className="text-sm font-semibold mb-1.5 block text-blue-700 flex items-center gap-1.5">
                          <FileText className="w-4 h-4" /> News Heading/Source
                        </label>
                        <Input
                          placeholder="e.g. Major Market Update Today"
                          value={form.source || ''}
                          onChange={(e) => setForm({ ...form, source: e.target.value })}
                          className="border-blue-200 focus:ring-blue-500 bg-card text-foreground"
                        />
                      </div>
                    )}
                  </TabsContent>

                  {form.category === 'ipo_updates' && (
                    <>
                      <TabsContent value="gmp" className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-foreground">GMP Update History (Daily Updates)</h4>
                            <Button type="button" variant="outline" size="sm" onClick={() => setGmpRows([...gmpRows, { date: '', price: gmpRows[gmpRows.length - 1]?.price || '', gmp: '', updated: '' }])} className="text-foreground">
                              <Plus className="w-3 h-3 mr-1" /> Add GMP Update
                            </Button>
                          </div>
                          <div className="overflow-x-auto border border-border rounded-lg">
                            <table className="w-full text-xs">
                              <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                  <th className="p-2 text-left font-semibold text-foreground">GMP Date</th>
                                  <th className="p-2 text-left font-semibold text-foreground">IPO Price Band</th>
                                  <th className="p-2 text-left font-semibold text-foreground">Latest GMP</th>
                                  <th className="p-2 text-left font-semibold text-foreground">GMP Last Updated</th>
                                  <th className="p-2 text-center font-semibold w-10"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {gmpRows.map((row, idx) => (
                                  <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/30">
                                    <td className="p-2">
                                      <div className="flex gap-1">
                                        <Input className="h-8 text-xs flex-1 text-foreground bg-card" value={row.date} onChange={(e) => { const n = [...gmpRows]; n[idx].date = e.target.value; setGmpRows(n); }} placeholder="dd MMM, yyyy" />
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <Button variant="outline" className="h-8 w-8 p-0 shrink-0 text-foreground"><CalendarIcon className="h-3 w-3" /></Button>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-auto p-0 bg-white" align="end">
                                            <Calendar
                                              mode="single"
                                              onSelect={(date) => { if (date) { const n = [...gmpRows]; n[idx].date = format(date, "dd MMM, yyyy"); setGmpRows(n); } }}
                                              initialFocus
                                            />
                                          </PopoverContent>
                                        </Popover>
                                      </div>
                                    </td>
                                    <td className="p-2">
                                      <Input className="h-8 text-xs text-foreground bg-card" value={row.price} onChange={(e) => { const n = [...gmpRows]; n[idx].price = e.target.value; setGmpRows(n); }} placeholder="Enter Price" />
                                    </td>
                                    <td className="p-2">
                                      <Input className="h-8 text-xs text-foreground bg-card" value={row.gmp} onChange={(e) => { const n = [...gmpRows]; n[idx].gmp = e.target.value; setGmpRows(n); }} placeholder="Enter GMP" />
                                    </td>
                                    <td className="p-2">
                                      <div className="flex gap-1">
                                        <Input className="h-8 text-xs flex-1 text-foreground bg-card" value={row.updated} onChange={(e) => { const n = [...gmpRows]; n[idx].updated = e.target.value; setGmpRows(n); }} placeholder="dd MMM, yyyy | hh:mm a" />
                                        <Button
                                          variant="ghost"
                                          className="h-8 px-2 text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                          onClick={() => {
                                            const n = [...gmpRows];
                                            n[idx].updated = format(new Date(), "dd MMM, yyyy | hh:mm a");
                                            setGmpRows(n);
                                          }}
                                        >
                                          NOW
                                        </Button>
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <Button variant="outline" className="h-8 w-8 p-0 shrink-0 text-foreground"><CalendarIcon className="h-3 w-3" /></Button>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-auto p-0 bg-white" align="end">
                                            <Calendar
                                              mode="single"
                                              onSelect={(date) => {
                                                if (date) {
                                                  const now = new Date();
                                                  const selectedDate = new Date(date);
                                                  selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
                                                  const n = [...gmpRows];
                                                  n[idx].updated = format(selectedDate, "dd MMM, yyyy | hh:mm a");
                                                  setGmpRows(n);
                                                }
                                              }}
                                              initialFocus
                                            />
                                          </PopoverContent>
                                        </Popover>
                                      </div>
                                    </td>
                                    <td className="p-2 text-center">
                                      <DeleteConfirmButton onDelete={() => setGmpRows(gmpRows.filter((_, i) => i !== idx))} />
                                    </td>
                                  </tr>
                                ))}
                                {gmpRows.length === 0 && (
                                  <tr><td colSpan={5} className="p-4 text-center text-muted-foreground italic">No GMP data added.</td></tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="pt-4 border-t mb-6 border-border">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-semibold text-foreground">Additional IPO Details (Summary)</h4>
                            <Button type="button" variant="outline" size="sm" onClick={() => setAdditionalDetailsRows([...additionalDetailsRows, { label: '', value: '' }])} className="text-foreground">
                              <Plus className="w-3 h-3 mr-1" /> Add Detail
                            </Button>
                          </div>
                          <div className="overflow-x-auto border border-border rounded-lg">
                            <table className="w-full text-xs">
                              <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                  <th className="p-2 text-left font-semibold w-2/5 text-foreground">Detail Label</th>
                                  <th className="p-2 text-left font-semibold w-2/5 text-foreground">Description/Value</th>
                                  <th className="p-2 text-center font-semibold w-10"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {additionalDetailsRows.map((row, idx) => (
                                  <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/30">
                                    <td className="p-2"><Input className="h-8 text-xs text-foreground bg-card" value={row.label} onChange={(e) => { const newRows = [...additionalDetailsRows]; newRows[idx].label = e.target.value; setAdditionalDetailsRows(newRows); }} placeholder="Detail Label" /></td>
                                    <td className="p-2">
                                      <div className="flex gap-1">
                                        <Input
                                          className="h-8 text-xs flex-1 text-foreground bg-card"
                                          value={row.value}
                                          onChange={(e) => { const newRows = [...additionalDetailsRows]; newRows[idx].value = e.target.value; setAdditionalDetailsRows(newRows); }}
                                          onBlur={(e) => { const newRows = [...additionalDetailsRows]; newRows[idx].value = formatIndianNumber(e.target.value); setAdditionalDetailsRows(newRows); }}
                                          placeholder="Value"
                                        />
                                        {(row.label.toLowerCase().includes('date')) && (
                                          <div className="flex gap-1">
                                            {row.label.toLowerCase().includes('ipo date') ? (
                                              <>
                                                <Popover>
                                                  <PopoverTrigger asChild>
                                                    <Button variant="outline" className="h-8 w-8 p-0 shrink-0 text-foreground" title="IPO Start Date">
                                                      <CalendarIcon className="h-3 w-3 text-blue-500" />
                                                    </Button>
                                                  </PopoverTrigger>
                                                  <PopoverContent className="w-auto p-0 bg-white" align="end">
                                                    <Calendar
                                                      mode="single"
                                                      onSelect={(date) => {
                                                        if (date) {
                                                          const n = [...additionalDetailsRows];
                                                          const currentVal = n[idx].value || "";
                                                          const { endDate } = parseIPODateRange(currentVal);
                                                          n[idx].value = formatIPODateRange(date, endDate);
                                                          setAdditionalDetailsRows(n);
                                                        }
                                                      }}
                                                      initialFocus
                                                    />
                                                  </PopoverContent>
                                                </Popover>
                                                <Popover>
                                                  <PopoverTrigger asChild>
                                                    <Button variant="outline" className="h-8 w-8 p-0 shrink-0 text-foreground" title="IPO End Date">
                                                      <CalendarIcon className="h-3 w-3 text-green-500" />
                                                    </Button>
                                                  </PopoverTrigger>
                                                  <PopoverContent className="w-auto p-0 bg-white" align="end">
                                                    <Calendar
                                                      mode="single"
                                                      onSelect={(date) => {
                                                        if (date) {
                                                          const n = [...additionalDetailsRows];
                                                          const currentVal = n[idx].value || "";
                                                          const { startDate } = parseIPODateRange(currentVal);
                                                          if (startDate && date < startDate) {
                                                            toast.error("Ending date should be greater than starting Date");
                                                            return;
                                                          }
                                                          n[idx].value = formatIPODateRange(startDate, date);
                                                          setAdditionalDetailsRows(n);
                                                        }
                                                      }}
                                                      initialFocus
                                                    />
                                                  </PopoverContent>
                                                </Popover>
                                              </>
                                            ) : (
                                              <Popover>
                                                <PopoverTrigger asChild>
                                                  <Button variant="outline" className="h-8 w-8 p-0 shrink-0 text-foreground"><CalendarIcon className="h-3 w-3" /></Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-white" align="end">
                                                  <Calendar
                                                    mode="single"
                                                    onSelect={(date) => {
                                                      if (date) {
                                                        const n = [...additionalDetailsRows];
                                                        n[idx].value = format(date, "d MMM, yyyy");
                                                        setAdditionalDetailsRows(n);
                                                      }
                                                    }}
                                                    initialFocus
                                                  />
                                                </PopoverContent>
                                              </Popover>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                    <td className="p-2 text-center">
                                      <DeleteConfirmButton onDelete={() => setAdditionalDetailsRows(additionalDetailsRows.filter((_, i) => i !== idx))} />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-foreground">Lot Size Information</h4>
                            <Button type="button" variant="outline" size="sm" onClick={() => setLotRows([...lotRows, { app: '', lots: '', shares: '', amount: '' }])} className="text-foreground">
                              <Plus className="w-3 h-3 mr-1" /> Add Category
                            </Button>
                          </div>
                          <div className="overflow-x-auto border border-border rounded-lg">
                            <table className="w-full text-xs">
                              <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                  <th className="p-2 text-left font-semibold text-foreground">Application Info</th>
                                  <th className="p-2 text-left font-semibold text-foreground">Lots</th>
                                  <th className="p-2 text-left font-semibold text-foreground">Shares</th>
                                  <th className="p-2 text-left font-semibold text-foreground">Amount</th>
                                  <th className="p-2 text-center font-semibold w-10 text-foreground"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {lotRows.map((row, idx) => (
                                  <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/30">
                                    <td className="p-2 w-1/3"><Input className="h-8 text-xs font-medium text-foreground bg-card" value={row.app} onChange={(e) => { const n = [...lotRows]; n[idx].app = e.target.value; setLotRows(n); }} placeholder="e.g. Retail Individual" /></td>
                                    <td className="p-2 w-1/6"><Input className="h-8 text-xs text-center text-foreground bg-card" value={row.lots} onChange={(e) => calculateLotLine(e.target.value, idx)} placeholder="0" /></td>
                                    <td className="p-2 w-1/4"><Input className="h-8 text-xs text-center text-foreground bg-card" value={row.shares} onChange={(e) => { const n = [...lotRows]; n[idx].shares = e.target.value; setLotRows(n); }} onBlur={(e) => { const n = [...lotRows]; n[idx].shares = formatIndianNumber(e.target.value); setLotRows(n); }} placeholder="0" /></td>
                                    <td className="p-2 w-1/4"><Input className="h-8 text-xs text-foreground bg-card" value={row.amount} onChange={(e) => { const n = [...lotRows]; n[idx].amount = e.target.value; setLotRows(n); }} onBlur={(e) => { const n = [...lotRows]; n[idx].amount = formatIndianNumber(e.target.value); setLotRows(n); }} placeholder="₹0" /></td>
                                    <td className="p-2 text-center">
                                      <DeleteConfirmButton onDelete={() => setLotRows(lotRows.filter((_, i) => i !== idx))} />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="timelines" className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-foreground">IPO Timelines</h4>
                          <Button type="button" variant="outline" size="sm" onClick={() => setTimelineRows([...timelineRows, { label: '', date: '' }])} className="text-foreground">
                            <Plus className="w-3 h-3 mr-1" /> Add Row
                          </Button>
                        </div>
                        <div className="overflow-x-auto border border-border rounded-lg">
                          <table className="w-full text-xs">
                            <thead className="bg-muted/50 border-b border-border">
                              <tr>
                                <th className="p-2 text-left font-semibold text-foreground">Timeline Event Label</th>
                                <th className="p-2 text-left font-semibold text-foreground">Date/Details</th>
                                <th className="p-2 text-center font-semibold w-10 text-foreground"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {timelineRows.map((row, idx) => (
                                <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/30">
                                  <td className="p-2 w-1/2"><Input className="h-8 text-xs text-foreground bg-card" value={row.label} onChange={(e) => { const newRows = [...timelineRows]; newRows[idx].label = e.target.value; setTimelineRows(newRows); }} placeholder="IPO Open Date" /></td>
                                  <td className="p-2 w-1/2">
                                    <div className="flex gap-1">
                                      <Input
                                        className="h-8 text-xs flex-1 text-foreground bg-card"
                                        value={row.date}
                                        onChange={(e) => { const newRows = [...timelineRows]; newRows[idx].date = e.target.value; setTimelineRows(newRows); }}
                                        placeholder="Mar 19, 2025"
                                      />
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button variant="outline" className={cn("h-8 w-8 p-0 text-muted-foreground")}>
                                            <CalendarIcon className="h-3 w-3 text-foreground" />
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-white" align="end">
                                          <Calendar
                                            mode="single"
                                            onSelect={(date) => {
                                              if (date) {
                                                const newRows = [...timelineRows];
                                                newRows[idx].date = format(date, "EEE, MMM d, yyyy");
                                                setTimelineRows(newRows);
                                              }
                                            }}
                                            initialFocus
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </div>
                                  </td>
                                  <td className="p-2 text-center">
                                    <DeleteConfirmButton onDelete={() => setTimelineRows(timelineRows.filter((_, i) => i !== idx))} />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </TabsContent>

                      <TabsContent value="financials" className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-foreground">Financial Summary (Values in ₹ Crore)</h4>
                            <Button type="button" variant="outline" size="sm" onClick={() => setFinancialRows([{ ended: '', assets: '', revenue: '', profit: '', networth: '', reserves: '', borrowing: '' }, ...financialRows])} className="text-foreground">
                              <Plus className="w-3 h-3 mr-1" /> Add Year
                            </Button>
                          </div>
                          <div className="overflow-x-auto border border-border rounded-lg shadow-sm">
                            <table className="w-full text-[11px]">
                              <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                  <th className="p-2 text-left font-bold w-24 text-foreground">Period Ended</th>
                                  <th className="p-2 text-left font-bold text-foreground">Assets</th>
                                  <th className="p-2 text-left font-bold text-foreground">Revenue</th>
                                  <th className="p-2 text-left font-bold text-foreground">Profit (PAT)</th>
                                  <th className="p-2 text-left font-bold text-foreground">Net Worth</th>
                                  <th className="p-2 text-left font-bold text-foreground">Reserves</th>
                                  <th className="p-2 text-left font-bold text-foreground">Borrowing</th>
                                  <th className="p-2 text-center font-bold w-10"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {financialRows.map((row, idx) => (
                                  <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/30">
                                    <td className="p-1">
                                      <div className="flex gap-1 items-center">
                                        <Input className="h-8 text-[11px] px-2 flex-1 min-w-[80px] text-foreground bg-card" value={row.ended} onChange={(e) => { const n = [...financialRows]; n[idx].ended = e.target.value; setFinancialRows(n); }} placeholder="31 Mar 2024" />
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <Button variant="outline" className="h-7 w-7 p-0 shrink-0 text-foreground"><CalendarIcon className="h-3 w-3" /></Button>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-auto p-0 bg-white" align="start">
                                            <Calendar
                                              mode="single"
                                              onSelect={(date) => {
                                                if (date) {
                                                  const n = [...financialRows];
                                                  n[idx].ended = format(date, "dd MMM yyyy");
                                                  setFinancialRows(n);
                                                }
                                              }}
                                              initialFocus
                                            />
                                          </PopoverContent>
                                        </Popover>
                                      </div>
                                    </td>
                                    <td className="p-1"><Input className="h-8 text-[11px] px-2 text-foreground bg-card" value={row.assets} onChange={(e) => { const n = [...financialRows]; n[idx].assets = e.target.value.replace(/[^0-9.+\-()]/g, ""); setFinancialRows(n); }} onBlur={(e) => { const n = [...financialRows]; n[idx].assets = formatIndianNumber(e.target.value); setFinancialRows(n); }} placeholder="56.67" /></td>
                                    <td className="p-1"><Input className="h-8 text-[11px] px-2 text-foreground bg-card" value={row.revenue} onChange={(e) => { const n = [...financialRows]; n[idx].revenue = e.target.value.replace(/[^0-9.+\-()]/g, ""); setFinancialRows(n); }} onBlur={(e) => { const n = [...financialRows]; n[idx].revenue = formatIndianNumber(e.target.value); setFinancialRows(n); }} placeholder="45.63" /></td>
                                    <td className="p-1"><Input className="h-8 text-[11px] px-2 text-foreground bg-card" value={row.profit} onChange={(e) => { const n = [...financialRows]; n[idx].profit = e.target.value.replace(/[^0-9.+\-()]/g, ""); setFinancialRows(n); }} onBlur={(e) => { const n = [...financialRows]; n[idx].profit = formatIndianNumber(e.target.value); setFinancialRows(n); }} placeholder="4.11" /></td>
                                    <td className="p-1"><Input className="h-8 text-[11px] px-2 text-foreground bg-card" value={row.networth} onChange={(e) => { const n = [...financialRows]; n[idx].networth = e.target.value.replace(/[^0-9.+\-()]/g, ""); setFinancialRows(n); }} onBlur={(e) => { const n = [...financialRows]; n[idx].networth = formatIndianNumber(e.target.value); setFinancialRows(n); }} placeholder="22.01" /></td>
                                    <td className="p-1"><Input className="h-8 text-[11px] px-2 text-foreground bg-card" value={row.reserves} onChange={(e) => { const n = [...financialRows]; n[idx].reserves = e.target.value.replace(/[^0-9.+\-()]/g, ""); setFinancialRows(n); }} onBlur={(e) => { const n = [...financialRows]; n[idx].reserves = formatIndianNumber(e.target.value); setFinancialRows(n); }} placeholder="10.50" /></td>
                                    <td className="p-1"><Input className="h-8 text-[11px] px-2 text-foreground bg-card" value={row.borrowing} onChange={(e) => { const n = [...financialRows]; n[idx].borrowing = e.target.value.replace(/[^0-9.+\-()]/g, ""); setFinancialRows(n); }} onBlur={(e) => { const n = [...financialRows]; n[idx].borrowing = formatIndianNumber(e.target.value); setFinancialRows(n); }} placeholder="17.17" /></td>
                                    <td className="p-1 text-center">
                                      <DeleteConfirmButton onDelete={() => setFinancialRows(financialRows.filter((_, i) => i !== idx))} />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
                          <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-foreground">Promoter Holding</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-medium mb-1 block text-foreground">Pre-Issue %</label>
                                <Input
                                  value={form.promotor_hold_pre_issue || ''}
                                  onChange={(e) => setForm({ ...form, promotor_hold_pre_issue: e.target.value.replace(/[^0-9.]/g, "") })}
                                  onBlur={(e) => setForm({ ...form, promotor_hold_pre_issue: formatIndianNumber(e.target.value) })}
                                  className="text-foreground bg-card"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-1 block text-foreground">Post-Issue %</label>
                                <Input
                                  value={form.promotor_hold_post_issue || ''}
                                  onChange={(e) => setForm({ ...form, promotor_hold_post_issue: e.target.value.replace(/[^0-9.]/g, "") })}
                                  onBlur={(e) => setForm({ ...form, promotor_hold_post_issue: formatIndianNumber(e.target.value) })}
                                  className="text-foreground bg-card"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-foreground">Key KPIs</h4>
                              <Button type="button" variant="outline" size="sm" onClick={() => setKpiRows([...kpiRows, { name: '', value: '' }])} className="text-foreground">
                                <Plus className="w-3 h-3 mr-1" /> Add Row
                              </Button>
                            </div>
                            <div className="overflow-x-auto border border-border rounded-lg">
                              <table className="w-full text-xs">
                                <thead className="bg-muted/50 border-b border-border">
                                  <tr>
                                    <th className="p-2 text-left font-semibold text-foreground">KPI Name</th>
                                    <th className="p-2 text-left font-semibold text-foreground">Value</th>
                                    <th className="p-2 text-center font-semibold w-10"></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {kpiRows.map((row, idx) => (
                                    <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/30">
                                      <td className="p-2"><Input className="h-8 text-xs text-foreground bg-card" value={row.name} onChange={(e) => { const newRows = [...kpiRows]; newRows[idx].name = e.target.value; setKpiRows(newRows); }} placeholder="ROE" /></td>
                                      <td className="p-2">
                                        <Input
                                          className="h-8 text-xs text-foreground bg-card"
                                          value={row.value}
                                          onChange={(e) => {
                                            const newRows = [...kpiRows];
                                            newRows[idx].value = e.target.value.replace(/[^0-9.%:()\-/, ]/g, "");
                                            setKpiRows(newRows);
                                          }}
                                          onBlur={(e) => {
                                            const newRows = [...kpiRows];
                                            newRows[idx].value = formatIndianNumber(e.target.value);
                                            setKpiRows(newRows);
                                          }}
                                          placeholder="15%"
                                        />
                                      </td>
                                      <td className="p-2 text-center">
                                        <DeleteConfirmButton onDelete={() => setKpiRows(kpiRows.filter((_, i) => i !== idx))} />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                          <h4 className="text-sm font-semibold mb-3 text-foreground">Valuation Metrics Table</h4>
                          <div className="overflow-hidden border border-border rounded-lg max-w-2xl">
                            <table className="w-full text-xs">
                              <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                  <th className="p-2 text-left font-bold w-32 border-r border-border text-foreground">KPI Metric</th>
                                  <th className="p-2 text-left font-bold text-foreground">Pre-IPO</th>
                                  <th className="p-2 text-left font-bold border-l border-border text-foreground">Post-IPO</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-border hover:bg-muted/30">
                                  <td className="p-2 font-bold border-r border-border bg-muted/20 text-foreground">EPS</td>
                                  <td className="p-1 px-2"><Input className="h-8 text-xs border-0 shadow-none focus-visible:ring-0 text-foreground bg-card" value={form.key_pri_ipo_eps || ''} onChange={(e) => setForm({ ...form, key_pri_ipo_eps: e.target.value })} onBlur={(e) => setForm({ ...form, key_pri_ipo_eps: formatIndianNumber(e.target.value) })} placeholder="Pre EPS" /></td>
                                  <td className="p-1 px-2 border-l border-border"><Input className="h-8 text-xs border-0 shadow-none focus-visible:ring-0 text-foreground bg-card" value={form.key_pos_ipo_eps || ''} onChange={(e) => setForm({ ...form, key_pos_ipo_eps: e.target.value })} onBlur={(e) => setForm({ ...form, key_pos_ipo_eps: formatIndianNumber(e.target.value) })} placeholder="Post EPS" /></td>
                                </tr>
                                <tr className="hover:bg-muted/30">
                                  <td className="p-2 font-bold border-r border-border bg-muted/20 text-foreground">P/E Ratio</td>
                                  <td className="p-1 px-2"><Input className="h-8 text-xs border-0 shadow-none focus-visible:ring-0 text-foreground bg-card" value={form.key_pre_ipo_pe || ''} onChange={(e) => setForm({ ...form, key_pre_ipo_pe: e.target.value })} onBlur={(e) => setForm({ ...form, key_pre_ipo_pe: formatIndianNumber(e.target.value) })} placeholder="Pre P/E" /></td>
                                  <td className="p-1 px-2 border-l border-border"><Input className="h-8 text-xs border-0 shadow-none focus-visible:ring-0 text-foreground bg-card" value={form.key_post_ipo_pe || ''} onChange={(e) => setForm({ ...form, key_post_ipo_pe: e.target.value })} onBlur={(e) => setForm({ ...form, key_post_ipo_pe: formatIndianNumber(e.target.value) })} placeholder="Post P/E" /></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-foreground">Competitive Strengths</h4>
                            <Button type="button" variant="outline" size="sm" onClick={() => setStrengthRows([...strengthRows, ''])} className="text-foreground">
                              <Plus className="w-3 h-3 mr-1" /> Add Strength
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {strengthRows.map((s, idx) => (
                              <div key={idx} className="flex gap-2">
                                <Input className="h-9 text-sm text-foreground bg-card" value={s} onChange={(e) => { const n = [...strengthRows]; n[idx] = e.target.value; setStrengthRows(n); }} placeholder="e.g. Established leader presence" />
                                <DeleteConfirmButton onDelete={() => setStrengthRows(strengthRows.filter((_, i) => i !== idx))} className="h-9 w-9" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    </>
                  )}

                  <TabsContent value="content" className="space-y-6 text-foreground">
                    {form.category === 'daily_reporter' ? (
                      <div className="space-y-8">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-bold flex items-center gap-2 text-blue-600">
                              <TrendingUp className="w-4 h-4" /> Recent IPO Updates
                            </label>
                            <Button type="button" variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-wider text-foreground" onClick={() => setRecentIpoRows([...recentIpoRows, ''])}>
                              <Plus className="w-3 h-3 mr-1" /> Add Point
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {recentIpoRows.map((s, idx) => (
                              <div key={idx} className="flex gap-2 group animate-in fade-in slide-in-from-left-2 duration-200">
                                <Input className="h-9 text-sm focus:ring-blue-500 text-foreground bg-card" value={s} onChange={(e) => { const n = [...recentIpoRows]; n[idx] = e.target.value; setRecentIpoRows(n); }} placeholder="e.g. Company X is in advanced talks for ₹2,000 Cr IPO" />
                                <DeleteConfirmButton onDelete={() => setRecentIpoRows(recentIpoRows.filter((_, i) => i !== idx))} className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-bold flex items-center gap-2 text-emerald-600">
                              <Activity className="w-4 h-4" /> P.E. & Funding Updates
                            </label>
                            <Button type="button" variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-wider text-foreground" onClick={() => setPeFundingRows([...peFundingRows, ''])}>
                              <Plus className="w-3 h-3 mr-1" /> Add Point
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {peFundingRows.map((s, idx) => (
                              <div key={idx} className="flex gap-2 group animate-in fade-in slide-in-from-left-2 duration-200">
                                <Input className="h-9 text-sm focus:ring-emerald-500 text-foreground bg-card" value={s} onChange={(e) => { const n = [...peFundingRows]; n[idx] = e.target.value; setPeFundingRows(n); }} placeholder="e.g. Startup Y raised $50M in Series B round" />
                                <DeleteConfirmButton onDelete={() => setPeFundingRows(peFundingRows.filter((_, i) => i !== idx))} className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-bold flex items-center gap-2 text-amber-600">
                              <Database className="w-4 h-4" /> Business & Economic Updates
                            </label>
                            <Button type="button" variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-wider text-foreground" onClick={() => setBusinessEconomicRows([...businessEconomicRows, ''])}>
                              <Plus className="w-3 h-3 mr-1" /> Add Point
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {businessEconomicRows.map((s, idx) => (
                              <div key={idx} className="flex gap-2 group animate-in fade-in slide-in-from-left-2 duration-200">
                                <Input className="h-9 text-sm focus:ring-amber-500 text-foreground bg-card" value={s} onChange={(e) => { const n = [...businessEconomicRows]; n[idx] = e.target.value; setBusinessEconomicRows(n); }} placeholder="e.g. GDP growth projected at 7.2% for FY25" />
                                <DeleteConfirmButton onDelete={() => setBusinessEconomicRows(businessEconomicRows.filter((_, i) => i !== idx))} className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-bold flex items-center gap-2 text-indigo-600">
                              <Globe className="w-4 h-4" /> Geopolitical Updates
                            </label>
                            <Button type="button" variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-wider text-foreground" onClick={() => setGeopoliticalRows([...geopoliticalRows, ''])}>
                              <Plus className="w-3 h-3 mr-1" /> Add Point
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {geopoliticalRows.map((s, idx) => (
                              <div key={idx} className="flex gap-2 group animate-in fade-in slide-in-from-left-2 duration-200">
                                <Input className="h-9 text-sm focus:ring-indigo-500 text-foreground bg-card" value={s} onChange={(e) => { const n = [...geopoliticalRows]; n[idx] = e.target.value; setGeopoliticalRows(n); }} placeholder="e.g. New trade agreement signed between India and UAE" />
                                <DeleteConfirmButton onDelete={() => setGeopoliticalRows(geopoliticalRows.filter((_, i) => i !== idx))} className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="text-sm font-medium mb-1.5 block text-foreground">Main Long Content (Rich Text)</label>
                        <RichEditor
                          value={form.content || ''}
                          onChange={(val) => setForm({ ...form, content: val })}
                          placeholder="Write your beautiful blog post here..."
                        />
                      </div>
                    )}

                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-medium text-foreground">Frequently Asked Questions (FAQs)</label>
                        <Button type="button" variant="outline" size="sm" onClick={() => setFaqRows([...faqRows, { question: '', answer: '' }])} className="text-foreground">
                          <Plus className="w-3 h-3 mr-1" /> Add FAQ
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {faqRows.map((f, idx) => (
                          <div key={idx} className="p-4 border border-border rounded-xl bg-card/50 space-y-3 relative group shadow-sm transition-all hover:shadow-md">
                            <DeleteConfirmButton
                              onDelete={() => setFaqRows(faqRows.filter((_, i) => i !== idx))}
                              className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100"
                            />
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">Question {idx + 1}</label>
                              <Input className="h-8 text-xs font-semibold text-foreground bg-card" value={f.question} onChange={(e) => { const n = [...faqRows]; n[idx].question = e.target.value; setFaqRows(n); }} placeholder="e.g. What is the business model?" />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">Answer</label>
                              <Textarea className="text-xs min-h-[60px] text-foreground bg-card" value={f.answer} onChange={(e) => { const n = [...faqRows]; n[idx].answer = e.target.value; setFaqRows(n); }} placeholder="Provide a helpful answer here..." />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="seo" className="space-y-6 text-foreground">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block text-foreground">Meta Title</label>
                        <Input value={form.meta_title || ''} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} className="text-foreground bg-card" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block text-foreground">Meta Keywords</label>
                        <Input value={form.keyword || ''} onChange={(e) => setForm({ ...form, keyword: e.target.value })} className="text-foreground bg-card" />
                      </div>
                      <div className="md:col-span-2">
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-sm font-medium block text-foreground">Description</label>
                          <span className={cn("text-[10px] font-bold", (form.description?.length || 0) > 280 ? "text-red-500" : "text-muted-foreground")}>
                            {form.description?.length || 0} / 300
                          </span>
                        </div>
                        <Textarea
                          value={form.description || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.length > 300) {
                              toast.error("can not be greater than 300 characters");
                              return;
                            }
                            setForm({ ...form, description: val });
                          }}
                          rows={3}
                          placeholder="Brief SEO description (max 300 chars)..."
                          className="text-foreground bg-card"
                        />
                      </div>
                    </div>
                    {form.category === 'ipo_updates' && (
                      <div className="space-y-4 pt-4 border-t border-border">
                        <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground"><HelpCircle className="w-4 h-4" /> Official Documents</h4>
                        <div className="flex items-center gap-4">
                          <div className="w-56">
                            <label className="text-xs font-medium mb-1 block text-foreground">Select DRHP Status</label>
                            <Select
                              value={form.confidential === '1' ? 'yes' : 'no'}
                              onValueChange={(v) => setForm({ ...form, confidential: v === 'yes' ? '1' : '0' })}
                            >
                              <SelectTrigger className="h-9 text-xs text-foreground bg-card">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="no">No (Regular DRHP)</SelectItem>
                                <SelectItem value="yes">Yes (Confidential DRHP)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {form.confidential !== '1' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-medium mb-1 block text-foreground">RHP Link/Path</label>
                              <div className="flex gap-1">
                                <Input className="h-9 text-xs text-foreground bg-card" value={form.rhp || ''} onChange={(e) => setForm({ ...form, rhp: e.target.value })} placeholder="Path to RHP (PDF preferred)" />
                                <div className="relative">
                                  <input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e, 'rhp', 'companyblog/rhp', true)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                  <Button type="button" variant="outline" className="h-9 w-9 p-0 flex items-center justify-center pointer-events-none text-foreground">
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-medium mb-1 block text-foreground">DRHP Link/Path</label>
                              <div className="flex gap-1">
                                <Input className="h-9 text-xs text-foreground bg-card" value={form.drhp || ''} onChange={(e) => setForm({ ...form, drhp: e.target.value })} placeholder="Path to DRHP (PDF preferred)" />
                                <div className="relative">
                                  <input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e, 'drhp', 'companyblog/drhp', true)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                  <Button type="button" variant="outline" className="h-9 w-9 p-0 flex items-center justify-center pointer-events-none text-foreground">
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {form.confidential === '1' && (
                          <div className="rounded-xl border border-amber-200 bg-amber-50/50 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-amber-100/60 border-b border-amber-200">
                              <h5 className="text-xs font-bold text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5" /> Confidential DRHP Entries
                              </h5>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="h-7 text-[11px] border-amber-400 text-amber-700 hover:bg-amber-100"
                                onClick={() => setConfidentialDrhpRows([...confidentialDrhpRows, { description: '', date: '', pdf: '' }])}
                              >
                                <Plus className="w-3 h-3 mr-1" /> Add Entry
                              </Button>
                            </div>
                            <div className="p-4 space-y-4">
                              {confidentialDrhpRows.map((row, idx) => (
                                <div key={idx} className="p-3 rounded-lg border border-amber-200 bg-white/70 space-y-3 relative group">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Entry #{idx + 1}</span>
                                    <DeleteConfirmButton
                                      onDelete={() => setConfidentialDrhpRows(confidentialDrhpRows.filter((_, i) => i !== idx))}
                                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    />
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-[10px] font-medium mb-1 block text-slate-600">Description</label>
                                      <Textarea
                                        className="text-xs min-h-[60px] resize-none text-foreground bg-card"
                                        value={row.description}
                                        onChange={(e) => { const n = [...confidentialDrhpRows]; n[idx].description = e.target.value; setConfidentialDrhpRows(n); }}
                                        placeholder="e.g. Filed with SEBI/Exchange"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-medium mb-1 block text-slate-600">Date</label>
                                      <Input
                                        className="h-9 text-xs text-foreground bg-card"
                                        type="date"
                                        value={row.date}
                                        onChange={(e) => { const n = [...confidentialDrhpRows]; n[idx].date = e.target.value; setConfidentialDrhpRows(n); }}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-medium mb-1 block text-slate-600">Upload PDF</label>
                                    <div className="flex gap-2 items-center">
                                      <Input
                                        className="h-8 text-xs flex-1 text-foreground bg-card"
                                        value={row.pdf}
                                        onChange={(e) => { const n = [...confidentialDrhpRows]; n[idx].pdf = e.target.value; setConfidentialDrhpRows(n); }}
                                        placeholder="PDF URL or upload below"
                                      />
                                      <div className="relative shrink-0">
                                        <input
                                          type="file"
                                          accept=".pdf"
                                          onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const fd = new FormData();
                                            fd.append('folder', 'drhp');
                                            fd.append('file', file);
                                            const tId = toast.loading('Uploading PDF...');
                                            try {
                                              const res = await fetch(`${API_URL}/api/upload`, {
                                                method: 'POST',
                                                headers: getHeaders(false),
                                                body: fd
                                              });
                                              if (!res.ok) throw new Error('Upload failed');
                                              const data = await res.json();
                                              const n = [...confidentialDrhpRows]; n[idx].pdf = data.url; setConfidentialDrhpRows(n);
                                              toast.success('PDF uploaded!', { id: tId });
                                            } catch { toast.error('Upload failed', { id: tId }); }
                                          }}
                                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <Button type="button" variant="outline" className="h-8 text-xs text-foreground">
                                          <Upload className="h-3 w-3 mr-1" /> Upload
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {modalTab === "seo" && (
                  <div className="pt-6">
                    <Button onClick={handleSave} disabled={saving} className="w-full bg-primary text-primary-foreground font-semibold h-12 text-lg">
                      {saving ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Saving...</> : editingId ? "Save All Changes" : "Create New IPO Record"}
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm mb-6">
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); fetchBlogs(1, v); }} className="w-full">
          <div className="px-4 py-2 border-b border-border">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="0" className="px-8 font-semibold data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all text-foreground">
                Current IPOs
              </TabsTrigger>
              <TabsTrigger value="1" className="px-8 font-semibold data-[state=active]:bg-amber-500 data-[state=active]:text-white transition-all text-foreground">
                Upcoming IPOs
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />Loading database...</div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="py-3 px-4 font-semibold text-foreground">IPO Title</th>
                  <th className="py-3 px-4 font-semibold hidden md:table-cell text-foreground">Category</th>
                  <th className="py-3 px-4 font-semibold text-foreground">Status/Type</th>
                  <th className="py-3 px-4 font-semibold hidden lg:table-cell text-foreground">GMP</th>
                  <th className="py-3 px-4 font-semibold hidden lg:table-cell text-foreground">Price</th>
                  <th className="py-3 px-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {blogs.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No entries found.</td></tr>
                ) : (
                  blogs.map((b) => (
                    <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium max-w-[200px] md:max-w-xs text-foreground">
                        <div className="font-semibold truncate">{b.title}</div>
                        <div className="text-xs text-muted-foreground truncate font-mono">/{b.slug}</div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground hidden md:table-cell capitalize">{(b.category || "—").replace('_', ' ')}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={b.upcoming == "1" ? "bg-amber-100/50 text-amber-700 border-amber-300" : "bg-emerald-100/50 text-emerald-700 border-emerald-300"}>
                          {b.upcoming == "1" ? "Upcoming" : "Current"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{formatDisplayValue(b.gmp)}</td>
                      <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{formatDisplayValue(b.gmp_ipo_price)}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(b)} className="text-foreground"><Pencil className="h-3.5 w-3.5" /></Button>
                          <DeleteConfirmButton onDelete={() => handleDelete(b.id)} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 pb-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchBlogs(page - 1)}
            disabled={page === 1}
            className="hidden sm:flex text-foreground"
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else {
                if (page <= 4) pageNum = i + 1;
                else if (page >= totalPages - 3) pageNum = totalPages - 6 + i;
                else pageNum = page - 3 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  className={cn("w-9 h-9 p-0", page === pageNum ? "text-primary-foreground" : "text-foreground")}
                  onClick={() => fetchBlogs(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchBlogs(page + 1)}
            disabled={page === totalPages}
            className="hidden sm:flex text-foreground"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
