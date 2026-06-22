"use client";

import { useState, useEffect } from "react";
import { sectorApi } from "@/services/api";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  CheckCircle2,
  XCircle,
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

interface Sector {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  mainline_count: number;
  sme_count: number;
  total_count: number;
  pe_heigest: string;
  pe_median: string;
  pe_lowest: string;
  ipo_size_heigest: string;
  ipo_size_median: string;
  ipo_size_lowest: string;
  mainline_pe_heigest: string;
  mainline_pe_median: string;
  mainline_pe_lowest: string;
  mainline_ipo_size_heigest: string;
  mainline_ipo_size_median: string;
  mainline_ipo_size_lowest: string;
}

const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function SectorsContent() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active",
    pe_heigest: "",
    pe_median: "",
    pe_lowest: "",
    ipo_size_heigest: "",
    ipo_size_median: "",
    ipo_size_lowest: "",
    mainline_pe_heigest: "",
    mainline_pe_median: "",
    mainline_pe_lowest: "",
    mainline_ipo_size_heigest: "",
    mainline_ipo_size_median: "",
    mainline_ipo_size_lowest: ""
  });
  const [submitting, setSubmitting] = useState(false);

  // Debounce the search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 450);
    return () => clearTimeout(handler);
  }, [search]);

  // TanStack Query to fetch sectors
  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminSectors", currentPage, debouncedSearch],
    queryFn: () => sectorApi.getAdminAll({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch
    }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const sectors: Sector[] = data?.sectors || [];
  const totalSectors = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const activePage = Math.min(currentPage, totalPages);

  const cleanNumberString = (val: any) => {
    if (val === undefined || val === null) return "";
    return String(val).replace(/,/g, "").trim();
  };

  const handleOpenModal = (sector?: Sector) => {
    if (sector) {
      setEditingSector(sector);
      setFormData({
        name: sector.name,
        description: sector.description || "",
        status: sector.status,
        pe_heigest: cleanNumberString(sector.pe_heigest),
        pe_median: cleanNumberString(sector.pe_median),
        pe_lowest: cleanNumberString(sector.pe_lowest),
        ipo_size_heigest: cleanNumberString(sector.ipo_size_heigest),
        ipo_size_median: cleanNumberString(sector.ipo_size_median),
        ipo_size_lowest: cleanNumberString(sector.ipo_size_lowest),
        mainline_pe_heigest: cleanNumberString(sector.mainline_pe_heigest),
        mainline_pe_median: cleanNumberString(sector.mainline_pe_median),
        mainline_pe_lowest: cleanNumberString(sector.mainline_pe_lowest),
        mainline_ipo_size_heigest: cleanNumberString(sector.mainline_ipo_size_heigest),
        mainline_ipo_size_median: cleanNumberString(sector.mainline_ipo_size_median),
        mainline_ipo_size_lowest: cleanNumberString(sector.mainline_ipo_size_lowest)
      });
    } else {
      setEditingSector(null);
      setFormData({
        name: "",
        description: "",
        status: "Active",
        pe_heigest: "",
        pe_median: "",
        pe_lowest: "",
        ipo_size_heigest: "",
        ipo_size_median: "",
        ipo_size_lowest: "",
        mainline_pe_heigest: "",
        mainline_pe_median: "",
        mainline_pe_lowest: "",
        mainline_ipo_size_heigest: "",
        mainline_ipo_size_median: "",
        mainline_ipo_size_lowest: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return toast.error("Sector name is required");
    
    setSubmitting(true);
    try {
      if (editingSector) {
        await sectorApi.update(editingSector.id, formData);
        toast.success("Sector updated successfully");
      } else {
        await sectorApi.create(formData);
        toast.success("Sector created successfully");
      }
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["adminSectors"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to save sector");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this sector?")) return;
    
    try {
      await sectorApi.delete(id);
      toast.success("Sector deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["adminSectors"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete sector");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Sectors</h1>
          <p className="text-sm text-muted-foreground">Add and manage industry sectors for IPO classification</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> Add New Sector
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search sectors..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Sector Name</TableHead>
              <TableHead>IPOs (Mainline/SME)</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary opacity-20" />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-destructive font-semibold">
                  Failed to load sectors. Please try again.
                </TableCell>
              </TableRow>
            ) : sectors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                  No sectors found
                </TableCell>
              </TableRow>
            ) : (
              sectors.map((sector) => (
                <TableRow key={sector.id} className="hover:bg-muted/30">
                  <TableCell className="font-semibold text-foreground">{sector.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] py-0 px-1 border-blue-200 text-blue-700 bg-blue-50">
                          Mainline: {sector.mainline_count || 0}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] py-0 px-1 border-purple-200 text-purple-700 bg-purple-50">
                          SME: {sector.sme_count || 0}
                        </Badge>
                      </div>
                      <span className="text-[10px] text-muted-foreground">Total: {sector.total_count || 0} IPOs</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate opacity-70 text-foreground">
                    {sector.description || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={sector.status === "Active" ? "secondary" : "outline"} className={`flex w-fit items-center gap-1 ${sector.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}`}>
                      {sector.status === "Active" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {sector.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleOpenModal(sector)} 
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                        title="Edit Sector Metrics"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(sector.id)} 
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        title="Delete Sector"
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

          [1, totalPages, ...Array.from({ length: delta * 2 + 1 }, (_, i) => currentPage - delta + i)]
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
                Showing {(activePage - 1) * itemsPerPage + 1} to {Math.min(activePage * itemsPerPage, totalSectors)} of {totalSectors} Sectors
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent 
          className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto"
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary border-b pb-2">
              {editingSector ? "Edit Sector Information" : "Add New Sector"}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">Modify the details for the industry sector and its performance metrics.</p>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-sm font-semibold text-blue-600 border-b pb-1">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sector Name <span className="text-red-500 ml-0.5">*</span></label>
                    <Input 
                      placeholder="e.g. Technology, Infrastructure" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="h-10 border-muted focus:ring-primary text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-purple-600 border-b pb-1">SME P/E Metrics</h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">P/E Highest</label>
                    <Input type="number" step="any" min="0" placeholder="Enter P/E Highest" value={formData.pe_heigest} onChange={(e) => setFormData({...formData, pe_heigest: e.target.value})} className="text-foreground" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">P/E Median</label>
                    <Input type="number" step="any" min="0" placeholder="Enter P/E Median" value={formData.pe_median} onChange={(e) => setFormData({...formData, pe_median: e.target.value})} className="text-foreground" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">P/E Lowest</label>
                    <Input type="number" step="any" min="0" placeholder="Enter P/E Lowest" value={formData.pe_lowest} onChange={(e) => setFormData({...formData, pe_lowest: e.target.value})} className="text-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-purple-600 border-b pb-1">SME IPO size</h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">IPO Size Highest</label>
                    <Input type="number" step="any" min="0" placeholder="Enter IPO Size Highest" value={formData.ipo_size_heigest} onChange={(e) => setFormData({...formData, ipo_size_heigest: e.target.value})} className="text-foreground" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">IPO Size Median</label>
                    <Input type="number" step="any" min="0" placeholder="Enter IPO Size Median" value={formData.ipo_size_median} onChange={(e) => setFormData({...formData, ipo_size_median: e.target.value})} className="text-foreground" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">IPO Size Lowest</label>
                    <Input type="number" step="any" min="0" placeholder="Enter IPO Size Lowest" value={formData.ipo_size_lowest} onChange={(e) => setFormData({...formData, ipo_size_lowest: e.target.value})} className="text-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-blue-600 border-b pb-1">Mainboard P/E Metrics</h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">Mainboard P/E Highest</label>
                    <Input type="number" step="any" min="0" placeholder="Enter Mainboard P/E Highest" value={formData.mainline_pe_heigest} onChange={(e) => setFormData({...formData, mainline_pe_heigest: e.target.value})} className="text-foreground" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">Mainboard P/E Median</label>
                    <Input type="number" step="any" min="0" placeholder="Enter Mainboard P/E Median" value={formData.mainline_pe_median} onChange={(e) => setFormData({...formData, mainline_pe_median: e.target.value})} className="text-foreground" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">Mainboard P/E Lowest</label>
                    <Input type="number" step="any" min="0" placeholder="Enter Mainboard P/E Lowest" value={formData.mainline_pe_lowest} onChange={(e) => setFormData({...formData, mainline_pe_lowest: e.target.value})} className="text-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-blue-600 border-b pb-1">Mainboard IPO size</h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">Mainboard IPO Size Highest</label>
                    <Input type="number" step="any" min="0" placeholder="Enter Mainboard IPO Size Highest" value={formData.mainline_ipo_size_heigest} onChange={(e) => setFormData({...formData, mainline_ipo_size_heigest: e.target.value})} className="text-foreground" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">Mainboard IPO Size Median</label>
                    <Input type="number" step="any" min="0" placeholder="Enter Mainboard IPO Size Median" value={formData.mainline_ipo_size_median} onChange={(e) => setFormData({...formData, mainline_ipo_size_median: e.target.value})} className="text-foreground" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase">Mainboard IPO Size Lowest</label>
                    <Input type="number" step="any" min="0" placeholder="Enter Mainboard IPO Size Lowest" value={formData.mainline_ipo_size_lowest} onChange={(e) => setFormData({...formData, mainline_ipo_size_lowest: e.target.value})} className="text-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea 
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                  placeholder="Enter sector details and industry overview..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            <DialogFooter className="border-t pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-foreground">Cancel</Button>
              <Button type="submit" disabled={submitting} className="min-w-[120px]">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : editingSector ? "Update Sector" : "Save Sector"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function SectorsClient() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <SectorsContent />
    </QueryClientProvider>
  );
}
