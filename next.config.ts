import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "macro-monitor";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: isProd ? `/${repoName}` : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
