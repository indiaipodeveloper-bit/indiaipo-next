"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export default function AdsenseScript() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5445033715417509"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
