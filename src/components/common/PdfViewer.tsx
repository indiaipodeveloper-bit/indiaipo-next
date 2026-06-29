"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useVirtualizer } from "@tanstack/react-virtual";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfViewerProps {
  pdfUrl: string;
  className?: string;
}

export default function PdfViewer({
  pdfUrl,
  className = "",
}: PdfViewerProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(900);

  const updateWidth = useCallback(()=>{
    const width = parentRef.current?.clientWidth ?? window.innerWidth;
    if (width < 640) {
      setPageWidth(width - 32);
    } else if (width < 768) {
      setPageWidth(600);
    } else if (width < 1024) {
      setPageWidth(700);
    } else {
      setPageWidth(900);
    }
  },[])

  useEffect(() => {
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    
    if(parentRef.current){
      observer.observe(parentRef.current);
    }

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth)
      observer.disconnect();
    };
  }, [updateWidth]);

    const rowVirtualizer = useVirtualizer({
      count: numPages,
      getScrollElement: () => parentRef.current,
      estimateSize: () => pageWidth * 1.42 + 24, // A4 ratio + margin
      overscan: 3,
    });

  return (
    <div
      ref={parentRef}
      className={`overflow-y-auto bg-slate-100 flex justify-center ${className}`}
    >
      <Document
        file={pdfUrl}
        loading={
          <div className="py-20 text-center">
            Loading PDF...
          </div>
        }
        error={
          <div className="py-20 text-center">
            Failed to load PDF.
          </div>
        }
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualPage) => (
            <div
              key={virtualPage.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualPage.start}px)`,
                display: "flex",
                justifyContent: "center",
                paddingBottom: 20,
              }}
            >
              <Page
                pageNumber={virtualPage.index + 1}
                width={pageWidth}
                renderTextLayer
                renderAnnotationLayer
              />
            </div>
          ))}
        </div>
      </Document>    </div>
  );
}
