import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextRequest, NextResponse } from "next/server";
import { decode } from "next-auth/jwt";

const handler = NextAuth(authOptions);

async function handleRequest(req: NextRequest, context: { params: Promise<{ nextauth: string[] }> }) {
  const res = await handler(req as any, context as any);

  // 1. Intercept OAuth callback redirect
  if (req.nextUrl.pathname.includes("/callback/") && res.status === 302) {
    const cookies = res.headers.getSetCookie();
    let tokenStr = "";

    // Find session token securely
    for (const c of cookies) {
      if (c.includes("next-auth.session-token") || c.includes("__Secure-next-auth.session-token")) {
        tokenStr = c.split(";")[0].split("=")[1];
        break;
      }
    }

    if (tokenStr) {
      try {
        const decoded = await decode({
          token: tokenStr,
          secret: process.env.NEXTAUTH_SECRET as string
        });

        if (decoded && decoded.role) {
          const role = decoded.role.toString().toUpperCase();
          const dashboardPath = role === "INSTRUCTOR" ? "/auth/dashboard/instructor" : "/auth/dashboard/student";

          // FIX: Use production URL from env instead of req.nextUrl.origin
          const baseUrl = process.env.NEXTAUTH_URL || "https://learnup-myfcghv2q-anujjha2001s-projects.vercel.app";
          const newUrl = new URL(dashboardPath, baseUrl);

          const newRes = NextResponse.redirect(newUrl, 302);

          // Preserve all original NextAuth cookies
          cookies.forEach((c: string) => newRes.headers.append("Set-Cookie", c));

          return newRes;
        }
      } catch (e) {
        console.error("JWT Decode error in OAuth callback:", e);
      }
    }
  }

  return res;
}

export const GET = handleRequest;
export const POST = handleRequest;
