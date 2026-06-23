import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    middlewareClientMaxBodySize: "50mb",
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NODE_ENV === "production"
          ? "https://api.indiaipo.in/api/:path*"
          : "http://localhost:5000/api/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: process.env.NODE_ENV === "production"
          ? "https://api.indiaipo.in/uploads/:path*"
          : "http://localhost:5000/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
