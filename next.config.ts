import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    middlewareClientMaxBodySize: "50mb",
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "indiaipo.in",
          },
        ],
        destination: "https://www.indiaipo.in/:path*",
        permanent: true,
      },
      {
        source: "/ipo/:path*",
        destination: "https://www.indiaipo.in/all-ipos/:path*",
        permanent: true,
      },
    ];
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
    ];
  },
};

export default nextConfig;
