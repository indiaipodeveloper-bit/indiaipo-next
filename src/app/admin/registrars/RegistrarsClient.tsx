"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, Search, Link as LinkIcon, Building2, Check, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/utils";
import RichEditor from "@/components/ui/RichEditor";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { API_URL } from "@/lib/constants";

interface Registrar {
  id: number;
  name: string;
  image: string;
  meta_title: string;
  meta_desc: string;
  meta_keywords: string;
  slug: string;
  sme_ipo: string;
  mainboard_ipo: string;
  sme_ipo_parentage: string;
  mainboard_ipo_parentage: string;
  avgsubscription_sme: string;
  avgsubscription_mainboard: string;
  location: string;
  dic: string;
  registrar_year: string;
  latest_sme: string;
  latest_mainbord: string;
  faqs: string;
  status: string;
  created_at?: string;
  update_at?: string;
}

const emptyForm: Omit<Registrar, 'id' | 'created_at' | 'update_at'> = {
  name: "",
  image: "",
  meta_title: "",
  meta_desc: "",
  meta_keywords: "",
  slug: "",
  sme_ipo: "",
  mainboard_ipo: "",
  sme_ipo_parentage: "",
  mainboard_ipo_parentage: "",
  avgsubscription_sme: "",
  avgsubscription_mainboard: "",
  location: "",
  dic: "",
  registrar_year: "",
  latest_sme: "",
  latest_mainbord: "",
  faqs: "",
  status: "Active",
};

