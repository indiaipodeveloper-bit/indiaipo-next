import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    middlewareClientMaxBodySize: "50mb",
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? "https://api.indiaipo.in/api/:path*"
            : "http://localhost:5000/api/:path*",
      },
      {
        source: "/uploads/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? "https://api.indiaipo.in/uploads/:path*"
            : "http://localhost:5000/uploads/:path*",
      },
      {
        source: "/sitemap.xml",
        destination:
          process.env.NODE_ENV === "production"
            ? "https://api.indiaipo.in/sitemap.xml"
            : "http://localhost:5000/sitemap.xml",
      },
      {
        source: "/ipo-blogs-sitemap.xml",
        destination:
          process.env.NODE_ENV === "production"
            ? "https://api.indiaipo.in/ipo-blogs-sitemap.xml"
            : "http://localhost:5000/ipo-blogs-sitemap.xml",
      },
      {
        source: "/article-blogs-sitemap.xml",
        destination:
          process.env.NODE_ENV === "production"
            ? "https://api.indiaipo.in/article-blogs-sitemap.xml"
            : "http://localhost:5000/article-blogs-sitemap.xml",
      },
      {
        source: "/news-sitemap.xml",
        destination:
          process.env.NODE_ENV === "production"
            ? "https://api.indiaipo.in/news-sitemap.xml"
            : "http://localhost:5000/news-sitemap.xml",
      },
      {
        source: "/pages-sitemap.xml",
        destination:
          process.env.NODE_ENV === "production"
            ? "https://api.indiaipo.in/pages-sitemap.xml"
            : "http://localhost:5000/pages-sitemap.xml",
      },
    ];
  },
};

export default nextConfig;
