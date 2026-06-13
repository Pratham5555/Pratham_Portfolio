import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Hide the floating Next.js dev indicator ("N" badge) in development.
  devIndicators: false,
};

export default nextConfig;
