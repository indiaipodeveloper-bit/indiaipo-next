"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, Download, Eye, Loader2, Share2, Newspaper, X, Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/utils";

interface WeeklyDigest {
  id: number;
  title: string;
  image: string | null;
  pdf: string | null;
  created_at: string;
  updated_at: string;
}

export default function WeeklyReporterViewerClient({
  digest
}: {
  digest: WeeklyDigest;
}) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const iframeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullScreen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const pdfUrl = digest.pdf ? getImageUrl(digest.pdf) : null;

  return (
    <div className={`min-h-screen bg-[#F8FAFC] flex flex-col ${isFullScreen ? 'overflow-hidden fixed inset-0 z-[100]' : ''}`}>

      <main className={`flex-grow flex flex-col ${isFullScreen ? 'h-screen' : ''}`}>
        {!isFullScreen && (
          <div className="bg-white border-b border-border sticky top-[68px] z-30 py-3 shadow-sm">
            <div className="container mx-auto px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild className="rounded-lg hover:bg-slate-100 cursor-pointer">
                  <Link href="/weekly-ipo-report">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Link>
                </Button>
                <div className="h-6 w-px bg-border hidden sm:block" />
                <div>
                  <h1 className="text-sm md:text-base font-bold text-[#001529] line-clamp-1 flex items-center gap-2">
                    <Newspaper className="h-4 w-4 text-[#fbbf24]" />
                    {digest.title}
                  </h1>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                    Weekly IPO Report
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg gap-2 border-border cursor-pointer"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      if (navigator.share) {
                        navigator.share({
                          title: digest.title,
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Link copied to clipboard");
                      }
                    }
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden md:inline">Share</span>
                </Button>

                {pdfUrl && (
                  <Button
                    className="bg-[#001529] hover:bg-[#002a52] text-white rounded-lg gap-2 cursor-pointer"
                    size="sm"
                    onClick={() => window.open(pdfUrl, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden md:inline">Download Report</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className={`flex-grow ${isFullScreen ? 'p-0' : 'container mx-auto px-4 py-8 max-w-6xl'}`}>
          {pdfUrl ? (
            <div
              ref={iframeRef}
              className={`bg-white shadow-2xl overflow-hidden border border-border relative group transition-all duration-500 ${
                isFullScreen
                  ? 'w-full h-full border-none rounded-none'
                  : 'rounded-2xl h-[80vh] md:h-[90vh]'
              }`}
            >
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full border-none"
                title={digest.title}
              />

              <div className={`absolute bottom-6 right-6 transition-opacity ${isFullScreen ? 'opacity-40 hover:opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <Button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="bg-white/90 backdrop-blur text-[#001529] hover:bg-white border shadow-xl rounded-full px-6 py-6 cursor-pointer"
                >
                  {isFullScreen ? (
                    <>
                      <Minimize className="h-4 w-4 mr-2" />
                      Exit Full Screen
                    </>
                  ) : (
                    <>
                      <Maximize className="h-4 w-4 mr-2" />
                      View Full Screen
                    </>
                  )}
                </Button>
              </div>

              {isFullScreen && (
                <button
                  onClick={() => setIsFullScreen(false)}
                  className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur transition-colors cursor-pointer"
                >
                  <X className="h-6 w-6" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-slate-300">
              <Newspaper className="h-16 w-16 text-slate-200 mb-4" />
              <h3 className="text-xl font-bold text-slate-800">No PDF Available</h3>
              <p className="text-slate-500">This report doesn't have a PDF attachment.</p>
            </div>
          )}

          {pdfUrl && !isFullScreen && (
            <div className="mt-8 text-center text-muted-foreground text-sm pb-10">
              <p>Having trouble viewing? <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">Click here to open PDF directly</a></p>
            </div>
          )}
        </div>
      </main>

    </div>
  );
}
