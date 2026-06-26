"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Trash2, Loader2, Download } from "lucide-react";
import { API_URL } from "@/lib/constants";

interface Subscriber {
  id: number;
  email: string;
  is_subscribed: boolean;
  created_at: string;
}

export default function SubscriptionsClient() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getHeaders = (json = true) => {
    const h: Record<string, string> = {};
    if (json) h["Content-Type"] = "application/json";
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) h["Authorization"] = `Bearer ${token}`;
    }
    return h;
  };

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/subscriptions`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data);
      }
    } catch (err) {
      console.error("Failed to fetch subscribers", err);
      toast.error("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return;

    try {
      const res = await fetch(`${API_URL}/api/subscriptions/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });

      if (res.ok) {
        toast.success("Subscriber deleted successfully");

        setSubscribers((prev) => {
          const updated = prev.filter((s) => s.id !== id);
          if ((currentPage - 1) * itemsPerPage >= updated.length) {
            setCurrentPage((p) => Math.max(p - 1, 1));
          }
          return updated;
        });
      } else {
        toast.error("Failed to delete subscriber");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    }
  };

  const exportToCSV = () => {
    const headers = ["Email", "Status", "Subscribed At"];
    const rows = currentData.map((s) => [
      s.email,
      s.is_subscribed ? "Active" : "Inactive",
      new Date(s.created_at).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `subscriptions_page_${currentPage}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAllData = () => {
    const headers = ["Email", "Status", "Subscribed At"];
    const rows = subscribers.map((s) => [
      s.email,
      s.is_subscribed ? "Active" : "Inactive",
      new Date(s.created_at).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `subscriptions_all_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(subscribers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = subscribers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Newsletter Subscriptions</h1>
          <p className="text-sm text-muted-foreground">Manage your email subscriber list</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2 text-foreground">
            <Download className="h-4 w-4" />
            Export Current Page
          </Button>

          <Button onClick={exportAllData} variant="default" className="flex items-center gap-2 text-primary-foreground">
            <Download className="h-4 w-4" />
            Export All Data
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Fetching subscribers...</p>
          </div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-20">
            <Mail className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No subscribers found</h3>
            <p className="text-muted-foreground max-w-xs mx-auto">Emails will appear here once users subscribe via the home page.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-foreground">Email Address</TableHead>
                  <TableHead className="text-foreground">Status</TableHead>
                  <TableHead className="text-foreground">Subscription Date</TableHead>
                  <TableHead className="text-right text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium text-foreground">{subscriber.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${subscriber.is_subscribed
                        ? "bg-brand-green/20 text-brand-green"
                        : "bg-muted text-brand-red"
                        }`}>
                        {subscriber.is_subscribed ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(subscriber.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(subscriber.id)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 py-4">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  variant="outline"
                  className="text-foreground"
                >
                  Prev
                </Button>

                {(() => {
                  const pages = [];
                  const showEllipsis = totalPages > 7;
                  if (!showEllipsis) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    pages.push(1);
                    if (currentPage > 4) pages.push('...');
                    const start = Math.max(2, currentPage - 2);
                    const end = Math.min(totalPages - 1, currentPage + 2);
                    for (let i = start; i <= end; i++) {
                      if (!pages.includes(i)) pages.push(i);
                    }
                    if (currentPage < totalPages - 3) pages.push('...');
                    if (!pages.includes(totalPages)) pages.push(totalPages);
                  }
                  return pages.map((p, idx) => (
                    p === '...' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground text-xs">...</span>
                    ) : (
                      <Button
                        key={idx}
                        variant={currentPage === p ? "default" : "outline"}
                        onClick={() => setCurrentPage(Number(p))}
                        className={`w-10 h-10 ${currentPage === p ? "text-primary-foreground" : "text-foreground"}`}
                      >
                        {p}
                      </Button>
                    )
                  ));
                })()}

                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  variant="outline"
                  className="text-foreground"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
