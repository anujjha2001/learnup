import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    appIsrStatus: false,
  } as any,
  experimental: {
    turbopack: {
      root: __dirname,
    },
  },
};

export default nextConfig;
