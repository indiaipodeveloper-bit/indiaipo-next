"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  status: string;
  created_at: string;
}

const emptyForm = { question: "", answer: "", status: "Active" };

export default function RegistrarFaqsClient() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getHeaders = (json = true) => {
    const h: Record<string, string> = {};
    if (json) h["Content-Type"] = "application/json";
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) h["Authorization"] = `Bearer ${token}`;
    }
    return h;
  };

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/registrar-faqs", {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setFaqs(data || []);
      }
    } catch (err) {
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchFaqs(); 
  }, []);

  const handleSave = async () => {
    if (!form.question || !form.answer) { 
      toast.error("Question and Answer are required"); 
      return; 
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/registrar-faqs/${editingId}` : "/api/registrar-faqs";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save failed");
      }
      toast.success(editingId ? "FAQ updated!" : "FAQ created!");
      setForm(emptyForm);
      setEditingId(null);
      setDialogOpen(false);
      fetchFaqs();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (f: FAQ) => {
    setForm({
      question: f.question,
      answer: f.answer,
      status: f.status,
    });
    setEditingId(f.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      const res = await fetch(`/api/registrar-faqs/${id}`, { 
        method: "DELETE",
        headers: getHeaders()
      });
      if (res.ok) {
        toast.success("FAQ deleted successfully");
        fetchFaqs();
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      toast.error("Failed to delete FAQ");
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Registrar FAQs</h1>
          <p className="text-sm text-muted-foreground mt-1">{faqs.length} FAQs in database</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setForm(emptyForm); setEditingId(null); } }}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground font-semibold">
              <Plus className="h-4 w-4 mr-2" /> New FAQ
            </Button>
          </DialogTrigger>
          <DialogContent 
            className="max-w-2xl"
            onPointerDownOutside={(e) => {
              e.preventDefault();
            }}
            onEscapeKeyDown={(e) => {
              e.preventDefault();
            }}
          >
            <DialogHeader>
              <DialogTitle className="text-xl text-foreground">{editingId ? "Edit FAQ" : "Create New FAQ"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4 animate-in fade-in duration-300">
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Question *</label>
                <Input 
                  value={form.question} 
                  onChange={(e) => setForm({ ...form, question: e.target.value })} 
                  placeholder="Enter the question" 
                  className="text-foreground bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Answer *</label>
                <Textarea 
                  value={form.answer} 
                  onChange={(e) => setForm({ ...form, answer: e.target.value })} 
                  rows={5} 
                  placeholder="Enter the answer" 
                  className="text-foreground bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Status</label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger className="text-foreground bg-background">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-foreground">
                    <SelectItem value="Active" className="hover:bg-accent cursor-pointer">Active</SelectItem>
                    <SelectItem value="Inactive" className="hover:bg-accent cursor-pointer">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleSave} 
                disabled={saving} 
                className="w-full bg-primary text-primary-foreground font-semibold mt-2"
              >
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : editingId ? "Update FAQ" : "Create FAQ"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground text-sm font-medium">Fetching Registrar FAQs...</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm animate-in fade-in duration-500">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Question</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground w-32">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground w-40">Created At</th>
                  <th className="text-right py-4 px-6 font-semibold text-foreground w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {faqs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-20 text-muted-foreground">
                      No FAQs yet. Create your first FAQ!
                    </td>
                  </tr>
                ) : (
                  faqs.map((f) => (
                    <tr key={f.id} className="hover:bg-secondary/10 transition-colors group">
                      <td className="py-4 px-6 font-medium text-foreground max-w-md">
                        <div className="truncate font-bold" title={f.question}>{f.question}</div>
                        <div className="text-xs text-muted-foreground truncate mt-1" title={f.answer}>{f.answer}</div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full", f.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-muted text-muted-foreground border border-border")}>
                          {f.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {new Date(f.created_at).toLocaleDateString("en-IN")}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(f)} className="h-8 w-8 text-foreground hover:bg-muted">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(f.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
