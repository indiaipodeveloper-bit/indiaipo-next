"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Mail, Phone, Landmark, Search, Download, RefreshCw, Eye } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FeasibilityEntry {
  id: number;
  name: string;
  mobile: string;
  email: string;
  company_name: string;
  current_turn_over: string;
  current_pat: string;
  industry: string;
  business_type: string;
  networth: string;
  profit: string;
  vintage: string;
  eligibility: string;
  created_at: string;
}

export default function IPOFeasibilityClient() {
  const [entries, setEntries] = useState<FeasibilityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState<FeasibilityEntry | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const getHeaders = (json = true) => {
    const h: Record<string, string> = {};
    if (json) h["Content-Type"] = "application/json";
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) h["Authorization"] = `Bearer ${token}`;
    }
    return h;
  };

  const fetchEntries = async (p = page, s = search) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/ipo_feasibility?page=${p}&limit=10&search=${encodeURIComponent(s)}`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const result = await res.json();
        setEntries(result.data || []);
        setTotalPages(result.totalPages || 1);
        setTotalCount(result.total || 0);
        setPage(result.page || 1);
      }
    } catch (err) {
      toast.error("Failed to load entries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEntries(1, search);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      const res = await fetch(`/api/ipo_feasibility/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (res.ok) {
        toast.success("Entry deleted");
        fetchEntries(page, search);
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch(`/api/ipo_feasibility?limit=1000&search=${encodeURIComponent(search)}`, {
        headers: getHeaders()
      });
      const result = await res.json();
      const allData = result.data || [];

      const BOM = "\uFEFF";
      const headers = "ID,Name,Email,Mobile,Company,Turnover,PAT,Industry,Biz Type,Networth,Profit,Vintage,Date\n";
      const csv = allData.map((e: any) =>
        `"${e.id}","${e.name}","${e.email}","${e.mobile}","${e.company_name || ""}","${e.current_turn_over || ""}","${e.current_pat || ""}","${e.industry || ""}","${e.business_type || ""}","${e.networth || ""}","${e.profit || ""}","${e.vintage || ""}","${new Date(e.created_at).toLocaleString("en-IN")}"`
      ).join("\n");

      const blob = new Blob([BOM + headers + csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ipo-feasibility-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Export successful!");
    } catch (err) {
      toast.error("Export failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">IPO Eligibility Enquiries</h1>
          <p className="text-sm text-muted-foreground">{totalCount} submissions found · Review eligibility queries</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => fetchEntries(page, search)} disabled={loading} className="rounded-xl h-10 text-foreground">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button size="sm" onClick={handleExport} className="rounded-xl h-10 bg-accent text-accent-foreground hover:bg-accent/90">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, company..."
          className="pl-10 h-11 rounded-xl bg-card border-border shadow-sm text-foreground"
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground bg-card/30 rounded-2xl border border-dashed border-border">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-accent" />
          <p>Loading Eligibility submissions...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed rounded-2xl bg-card">
          <Landmark className="h-10 w-10 mx-auto mb-3 opacity-20 text-primary" />
          <p>No Eligibility enquiries match your current search.</p>
        </div>
      ) : (
        <>
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="py-4 px-6 text-muted-foreground uppercase tracking-widest text-[9px] font-bold">Contact Info</th>
                    <th className="py-4 px-6 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Business Details</th>
                    <th className="py-4 px-6 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Eligibility Stats</th>
                    <th className="py-4 px-6 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Status</th>
                    <th className="py-4 px-6 font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Date</th>
                    <th className="py-4 px-6 font-bold text-muted-foreground uppercase tracking-widest text-[9px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {entries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="hover:bg-muted/30 transition-all group cursor-pointer"
                      onClick={() => { setSelectedEntry(entry); setDetailsOpen(true); }}
                    >
                      <td className="py-5 px-6 align-top">
                        <div className="font-bold text-foreground mb-1">{entry.name}</div>
                        <div className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1.5 truncate"><Mail className="w-3 h-3" /> {entry.email}</span>
                          <span className="flex items-center gap-1.5 font-bold"><Phone className="w-3 h-3 text-accent" /> {entry.mobile}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6 align-top">
                        <div className="font-bold text-foreground mb-1">{entry.company_name}</div>
                        <div className="text-[11px] text-muted-foreground opacity-70 mb-2">Vintage: {entry.vintage || "N/A"}</div>
                        <Badge variant="secondary" className="bg-accent/10 text-accent border-none rounded-lg text-[9px] font-bold px-2 py-0.5 uppercase tracking-tighter">
                          {entry.business_type || "N/A"}
                        </Badge>
                      </td>
                      <td className="py-5 px-6 align-top">
                        <div className="space-y-1.5">
                          <div className="text-[11px]"><span className="text-muted-foreground font-semibold uppercase text-[9px] mr-2">EBITDA:</span> <span className="font-bold">{entry.profit}</span></div>
                          <div className="text-[11px]"><span className="text-muted-foreground font-semibold uppercase text-[9px] mr-2">Networth:</span> <span className="font-bold">{entry.networth}</span></div>
                        </div>
                      </td>
                      <td className="py-5 px-6 align-top">
                        {entry.eligibility === "Eligible" ? (
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 rounded-lg text-[9px] font-bold px-2 py-0.5 uppercase tracking-tighter">
                            Eligible
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 border-red-200 rounded-lg text-[9px] font-bold px-2 py-0.5 uppercase tracking-tighter">
                            Not Eligible
                          </Badge>
                        )}
                      </td>
                      <td className="py-5 px-6 align-top whitespace-nowrap text-muted-foreground font-medium">
                        {new Date(entry.created_at).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-5 px-6 align-top text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-accent hover:bg-accent/10"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              setSelectedEntry(entry);
                              setDetailsOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-destructive hover:bg-destructive/10"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              handleDelete(entry.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="md:hidden grid grid-cols-1 gap-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4 cursor-pointer hover:bg-muted/10 transition-colors text-foreground"
                onClick={() => { setSelectedEntry(entry); setDetailsOpen(true); }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{entry.name}</h3>
                    <p className="text-[11px] text-muted-foreground font-medium">{new Date(entry.created_at).toLocaleString()}</p>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-none rounded-lg text-[9px] font-bold text-foreground">Eligibility</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs bg-muted/20 p-4 rounded-xl border">
                  <div>
                    <span className="block text-[9px] text-muted-foreground font-bold uppercase mb-0.5">Company</span>
                    <span className="font-bold block truncate">{entry.company_name}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-muted-foreground font-bold uppercase mb-0.5">Eligibility</span>
                    <span className="font-bold block text-accent uppercase">{entry.eligibility}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-accent underline font-bold px-0"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setSelectedEntry(entry);
                      setDetailsOpen(true);
                    }}
                  >
                    View Report
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      handleDelete(entry.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 bg-card p-4 rounded-2xl border border-border shadow-sm">
              <div className="text-xs text-muted-foreground font-bold">
                PAGE {page} OF {totalPages} <span className="mx-2 opacity-30">|</span> {totalCount} TOTAL
              </div>
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="sm" disabled={page === 1} className="rounded-xl h-9 text-foreground" onClick={() => { fetchEntries(page - 1); }}>Previous</Button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={page === i + 1 ? "secondary" : "ghost"}
                      className={`h-9 w-9 rounded-xl text-xs font-bold text-foreground ${page === i + 1 ? 'bg-accent text-accent-foreground shadow-sm' : ''}`}
                      onClick={() => { fetchEntries(i + 1); }}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button variant="outline" size="sm" disabled={page === totalPages} className="rounded-xl h-9 text-foreground" onClick={() => { fetchEntries(page + 1); }}>Next</Button>
              </div>
            </div>
          )}
        </>
      )}

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[750px] rounded-3xl p-0 overflow-hidden border border-border/50 shadow-2xl bg-card text-foreground [&>button]:text-white [&>button]:z-50 [&>button]:opacity-80 [&>button]:hover:opacity-100 [&>button]:transition-all">
          {selectedEntry && (
            <div className="flex flex-col">
              {/* Header with Dark Navy Gradient */}
              <div className="gradient-navy p-8 text-white relative overflow-hidden">
                {/* Background decorative glows */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 blur-xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                    <Landmark className="h-6 w-6 text-white" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[9px] font-bold bg-white/15 text-white/90 border border-white/10 uppercase tracking-wider">
                        Assessment Report
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                        selectedEntry.eligibility === "Eligible"
                          ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/35"
                          : "bg-rose-500/25 text-rose-300 border border-rose-500/35"
                      }`}>
                        {selectedEntry.eligibility}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white leading-tight mt-1">{selectedEntry.company_name}</h2>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-8 space-y-8 bg-card max-h-[60vh] overflow-y-auto custom-scrollbar">
                {/* Two Column Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Contact Info */}
                  <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border/80 pb-2 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Contact Person
                    </h4>
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent">
                          {selectedEntry.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-foreground">{selectedEntry.name}</div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Representative</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 pt-2 border-t border-border/30">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500">
                            <Mail className="h-3.5 w-3.5" />
                          </div>
                          <span className="truncate">{selectedEntry.email}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-accent">
                            <Phone className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-medium">{selectedEntry.mobile}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Business Profile */}
                  <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border/80 pb-2 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Business Profile
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <span className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1.5">Company Structure</span>
                        <span className="inline-flex font-bold uppercase text-[10px] bg-accent/10 text-accent border border-accent/10 px-2.5 py-1 rounded-lg">
                          {selectedEntry.business_type || "N/A"}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/30">
                        <div>
                          <span className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Industry Sector</span>
                          <span className="font-semibold text-foreground text-sm block truncate">{selectedEntry.industry || "N/A"}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Company Vintage</span>
                          <span className="font-semibold text-foreground text-sm block">{selectedEntry.vintage || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Eligibility Statistics Grid */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border/80 pb-2 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Financial Eligibility Assessment
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Turnover Card */}
                    <div className="bg-card p-4 rounded-2xl border border-border/80 shadow-sm flex flex-col justify-between h-24 hover:border-accent/30 transition-colors">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Annual Turnover</span>
                      <span className="text-base font-extrabold text-foreground tracking-tight">{selectedEntry.current_turn_over || "N/A"}</span>
                    </div>
                    
                    {/* Profit Card */}
                    <div className="bg-card p-4 rounded-2xl border border-border/80 shadow-sm flex flex-col justify-between h-24 hover:border-accent/30 transition-colors">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Operating Profit</span>
                      <span className="text-base font-extrabold text-foreground tracking-tight">{selectedEntry.profit || "N/A"}</span>
                    </div>
                    
                    {/* Networth Card */}
                    <div className="bg-card p-4 rounded-2xl border border-border/80 shadow-sm flex flex-col justify-between h-24 hover:border-accent/30 transition-colors">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Net Worth</span>
                      <span className="text-base font-extrabold text-foreground tracking-tight">{selectedEntry.networth || "N/A"}</span>
                    </div>
                    
                    {/* Status Card */}
                    <div className={`p-4 rounded-2xl border shadow-sm flex flex-col justify-between h-24 ${
                      selectedEntry.eligibility === "Eligible"
                        ? "bg-emerald-50/50 border-emerald-200/60 dark:bg-emerald-950/20 dark:border-emerald-800/30"
                        : "bg-rose-50/50 border-rose-200/60 dark:bg-rose-950/20 dark:border-rose-800/30"
                    }`}>
                      <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                        selectedEntry.eligibility === "Eligible" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                      }`}>
                        Status
                      </span>
                      <span className={`text-base font-extrabold tracking-tight uppercase ${
                        selectedEntry.eligibility === "Eligible" ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"
                      }`}>
                        {selectedEntry.eligibility}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-muted/30 border-t border-border/50 flex justify-end gap-3 rounded-b-3xl">
                <Button 
                  variant="outline" 
                  className="rounded-xl px-5 h-11 font-semibold text-sm border-border hover:bg-muted/80 text-foreground transition-all duration-200 cursor-pointer"
                  onClick={() => setDetailsOpen(false)}
                >
                  Close Window
                </Button>
                <Button
                  variant="destructive"
                  className="rounded-xl px-5 h-11 font-semibold text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-rose-600/20 transition-all duration-200 flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this record?")) {
                      handleDelete(selectedEntry.id);
                      setDetailsOpen(false);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Record
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
