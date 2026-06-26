"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp, Users, FileText, BookOpen, MessageSquare,
  BarChart3, Star, Briefcase, Bell, UserCheck, Building2,
  RefreshCw, Mail, ChevronRight, Activity
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { API_URL } from "@/lib/constants";

interface DashboardStats {
  totalIPOs: number;
  activeIPOs: number;
  upcomingIPOs: number;
  totalBlogs: number;
  totalReports: number;
  totalUsers: number;
  totalLeads: number;
  unreadLeads: number;
  totalSubscriptions: number;
  totalConsultantEnquiries: number;
  unreadConsultantEnquiries: number;
  totalMerchantEnquiries: number;
  unreadMerchantEnquiries: number;
  totalInvestorEnquiries: number;
  totalCareerApplications: number;
  totalAdminBlogs: number;
  leadsTrend: { month: string; count: number }[];
  subscriptionsTrend: { month: string; count: number }[];
  enquiryBreakdown: { type: string; count: number }[];
  recentActivity: { type: string; name: string; email: string; created_at: string }[];
}

const CHART_COLORS = ["#6366f1", "#22d3ee", "#f59e0b", "#10b981", "#f43f5e", "#a78bfa"];

const PIE_COLORS: Record<string, string> = {
  Consultant: "#6366f1",
  Merchant: "#22d3ee",
  Investor: "#f59e0b",
  Leads: "#10b981",
};

const activityIcon: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  lead: { icon: MessageSquare, color: "text-emerald-600", label: "New Lead" },
  consultant_enquiry: { icon: UserCheck, color: "text-indigo-600", label: "Consultant Enquiry" },
  merchant_enquiry: { icon: Building2, color: "text-cyan-600", label: "Merchant Enquiry" },
  investor: { icon: Star, color: "text-yellow-600", label: "Investor Interest" },
  career: { icon: Briefcase, color: "text-amber-600", label: "Career Application" },
};

