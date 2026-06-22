"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, Building2, Search, Link as LinkIcon } from "lucide-react";
import { getImageUrl, formatIndianNumber } from "@/lib/utils";
import { toast } from "sonner";
import RichEditor from "@/components/ui/RichEditor";
import { MultiSelect, Option } from "@/components/ui/multi-select";

interface MainboardBanker {
  id: number;
  title: string;
  sub_title: string;
  slug: string;
  mcat_id: string | number;
  image: string;
  description: string;
  meta_title: string;
  meta_desc: string;
  meta_keywords: string;
  noOfiposofar: string | number;
  ipos: string;
  totalfundraised: string;
  avgiposize: string;
  avglisting_gain: string;
  avgsubscription: string;
  faqs: string;
  nseemer: string;
  bsesme: string;
  yearwise_ipolisting: string;
  sme_ipos_by_size: string;
  sme_ipos_by_subscription: string;
  cemail: string;
  cmobile: string;
  caddress: string;
  cweblink: string;
  established_year: number | null;

  name?: string;
  logo_url?: string;
  location?: string;
  sebi_registration?: string;
  website?: string;
  total_ipos?: number;
}

const defaultSubscription = JSON.stringify([
  { title: "Subscribed Less than 1 times", subscription: "" },
  { title: "Subscribed 1 to 3 times", subscription: "" },
  { title: "Subscribed 3 to 5 times", subscription: "" },
  { title: "Subscribed 5 to 10 times", subscription: "" },
  { title: "Subscribed more than 10 times", subscription: "" }
]);

const defaultSize = JSON.stringify([
  { title: "0-100 Cr", size: "" },
  { title: "100-250 Cr", size: "" },
  { title: "250-500 Cr", size: "" },
  { title: "500-1,000 Cr", size: "" },
  { title: "1,000+ Cr", size: "" }
]);

const emptyForm: Omit<MainboardBanker, 'id'> = {
  title: "", sub_title: "", slug: "", mcat_id: 'list-of-mainboard-merchant-bankers', image: "", description: "",
  meta_title: "", meta_desc: "", meta_keywords: "", noOfiposofar: "", ipos: "",
  totalfundraised: "", avgiposize: "", avglisting_gain: "", avgsubscription: "",
  faqs: "", nseemer: "", bsesme: "", yearwise_ipolisting: "", sme_ipos_by_size: defaultSize,
  sme_ipos_by_subscription: defaultSubscription, cemail: "", cmobile: "", caddress: "", cweblink: "",
  established_year: null
};

