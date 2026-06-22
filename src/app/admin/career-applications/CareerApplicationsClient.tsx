"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Mail, Phone, FileText, Download, User, Briefcase, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Application {
  id: number;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  position_applied: string;
  experience: string;
  resume: string;
  coverletter: string;
  created_at: string;
}

export default function CareerApplicationsClient() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
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

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/career/admin/enquiries", {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (err) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      const res = await fetch(`/api/career/admin/enquiries/${id}`, { 
        method: "DELETE",
        headers: getHeaders()
      });
      if (res.ok) {
        toast.success("Application deleted");
        fetchApplications();
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentApplications = applications.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Career Applications / Enquiries</h1>
          <p className="text-sm text-muted-foreground">Manage and review candidates who applied for jobs.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/admin/career-roles" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Manage Roles
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
          <p className="text-muted-foreground">Loading applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-card">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground/20 mb-4" />
          <p className="text-muted-foreground">No applications found in the database.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-secondary/50 border-b border-border text-foreground/80 font-bold">
                <th className="px-6 py-4">Candidate Name</th>
                <th className="px-6 py-4">Position</th>
                <th className="px-6 py-4">Experience</th>
                <th className="px-6 py-4">Resume</th>
                <th className="px-6 py-4">Applied On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentApplications.map((app) => (
                <tr key={app.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {app.name?.[0]}{app.last_name?.[0]}
                      </div>
                      <div>
                        <div className="font-bold text-foreground">{app.name} {app.last_name}</div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Mail className="h-2.5 w-2.5" /> {app.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{app.position_applied || "General"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-foreground">{app.experience || "N/A"}</div>
                  </td>
                  <td className="px-6 py-4">
                    {app.resume ? (
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild className="h-8 gap-1.5 border-primary/20 text-primary hover:bg-primary/5">
                          <a href={getImageUrl(app.resume)} target="_blank" rel="noopener noreferrer">
                            <Download className="h-3.5 w-3.5" />
                            Resume
                          </a>
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">No File</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(app.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary hover:bg-primary/10"
                        onClick={() => setSelectedApp(app)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(app.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="p-4 border-t bg-muted/20">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}

      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="sm:max-w-[600px] bg-white text-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-heading text-foreground">
              Application Details
            </DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4 bg-secondary/30 p-4 rounded-2xl">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Full Name</span>
                  <p className="font-medium text-foreground">{selectedApp.name} {selectedApp.last_name}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Phone</span>
                  <p className="font-medium text-foreground">{selectedApp.phone || "N/A"}</p>
                </div>
                <div className="grow space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Email</span>
                  <p className="font-medium text-foreground">{selectedApp.email}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Applied On</span>
                  <p className="font-medium text-foreground">{new Date(selectedApp.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-border flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-muted-foreground block">Position</span>
                    <span className="font-medium text-foreground">{selectedApp.position_applied || "General Application"}</span>
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-border flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-muted-foreground block">Experience</span>
                    <span className="font-medium text-foreground">{selectedApp.experience || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Cover Letter / Message</span>
                <div className="p-5 rounded-2xl bg-secondary/10 border border-border text-sm leading-relaxed whitespace-pre-wrap max-h-[250px] overflow-y-auto break-words shadow-inner text-foreground">
                  {selectedApp.coverletter || "No cover letter provided."}
                </div>
              </div>

              <div className="pt-2">
                {selectedApp.resume && (
                  <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                    <a href={getImageUrl(selectedApp.resume)} target="_blank" rel="noopener noreferrer">
                      <Download className="h-5 w-5 mr-2" />
                      Download Full Resume / CV
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
