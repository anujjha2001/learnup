import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("learnup_token")?.value;
  const { pathname } = req.nextUrl;

  let role = "GUEST";
  let status = "GUEST";
  let userId = "";

  let prefix = "";
  if (token) {
    if (token.startsWith("jwt-session-token-placeholder-")) {
      prefix = "jwt-session-token-placeholder-";
    } else if (token.startsWith("oauth-jwt-placeholder-")) {
      prefix = "oauth-jwt-placeholder-";
    }
  }

  if (prefix && token) {
    const tokenPart = token.replace(prefix, "");
    const parts = tokenPart.split("-");
    const possibleRole = parts[parts.length - 3]?.toUpperCase();
    if (["ADMIN", "INSTRUCTOR", "STUDENT"].includes(possibleRole)) {
      role = possibleRole;
      status = parts[parts.length - 2]?.toUpperCase();
      userId = parts.slice(0, parts.length - 3).join("-");
    } else {
      userId = parts.slice(0, parts.length - 1).join("-");
    }
  }

  // Hotfix debugging log
  console.log(`[Middleware] Pathname: ${pathname} | Token Role: ${role} | Status: ${status} | UserID: ${userId}`);

  // 1. Protect /admin-gateway (Role: ADMIN)
  if (pathname.startsWith("/admin-gateway")) {
    if (pathname === "/admin-gateway/login") {
      return NextResponse.next();
    }

    if (!token || !prefix || !role || role === "GUEST" || role.toUpperCase() !== "ADMIN") {
      console.log(`[Middleware Failure] Access denied on admin route. Redirecting to login.`);
      const url = req.nextUrl.clone();
      url.pathname = "/admin-gateway/login";
      return NextResponse.redirect(url);
    }
  }

  // 2. Protect /instructor-dashboard (Role: INSTRUCTOR, Status: APPROVED)
  if (pathname.startsWith("/instructor-dashboard")) {
    if (!token || !prefix) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("auth", "true");
      return NextResponse.redirect(url);
    }
    
    if (role !== "INSTRUCTOR") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("auth", "true");
      return NextResponse.redirect(url);
    }
    
    if (status === "PENDING") {
      const url = req.nextUrl.clone();
      url.pathname = "/pending-approval";
      return NextResponse.redirect(url);
    }
    
    if (status !== "APPROVED") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("auth", "true");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin-gateway/:path*",
    "/instructor-dashboard/:path*",
  ],
};
