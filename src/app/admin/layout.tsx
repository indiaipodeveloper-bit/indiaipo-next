"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, FileText, BookOpen, Users, MessageSquare, Settings, LogOut,
  Menu, X, TrendingUp, Globe, Navigation, Layout, Image, Building2,
  GraduationCap, Bell, Video, Newspaper, Briefcase, PlayCircle, ClipboardCheck,
  Megaphone, HelpCircle, LayoutGrid, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { API_URL } from "@/lib/constants";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Manage IPO Calendar", href: "/admin/ipos", icon: TrendingUp },
  { label: "Manage Sectors", href: "/admin/sectors", icon: LayoutGrid },
  { label: "List IPO By Sector", href: "/admin/sector-ipos", icon: LayoutGrid },
  { label: "SME Migration List", href: "/admin/sme-migration", icon: FileText },

  { label: "Manage Magazines", href: "/admin/magazines", icon: BookOpen },
  { label: "News / Updates", href: "/admin/news", icon: Newspaper },
  { label: "Manage Banker Categories", href: "/admin/banker-categories", icon: Building2 },
  { label: "Merchant Bankers (SME)", href: "/admin/merchant-bankers", icon: Building2 },
  { label: "Mainboard Bankers", href: "/admin/mainboard-bankers", icon: Building2 },

  { label: "Manage Registrars", href: "/admin/registrars", icon: Users },
  { label: "Registrar FAQs", href: "/admin/registrar-faqs", icon: HelpCircle },
  { label: "Notifications PDFs", href: "/admin/notifications", icon: Bell },

  { label: "Market Snaps", href: "/admin/market-snaps", icon: PlayCircle },
  { label: "Daily Reporter", href: "/admin/daily-digests", icon: FileText },
  { label: "Weekly Reporter", href: "/admin/weekly-digests", icon: FileText },
  { label: "Daily Digest Campaign", href: "/admin/daily-digest-campaign", icon: Megaphone },
  { label: "Leads", href: "/admin/leads", icon: MessageSquare, badgeKey: "leads" },
  { label: "Consultant Enquiries", href: "/admin/consultant-enquiries", icon: MessageSquare, badgeKey: "consultantEnquiries" },
  { label: "Merchant Enquiries", href: "/admin/merchant-enquiries", icon: MessageSquare, badgeKey: "merchantEnquiries" },
  { label: "Investor Enquiries", href: "/admin/investors", icon: Briefcase },
  { label: "Check IPO Eligibility", href: "/admin/ipo-feasibility", icon: ClipboardCheck },
  { label: "Career Applications", href: "/admin/career-applications", icon: GraduationCap },
  { label: "Manage Roles", href: "/admin/career-roles", icon: Briefcase },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: Mail },
  { label: "Annual Report Requests", href: "/admin/annual-report-requests", icon: FileText },
  { label: "Manage CSR", href: "/admin/csr", icon: Globe },
  { label: "Manage Consultants", href: "/admin/consultants", icon: Users },

  { label: "Manage Blogs", href: "/admin/ipo-blogs", icon: BookOpen },
  { label: "Site Popup", href: "/admin/popup", icon: Megaphone },
  { label: "Manage Banners", href: "/admin/banners", icon: Image },
  { label: "Manage Users", href: "/admin/users", icon: Users },
  { label: "SEO Settings", href: "/admin/seo", icon: Settings },
  { label: "Admin Profile", href: "/admin/profile", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAdmin, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadLeads, setUnreadLeads] = useState(0);
  const [unreadConsultantEnquiries, setUnreadConsultantEnquiries] = useState(0);
  const [unreadMerchantEnquiries, setUnreadMerchantEnquiries] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedScrollPos = sessionStorage.getItem("adminSidebarScroll");
    if (savedScrollPos && scrollRef.current) {
      scrollRef.current.scrollTop = parseInt(savedScrollPos);
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    sessionStorage.setItem("adminSidebarScroll", e.currentTarget.scrollTop.toString());
  };

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

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const headers = getHeaders();
        const res = await fetch(`${API_URL}/api/leads/unread`, { headers });
        if (res.ok) {
          const result = await res.json();
          const leads = result.data || [];
          setUnreadLeads(leads.length);
        }

        const resConsultant = await fetch(`${API_URL}/api/consultant-enquiries`, { headers });
        if (resConsultant.ok) {
          const enquiries = await resConsultant.json();
          const unread = enquiries.filter((e: any) => !e.is_read).length;
          setUnreadConsultantEnquiries(unread);
        }

        const resMerchant = await fetch(`${API_URL}/api/merchant-contact-enquiries`, { headers });
        if (resMerchant.ok) {
          const enquiries = await resMerchant.json();
          const unread = enquiries.filter((e: any) => !e.is_read).length;
          setUnreadMerchantEnquiries(unread);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUnread();

    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-800">Access Denied</h1>
          <p className="text-slate-500">You need admin privileges to access this page.</p>
          <Button className="bg-amber-600 hover:bg-amber-500 text-white rounded-xl" asChild>
            <Link href="/login">Login as Admin</Link>
          </Button>
        </div>
      </div>
    );
  }

  const logoSrc = typeof logo === "string" ? logo : logo.src;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform lg:translate-x-0 flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <img src={logoSrc} alt="IndiaIPO" className="h-8 w-auto" />
            <span className="text-xs font-bold tracking-wider text-amber-600 uppercase">Admin</span>
          </Link>
          <button className="lg:hidden text-slate-500 hover:text-amber-600 transition-colors" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable navigation link list */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="p-3 space-y-1 overflow-y-auto flex-1 select-none scrollbar-thin"
        >
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            const badge = link.badgeKey === "leads"
              ? unreadLeads
              : link.badgeKey === "consultantEnquiries"
                ? unreadConsultantEnquiries
                : link.badgeKey === "merchantEnquiries"
                  ? unreadMerchantEnquiries
                  : 0;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-amber-500/10 border border-amber-500/20 text-amber-700 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{link.label}</span>
                {badge > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer profile & logout area */}
        <div className="p-3 border-t border-slate-200 shrink-0 bg-white">
          <Link href="/admin/profile" className="flex items-center gap-3 px-3 py-2.5 mb-2 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all group">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-700 text-xs font-bold shrink-0">
              {user?.name?.[0] || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-800 truncate">{user?.name}</div>
              <div className="text-xs text-slate-500 capitalize">{user?.role?.replace("_", " ")}</div>
            </div>
            <Settings className="h-4 w-4 text-slate-500 group-hover:text-amber-600 transition-colors shrink-0" />
          </Link>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl text-sm text-red-600 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200 h-14 flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-slate-600 hover:text-slate-900" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-sm font-bold text-slate-800 capitalize">
              {sidebarLinks.find((l) => l.href === pathname)?.label || "Admin"}
            </h2>
          </div>
        </header>
        <main className="p-4 md:p-6 flex-1">{children}</main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
