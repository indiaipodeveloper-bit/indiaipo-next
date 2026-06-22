"use client";

import { useState, useEffect } from "react";
import { sectorApi, sectorIpoApi, adminBlogApi } from "@/services/api";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface SectorIpo {
  id: string;
  name: string;
  type: "SME" | "MAINLINE";
  ipo_year: string;
  iposize: string;
  sector_id: string;
  sector_name?: string;
  pe_ratio: string;
  admin_blog_id: string;
  blog_title?: string;
  status: "Active" | "Inactive";
}

const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function SectorIposContent() {
  const queryClient = useQueryClient();
  const [sectors, setSectors] = useState<any[]>([]);
  const [ipoSearch, setIpoSearch] = useState("");
  const [debouncedIpoSearch, setDebouncedIpoSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isIpoModalOpen, setIsIpoModalOpen] = useState(false);
  const [editingIpo, setEditingIpo] = useState<SectorIpo | null>(null);
  const [ipoFormData, setIpoFormData] = useState({
    name: "",
    type: "SME",
    ipo_year: "",
    iposize: "",
    sector_id: "",
    pe_ratio: "",
    admin_blog_id: "",
    status: "Active"
  });
  const [ipoSubmitting, setIpoSubmitting] = useState(false);

  const fetchSectors = () => {
    sectorApi.getAdminAll()
      .then((res: any) => {
        if (Array.isArray(res)) {
          setSectors(res);
          if (res.length > 0 && !ipoFormData.sector_id) {
            setIpoFormData(prev => ({ ...prev, sector_id: String(res[0].id) }));
          }
        } else if (res && Array.isArray(res.sectors)) {
          setSectors(res.sectors);
          if (res.sectors.length > 0 && !ipoFormData.sector_id) {
            setIpoFormData(prev => ({ ...prev, sector_id: String(res.sectors[0].id) }));
          }
        }
      })
      .catch((e) => toast.error("Failed to fetch sectors"));
  };

  const fetchBlogs = () => {
    adminBlogApi.getSummaryList()
      .then((data) => {
        setBlogs(data.data || []);
      })
      .catch((e) => console.error("Failed to fetch blogs", e));
  };

  // Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedIpoSearch(ipoSearch);
    }, 450);
    return () => clearTimeout(handler);
  }, [ipoSearch]);

  // Fetch paginated/filtered sector-wise IPOs
  const { data: ipoData, isLoading: ipoLoading, isError: ipoError } = useQuery({
    queryKey: ["adminSectorIpos", currentPage, debouncedIpoSearch],
    queryFn: () => sectorIpoApi.getAll({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedIpoSearch
    }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    fetchSectors();
    fetchBlogs();
  }, []);

  const handleOpenIpoModal = (ipo?: SectorIpo) => {
    if (ipo) {
      setEditingIpo(ipo);
      let formattedDate = "";
      if (ipo.ipo_year && !isNaN(new Date(ipo.ipo_year).getTime())) {
        formattedDate = new Date(ipo.ipo_year).toISOString().split('T')[0];
      }
      setIpoFormData({
        name: ipo.name || "",
        type: ipo.type || "SME",
        ipo_year: formattedDate,
        iposize: ipo.iposize || "",
        sector_id: ipo.sector_id ? String(ipo.sector_id) : "",
        pe_ratio: ipo.pe_ratio || "",
        admin_blog_id: ipo.admin_blog_id ? String(ipo.admin_blog_id) : "",
        status: ipo.status || "Active"
      });
    } else {
      setEditingIpo(null);
      setIpoFormData({
        name: "",
        type: "SME",
        ipo_year: "",
        iposize: "",
        sector_id: sectors.length > 0 ? String(sectors[0].id) : "",
        pe_ratio: "",
        admin_blog_id: "",
        status: "Active"
      });
    }
    setIsIpoModalOpen(true);
  };

  const handleIpoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipoFormData.name) return toast.error("Company name is required");
    
    setIpoSubmitting(true);
    try {
      if (editingIpo) {
        await sectorIpoApi.update(editingIpo.id, ipoFormData);
        toast.success("Sector IPO updated successfully");
      } else {
        await sectorIpoApi.create(ipoFormData);
        toast.success("Sector IPO created successfully");
      }
      setIsIpoModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["adminSectorIpos"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to save Sector IPO");
    } finally {
      setIpoSubmitting(false);
    }
  };

  const handleIpoDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this sector IPO record?")) return;
    
    try {
      await sectorIpoApi.delete(id);
      toast.success("Sector IPO deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["adminSectorIpos"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete Sector IPO");
    }
  };

  const handleIpoToggleStatus = async (ipo: SectorIpo) => {
    try {
      const newStatus = ipo.status === "Active" ? "Inactive" : "Active";
      await sectorIpoApi.update(ipo.id, {
        name: ipo.name,
        type: ipo.type,
        ipo_year: (ipo.ipo_year && !isNaN(new Date(ipo.ipo_year).getTime())) ? new Date(ipo.ipo_year).toISOString().split('T')[0] : "",
        iposize: ipo.iposize,
        sector_id: ipo.sector_id,
        pe_ratio: ipo.pe_ratio,
        admin_blog_id: ipo.admin_blog_id,
        status: newStatus
      });
      toast.success(`Status updated to ${newStatus}`);
      queryClient.invalidateQueries({ queryKey: ["adminSectorIpos"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle status");
    }
  };

  const displayedIpos: SectorIpo[] = ipoData?.sectorIpos || [];
  const totalIpoEntries = ipoData?.total || 0;
  const totalPages = ipoData?.totalPages || 1;
  const activePage = Math.min(currentPage, totalPages);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">List IPO By Sectors</h1>
          <p className="text-sm text-muted-foreground font-light mt-1">Add, edit and manage individual IPO entries classified under specific sectors</p>
        </div>
        <Button onClick={() => handleOpenIpoModal()} className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md transition-all duration-200">
          <Plus className="w-4 h-4 mr-2" /> Add IPO By Sectors
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-4 shadow-sm">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by company name..."
            value={ipoSearch}
            onChange={(e) => {
              setIpoSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 bg-muted/20 border-border"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>IPO Date</TableHead>
              <TableHead>IPO Size (Cr.)</TableHead>
              <TableHead>P/E Ratio</TableHead>
              <TableHead>Linked Blog</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right w-28">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ipoLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="h-48 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary opacity-20" />
                </TableCell>
              </TableRow>
            ) : ipoError ? (
              <TableRow>
                <TableCell colSpan={10} className="h-48 text-center text-destructive font-semibold">
                  Failed to load sector IPO records. Please try again.
                </TableCell>
              </TableRow>
            ) : displayedIpos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-48 text-center text-muted-foreground">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              displayedIpos.map((ipo, idx) => (
                <TableRow key={ipo.id} className="hover:bg-muted/30">
                  <TableCell className="text-center font-medium text-muted-foreground">{(activePage - 1) * itemsPerPage + idx + 1}</TableCell>
                  <TableCell className="font-semibold text-foreground">{ipo.name}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        ipo.type === "SME" 
                          ? "border-purple-200 text-purple-700 bg-purple-50 font-medium px-2.5 py-0.5" 
                          : "border-blue-200 text-blue-700 bg-blue-50 font-medium px-2.5 py-0.5"
                      }
                    >
                      {ipo.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-muted-foreground">{ipo.sector_name || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {ipo.ipo_year ? new Date(ipo.ipo_year).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "—"}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">{ipo.iposize ? `${ipo.iposize} Cr` : "—"}</TableCell>
                  <TableCell className="text-foreground">{ipo.pe_ratio || "—"}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground" title={ipo.blog_title || ""}>
                    {ipo.blog_title || <span className="text-xs italic text-muted-foreground opacity-50">Not Linked</span>}
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() => handleIpoToggleStatus(ipo)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${
                        ipo.status === "Active" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" 
                          : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                      }`}
                      title={`Click to change status to ${ipo.status === "Active" ? "Inactive" : "Active"}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${ipo.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`} />
                      {ipo.status}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleOpenIpoModal(ipo)} 
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                        title="Edit Sector IPO Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleIpoDelete(ipo.id)} 
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        title="Delete Sector IPO Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (() => {
          const delta = 1;
          const range: (number | "...")[] = [];
          const rangeSet = new Set<number>();

          [1, totalPages, ...Array.from({ length: delta * 2 + 1 }, (_, i) => activePage - delta + i)]
            .filter(p => p >= 1 && p <= totalPages)
            .sort((a, b) => a - b)
            .forEach(p => rangeSet.add(p));

          const sorted = Array.from(rangeSet).sort((a, b) => a - b);
          sorted.forEach((p, i) => {
            if (i > 0 && p - sorted[i - 1] > 1) range.push("...");
            range.push(p);
          });

          return (
            <div className="px-4 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between bg-muted/20 gap-4">
              <p className="text-xs text-muted-foreground font-semibold">
                Showing {(activePage - 1) * itemsPerPage + 1} to {Math.min(activePage * itemsPerPage, totalIpoEntries)} of {totalIpoEntries} IPO Entries
              </p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={activePage === 1}
                  className="flex items-center justify-center gap-1 px-3 h-9 rounded-lg font-bold text-xs bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>

                <div className="flex items-center gap-1">
                  {range.map((p, idx) =>
                    p === "..." ? (
                      <span key={`el-${idx}`} className="px-2 text-muted-foreground text-xs font-bold">...</span>
                    ) : (
                      <button 
                        key={p} 
                        onClick={() => setCurrentPage(p as number)}
                        className="w-8 h-8 rounded-lg text-xs font-bold transition-all"
                        style={activePage === p
                          ? { background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }
                          : { background: "transparent", color: "hsl(var(--foreground))", border: "1px solid var(--border)" }}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>

                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={activePage >= totalPages}
                  className="flex items-center justify-center gap-1 px-3 h-9 rounded-lg font-bold text-xs bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      <Dialog open={isIpoModalOpen} onOpenChange={setIsIpoModalOpen}>
        <DialogContent 
          className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto border-none shadow-2xl p-6"
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary border-b pb-2">
              {editingIpo ? "Edit Sector IPO Details" : "Add Sector IPO Details"}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">Enter the details for the company's IPO list classified under its industry sector.</p>
          </DialogHeader>
          <form onSubmit={handleIpoSubmit} className="space-y-6 py-4">
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-blue-600 border-b pb-1">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company Name</label>
                  <Input 
                    placeholder="e.g. Bio Medica Laboratories Ltd." 
                    value={ipoFormData.name}
                    onChange={(e) => setIpoFormData({...ipoFormData, name: e.target.value})}
                    required
                    className="h-10 border-muted focus:ring-primary text-foreground"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                    value={ipoFormData.type}
                    onChange={(e) => setIpoFormData({...ipoFormData, type: e.target.value as any})}
                    required
                  >
                    <option value="SME">SME</option>
                    <option value="MAINLINE">MAINLINE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">IPO Date</label>
                  <Input 
                    type="date"
                    value={ipoFormData.ipo_year}
                    onChange={(e) => setIpoFormData({...ipoFormData, ipo_year: e.target.value})}
                    className="h-10 border-muted focus:ring-primary text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">IPO Size (Cr.)</label>
                  <Input 
                    type="number"
                    step="any"
                    min="0"
                    placeholder="e.g. 28.09"
                    value={ipoFormData.iposize}
                    onChange={(e) => setIpoFormData({...ipoFormData, iposize: e.target.value})}
                    className="h-10 border-muted focus:ring-primary text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">P/E Ratio</label>
                  <Input 
                    type="number"
                    step="any"
                    min="0"
                    placeholder="e.g. 17.34"
                    value={ipoFormData.pe_ratio}
                    onChange={(e) => setIpoFormData({...ipoFormData, pe_ratio: e.target.value})}
                    className="h-10 border-muted focus:ring-primary text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sector</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                    value={ipoFormData.sector_id}
                    onChange={(e) => setIpoFormData({...ipoFormData, sector_id: e.target.value})}
                  >
                    <option value="">Select Sector</option>
                    {sectors.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Linked Blog</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                    value={ipoFormData.admin_blog_id}
                    onChange={(e) => setIpoFormData({...ipoFormData, admin_blog_id: e.target.value})}
                  >
                    <option value="">No Linked Blog</option>
                    {blogs.map((b) => (
                      <option key={b.id} value={b.id}>{b.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                    value={ipoFormData.status}
                    onChange={(e) => setIpoFormData({...ipoFormData, status: e.target.value as any})}
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

            </div>

            <DialogFooter className="border-t pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsIpoModalOpen(false)} className="text-foreground">Cancel</Button>
              <Button type="submit" disabled={ipoSubmitting} className="min-w-[120px]">
                {ipoSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : editingIpo ? "Update IPO" : "Save IPO"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function SectorIposClient() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <SectorIposContent />
    </QueryClientProvider>
  );
}
