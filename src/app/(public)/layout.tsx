import type { Metadata } from "next";
import { Inter, Montserrat, Geist } from "next/font/google";
import { Toaster } from "sonner";
import MobileNav from "@/components/MobileNav";
import JigyasaChatButton from "@/components/JigyasaChatButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import QueryProvider from "@/components/QueryProvider";
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-heading",
});

import Script from "next/script";
import { cn } from "@/lib/utils";
import AdsenseScript from "@/components/common/AdSenseScript";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "India IPO — India's Leading IPO Consultancy Platform",
  description:
    "Expert IPO consultancy for SME IPO, Mainline IPO, FPO, Pre-IPO funding. SEBI registered advisory firm.",
  authors: [{ name: "India IPO" }],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "India IPO — India's Leading IPO Consultancy",
    description:
      "Expert IPO consultancy for SME IPO, Mainline IPO, FPO, Pre-IPO funding. SEBI registered advisory firm.",
    type: "website",
    images: [
      {
        url: "https://api.indiaipoapp.indiaipo.in/uploads/images/1779091526823_11yqc03fyblg.png",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@India IPO",
    images: [
      "https://api.indiaipoapp.indiaipo.in/uploads/images/1779091526823_11yqc03fyblg.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <AuthProvider>
        <Header />
        {children}
        <Footer />
        <Toaster position="top-right" richColors />
        <MobileNav />
        {/* Floating buttons — stacked together */}
        <div className="fixed bottom-24 md:bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          <Suspense fallback={null}>
            <JigyasaChatButton />
          </Suspense>
          <WhatsAppButton />
        </div>
      </AuthProvider>
    </QueryProvider>
  );
}
