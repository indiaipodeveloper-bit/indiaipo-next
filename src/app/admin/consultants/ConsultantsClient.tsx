"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Save, X, Upload, Users, Eye, EyeOff } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import RichEditor from "@/components/ui/RichEditor";

interface Consultant {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  experience_years: number;
  specialization: string | null;
  office_location: string | null;
  success_stories: string | null;
  tags: string | null;
  cemail: string | null;
  cmobile: string | null;
  caddress: string | null;
  cweblink: string | null;
  meta_title: string | null;
  meta_desc: string | null;
  meta_keywords: string | null;
  methodology: string | null;
  roadmap: string | null;
}

export default function ConsultantsClient() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [newData, setNewData] = useState({
    name: "",
    slug: "",
    description: "",
    sort_order: 0,
    experience_years: 0,
    specialization: "",
    office_location: "",
    success_stories: "",
    tags: "",
    image_url: "",
    cemail: "",
    cmobile: "",
    caddress: "",
    cweblink: "",
    meta_title: "",
    meta_desc: "",
    meta_keywords: "",
    methodology: "",
    roadmap: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Consultant>>({});
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
      const res = await fetch("/api/consultants", {
        headers: getHeaders()
      });
      if (res.ok) setConsultants(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const add = async () => {
    if (!newData.name) return toast.error("Name required");

    if (newData.cemail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newData.cemail)) {
      return toast.error("Enter a valid email");
    }

    if (newData.cmobile && !/^\d{10}$/.test(newData.cmobile)) {
      return toast.error("Mobile must be exactly 10 digits");
    }

    if (newData.caddress && newData.caddress.length > 400) {
      return toast.error("Address must be less than 400 characters");
    }

    try {
      const res = await fetch("/api/consultants", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          ...newData,
          sort_order: newData.sort_order || consultants.length
        })
      });
      if (!res.ok) throw new Error("Failed to add consultant");
      toast.success("Added successfully!");
      setNewData({
        name: "", slug: "", description: "", sort_order: 0,
        experience_years: 0, specialization: "", office_location: "",
        success_stories: "", tags: "", image_url: "",
        cemail: "", cmobile: "", caddress: "", cweblink: "",
        meta_title: "", meta_desc: "", meta_keywords: "",
        methodology: "", roadmap: ""
      });
      setShowNew(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this consultant? This will also delete their enquiries.")) return;
    try {
      const res = await fetch(`/api/consultants/${id}`, { 
        method: "DELETE",
        headers: getHeaders()
      });
      if (res.ok) {
        toast.success("Deleted!");
        fetchData();
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      toast.error("Error deleting");
    }
  };

  const toggle = async (c: Consultant) => {
    await fetch(`/api/consultants/${c.id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ is_active: !c.is_active ? 1 : 0 })
    });
    fetchData();
  };

  const startEdit = (c: Consultant) => {
    setEditingId(c.id);
    setEditData({
      ...c,
      description: c.description || ""
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;

    if (!editData.name || editData.name.trim() === "") {
      return toast.error("Name is required");
    }

    if (editData.cemail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.cemail)) {
      return toast.error("Enter a valid email");
    }

    if (editData.cmobile && !/^\d{10}$/.test(editData.cmobile)) {
      return toast.error("Mobile must be exactly 10 digits");
    }

    if (editData.caddress && editData.caddress.length > 400) {
      return toast.error("Address must be less than 400 characters");
    }

    if (
      editData.specialization &&
      !/^[A-Za-z\s,]+$/.test(editData.specialization)
    ) {
      return toast.error("Specialization must contain only letters");
    }

    if (!editData.office_location || editData.office_location.trim() === "") {
      return toast.error("Office location is required");
    }

    if (!editData.image_url || editData.image_url.trim() === "") {
      return toast.error("Image is required");
    }

    try {
      const res = await fetch(`/api/consultants/${editingId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(editData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update");
      }

      toast.success("Updated successfully!");
      setEditingId(null);
      setEditData({});
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Error updating");
    }
  };

  const uploadImage = async (id: string, file: File) => {
    setUploading(id);
    const formData = new FormData();
    formData.append("folder", "city");
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: getHeaders(false),
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();

      const updateRes = await fetch(`/api/consultants/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ image_url: url })
      });

      if (updateRes.ok) {
        toast.success("Image uploaded and updated!");
        fetchData();
      } else {
        throw new Error("Failed to link image to consultant");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(null);
    }
  };

  const handleAddImageUpload = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error("image must be less than 2 mb ");
      return;
    }
    setUploading("new");
    const formData = new FormData();
    formData.append("folder", "city");
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: getHeaders(false),
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setNewData({ ...newData, image_url: url });
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(null);
    }
  };

  const handleEditImageUpload = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error("image must be less than 2 mb ");
      return;
    }

    setUploading(editingId);
    const formData = new FormData();
    formData.append("folder", "city");
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: getHeaders(false),
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setEditData({ ...editData, image_url: url });
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Manage Consultants</h1>
          <p className="text-sm text-muted-foreground">{consultants.length} IPO consultants listed</p>
        </div>
        <Button onClick={() => setShowNew(true)} className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/95">
          <Plus className="h-4 w-4 mr-2" /> Add Consultant
        </Button>
      </div>

      {showNew && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="font-bold text-lg flex items-center gap-2 text-primary">
            <Plus className="h-5 w-5" /> New Consultant Profile
          </h3>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="general" className="text-foreground">General Info</TabsTrigger>
              <TabsTrigger value="content" className="text-foreground">Content & Stories</TabsTrigger>
              <TabsTrigger value="contact" className="text-foreground">Contact Details</TabsTrigger>
              <TabsTrigger value="seo" className="text-foreground">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 text-foreground">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Consultant Name*</label>
                  <Input placeholder="e.g. IPO Advisory in Kolkata..." value={newData.name} onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                    setNewData({ ...newData, name, slug });
                  }} className="text-foreground bg-card" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Slug (URL)*</label>
                  <Input placeholder="ipo-advisory-in-kolkata" value={newData.slug} onChange={(e) => setNewData({ ...newData, slug: e.target.value })} className="text-foreground bg-card" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Expertise / Specialization</label>
                  <Input placeholder="e.g. Manufacturing, Tech, SME" value={newData.specialization} onChange={(e) => setNewData({ ...newData, specialization: e.target.value })} className="text-foreground bg-card" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Office Location</label>
                  <Input placeholder="e.g. Delhi, Mumbai" value={newData.office_location} onChange={(e) => setNewData({ ...newData, office_location: e.target.value })} className="text-foreground bg-card" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Experience (Years)</label>
                  <Input type="number" value={newData.experience_years} onChange={(e) => setNewData({ ...newData, experience_years: parseInt(e.target.value) || 0 })} className="text-foreground bg-card" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sort Order</label>
                  <Input type="number" value={newData.sort_order} onChange={(e) => setNewData({ ...newData, sort_order: parseInt(e.target.value) || 0 })} className="text-foreground bg-card" />
                </div>

                <div className="space-y-2 md:col-span-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Consultant Image</label>
                  <div className="flex items-center gap-4">
                    {newData.image_url && (
                      <img src={getImageUrl(newData.image_url)} className="w-16 h-16 rounded-xl object-cover border" alt="Preview" />
                    )}
                    <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-4 hover:bg-muted/50 cursor-pointer transition-colors bg-card">
                      <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">{uploading === "new" ? "Uploading..." : "Click to upload image"}</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleAddImageUpload(e.target.files[0])} />
                    </label>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4 text-foreground">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Company Description / Intro</label>
                <RichEditor
                  value={newData.description}
                  onChange={(value) =>
                    setNewData((prev) => ({
                      ...prev,
                      description: value
                    }))
                  }
                  placeholder="Write consultant description..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Proven Track Record</label>
                <Textarea placeholder="List some major IPOs handled or successes..." value={newData.success_stories} onChange={(e) => setNewData({ ...newData, success_stories: e.target.value })} className="text-foreground bg-card" />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4 text-foreground">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Work Email</label>
                  <Input type="email" placeholder="contact@advisor.com" value={newData.cemail} onChange={(e) => setNewData({ ...newData, cemail: e.target.value })} className="text-foreground bg-card" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact Mobile</label>
                  <Input
                    value={newData.cmobile}
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setNewData({ ...newData, cmobile: value });
                    }}
                    className="text-foreground bg-card"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Website Link</label>
                  <Input placeholder="https://..." value={newData.cweblink} onChange={(e) => setNewData({ ...newData, cweblink: e.target.value })} className="text-foreground bg-card" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Office Address</label>
                  <Textarea placeholder="123, Financial Building..." value={newData.caddress} onChange={(e) => setNewData({ ...newData, caddress: e.target.value })} className="text-foreground bg-card" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4 text-foreground">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Meta Title</label>
                <Input placeholder="SEO Title" value={newData.meta_title} onChange={(e) => setNewData({ ...newData, meta_title: e.target.value })} className="text-foreground bg-card" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Meta Keywords</label>
                <Input placeholder="key, words, separated" value={newData.meta_keywords} onChange={(e) => setNewData({ ...newData, meta_keywords: e.target.value })} className="text-foreground bg-card" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Meta Description</label>
                <Textarea placeholder="Meta description for search engines" value={newData.meta_desc} onChange={(e) => setNewData({ ...newData, meta_desc: e.target.value })} className="text-foreground bg-card" />
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button onClick={add} className="bg-primary text-primary-foreground"><Save className="h-4 w-4 mr-2" /> Save Profile</Button>
            <Button variant="ghost" onClick={() => setShowNew(false)} className="text-foreground"><X className="h-4 w-4 mr-2" /> Cancel</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {consultants.map((c) => (
          <div key={c.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
            {editingId === c.id ? (
              <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="general" className="text-foreground">General</TabsTrigger>
                    <TabsTrigger value="content" className="text-foreground">Content</TabsTrigger>
                    <TabsTrigger value="contact" className="text-foreground">Contact</TabsTrigger>
                    <TabsTrigger value="seo" className="text-foreground">SEO</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-4 text-foreground">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Name</label>
                        <Input value={editData.name || ""} onChange={(e) => {
                          const name = e.target.value;
                          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                          setEditData({ ...editData, name, slug });
                        }} className="text-foreground bg-card" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Slug</label>
                        <Input value={editData.slug || ""} onChange={(e) => setEditData({ ...editData, slug: e.target.value })} className="text-foreground bg-card" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Specialization</label>
                        <Input value={editData.specialization || ""} onChange={(e) => setEditData({ ...editData, specialization: e.target.value })} className="text-foreground bg-card" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Location</label>
                        <Input value={editData.office_location || ""} onChange={(e) => setEditData({ ...editData, office_location: e.target.value })} className="text-foreground bg-card" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Exp (Yrs)</label>
                        <Input type="number" value={editData.experience_years || 0} onChange={(e) => setEditData({ ...editData, experience_years: parseInt(e.target.value) || 0 })} className="text-foreground bg-card" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Sort Order</label>
                        <Input type="number" value={editData.sort_order || 0} onChange={(e) => setEditData({ ...editData, sort_order: parseInt(e.target.value) || 0 })} className="text-foreground bg-card" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Tags</label>
                        <Input value={editData.tags || ""} onChange={(e) => setEditData({ ...editData, tags: e.target.value })} className="text-foreground bg-card" />
                      </div>
                      <div className="space-y-2 md:col-span-3">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Consultant Image</label>
                        <div className="flex items-center gap-4">
                          {editData.image_url && (
                            <img src={getImageUrl(editData.image_url)} className="w-16 h-16 rounded-xl object-cover border" alt="Preview" />
                          )}
                          <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-4 hover:bg-muted/50 cursor-pointer transition-colors bg-card">
                            <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">{uploading === editingId ? "Uploading..." : "Update image"}</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleEditImageUpload(e.target.files[0])} />
                          </label>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="content" className="space-y-4 text-foreground">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Description</label>
                      <RichEditor
                        value={editData.description ?? ""}
                        onChange={(value) =>
                          setEditData((prev) => ({
                            ...prev,
                            description: value
                          }))
                        }
                        placeholder="Write consultant description..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Proven Track Record </label>
                      <Textarea value={editData.success_stories || ""} onChange={(e) => setEditData({ ...editData, success_stories: e.target.value })} className="text-foreground bg-card" />
                    </div>
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-4 text-foreground">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Work Email</label>
                        <Input value={editData.cemail || ""} onChange={(e) => setEditData({ ...editData, cemail: e.target.value })} className="text-foreground bg-card" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Contact Mobile</label>
                        <Input value={editData.cmobile || ""} onChange={(e) => setEditData({ ...editData, cmobile: e.target.value })} className="text-foreground bg-card" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Website Link</label>
                        <Input value={editData.cweblink || ""} onChange={(e) => setEditData({ ...editData, cweblink: e.target.value })} className="text-foreground bg-card" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase text-muted-foreground">Full Address</label>
                        <Textarea value={editData.caddress || ""} onChange={(e) => setEditData({ ...editData, caddress: e.target.value })} className="text-foreground bg-card" />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="seo" className="space-y-4 text-foreground">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Meta Title</label>
                      <Input value={editData.meta_title || ""} onChange={(e) => setEditData({ ...editData, meta_title: e.target.value })} className="text-foreground bg-card" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Meta Keywords</label>
                      <Input value={editData.meta_keywords || ""} onChange={(e) => setEditData({ ...editData, meta_keywords: e.target.value })} className="text-foreground bg-card" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Meta Description</label>
                      <Textarea value={editData.meta_desc || ""} onChange={(e) => setEditData({ ...editData, meta_desc: e.target.value })} className="text-foreground bg-card" />
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="flex gap-3 border-t border-border pt-4">
                  <Button size="sm" onClick={saveEdit} className="bg-primary text-primary-foreground px-6"><Save className="h-4 w-4 mr-2" /> Save Changes</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="text-foreground"><X className="h-4 w-4 mr-2" /> Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  <div className="w-20 h-20 rounded-2xl bg-primary/5 flex items-center justify-center overflow-hidden shrink-0 border border-primary/10 shadow-inner group relative">
                    {c.image_url ? (
                      <img src={getImageUrl(c.image_url)} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="h-10 w-10 text-primary/20" />
                    )}
                    {uploading === c.id && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground text-lg leading-tight truncate">{c.name}</h3>
                    <div
                      className="text-sm text-muted-foreground line-clamp-1 mt-1 font-normal"
                      dangerouslySetInnerHTML={{
                        __html: c.description || ""
                      }}
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px] font-mono text-foreground border-border">Order: {c.sort_order}</Badge>
                      {!c.is_active && <Badge variant="secondary" className="text-[10px]">Hidden</Badge>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadImage(c.id, file);
                      }}
                    />
                    <Button size="sm" variant="outline" asChild disabled={uploading === c.id} className="h-9 text-foreground border-border bg-card">
                      <span>
                        <Upload className="h-3.5 w-3.5 mr-1.5" />
                        {uploading === c.id ? "Uploading..." : "Upload Image"}
                      </span>
                    </Button>
                  </label>
                  <Button size="sm" variant="ghost" onClick={() => startEdit(c)} className="h-9 w-9 p-0 text-foreground">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => toggle(c)} className="h-9 w-9 p-0">
                    {c.is_active ? <Eye className="h-4 w-4 text-green-600" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive h-9 w-9 p-0 hover:bg-destructive/10" onClick={() => del(c.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
        {consultants.length === 0 && (
          <div className="text-center py-12 bg-card border border-dashed border-border rounded-xl">
            <Users className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground">No Consultants Yet</h3>
            <p className="text-sm text-muted-foreground">Add your first IPO consultant to get started.</p>
            <Button onClick={() => setShowNew(true)} variant="outline" className="mt-4 text-foreground border-border bg-card">
              <Plus className="h-4 w-4 mr-2" /> Add Consultant
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
