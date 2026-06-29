"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, GripVertical, Image, Eye, EyeOff, Upload, Film, Play, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/utils";
import { API_URL } from "@/lib/constants";

interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  mobile_image_url?: string | null;
  video_url: string | null;
  cta_text: string | null;
  cta_link: string | null;
  badge_text: string | null;
  cta2_text: string | null;
  cta2_link: string | null;
  sort_order: number;
  is_active: boolean;
  page_path: string | null;
  created_at?: string;
}

const PAGES = [
  { label: "Home Page (Slider)", value: "home" },
  { label: "SME Merchant Bankers", value: "/merchant-bankers/list-of-sme-merchant-bankers" },
  { label: "Mainboard Merchant Bankers", value: "/merchant-bankers/list-of-mainboard-merchant-bankers" },
  { label: "Daily Reporter", value: "/daily-ipo-digest" },
  { label: "News & Updates", value: "/news" },
  { label: "Market Snaps", value: "/ipo-video-updates" },
  { label: "IPO Calendar", value: "/all-ipos" },
  { label: "Mainline IPOs", value: "/mainline-ipos" },
  { label: "SME IPOs", value: "/sme-ipos" },
  { label: "SME IPO Sector", value: "/sme-ipo-sector" },
  { label: "Mainboard IPO Sector", value: "/mainboard-ipo-sector" },
  { label: "IPO Process", value: "/ipo-process" },
  { label: "Pre-IPO Process", value: "/pre-ipo-process-guidance" },
  { label: "Sector Wise IPO", value: "/sector-wise-ipo-list-in-india" },
  { label: "IPO Registrar List", value: "/ipo-registrar-list" },
  { label: "Contact Us", value: "/contact" },
  { label: "----------------", value: "" },
  { label: "All Reports (Group)", value: "group:reports" },
  { label: "All IPO Knowledge (Group)", value: "group:knowledge" },
  { label: "All Notifications/Circulars (Group)", value: "group:notifications" },
  { label: "All Services (Group)", value: "group:services" },
  { label: "----------------", value: "" },
  { label: "Consultant", value: "/consultant" },
  { label: "Blog", value: "/blog" },
];

