"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  useRouter,
  usePathname,
} from "next/navigation";
import { getImageUrl, cn, getLatestGmpValue } from "@/lib/utils";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Home,
  ChevronRight,
  TrendingUp,
  Search,
  Calendar,
  BarChart3,
  PieChart,
  Info,
  Loader2,
  ChevronLeft,
  ArrowUpRight,
  LayoutGrid,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ipoListApi, sectorApi } from "@/services/api";
import { getImgSrc } from "@/utils/image";
import { API_URL } from "@/lib/constants";

const statusColor: Record<string, string> = {
  Active:
    "bg-emerald-100 text-emerald-800 border-emerald-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all duration-300",

  Upcoming:
    "bg-blue-100 text-blue-800 border-blue-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300",

  "Issue Closed (Unlisted)":
    "bg-yellow-100 text-yellow-800 border-yellow-300 group-hover:bg-yellow-500 group-hover:text-white group-hover:border-yellow-500 transition-all duration-300",

  Listed:
    "bg-slate-50 text-slate-700 border-slate-300 group-hover:bg-slate-100 group-hover:text-slate-900 group-hover:border-slate-400 transition-all duration-300",

  Inactive:
    "bg-rose-100 text-rose-800 border-rose-300 group-hover:bg-rose-600 group-hover:text-white group-hover:border-rose-600 transition-all duration-300",
  "Listing Today":
    "bg-red-100 text-red-800 border-red-300 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all duration-300",
  "Date Not Declared":
    "bg-orange-100 text-orange-800 border-orange-300 group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600 transition-all duration-300",
};

const rowBgColor: Record<string, string> = {
  Active: "bg-emerald-100 hover:bg-emerald-200",
  Upcoming: "bg-blue-100 hover:bg-blue-200",
  "Issue Closed (Unlisted)": "bg-yellow-100 hover:bg-yellow-200",
  Listed: "bg-white hover:bg-slate-100",
  Inactive: "bg-rose-100 hover:bg-rose-200",
  "Listing Today": "bg-red-100 hover:bg-red-200",
  "Date Not Declared": "bg-orange-50 hover:bg-orange-100/70",
};

const getCalculatedStatus = (item: any) => {
  if (item.status === "Inactive") return "Inactive";

  if (
    item.date_declared === "No" ||
    item.date_declared === "Date Not Declared" ||
    !item.date_declared ||
    item.date_declared === "" ||
    item.date_declared === "0" ||
    item.date_declared === 0
  ) {
    return "Date Not Declared";
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const openDate = item.open_date ? new Date(item.open_date) : null;
  const closeDate = item.close_date ? new Date(item.close_date) : null;
  const listingDate = item.listing_date ? new Date(item.listing_date) : null;

  // normalize dates
  openDate?.setHours(0, 0, 0, 0);
  closeDate?.setHours(0, 0, 0, 0);
  listingDate?.setHours(0, 0, 0, 0);

  if (openDate && now < openDate) {
    return "Upcoming";
  }

  if (openDate && closeDate && now >= openDate && now <= closeDate) {
    return "Active";
  }

  if (closeDate && listingDate && now > closeDate && now < listingDate) {
    return "Issue Closed (Unlisted)";
  }

  // 👇 Listing Today
  if (listingDate && now.getTime() === listingDate.getTime()) {
    return "Listing Today";
  }

  // 👇 Already Listed
  if (listingDate && now > listingDate) {
    return "Listed";
  }

  return item.status || "Upcoming";
};

const formatDate = (
  dateStr: any,
  options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short" },
) => {
  if (!dateStr || dateStr === "0" || dateStr === 0) return "TBA";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? "TBA" : d.toLocaleDateString("en-IN", options);
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45 },
  }),
};

interface ReportsProps {
  initialData: any;
  initialSlug: string;
  initialSector: string | null
}

