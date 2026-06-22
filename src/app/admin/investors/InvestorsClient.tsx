"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Eye, Copy, Mail, Phone, Trash2, Loader2, Search,
  Download, RefreshCw, Users, TrendingUp, Calendar, Filter
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface InvestorEnquiry {
  id: number;
  name: string;
  mobile: string;
  email: string;
  ticket_size: string;
  industry: string;
  roi: string;
  tenure: string;
  inv_type: string;
  buss_type: string;
  vintage: string;
  query: string;
  created_at: string;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const formatTime = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const avatarColors = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-amber-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-blue-600",
];
const getColor = (name: string) => avatarColors[name.charCodeAt(0) % avatarColors.length];

export default function InvestorsClient() {
  const [enquiries, setEnquiries] = useState<InvestorEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [selectedEnquiry, setSelectedEnquiry] = useState<InvestorEnquiry | null>(null);

  const getHeaders = (json = true) => {
    const h: Record<string, string> = {};
    if (json) h["Content-Type"] = "application/json";
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) h["Authorization"] = `Bearer ${token}`;
    }
    return h;
  };

  const fetchEnquiries = async (p = page, s = search) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/investor?page=${p}&limit=10&search=${encodeURIComponent(s)}`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const result = await res.json();
        setEnquiries(result.data || []);
        setTotalPages(result.totalPages || 1);
        setTotalCount(result.total || 0);
        setPage(result.page || 1);
      } else {
        throw new Error("Failed to load enquiries");
      }
    } catch {
      toast.error("Failed to load investor enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchEnquiries(1, search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const res = await fetch(`/api/investor/${id}`, { 
        method: "DELETE",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Enquiry deleted successfully");
      fetchEnquiries(page, search);
    } catch {
      toast.error("Failed to delete enquiry");
    }
  };

  const copyToClipboard = (e: InvestorEnquiry) => {
    const text = [
      `Name: ${e.name}`,
      `Email: ${e.email}`,
      `Mobile: ${e.mobile}`,
      `Ticket Size: ${e.ticket_size || "N/A"}`,
      `Industry: ${e.industry || "N/A"}`,
      `Investment Type: ${e.inv_type || "N/A"}`,
      `Business Type: ${e.buss_type || "N/A"}`,
      `ROI: ${e.roi || "N/A"}`,
      `Tenure: ${e.tenure || "N/A"}`,
      `Vintage: ${e.vintage || "N/A"}`,
      `Message: ${e.query || "No query provided."}`,
      `Date: ${new Date(e.created_at).toLocaleString()}`,
    ].join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Investor details copied!");
  };

  const handleExport = async () => {
    try {
      const res = await fetch(`/api/investor?limit=1000&search=${encodeURIComponent(search)}`, {
        headers: getHeaders()
      });
      const result = await res.json();
      const allData: InvestorEnquiry[] = result.data || [];

      const BOM = "\uFEFF";
      const headers = ["ID", "Name", "Email", "Mobile", "Ticket Size", "Industry", "ROI", "Tenure", "Inv Type", "Biz Type", "Vintage", "Query", "Date"];

      const escape = (val: any) => `"${String(val ?? "").replace(/"/g, '""')}"`;

      const rows = allData.map((e) => [
        escape(e.id),
        escape(e.name),
        escape(e.email),
        escape(e.mobile),
        escape(e.ticket_size),
        escape(e.industry),
        escape(e.roi),
        escape(e.tenure),
        escape(e.inv_type),
        escape(e.buss_type),
        escape(e.vintage),
        escape(e.query),
        escape(new Date(e.created_at).toLocaleString("en-IN")),
      ].join(","));

      const csvContent = BOM + [headers.map((h) => `"${h}"`).join(","), ...rows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `investor-enquiries-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success(`Exported ${allData.length} enquiries!`);
    } catch {
      toast.error("Export failed");
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner Control Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-2xl border border-primary/20 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground font-heading">Investor Enquiries</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              <span className="font-bold text-primary">{totalCount}</span> total submissions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchEnquiries(page, search)} disabled={loading} className="rounded-xl h-9 gap-2 text-xs font-semibold text-foreground">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button size="sm" onClick={handleExport} className="rounded-xl h-9 gap-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Live Search bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or mobile..."
          className="pl-10 h-10 rounded-xl bg-card border-border shadow-sm focus-visible:ring-primary text-sm text-foreground"
        />
      </div>

      {/* Grid rendering list or tables */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-card rounded-2xl border border-dashed border-border shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-sm text-muted-foreground font-medium">Loading enquiries...</p>
        </div>
      ) : enquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed rounded-2xl bg-card border-border shadow-sm">
          <Filter className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground font-medium">No enquiries match your search.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden hidden lg:block">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {["#", "Investor", "Contact", "Ticket Size", "Industry", "ROI / Tenure", "Inv. Type", "Query", "Actions"].map((col) => (
                    <th key={col} className="py-3.5 px-4 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-foreground">
                {enquiries.map((e, idx) => (
                  <tr
                    key={e.id}
                    className="hover:bg-muted/20 transition-colors group cursor-pointer"
                    onClick={() => setSelectedEnquiry(e)}
                  >
                    <td className="py-3.5 px-4 align-middle">
                      <span className="text-[11px] font-bold text-muted-foreground/60">#{(page - 1) * 10 + idx + 1}</span>
                    </td>

                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getColor(e.name)} flex items-center justify-center shrink-0 shadow-sm`}>
                          <span className="text-white text-[11px] font-extrabold">{getInitials(e.name)}</span>
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-xs leading-tight">{e.name}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Calendar className="w-2.5 h-2.5 text-muted-foreground/50" />
                            <span className="text-[9px] text-muted-foreground/70">{formatDate(e.created_at)} · {formatTime(e.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-middle">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <Mail className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate max-w-[120px]">{e.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground">
                          <Phone className="w-2.5 h-2.5 text-primary shrink-0" />
                          {e.mobile}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-middle">
                      {e.ticket_size ? (
                        <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] px-2 py-0.5 font-bold rounded-lg whitespace-nowrap">
                          {e.ticket_size}
                        </Badge>
                      ) : <span className="text-[10px] text-muted-foreground/40">—</span>}
                    </td>

                    <td className="py-3.5 px-4 align-middle">
                      <span className="text-[11px] font-semibold text-foreground max-w-[80px] truncate block" title={e.industry}>
                        {e.industry || <span className="text-muted-foreground/40">—</span>}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 align-middle">
                      <div className="space-y-0.5">
                        <div className="text-[10px]"><span className="text-[8px] uppercase font-extrabold text-muted-foreground mr-1">ROI</span><span className="font-semibold text-emerald-700">{e.roi || "—"}</span></div>
                        <div className="text-[10px]"><span className="text-[8px] uppercase font-extrabold text-muted-foreground mr-1">TEN</span><span className="font-semibold">{e.tenure || "—"}</span></div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-middle">
                      {e.inv_type ? (
                        <Badge variant="outline" className="text-[10px] font-bold px-2 border-primary/30 text-primary rounded-lg">
                          {e.inv_type}
                        </Badge>
                      ) : <span className="text-[10px] text-muted-foreground/40">—</span>}
                    </td>

                    <td className="py-3.5 px-4 align-middle max-w-[160px]">
                      <p className="text-[11px] text-muted-foreground truncate" title={e.query}>{e.query || "No query"}</p>
                    </td>

                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-primary hover:bg-primary/10 rounded-lg"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setSelectedEnquiry(e);
                          }}
                          title="View Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            copyToClipboard(e);
                          }}
                          title="Copy"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:bg-destructive/10 rounded-lg"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            handleDelete(e.id);
                          }}
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Layout Card Lists */}
          <div className="grid grid-cols-1 gap-3 lg:hidden">
            {enquiries.map((e) => (
              <div
                key={e.id}
                className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-3 cursor-pointer hover:bg-muted/10 transition-colors text-foreground"
                onClick={() => setSelectedEnquiry(e)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getColor(e.name)} flex items-center justify-center shrink-0`}>
                      <span className="text-white text-xs font-extrabold">{getInitials(e.name)}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm leading-none">{e.name}</h4>
                      <p className="text-[10px] text-muted-foreground mt-1">{formatDate(e.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-primary/10 text-primary rounded-lg"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setSelectedEnquiry(e);
                      }}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive rounded-lg"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        handleDelete(e.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 bg-muted/40 rounded-lg px-2.5 py-2"><Mail className="w-3 h-3 text-primary shrink-0" /><span className="truncate">{e.email}</span></div>
                  <div className="flex items-center gap-1.5 bg-muted/40 rounded-lg px-2.5 py-2"><Phone className="w-3 h-3 text-primary shrink-0" /><span className="font-bold">{e.mobile}</span></div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {e.ticket_size && <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]">{e.ticket_size}</Badge>}
                  {e.inv_type && <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">{e.inv_type}</Badge>}
                  {e.industry && <Badge variant="secondary" className="text-[10px]">{e.industry}</Badge>}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 bg-card p-4 rounded-xl border border-border">
              <p className="text-[11px] text-muted-foreground font-semibold">
                Page <span className="text-primary font-bold">{page}</span> of {totalPages} · {totalCount} records
              </p>
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="sm" className="h-8 px-4 rounded-xl text-xs font-bold text-foreground" disabled={page <= 1} onClick={() => { fetchEnquiries(page - 1, search); }}>← Prev</Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    let pn = i + 1;
                    if (totalPages > 5 && page > 3) { pn = page - 3 + i; if (pn > totalPages) pn = totalPages - (4 - i); }
                    return (
                      <Button key={pn} variant={page === pn ? "default" : "ghost"} className="h-8 w-8 p-0 text-xs font-bold rounded-xl text-foreground" onClick={() => { fetchEnquiries(pn, search); }}>{pn}</Button>
                    );
                  })}
                </div>
                <Button variant="outline" size="sm" className="h-8 px-4 rounded-xl text-xs font-bold text-foreground" disabled={page >= totalPages} onClick={() => { fetchEnquiries(page + 1, search); }}>Next →</Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Dialog View for Single Entry Details */}
      <Dialog open={!!selectedEnquiry} onOpenChange={(open) => !open && setSelectedEnquiry(null)}>
        <DialogContent className="max-w-3xl bg-white border-primary/20 p-0 overflow-hidden rounded-2xl">
          <div className="bg-gradient-to-r from-primary/10 to-transparent border-b border-border px-6 pt-6 pb-5">
            <DialogHeader>
              <div className="flex items-center gap-4">
                {selectedEnquiry && (
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getColor(selectedEnquiry.name)} flex items-center justify-center shrink-0 shadow`}>
                    <span className="text-white font-extrabold text-sm">{getInitials(selectedEnquiry.name)}</span>
                  </div>
                )}
                <div>
                  <DialogTitle className="text-xl font-bold text-foreground">{selectedEnquiry?.name}</DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {selectedEnquiry && new Date(selectedEnquiry.created_at).toLocaleString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </DialogDescription>
                </div>
                {selectedEnquiry?.ticket_size && (
                  <Badge className="ml-auto bg-emerald-100 text-emerald-800 border-none px-3 py-1 font-bold text-[11px] rounded-xl text-foreground">
                    {selectedEnquiry.ticket_size}
                  </Badge>
                )}
              </div>
            </DialogHeader>
          </div>

          {selectedEnquiry && (
            <div className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Industry", value: selectedEnquiry.industry },
                  { label: "Investment Type", value: selectedEnquiry.inv_type },
                  { label: "Business Type", value: selectedEnquiry.buss_type },
                  { label: "ROI Expectation", value: selectedEnquiry.roi, green: true },
                  { label: "Tenure", value: selectedEnquiry.tenure },
                  { label: "Vintage", value: selectedEnquiry.vintage },
                ].map(({ label, value, green }) => (
                  <div key={label} className="bg-muted/30 rounded-xl p-3 space-y-1 border border-border/40">
                    <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">{label}</p>
                    <p className={`text-sm font-bold break-words ${green ? "text-emerald-600" : "text-foreground"}`}>
                      {value || <span className="text-muted-foreground/40 font-normal">—</span>}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a href={`mailto:${selectedEnquiry.email}`} className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl p-3.5 hover:bg-primary/10 transition-colors group">
                  <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">Email</p>
                    <p className="text-sm font-bold text-primary group-hover:underline break-all">{selectedEnquiry.email}</p>
                  </div>
                </a>
                <a href={`tel:${selectedEnquiry.mobile}`} className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 hover:bg-emerald-100 transition-colors group">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest">Mobile</p>
                    <p className="text-sm font-bold text-emerald-700">{selectedEnquiry.mobile}</p>
                  </div>
                </a>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" /> Message / Query
                </p>
                <div className="bg-slate-50 border border-border/40 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words min-h-[60px] max-h-[150px] overflow-y-auto shadow-inner">
                  {selectedEnquiry.query || <span className="text-muted-foreground italic text-xs">No specific query provided.</span>}
                </div>
              </div>
            </div>
          )}

          <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-2">
            <Button variant="ghost" size="sm" className="text-xs font-bold gap-1.5 rounded-xl text-foreground" onClick={() => selectedEnquiry && copyToClipboard(selectedEnquiry)}>
              <Copy className="h-3.5 w-3.5" /> Copy All
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-bold px-6 rounded-xl text-xs" onClick={() => setSelectedEnquiry(null)}>
              Dismiss
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