function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  badge,
  badgeColor,
  href,
  sub,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  badge?: number;
  badgeColor?: string;
  href: string;
  sub?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative shadow-sm overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300 hover:bg-slate-50/50 transition-all duration-300 hover:-translate-y-0.5 block"
    >
      <div
        className={`absolute -top-6 -right-6 h-24 w-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${color}`}
      />
      <div className="relative flex items-start justify-between">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {label}
          </span>
          <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </span>
          {sub && (
            <span className="text-[11px] text-slate-500 font-medium truncate flex items-center gap-1">
              {sub}
            </span>
          )}
        </div>
        <div
          className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-md`}
        >
          <Icon className="h-5 w-5 text-white" />
          {badge !== undefined && badge > 0 && (
            <span
              className={`absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black text-white ${badgeColor || "bg-red-500"}`}
            >
              {badge > 99 ? "99+" : badge}
            </span>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-amber-600 transition-colors">
        View Details
        <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
}

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return percent > 0.05 ? (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

export default function AdminDashboardClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  const getHeaders = () => {
    const h: Record<string, string> = {
      "Content-Type": "application/json"
    };
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) h["Authorization"] = `Bearer ${token}`;
    }
    return h;
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/dashboard/stats`, {
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setLastUpdated(new Date());
      }
    } catch (e) {
      console.error("Failed to fetch dashboard stats", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const statCards = stats
    ? [
        {
          label: "Total IPOs",
          value: stats.totalIPOs,
          icon: TrendingUp,
          color: "from-indigo-500 to-purple-600",
          href: "/admin/ipos",
          sub: `${stats.activeIPOs} Active · ${stats.upcomingIPOs} Upcoming`,
        },
        {
          label: "Leads",
          value: stats.totalLeads,
          icon: MessageSquare,
          color: "from-emerald-500 to-teal-600",
          href: "/admin/leads",
          badge: stats.unreadLeads,
          badgeColor: "bg-red-600",
          sub: `${stats.unreadLeads} unread`,
        },
        {
          label: "Consultant Enquiries",
          value: stats.totalConsultantEnquiries,
          icon: UserCheck,
          color: "from-violet-500 to-indigo-600",
          href: "/admin/consultant-enquiries",
          badge: stats.unreadConsultantEnquiries,
          badgeColor: "bg-red-600",
          sub: `${stats.unreadConsultantEnquiries} unread`,
        },
        {
          label: "Merchant Enquiries",
          value: stats.totalMerchantEnquiries,
          icon: Building2,
          color: "from-cyan-500 to-blue-600",
          href: "/admin/merchant-enquiries",
          badge: stats.unreadMerchantEnquiries,
          badgeColor: "bg-red-600",
          sub: `${stats.unreadMerchantEnquiries} unread`,
        },
        {
          label: "Investor Enquiries",
          value: stats.totalInvestorEnquiries,
          icon: Star,
          color: "from-amber-500 to-orange-600",
          href: "/admin/investors",
          sub: "Total investor interests",
        },
        {
          label: "Subscriptions",
          value: stats.totalSubscriptions,
          icon: Bell,
          color: "from-pink-500 to-rose-600",
          href: "/admin/subscriptions",
          sub: "Active newsletter subs",
        },
        {
          label: "Career Applications",
          value: stats.totalCareerApplications,
          icon: Briefcase,
          color: "from-lime-500 to-green-600",
          href: "/admin/career-applications",
          sub: "Pending review",
        },
        {
          label: "Users",
          value: stats.totalUsers,
          icon: Users,
          color: "from-fuchsia-500 to-purple-600",
          href: "/admin/users",
          sub: "Registered accounts",
        },
        {
          label: "Reports",
          value: stats.totalReports,
          icon: FileText,
          color: "from-teal-500 to-cyan-600",
          href: "/admin/reports",
          sub: "IPO research reports",
        },
        {
          label: "Blogs",
          value: stats.totalBlogs + stats.totalAdminBlogs,
          icon: BookOpen,
          color: "from-blue-500 to-indigo-600",
          href: "/admin/blogs",
          sub: `${stats.totalAdminBlogs} IPO blogs`,
        },
      ]
    : [];

  const totalEnquiries =
    (stats?.totalLeads ?? 0) +
    (stats?.totalConsultantEnquiries ?? 0) +
    (stats?.totalMerchantEnquiries ?? 0) +
    (stats?.totalInvestorEnquiries ?? 0);

  return (
    <div className="space-y-8 px-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time overview of your IPO platform activity
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all border disabled:opacity-60 cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {lastUpdated ? `Updated ${timeAgo(lastUpdated.toISOString())}` : "Refresh"}
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading && !stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-2xl border border-slate-200 bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      )}

      {/* Recent Enquiries Activity */}
      {stats && stats.recentActivity.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-extrabold text-xl text-slate-800 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-amber-500" />
                Latest Frontend Enquiries
              </h3>
              <p className="text-xs text-slate-500 mt-1">Review the most recent incoming enquiries from your website</p>
            </div>
            <Link href="/admin/leads" className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1 group">
              View All Enquiries
              <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.recentActivity.slice(0, 6).map((item, i) => {
              const meta = activityIcon[item.type] || { icon: Bell, color: "text-slate-500", label: "Event" };
              const Icon = meta.icon;

              const bgColors: Record<string, string> = {
                "text-emerald-600": "bg-emerald-50 border-emerald-100 text-emerald-600",
                "text-indigo-600": "bg-indigo-50 border-indigo-100 text-indigo-600",
                "text-cyan-600": "bg-cyan-50 border-cyan-100 text-cyan-600",
                "text-yellow-600": "bg-yellow-50 border-yellow-100 text-yellow-600",
                "text-amber-600": "bg-amber-50 border-amber-100 text-amber-600",
              };
              const iconCls = bgColors[meta.color] || "bg-slate-100 border-slate-200 text-slate-500";

              const hrefs: Record<string, string> = {
                'lead': '/admin/leads',
                'consultant_enquiry': '/admin/consultant-enquiries',
                'merchant_enquiry': '/admin/merchant-enquiries',
                'investor': '/admin/investors',
                'career': '/admin/career-applications'
              };

              return (
                <Link
                  key={i}
                  href={hrefs[item.type] || '#'}
                  className="flex flex-col gap-3 rounded-xl bg-slate-50/50 border border-slate-200 p-4 hover:bg-slate-100/50 hover:border-slate-300 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${iconCls}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {timeAgo(item.created_at)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 truncate">{item.name}</p>
                    <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                      <Mail className="h-3 w-3 opacity-70 text-amber-500" />
                      {item.email}
                    </p>
                  </div>
                  <div className="mt-auto pt-2 flex items-center justify-between border-t border-slate-200/60">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">
                      {meta.label}
                    </span>
                    <TrendingUp className="h-3 w-3 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Recharts Graphs */}
      {mounted && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leads Trend */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">Leads Trend</h3>
                <p className="text-xs text-slate-500 mt-0.5">Last 6 months incoming leads</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            {(() => {
              let chartData = stats.leadsTrend.length > 0 ? [...stats.leadsTrend] : [];
              if (chartData.length === 1) {
                chartData = [
                  { month: '', count: 0 },
                  { month: '', count: 0 },
                  chartData[0],
                  { month: '', count: 0 },
                ];
              }
              if (chartData.length === 0) {
                return (
                  <div className="h-52 flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
                    <Activity className="h-8 w-8 opacity-30 text-slate-400" />
                    <span>No leads data yet</span>
                  </div>
                );
              }
              return (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} width={30} />
                    <Tooltip
                      contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, color: "#1e293b" }}
                    />
                    <Area type="monotone" dataKey="count" name="Leads" stroke="#10b981" strokeWidth={2} fill="url(#leadsGrad)" dot={{ fill: "#10b981", r: 4, strokeWidth: 1.5, stroke: "#ffffff" }} activeDot={{ r: 6, fill: "#10b981" }} />
                  </AreaChart>
                </ResponsiveContainer>
              );
            })()}
          </div>

          {/* Enquiry Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">Enquiry Breakdown</h3>
                <p className="text-xs text-slate-500 mt-0.5">By category</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2.5 py-1 rounded-full">
                All time
              </span>
            </div>
            {totalEnquiries > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie
                      data={stats.enquiryBreakdown.filter(e => e.count > 0)}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      innerRadius={35}
                      labelLine={false}
                      label={renderCustomLabel}
                      strokeWidth={2}
                      stroke="#ffffff"
                    >
                      {stats.enquiryBreakdown.map((entry) => (
                        <Cell key={entry.type} fill={PIE_COLORS[entry.type] || CHART_COLORS[0]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, color: "#1e293b" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {stats.enquiryBreakdown.map((entry) => (
                    <div key={entry.type} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[entry.type] }} />
                        {entry.type}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{entry.count}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-52 flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
                <BarChart3 className="h-8 w-8 opacity-30 text-slate-400" />
                <span>No enquiry data yet</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subscription Growth & Recent Activities */}
      {mounted && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subscriptions Growth */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">Subscriptions Growth</h3>
                <p className="text-xs text-slate-500 mt-0.5">Last 6 months</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-pink-700 bg-pink-50 border border-pink-200/60 px-2.5 py-1 rounded-full">
                Newsletter
              </span>
            </div>
            {(() => {
              let chartData = stats.subscriptionsTrend.length > 0 ? [...stats.subscriptionsTrend] : [];
              if (chartData.length === 1) {
                chartData = [{ month: '', count: 0 }, chartData[0], { month: '', count: 0 }];
              }
              if (chartData.length === 0) {
                return (
                  <div className="h-48 flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
                    <Bell className="h-8 w-8 opacity-30 text-slate-400" />
                    <span>No subscription data yet</span>
                  </div>
                );
              }
              return (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} barSize={20} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
                    <Tooltip
                      contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, color: "#1e293b" }}
                    />
                    <Bar dataKey="count" name="Subscribers" radius={[4, 4, 0, 0]}>
                      {chartData.map((_, index) => (
                        <Cell key={index} fill={`hsl(${320 + index * 12}, 70%, 55%)`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              );
            })()}
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">Recent Activity</h3>
                <p className="text-xs text-slate-500 mt-0.5">Latest platform actions</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200/60 px-2.5 py-1 rounded-full">
                Real-time
              </span>
            </div>
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
              {stats.recentActivity.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-6">No recent activity</p>
              )}
              {stats.recentActivity.map((item, i) => {
                const meta = activityIcon[item.type] || { icon: Bell, color: "text-slate-500", label: "Event" };
                const Icon = meta.icon;

                const bgColors: Record<string, string> = {
                  "text-emerald-600": "bg-emerald-50 border-emerald-100 text-emerald-600",
                  "text-indigo-600": "bg-indigo-50 border-indigo-100 text-indigo-600",
                  "text-cyan-600": "bg-cyan-50 border-cyan-100 text-cyan-600",
                  "text-yellow-600": "bg-yellow-50 border-yellow-100 text-yellow-600",
                  "text-amber-600": "bg-amber-50 border-amber-100 text-amber-600",
                };
                const iconCls = bgColors[meta.color] || "bg-slate-100 border-slate-200 text-slate-500";

                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl bg-slate-50/50 border border-slate-200 px-4 py-3 hover:bg-slate-100/50 transition-all"
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${iconCls}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{item.name}</p>
                      <p className="text-xs text-slate-500 truncate font-medium">{meta.label} · {item.email}</p>
                    </div>
                    <span className="shrink-0 text-xs text-slate-500 ml-2 whitespace-nowrap">
                      {timeAgo(item.created_at)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