const Reports = ({ initialData, initialSlug, initialSector }: ReportsProps) => {
  const router = useRouter();
  const sectorFilter = initialSector;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState({ page: 1, limit: 15 });
  const [bannerVideo, setBannerVideo] = useState<string | null>(null);
  const [sectors, setSectors] = useState<any[]>([]);
  const pathname = usePathname();
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const effectiveSlug = initialSlug

  const isSectorPage = effectiveSlug?.includes("by-sector");

  const fetchReports = async () => {
    setIsLoading(true);

    try {
      let params: any = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search: debouncedSearch,
        status: statusFilter === "all" ? "" : statusFilter,
      };

      if (sectorFilter) {
        params.sector_name = sectorFilter;
        params.by_sector = "true";
      }

      if (effectiveSlug?.includes("by-sector")) {
        params.sort = "sector_name";
        params.by_sector = "true";
      }

      if (effectiveSlug === "upcoming-ipo-calendar") params.upcoming = "1";
      else if (effectiveSlug === "mainline-ipo-report")
        params.category = "mainline";
      else if (effectiveSlug === "sme-ipo-report") params.category = "sme";
      else if (effectiveSlug === "sme-ipos-by-sector") params.category = "sme";
      else if (effectiveSlug === "mainboard-ipos-by-sector")
        params.category = "mainline";

      const result = await ipoListApi.getAll(params);

      setData(result);
    } finally {
      setIsLoading(false);
    }
  };

  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }

    fetchReports();
  }, [
    pagination.page,
    debouncedSearch,
    statusFilter,
    sectorFilter,
    effectiveSlug,
  ]);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/banners?page=${encodeURIComponent(pathname)}`,
        );
        if (res.ok) {
          const data = await res.json();
          const videoBanner = data.find((b: any) => b.video_url);
          if (videoBanner) setBannerVideo(videoBanner.video_url);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBanners();
  }, [pathname]);

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const data = await sectorApi.getAll();
        const filtered = data.filter(
          (s: any) => s.name && s.name.trim().toLowerCase() !== "all",
        );
        setSectors(filtered);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSectors();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPagination((p) => ({ ...p, page: 1 }));
  }, [effectiveSlug, sectorFilter]);

  // const { data, isLoading } = useQuery({
  //   queryKey: [
  //     "reports",
  //     effectiveSlug,
  //     sectorFilter,
  //     pagination.page,
  //     debouncedSearch,
  //     statusFilter,
  //   ],
  //   queryFn: async () => {
  //     let params: any = {
  //       page: pagination.page.toString(),
  //       limit: pagination.limit.toString(),
  //       search: debouncedSearch,
  //       status: statusFilter === "all" ? "" : statusFilter,
  //     };
  //     if (sectorFilter) {
  //       params.sector_name = sectorFilter;
  //       params.by_sector = "true";
  //     }
  //     if (effectiveSlug?.includes("by-sector")) {
  //       params.sort = "sector_name";
  //       params.by_sector = "true";
  //     }
  //     if (effectiveSlug === "upcoming-ipo-calendar") params.upcoming = "1";
  //     else if (effectiveSlug === "mainline-ipo-report")
  //       params.category = "mainline";
  //     else if (effectiveSlug === "sme-ipo-report") params.category = "sme";
  //     else if (effectiveSlug === "sme-ipos-by-sector") params.category = "sme";
  //     else if (effectiveSlug === "mainboard-ipos-by-sector")
  //       params.category = "mainline";
  //     return await ipoListApi.getAll(params);
  //   },
  //   staleTime: 1000 * 60,
  //   gcTime: 1000 * 60 * 10,
  //   refetchOnWindowFocus: false,
  // });

  const items = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 0;
  const total = data?.pagination?.total || 0;

  const getSubtitle = () => {
    if (sectorFilter)
      return `Explore the complete list of IPOs in the ${sectorFilter} sector, tracking performance and market capitalisation across the industry.`;
    switch (effectiveSlug) {
      case "upcoming-ipo-calendar":
        return "Track upcoming IPOs with real-time updates, timelines and key issue details to stay ahead of market opportunities.";
      case "mainline-ipo-report":
        return "Access real-time data and performance insights on mainboard IPOs, including pricing trends, subscription levels and listing outcomes.";
      case "sme-ipo-report":
        return "Track SME IPOs with real-time data, GMP trends, subscription demand and listing performance insights.";
      case "sme-ipos-by-sector":
        return "Track sector-wise SME IPO trends with real-time data on issue activity, pricing dynamics and listing outcomes.";
      case "mainboard-ipos-by-sector":
        return "Analyse sector-wise mainboard IPO activity with real-time data on issue trends, capital flows and listing performance.";
      default:
        return "Professional real-time tracking of IPO listings and market developments for informed investment decisions.";
    }
  };

  const getCards = () => {
    const commonCards = [
      {
        icon: PieChart,
        title: "Professional Analysis",
        desc: "Each IPO is tracked with verified data, covering GMP trends, pricing updates and market sentiment indicators.",
        gold: false,
      },
      {
        icon: Calendar,
        title: "Real-Time Updates",
        desc: "Stay updated with daily changes in GMP, price bands, issue dates and listing schedules as announced.",
        gold: false,
      },
      {
        icon: TrendingUp,
        title: "IPO Eligibility",
        desc: "Curious about your own company's IPO journey? Let our experts guide you through complex SEBI regulations.",
        gold: true,
      },
    ];

    if (effectiveSlug === "upcoming-ipo-calendar") {
      return [
        {
          icon: PieChart,
          title: "Professional Analysis",
          desc: "Each IPO is tracked with verified data, covering GMP trends, pricing updates and market sentiment indicators.",
          gold: false,
        },
        {
          icon: Calendar,
          title: "Real-Time Updates",
          desc: "Stay updated with daily changes in GMP, price bands, issue dates and listing schedules as announced.",
          gold: false,
        },
        {
          icon: TrendingUp,
          title: "IPO Eligibility",
          desc: "Planning to take your company public? Consult our experts for a seamless listing.",
          gold: true,
        },
      ];
    }
    if (effectiveSlug === "mainline-ipo-report") {
      return [
        {
          icon: PieChart,
          title: "Professional Analysis",
          desc: "Each IPO is tracked with verified data, covering GMP trends, pricing updates and market sentiment indicators.",
          gold: false,
        },
        {
          icon: Calendar,
          title: "Real-Time Updates",
          desc: "Stay updated with daily changes in GMP, price bands, issue dates and listing schedules as announced.",
          gold: false,
        },
        {
          icon: TrendingUp,
          title: "Mainboard Listing",
          desc: "Ready for the big stage? Let us help you navigate Mainboard IPO regulations.",
          gold: true,
        },
      ];
    }
    if (effectiveSlug === "sme-ipo-report") {
      return [
        {
          icon: PieChart,
          title: "Growth Analytics",
          desc: "Specialized tracking of high-growth SME issues across BSE SME and NSE Emerge platforms.",
          gold: false,
        },
        {
          icon: Calendar,
          title: "SME Fund Raising",
          desc: "Detailed insights into how small enterprises are successfully tapping into the primary markets.",
          gold: false,
        },
        {
          icon: TrendingUp,
          title: "SME IPO Advisor",
          desc: "Need guidance for an SME IPO? Our experts specialize in small-cap listing compliance.",
          gold: true,
        },
      ];
    }
    return commonCards;
  };

  const getTitle = () => {
    if (sectorFilter) return `${sectorFilter} IPOs List`;
    switch (effectiveSlug) {
      case "upcoming-ipo-calendar":
        return "Upcoming IPO Calendar";
      case "mainline-ipo-report":
        return "Mainline IPO Updates";
      case "sme-ipo-report":
        return "SME IPO Updates";
      case "sme-ipos-by-sector":
        return "SME IPOs by Sector";
      case "mainboard-ipos-by-sector":
        return "Mainboard IPOs by Sector";
      default:
        return "IPO Calendar";
    }
  };

  const calculateStats = (key: string) => {
    const values = items
      // @ts-ignore
      .map((item) => {
        const val = item[key];
        if (typeof val === "string")
          return parseFloat(val.replace(/[^0-9.]/g, ""));
        return typeof val === "number" ? val : 0;
      })
      // @ts-ignore
      .filter((v) => v > 0);

    if (values.length === 0) return { highest: 0, lowest: 0, median: 0 };

    const sorted = [...values].sort((a, b) => a - b);
    const highest = sorted[sorted.length - 1];
    const lowest = sorted[0];
    const mid = Math.floor(sorted.length / 2);
    const median =
      sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;

    return { highest, lowest, median };
  };

  const sizeStats = calculateStats("issue_size");
  const peStats = calculateStats("ipo_pe_ratio");

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <SEOHead
        title={`${getTitle()} | India IPO — Real-Time IPO Data`}
        description={`Detailed ${getTitle()} with company info, GMP, issue size, price band and more. Track all IPOs on India IPO.`}
        keywords={`${getTitle()}, IPO calendar India, IPO list, BSE NSE IPO, SME IPO, mainboard IPO`}
      />

      <main>
        <section className="bg-[#001529] py-8 md:py-12 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-20"
              src={getImageUrl(bannerVideo || "/uploads/video/ccvindia1.mp4")}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#001529]/90 via-[#001529]/60 to-[#001529]" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-2 text-white/50 text-xs mb-4 flex-wrap">
              <Link
                href="/"
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                <Home className="h-3 w-3" /> Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white/70">Reports</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white/90 font-semibold">{getTitle()}</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-2xl md:text-4xl font-black text-white mb-2 leading-tight">
                {getTitle()
                  .split(" ")
                  .map((word, i) => (
                    <span
                      key={i}
                      className={i % 2 === 1 ? "text-[#f59e08]" : ""}
                    >
                      {word}{" "}
                    </span>
                  ))}
              </h1>
              <p className="text-white/60 max-w-xl text-sm font-medium">
                {getSubtitle()}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Main Content */}
              <div className="flex-1 min-w-0 order-2 lg:order-1">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
                  {/* Summary/Legend Bar */}
                  <div className="px-5 py-3 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#001529] flex items-center justify-center">
                        <BarChart3 className="h-4 w-4 text-[#f59e08]" />
                      </div>
                      <span className="text-sm font-black text-[#001529]">
                        {total} Records Found
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 bg-orange-400 rounded-full"></span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          TBA
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 bg-emerald-400 rounded-full"></span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          Active
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          Upcoming
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          Closed
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto hidden lg:block">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-100/90 text-slate-600 border-b border-slate-200">
                          {[
                            "Company & Sector",
                            "IPO Dates",
                            "GMP",
                            "Issue Size",
                            "Price Band",
                            "Lot Size",
                            "Status",
                            "Details",
                          ].map((h) => (
                            <th
                              key={h}
                              className={cn(
                                "px-5 py-5 text-left font-bold text-xs uppercase tracking-widest whitespace-nowrap",
                                (h === "Status" || h === "GMP") &&
                                  "text-center",
                                h === "Details" && "text-right",
                              )}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                          <tr>
                            <td colSpan={6} className="py-24 text-center">
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#001529] to-[#003380] flex items-center justify-center mx-auto mb-4">
                                <Loader2 className="h-7 w-7 animate-spin text-[#f59e08]" />
                              </div>
                              <p className="text-slate-500 font-semibold">
                                Fetching real-time data…
                              </p>
                            </td>
                          </tr>
                        ) : items.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-24 text-center">
                              <Info className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                              <p className="text-slate-500 font-semibold">
                                No records matching your search
                              </p>
                            </td>
                          </tr>
                        ) : (
                          // @ts-ignore
                          items.map((item, idx) => {
                            const displayStatus = getCalculatedStatus(item);
                            return (
                              <tr
                                key={`desktop-${item.id}`}
                                onClick={() =>
                                  item.blog_slug
                                    ? router.push(
                                        `/ipo-blogs/${item.blog_slug}`,
                                      )
                                    : null
                                }
                                className={cn(
                                  "transition-all group cursor-pointer",
                                  rowBgColor[String(displayStatus)] ||
                                    (idx % 2 === 0
                                      ? "bg-white hover:bg-slate-50"
                                      : "bg-[#F8FAFC] hover:bg-slate-100"),
                                )}
                              >
                                <td className="px-5 py-6">
                                  <div className="flex items-center gap-3">
                                    {getImgSrc(item.logo || item.blog_image) ? (
                                      <img
                                        src={
                                          getImgSrc(
                                            item.logo || item.blog_image,
                                          )!
                                        }
                                        alt=""
                                        className="w-10 h-10 rounded-lg object-contain border border-slate-200 bg-white p-1 group-hover:scale-105 transition-transform"
                                      />
                                    ) : (
                                      <div className="w-10 h-10 rounded-lg bg-[#001529]/08 flex items-center justify-center text-[#001529] font-black text-sm">
                                        {String(item.issuer_company || "?")[0]}
                                      </div>
                                    )}
                                    <div>
                                      <p className="font-black text-[#001529] text-[16px] group-hover:text-blue-700 transition-colors">
                                        {item.issuer_company}
                                      </p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <span
                                          className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase"
                                          style={{
                                            background: "rgba(0,21,41,0.08)",
                                            color: "#001529",
                                          }}
                                        >
                                          {item.exchange || "BSE/NSE"}
                                        </span>
                                        <span className="text-[10px] font-black italic text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tight ml-2">
                                          {item.sector_name ||
                                            item.sector_names ||
                                            item.sector ||
                                            item.issue_category ||
                                            "Mainline"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                <td className="px-5 py-6 whitespace-nowrap">
                                  <div className="text-[15px] font-bold text-[#001529]">
                                    {formatDate(item.open_date)} –{" "}
                                    {formatDate(item.close_date)}
                                  </div>
                                  <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                                    <Calendar className="h-2.5 w-2.5" />
                                    Listing:{" "}
                                    {formatDate(item.listing_date, {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </p>
                                </td>

                                <td className="px-5 py-6">
                                  <div className="flex flex-col items-center text-slate-900">
                                    <motion.div
                                      animate={{ opacity: [1, 0.7, 1] }}
                                      transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                      }}
                                      className={cn(
                                        "text-[15px] font-black flex items-center justify-center gap-1",
                                        item.gmp && item.gmp !== "0"
                                          ? "text-green-700"
                                          : "text-slate-400",
                                      )}
                                    >
                                      {getLatestGmpValue(item.gmp)}
                                    </motion.div>
                                    <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                                      Premium
                                    </span>
                                  </div>
                                </td>
                                <td className="px-5 py-6 whitespace-nowrap">
                                  <span className="font-black text-[15px] text-[#001529]">
                                    {item.issue_size && item.issue_size !== "0"
                                      ? `₹${item.issue_size} Cr`
                                      : "TBA"}
                                  </span>
                                </td>
                                <td className="px-5 py-6 whitespace-nowrap">
                                  <div className="text-[15px] font-bold text-[#001529]">
                                    {item.issue_lowest_price &&
                                    item.issue_lowest_price !== "0" &&
                                    item.issue_lowest_price !== 0
                                      ? `₹${item.issue_lowest_price} – ₹${item.issue_highest_price}`
                                      : item.issue_highest_price &&
                                          item.issue_highest_price !== "0" &&
                                          item.issue_highest_price !== 0
                                        ? `₹${item.issue_highest_price}`
                                        : "TBA"}
                                  </div>
                                  <p className="text-[10px] text-slate-400 mt-0.5">
                                    Price Per Share
                                  </p>
                                </td>
                                <td className="px-5 py-6 whitespace-nowrap">
                                  <div className="text-[15px] font-black text-[#001529] italic">
                                    {item.lot_size || "TBA"}
                                  </div>
                                  <p className="text-[10px] text-slate-400 mt-0.5">
                                    Minimum Lot
                                  </p>
                                </td>

                                <td className="px-5 py-6 text-center">
                                  <span
                                    className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-sm border ${
                                      statusColor[String(displayStatus)] ||
                                      "bg-slate-100 text-slate-500 border-slate-200"
                                    }`}
                                  >
                                    {displayStatus}
                                  </span>
                                </td>

                                <td className="px-5 py-6 text-right">
                                  {item.blog_slug ? (
                                    <Button
                                      asChild
                                      size="sm"
                                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold px-4 shadow-lg shadow-blue-600/10"
                                    >
                                      <Link
                                        href={`/ipo-blogs/${item.blog_slug}`}
                                      >
                                        Analyze{" "}
                                        <ArrowUpRight className="h-4 w-4 ml-1.5" />
                                      </Link>
                                    </Button>
                                  ) : (
                                    <Button
                                      disabled
                                      size="sm"
                                      variant="outline"
                                      className="rounded-xl font-bold text-slate-300 px-4"
                                    >
                                      No Details
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-[#F8FAFC]/30 p-4 border-slate-100 lg:hidden relative z-10 w-full overflow-hidden">
                    {isLoading ? (
                      <div className="py-20 flex flex-col items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-[#f59e08] mb-4" />
                        <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                          Fetching records...
                        </span>
                      </div>
                    ) : items.length === 0 ? (
                      <div className="py-20 text-center flex flex-col items-center justify-center">
                        <Info className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-xl font-bold text-[#001529] mb-1">
                          No Matching IPOs
                        </h3>
                        <p className="text-slate-500 text-sm">
                          Try adjusting your filters to find what you're looking
                          for.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* @ts-ignore */}
                        {items.map((item, idx) => {
                          const displayStatus = getCalculatedStatus(item);
                          const statusLabel =
                            displayStatus === "Active" ? "Open" : displayStatus;

                          let borderColor = "border-slate-200";
                          let statusBg = "bg-slate-100";
                          let statusText = "text-slate-600";
                          let dotColor = "bg-slate-500";

                          if (displayStatus === "Active") {
                            borderColor = "border-emerald-500";
                            statusBg = "bg-emerald-600";
                            statusText = "text-white";
                            dotColor = "bg-white";
                          } else if (displayStatus === "Upcoming") {
                            borderColor = "border-blue-500";
                            statusBg = "bg-blue-600";
                            statusText = "text-white";
                            dotColor = "bg-white";
                          } else if (
                            displayStatus === "Issue Closed (Unlisted)"
                          ) {
                            borderColor = "border-yellow-500";
                            statusBg = "bg-yellow-500";
                            statusText = "text-white";
                            dotColor = "bg-white";
                          } else if (displayStatus === "Listed") {
                            borderColor = "border-slate-300";
                            statusBg = "bg-white";
                            statusText = "text-slate-700";
                            dotColor = "bg-slate-500";
                          } else if (displayStatus === "Listing Today") {
                            borderColor = "border-red-500";
                            statusBg = "bg-red-600";
                            statusText = "text-white";
                            dotColor = "bg-white";
                          } else if (displayStatus === "Date Not Declared") {
                            borderColor = "border-orange-500";
                            statusBg = "bg-orange-600";
                            statusText = "text-white";
                            dotColor = "bg-white";
                          }

                          const getInitials = (name: string) => {
                            if (!name) return "?";
                            return name
                              .split(" ")
                              .slice(0, 2)
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase();
                          };

                          return (
                            <motion.div
                              key={`mobile-${item.id}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className={cn(
                                "rounded-xl shadow-sm border border-slate-200 border-l-[5px] transition-all overflow-hidden flex flex-col",
                                borderColor,
                                rowBgColor[String(displayStatus)] || "bg-white",
                              )}
                            >
                              <div className="p-4 flex justify-between items-start gap-3 border-b border-slate-100/80 border-dashed">
                                <div className="flex items-start gap-3">
                                  <div className="h-10 w-10 bg-[#001529] rounded-lg text-white flex items-center justify-center font-black text-xs shrink-0 overflow-hidden shadow-sm mt-0.5">
                                    {getImgSrc(item.logo || item.blog_image) ? (
                                      <img
                                        src={
                                          getImgSrc(
                                            item.logo || item.blog_image,
                                          )!
                                        }
                                        alt={item.issuer_company}
                                        className="h-full w-full object-contain bg-white p-1"
                                      />
                                    ) : (
                                      getInitials(item.issuer_company)
                                    )}
                                  </div>
                                  <div className="flex flex-col">
                                    <h3 className="font-bold text-[#001529] text-[14px] leading-tight line-clamp-2">
                                      {item.issuer_company}
                                    </h3>
                                    <span className="text-[10px] font-black italic text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tight mt-1.5 w-max">
                                      {item.sector_name ||
                                        item.sector_names ||
                                        item.sector ||
                                        item.issue_category ||
                                        "Sector TBA"}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex flex-col items-end gap-2 shrink-0">
                                  <div
                                    className={`flex items-center gap-1.5 ${statusBg} ${statusText} px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest w-max`}
                                  >
                                    <span
                                      className={`h-1.5 w-1.5 rounded-full ${dotColor} animate-pulse`}
                                    ></span>
                                    {statusLabel}
                                  </div>
                                  <span className="bg-[#001529] text-[#f59e08] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider w-max shadow-sm">
                                    {item.exchange || "BSE/NSE"}
                                  </span>
                                </div>
                              </div>

                              <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-3">
                                <div className="flex flex-col">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                    IPO Dates
                                  </p>
                                  <p className="text-[12px] font-bold text-[#001529]">
                                    {formatDate(item.open_date)} -{" "}
                                    {formatDate(item.close_date)}
                                  </p>
                                  <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                                    Listing:{" "}
                                    {formatDate(item.listing_date, {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>
                                <div className="flex flex-col">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    Issue Size
                                  </p>
                                  <p className="text-[12px] font-black text-blue-600">
                                    {item.issue_size &&
                                    item.issue_size !== "0" &&
                                    item.issue_size !== 0
                                      ? `₹${item.issue_size} Cr.`
                                      : "TBA"}
                                  </p>
                                  <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                                    Aggregate
                                  </p>
                                </div>
                                <div className="flex flex-col">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    Price Band
                                  </p>
                                  <p className="text-[12px] font-bold text-[#001529]">
                                    {item.issue_lowest_price &&
                                    item.issue_lowest_price !== "0" &&
                                    item.issue_lowest_price !== 0
                                      ? `₹${item.issue_lowest_price} - ₹${item.issue_highest_price}`
                                      : item.issue_highest_price &&
                                          item.issue_highest_price !== "0" &&
                                          item.issue_highest_price !== 0
                                        ? `₹${item.issue_highest_price}`
                                        : "TBA"}
                                  </p>
                                  <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                                    Per Share
                                  </p>
                                </div>
                                <div className="flex flex-col">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    Lot Size
                                  </p>
                                  <p className="text-[12px] font-bold text-[#001529]">
                                    {item.lot_size || "TBA"}
                                  </p>
                                  <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                                    Minimum Lot
                                  </p>
                                </div>
                                <div className="flex flex-col">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    Latest GMP
                                  </p>
                                  <p
                                    className={cn(
                                      "text-[12px] font-black",
                                      item.gmp &&
                                        item.gmp !== "0" &&
                                        item.gmp !== "—"
                                        ? "text-green-600"
                                        : "text-slate-400",
                                    )}
                                  >
                                    {getLatestGmpValue(item.gmp)}
                                  </p>
                                  <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                                    Premium
                                  </p>
                                </div>
                              </div>

                              <div className="px-4 pb-4 mt-auto">
                                {item.blog_slug ? (
                                  <Button
                                    asChild
                                    size="sm"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/10 h-10 transition-all"
                                  >
                                    <Link href={`/ipo-blogs/${item.blog_slug}`}>
                                      Analyze Details{" "}
                                      <ArrowUpRight className="h-4 w-4 ml-1.5" />
                                    </Link>
                                  </Button>
                                ) : (
                                  <Button
                                    disabled
                                    size="sm"
                                    variant="outline"
                                    className="w-full rounded-xl font-bold text-slate-300 h-10 border-slate-200"
                                  >
                                    No Details Available
                                  </Button>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {totalPages > 1 &&
                    (() => {
                      const delta = 1;
                      const range: (number | "...")[] = [];
                      const rangeSet = new Set<number>();
                      const page = pagination.page;

                      [
                        1,
                        totalPages,
                        ...Array.from(
                          { length: delta * 2 + 1 },
                          (_, i) => page - delta + i,
                        ),
                      ]
                        .filter((p) => p >= 1 && p <= totalPages)
                        .sort((a, b) => a - b)
                        .forEach((p) => rangeSet.add(p));

                      const sorted = Array.from(rangeSet).sort((a, b) => a - b);
                      sorted.forEach((p, i) => {
                        if (i > 0 && p - sorted[i - 1] > 1) range.push("...");
                        range.push(p);
                      });

                      return (
                        <div className="px-4 md:px-5 py-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between bg-[#F8FAFC] gap-4">
                          <p className="text-xs text-slate-400 font-semibold hidden md:block">
                            Page {page} of {totalPages}
                          </p>
                          <div className="flex items-center justify-between md:justify-end gap-1 md:gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                            <button
                              onClick={() =>
                                setPagination((p) => ({
                                  ...p,
                                  page: Math.max(1, p.page - 1),
                                }))
                              }
                              disabled={page === 1}
                              className="flex items-center justify-center gap-1 px-2.5 md:px-4 h-9 min-w-[36px] rounded-xl font-black text-xs bg-[#001529] text-white hover:bg-[#002147] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
                            >
                              <ChevronLeft className="h-4 w-4" />{" "}
                              <span className="hidden md:inline">Previous</span>
                            </button>

                            <div className="flex items-center gap-1 px-1">
                              {range.map((p, idx) =>
                                p === "..." ? (
                                  <span
                                    key={`e-${idx}`}
                                    className="px-0.5 md:px-1 text-slate-400 text-xs font-black"
                                  >
                                    ...
                                  </span>
                                ) : (
                                  <button
                                    key={p}
                                    onClick={() =>
                                      setPagination((prev) => ({
                                        ...prev,
                                        page: p as number,
                                      }))
                                    }
                                    className="w-8 h-8 md:w-9 md:h-9 shrink-0 rounded-xl text-xs font-black transition-all shadow-sm"
                                    style={
                                      page === p
                                        ? {
                                            background: "#f59e08",
                                            color: "#001529",
                                          }
                                        : {
                                            background: "#f1f5f9",
                                            color: "#475569",
                                          }
                                    }
                                  >
                                    {p}
                                  </button>
                                ),
                              )}
                            </div>

                            <button
                              onClick={() =>
                                setPagination((p) => ({
                                  ...p,
                                  page: Math.min(totalPages, p.page + 1),
                                }))
                              }
                              disabled={page >= totalPages}
                              className="flex items-center justify-center gap-1 px-2.5 md:px-4 h-9 min-w-[36px] rounded-xl font-black text-xs bg-[#001529] text-white hover:bg-[#002147] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
                            >
                              <span className="hidden md:inline">Next</span>{" "}
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                </div>
              </div>

              {/* Right Column - Filters & Stats */}
              <div className="lg:w-80 shrink-0 space-y-6 order-1 lg:order-2 lg:sticky lg:top-[120px] lg:self-start lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pb-6 scrollbar-hide">
                {/* Search & Basic Filters */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-5">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                      Search Company
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                      <Input
                        placeholder="Search here…"
                        className="pl-9 h-11 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all text-sm font-semibold"
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setPagination((p) => ({ ...p, page: 1 }));
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                      Issue Status
                    </label>
                    <Select
                      value={statusFilter}
                      onValueChange={(v) => {
                        setStatusFilter(v);
                        setPagination((p) => ({ ...p, page: 1 }));
                      }}
                    >
                      <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 text-sm font-bold">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4 text-[#f59e08]" />
                          <SelectValue placeholder="All Issues" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Issues</SelectItem>
                        <SelectItem value="Upcoming">Upcoming</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Issue Closed (Unlisted)">
                          Closed (Unlisted)
                        </SelectItem>
                        <SelectItem value="Listing Today">
                          Listing Today
                        </SelectItem>
                        <SelectItem value="Listed">Listed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                      Quick Navigator
                    </label>
                    <Select
                      value={pathname}
                      onValueChange={(v) => router.push(v)}
                    >
                      <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 text-sm font-bold">
                        <div className="flex items-center gap-2">
                          <LayoutGrid className="h-4 w-4 text-[#f59e08]" />
                          <SelectValue placeholder="Quick Navigator" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="/all-ipos">IPO Calendar</SelectItem>
                        <SelectItem value="/mainline-ipos">
                          Mainline IPO Updates
                        </SelectItem>
                        <SelectItem value="/sme-ipos">
                          SME IPO Updates
                        </SelectItem>
                        <SelectItem value="/sme-ipo-sector">
                          SME IPOs by Sector
                        </SelectItem>
                        <SelectItem value="/mainboard-ipo-sector">
                          Mainboard IPOs by Sector
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {isSectorPage && (
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                        Filter by Sector
                      </label>
                      <Select
                        value={sectorFilter || "all"}
                        onValueChange={(v) =>
                          router.push(
                            v === "all"
                              ? pathname
                              : `${pathname}?sector=${encodeURIComponent(v)}`,
                          )
                        }
                      >
                        <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 text-sm font-bold">
                          <SelectValue placeholder="All Sectors" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          <SelectItem value="all">All Sectors</SelectItem>
                          {sectors
                            .filter((s: any) => {
                              if (sectorFilter === s.name) return true;
                              const isSme =
                                effectiveSlug === "sme-ipos-by-sector";
                              const count = isSme
                                ? Number(s.sme_count) || 0
                                : Number(s.mainline_count) || 0;
                              return count > 0;
                            })
                            .map((s: any) => (
                              <SelectItem key={s.id} value={s.name}>
                                {s.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Stats Cards - Premium Look */}
                <div className="bg-[#001529] rounded-2xl p-6 border border-[#f59e08]/20 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#f59e08]/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#f59e08]/20 transition-all duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-[#f59e08]/20 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-[#f59e08]" />
                      </div>
                      <h3 className="text-white font-black text-xs uppercase tracking-widest">
                        IPO Size (Cr.)
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between group/stat">
                        <span className="text-white/50 text-[13px] font-medium">
                          Highest
                        </span>
                        <span className="text-white font-black text-[15px] group-hover:text-[#f59e08] transition-colors">
                          ₹{sizeStats.highest.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full h-px bg-white/5" />
                      <div className="flex items-center justify-between group/stat">
                        <span className="text-white/50 text-[13px] font-medium">
                          Median
                        </span>
                        <span className="text-white font-black text-[15px] group-hover:text-[#f59e08] transition-colors">
                          ₹{sizeStats.median.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full h-px bg-white/5" />
                      <div className="flex items-center justify-between group/stat">
                        <span className="text-white/50 text-[13px] font-medium">
                          Lowest
                        </span>
                        <span className="text-white font-black text-[15px] group-hover:text-[#f59e08] transition-colors">
                          ₹{sizeStats.lowest.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-white/30 mt-6 italic">
                      Summary of current listed records
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <PieChart className="h-4 w-4 text-blue-600" />
                      </div>
                      <h3 className="text-[#001529] font-black text-xs uppercase tracking-widest">
                        P/E Ratio
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[13px] font-medium">
                          Highest
                        </span>
                        <span className="text-[#001529] font-black text-[15px]">
                          {peStats.highest.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full h-px bg-slate-100" />
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[13px] font-medium">
                          Median
                        </span>
                        <span className="text-[#001529] font-black text-[15px]">
                          {peStats.median.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full h-px bg-slate-100" />
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[13px] font-medium">
                          Lowest
                        </span>
                        <span className="text-[#001529] font-black text-[15px]">
                          {peStats.lowest.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-300 mt-6 italic">
                      Valuation metrics overview
                    </p>
                  </div>
                </div>

                <Link href="/ipo-eligibility-check" className="block group">
                  <div className="bg-gradient-to-br from-[#f59e08] to-[#d97706] rounded-2xl p-6 text-[#001529] shadow-lg shadow-[#f59e08]/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#001529]/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <h3 className="font-black text-sm uppercase leading-tight">
                        Check IPO
                        <br />
                        Eligibility
                      </h3>
                    </div>
                    <p className="text-xs font-bold opacity-80 mb-4 leading-relaxed">
                      Planning to take your company public? Get expert guidance
                      today.
                    </p>
                    <div className="flex items-center gap-2 font-black text-xs bg-[#001529] text-[#f59e08] w-max px-4 py-2 rounded-lg">
                      Start Now <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Reports;
