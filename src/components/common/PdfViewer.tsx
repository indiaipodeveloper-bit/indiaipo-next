"use client";

import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

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
  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(900);

  useEffect(() => {
    const updateWidth = () => {
      if (window.innerWidth < 640) {
        setPageWidth(window.innerWidth - 32);
      } else if (window.innerWidth < 768) {
        setPageWidth(600);
      } else if (window.innerWidth < 1024) {
        setPageWidth(700);
      } else {
        setPageWidth(900);
      }
    };

    updateWidth();

    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div
      className={`overflow-y-auto bg-slate-100 flex justify-center ${className}`}
    >
      <Document
        file={pdfUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={
          <div className="flex justify-center items-center h-full py-20">
            Loading PDF...
          </div>
        }
        error={
          <div className="py-20 text-center">
            Failed to load PDF.
          </div>
        }
      >
        {Array.from(new Array(numPages), (_, index) => (
          <div
            key={index}
            className="mb-5 flex justify-center"
          >
            <Page
              pageNumber={index + 1}
              width={pageWidth}
              renderTextLayer
              renderAnnotationLayer
            />
          </div>
        ))}
      </Document>
    </div>
  );
}
