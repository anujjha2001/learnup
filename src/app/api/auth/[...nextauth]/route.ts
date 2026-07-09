import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextRequest, NextResponse } from "next/server";
import { decode } from "next-auth/jwt";

const handler = NextAuth(authOptions);

async function handleRequest(req: NextRequest, context: { params: Promise<{ nextauth: string[] }> }) {
  const res = await handler(req as any, context as any);
  
  // Intercept the OAuth callback redirect and strictly route based on database role
  if (req.nextUrl.pathname.includes("/callback/") && res.status === 302) {
    const cookies = res.headers.getSetCookie();
    let tokenStr = "";
    
    for (const c of cookies) {
      if (c.startsWith("next-auth.session-token=") || c.startsWith("__Secure-next-auth.session-token=")) {
        tokenStr = c.split(";")[0].substring(c.indexOf("=") + 1);
        break;
      }
    }
    
    if (tokenStr) {
      try {
        const decoded = await decode({ token: tokenStr, secret: process.env.NEXTAUTH_SECRET as string });
        
        if (decoded && decoded.role) {
          const dashboardUrl = decoded.role.toString().toUpperCase() === "INSTRUCTOR" 
            ? "/auth/dashboard/instructor" 
            : "/auth/dashboard/student";
          
          const newUrl = new URL(dashboardUrl, req.nextUrl.origin);
          const newRes = NextResponse.redirect(newUrl);
          
          // Preserve the session cookies set by NextAuth
          cookies.forEach(c => newRes.headers.append("Set-Cookie", c));
          
          return newRes;
        }
      } catch (e) {
        console.error("JWT Decode error in OAuth callback:", e);
      }
    }
  }
  
  return res;
}

export async function GET(req: NextRequest, context: { params: Promise<{ nextauth: string[] }> }) {
  return handleRequest(req, context);
}

export async function POST(req: NextRequest, context: { params: Promise<{ nextauth: string[] }> }) {
  return handleRequest(req, context);
}

