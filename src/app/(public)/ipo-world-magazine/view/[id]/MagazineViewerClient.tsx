"use client";

import Link from "next/link";
import {
  ChevronLeft,
  Share2,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/utils";
import dynamic from "next/dynamic";
const PdfFlipper = dynamic(() => import("@/components/pdf/PdfFlipper"), {
  ssr: false,
});
interface Magazine {
  id: string | number;
  title: string;
  pdf: string;
  language: string;
  pdf_lock: boolean | number;
  report_images: string;
  created_at?: string;
}

interface MagazineViewerClientProps {
  magazine: Magazine;
}

export default function MagazineViewerClient({
  magazine,
}: MagazineViewerClientProps) {
  const pdfUrl = getImageUrl(magazine.pdf);

  const handleShare = () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: magazine.title,
          url: url,
        })
        .catch((e) => console.log("Failed to share", e));
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className={`min-h-screen bg-[#F8FAFC] flex flex-col`}>
      <main className={`grow flex flex-col`}>
        {/* Reader Toolbar */}
        <div className="bg-white border-b border-border sticky top-17 z-30 py-3 shadow-sm">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <Link href="/ipo-world-magazine">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Link>
              </Button>
              <div className="h-6 w-px bg-border hidden sm:block" />
              <div>
                <h1 className="text-sm md:text-base font-bold text-[#001529] line-clamp-1 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  {magazine.title}
                </h1>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                  {magazine.language} Edition
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg gap-2 border-border cursor-pointer"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden md:inline">Share</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="w-[80%] mx-auto" >
          <PdfFlipper url={pdfUrl} />
        </div>
      </main>
    </div>
  );
}
