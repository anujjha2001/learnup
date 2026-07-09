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
  env: {
    // Provide a safe fallback to prevent ERR_INVALID_URL during Vercel static prerendering
    NEXTAUTH_URL: process.env.NEXTAUTH_URL 
      ? (process.env.NEXTAUTH_URL.startsWith("http") ? process.env.NEXTAUTH_URL : `https://${process.env.NEXTAUTH_URL}`)
      : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  }
};

export default nextConfig;