export default function RegistrarsClient() {
  const [registrars, setRegistrars] = useState<Registrar[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [faqItems, setFaqItems] = useState<{ question: string, answer: string }[]>([]);
  const [allIpos, setAllIpos] = useState<any[]>([]);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchRegistrars = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/registrars?page=${page}&limit=${limit}&search=${encodeURIComponent(debouncedSearch)}`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const body = await res.json();
        setRegistrars(body.data || []);
        setTotal(body.pagination?.total || 0);
      }
    } catch (err) {
      toast.error("Failed to load Registrars");
    } finally {
      setLoading(false);
    }
  };

  const fetchIPOs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/ipo-lists?limit=1000&admin=true`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const body = await res.json();
        setAllIpos(body.data || []);
      }
    } catch (err) {
      console.error("Failed to load IPOs", err);
    }
  };

  useEffect(() => {
    fetchRegistrars();
    fetchIPOs();
  }, [page, limit, debouncedSearch]);

  const handleSave = async () => {
    if (!form.name) { toast.error("Registrar Name is required"); return; }
    if (!form.image) { toast.error("Image/Logo is required"); return; }
    if (!form.slug || form.slug.trim() === "") { toast.error("Invalid slug"); return; }

    setSaving(true);
    try {
      const url = editingId ? `${API_URL}/api/registrars/${editingId}` : `${API_URL}/api/registrars`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify({
          ...form,
          faqs: JSON.stringify(faqItems)
        }),
      });

      if (!res.ok) { throw new Error("Save failed"); }

      toast.success(editingId ? "Registrar updated!" : "Registrar created!");
      setForm(emptyForm);
      setEditingId(null);
      setFaqItems([]);
      setDialogOpen(false);
      fetchRegistrars();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (r: Registrar) => {
    setForm({
      name: r.name || "",
      image: r.image || "",
      meta_title: r.meta_title || "",
      meta_desc: r.meta_desc || "",
      meta_keywords: r.meta_keywords || "",
      slug: r.slug || "",
      sme_ipo: r.sme_ipo || "",
      mainboard_ipo: r.mainboard_ipo || "",
      sme_ipo_parentage: r.sme_ipo_parentage || "",
      mainboard_ipo_parentage: r.mainboard_ipo_parentage || "",
      avgsubscription_sme: r.avgsubscription_sme || "",
      avgsubscription_mainboard: r.avgsubscription_mainboard || "",
      location: r.location || "",
      dic: r.dic || "",
      registrar_year: r.registrar_year || "",
      latest_sme: r.latest_sme || "",
      latest_mainbord: r.latest_mainbord || "",
      faqs: r.faqs || "",
      status: r.status || "Active",
    });

    try {
      const parsed = r.faqs ? JSON.parse(r.faqs) : [];
      setFaqItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setFaqItems([]);
    }

    setEditingId(r.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this Registrar permanently?")) return;
    try {
      const res = await fetch(`${API_URL}/api/registrars/${id}`, { 
        method: "DELETE",
        headers: getHeaders()
      });
      if (res.ok) {
        toast.success("Deleted successfully");
        fetchRegistrars();
      } else {
        throw new Error("Delete failed");
      }
    } catch (err: any) {
      toast.error(err.message);
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
    formData.append("folder", "registrar");
    formData.append("file", file);

    const tId = toast.loading("Uploading logo...");
    try {
      const res = await fetch(`${API_URL}/api/upload`, { 
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

  const generateSlug = () => {
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm({ ...form, slug });
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            IPO Registrars
            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{total} Total</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage official IPO Registrars, statistics, and FAQs</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search registrars..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-8 bg-card shadow-sm border-border hover:border-primary/30 transition-colors text-foreground"
              autoComplete="off"
            />
          </div>

          <Dialog open={dialogOpen} onOpenChange={(o) => {
            setDialogOpen(o);
            if (!o) {
              setForm(emptyForm);
              setEditingId(null);
              setFaqItems([]);
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground shrink-0 shadow-sm hover:scale-105 transition-transform font-semibold">
                <Plus className="h-4 w-4 mr-2" /> Add Registrar
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-4xl max-h-[90vh] overflow-y-auto"
              onPointerDownOutside={(e) => {
                e.preventDefault();
              }}
              onEscapeKeyDown={(e) => {
                e.preventDefault();
              }}
            >
              <DialogHeader>
                <DialogTitle className="text-xl text-foreground">{editingId ? "Edit Registrar" : "Add Registrar"}</DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="general" className="mt-4">
                <TabsList className="grid w-full grid-cols-4 bg-muted">
                  <TabsTrigger value="general" className="text-foreground">General</TabsTrigger>
                  <TabsTrigger value="stats" className="text-foreground">IPO Stats</TabsTrigger>
                  <TabsTrigger value="description" className="text-foreground">Description & FAQ</TabsTrigger>
                  <TabsTrigger value="seo" className="text-foreground">SEO Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4 py-4 pt-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Registrar Name *</label>
                      <Input 
                        value={form.name} 
                        onChange={(e) => setForm({ ...form, name: e.target.value, meta_title: e.target.value })} 
                        onBlur={generateSlug} 
                        placeholder="e.g. Link Intime India" 
                        className="text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Slug *</label>
                      <Input 
                        value={form.slug} 
                        onChange={(e) => setForm({ ...form, slug: e.target.value })} 
                        placeholder="link-intime-india" 
                        className="text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Logo Image</label>
                      <div className="flex gap-2">
                        <Input 
                          value={form.image} 
                          onChange={(e) => setForm({ ...form, image: e.target.value })} 
                          className="flex-1 text-foreground"
                        />
                        <div className="relative shrink-0">
                          <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                          <Button type="button" variant="outline" disabled={uploading} className="text-foreground">
                            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Location</label>
                      <Input 
                        value={form.location} 
                        onChange={(e) => setForm({ ...form, location: e.target.value })} 
                        placeholder="e.g. Mumbai" 
                        className="text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Established Year</label>
                      <Input
                        value={form.registrar_year}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setForm({ ...form, registrar_year: val });
                        }}
                        placeholder="e.g. 1999"
                        maxLength={4}
                        className="text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Status</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        className="w-full h-10 px-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm bg-background text-foreground border-input"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="stats" className="space-y-4 py-4 pt-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-muted/20 p-4 rounded-xl border border-border space-y-4">
                      <h3 className="font-bold text-primary border-b border-border pb-2">SME IPO Stats</h3>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground">Total SME IPOs</label>
                        <Input
                          value={form.sme_ipo}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setForm({ ...form, sme_ipo: val });
                          }}
                          className="text-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground">SME Parentage (%)</label>
                        <Input
                          value={form.sme_ipo_parentage}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.]/g, "");
                            if (val.split('.').length > 2) return;
                            setForm({ ...form, sme_ipo_parentage: val });
                          }}
                          className="text-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground">Avg. SME Subscription</label>
                        <Input
                          value={form.avgsubscription_sme}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.]/g, "");
                            if (val.split('.').length > 2) return;
                            setForm({ ...form, avgsubscription_sme: val });
                          }}
                          className="text-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground">Latest SME IPO</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between h-auto min-h-10 py-2 border border-input text-foreground hover:bg-muted/50"
                            >
                              <div className="flex flex-wrap gap-1 text-left">
                                {form.latest_sme ? (
                                  form.latest_sme.split(",").map((id) => {
                                    const ipo = allIpos.find((i) => String(i.id) === id.trim());
                                    return ipo ? (
                                      <Badge key={id} variant="secondary" className="mr-1 mb-1 bg-primary/10 text-primary border-primary/20">
                                        {ipo.issuer_company}
                                      </Badge>
                                    ) : null;
                                  })
                                ) : (
                                  <span className="text-muted-foreground text-xs">Select SME IPOs...</span>
                                )}
                              </div>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0" align="start">
                            <Command className="bg-popover">
                              <CommandInput placeholder="Search SME IPOs..." />
                              <CommandList>
                                <CommandEmpty>No IPO found.</CommandEmpty>
                                <CommandGroup>
                                  {allIpos
                                    .filter((i) => String(i.issue_category).toLowerCase() === "sme")
                                    .map((ipo) => {
                                      const isSelected = form.latest_sme?.split(",").map(id => id.trim()).includes(String(ipo.id));
                                      return (
                                        <CommandItem
                                          key={ipo.id}
                                          onSelect={() => {
                                            const currentIds = form.latest_sme ? form.latest_sme.split(",").map(id => id.trim()).filter(Boolean) : [];
                                            const newIds = isSelected
                                              ? currentIds.filter((id) => id !== String(ipo.id))
                                              : [...currentIds, String(ipo.id)];
                                            setForm({ ...form, latest_sme: newIds.join(",") });
                                          }}
                                          className="flex items-center text-foreground hover:bg-accent/50 cursor-pointer"
                                        >
                                          <div className={cn(
                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                            isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                                          )}>
                                            <Check className="h-4 w-4" />
                                          </div>
                                          {ipo.issuer_company}
                                        </CommandItem>
                                      );
                                    })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="bg-muted/20 p-4 rounded-xl border border-border space-y-4">
                      <h3 className="font-bold text-orange-500 border-b border-border pb-2">Mainboard IPO Stats</h3>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground">Total Mainboard IPOs</label>
                        <Input
                          value={form.mainboard_ipo}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setForm({ ...form, mainboard_ipo: val });
                          }}
                          className="text-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground">Mainboard Parentage (%)</label>
                        <Input
                          value={form.mainboard_ipo_parentage}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.]/g, "");
                            if (val.split('.').length > 2) return;
                            setForm({ ...form, mainboard_ipo_parentage: val });
                          }}
                          className="text-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground">Avg. Mainboard Subscription</label>
                        <Input
                          value={form.avgsubscription_mainboard}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.]/g, "");
                            if (val.split('.').length > 2) return;
                            setForm({ ...form, avgsubscription_mainboard: val });
                          }}
                          className="text-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground">Latest Mainboard IPO</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between h-auto min-h-10 py-2 border border-input text-foreground hover:bg-muted/50"
                            >
                              <div className="flex flex-wrap gap-1 text-left">
                                {form.latest_mainbord ? (
                                  form.latest_mainbord.split(",").map((id) => {
                                    const ipo = allIpos.find((i) => String(i.id) === id.trim());
                                    return ipo ? (
                                      <Badge key={id} variant="secondary" className="mr-1 mb-1 bg-orange-500/10 text-orange-600 border-orange-500/20">
                                        {ipo.issuer_company}
                                      </Badge>
                                    ) : null;
                                  })
                                ) : (
                                  <span className="text-muted-foreground text-xs">Select Mainboard IPOs...</span>
                                )}
                              </div>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0" align="start">
                            <Command className="bg-popover">
                              <CommandInput placeholder="Search Mainboard IPOs..." />
                              <CommandList>
                                <CommandEmpty>No IPO found.</CommandEmpty>
                                <CommandGroup>
                                  {allIpos
                                    .filter((i) => {
                                      const cat = String(i.issue_category).toLowerCase();
                                      return cat === "mainline" || cat === "mainboard";
                                    })
                                    .map((ipo) => {
                                      const isSelected = form.latest_mainbord?.split(",").map(id => id.trim()).includes(String(ipo.id));
                                      return (
                                        <CommandItem
                                          key={ipo.id}
                                          onSelect={() => {
                                            const currentIds = form.latest_mainbord ? form.latest_mainbord.split(",").map(id => id.trim()).filter(Boolean) : [];
                                            const newIds = isSelected
                                              ? currentIds.filter((id) => id !== String(ipo.id))
                                              : [...currentIds, String(ipo.id)];
                                            setForm({ ...form, latest_mainbord: newIds.join(",") });
                                          }}
                                          className="flex items-center text-foreground hover:bg-accent/50 cursor-pointer"
                                        >
                                          <div className={cn(
                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                            isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                                          )}>
                                            <Check className="h-4 w-4" />
                                          </div>
                                          {ipo.issuer_company}
                                        </CommandItem>
                                      );
                                    })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="description" className="space-y-6 py-4 pt-6 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground font-heading">Main Description</label>
                    <RichEditor
                      value={form.dic}
                      onChange={(content) => setForm({ ...form, dic: content })}
                      placeholder="Enter registrar description here..."
                    />
                  </div>

                  <div className="space-y-4 border-t border-border pt-6">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-foreground font-heading">Frequently Asked Questions (FAQs)</label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setFaqItems([...faqItems, { question: "", answer: "" }])}
                        className="h-8 text-foreground"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" /> Add Question
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {faqItems.length === 0 ? (
                        <div className="text-center py-8 bg-muted/10 rounded-xl border-2 border-dashed border-border">
                          <p className="text-xs text-muted-foreground">No FAQs added yet. Click 'Add Question' to begin.</p>
                        </div>
                      ) : (
                        faqItems.map((item, idx) => (
                          <div key={idx} className="bg-muted/20 p-4 rounded-xl space-y-3 relative group border border-border">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setFaqItems(faqItems.filter((_, i) => i !== idx))}
                              className="absolute top-2 right-2 h-7 w-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>

                            <div className="space-y-1.5">
                              <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Question {idx + 1}</label>
                              <Input
                                value={item.question}
                                onChange={(e) => {
                                  const newItems = [...faqItems];
                                  newItems[idx].question = e.target.value;
                                  setFaqItems(newItems);
                                }}
                                placeholder="Enter question..."
                                className="bg-background h-9 text-sm text-foreground"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Answer</label>
                              <Textarea
                                value={item.answer}
                                onChange={(e) => {
                                  const newItems = [...faqItems];
                                  newItems[idx].answer = e.target.value;
                                  setFaqItems(newItems);
                                }}
                                placeholder="Enter answer..."
                                rows={2}
                                className="bg-background text-sm text-foreground min-h-[60px]"
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4 py-4 pt-6 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Meta Title</label>
                    <Input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} className="text-foreground" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Meta Description</label>
                    <Textarea value={form.meta_desc} onChange={(e) => setForm({ ...form, meta_desc: e.target.value })} rows={3} className="text-foreground" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Meta Keywords</label>
                    <Input value={form.meta_keywords} onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })} className="text-foreground" />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setDialogOpen(false)} className="text-foreground">Cancel</Button>
                <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground min-w-[120px]">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Registrar"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="py-4 px-5 text-left font-semibold text-foreground w-16">Logo</th>
                  <th className="py-4 px-5 text-left font-semibold text-foreground min-w-[200px]">Registrar</th>
                  <th className="py-4 px-5 text-left font-semibold text-foreground">SME / Mainboard</th>
                  <th className="py-4 px-5 text-left font-semibold text-foreground">Status</th>
                  <th className="py-4 px-5 text-right font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-muted-foreground text-sm font-medium">Fetching Records...</p>
                      </div>
                    </td>
                  </tr>
                ) : registrars.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-muted-foreground flex flex-col items-center justify-center">
                      <Search className="w-12 h-12 mb-3 opacity-20 text-primary" />
                      <p className="text-lg font-medium text-foreground">No registrars found.</p>
                      <p className="text-sm">Try modifying your search or add a new registrar.</p>
                    </td>
                  </tr>
                ) : registrars.map((r) => (
                  <tr key={r.id} className="hover:bg-secondary/10 transition-colors group">
                    <td className="py-3 px-5">
                      <div className="w-10 h-10 rounded border bg-white p-1 overflow-hidden flex items-center justify-center shadow-sm shrink-0 border-border group-hover:border-primary/50 transition-colors">
                        {r.image ? (
                          <img
                            src={getImageUrl(r.image)}
                            alt=""
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <Building2 className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      <div className="font-bold text-foreground text-base group-hover:text-primary transition-colors pr-4">{r.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {r.location && <span>HQ: {r.location}</span>}
                        {r.registrar_year && <span> · Est: {r.registrar_year}</span>}
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="outline" className="w-fit text-primary border-primary/20 bg-primary/5 text-xs font-semibold py-0.5">
                          SME: {r.sme_ipo || "0"} (Avg: {r.avgsubscription_sme || "0"}x)
                        </Badge>
                        <Badge variant="outline" className="w-fit text-orange-500 border-orange-500/20 bg-orange-500/5 text-xs font-semibold py-0.5">
                          Main: {r.mainboard_ipo || "0"} (Avg: {r.avgsubscription_mainboard || "0"}x)
                        </Badge>
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      <Badge className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", r.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-muted text-muted-foreground border border-border")}>
                        {r.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <div className="flex justify-end gap-1.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(r)} className="h-8 border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary">
                          <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(r.id)} className="h-8 w-8 text-destructive border-border hover:bg-destructive hover:text-white hover:border-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && totalPages > 0 && (
            <div className="p-4 border-t border-border bg-gradient-to-r from-secondary/5 via-secondary/10 to-transparent flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground font-medium">
                Showing <span className="font-bold text-foreground mx-1">{(page - 1) * limit + 1}-{Math.min(page * limit, total)}</span> of <span className="font-bold text-foreground ml-1">{total}</span> total entries
              </p>

              <div className="flex items-center gap-1.5 bg-background p-1.5 rounded-lg border border-border shadow-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-foreground font-medium"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                </Button>

                <div className="h-4 w-[1px] bg-border mx-1"></div>

                <span className="text-sm font-semibold px-3 py-1 bg-primary text-primary-foreground rounded-md">
                  {page}
                </span>
                <span className="text-sm text-muted-foreground px-1 font-medium">of</span>
                <span className="text-sm font-semibold px-2 text-foreground">
                  {totalPages}
                </span>

                <div className="h-4 w-[1px] bg-border mx-1"></div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-foreground font-medium"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
