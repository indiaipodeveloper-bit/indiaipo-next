"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/constants";

interface Category {
  id: number;
  name: string;
  slug: string;
  type: string;
  status: string;
}

export default function BankerCategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Category>>({});
  const [isCreating, setIsCreating] = useState(false);

  const getHeaders = (json = true) => {
    const h: Record<string, string> = {};
    if (json) h["Content-Type"] = "application/json";
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) h["Authorization"] = `Bearer ${token}`;
    }
    return h;
  };

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/api/banker-subcategories`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async () => {
    if (!editForm.name || !editForm.type) {
      alert("Name and Type are required");
      return;
    }

    try {
      if (isEditing) {
        await fetch(`${API_URL}/api/banker-subcategories/${isEditing}`, {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify(editForm),
        });
      } else {
        await fetch(`${API_URL}/api/banker-subcategories`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(editForm),
        });
      }
      setIsEditing(null);
      setIsCreating(false);
      setEditForm({});
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to save category");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await fetch(`${API_URL}/api/banker-subcategories/${id}`, { 
        method: "DELETE",
        headers: getHeaders()
      });
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Manage Banker Subcategories</h2>
          <p className="text-muted-foreground text-sm">Add or edit subcategories for SME and Mainboard bankers.</p>
        </div>
        {!isCreating && !isEditing && (
          <Button onClick={() => { setIsCreating(true); setEditForm({ type: 'sme', status: 'active' }); }} className="bg-primary text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" /> Add Subcategory
          </Button>
        )}
      </div>

      {(isCreating || isEditing !== null) && (
        <div className="bg-muted/30 p-4 rounded-lg mb-6 border border-border flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase">Subcategory Name</label>
            <input
              type="text"
              value={editForm.name || ""}
              onChange={e => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm text-foreground bg-background"
              placeholder="e.g. Compare SME Merchant Bankers"
            />
          </div>
          <div className="w-48">
            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase">Type</label>
            <select
              value={editForm.type || "sme"}
              onChange={e => setEditForm({ ...editForm, type: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm bg-background text-foreground"
            >
              <option value="sme">SME</option>
              <option value="mainboard">Mainboard</option>
            </select>
          </div>
          <div className="w-32">
            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase">Status</label>
            <select
              value={editForm.status || "active"}
              onChange={e => setEditForm({ ...editForm, status: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm bg-background text-foreground"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
            <Button onClick={() => { setIsCreating(false); setIsEditing(null); }} variant="outline" className="text-foreground">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-border/60">
              <th className="py-3 px-4 font-semibold text-foreground">ID</th>
              <th className="py-3 px-4 font-semibold text-foreground">Name</th>
              <th className="py-3 px-4 font-semibold text-foreground">Type</th>
              <th className="py-3 px-4 font-semibold text-foreground">Status</th>
              <th className="py-3 px-4 font-semibold text-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {categories.map(cat => (
              <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 text-muted-foreground">#{cat.id}</td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-foreground">{cat.name}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">{cat.slug}</div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${cat.type === 'sme' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                    {cat.type}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${cat.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-muted text-muted-foreground border border-border/30'}`}>
                    {cat.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setIsEditing(cat.id); setEditForm(cat); setIsCreating(false); }}
                      className="h-8 w-8 text-blue-500 hover:bg-blue-500/10"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(cat.id)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  No subcategories found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
