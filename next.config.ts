import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remote image patterns for Next.js Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
