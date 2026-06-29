"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Search, Loader2, ChevronLeft, ChevronRight, Upload, Image as ImageIcon, Check, History, Calendar as CalendarIcon, Info } from "lucide-react";
import { toast } from "sonner";
import { ipoListApi } from "@/services/api";
import { getImageUrl, cn } from "@/lib/utils";
import { MultiSelect } from "@/components/ui/multi-select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { format, parse } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { API_URL } from "@/lib/constants";

interface IPO {
  id: number;
  logo: string | number;
  issuer_company: string | number;
  date_declared: string | number;
  open_date: string | number;
  close_date: string | number;
  listing_date: string | number;
  merchant_bankers: string | number;
  issue_lowest_price: string | number;
  issue_highest_price: string | number;
  issue_size: string | number;
  lot_size: number;
  exchange: string | number;
  gmp: string | number;
  issue_category: string | number;
  sector_id: string | number;
  merchant_banker: string | number;
  current_price: string | number;
  ipo_pe_ratio: string | number;
  listing_day_close_bse: string | number;
  listing_day_close_nse: string | number;
  listing_day_open_bse?: string | number;
  listing_day_open_nse?: string | number;
  status: string | number;
  upcoming: string | number;
  confidential: string | number;
  upcoming_ipo_status: string | number;
  admin_blog_id: string | number;
  sector_names?: string;
  sector_ids?: string;
}

const statusColor: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  upcoming: "bg-sky-500/20 text-sky-400 border-sky-500/40",
  closed: "bg-rose-500/20 text-rose-400 border-rose-500/40",
  listed: "bg-indigo-500/20 text-indigo-400 border-indigo-500/40",
  Active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  Inactive: "bg-rose-500/20 text-rose-400 border-rose-500/40",
};

const rowBgColor: Record<string, string> = {
  Active: "hover:bg-emerald-500/5",
  active: "hover:bg-emerald-500/5",
  Upcoming: "hover:bg-sky-500/5",
  upcoming: "hover:bg-sky-500/5",
  Closed: "hover:bg-rose-500/5",
  closed: "hover:bg-rose-500/5",
  Listed: "hover:bg-indigo-500/5",
  listed: "hover:bg-indigo-500/5",
};

const emptyIPO: Omit<IPO, "id"> = {
  logo: "", issuer_company: "", date_declared: "", open_date: "", close_date: "",
  listing_date: "", merchant_bankers: "", issue_lowest_price: 0, issue_highest_price: 0,
  issue_size: 0, lot_size: 0, exchange: "", gmp: 0, issue_category: "", sector_id: 0,
  merchant_banker: "", current_price: 0, ipo_pe_ratio: 0, listing_day_close_bse: 0,
  listing_day_close_nse: 0, listing_day_open_bse: 0, listing_day_open_nse: 0, status: "Active", upcoming: "0", confidential: "0",
  upcoming_ipo_status: "", admin_blog_id: 0
};