const JsonArrayEditor = ({ value, onChange, template, placeholder, masks, readOnlyKeys }: any) => {
  const safeParse = (str: string) => {
    try {
      if (!str) return [];
      return typeof str === 'string' ? JSON.parse(str) : str;
    } catch { return []; }
  };
  const items = Array.isArray(safeParse(value)) ? safeParse(value) : [];

  const updateItem = (index: number, key: string, val: string) => {
    if (readOnlyKeys && readOnlyKeys.includes(key)) return;
    let cleanVal = val;
    if (masks && masks[key]) {
      if (masks[key].test(val)) {
        toast.error("Only numeric values are allowed in this field");
      }
      cleanVal = val.replace(masks[key], "");
    }
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: cleanVal };
    onChange(JSON.stringify(newItems));
  };

  const addItem = () => {
    const newItems = [...items, { ...template }];
    onChange(JSON.stringify(newItems));
  };

  const removeItem = (index: number) => {
    if (window.confirm("Are you sure you want to delete this row?")) {
      const newItems = items.filter((_: any, i: number) => i !== index);
      onChange(JSON.stringify(newItems));
    }
  };

  return (
    <div className="space-y-3 border border-border p-3 rounded-md bg-background/50">
      {items.map((item: any, i: number) => (
        <div key={i} className="flex flex-col sm:flex-row items-center gap-2">
          {Object.keys(template).map(key => (
            <Input
              key={key}
              placeholder={placeholder[key] || key}
              value={item[key] || ''}
              onChange={e => updateItem(i, key, e.target.value)}
              className="flex-1 text-foreground"
              readOnly={readOnlyKeys && readOnlyKeys.includes(key) && item[key] !== ""}
            />
          ))}
          <Button variant="ghost" size="icon" onClick={() => removeItem(i)} className="text-destructive h-9 w-9 shrink-0 outline outline-1 outline-destructive/20 hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addItem} className="w-full border-dashed border-2 hover:border-primary hover:text-primary transition-colors mt-2 text-foreground">
        <Plus className="h-4 w-4 mr-1" /> Add Row
      </Button>
    </div>
  );
};

export default function MainboardBankersClient() {
  const [bankers, setBankers] = useState<MainboardBanker[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [bankerOptions, setBankerOptions] = useState<Option[]>([]);
  const [mainboardSubcategories, setMainboardSubcategories] = useState<{slug: string, name: string}[]>([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const getHeaders = (json = true) => {
    const h: Record<string, string> = {};
    if (json) h["Content-Type"] = "application/json";
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) h["Authorization"] = `Bearer ${token}`;
    }
    return h;
  };

  const fetchMainboardSubcategories = async () => {
    try {
      const res = await fetch("/api/banker-subcategories?type=mainboard&status=active", {
        headers: getHeaders()
      });
      const data = await res.json();
      setMainboardSubcategories(data.data || []);
    } catch (e) { console.error(e); }
  };

  const fetchBankerOptions = async () => {
    try {
      const res = await fetch("/api/bankers?all=true", {
        headers: getHeaders()
      });
      const data = await res.json();
      if (data && data.data) {
        setBankerOptions(data.data.map((b: any) => ({
          label: `${b.title} (${b.mcat_id?.includes('sme') ? 'SME' : 'Mainboard'})`,
          value: b.id.toString()
        })));
      }
    } catch (e) { console.error("Error fetching options:", e); }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (form.title && !editingId) {
      const slug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setForm(prev => ({ ...prev, slug }));
    }
  }, [form.title, editingId]);

  const fetchBankers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/mainboard-bankers?page=${page}&limit=${limit}&search=${encodeURIComponent(debouncedSearch)}`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const body = await res.json();
        setBankers(body.data || []);
        setTotal(body.pagination?.total || 0);
      }
    } catch (err) {
      toast.error("Failed to load Mainboard Bankers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankers();
    fetchBankerOptions();
    fetchMainboardSubcategories();
  }, [page, limit, debouncedSearch]);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (val: string) => {
    const updates: Partial<MainboardBanker> = { title: val };
    if (!editingId) {
      if (!form.meta_title || form.meta_title === form.title) {
        updates.meta_title = val;
      }
      if (!form.slug || form.slug === slugify(form.title)) {
        updates.slug = slugify(val);
      }
    }
    setForm({ ...form, ...updates });
  };

  const handleSave = async () => {
    if (!form.title) { toast.error("Banker Name is required"); return; }
    if (!form.image) {
      toast.error("Logo is required");
      return;
    }
    if (!form.slug || form.slug.trim() === "") {
      toast.error("Invalid slug");
      return;
    }

    try {
      const yearwise = JSON.parse(form.yearwise_ipolisting || "[]");
      for (const item of yearwise) {
        if (item.no_of_ipos && !item.year) {
          toast.error("Year is required for all IPO entries");
          return;
        }
      }
    } catch (e) { }

    if (form.cemail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.cemail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (form.cmobile && !/^\d{10}$/.test(form.cmobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setSaving(true);
    try {
      const url = editingId ? `/api/mainboard-bankers/${editingId}` : "/api/mainboard-bankers";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(form),
      });

      if (!res.ok) { throw new Error("Save failed"); }

      toast.success(editingId ? "Banker updated!" : "Banker created!");
      setForm(emptyForm);
      setEditingId(null);
      setDialogOpen(false);
      fetchBankers();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (b: MainboardBanker) => {
    setForm({
      title: b.title || "",
      sub_title: b.sub_title || "",
      slug: b.slug || "",
      mcat_id: b.mcat_id || 'list-of-mainboard-merchant-bankers',
      image: b.image || "",
      description: b.description || "",
      meta_title: b.meta_title || "",
      meta_desc: b.meta_desc || "",
      meta_keywords: b.meta_keywords || "",
      noOfiposofar: b.noOfiposofar || "",
      ipos: b.ipos || "",
      totalfundraised: b.totalfundraised || "",
      avgiposize: b.avgiposize || "",
      avglisting_gain: b.avglisting_gain || "",
      avgsubscription: b.avgsubscription || "",
      faqs: b.faqs || "",
      nseemer: b.nseemer || "0",
      bsesme: b.bsesme || "0",
      yearwise_ipolisting: b.yearwise_ipolisting || "[]",
      sme_ipos_by_size: b.sme_ipos_by_size || "[]",
      sme_ipos_by_subscription: b.sme_ipos_by_subscription || "[]",
      cemail: b.cemail || "",
      cmobile: b.cmobile || "",
      caddress: b.caddress || "",
      cweblink: b.cweblink || "",
      established_year: b.established_year || null,
    });
    setEditingId(b.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this Banker permanently?")) return;
    try {
      await fetch(`/api/mainboard-bankers/${id}`, { 
        method: "DELETE",
        headers: getHeaders()
      });
      toast.success("Deleted successfully");
      fetchBankers();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Cannot upload image > 2MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("folder", "bankers");
    formData.append("file", file);

    const tId = toast.loading("Uploading logo...");
    try {
      const res = await fetch("/api/upload", { 
        method: "POST", 
        headers: getHeaders(false),
        body: formData 
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setForm({ ...form, image: data.url });
      toast.success("Logo uploaded!", { id: tId });
    } catch (err) {
      toast.error("Failed to upload image", { id: tId });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-primary">Mainboard Merchant Bankers</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage top tier Mainboard IPO Lead Managers</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bankers..."
              className="pl-9 bg-background text-foreground"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Dialog open={dialogOpen} onOpenChange={(o) => {
            setDialogOpen(o);
            if (!o) { setForm(emptyForm); setEditingId(null); }
            else if (!editingId) {
              setForm({
                ...emptyForm,
                sme_ipos_by_size: JSON.stringify([
                  { title: "0-100 Cr", size: "" },
                  { title: "100-250 Cr", size: "" },
                  { title: "250-500 Cr", size: "" },
                  { title: "500-1,000 Cr", size: "" },
                  { title: "1,000+ Cr", size: "" }
                ]),
                sme_ipos_by_subscription: JSON.stringify([
                  { title: "Subscribed Less than 1 time", subscription: "" },
                  { title: "Subscribed 1 to 3 times", subscription: "" },
                  { title: "Subscribed 3 to 5 times", subscription: "" },
                  { title: "Subscribed 5 to 10 times", subscription: "" },
                  { title: "Subscribed more than 10 times", subscription: "" }
                ])
              });
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary shrink-0 text-primary-foreground font-semibold">
                <Plus className="h-4 w-4 mr-1.5" /> Add Banker
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-5xl max-h-[90vh] overflow-y-auto"
              onPointerDownOutside={(e) => {
                e.preventDefault();
              }}
              onEscapeKeyDown={(e) => {
                e.preventDefault();
              }}
            >
              <DialogHeader>
                <DialogTitle className="text-xl text-foreground">{editingId ? "Edit Mainboard Banker" : "Add Mainboard Banker"}</DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="general" className="mt-4">
                <TabsList className="grid w-full grid-cols-5 bg-muted">
                  <TabsTrigger value="general" className="text-foreground">General Info</TabsTrigger>
                  <TabsTrigger value="stats" className="text-foreground">Statistics</TabsTrigger>
                  <TabsTrigger value="analytics" className="text-foreground">Analytics</TabsTrigger>
                  <TabsTrigger value="contact" className="text-foreground">Contact Info</TabsTrigger>
                  <TabsTrigger value="seo" className="text-foreground">SEO & Meta</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4 py-4 pt-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Banker Name *</label>
                      <Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="e.g. ICICI Securities" className="text-foreground" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Subcategory *</label>
                      <select
                        value={form.mcat_id || "list-of-mainboard-merchant-bankers"}
                        onChange={(e) => setForm({ ...form, mcat_id: e.target.value })}
                        className="w-full h-10 px-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm bg-background text-foreground border-input"
                      >
                        <option value="list-of-mainboard-merchant-bankers">Default (List of Mainboard Merchant Bankers)</option>
                        {mainboardSubcategories.map(cat => (
                          <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-semibold text-foreground">Company Logo</label>
                      <div className="flex gap-2">
                        <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="URL..." className="flex-1 text-foreground" />
                        <div className="relative shrink-0">
                          <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                          <Button type="button" variant="outline" disabled={uploading} className="pointer-events-none text-foreground">
                            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Full Description</label>
                    <RichEditor
                      value={form.description}
                      onChange={(val) => setForm({ ...form, description: val })}
                      placeholder="About the merchant banker..."
                    />
                  </div>
                </TabsContent>

                <TabsContent value="stats" className="space-y-6 pt-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">Total IPOs Managed</label>
                      <Input
                        value={form.noOfiposofar}
                        onChange={(e) => {
                          if (/\D/.test(e.target.value)) {
                            toast.error("Only numeric values are allowed");
                          }
                          const val = e.target.value.replace(/\D/g, "");
                          setForm({ ...form, noOfiposofar: val });
                        }}
                        placeholder="e.g. 50"
                        className="text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">Total Raised</label>
                      <Input
                        value={formatIndianNumber(form.totalfundraised)}
                        onChange={(e) => {
                          if (/[^0-9.]/.test(e.target.value)) {
                            toast.error("Only numeric values are allowed");
                          }
                          const val = e.target.value.replace(/[^0-9.]/g, "");
                          if (val.split('.').length > 2) return;
                          setForm({ ...form, totalfundraised: val });
                        }}
                        placeholder="e.g. 5,000"
                        className="text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">Average IPO Size</label>
                      <Input
                        value={formatIndianNumber(form.avgiposize)}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9.]/g, "");
                          if (val.split('.').length > 2) return;
                          setForm({ ...form, avgiposize: val });
                        }}
                        placeholder="e.g. 100"
                        className="text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">Average Subscription</label>
                      <Input
                        value={form.avgsubscription}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9.]/g, "");
                          if (val.split('.').length > 2) return;
                          setForm({ ...form, avgsubscription: val });
                        }}
                        placeholder="e.g. 45"
                        className="text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">NSE Emerge Count</label>
                      <Input
                        value={form.nseemer}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setForm({ ...form, nseemer: val });
                        }}
                        placeholder="0"
                        className="text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">BSE SME Count</label>
                      <Input
                        value={form.bsesme}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setForm({ ...form, bsesme: val });
                        }}
                        placeholder="0"
                        className="text-foreground"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6 pt-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-foreground">Year-wise IPO Listing</label>
                      <JsonArrayEditor
                        value={form.yearwise_ipolisting}
                        onChange={(v: string) => setForm({ ...form, yearwise_ipolisting: v })}
                        template={{ year: "", no_of_ipos: "" }}
                        placeholder={{ year: "Year (e.g. FY25)", no_of_ipos: "Count (e.g. 2)" }}
                        masks={{ no_of_ipos: /[^0-9()%\s,.]/g }}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-foreground">IPOs by Size (Stats)</label>
                      <JsonArrayEditor
                        value={form.sme_ipos_by_size}
                        onChange={(v: string) => setForm({ ...form, sme_ipos_by_size: v })}
                        template={{ title: "", size: "" }}
                        placeholder={{ title: "Size Group", size: "Value/Count (e.g. 3 (10%))" }}
                        masks={{ size: /[^0-9()%\s,.]/g }}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-foreground">IPOs by Subscription (Group)</label>
                      <JsonArrayEditor
                        value={form.sme_ipos_by_subscription}
                        onChange={(v: string) => setForm({ ...form, sme_ipos_by_subscription: v })}
                        template={{ title: "", subscription: "" }}
                        placeholder={{ title: "Multiplier", subscription: "Value (e.g. 10(50%))" }}
                        masks={{ subscription: /[^0-9()%\s,.]/g }}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-foreground">Merchant Banker FAQ</label>
                      <JsonArrayEditor
                        value={form.faqs}
                        onChange={(v: string) => setForm({ ...form, faqs: v })}
                        template={{ question: "", answer: "" }}
                        placeholder={{ question: "Question", answer: "Answer" }}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4 pt-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Official Email</label>
                      <Input value={form.cemail} onChange={(e) => setForm({ ...form, cemail: e.target.value })} placeholder="contact@..." className="text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Mobile / Phone</label>
                      <Input
                        value={form.cmobile}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setForm({ ...form, cmobile: val });
                        }}
                        placeholder="10 digit number..."
                        className="text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Official Website</label>
                      <Input value={form.cweblink} onChange={(e) => setForm({ ...form, cweblink: e.target.value })} placeholder="https://..." className="text-foreground" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Head Office / Address</label>
                      <Textarea value={form.caddress} onChange={(e) => setForm({ ...form, caddress: e.target.value })} rows={2} placeholder="Full address..." className="text-foreground" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4 pt-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">URL Slug *</label>
                      <Input
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                        placeholder="e.g. icici-securities-limited"
                        className="text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Related Merchant Bankers (Top Selection)</label>
                      <MultiSelect
                        options={bankerOptions}
                        selected={(() => {
                          try {
                            const parsed = JSON.parse(form.ipos || "[]");
                            return Array.isArray(parsed) ? parsed.map(String) : [];
                          } catch { return []; }
                        })()}
                        onChange={(vals) => setForm({ ...form, ipos: JSON.stringify(vals) })}
                        placeholder="Select other bankers..."
                      />
                      <p className="px-1 text-[10px] text-muted-foreground italic">Linked bankers will appear as clickable cards on detail page.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Meta Title</label>
                      <Input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} placeholder="SEO Title..." className="text-foreground" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-semibold text-foreground">Meta Description</label>
                      <Textarea value={form.meta_desc} onChange={(e) => setForm({ ...form, meta_desc: e.target.value })} rows={3} placeholder="SEO Description..." className="text-foreground" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-semibold text-foreground">Meta Keywords</label>
                      <Input value={form.meta_keywords} onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })} placeholder="keyword1, keyword2..." className="text-foreground" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setDialogOpen(false)} className="text-foreground">Cancel</Button>
                <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground min-w-[120px]">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Banker"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading && bankers.length === 0 ? (
        <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : bankers.length === 0 ? (
        <div className="text-center py-24 bg-card border border-border rounded-xl">
          <Building2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3 text-primary opacity-20" />
          <h3 className="text-lg font-medium text-foreground">No Mainboard Bankers Found</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1">There are currently no mainboard merchants added or matching your search.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="py-4 px-5 text-left font-semibold text-foreground w-16">Logo</th>
                  <th className="py-4 px-5 text-left font-semibold text-foreground min-w-[200px]">Banker Details</th>
                  <th className="py-4 px-5 text-left font-semibold text-foreground">SEBI No. (Slug)</th>
                  <th className="py-4 px-5 text-left font-semibold text-foreground">Total IPOs</th>
                  <th className="py-4 px-5 text-right font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bankers.map((b) => (
                  <tr key={b.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-5">
                      {b.logo_url ? (
                        <div className="w-10 h-10 rounded border border-border overflow-hidden bg-white shadow-sm shrink-0">
                          <img src={getImageUrl(b.logo_url)} alt={b.name} className="w-full h-full object-contain p-1" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded border border-border border-dashed flex items-center justify-center bg-secondary/50 shrink-0">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-5">
                      <div className="font-semibold text-foreground text-base mb-1">{b.name}</div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        {b.location && <span><span className="font-medium text-primary/70">HQ:</span> {b.location}</span>}
                        {b.website && (
                          <a href={b.website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-primary transition-colors">
                            <LinkIcon className="w-3 h-3 mr-1" /> Website
                          </a>
                        )}
                        {b.established_year && <span><span className="font-medium text-primary/70">Est:</span> {b.established_year}</span>}
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      {b.sebi_registration ? (
                        <Badge variant="outline" className="font-mono text-[10px] bg-secondary/50 text-foreground">
                          {b.sebi_registration}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-5">
                      <div className="font-bold text-lg text-primary">{b.total_ipos || 0}</div>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(b)} className="h-8 w-8 text-blue-500 hover:bg-blue-500/10">
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(b.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {total > limit && (
            <div className="flex items-center justify-between p-4 border-t border-border bg-secondary/10">
              <span className="text-sm text-muted-foreground">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-foreground">
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page * limit >= total} className="text-foreground">
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
