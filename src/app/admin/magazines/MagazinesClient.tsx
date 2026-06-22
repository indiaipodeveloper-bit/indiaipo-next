"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Trash2, Image, FileText, Lock, Unlock, Globe } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/utils";

interface Magazine {
  id: string;
  title: string;
  pdf: string;
  language: string;
  pdf_lock: boolean | number;
  report_images: string;
  created_at?: string;
  updated_at?: string;
}

export default function MagazinesClient() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const [form, setForm] = useState({
    title: "",
    pdf: "",
    language: "english",
    pdf_lock: 1,
    report_images: ""
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });

  const getHeaders = (json = true) => {
    const h: Record<string, string> = {};
    if (json) h["Content-Type"] = "application/json";
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) h["Authorization"] = `Bearer ${token}`;
    }
    return h;
  };

  const fetchMagazines = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/magazines?page=${page}&limit=${pagination.pageSize}`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const result = await res.json();
        setMagazines(result.data);
        setPagination(result.pagination);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMagazines(pagination.currentPage);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'image' && file.size > 2 * 1024 * 1024) {
      toast.error("Cannot upload image > 2MB");
      return;
    }
    if (type === 'pdf' && file.size > 50 * 1024 * 1024) {
      toast.error("PDF file size should not exceed 50MB");
      return;
    }

    if (type === 'image') setUploadingImage(true);
    else setUploadingPdf(true);

    try {
      const formData = new FormData();
      formData.append(
        "folder",
        type === 'image'
          ? 'magazine/images'
          : 'magazine/pdfs'
      );
      formData.append("file", file);

      const res = await fetch("/api/upload/magazine", {
        method: "POST",
        headers: getHeaders(false),
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();

      if (type === 'image') {
        setForm({ ...form, report_images: url });
        setUploadingImage(false);
        toast.success("Cover image uploaded!");
      } else {
        setForm({ ...form, pdf: url });
        setUploadingPdf(false);
        toast.success("PDF uploaded!");
      }
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
      if (type === 'image') setUploadingImage(false);
      else setUploadingPdf(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!form.report_images) {
      toast.error("Cover image is required");
      return;
    }
    if (!form.pdf) {
      toast.error("PDF is required");
      return;
    }

    try {
      const url = editingId ? `/api/magazines/${editingId}` : "/api/magazines";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save magazine");
      }

      toast.success(editingId ? "Magazine updated!" : "Magazine added!");
      setForm({ title: "", pdf: "", language: "english", pdf_lock: 1, report_images: "" });
      setShowForm(false);
      setEditingId(null);
      fetchMagazines(pagination.currentPage);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleEdit = (mag: Magazine) => {
    setForm({
      title: mag.title,
      pdf: mag.pdf,
      language: mag.language,
      pdf_lock: (Number(mag.pdf_lock) === 1 || mag.pdf_lock === true) ? 1 : 0,
      report_images: mag.report_images
    });
    setEditingId(mag.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteMagazine = async (id: string) => {
    if (!confirm("Are you sure you want to delete this magazine?")) return;
    try {
      const res = await fetch(`/api/magazines/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (res.ok) {
        toast.success("Magazine deleted");
        fetchMagazines(pagination.currentPage);
      } else {
        throw new Error("Failed to delete");
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl border border-border/50">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">IPO World Magazine</h1>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Manage your digital publication archives
          </div>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95"
          onClick={() => {
            setForm({ title: "", pdf: "", language: "english", pdf_lock: 1, report_images: "" });
            setEditingId(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? "Close Form" : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add New Edition
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border shadow-xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-primary/5 p-4 border-b border-border/50">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              {editingId ? "Modify Existing Edition" : "Create New Edition"}
            </h3>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Magazine Title</label>
                    <Input
                      placeholder="e.g. IPO World - Volume 10"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="bg-background/50 text-foreground"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Language</label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all text-foreground"
                      value={form.language}
                      onChange={(e) => setForm({ ...form, language: e.target.value })}
                    >
                      <option value="english">English (Global)</option>
                      <option value="hindi">Hindi (Regional)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg flex items-center justify-between border border-border/50">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium text-foreground">Content Access</label>
                    <p className="text-xs text-muted-foreground">Determine if this edition requires premium access</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium transition-colors ${form.pdf_lock === 0 ? "text-primary" : "text-muted-foreground"}`}>Free</span>
                    <Switch
                      checked={form.pdf_lock === 1}
                      onCheckedChange={(checked) => setForm({ ...form, pdf_lock: checked ? 1 : 0 })}
                    />
                    <span className={`text-xs font-medium transition-colors ${form.pdf_lock === 1 ? "text-destructive" : "text-muted-foreground"}`}>Locked</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">PDF Document</label>
                    <label className="flex flex-col items-center justify-center h-24 gap-1 cursor-pointer border-2 border-dashed border-border/60 rounded-xl p-4 hover:border-primary/50 hover:bg-primary/5 transition-all group">
                      <FileText className={`h-6 w-6 transition-colors ${form.pdf ? "text-green-500" : "text-muted-foreground group-hover:text-primary"}`} />
                      <span className="text-[11px] font-medium text-center truncate w-full px-2 text-muted-foreground">
                        {uploadingPdf ? "Uploading..." : form.pdf ? "File: " + form.pdf.split('/').pop() : "Click to upload PDF"}
                      </span>
                      <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileUpload(e, 'pdf')} disabled={uploadingPdf} />
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cover Artwork</label>
                    <label className="flex flex-col items-center justify-center h-24 gap-1 cursor-pointer border-2 border-dashed border-border/60 rounded-xl p-4 hover:border-primary/50 hover:bg-primary/5 transition-all group">
                      <Image className={`h-6 w-6 transition-colors ${form.report_images ? "text-green-500" : "text-muted-foreground group-hover:text-primary"}`} />
                      <span className="text-[11px] font-medium text-center truncate w-full px-2 text-muted-foreground">
                        {uploadingImage ? "Uploading..." : form.report_images ? "Image uploaded ✓" : "Click to upload Image"}
                      </span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} disabled={uploadingImage} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">Edition Preview</label>
                <div className="aspect-[3/4.2] rounded-xl border border-border/50 bg-muted/20 overflow-hidden flex items-center justify-center relative">
                  {form.report_images ? (
                    <img src={getImageUrl(form.report_images)} alt="Preview" className="w-full h-full object-contain" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
                      <Image className="h-12 w-12" />
                      <p className="text-[10px] font-medium">No artwork selected</p>
                    </div>
                  )}
                  {form.pdf_lock === 1 && (
                    <div className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-md rounded-lg">
                      <Lock className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm({ title: "", pdf: "", language: "english", pdf_lock: 1, report_images: "" });
                }}
                className="px-6 text-foreground"
              >
                Discard Changes
              </Button>
              <Button
                onClick={handleSave}
                className="bg-primary text-primary-foreground px-8 shadow-lg shadow-primary/20"
                disabled={uploadingImage || uploadingPdf}
              >
                {editingId ? "Update Edition" : "Publish Edition"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">Loading magazines…</div>
        ) : magazines.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">No magazines found.</div>
        ) : (
          magazines.map((mag) => (
            <div key={mag.id} className="bg-card border border-border rounded-xl overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative aspect-[3/4.2] bg-muted overflow-hidden">
                <img
                  src={getImageUrl(mag.report_images)}
                  alt={mag.title}
                  className="w-full h-full object-contain transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/40"
                    onClick={() => handleEdit(mag)}
                  >
                    Quick Edit
                  </Button>
                </div>
                <div className="absolute top-2 right-2 flex flex-col gap-1.5">
                  <Badge className={`${mag.language === 'hindi' ? "bg-orange-500/90" : "bg-blue-500/90"} backdrop-blur-sm border-none text-[10px] px-2 py-0.5 text-white`}>
                    {mag.language.toUpperCase()}
                  </Badge>
                  <Badge
                    variant={mag.pdf_lock == 1 || mag.pdf_lock === true ? "destructive" : "secondary"}
                    className="backdrop-blur-sm border-none text-[10px] px-2 py-0.5 text-white"
                  >
                    {mag.pdf_lock == 1 || mag.pdf_lock === true ? <Lock className="h-2.5 w-2.5 mr-1" /> : <Unlock className="h-2.5 w-2.5 mr-1" />}
                    {mag.pdf_lock == 1 || mag.pdf_lock === true ? "Locked" : "Free"}
                  </Badge>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">{mag.title}</h3>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Globe className="h-3 w-3" />
                    <span className="capitalize">{mag.language}</span>
                  </div>
                  <span>
                    {mag.created_at
                      ? new Date(mag.created_at.replace(" ", "T")).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })
                      : "N/A"}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between pt-3 border-t border-border/50">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Edition Info</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                    onClick={() => deleteMagazine(mag.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchMagazines(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="text-foreground"
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={pagination.currentPage === page ? "default" : "outline"}
                size="sm"
                className="w-9 h-9 p-0 text-foreground"
                onClick={() => fetchMagazines(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchMagazines(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="text-foreground"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
