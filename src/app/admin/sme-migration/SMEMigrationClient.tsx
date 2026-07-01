"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  UploadCloud,
  Trash2,
  Search,
  Loader2,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  AlertCircle,
  TrendingUp,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { API_URL } from "@/lib/constants";

interface SMEMigrationRecord {
  id: number;
  exchange_type: string;
  sno: string;
  company_name: string;
  ipo_date: string;
  exchanges: string;
  merchant_banker: string;
  ipo_size: string;
  migration_date: string;
  issue_price: string;
  created_at: string;
}

const getPageNumbers = (totalPages: number, currentPage: number) => {
  const pages: (number | string)[] = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 2) {
      end = 4;
    } else if (currentPage >= totalPages - 1) {
      start = totalPages - 3;
    }

    if (start > 2) {
      pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);
  }

  return pages;
};

export default function SMEMigrationClient() {
  const queryClient = useQueryClient();
  const [selectedExchange, setSelectedExchange] = useState<"NSE" | "BSE">("NSE");
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Search & Pagination states
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(15);

  const getHeaders = (isJson = true) => {
    const h: Record<string, string> = {};
    if (isJson) h["Content-Type"] = "application/json";
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) h["Authorization"] = `Bearer ${token}`;
    }
    return h;
  };

  const { data: rawRecords = [], isLoading: loading } = useQuery<SMEMigrationRecord[]>({
    queryKey: ["sme-migrations", selectedExchange],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/api/sme-migrations?exchange=${selectedExchange}&limit=100000`,
        { headers: getHeaders() }
      );
      if (!res.ok) throw new Error("Failed to load records");
      const body = await res.json();
      return body.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Client-side search filtering
  const filteredRecords = rawRecords.filter((r) => {
    const searchTerm = search.toLowerCase();
    return (
      r.company_name?.toLowerCase().includes(searchTerm) ||
      r.merchant_banker?.toLowerCase().includes(searchTerm) ||
      r.exchanges?.toLowerCase().includes(searchTerm)
    );
  });

  const total = filteredRecords.length;
  const paginatedRecords = filteredRecords.slice((page - 1) * limit, page * limit);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const extension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (!["xlsx", "xls", "csv"].includes(extension || "")) {
        toast.error("Only Excel (.xlsx, .xls) and CSV (.csv) files are supported");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("exchange", selectedExchange);
    formData.append("file", file);

    const toastId = toast.loading(`Uploading and parsing ${selectedExchange} migration list...`);

    try {
      const res = await fetch(`${API_URL}/api/sme-migrations/upload`, {
        method: "POST",
        headers: getHeaders(false), // Need browser to set boundary for multipart
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "File uploaded and parsed successfully!", { id: toastId });
        setFile(null);
        setPage(1);
        queryClient.invalidateQueries({ queryKey: ["sme-migrations", selectedExchange] });
      } else {
        toast.error(data.error || "Failed to process the spreadsheet", { id: toastId });
      }
    } catch (err) {
      toast.error("An error occurred during file upload", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm(`Are you sure you want to delete ALL records for SME ${selectedExchange} Migration List? This action cannot be undone.`)) {
      return;
    }

    const toastId = toast.loading(`Deleting ${selectedExchange} records...`);
    try {
      const res = await fetch(`${API_URL}/api/sme-migrations?exchange=${selectedExchange}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (res.ok) {
        toast.success(`Cleared all ${selectedExchange} records.`, { id: toastId });
        setPage(1);
        queryClient.invalidateQueries({ queryKey: ["sme-migrations", selectedExchange] });
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Failed to clear records", { id: toastId });
      }
    } catch (err) {
      toast.error("Network error clearing records", { id: toastId });
    }
  };

  const formatClientDate = (val: string) => {
    if (!val) return "-";
    const strVal = String(val).trim();
    if (strVal.includes("GMT") || strVal.includes("Standard Time")) {
      const d = new Date(strVal);
      if (!isNaN(d.getTime())) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const day = String(d.getDate()).padStart(2, '0');
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
      }
    }
    return strVal;
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          SME to Mainboard Migration Lists

        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload and manage lists of SME companies that migrated to Mainboard for NSE Emerge and BSE SME.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => { setSelectedExchange("NSE"); setPage(1); setSearch(""); }}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ${selectedExchange === "NSE"
            ? "border-primary text-[#2557C5] font-bold bg-[#2557C5]/5"
            : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
        >
          NSE Emerge Migration List
        </button>
        <button
          onClick={() => { setSelectedExchange("BSE"); setPage(1); setSearch(""); }}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ${selectedExchange === "BSE"
            ? "border-primary text-[#2557C5] font-bold bg-[#2557C5]/5"
            : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
        >
          BSE SME Migration List
        </button>
      </div>

      {/* Grid: Upload Widget & Info Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Panel */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm lg:col-span-2">
          <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <UploadCloud className="h-4 w-4 text-primary" />
            Upload New {selectedExchange} Migration Spreadsheet
          </h2>


          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-border hover:border-[#2557C5]/40 rounded-xl p-6 text-center transition-all bg-secondary/5 relative group">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".xlsx,.xls,.csv"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                <FileSpreadsheet className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
                {file ? (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-primary truncate max-w-md">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-foreground">Drag & drop your file here, or click to browse</p>
                    <p className="text-xs text-muted-foreground mt-1">Supports XLSX, XLS, and CSV formats</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {file && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  Clear Selection
                </Button>
              )}
              <div className="flex gap-3 ml-auto">
                <Button
                  type="submit"
                  disabled={!file || uploading}
                  className="bg-[#2557C5] text-white font-semibold px-6 shadow-sm hover:scale-[1.02] transition-transform"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Upload and Import"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>



      </div>

      {/* Main Table Records Area */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col space-y-4 pt-4">
        <div className="px-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Current SME {selectedExchange} Migrated List
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">{total} Companies</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by company, banker..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-8 bg-background shadow-sm text-foreground text-sm"
              />
            </div>
            {rawRecords.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteAll}
                className="text-destructive border-destructive/20 hover:bg-destructive hover:text-white transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Clear List
              </Button>
            )}
          </div>
        </div>

        {/* Table container */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/35 text-muted-foreground">
                <th className="py-3 px-5 text-left font-semibold text-foreground w-16">S.No</th>
                <th className="py-3 px-5 text-left font-semibold text-foreground min-w-[200px]">Company Name</th>
                <th className="py-3 px-5 text-left font-semibold text-foreground">IPO Date</th>
                <th className="py-3 px-5 text-left font-semibold text-foreground">Exchange</th>
                <th className="py-3 px-5 text-left font-semibold text-foreground">Merchant Banker</th>
                <th className="py-3 px-5 text-left font-semibold text-foreground">Size (Cr)</th>
                <th className="py-3 px-5 text-left font-semibold text-foreground">Migration Date</th>
                <th className="py-3 px-5 text-left font-semibold text-foreground">Issue Price (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      <p className="mt-3 text-muted-foreground text-sm">Loading records...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <AlertCircle className="w-10 h-10 opacity-20 text-primary" />
                      <p className="text-base font-semibold text-foreground">No records found</p>
                      <p className="text-xs">Upload a spreadsheet above to seed the list for SME {selectedExchange}.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-secondary/15 transition-colors">
                    <td className="py-3 px-5 font-mono text-xs">{r.sno || (page - 1) * limit + idx + 1}</td>
                    <td className="py-3 px-5 font-bold">{r.company_name}</td>
                    <td className="py-3 px-5 text-muted-foreground text-xs">{formatClientDate(r.ipo_date)}</td>
                    <td className="py-3 px-5 text-xs">
                      <span className="bg-[#2557C5]/5 text-[#2557C5] border border-[#2557C5]/10 rounded px-1.5 py-0.5 font-medium">
                        {r.exchanges || selectedExchange}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-muted-foreground">{r.merchant_banker || "-"}</td>
                    <td className="py-3 px-5 font-semibold text-amber-600">{r.ipo_size || "-"}</td>
                    <td className="py-3 px-5 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {formatClientDate(r.migration_date)}
                      </div>
                    </td>
                    <td className="py-3 px-5 font-mono text-xs font-semibold">{r.issue_price || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 0 && (
          <div className="p-4 border-t border-border bg-gradient-to-r from-secondary/5 via-secondary/10 to-transparent flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground font-medium">
              Showing <span className="font-bold text-foreground">{(page - 1) * limit + 1}-{Math.min(page * limit, total)}</span> of <span className="font-bold text-foreground">{total}</span> records
            </p>

            <div className="flex items-center gap-1.5 bg-background p-1.5 rounded-lg border border-border shadow-xs">
              <Button
                variant="ghost"
                size="icon"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="h-8 w-8 text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {getPageNumbers(totalPages, page).map((p, index) => {
                if (p === "...") {
                  return (
                    <span key={`dots-${index}`} className="px-2.5 text-xs text-muted-foreground">
                      ...
                    </span>
                  );
                }
                return (
                  <Button
                    key={`page-${p}`}
                    variant={page === p ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setPage(Number(p))}
                    className={`h-8 w-8 text-xs font-semibold ${page === p ? "bg-primary text-primary-foreground font-bold" : "text-foreground"
                      }`}
                  >
                    {p}
                  </Button>
                );
              })}

              <Button
                variant="ghost"
                size="icon"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="h-8 w-8 text-foreground"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
