import type { Metadata } from "next";
import { Inter, Montserrat, Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import MobileNav from "@/components/MobileNav";
import JigyasaChatButton from "@/components/JigyasaChatButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-heading",
});

import Script from "next/script";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "India IPO — India's Leading IPO Consultancy Platform",
  description: "Expert IPO consultancy for SME IPO, Mainline IPO, FPO, Pre-IPO funding. SEBI registered advisory firm.",
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
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "India IPO — India's Leading IPO Consultancy",
    description: "Expert IPO consultancy for SME IPO, Mainline IPO, FPO, Pre-IPO funding. SEBI registered advisory firm.",
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
    images: ["https://api.indiaipoapp.indiaipo.in/uploads/images/1779091526823_11yqc03fyblg.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(montserrat.variable, "font-sans", geist.variable)}>
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function (w, d, s, l, i) {
              w[l] = w[l] || []; w[l].push({
                'gtm.start':
                  new Date().getTime(), event: 'gtm.js'
              }); var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
                  'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', 'GTM-WGV66WQ');`}
        </Script>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5445033715417509"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WGV66WQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <AuthProvider>
          {children}
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
      </body>
    </html>
  );
}


