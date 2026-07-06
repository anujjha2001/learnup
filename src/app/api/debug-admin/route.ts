import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession();
    console.log("[Debug Admin] Session detected:", session);

    const cookieStore = await cookies();
    const token = cookieStore.get("learnup_token")?.value;
    
    let parsedRole = "GUEST";
    let parsedStatus = "GUEST";
    let parsedUserId = "";
    if (token && token.startsWith("jwt-session-token-placeholder-")) {
      const tokenPart = token.replace("jwt-session-token-placeholder-", "");
      const parts = tokenPart.split("-");
      if (parts.length >= 4) {
        parsedRole = parts[parts.length - 3];
        parsedStatus = parts[parts.length - 2];
        parsedUserId = parts.slice(0, parts.length - 3).join("-");
      }
    }

    const tokenStructure = {
      rawToken: token || null,
      parsedUserId,
      parsedRole,
      parsedStatus,
    };

    if (!session) {
      return NextResponse.json({
        success: false,
        error: "No session token found. Please log in first.",
        tokenStructure,
      });
    }

    const dbUser = await db.user.findUnique({
      where: { id: session.id },
    });

    console.log("[Debug Admin] Database User record:", {
      id: dbUser?.id,
      email: dbUser?.email,
      role: dbUser?.role,
      status: dbUser?.status,
    });

    return NextResponse.json({
      success: true,
      session,
      tokenStructure,
      databaseUser: dbUser
        ? {
            id: dbUser.id,
            email: dbUser.email,
            role: dbUser.role,
            status: dbUser.status,
          }
        : null,
    });
  } catch (error: any) {
    console.error("[Debug Admin] Error during validation:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "An unexpected error occurred.",
    });
  }
}
