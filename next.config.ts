// next.config.ts
import type { NextConfig } from "next";
import next from "next";

const allowedOrigins = process.env.CORS_ORIGINS
  ? JSON.parse(process.env.CORS_ORIGINS)
  : ["http://localhost:3000", "http://localhost:8000"];
const nextConfig: NextConfig = {
  reactStrictMode: false,
  // swcMinify: true,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: allowedOrigins.join(","),
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type,Authorization",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.brandfetch.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
