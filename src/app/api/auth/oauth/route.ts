import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { provider, role, email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normRole = role?.toUpperCase() === "INSTRUCTOR" ? "INSTRUCTOR" : "STUDENT";

    // Find or create the user
    let user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email,
          name: name || `OAuth User`,
          role: normRole,
          isVerified: true,
          password: `oauth-mock-pwd-${provider}`,
        },
      });
    } else {
      // Keep verified state true for oauth logins
      if (!user.isVerified) {
        user = await db.user.update({
          where: { email },
          data: { isVerified: true },
        });
      }
    }

    const sessionToken = `oauth-jwt-placeholder-${user.id}-${user.role}-${user.status || "APPROVED"}-${Date.now()}`;

    // Mock avatar based on initials or provider
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || user.email)}`;

    return NextResponse.json(
      {
        message: "OAuth authorization successful.",
        token: sessionToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: avatar,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("OAuth API route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
