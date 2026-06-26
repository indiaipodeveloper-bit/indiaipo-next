"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash2, CheckCircle, Mail, Phone, Building2, User, MessageSquareText, Copy, Eye, Download, Loader2 } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { API_URL } from "@/lib/constants";

interface Enquiry {
  id: string;
  consultant_id: string;
  consultant_name: string;
  name: string;
  email: string;
  mobile: string;
  Cname: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function ConsultantEnquiriesClient() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    fetchData(); 
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/consultant-enquiries`, {
        headers: getHeaders()
      });
      if (res.ok) setEnquiries(await res.json());
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/consultant-enquiries/${id}/read`, { 
        method: "PATCH",
        headers: getHeaders()
      });
      if (res.ok) {
        toast.success("Marked as read");
        fetchData();
      }
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    try {
      const res = await fetch(`${API_URL}/api/consultant-enquiries/${id}`, { 
        method: "DELETE",
        headers: getHeaders()
      });
      if (res.ok) {
        toast.success("Deleted!");
        fetchData();
      }
    } catch (err) {
      toast.error("Error deleting");
    }
  };

  const copyToClipboard = (enquiry: Enquiry) => {
    const text = `Name: ${enquiry.name}\nOrganisation: ${enquiry.Cname || 'N/A'}\nTarget Consultant: ${enquiry.consultant_name}\nEmail: ${enquiry.email}\nPhone: ${enquiry.mobile || 'N/A'}\nMessage: ${enquiry.message}\nDate: ${format(new Date(enquiry.created_at), "PPP p")}`;
    navigator.clipboard.writeText(text);
    toast.success("Details copied to clipboard");
  };

  const handleExport = () => {
    try {
      const BOM = "\uFEFF";
      const headers = ["ID", "Name", "Organisation", "Email", "Phone", "Target Consultant", "Message", "Status", "Date"];

      const escape = (val: any) => `"${String(val ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;

      const rows = enquiries.map((e) => [
        escape(e.id),
        escape(e.name),
        escape(e.Cname),
        escape(e.email),
        escape(e.mobile),
        escape(e.consultant_name),
        escape(e.message),
        escape(e.is_read ? "Read" : "Unread"),
        escape(new Date(e.created_at).toLocaleString("en-IN")),
      ].join(","));

      const csvContent = BOM + [headers.map((h) => `"${h}"`).join(","), ...rows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `consultant-enquiries-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success(`Exported ${enquiries.length} enquiries!`);
    } catch {
      toast.error("Export failed");
    }
  };

  const totalPages = Math.ceil(enquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEnquiries = enquiries.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Consultant Enquiries</h1>
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-primary">{enquiries.length}</span> enquiries received from the Consultant pages
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleExport}
          disabled={enquiries.length === 0}
          className="rounded-xl h-9 gap-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="font-bold text-foreground">Date</TableHead>
              <TableHead className="font-bold text-foreground">Name & Org</TableHead>
              <TableHead className="font-bold text-foreground">Contact</TableHead>
              <TableHead className="font-bold text-foreground">Target</TableHead>
              <TableHead className="font-bold text-foreground">Message</TableHead>
              <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-20">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-xs text-muted-foreground mt-2 font-medium">Fetching Records...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : currentEnquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-20 text-muted-foreground">
                  <MessageSquareText className="w-12 h-12 mb-3 opacity-20 text-primary mx-auto" />
                  <p className="text-base font-semibold text-foreground">No enquiries found</p>
                  <p className="text-xs">Consultant submissions will show up here</p>
                </TableCell>
              </TableRow>
            ) : currentEnquiries.map((e) => (
              <TableRow
                key={e.id}
                className={`cursor-pointer hover:bg-muted/30 transition-colors ${!e.is_read ? "bg-primary/5 font-medium text-foreground" : "text-muted-foreground"
                  }`}
                onClick={(ev) => {
                  ev.stopPropagation();
                  setSelectedEnquiry(e);

                  if (!e.is_read) {
                    markAsRead(e.id);
                  }
                }}
              >
                <TableCell>
                  {!e.is_read && <div className="w-2 h-2 rounded-full bg-primary animate-pulse mx-auto" />}
                </TableCell>
                <TableCell className="text-xs whitespace-nowrap">
                  {format(new Date(e.created_at), "dd MMM yyyy")}
                  <div className="text-[10px] opacity-60">
                    {format(new Date(e.created_at), "p")}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-bold text-foreground">{e.name}</div>
                  {e.Cname && (
                    <div className="text-[11px] flex items-center gap-1 opacity-70">
                      <Building2 className="h-3 w-3" /> {e.Cname}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <a href={`mailto:${e.email}`} className="text-xs text-primary hover:underline flex items-center gap-1" onClick={(ev) => ev.stopPropagation()}>
                      <Mail className="h-3 w-3" /> {e.email}
                    </a>
                    {e.mobile && (
                      <a href={`tel:${e.mobile}`} className="text-xs text-primary hover:underline flex items-center gap-1" onClick={(ev) => ev.stopPropagation()}>
                        <Phone className="h-3 w-3" /> {e.mobile}
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-background/50 border-primary/20 text-primary text-[10px] whitespace-nowrap text-foreground">
                    {e.consultant_name}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <p className="text-xs truncate" title={e.message}>
                    {e.message}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setSelectedEnquiry(e);
                      }}
                      title="View full details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        copyToClipboard(e);
                      }}
                      title="Copy details"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    {!e.is_read ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:bg-primary/10"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          markAsRead(e.id);
                        }}
                        title="Mark as read"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                      </Button>
                    ) : (
                      <div className="h-8 w-8 flex items-center justify-center opacity-30 text-muted-foreground">
                        <CheckCircle className="h-3.5 w-3.5" />
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        del(e.id);
                      }}
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border bg-card rounded-xl shadow-sm mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50 text-foreground" : "cursor-pointer text-foreground"}
                />
              </PaginationItem>

              {(() => {
                const pages = [];
                const showEllipsis = totalPages > 7;
                if (!showEllipsis) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  pages.push(1);
                  if (currentPage > 4) pages.push('...');
                  const start = Math.max(2, currentPage - 2);
                  const end = Math.min(totalPages - 1, currentPage + 2);
                  for (let i = start; i <= end; i++) {
                    if (!pages.includes(i)) pages.push(i);
                  }
                  if (currentPage < totalPages - 3) pages.push('...');
                  if (!pages.includes(totalPages)) pages.push(totalPages);
                }
                return pages.map((p, idx) => (
                  <PaginationItem key={idx}>
                    {p === '...' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(Number(p))}
                        isActive={currentPage === p}
                        className="cursor-pointer text-foreground"
                      >
                        {p}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ));
              })()}

              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50 text-foreground" : "cursor-pointer text-foreground"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <Dialog open={!!selectedEnquiry} onOpenChange={(open) => !open && setSelectedEnquiry(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl [&>button]:text-white [&>button]:opacity-100 [&>button]:hover:text-white/80 transition-all bg-white">
          <DialogHeader className="p-6 bg-gradient-to-br from-[#001529] to-[#003380] text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <User className="h-5 w-5 text-accent" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">Consultant Enquiry Details</DialogTitle>
                {selectedEnquiry && (
                  <DialogDescription className="text-white/60 font-medium mt-1">
                    Submitted on {format(new Date(selectedEnquiry.created_at), "PPP p")}
                  </DialogDescription>
                )}
              </div>
            </div>
          </DialogHeader>

          {selectedEnquiry && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Client Name</p>
                  <p className="text-sm font-semibold text-foreground">{selectedEnquiry.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Organisation</p>
                  <p className="text-sm font-semibold text-foreground">{selectedEnquiry.Cname || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Email Address</p>
                  <a href={`mailto:${selectedEnquiry.email}`} className="text-sm font-semibold text-primary hover:underline flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" /> {selectedEnquiry.email}
                  </a>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">Phone Number</p>
                  <a href={`tel:${selectedEnquiry.mobile}`} className="text-sm font-semibold text-primary hover:underline flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" /> {selectedEnquiry.mobile || "N/A"}
                  </a>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-dashed border-border">
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  Message Content / Enquiry
                </p>
                <div className="bg-muted/30 p-5 rounded-xl border border-border/50 text-sm leading-relaxed text-foreground whitespace-pre-wrap shadow-inner break-words max-h-[300px] overflow-y-auto">
                  {selectedEnquiry.message}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline" className="border-border hover:bg-muted font-semibold text-foreground" onClick={() => copyToClipboard(selectedEnquiry)}>
                  <Copy className="h-4 w-4 mr-2" /> Copy All Details
                </Button>
                <Button className="bg-primary text-white hover:bg-primary/90 px-8 font-semibold" onClick={() => setSelectedEnquiry(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
