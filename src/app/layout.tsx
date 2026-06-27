import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import AdsenseScript from "@/components/common/AdSenseScript";
import { Geist } from "next/font/google";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import QueryProvider from "@/components/QueryProvider";
import { AuthProvider } from "@/contexts/AuthContext";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "India IPO — India's Leading IPO Consultancy Platform",
  description:
    "Expert IPO consultancy for SME IPO, Mainline IPO, FPO, Pre-IPO funding. SEBI registered advisory firm.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(montserrat.variable, geist.variable, "font-sans")}
    >
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

        <AdsenseScript />
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
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