export default function BannersClient() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    mobile_image_url: "",
    video_url: "",
    cta_text: "",
    cta_link: "",
    badge_text: "",
    cta2_text: "",
    cta2_link: "",
    page_path: "home"
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

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/banners`, {
        headers: getHeaders()
      });
      if (res.ok) {
        setBanners(await res.json());
      }
    } catch (err) {
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'mobile_image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const limit = type === 'video' ? 15 * 1024 * 1024 : 2 * 1024 * 1024;
    if (file.size > limit) {
      toast.error(`File too large! Max ${type === 'video' ? '15MB' : '2MB'} allowed.`);
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("folder", "banners");
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: getHeaders(false),
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      if (type === 'image') {
        setForm(prev => ({ ...prev, image_url: url }));
        toast.success("Image uploaded!");
      } else if (type === 'mobile_image') {
        setForm(prev => ({ ...prev, mobile_image_url: url }));
        toast.success("Mobile image uploaded!");
      } else {
        setForm(prev => ({ ...prev, video_url: url }));
        toast.success("Video uploaded!");
      }
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const titleChars = form.title?.length || 0;
    const subtitleChars = form.subtitle?.length || 0;

    if (titleChars > 90) {
      toast.error(`Banner Title cannot exceed 90 characters (current: ${titleChars})`);
      return;
    }

    if (subtitleChars > 90) {
      toast.error(`Subtitle / Description cannot exceed 90 characters (current: ${subtitleChars})`);
      return;
    }

    if (!form.image_url && !form.video_url) {
      toast.error("Please upload at least an image or a video");
      return;
    }

    try {
      const url = editingId ? `${API_URL}/api/banners/${editingId}` : `${API_URL}/api/banners`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify({
          title: form.title || null,
          subtitle: form.subtitle || null,
          image_url: form.image_url,
          mobile_image_url: form.mobile_image_url || null,
          video_url: form.video_url || null,
          cta_text: form.cta_text || null,
          cta_link: form.cta_link || null,
          badge_text: form.badge_text || null,
          cta2_text: form.cta2_text || null,
          cta2_link: form.cta2_link || null,
          page_path: form.page_path === "home" ? null : form.page_path,
          ...(editingId ? {} : { sort_order: banners.length + 1 })
        })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save banner");
      }
      toast.success(editingId ? "Banner updated!" : "Banner added!");
      setForm({ title: "", subtitle: "", image_url: "", mobile_image_url: "", video_url: "", cta_text: "", cta_link: "", badge_text: "", cta2_text: "", cta2_link: "", page_path: "home" });
      setShowForm(false);
      setEditingId(null);
      fetchBanners();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleEdit = (banner: Banner) => {
    setForm({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      image_url: banner.image_url || "",
      mobile_image_url: banner.mobile_image_url || "",
      video_url: banner.video_url || "",
      cta_text: banner.cta_text || "",
      cta_link: banner.cta_link || "",
      badge_text: banner.badge_text || "",
      cta2_text: banner.cta2_text || "",
      cta2_link: banner.cta2_link || "",
      page_path: banner.page_path || "home"
    });
    setEditingId(banner.id);
    setShowForm(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`${API_URL}/api/banners/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ is_active: !current })
      });
      if (res.ok) {
        fetchBanners();
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    try {
      const res = await fetch(`${API_URL}/api/banners/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (res.ok) {
        toast.success("Banner deleted");
        fetchBanners();
      } else {
        toast.error("Failed to delete banner");
      }
    } catch (err) {
      toast.error("Error deleting banner");
    }
  };

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-heading">Manage Hero Banners</h1>
          <p className="text-sm text-slate-500">Add, reorder, and manage banners for various pages</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl" onClick={() => {
          setForm({ title: "", subtitle: "", image_url: "", mobile_image_url: "", video_url: "", cta_text: "", cta_link: "", badge_text: "", cta2_text: "", cta2_link: "", page_path: "home" });
          setEditingId(null);
          setShowForm(!showForm);
        }}>
          <Plus className="h-4 w-4 mr-1" />
          Add Banner
        </Button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="font-semibold text-lg text-slate-800">{editingId ? "Edit Banner" : "New Banner"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Target Page</label>
              <select
                className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={form.page_path}
                onChange={(e) => setForm({ ...form, page_path: e.target.value })}
              >
                {PAGES.map((p, idx) => (
                  <option
                    key={`${p.value}-${idx}`}
                    value={p.value}
                    disabled={p.label.startsWith("---")}
                    className="bg-white text-slate-800"
                  >
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">Banner Title (Optional)</label>
                <span className={`text-[10px] ${form.title.length > 90 ? "text-red-500 font-bold" : "text-slate-400"}`}>
                  {form.title.length}/90 characters
                </span>
              </div>
              <Input
                placeholder="E.g. Invest in IPOs"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="h-11 border-slate-200 bg-white text-slate-800 rounded-xl focus-visible:ring-amber-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Badge Text (Optional)</label>
              <Input
                placeholder="Badge Text (Optional)"
                value={form.badge_text}
                onChange={(e) => setForm({ ...form, badge_text: e.target.value })}
                className="h-11 border-slate-200 bg-white text-slate-800 rounded-xl focus-visible:ring-amber-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Primary CTA Text (Optional)</label>
              <Input
                placeholder="Primary CTA Text (Optional)"
                value={form.cta_text}
                onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
                className="h-11 border-slate-200 bg-white text-slate-800 rounded-xl focus-visible:ring-amber-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Primary CTA Link (Optional)</label>
              <Input
                placeholder="Primary CTA Link (Optional)"
                value={form.cta_link}
                onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
                className="h-11 border-slate-200 bg-white text-slate-800 rounded-xl focus-visible:ring-amber-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Secondary CTA Text (Optional)</label>
              <Input
                placeholder="Secondary CTA Text (Optional)"
                value={form.cta2_text}
                onChange={(e) => setForm({ ...form, cta2_text: e.target.value })}
                className="h-11 border-slate-200 bg-white text-slate-800 rounded-xl focus-visible:ring-amber-500"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Secondary CTA Link (Optional)</label>
              <Input
                placeholder="Secondary CTA Link (Optional)"
                value={form.cta2_link}
                onChange={(e) => setForm({ ...form, cta2_link: e.target.value })}
                className="h-11 border-slate-200 bg-white text-slate-800 rounded-xl focus-visible:ring-amber-500"
              />
            </div>

            <div className="md:col-span-1 space-y-2">
              <label className="text-sm font-semibold text-slate-700 font-sans">Desktop Image *</label>
              <label className="flex items-center h-12 gap-2 cursor-pointer border border-dashed border-slate-200 hover:border-amber-500/50 bg-slate-50 rounded-xl px-4 transition-colors">
                <Upload className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-500 truncate">{uploading ? "Uploading..." : form.image_url ? "Desktop Image uploaded ✓" : "Upload Desktop Image"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} disabled={uploading} />
              </label>
            </div>

            <div className="md:col-span-1 space-y-2">
              <label className="text-sm font-semibold text-slate-700 font-sans">Mobile Image (Optional)</label>
              <label className="flex items-center h-12 gap-2 cursor-pointer border border-dashed border-slate-200 hover:border-amber-500/50 bg-slate-50 rounded-xl px-4 transition-colors">
                <Upload className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-500 truncate">{uploading ? "Uploading..." : form.mobile_image_url ? "Mobile Image uploaded ✓" : "Upload Mobile Image"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'mobile_image')} disabled={uploading} />
              </label>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-slate-700 font-sans">Banner Video (Optional)</label>
              <label className="flex items-center h-12 gap-2 cursor-pointer border border-dashed border-slate-200 hover:border-amber-500/50 bg-slate-50 rounded-xl px-4 transition-colors">
                <Upload className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-500 truncate">{uploading ? "Uploading..." : form.video_url ? "Video uploaded ✓" : "Upload Video"}</span>
                <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'video')} disabled={uploading} />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700">Subtitle / Description (Optional)</label>
              <span className={`text-[10px] ${form.subtitle.length > 90 ? "text-red-500 font-bold" : "text-slate-400"}`}>
                {form.subtitle.length}/90 characters
              </span>
            </div>
            <Textarea
              placeholder="Type Description only in 90 characters"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="border-slate-200 bg-white text-slate-800 rounded-xl focus-visible:ring-amber-500 min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {form.image_url && (
              <div className="space-y-1 bg-slate-55 p-2 rounded-xl border border-slate-200">
                <p className="text-[10px] font-semibold text-slate-500">Desktop Image Preview</p>
                <div className="h-32 w-full relative overflow-hidden rounded-lg">
                  <img src={getImageUrl(form.image_url)} alt="Preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
            {form.mobile_image_url && (
              <div className="space-y-1 bg-slate-55 p-2 rounded-xl border border-slate-200">
                <p className="text-[10px] font-semibold text-slate-500">Mobile Image Preview</p>
                <div className="h-32 w-full relative overflow-hidden rounded-lg">
                  <img src={getImageUrl(form.mobile_image_url)} alt="Mobile Preview" className="w-full h-full object-cover" />
                </div>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] text-destructive hover:bg-destructive/10" onClick={() => setForm({ ...form, mobile_image_url: "" })}>Remove Mobile Image</Button>
              </div>
            )}
            {form.video_url && (
              <div className="space-y-1 bg-slate-55 p-2 rounded-xl border border-slate-200">
                <p className="text-[10px] font-semibold text-slate-500">Video Preview</p>
                <div className="h-32 w-full relative overflow-hidden rounded-lg">
                  <video src={getImageUrl(form.video_url)} autoPlay muted loop className="w-full h-full object-cover" />
                </div>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] text-destructive hover:bg-destructive/10" onClick={() => setForm({ ...form, video_url: "" })}>Remove Video</Button>
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} disabled={uploading} className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl">
              {editingId ? "Update Banner" : "Save Banner"}
            </Button>
            <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-55 hover:text-slate-800 rounded-xl" onClick={() => {
              setShowForm(false);
              setEditingId(null);
              setForm({ title: "", subtitle: "", image_url: "", mobile_image_url: "", video_url: "", cta_text: "", cta_link: "", badge_text: "", cta2_text: "", cta2_link: "", page_path: "home" });
            }}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-slate-500 flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            Loading banners…
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
            No banners yet. Add your first one above.
          </div>
        ) : (
          banners.map((banner) => (
            <div key={banner.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <GripVertical className="h-5 w-5 text-slate-400 shrink-0 cursor-grab hidden sm:block" />
                <div className="w-32 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative group border border-slate-200">
                  {banner.image_url ? (
                    <>
                      <img src={getImageUrl(banner.image_url)} alt="" className="w-full h-full object-cover" />
                      {banner.video_url && (
                        <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5 ring-1 ring-white/30">
                            <Play className="h-4 w-4 text-white fill-white" />
                          </div>
                        </div>
                      )}
                    </>
                  ) : banner.video_url ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50/5 text-blue-600 gap-1 border border-blue-100">
                      <Film className="h-6 w-6" />
                      <span className="text-[10px] font-bold tracking-wider uppercase">Video</span>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400"><Image className="h-6 w-6" /></div>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-800 truncate text-base">{banner.title || "Untitled Banner"}</h3>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-slate-100 text-slate-600 border-none">
                    {PAGES.find(p => p.value === (banner.page_path || "home"))?.label || banner.page_path || "Home"}
                  </Badge>
                  {banner.mobile_image_url && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-emerald-50 text-emerald-600 border-emerald-200">
                      Mobile Image
                    </Badge>
                  )}
                  {banner.video_url && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-blue-50 text-blue-600 border-blue-200">
                      Video
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate">{banner.subtitle || "No description"}</p>
                {banner.cta_text && (
                  <p className="text-xs text-amber-600 font-semibold mt-1">
                    {banner.cta_text} → <span className="text-slate-500 font-normal">{banner.cta_link}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t border-slate-100 sm:border-t-0">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={banner.is_active}
                    onCheckedChange={() => toggleActive(banner.id, banner.is_active)}
                    className="data-[state=checked]:bg-amber-500"
                  />
                </div>
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-lg" onClick={() => handleEdit(banner)}>
                  Edit
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg" onClick={() => deleteBanner(banner.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
