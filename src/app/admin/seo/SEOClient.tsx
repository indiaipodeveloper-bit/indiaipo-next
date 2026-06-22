"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Upload, Image as ImageIcon, Search, Plus, Pencil, Trash2,
  Globe, Tag, FileText, Link, X, ChevronDown, Check, ExternalLink, Loader2
} from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { BASE_URL } from "@/hooks/useCanonicalUrl";

interface SeoPage {
  id: number;
  page_path: string;
  page_label: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_image: string;
  canonical: string;
  schema_json: string;
  updated_at: string;
}

const EMPTY: Omit<SeoPage, "id" | "updated_at"> = {
  page_path: "",
  page_label: "",
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  og_image: "",
  canonical: "",
  schema_json: "",
};

const PAGE_SUGGESTIONS = [
  { label: "Homepage", path: "/" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Services", path: "/services" },
  { label: "IPO Blogs", path: "/ipo-blogs" },
  { label: "All IPOs", path: "/all-ipos" },
  { label: "SME IPOs", path: "/sme-ipos" },
  { label: "Mainline IPOs", path: "/mainline-ipos" },
  { label: "IPO Registrar List", path: "/ipo-registrar-list" },
  { label: "SME Merchant Bankers", path: "/merchant-bankers/list-of-sme-merchant-bankers" },
  { label: "Mainboard Merchant Bankers", path: "/merchant-bankers/list-of-mainboard-merchant-bankers" },
  { label: "IPO Process", path: "/ipo-process" },
  { label: "Pre-IPO Process", path: "/pre-ipo-process" },
  { label: "IPO Eligibility Check", path: "/ipo-eligibility-check" },
  { label: "IPO Knowledge Base", path: "/ipo-knowledge" },
  { label: "Career", path: "/career" },
  { label: "News", path: "/news" },
  { label: "Investors", path: "/investors" },
  { label: "Reports", path: "/daily-ipo-digest" },
  { label: "Service: SME IPO", path: "/services/sme-ipo-consultation" },
  { label: "Service: Mainline IPO", path: "/services/mainline-ipo-consultation" },
  { label: "Service: FPO", path: "/services/follow-on-public-offer-fpo" },
  { label: "Service: Pre-IPO Funding", path: "/services/pre-ipo-funding-services" },
  { label: "Service: Business Valuation", path: "/services/business-valuation" },
  { label: "Service: REIT", path: "/services/reit" },
  { label: "Service: Social Stock Exchange", path: "/services/social-stock-exchange" },
  { label: "Blogs (Article)", path: "/blogs" },
  { label: "Consultants", path: "/consultant" },
  { label: "SME IPO Sector", path: "/sme-ipo-sector" },
  { label: "Mainboard IPO Sector", path: "/mainboard-ipo-sector" },
];

const charColor = (len: number, max: number) =>
  len > max ? "text-red-500 font-bold" : len > max * 0.85 ? "text-amber-600" : "text-slate-400";

export default function SEOClient() {
  const [pages, setPages] = useState<SeoPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [globalUploading, setGlobalUploading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [globalSeo, setGlobalSeo] = useState({ meta_title: "", meta_description: "", og_image: "", keywords: "" });
  const [globalSaving, setGlobalSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"pages" | "global">("pages");

  const getHeaders = (json = true) => {
    const h: Record<string, string> = {};
    if (json) h["Content-Type"] = "application/json";
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) h["Authorization"] = `Bearer ${token}`;
    }
    return h;
  };

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/seo-pages", {
        headers: getHeaders()
      });
      const data = await res.json();
      setPages(data.data || []);
    } catch {
      toast.error("Failed to load SEO pages");
    } finally {
      setLoading(false);
    }
  };

  const fetchGlobal = async () => {
    try {
      const res = await fetch("/api/seo", {
        headers: getHeaders()
      });
      const data = await res.json();
      if (data && !data.error) setGlobalSeo(data);
    } catch {}
  };

  useEffect(() => {
    fetchPages();
    fetchGlobal();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Max 2MB allowed");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("folder", "seo");
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: getHeaders(false),
        body: fd
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setForm(f => ({ ...f, og_image: url }));
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleGlobalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Max 2MB allowed");
      return;
    }
    setGlobalUploading(true);
    const fd = new FormData();
    fd.append("folder", "seo");
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: getHeaders(false),
        body: fd
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setGlobalSeo(g => ({ ...g, og_image: url }));
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setGlobalUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.page_path.trim()) {
      toast.error("Page path is required");
      return;
    }
    if (!form.meta_title.trim()) {
      toast.error("Meta title is required");
      return;
    }
    setSaving(true);
    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `/api/seo-pages/${editId}` : "/api/seo-pages";
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(editId ? "Updated!" : "Saved!");
        setShowForm(false);
        setEditId(null);
        setForm({ ...EMPTY });
        fetchPages();
      } else {
        toast.error(data.error || "Save failed");
      }
    } catch {
      toast.error("Error saving");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this SEO entry?")) return;
    try {
      const res = await fetch(`/api/seo-pages/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Deleted");
        fetchPages();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleGlobalSave = async () => {
    setGlobalSaving(true);
    try {
      const res = await fetch("/api/seo", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(globalSeo),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Global SEO saved!");
      } else {
        toast.error(data.error || "Save failed");
      }
    } catch {
      toast.error("Error saving global configurations");
    } finally {
      setGlobalSaving(false);
    }
  };

  const startEdit = (p: SeoPage) => {
    setEditId(p.id);
    setForm({
      page_path: p.page_path,
      page_label: p.page_label,
      meta_title: p.meta_title,
      meta_description: p.meta_description,
      meta_keywords: p.meta_keywords || "",
      og_image: p.og_image || "",
      canonical: p.canonical || "",
      schema_json: p.schema_json || "",
    });
    setShowForm(true);
    setShowSuggestions(false);
  };

  const pickSuggestion = (s: { label: string; path: string }) => {
    setForm(f => ({
      ...f,
      page_path: s.path,
      page_label: f.page_label || s.label,
      canonical: f.canonical || "",
    }));
    setShowSuggestions(false);
  };

  const filtered = pages.filter(p =>
    p.page_path.toLowerCase().includes(search.toLowerCase()) ||
    p.page_label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2 font-heading">
            <Globe className="w-6 h-6 text-amber-600" /> SEO Manager
          </h1>
          <p className="text-sm text-slate-500 mt-0.5 font-sans">
            Manage meta tags for every page — services, blogs, IPOs, and more
          </p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200">
          <Button
            variant={activeTab === "pages" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("pages")}
            className={`rounded-lg h-9 px-4 text-xs font-semibold ${activeTab === "pages" ? "bg-amber-600 hover:bg-amber-500 text-white" : "text-slate-500 hover:text-slate-800"}`}
          >
            Page SEO
          </Button>
          <Button
            variant={activeTab === "global" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("global")}
            className={`rounded-lg h-9 px-4 text-xs font-semibold ${activeTab === "global" ? "bg-amber-600 hover:bg-amber-500 text-white" : "text-slate-500 hover:text-slate-800"}`}
          >
            Global / Homepage
          </Button>
        </div>
      </div>

      {activeTab === "global" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 max-w-2xl shadow-sm">
          <p className="text-xs text-slate-600 border-l-4 border-amber-500 pl-3">
            Set metadata defaults for fallback and homepage here.
          </p>
          {[
            { label: "Meta Title *", key: "meta_title", max: 60, type: "input" },
            { label: "Meta Description *", key: "meta_description", max: 160, type: "textarea" },
            { label: "Keywords", key: "keywords", max: 300, type: "input" },
            { label: "OG Image URL", key: "og_image", max: 500, type: "image" },
          ].map(({ label, key, max, type }) => (
            <div key={key} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">{label}</label>
                <span className={`text-[10px] ${charColor((globalSeo as any)[key]?.length || 0, max)}`}>
                  {(globalSeo as any)[key]?.length || 0}/{max}
                </span>
              </div>
              {type === "textarea" ? (
                <Textarea
                  rows={3}
                  value={(globalSeo as any)[key] || ""}
                  onChange={e => setGlobalSeo(g => ({ ...g, [key]: e.target.value }))}
                  className="border-slate-200 bg-white text-slate-800 rounded-xl focus-visible:ring-amber-500"
                />
              ) : type === "image" ? (
                <div className="flex gap-3 items-start">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={globalSeo.og_image || ""}
                      onChange={e => setGlobalSeo(g => ({ ...g, og_image: e.target.value }))}
                      placeholder="https://… or upload image"
                      className="h-11 border-slate-200 bg-white text-slate-800 rounded-xl focus-visible:ring-amber-500"
                    />
                    <label className={`flex items-center justify-center gap-2 h-11 cursor-pointer border border-dashed rounded-xl text-sm text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors ${globalUploading ? "opacity-50" : "border-slate-200 hover:border-amber-500/50"}`}>
                      <Upload className="w-4 h-4" />
                      {globalUploading ? "Uploading…" : "Upload OG Image (max 2MB)"}
                      <input type="file" accept="image/*" className="hidden" onChange={handleGlobalUpload} disabled={globalUploading} />
                    </label>
                  </div>
                  <div className="w-24 h-16 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center flex-shrink-0 relative">
                    {globalSeo.og_image ? (
                      <img src={getImageUrl(globalSeo.og_image)} alt="OG Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                </div>
              ) : (
                <Input
                  value={(globalSeo as any)[key] || ""}
                  onChange={e => setGlobalSeo(g => ({ ...g, [key]: e.target.value }))}
                  className="h-11 border-slate-200 bg-white text-slate-800 rounded-xl focus-visible:ring-amber-500"
                />
              )}
            </div>
          ))}
          <Button onClick={handleGlobalSave} disabled={globalSaving} className="w-full h-11 bg-amber-600 hover:bg-amber-500 text-white rounded-xl mt-2 font-semibold">
            {globalSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Global SEO"}
          </Button>
        </div>
      )}

      {activeTab === "pages" && (
        <>
          <div className="flex gap-3 flex-wrap items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                className="pl-9 h-11 border-slate-200 bg-white text-slate-800 rounded-xl focus-visible:ring-amber-500"
                placeholder="Search by path or label…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                setEditId(null);
                setForm({ ...EMPTY });
                setShowForm(true);
              }}
              className="gap-2 bg-amber-600 hover:bg-amber-500 text-white h-11 rounded-xl font-semibold"
            >
              <Plus className="w-4 h-4" /> Add Page SEO
            </Button>
          </div>

          {showForm && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm relative">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg text-slate-800 font-heading">{editId ? "Edit" : "Add"} Page SEO</h2>
                <button onClick={() => { setShowForm(false); setEditId(null); }} className="text-slate-500 hover:text-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">Page Path *</label>
                  <div className="relative">
                    <Input
                      value={form.page_path}
                      onChange={e => setForm(f => ({ ...f, page_path: e.target.value }))}
                      placeholder="/services/sme-ipo"
                      className="pr-10 h-11 border-slate-200 bg-white text-slate-800 rounded-xl focus-visible:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSuggestions(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  {showSuggestions && (
                    <div className="absolute z-50 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg max-h-56 overflow-y-auto w-full md:w-80">
                      {PAGE_SUGGESTIONS.filter(s =>
                        !pages.find(p => p.page_path === s.path && p.id !== editId)
                      ).map(s => (
                        <button
                          key={s.path}
                          type="button"
                          onClick={() => pickSuggestion(s)}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 flex items-center justify-between gap-2 border-b border-slate-100 last:border-0"
                        >
                          <span className="font-medium text-slate-800">{s.label}</span>
                          <span className="text-slate-500 text-xs">{s.path}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-slate-500 mt-1">e.g. /services/sme-ipo or select from dropdown list</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">Page Label (Admin only)</label>
                  <Input
                    value={form.page_label}
                    onChange={e => setForm(f => ({ ...f, page_label: e.target.value }))}
                    placeholder="SME IPO Service Page"
                    className="h-11 border-slate-200 bg-white text-slate-800 rounded-xl focus-visible:ring-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-700">Meta Title *</label>
                  <span className={`text-[10px] ${charColor(form.meta_title.length, 70)}`}>
                    {form.meta_title.length}/70
                  </span>
                </div>
                <Input
                  value={form.meta_title}
                  onChange={e => setForm(f => ({ ...f, meta_title: e.target.value }))}
                  placeholder="SME IPO Consultation Services | India IPO"
                  className="h-11 border-slate-200 bg-white text-slate-800 rounded-xl focus-visible:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-700 font-sans">Meta Description</label>
                  <span className={`text-[10px] ${charColor(form.meta_description.length, 160)}`}>
                    {form.meta_description.length}/160
                  </span>
                </div>
                <Textarea
                  rows={3}
                  value={form.meta_description}
                  onChange={e => setForm(f => ({ ...f, meta_description: e.target.value }))}
                  placeholder="Expert SME IPO consultation and advisory services..."
                  className="border-slate-200 bg-white text-slate-800 rounded-xl focus-visible:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 block">Keywords</label>
                <Input
                  value={form.meta_keywords}
                  onChange={e => setForm(f => ({ ...f, meta_keywords: e.target.value }))}
                  placeholder="SME IPO, India IPO, BSE SME, NSE Emerge"
                  className="h-11 border-slate-200 bg-white text-slate-800 rounded-xl focus-visible:ring-amber-500"
                />
                <p className="text-xs text-slate-500 mt-1">Comma separated list</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 block">OG Image</label>
                <div className="flex gap-3 items-start">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={form.og_image}
                      onChange={e => setForm(f => ({ ...f, og_image: e.target.value }))}
                      placeholder="https://… or upload image"
                      className="h-11 border-slate-200 bg-white text-slate-800 rounded-xl focus-visible:ring-amber-500"
                    />
                    <label className={`flex items-center justify-center gap-2 h-11 cursor-pointer border border-dashed rounded-xl text-sm text-slate-500 bg-slate-55 hover:bg-slate-100 transition-colors ${uploading ? "opacity-50" : "border-slate-200 hover:border-amber-500/50"}`}>
                      <Upload className="w-4 h-4" />
                      {uploading ? "Uploading…" : "Upload OG Image (max 2MB)"}
                      <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                    </label>
                  </div>
                  <div className="w-24 h-16 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center flex-shrink-0 relative">
                    {form.og_image ? (
                      <img src={getImageUrl(form.og_image)} alt="OG Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 block">Canonical URL (optional)</label>
                <Input
                  value={form.canonical}
                  onChange={e => setForm(f => ({ ...f, canonical: e.target.value }))}
                  placeholder="Leave blank — auto-generated from path"
                  className="h-11 border-slate-200 bg-white text-slate-800 rounded-xl focus-visible:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 block">JSON-LD Schema (optional)</label>
                <Textarea
                  rows={4}
                  value={form.schema_json}
                  onChange={e => setForm(f => ({ ...f, schema_json: e.target.value }))}
                  placeholder='{"@context": "https://schema.org", "@type": "FAQPage", ...}'
                  className="font-mono text-xs border-slate-200 bg-white text-slate-800 rounded-xl focus-visible:ring-amber-500"
                />
                <p className="text-xs text-slate-505 mt-1">Paste valid JSON-LD schema. Do not include script tags.</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Google Search Preview</p>
                <p className="text-blue-600 text-sm font-semibold leading-tight truncate hover:underline cursor-pointer">
                  {form.meta_title || "Page Title Here"}
                </p>
                <p className="text-emerald-700 text-xs truncate">
                  {BASE_URL.replace(/^https?:\/\//, '')}{form.page_path || "/page"}
                </p>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                  {form.meta_description || "Meta description will appear here…"}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} disabled={saving} className="flex-1 h-11 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editId ? "Update" : "Save"}
                </Button>
                <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 rounded-xl h-11 px-6" onClick={() => { setShowForm(false); setEditId(null); }}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wide text-slate-600">
                    <th className="text-left px-4 py-3 font-bold">Page</th>
                    <th className="text-left px-4 py-3 font-bold hidden md:table-cell">Meta Title</th>
                    <th className="text-left px-4 py-3 font-bold hidden lg:table-cell">Description</th>
                    <th className="text-left px-4 py-3 font-bold hidden sm:table-cell">OG Image</th>
                    <th className="text-right px-4 py-3 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800 truncate max-w-[160px]">
                          {p.page_label || p.page_path}
                        </p>
                        <a
                          href={p.page_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-slate-500 hover:text-amber-500 flex items-center gap-1 mt-0.5"
                        >
                          {p.page_path} <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="truncate max-w-[200px] text-slate-800">{p.meta_title || "—"}</p>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <p className="truncate max-w-[220px] text-slate-500 text-xs">{p.meta_description || "—"}</p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {p.og_image ? (
                           <img
                             src={getImageUrl(p.og_image)}
                             alt="og"
                             className="w-12 h-8 rounded-lg object-cover border border-slate-200"
                           />
                        ) : (
                          <span className="text-slate-500 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => startEdit(p)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-amber-600 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filtered.length > 0 && (
            <p className="text-xs text-slate-500 text-right">
              {filtered.length} page{filtered.length !== 1 ? "s" : ""} configured
            </p>
          )}
        </>
      )}
    </div>
  );
}
