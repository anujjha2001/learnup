import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    appIsrStatus: false,
  } as any,
  allowedDevOrigins: [
    "192.168.10.164",
    "10.231.8.134",
    "localhost",
  ],
};

export default nextConfig;
