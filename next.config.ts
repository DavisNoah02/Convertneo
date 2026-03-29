import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.badtz-ui.com",
      },
    ],
  },
};

export default nextConfig;
