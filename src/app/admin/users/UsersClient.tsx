"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Ban } from "lucide-react";

const mockUsers = [
  { id: "1", name: "Super Admin", email: "admin@indiaipo.in", role: "super_admin", status: "active", joined: "2024-01-15" },
  { id: "2", name: "Editor User", email: "editor@indiaipo.in", role: "editor", status: "active", joined: "2025-06-10" },
  { id: "3", name: "Priya Sharma", email: "priya@gmail.com", role: "investor", status: "active", joined: "2026-01-20" },
  { id: "4", name: "Amit Patel", email: "amit@company.com", role: "guest", status: "active", joined: "2026-02-15" },
];

const roleColor: Record<string, string> = {
  super_admin: "bg-red-50 text-red-700 border-red-200",
  admin: "bg-amber-50 text-amber-700 border-amber-200",
  editor: "bg-blue-50 text-blue-700 border-blue-200",
  investor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  guest: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function UsersClient() {
  return (
    <div className="space-y-6 text-slate-800 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 font-heading">Manage Users</h1>
        <p className="text-sm text-slate-500">{mockUsers.length} registered users</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left py-3 px-4 font-bold text-slate-600">Name</th>
                <th className="text-left py-3 px-4 font-bold text-slate-600 hidden md:table-cell">Email</th>
                <th className="text-left py-3 px-4 font-bold text-slate-600">Role</th>
                <th className="text-left py-3 px-4 font-bold text-slate-600 hidden lg:table-cell">Joined</th>
                <th className="text-left py-3 px-4 font-bold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((u) => (
                <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-800">{u.name}</td>
                  <td className="py-3 px-4 text-slate-600 hidden md:table-cell">{u.email}</td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className={`px-2 py-0.5 rounded-full text-xs font-semibold ${roleColor[u.role] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                      {u.role.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-600 hidden lg:table-cell">{u.joined}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Select defaultValue={u.role} onValueChange={() => toast.success("Role updated!")}>
                        <SelectTrigger className="h-9 w-[130px] text-xs bg-white border-slate-200 text-slate-800 rounded-xl focus:ring-amber-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-800 rounded-xl">
                          <SelectItem value="super_admin" className="focus:bg-slate-100 focus:text-slate-800">Super Admin</SelectItem>
                          <SelectItem value="admin" className="focus:bg-slate-100 focus:text-slate-800">Admin</SelectItem>
                          <SelectItem value="editor" className="focus:bg-slate-100 focus:text-slate-800">Editor</SelectItem>
                          <SelectItem value="investor" className="focus:bg-slate-100 focus:text-slate-800">Investor</SelectItem>
                          <SelectItem value="guest" className="focus:bg-slate-100 focus:text-slate-800">Guest</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl" onClick={() => toast.success("User blocked")}>
                        <Ban className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
