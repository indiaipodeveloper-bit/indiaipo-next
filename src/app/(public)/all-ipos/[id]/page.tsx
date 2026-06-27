import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import { Loader2, Calendar, Banknote, ShieldAlert, BarChart3, TrendingUp, Percent, Info } from "lucide-react";
import { cn, getLatestGmpValue } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { API_URL, BASE_URL } from "@/lib/constants";


interface Props {
  params: Promise<{ id: string }>;
}

interface IpoDetailsResult {
  data: any | null;
  source: "lists" | "sectors" | null;
}

async function getIpoDetails(id: string): Promise<IpoDetailsResult> {

  // Try ipo-lists first
  try {
    const res = await fetch(`${API_URL}/api/ipo-lists/${id}`, {
      next: { revalidate: 30 }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.id) {
        return { data, source: "lists" };
      }
    }
  } catch (err) {
    console.warn("Failed to fetch from ipo-lists:", err);
  }

  // Fallback to sectors/ipos
  try {
    const res = await fetch(`${API_URL}/api/sectors/ipos/${id}`, {
      next: { revalidate: 30 }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.id) {
        const mappedData = {
          ...data,
          issuer_company: data.name || data.issuer_company,
          issue_category: data.type || data.issue_category,
          issue_size: data.iposize || data.issue_size,
          ipo_pe_ratio: data.pe_ratio || data.ipo_pe_ratio,
          open_date: data.ipo_year || data.open_date,
        };
        return { data: mappedData, source: "sectors" };
      }
    }
  } catch (err) {
    console.warn("Failed to fetch from sectors/ipos:", err);
  }

  return { data: null, source: null };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getIpoDetails(id);
  if (!data) {
    return {
      title: "IPO Details Not Found | India IPO",
      description: "The requested IPO details page could not be found."
    };
  }

  const title = `${data.issuer_company} IPO Details, Size, PE Ratio, GMP | India IPO`;
  const description = `Comprehensive details of ${data.issuer_company} IPO. Check issue size, price band, lot size, P/E ratio, GMP trends, and dates.`;
  const canonicalUrl = `${BASE_URL}/all-ipos/${id}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
    }
  };
}

const formatDate = (dateStr: any) => {
  if (!dateStr || dateStr === "0" || dateStr === 0) return "TBA";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? "TBA" : d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
};

export default async function IpoDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: ipoData } = await getIpoDetails(id);

  if (!ipoData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Header Banner */}
      <section className="bg-[#001529] py-14 relative overflow-hidden text-white border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,#0052a3,transparent)] opacity-40 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <BackButton />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/10 text-white border border-white/20"
                )}>
                  {ipoData.exchange || "BSE / NSE"}
                </span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  ipoData.issue_category?.toLowerCase() === "sme"
                    ? "bg-amber-500/20 text-[#f59e08] border border-[#f59e08]/30"
                    : "bg-blue-500/20 text-blue-400 border border-blue-400/30"
                )}>
                  {ipoData.issue_category || "SME IPO"}
                </span>
                {ipoData.sector_name && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-300 border border-blue-300/10">
                    {ipoData.sector_name}
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                {ipoData.issuer_company}
              </h1>
              <p className="text-white/60 mt-3 font-medium text-sm max-w-xl">
                Get the latest financial performance metrics, timelines, GMP premium trends, and comprehensive details.
              </p>
            </div>
            
            {/* GMP Card */}
            {ipoData.gmp && ipoData.gmp !== "0" && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:w-64 shrink-0 text-center backdrop-blur-md">
                <p className="text-white/40 text-[11px] font-black uppercase tracking-widest mb-1">Expected GMP Premium</p>
                <div className="text-3xl font-black text-emerald-400 animate-pulse">
                  {getLatestGmpValue(ipoData.gmp)}
                </div>
                <p className="text-white/30 text-[10px] font-semibold mt-2">Subject to market conditions</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Details Section */}
      <main className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          
          {/* Main Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Banknote className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Issue Size</p>
                <p className="text-slate-800 text-xl font-black">
                  {ipoData.issue_size && ipoData.issue_size !== "0" && ipoData.issue_size !== 0 ? `₹${ipoData.issue_size} Cr` : "TBA"}
                </p>
                <p className="text-slate-400 text-[11px] font-medium mt-1">Aggregate fund raising</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                <Percent className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">IPO Valuation P/E</p>
                <p className="text-slate-800 text-xl font-black">
                  {ipoData.ipo_pe_ratio && ipoData.ipo_pe_ratio !== "0" && ipoData.ipo_pe_ratio !== 0 ? `${ipoData.ipo_pe_ratio}x` : "TBA"}
                </p>
                <p className="text-slate-400 text-[11px] font-medium mt-1">Price-to-earnings ratio</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Issue Open Date</p>
                <p className="text-slate-800 text-xl font-black">
                  {formatDate(ipoData.open_date)}
                </p>
                <p className="text-slate-400 text-[11px] font-medium mt-1">Listing schedule timeline</p>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Details Sheet */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <h3 className="text-slate-800 font-bold text-[15px]">Detailed IPO Parameters</h3>
                </div>
                
                <div className="divide-y divide-slate-100 px-6 py-2">
                  <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-slate-500 text-sm font-semibold">Price Band</span>
                    <span className="text-slate-800 font-bold text-sm">
                      {ipoData.issue_lowest_price && ipoData.issue_lowest_price !== "0" && ipoData.issue_lowest_price !== 0 
                        ? `₹${ipoData.issue_lowest_price} - ₹${ipoData.issue_highest_price}` 
                        : (ipoData.issue_highest_price && ipoData.issue_highest_price !== "0" && ipoData.issue_highest_price !== 0 
                          ? `₹${ipoData.issue_highest_price}` 
                          : "TBA")}
                    </span>
                  </div>

                  <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-slate-500 text-sm font-semibold">Minimum Lot Size</span>
                    <span className="text-slate-800 font-bold text-sm">
                      {ipoData.lot_size && ipoData.lot_size !== "0" && ipoData.lot_size !== 0 ? `${ipoData.lot_size} Shares` : "TBA"}
                    </span>
                  </div>

                  {ipoData.close_date && (
                    <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-slate-500 text-sm font-semibold">Issue Close Date</span>
                      <span className="text-slate-800 font-bold text-sm">{formatDate(ipoData.close_date)}</span>
                    </div>
                  )}

                  {ipoData.listing_date && (
                    <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-slate-500 text-sm font-semibold">Proposed Listing Date</span>
                      <span className="text-slate-800 font-bold text-sm">{formatDate(ipoData.listing_date)}</span>
                    </div>
                  )}

                  {ipoData.merchant_bankers && (
                    <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-slate-500 text-sm font-semibold">Merchant Banker(s)</span>
                      <span className="text-slate-800 font-bold text-sm text-right max-w-xs">{ipoData.merchant_bankers}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Info Sidebar */}
            <div className="space-y-6">
              
              {/* Blog review link */}
              {ipoData.blog_slug && (
                <div className="bg-gradient-to-br from-blue-600 to-[#001529] text-white rounded-3xl p-6 shadow-md relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white/10 transition-all duration-300" />
                  <div className="relative z-10">
                    <h4 className="text-lg font-bold mb-2">Read Complete Expert Analysis</h4>
                    <p className="text-white/70 text-xs mb-6 font-medium">Check detailed review, subscription status, GMP live updates, and listing forecasts.</p>
                    <Button asChild size="sm" className="w-full py-6 bg-amber-500 text-[#001529] font-black rounded-xl text-xs uppercase tracking-widest hover:bg-amber-400 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border-0">
                      <Link href={`/ipo-blogs/${ipoData.blog_slug}`}>
                        View IPO Blog Review <TrendingUp className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}

              {/* Status Alert Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-slate-800 font-bold text-sm mb-1">Live Tracking</h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-medium">This record is automatically synchronized with primary markets. GMP updates are crowdsourced and are for informational purpose only.</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

    </div>
  );
}