const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function ManageIPOsContent() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [sectors, setSectors] = useState<{ id: number, sector_name: string }[]>([]);
  const [form, setForm] = useState<Omit<IPO, "id">>(emptyIPO);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-ipos", pagination.page, debouncedSearch],
    queryFn: async () => {
      return await ipoListApi.getAll({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: debouncedSearch,
        admin: "true"
      });
    },
    gcTime: 60 * 1000,
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  const ipos: IPO[] = data?.data || [];
  const loading = isLoading;
  const total = data?.pagination?.total || 0;
  const totalPages = data?.pagination?.totalPages || 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination(p => ({ ...p, page: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [bankers, setBankers] = useState<{ id: any, title: string, mcat_id: string }[]>([]);
  const [adminBlogs, setAdminBlogs] = useState<{ id: any, title: string }[]>([]);
  const [bankerFilter, setBankerFilter] = useState<"all" | "sme" | "mainboard">("all");

  // GMP History States
  const [gmpDialogOpen, setGmpDialogOpen] = useState(false);
  const [selectedIpoForGmp, setSelectedIpoForGmp] = useState<IPO | null>(null);
  const [gmpRows, setGmpRows] = useState<{ date: string; price: string; gmp: string; updated: string }[]>([]);
  const [loadingGmp, setLoadingGmp] = useState(false);
  const [savingGmp, setSavingGmp] = useState(false);

  const parseArrayData = (val: any) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      return [val];
    }
  };

  const openGmpModal = async (ipo: IPO) => {
    setSelectedIpoForGmp(ipo);
    setGmpDialogOpen(true);
    setGmpRows([]);
    setLoadingGmp(true);

    try {
      if (ipo.admin_blog_id) {
        const res = await fetch(`${API_URL}/api/admin-blogs/id/${ipo.admin_blog_id}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (res.ok) {
          const blog = await res.json();
          const dates = parseArrayData(blog.gmp_date);
          const prices = parseArrayData(blog.gmp_ipo_price);
          const gmps = parseArrayData(blog.gmp);
          const updates = parseArrayData(blog.gmp_last_updated);

          const rows = dates.map((d: any, i: number) => ({
            date: String(d || ""),
            price: String(prices[i] || ""),
            gmp: String(gmps[i] || ""),
            updated: String(updates[i] || "")
          }));

          rows.sort((a: any, b: any) => {
            const timeA = a.date ? new Date(a.date).getTime() : 0;
            const timeB = b.date ? new Date(b.date).getTime() : 0;
            return timeB - timeA;
          });

          setGmpRows(rows.length > 0 ? rows : [{ date: "", price: String(ipo.issue_highest_price || ""), gmp: String(ipo.gmp || ""), updated: "" }]);
        } else {
          setGmpRows([{ date: "", price: String(ipo.issue_highest_price || ""), gmp: String(ipo.gmp || ""), updated: "" }]);
        }
      } else {
        setGmpRows([{ date: "", price: String(ipo.issue_highest_price || ""), gmp: String(ipo.gmp || ""), updated: "" }]);
      }
    } catch (err) {
      console.error(err);
      setGmpRows([{ date: "", price: String(ipo.issue_highest_price || ""), gmp: String(ipo.gmp || ""), updated: "" }]);
    } finally {
      setLoadingGmp(false);
    }
  };

  const saveGmpHistory = async () => {
    if (!selectedIpoForGmp) return;
    setSavingGmp(true);

    try {
      const cleanNumeric = (v: any) => String(v || "").trim();
      const cleanDateOnly = (v: any) => {
        const s = String(v || '').trim();
        const dateMatch = s.match(/\d{1,2}\s+[A-Za-z]{3,}\s*,?\s*\d{4}(\s*\|\s*\d{1,2}:\d{2}\s*[AaPp][Mm])?/);
        return dateMatch ? dateMatch[0] : "";
      };

      const nonBoringRows = gmpRows.filter(r => {
        const hasDate = !!r.date?.trim();
        const hasPrice = !!r.price?.trim();
        const hasGmp = !!r.gmp?.trim();
        const hasUpdated = !!r.updated?.trim();
        return hasDate || hasPrice || hasGmp || hasUpdated;
      });

      const missingDateRow = nonBoringRows.find(r => !r.date?.trim());
      if (missingDateRow) {
        toast.error("Please select a date for all entered GMP records.");
        setSavingGmp(false);
        return;
      }

      const validRows = nonBoringRows;

      const gmpData = {
        gmp: JSON.stringify(validRows.map(r => cleanNumeric(r.gmp))),
        gmp_ipo_price: JSON.stringify(validRows.map(r => cleanNumeric(r.price))),
        gmp_date: JSON.stringify(validRows.map(r => cleanDateOnly(r.date))),
        gmp_last_updated: JSON.stringify(validRows.map(r => cleanDateOnly(r.updated)))
      };

      if (selectedIpoForGmp.admin_blog_id) {
        await fetch(`${API_URL}/api/admin-blogs/${selectedIpoForGmp.admin_blog_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(gmpData)
        });
      }

      const latestGmpRow = validRows.find(r => r.gmp);
      const finalGmpValue = latestGmpRow ? latestGmpRow.gmp : "0";

      await ipoListApi.update(selectedIpoForGmp.id.toString(), {
        ...selectedIpoForGmp,
        gmp: finalGmpValue
      });

      toast.success("GMP History Updated!");
      setGmpDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-ipos"] });
    } catch (err: any) {
      toast.error("Save failed: " + err.message);
    } finally {
      setSavingGmp(false);
    }
  };

  useEffect(() => {
    if (dialogOpen) {
      fetchSectors();
      fetchBankers();
      fetchAdminBlogs();
    }
  }, [dialogOpen]);

  const fetchBankers = async () => {
    try {
      const res = await fetch("${API_URL}/api/bankers?all=true", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.ok) {
        const body = await res.json();
        setBankers(body.data || []);
      }
    } catch (err) { }
  };

  const fetchAdminBlogs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin-blogs?limit=1000&summary=1`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.ok) {
        const body = await res.json();
        setAdminBlogs(body.data || []);
      }
    } catch (err) { }
  };

  const fetchSectors = async () => {
    try {
      const data = await ipoListApi.getSectors();
      setSectors(data);
    } catch (e) { }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const limit = 2 * 1024 * 1024;
    if (file.size > limit) {
      toast.error("cannot upload image >2 mb");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("folder", "complogo");
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setForm({ ...form, logo: url });
      toast.success("Logo uploaded!");
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.issuer_company?.toString().trim()) {
      toast.error("Company name is required");
      return;
    }

    if (!form.logo) {
      toast.error("Logo is required");
      return;
    }

    if (!form.exchange?.toString().trim()) {
      toast.error("Exchange is required");
      return;
    }

    if (!form.issue_category) {
      toast.error("Issue category is required");
      return;
    }

    if (!form.sector_id || Number(form.sector_id) === 0) {
      toast.error("Sector is required");
      return;
    }

    if (form.date_declared === "Yes") {
      if (!form.open_date) {
        toast.error("Open date is required");
        return;
      }

      if (!form.close_date) {
        toast.error("Close date is required");
        return;
      }

      if (new Date(form.close_date) < new Date(form.open_date)) {
        toast.error("Close date must be after open date");
        return;
      }

      if (form.listing_date && new Date(form.listing_date) < new Date(form.close_date)) {
        toast.error("Listing date must be after close date");
        return;
      }
    }

    const lotSize = Number(form.lot_size || 0);
    if (lotSize < 0) {
      toast.error("Lot size cannot be negative");
      return;
    }

    const low = Number(form.issue_lowest_price || 0);
    const high = Number(form.issue_highest_price || 0);

    if (low < 0 || high < 0) {
      toast.error("Price cannot be negative");
      return;
    }

    if (low > high) {
      toast.error("Lowest price cannot exceed highest price");
      return;
    }

    if (Number(form.issue_size || 0) < 0) {
      toast.error("Issue size cannot be negative");
      return;
    }

    if (Number(form.gmp || 0) < 0) {
      toast.error("GMP cannot be negative");
      return;
    }

    const allowedStatus = ["Active", "Closed", "Upcoming", "Listed"];
    if (form.status && !allowedStatus.includes(String(form.status))) {
      toast.error("Invalid status selected");
      return;
    }

    if (form.logo) {
      const logoStr = String(form.logo);
      const isAbsolute = logoStr.startsWith("http") || logoStr.startsWith("data:");

      if (isAbsolute) {
        try {
          new URL(logoStr);
        } catch {
          toast.error("Invalid logo URL");
          return;
        }
      }
    }

    try {
      const selectedBankersIds = (form as any).merchant_banker_arr || [];
      const selectedBankersNames = selectedBankersIds
        .map((id: any) => bankers.find(b => String(b.id) === String(id))?.title)
        .filter(Boolean)
        .join(', ');

      const cleanSectorId = form.sector_id && Number(form.sector_id) !== 0 ? Number(form.sector_id) : null;
      const payload = {
        ...form,
        sector_id: cleanSectorId,
        merchant_banker: selectedBankersIds.join(','),
        merchant_bankers: selectedBankersNames
      };

      delete (payload as any).sector_ids;
      delete (payload as any).sector_names;
      delete (payload as any).blog_image;
      delete (payload as any).blog_slug;
      delete (payload as any).gmp_history;

      if (editingId) {
        await ipoListApi.update(editingId.toString(), payload);
        toast.success("IPO updated!");
      } else {
        await ipoListApi.create(payload);
        toast.success("IPO added!");
      }

      setForm(emptyIPO);
      setEditingId(null);
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-ipos"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to save IPO");
    }
  };

  const handleEdit = (ipo: IPO) => {
    const { id, ...rest } = ipo;

    const merchant_banker_arr = ipo.merchant_banker
      ? String(ipo.merchant_banker).split(',').filter(Boolean)
      : [];

    let mappedDateDeclared = rest.date_declared;
    if (rest.date_declared === "1" || rest.date_declared === 1) {
      mappedDateDeclared = "Yes";
    } else if (rest.date_declared === "0" || rest.date_declared === 0) {
      mappedDateDeclared = "No";
    }

    setForm({ ...rest, date_declared: mappedDateDeclared, merchant_banker_arr } as any);
    const cat = ipo.issue_category === "sme" ? "sme" : (ipo.issue_category === "mainboard" || ipo.issue_category === "mainline" ? "mainboard" : "all");
    setBankerFilter(cat);
    setEditingId(id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this IPO?")) return;
    try {
      await ipoListApi.delete(id.toString());
      toast.success("IPO deleted!");
      queryClient.invalidateQueries({ queryKey: ["admin-ipos"] });
    } catch (error) {
      toast.error("Failed to delete IPO");
    }
  };

  const uniqueBankersMap = new Map<string, { id: any, title: string, categories: Set<string> }>();
  bankers.forEach(b => {
    if (b && b.title) {
      const normalizedTitle = b.title.trim().toLowerCase();
      if (!uniqueBankersMap.has(normalizedTitle)) {
        uniqueBankersMap.set(normalizedTitle, {
          id: b.id,
          title: b.title,
          categories: new Set([b.mcat_id])
        });
      } else {
        uniqueBankersMap.get(normalizedTitle)!.categories.add(b.mcat_id);
      }
    }
  });

  const bankerIdToCanonicalIdMap = new Map<string, string>();
  bankers.forEach(b => {
    if (b && b.title) {
      const normalizedTitle = b.title.trim().toLowerCase();
      const canonicalBanker = uniqueBankersMap.get(normalizedTitle);
      if (canonicalBanker) {
        bankerIdToCanonicalIdMap.set(String(b.id), String(canonicalBanker.id));
      }
    }
  });

  const selectedBankerIds = ((form as any).merchant_banker_arr || []).map(String);

  const uniqueBankersOptions = Array.from(uniqueBankersMap.values())
    .filter(b => {
      const canonicalId = bankerIdToCanonicalIdMap.get(String(b.id)) || String(b.id);
      if (selectedBankerIds.includes(canonicalId)) {
        return true;
      }

      if (bankerFilter === "sme") {
        return b.categories.has("list-of-sme-merchant-bankers");
      } else if (bankerFilter === "mainboard") {
        return b.categories.has("list-of-mainboard-merchant-bankers");
      }
      return true;
    })
    .map(b => ({
      label: b.title,
      value: String(b.id)
    }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage IPO Calendar</h1>
          <p className="text-sm text-muted-foreground">{total} IPOs total in database</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search company..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setForm(emptyIPO); setEditingId(null); setBankerFilter("all"); } }}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-gold-light font-semibold">
                <Plus className="h-4 w-4 mr-2" /> Add IPO
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-4xl max-h-[90vh] overflow-y-auto"
              aria-describedby={undefined}
              onPointerDownOutside={(e) => {
                e.preventDefault();
              }}
              onEscapeKeyDown={(e) => {
                e.preventDefault();
              }}
            >
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit IPO" : "Add New IPO"}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div className="col-span-full">
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Company Name *</label>
                  <Input value={form.issuer_company} onChange={(e) => setForm({ ...form, issuer_company: e.target.value })} />
                </div>

                <div className="col-span-full">
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Company Logo (Upload or URL)</label>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={String(form.logo || "")}
                        onChange={(e) => setForm({ ...form, logo: e.target.value })}
                        placeholder="Logo URL or upload"
                      />
                      <label className={`flex items-center justify-center gap-2 h-10 cursor-pointer border-2 border-dashed rounded-lg transition-colors hover:bg-muted/50 ${uploading ? 'opacity-50 cursor-not-allowed' : 'border-border hover:border-primary'}`}>
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground font-medium">
                          {uploading ? "Uploading..." : "Upload Logo (Max 2MB)"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoUpload}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    {form.logo ? (
                      <div className="w-20 h-20 rounded-lg border-2 border-border overflow-hidden bg-white flex-shrink-0 flex items-center justify-center p-1">
                        <img
                          src={getImageUrl(String(form.logo))}
                          alt="Logo Prev"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-lg border-2 border-dashed border-border bg-muted flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Issue Category</label>
                  <Select value={String(form.issue_category)} onValueChange={(v) => {
                    setForm({ ...form, issue_category: v });
                    const cat = v === "sme" ? "sme" : (v === "mainboard" || v === "mainline" ? "mainboard" : "all");
                    setBankerFilter(cat);
                  }}>
                    <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mainline">Mainline</SelectItem>
                      <SelectItem value="sme">SME</SelectItem>
                      <SelectItem value="mainboard">Mainboard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Exchange</label>
                  <Input value={form.exchange} onChange={(e) => setForm({ ...form, exchange: e.target.value })} placeholder="BSE, NSE" />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Date Declared</label>
                  <Select value={String(form.date_declared || "Date Not Declared")} onValueChange={(v) => {
                    if (v === "No" || v === "Date Not Declared") {
                      setForm({ ...form, date_declared: v, open_date: "", close_date: "", listing_date: "" });
                    } else {
                      setForm({ ...form, date_declared: v });
                    }
                  }}>
                    <SelectTrigger><SelectValue placeholder="Select Option" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Date Not Declared">Date Not Declared</SelectItem>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {form.date_declared === "Yes" && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Open Date</label>
                      <Input type="date" value={form.open_date ? String(form.open_date).split('T')[0] : ""} onChange={(e) => setForm({ ...form, open_date: e.target.value })} />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Close Date</label>
                      <Input type="date" value={form.close_date ? String(form.close_date).split('T')[0] : ""} onChange={(e) => setForm({ ...form, close_date: e.target.value })} />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Listing Date</label>
                      <Input type="date" value={form.listing_date ? String(form.listing_date).split('T')[0] : ""} onChange={(e) => setForm({ ...form, listing_date: e.target.value })} />
                    </div>
                  </>
                )}

                <div className="col-span-full">
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Sectors *</label>
                  <SearchableSelect
                    placeholder="Select Sector"
                    options={sectors.map(s => ({ label: s.sector_name, value: String(s.id) }))}
                    value={form.sector_id ? String(form.sector_id) : ""}
                    onChange={(v) => setForm({ ...form, sector_id: v })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Issue Size (Cr)</label>
                  <Input type="number" value={form.issue_size || ""} onChange={(e) => setForm({ ...form, issue_size: e.target.value })} />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Lot Size</label>
                  <Input
                    type="number"
                    value={form.lot_size || ""}
                    onChange={(e) => setForm({ ...form, lot_size: e.target.value === "" ? 0 : Number(e.target.value) })}
                    placeholder="e.g. 1200"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Price Band (Low)</label>
                  <Input type="number" value={form.issue_lowest_price || ""} onChange={(e) => setForm({ ...form, issue_lowest_price: e.target.value })} />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Price Band (High)</label>
                  <Input type="number" value={form.issue_highest_price || ""} onChange={(e) => setForm({ ...form, issue_highest_price: e.target.value })} />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">GMP</label>
                  <Input type="text" value={form.gmp || ""} onChange={(e) => setForm({ ...form, gmp: e.target.value })} placeholder="e.g. ₹13 or 10.5%" />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Current Price</label>
                  <Input type="number" value={form.current_price || ""} onChange={(e) => setForm({ ...form, current_price: e.target.value })} placeholder="Current Price" />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">IPO P/E Ratio</label>
                  <Input type="text" value={form.ipo_pe_ratio || ""} onChange={(e) => setForm({ ...form, ipo_pe_ratio: e.target.value })} placeholder="P/E Ratio" />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Listing Day Open (BSE)</label>
                  <Input type="text" value={form.listing_day_open_bse || ""} onChange={(e) => setForm({ ...form, listing_day_open_bse: e.target.value })} placeholder="Listing Open (BSE)" />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Listing Day Open (NSE)</label>
                  <Input type="text" value={form.listing_day_open_nse || ""} onChange={(e) => setForm({ ...form, listing_day_open_nse: e.target.value })} placeholder="Listing Open (NSE)" />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Listing Day Close (BSE)</label>
                  <Input type="text" value={form.listing_day_close_bse || ""} onChange={(e) => setForm({ ...form, listing_day_close_bse: e.target.value })} placeholder="Listing Close (BSE)" />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Listing Day Close (NSE)</label>
                  <Input type="text" value={form.listing_day_close_nse || ""} onChange={(e) => setForm({ ...form, listing_day_close_nse: e.target.value })} placeholder="Listing Close (NSE)" />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Status</label>
                  <Select value={String(form.status || "Active")} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Upcoming">Upcoming</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                      <SelectItem value="Listed">Listed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Upcoming Status</label>
                  <Select value={String(form.upcoming_ipo_status || "none")} onValueChange={(v) => setForm({ ...form, upcoming_ipo_status: v })}>
                    <SelectTrigger><SelectValue placeholder="Listing Stage" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="filed_with_sebi">Filed with SEBI</SelectItem>
                      <SelectItem value="drhp_approved">DRHP Approved</SelectItem>
                      <SelectItem value="observation_received">Observation Received</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Upcoming</label>
                  <Select value={String(form.upcoming)} onValueChange={(v) => setForm({ ...form, upcoming: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No</SelectItem>
                      <SelectItem value="1">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Confidential</label>
                  <Select value={String(form.confidential)} onValueChange={(v) => setForm({ ...form, confidential: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No</SelectItem>
                      <SelectItem value="1">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-foreground">Merchant Bankers</label>
                    <select 
                      value={bankerFilter} 
                      onChange={(e) => setBankerFilter(e.target.value as any)}
                      className="text-[11px] font-semibold bg-muted border border-border text-foreground rounded-md px-2 py-0.5 focus:ring-1 focus:ring-accent focus:outline-none cursor-pointer"
                    >
                      <option value="all">Show All</option>
                      <option value="sme">SME Only</option>
                      <option value="mainboard">Mainboard Only</option>
                    </select>
                  </div>
                  <MultiSelect
                    placeholder="Select Bankers"
                    options={uniqueBankersOptions}
                    selected={((form as any).merchant_banker_arr || [])
                      .map((id: any) => bankerIdToCanonicalIdMap.get(String(id)) || String(id))}
                    onChange={(values) => {
                      setForm({ ...form, merchant_banker_arr: values } as any);
                    }}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Linked IPO Blog</label>
                  <SearchableSelect
                    placeholder="Select Blog"
                    options={adminBlogs.map(b => ({ label: b.title, value: String(b.id) }))}
                    value={String(form.admin_blog_id || "")}
                    onChange={(v) => setForm({ ...form, admin_blog_id: v })}
                  />
                </div>

                <Button onClick={handleSave} className="col-span-full bg-accent text-accent-foreground hover:bg-gold-light font-semibold h-12">
                  {editingId ? "Update IPO Data" : "Save New IPO"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 font-semibold">Company</th>
                <th className="text-left py-3 px-4 font-semibold">Category</th>
                <th className="text-left py-3 px-4 font-semibold">Size (Cr)</th>
                <th className="text-left py-3 px-4 font-semibold">Dates</th>
                <th className="text-left py-3 px-4 font-semibold">GMP</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin text-accent" />
                      <p className="text-muted-foreground">Loading IPO data...</p>
                    </div>
                  </td>
                </tr>
              ) : ipos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center text-muted-foreground">No IPOs found</td>
                </tr>
              ) : ipos.map((ipo) => (
                <tr key={ipo.id} className={cn(
                  "border-b border-border/50 transition-colors",
                  rowBgColor[String(ipo.status)] || "hover:bg-muted/30"
                )}>
                  <td className="py-3 px-4">
                    <div className="font-medium text-foreground">{ipo.issuer_company}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                      {ipo.sector_names || 'No Sector'}
                    </div>
                  </td>
                  <td className="py-3 px-4 capitalize">{ipo.issue_category}</td>
                  <td className="py-3 px-4">₹{ipo.issue_size}</td>
                  <td className="py-3 px-4 text-xs">
                    {ipo.open_date ? String(ipo.open_date).split('T')[0] : 'N/A'} to {ipo.close_date ? String(ipo.close_date).split('T')[0] : 'N/A'}
                  </td>
                  <td className="py-3 px-4">₹{ipo.gmp}</td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className={statusColor[String(ipo.status)] || ""}>{String(ipo.status)}</Badge>
                    {ipo.upcoming === "1" && <Badge className="ml-1 bg-blue-500/10 text-blue-400 border-blue-500/20">Upcoming</Badge>}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" title="Manage GMP History" onClick={() => openGmpModal(ipo)} className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                        <History className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(ipo)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(ipo.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <div className="text-xs text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, total)} of {total} entries
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-xs font-medium px-2">Page {pagination.page} of {totalPages}</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
              disabled={pagination.page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* GMP Management Modal */}
      <Dialog open={gmpDialogOpen} onOpenChange={setGmpDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <History className="w-5 h-5 text-amber-500" />
              GMP History: {selectedIpoForGmp?.issuer_company}
            </DialogTitle>
          </DialogHeader>

          {loadingGmp ? (
            <div className="py-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-500" /></div>
          ) : (
            <div className="space-y-4 mt-4 text-foreground">
              {!selectedIpoForGmp?.admin_blog_id && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Note: This IPO is not linked to a blog. GMP updates will only update the main IPO entry.
                </div>
              )}

              <div className="overflow-x-auto rounded-xl border border-border bg-muted/20">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="py-2 px-3 text-left font-bold text-xs">GMP Date</th>
                      <th className="py-2 px-3 text-left font-bold text-xs">IPO Price</th>
                      <th className="py-2 px-3 text-left font-bold text-xs">Latest GMP</th>
                      <th className="py-2 px-3 text-left font-bold text-xs">Last Updated</th>
                      <th className="py-2 px-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {gmpRows.map((row, idx) => (
                      <tr key={idx} className="bg-white/50">
                        <td className="p-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full h-9 px-3 text-left font-normal text-xs flex justify-between items-center",
                                  !row.date && "text-muted-foreground"
                                )}
                              >
                                {row.date || "Select date"}
                                <CalendarIcon className="h-3.5 w-3.5 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={row.date ? (() => {
                                  try {
                                    return parse(row.date, "d MMM yyyy", new Date());
                                  } catch (e) {
                                    return undefined;
                                  }
                                })() : undefined}
                                onSelect={(date) => {
                                  if (date) {
                                    const newRows = [...gmpRows];
                                    newRows[idx].date = format(date, "d MMM yyyy");
                                    setGmpRows(newRows);
                                  }
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </td>
                        <td className="p-2">
                          <Input
                            placeholder="₹120-130"
                            value={row.price}
                            onChange={(e) => {
                              const newRows = [...gmpRows];
                              newRows[idx].price = e.target.value;
                              setGmpRows(newRows);
                            }}
                            className="h-9 text-xs"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            placeholder="₹13"
                            value={row.gmp}
                            onChange={(e) => {
                              const newRows = [...gmpRows];
                              newRows[idx].gmp = e.target.value;
                              setGmpRows(newRows);
                            }}
                            className="h-9 text-xs font-bold text-amber-600"
                          />
                        </td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Input
                              placeholder="12 May | 10:00 AM"
                              value={row.updated}
                              onChange={(e) => {
                                const newRows = [...gmpRows];
                                newRows[idx].updated = e.target.value;
                                setGmpRows(newRows);
                              }}
                              className="h-9 text-[10px]"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                const newRows = [...gmpRows];
                                newRows[idx].updated = format(new Date(), "d MMM, yyyy | hh:mm a");
                                setGmpRows(newRows);
                              }}
                              className="h-9 px-2 text-[10px] font-bold"
                            >
                              NOW
                            </Button>
                          </div>
                        </td>
                        <td className="p-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setGmpRows(gmpRows.filter((_, i) => i !== idx))}
                            className="h-8 w-8 p-0 text-destructive/60 hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setGmpRows([{ date: "", price: gmpRows[0]?.price || "", gmp: "", updated: "" }, ...gmpRows])}
                  className="text-xs font-bold border-amber-200 text-amber-700 hover:bg-amber-50"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add New GMP Record
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setGmpDialogOpen(false)} disabled={savingGmp}>Cancel</Button>
                  <Button onClick={saveGmpHistory} disabled={savingGmp} className="bg-amber-600 hover:bg-amber-700 text-white font-bold">
                    {savingGmp ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                    Save GMP History
                  </Button>
                </div>
              </div>
            </div>
          )}
          </DialogContent>
        </Dialog>
      </div>
  );
}

export default function ManageIPOsClient() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <ManageIPOsContent />
    </QueryClientProvider>
  );
}
