"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Briefcase 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { API_URL } from "@/lib/constants";

interface CareerRole {
  id: number;
  title: string;
  is_active: number;
  created_at: string;
}

export default function CareerRolesClient() {
  const [roles, setRoles] = useState<CareerRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRoleTitle, setNewRoleTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const getHeaders = (json = true) => {
    const h: Record<string, string> = {};
    if (json) h["Content-Type"] = "application/json";
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) h["Authorization"] = `Bearer ${token}`;
    }
    return h;
  };

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/career/admin/roles`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setRoles(data);
      } else {
        toast.error("Failed to load career roles");
      }
    } catch (err) {
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleTitle.trim()) {
      toast.error("Please enter a role title");
      return;
    }

    setAdding(true);
    try {
      const res = await fetch(`${API_URL}/api/career/admin/roles`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ title: newRoleTitle.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Role added successfully");
        setNewRoleTitle("");
        fetchRoles();
      } else {
        toast.error(data.error || "Failed to add role");
      }
    } catch (err) {
      toast.error("Error adding role");
    } finally {
      setAdding(false);
    }
  };

  const handleToggleStatus = async (role: CareerRole) => {
    setUpdatingId(role.id);
    const newStatus = role.is_active === 1 ? 0 : 1;
    try {
      const res = await fetch(`${API_URL}/api/career/admin/roles/${role.id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ is_active: newStatus }),
      });

      if (res.ok) {
        toast.success(`Role set to ${newStatus === 1 ? "Active" : "Inactive"}`);
        setRoles((prev) =>
          prev.map((r) => (r.id === role.id ? { ...r, is_active: newStatus } : r))
        );
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update role status");
      }
    } catch (err) {
      toast.error("Error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteRole = async (id: number) => {
    if (!confirm("Are you sure you want to delete this role? Any career forms utilizing it may revert to fallback values.")) return;

    try {
      const res = await fetch(`${API_URL}/api/career/admin/roles/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (res.ok) {
        toast.success("Role deleted successfully");
        fetchRoles();
      } else {
        toast.error("Failed to delete role");
      }
    } catch (err) {
      toast.error("Error deleting role");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">Manage Career Roles</h1>
        <p className="text-sm text-muted-foreground">Add, activate, or deactivate positions available for job applicants.</p>
      </div>

      {/* Form to Add New Role */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wider">Add Job Opening Role</h2>
        <form onSubmit={handleAddRole} className="flex gap-4 max-w-xl">
          <Input
            type="text"
            placeholder="e.g. Node.js Developer, Graphic Designer"
            value={newRoleTitle}
            onChange={(e) => setNewRoleTitle(e.target.value)}
            className="flex-1 h-10 bg-card text-foreground"
            required
          />
          <Button type="submit" disabled={adding} className="h-10 px-5 text-primary-foreground">
            {adding ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Add Role
          </Button>
        </form>
      </div>

      {/* Roles Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
            <p className="text-muted-foreground text-sm">Loading roles...</p>
          </div>
        ) : roles.length === 0 ? (
          <div className="text-center py-20 bg-card">
            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground/20 mb-4" />
            <p className="text-muted-foreground text-sm">No roles found in the database. Add one above.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-secondary/50 border-b border-border text-foreground/80 font-bold">
                <th className="px-6 py-4">Role Title</th>
                <th className="px-6 py-4">Created On</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-secondary/15 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">
                    {role.title}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(role.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(role)}
                      disabled={updatingId === role.id}
                      title="Click to toggle active status"
                      className="transition-opacity hover:opacity-85 focus:outline-none"
                    >
                      <Badge
                        variant={role.is_active === 1 ? "secondary" : "outline"}
                        className={`flex items-center gap-1 w-fit select-none cursor-pointer py-1 px-2.5 rounded-full text-xs font-semibold ${
                          role.is_active === 1
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {updatingId === role.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : role.is_active === 1 ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {role.is_active === 1 ? "Active" : "Inactive"}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRole(role.id)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      title="Delete Role"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
