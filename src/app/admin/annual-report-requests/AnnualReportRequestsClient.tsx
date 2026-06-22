"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Download, Mail, Loader2, Calendar, FileText, Hash } from "lucide-react";

interface ReportRequest {
  id: string;
  email: string;
  request_count: number;
  created_at: string;
  updated_at: string;
}

export default function AnnualReportRequestsClient() {
  const [requests, setRequests] = useState<ReportRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const getHeaders = (json = true) => {
    const h: Record<string, string> = {};
    if (json) h["Content-Type"] = "application/json";
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) h["Authorization"] = `Bearer ${token}`;
    }
    return h;
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/annual-report-requests", {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      } else {
        toast.error("Failed to load requests");
      }
    } catch (err) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleExport = () => {
    const csv = "Email,Request Count,First Requested At,Last Requested At\n" +
      requests.map((r) => `"${r.email}","${r.request_count}","${new Date(r.created_at).toLocaleString()}","${new Date(r.updated_at).toLocaleString()}"`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `annual-report-requests-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Requests exported successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Annual Report Requests</h1>
          <p className="text-sm text-muted-foreground">
            {requests.length} unique emails have requested the 2025 Annual Report.
          </p>
        </div>
        <Button variant="outline" className="border-accent/30 text-accent hover:bg-accent/5 font-semibold text-foreground" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <FileText className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p>No requests yet. When users request the PDF from the homepage, they will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="py-3.5 px-4 font-semibold text-muted-foreground">Email Address</th>
                  <th className="py-3.5 px-4 font-semibold text-muted-foreground text-center">Requests</th>
                  <th className="py-3.5 px-4 font-semibold text-muted-foreground">Last Requested At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-foreground">{req.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge variant="secondary" className="px-3 py-1 rounded-full font-bold">
                        <Hash className="h-3 w-3 mr-1 opacity-50 text-foreground" />
                        {req.request_count}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(req.updated_at).toLocaleDateString("en-IN", { 
                          day: "numeric", 
                          month: "short", 
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
