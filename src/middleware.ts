import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Resolve Auth Token from NextAuth first, fall back to custom learnup_token
  const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const customToken = req.cookies.get("learnup_token")?.value;
  const learnupSession = req.cookies.get("learnup_session")?.value;

  let role: string | null = null;
  let isVerified = false;

  if (nextAuthToken) {
    role = (nextAuthToken.role as string)?.toUpperCase() || null;
    isVerified = nextAuthToken.isVerified !== false;
  } else if (customToken) {
    // Decode custom token
    try {
      const parts = customToken.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (payload) {
          role = (payload.role as string)?.toUpperCase() || null;
          isVerified = true; // custom tokens are set after OTP verification
        }
      } else if (customToken.startsWith("jwt-session-token-placeholder-")) {
        const tokenPart = customToken.replace("jwt-session-token-placeholder-", "");
        const parts = tokenPart.split("-");
        const possibleRole = parts[parts.length - 3]?.toUpperCase();
        if (["ADMIN", "INSTRUCTOR", "STUDENT"].includes(possibleRole)) {
          role = possibleRole;
        }
        const status = parts[parts.length - 2]?.toUpperCase();
        isVerified = status === "APPROVED" || status === "PENDING";
      }
    } catch (e) {
      console.error("Failed to parse custom token in middleware:", e);
    }
  } else if (learnupSession) {
    try {
      const parsed = JSON.parse(learnupSession);
      role = (parsed.role as string)?.toUpperCase() || null;
      isVerified = true;
    } catch {}
  }

  // 2. Identify if route is protected
  const isProtectedDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/auth/dashboard");
  const isInstructorDashboard = pathname.startsWith("/instructor-dashboard") || (pathname.startsWith("/auth/dashboard/instructor"));
  const isAdminGateway = pathname.startsWith("/admin-gateway");

  const isProtectedRoute = isProtectedDashboard || isInstructorDashboard || isAdminGateway;

  // Allow admin login page to be public
  if (pathname === "/admin-gateway/login") {
    return NextResponse.next();
  }

  // 3. Handle protection redirects
  if (isProtectedRoute) {
    if (!role) {
      // Redirect unauthenticated to landing page with auth=true
      const loginUrl = new URL("/", req.url);
      loginUrl.searchParams.set("auth", "true");
      return NextResponse.redirect(loginUrl);
    }

    // Role specific checks
    if (isAdminGateway && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (isInstructorDashboard && role !== "INSTRUCTOR") {
      // Students should go to student dashboard
      return NextResponse.redirect(new URL("/auth/dashboard/student", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin-gateway/:path*",
    "/instructor-dashboard/:path*",
    "/dashboard/:path*",
    "/auth/dashboard/:path*",
  ],
};
