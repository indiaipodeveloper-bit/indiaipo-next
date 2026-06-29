"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, Download, Share2, BookOpen, X, Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/utils";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(
  () => import("@/components/common/PdfViewer"),
  {
    ssr: false,
  }
);
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

export default function MagazineViewerClient({ magazine }: MagazineViewerClientProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const iframeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullScreen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const pdfUrl = getImageUrl(magazine.pdf);

  const handleShare = () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: magazine.title,
        url: url
      }).catch((e) => console.log("Failed to share", e));
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div className={`min-h-screen bg-[#F8FAFC] flex flex-col ${isFullScreen ? 'overflow-hidden fixed inset-0 z-[100]' : ''}`}>
      <main className={`flex-grow flex flex-col ${isFullScreen ? 'h-screen' : ''}`}>
        {/* Reader Toolbar */}
        {!isFullScreen && (
          <div className="bg-white border-b border-border sticky top-[68px] z-30 py-3 shadow-sm">
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
                
                {/* <Button  */}
                {/*   className="bg-[#001529] hover:bg-[#002a52] text-white rounded-lg gap-2 cursor-pointer border-0" */}
                {/*   size="sm" */}
                {/*   onClick={() => window.open(pdfUrl, '_blank')} */}
                {/* > */}
                {/*   <Download className="h-4 w-4" /> */}
                {/*   <span className="hidden md:inline">Download PDF</span> */}
                {/* </Button> */}
              </div>
            </div>
          </div>
        )}

        {/* PDF Viewer Container */}
        <div className={`flex-grow ${isFullScreen ? 'p-0' : 'container mx-auto px-4 py-8 max-w-6xl'}`}>
          <div 
            ref={iframeRef}
            className={`bg-white shadow-2xl overflow-hidden border border-border relative group transition-all duration-500 ${
              isFullScreen 
                ? 'w-full h-full border-none rounded-none' 
                : 'rounded-2xl h-[80vh] md:h-[90vh]'
            }`}
          >
            {/* <iframe  */}
            {/*   src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`} */}
            {/*   className="w-full h-full border-none" */}
            {/*   title={magazine.title} */}
            {/* /> */}
            <PdfViewer
              pdfUrl={pdfUrl}
              className={`${isFullScreen ? "h-[99.9vh]" : "h-full"}`}
            />
            {/* Full Screen Toggle Button */}
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

            {/* Close Button in Full Screen */}
            {isFullScreen && (
              <button 
                onClick={() => setIsFullScreen(false)}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur transition-colors cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
          
          {/* {!isFullScreen && ( */}
          {/*   <div className="mt-8 text-center text-muted-foreground text-sm pb-10"> */}
          {/*     <p>Having trouble viewing? <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">Click here to open PDF directly</a></p> */}
          {/*   </div> */}
          {/* )} */}
        </div>
      </main>
    </div>
  );
}
