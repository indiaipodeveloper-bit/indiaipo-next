"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Users, 
  Send, 
  RefreshCcw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Mail, 
  Eye, 
  Loader2,
  AlertCircle,
  Search,
  Check,
  Filter
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getImageUrl } from "@/lib/utils";

interface Digest {
  id: number;
  title: string;
  image: string | null;
  pdf: string | null;
  created_at: string;
}

interface CampaignJob {
  id: number;
  user_email: string;
  exception?: string;
  processed_at?: string;
  failed_at?: string;
  created_at?: string;
}

interface Stats {
  total: number;
  processed: number;
  failed: number;
  pending: number;
}

type ViewFilter = 'audience' | 'processed' | 'failed' | 'pending';

export default function DailyDigestCampaignClient() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id");

  const [digests, setDigests] = useState<Digest[]>([]);
  const [tempDigestId, setTempDigestId] = useState<string | null>(initialId);
  const [selectedDigestId, setSelectedDigestId] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  
  const [filter, setFilter] = useState<ViewFilter>('audience');
  const [listData, setListData] = useState<CampaignJob[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [fetchingList, setFetchingList] = useState(false);
  const [startingCampaign, setStartingCampaign] = useState(false);
  const [retryingFailed, setRetryingFailed] = useState(false);
  const [retryingJobId, setRetryingJobId] = useState<number | null>(null);

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
    fetchDigests();
    if (initialId) {
      handleLoadCampaign(initialId);
    }
  }, [initialId]);

  useEffect(() => {
    if (selectedDigestId) {
      fetchStats();
      fetchFilteredList();
      const interval = setInterval(() => {
        fetchStats();
        if (filter !== 'audience') {
          fetchFilteredList(false);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedDigestId, filter]);

  const fetchDigests = async () => {
    try {
      const res = await fetch("/api/daily-digests?limit=100", {
        headers: getHeaders()
      });
      if (res.ok) {
        const result = await res.json();
        setDigests(result.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch digests");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadCampaign = (id: string) => {
    setSelectedDigestId(id);
    setFilter('audience');
    toast.success("Campaign details loaded");
  };

  const fetchStats = async () => {
    if (!selectedDigestId) return;
    try {
      const res = await fetch(`/api/daily-digests/stats?digest_id=${selectedDigestId}`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const result = await res.json();
        setStats(result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFilteredList = async (showLoading = true) => {
    if (!selectedDigestId) return;
    if (showLoading) setFetchingList(true);
    
    let endpoint = "";
    switch (filter) {
      case 'audience': endpoint = "/api/daily-digests/audience"; break;
      case 'processed': endpoint = `/api/daily-digests/processed-jobs?digest_id=${selectedDigestId}`; break;
      case 'failed': endpoint = `/api/daily-digests/failed-jobs?digest_id=${selectedDigestId}`; break;
      case 'pending': endpoint = `/api/daily-digests/pending-jobs?digest_id=${selectedDigestId}`; break;
    }

    try {
      const res = await fetch(endpoint, {
        headers: getHeaders()
      });
      if (res.ok) {
        const result = await res.json();
        const data = Array.isArray(result) ? result : (result.data || []);
        const normalized = data.map((item: any) => ({
          id: item.id || 0,
          user_email: item.email || item.user_email,
          ...item
        }));
        setListData(normalized);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoading) setFetchingList(false);
    }
  };

  const startCampaign = async () => {
    if (!selectedDigestId) return;
    setStartingCampaign(true);
    try {
      const res = await fetch(`/api/daily-digests/send/${selectedDigestId}`, {
        method: "POST",
        headers: getHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Campaign started!");
        setFilter('pending');
        fetchStats();
      } else {
        toast.error(data.message || "Failed to start campaign");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setStartingCampaign(false);
    }
  };

  const retryAllFailed = async () => {
    if (!selectedDigestId) return;
    setRetryingFailed(true);
    try {
      const res = await fetch("/api/daily-digests/retry-failed", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ digest_id: selectedDigestId })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Retry started!");
        setFilter('pending');
        fetchStats();
      } else {
        toast.error(data.message || "Failed to retry");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setRetryingFailed(false);
    }
  };

  const retryJob = async (id: number) => {
    setRetryingJobId(id);
    try {
      const res = await fetch(`/api/daily-digests/retry-job/${id}`, {
        method: "POST",
        headers: getHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Job re-queued");
        fetchStats();
        fetchFilteredList(false);
      } else {
        toast.error(data.message || "Retry failed");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setRetryingJobId(null);
    }
  };

  const selectedDigest = digests.find(d => String(d.id) === selectedDigestId);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-[2rem] border border-border shadow-sm">
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <Mail className="h-8 w-8 text-primary" />
            Daily Digest Campaign
          </h1>
          <p className="text-muted-foreground mt-1">Select a digest and click 'Check Audience' to start</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <Select 
            value={tempDigestId || ""} 
            onValueChange={setTempDigestId}
          >
            <SelectTrigger className="w-full md:w-[350px] h-12 bg-background border-border shadow-inner rounded-xl font-medium text-foreground">
              <SelectValue placeholder="Choose Daily Reporter Digest..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-popover border-border">
              {digests.map((d) => (
                <SelectItem key={d.id} value={String(d.id)} className="text-foreground">
                  {d.title} | {new Date(d.created_at).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            className="h-12 px-8 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95"
            onClick={() => tempDigestId && handleLoadCampaign(tempDigestId)}
            disabled={!tempDigestId || tempDigestId === selectedDigestId}
          >
            {selectedDigestId === tempDigestId ? (
              <><Check className="mr-2 h-5 w-5" /> Loaded</>
            ) : (
              <><Search className="mr-2 h-5 w-5" /> Check Audience</>
            )}
          </Button>
        </div>
      </div>

      {selectedDigestId ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Section */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card 
              className={`cursor-pointer transition-all hover:shadow-md rounded-2xl ${filter === 'audience' ? 'ring-2 ring-primary border-transparent bg-primary/5' : 'border-border shadow-sm'}`}
              onClick={() => setFilter('audience')}
            >
              <CardHeader className="pb-2 space-y-0">
                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Audience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-4xl font-black text-foreground">{stats?.total ?? listData.length}</div>
                  <Users className={`h-6 w-6 ${filter === 'audience' ? 'text-primary' : 'text-slate-300'}`} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 font-medium">Subscribed recipients</p>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all hover:shadow-md rounded-2xl ${filter === 'processed' ? 'ring-2 ring-emerald-500 border-transparent bg-emerald-50/50' : 'border-border shadow-sm'}`}
              onClick={() => setFilter('processed')}
            >
              <CardHeader className="pb-2 space-y-0">
                <CardTitle className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Processed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-4xl font-black text-emerald-600">{stats?.processed ?? 0}</div>
                  <CheckCircle2 className={`h-6 w-6 ${filter === 'processed' ? 'text-emerald-600' : 'text-emerald-200'}`} />
                </div>
                <p className="text-[10px] text-emerald-600/60 mt-2 font-medium">Successfully delivered</p>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all hover:shadow-md rounded-2xl ${filter === 'failed' ? 'ring-2 ring-rose-500 border-transparent bg-rose-50/50' : 'border-border shadow-sm'}`}
              onClick={() => setFilter('failed')}
            >
              <CardHeader className="pb-2 space-y-0">
                <CardTitle className="text-xs font-bold text-rose-600 uppercase tracking-widest">Failed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-4xl font-black text-rose-600">{stats?.failed ?? 0}</div>
                  <XCircle className={`h-6 w-6 ${filter === 'failed' ? 'text-rose-600' : 'text-rose-200'}`} />
                </div>
                <p className="text-[10px] text-rose-600/60 mt-2 font-medium">Delivery errors</p>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all hover:shadow-md rounded-2xl ${filter === 'pending' ? 'ring-2 ring-amber-500 border-transparent bg-amber-50/50' : 'border-border shadow-sm'}`}
              onClick={() => setFilter('pending')}
            >
              <CardHeader className="pb-2 space-y-0">
                <CardTitle className="text-xs font-bold text-amber-600 uppercase tracking-widest">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-4xl font-black text-amber-600">{stats?.pending ?? 0}</div>
                  <Clock className={`h-6 w-6 ${filter === 'pending' ? 'text-amber-600' : 'text-amber-200'}`} />
                </div>
                <p className="text-[10px] text-amber-600/60 mt-2 font-medium">Waiting in queue</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Dynamic List */}
            <Card className="border-border/60 shadow-xl overflow-hidden rounded-[2rem]">
              <CardHeader className="bg-muted/30 border-b border-border/40 py-6 px-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl bg-background shadow-sm ${
                      filter === 'audience' ? 'text-slate-600' :
                      filter === 'processed' ? 'text-emerald-600' :
                      filter === 'failed' ? 'text-rose-600' : 'text-amber-600'
                    }`}>
                      <Filter className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl capitalize font-black tracking-tight text-foreground">
                        {filter === 'audience' ? 'Target Audience' : `${filter} Emails`}
                      </CardTitle>
                      <CardDescription className="font-medium">
                        {filter === 'audience' ? 'Review all potential recipients' : 
                         filter === 'processed' ? 'Emails delivered successfully' :
                         filter === 'failed' ? 'Emails that encountered errors' :
                         'Emails currently in delivery queue'}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-white/50 px-4 py-1.5 rounded-full font-bold border-border shadow-sm text-foreground">{listData.length} Records</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                  <Table>
                    <TableHeader className="bg-muted/50 sticky top-0 z-10 backdrop-blur-md">
                      <TableRow className="border-border/40">
                        <TableHead className="w-16 text-center font-bold text-foreground">#</TableHead>
                        <TableHead className="font-bold text-foreground">Email Address</TableHead>
                        {filter === 'failed' && <TableHead className="font-bold text-foreground">Error Details</TableHead>}
                        {filter !== 'audience' && <TableHead className="font-bold text-foreground">Timestamp</TableHead>}
                        <TableHead className="text-right font-bold pr-8 text-foreground">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fetchingList ? (
                        <TableRow>
                          <TableCell colSpan={filter === 'failed' ? 5 : 4} className="h-64 text-center">
                            <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                              <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
                              <span className="font-bold text-lg">Syncing {filter} records...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : listData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={filter === 'failed' ? 5 : 4} className="h-48 text-center">
                            <div className="flex flex-col items-center justify-center gap-2 opacity-40">
                              <Mail className="h-12 w-12 text-foreground" />
                              <span className="font-bold text-foreground">No {filter} records found</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        listData.map((job, idx) => (
                          <TableRow key={job.id || job.user_email || idx} className="hover:bg-muted/30 transition-colors border-border/20">
                            <TableCell className="text-center text-[11px] font-bold text-slate-400">{idx + 1}</TableCell>
                            <TableCell className="font-semibold py-4 text-foreground">{job.user_email}</TableCell>
                            
                            {filter === 'failed' && (
                              <TableCell className="text-[11px] text-rose-600 max-w-[250px] leading-tight font-medium">
                                {job.exception}
                              </TableCell>
                            )}

                            {filter !== 'audience' && (
                              <TableCell className="text-[11px] text-muted-foreground whitespace-nowrap font-medium">
                                {new Date(job.processed_at || job.failed_at || job.created_at || "").toLocaleString()}
                              </TableCell>
                            )}

                            <TableCell className="text-right pr-8">
                              {filter === 'audience' && (
                                <Badge variant="secondary" className="font-bold text-[10px] uppercase tracking-widest bg-slate-100 text-slate-500 rounded-lg px-2.5">Ready</Badge>
                              )}
                              {filter === 'processed' && (
                                <Badge className="font-bold text-[10px] uppercase tracking-widest bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 rounded-lg px-2.5">Delivered</Badge>
                              )}
                              {filter === 'pending' && (
                                <Badge className="font-bold text-[10px] uppercase tracking-widest bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 animate-pulse rounded-lg px-2.5">Queued</Badge>
                              )}
                              {filter === 'failed' && (
                                <div className="flex justify-end items-center gap-2">
                                  <Badge className="font-bold text-[10px] uppercase tracking-widest bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200 rounded-lg px-2.5">Error</Badge>
                                  <Button 
                                    size="icon" 
                                    variant="outline" 
                                    className="h-8 w-8 rounded-lg border-rose-200 text-rose-600 hover:bg-rose-50"
                                    onClick={() => retryJob(job.id)}
                                    disabled={retryingJobId === job.id}
                                  >
                                    {retryingJobId === job.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Controls */}
          <div className="space-y-6">
            {/* Digest Preview */}
            <Card className="border-border/60 shadow-xl overflow-hidden rounded-[2rem]">
              <CardHeader className="bg-muted/30 border-b border-border/40 py-5">
                <CardTitle className="text-lg font-bold tracking-tight text-foreground">Digest Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                {selectedDigest?.image && (
                  <div className="rounded-2xl overflow-hidden border border-border shadow-md bg-slate-50 group relative">
                    <img 
                      src={getImageUrl(selectedDigest.image)} 
                      alt="Preview" 
                      className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm" className="rounded-full shadow-lg" asChild>
                        <a href={getImageUrl(selectedDigest.pdf) || "#"} target="_blank" rel="noreferrer">
                          <Eye className="h-4 w-4 mr-2" /> View Report
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <h3 className="font-black text-xl leading-tight text-foreground">{selectedDigest?.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 w-fit px-3 py-1 rounded-full">
                    <Clock className="h-3 w-3 text-primary" />
                    {selectedDigest ? new Date(selectedDigest.created_at).toLocaleDateString() : ''}
                  </div>
                </div>
                {selectedDigest?.pdf && (
                  <Button variant="outline" className="w-full rounded-xl border-border hover:bg-muted font-bold h-10 text-foreground" asChild>
                    <a href={getImageUrl(selectedDigest.pdf)} target="_blank" rel="noreferrer">
                      <Eye className="h-4 w-4 mr-2" /> PDF Details
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border-border/60 shadow-2xl rounded-[2rem] bg-slate-900 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Send className="h-24 w-24 rotate-12" />
              </div>
              <CardHeader className="py-6 px-8 border-b border-white/10 relative z-10">
                <CardTitle className="text-xl font-black flex items-center gap-3">
                  <Send className="h-6 w-6 text-primary" />
                  Launch Campaign
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6 relative z-10">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="flex gap-4">
                    <AlertCircle className="h-6 w-6 text-primary shrink-0" />
                    <div className="text-[11px] text-slate-300 leading-relaxed font-semibold">
                      Ready to broadcast to <strong className="text-white text-sm">{stats?.total ?? listData.length} recipients</strong>. 
                      Jobs will be processed in batches of 100 for maximum deliverability.
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full h-16 text-xl font-black bg-primary hover:bg-primary/90 text-slate-900 shadow-2xl shadow-primary/30 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:bg-slate-800 disabled:text-slate-600"
                    disabled={startingCampaign || listData.length === 0 || (stats?.pending ?? 0) > 0}
                    onClick={startCampaign}
                  >
                    {startingCampaign ? (
                      <><Loader2 className="h-7 w-7 mr-3 animate-spin text-slate-900" /> QUEUING...</>
                    ) : (stats?.pending ?? 0) > 0 ? (
                      <><Clock className="h-7 w-7 mr-3 animate-pulse text-slate-900" /> BROADCASTING</>
                    ) : (
                      <><Send className="h-7 w-7 mr-3 text-slate-900" /> START CAMPAIGN</>
                    )}
                  </Button>
                  
                  {(stats?.pending ?? 0) > 0 && (
                    <div className="flex items-center justify-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] animate-pulse">
                      <Clock className="h-3 w-3" />
                      {stats?.pending} Pending Deliveries
                    </div>
                  )}
                </div>

                {(stats?.failed ?? 0) > 0 && (
                  <Button 
                    variant="outline" 
                    className="w-full h-12 rounded-xl border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white font-black uppercase tracking-wider text-xs"
                    disabled={retryingFailed}
                    onClick={retryAllFailed}
                  >
                    {retryingFailed ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> RETRYING...</>
                    ) : (
                      <><RefreshCcw className="h-4 w-4 mr-2 animate-spin" /> Retry {stats?.failed} Failures</>
                    )}
                  </Button>
                )}
                
                <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/5">
                  <div className={`h-2 w-2 rounded-full ${selectedDigestId ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
                  <span className="text-[9px] uppercase font-black text-slate-500 tracking-[0.3em]">
                    {selectedDigestId ? 'SYSTEM_ARMED' : 'SYSTEM_IDLE'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-48 bg-card border border-dashed border-border rounded-[3rem] space-y-8 shadow-inner relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="h-32 w-32 rounded-[2rem] bg-primary/10 flex items-center justify-center relative z-10 rotate-3 group-hover:rotate-6 transition-transform duration-500">
            <Mail className="h-16 w-16 text-primary/40" />
          </div>
          <div className="text-center relative z-10 px-6">
            <h2 className="text-3xl font-black text-foreground tracking-tight">Campaign Launchpad</h2>
            <p className="text-muted-foreground max-w-sm mx-auto mt-3 leading-relaxed font-medium">
              Please select a Daily Digest from the menu above and click <strong>'Check Audience'</strong> to initialize your broadcast settings.
            </p>
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="h-1 w-20 bg-gradient-to-r from-transparent to-primary/20 rounded-full" />
            <div className="h-2 w-2 bg-primary/40 rounded-full animate-ping" />
            <div className="h-1 w-20 bg-gradient-to-l from-transparent to-primary/20 rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
}
