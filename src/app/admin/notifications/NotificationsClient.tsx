"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Save, X, Upload, FileText, Eye, EyeOff, ExternalLink } from "lucide-react";
import RichEditor from "@/components/ui/RichEditor";
import { cn } from "@/lib/utils";

interface NotifPdf {
  id: string; 
  title: string; 
  slug: string; 
  pdf_url: string | null; 
  link: string | null;
  description: string | null; 
  sort_order: number; 
  is_active: boolean;
}

const generateSlug = (title: string) =>
  title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

const MAX_PDF_MB = 5;

export default function NotificationsClient() {
  const [pdfs, setPdfs] = useState<NotifPdf[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [newData, setNewData] = useState({ title: "", description: "", link: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<NotifPdf>>({});
  const [uploading, setUploading] = useState<string | null>(null);

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
      const res = await fetch("/api/notifications", {
        headers: getHeaders()
      });
      if (res.ok) setPdfs(await res.json());
    } catch (err) { 
      console.error(err); 
    }
  };

  const add = async () => {
    if (!newData.title.trim()) return toast.error("Title is required");
    const slug = generateSlug(newData.title.trim());
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          title: newData.title.trim(),
          slug,
          description: newData.description || null,
          link: newData.link || null,
          sort_order: pdfs.length,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add");
      }
      toast.success("Notification added!");
      setNewData({ title: "", description: "", link: "" });
      setShowNew(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this notification?")) return;
    try {
      await fetch(`/api/notifications/${id}`, { 
        method: "DELETE",
        headers: getHeaders()
      });
      toast.success("Deleted!");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  };

  const toggle = async (p: NotifPdf) => {
    try {
      await fetch(`/api/notifications/${p.id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ is_active: !p.is_active }),
      });
      fetchData();
    } catch (err) {
      toast.error("Failed to toggle visibility");
    }
  };

  const startEdit = (p: NotifPdf) => { 
    setEditingId(p.id); 
    setEditData({ ...p }); 
  };

  const saveEdit = async () => {
    if (!editingId) return;

    if (!editData.title?.trim()) {
      return toast.error("Title is required");
    }
    try {
      const res = await fetch(`/api/notifications/${editingId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
          title: editData.title?.trim(),
          description: editData.description || null,
          link: editData.link || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Update failed");
      }
      toast.success("Updated!");
      setEditingId(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const uploadPdf = async (id: string, file: File) => {
    if (file.size > MAX_PDF_MB * 1024 * 1024) {
      toast.error(`PDF is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Max allowed: ${MAX_PDF_MB}MB`);
      return;
    }
    setUploading(id);
    const formData = new FormData();
    formData.append("folder", "notifications");
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { 
        method: "POST", 
        headers: getHeaders(false),
        body: formData 
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
      const { url } = await res.json();
      await fetch(`/api/notifications/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ pdf_url: url }),
      });
      toast.success("PDF uploaded successfully!");
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications &amp; Circulars</h1>
          <p className="text-sm text-muted-foreground mt-1">{pdfs.length} notifications — Upload PDFs for each</p>
        </div>
        <Button onClick={() => setShowNew(true)} className="bg-primary text-primary-foreground font-semibold">
          <Plus className="h-4 w-4 mr-2" /> Add Notification
        </Button>
      </div>

      {showNew && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm animate-in fade-in slide-in-from-top-2">
          <h3 className="font-semibold text-foreground text-lg">New Notification</h3>

          <Input
            placeholder="Title *"
            value={newData.title}
            onChange={(e) => setNewData({ ...newData, title: e.target.value })}
            className="text-foreground bg-background"
          />

          {newData.title && (
            <p className="text-[11px] text-muted-foreground -mt-2 ml-1">
              Slug: <span className="font-mono text-primary">{generateSlug(newData.title)}</span>
            </p>
          )}

          <Input
            placeholder="External Link (Optional)"
            value={newData.link}
            onChange={(e) => setNewData({ ...newData, link: e.target.value })}
            className="text-foreground bg-background"
          />

          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1.5">Description (optional)</p>
            <RichEditor
              value={newData.description}
              onChange={(val) => setNewData({ ...newData, description: val })}
              placeholder="Write a description, paste images, add formatting…"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button onClick={add} className="bg-primary text-primary-foreground">
              <Save className="h-4 w-4 mr-1" /> Save
            </Button>
            <Button variant="ghost" onClick={() => { setShowNew(false); setNewData({ title: "", description: "", link: "" }); }} className="text-foreground">
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {pdfs.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-xl p-5 shadow-sm">
            {editingId === p.id ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground mb-1.5 block">
                    Title <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={editData.title || ""}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    placeholder="Title (required)"
                    className={cn(
                      "text-foreground bg-background",
                      !editData.title?.trim() ? "border-destructive/50 focus-visible:ring-destructive/30" : ""
                    )}
                  />
                  {!editData.title?.trim() && (
                    <p className="text-[11px] text-destructive mt-1">Title is required</p>
                  )}
                </div>

                <Input
                  value={editData.link || ""}
                  onChange={(e) => setEditData({ ...editData, link: e.target.value })}
                  placeholder="External Link (Optional)"
                  className="text-foreground bg-background"
                />

                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1.5">Description</p>
                  <RichEditor
                    value={editData.description || ""}
                    onChange={(val) => setEditData({ ...editData, description: val })}
                    placeholder="Write a description…"
                  />
                </div>

                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit} className="bg-primary text-primary-foreground">
                    <Save className="h-3.5 w-3.5 mr-1" /> Save Changes
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="text-foreground">
                    <X className="h-3.5 w-3.5 mr-1" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-5 w-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground text-base">{p.title}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="outline" className="text-[10px] text-foreground border-border">{p.slug}</Badge>
                      {p.pdf_url ? (
                        <Badge className="bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] hover:bg-green-500/10">PDF Uploaded</Badge>
                      ) : p.link ? (
                        <Badge className="bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[10px] hover:bg-blue-500/10">Link Added</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px] border-border text-foreground">No PDF / Link</Badge>
                      )}
                      {!p.is_active && <Badge variant="secondary" className="text-[10px] border-border text-foreground">Hidden</Badge>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadPdf(p.id, file);
                        e.target.value = "";
                      }}
                    />
                    <Button size="sm" variant="outline" asChild disabled={uploading === p.id} className="text-foreground cursor-pointer border-border">
                      <span>
                        <Upload className="h-3.5 w-3.5 mr-1" />
                        {uploading === p.id ? "Uploading..." : "Upload PDF"}
                      </span>
                    </Button>
                  </label>

                  {p.pdf_url && (
                    <Button size="sm" variant="outline" asChild className="text-foreground border-border">
                      <a
                        href={p.pdf_url.startsWith("http") || p.pdf_url.startsWith("/") ? p.pdf_url : `/${p.pdf_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1" /> View PDF
                      </a>
                    </Button>
                  )}

                  {p.link && (
                    <Button size="sm" variant="outline" asChild className="text-foreground border-border">
                      <a
                        href={p.link.startsWith("http") ? p.link : `https://${p.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1" /> Open Link
                      </a>
                    </Button>
                  )}

                  <Button size="sm" variant="ghost" onClick={() => startEdit(p)} className="text-foreground">
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => toggle(p)} className="text-foreground">
                    {p.is_active ? <Eye className="h-3.5 w-3.5 text-green-600" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => del(p.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
