"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { User, Mail, Lock, Shield, Loader2 } from "lucide-react";
import { API_URL } from "@/lib/constants";

export default function ProfileClient() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getHeaders = (json = true) => {
    const h: Record<string, string> = {};
    if (json) h["Content-Type"] = "application/json";
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) h["Authorization"] = `Bearer ${token}`;
    }
    return h;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords don't match. New password and confirmation must be the same.");
      return;
    }

    if ((formData.newPassword || formData.email !== user?.email) && !formData.currentPassword) {
      toast.error("Current password required. Please enter your current password to change email or password.");
      return;
    }

    setLoading(true);
    try {
      const payload: Record<string, string> = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.currentPassword) {
        payload.currentPassword = formData.currentPassword;
      }
      if (formData.newPassword) {
        payload.newPassword = formData.newPassword;
      }

      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to update profile");
      }
      
      toast.success("Profile updated successfully!");

      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));

      // If email/password changed, we might need to re-login to get fresh token
      if (formData.newPassword || formData.email !== user?.email) {
         if (typeof window !== "undefined") {
           window.location.reload();
         }
      }
      
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-slate-800 font-sans">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 flex items-center gap-2 font-heading">
          <Shield className="h-8 w-8 text-amber-500" />
          Admin Profile & Security
        </h1>
        <p className="mt-2 text-sm text-slate-500 font-sans">
          Manage your account settings, update email and password securely.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b border-slate-100 pb-2 text-slate-800 font-heading">Personal Information</h3>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-700">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="pl-9 h-11 border-slate-200 bg-white text-slate-800 rounded-xl focus-visible:ring-amber-500"
                placeholder="Admin Name"
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-9 h-11 border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed rounded-xl focus-visible:ring-amber-500"
                placeholder="admin@indiaipo.in"
                readOnly
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-lg font-semibold border-b border-slate-200 pb-2 text-slate-800 font-heading">Security Updates</h3>
          <p className="text-xs text-slate-500">
            To change your email or password, you must enter your current password.
          </p>

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-700">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="pl-9 h-11 border-slate-200 bg-white text-slate-800 rounded-xl focus-visible:ring-amber-500"
                placeholder="Enter current password to make changes"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-slate-700 font-sans">New Password</label>
              <Input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="h-11 border-slate-200 bg-white text-slate-800 rounded-xl focus-visible:ring-amber-500 font-sans"
                placeholder="Leave blank to keep current"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-slate-700 font-sans">Confirm New Password</label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="h-11 border-slate-200 bg-white text-slate-800 rounded-xl focus-visible:ring-amber-500 font-sans"
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white rounded-xl px-6 h-11 font-semibold transition-colors">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
