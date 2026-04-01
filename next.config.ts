import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Vercel deploys Next.js natively — no adapter needed
  webpack(config) {
    config.resolve.alias["~"] = path.resolve(__dirname, "app");
    return config;
  },
};

export default nextConfig;
