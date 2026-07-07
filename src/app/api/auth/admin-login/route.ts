import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const AdminLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = AdminLoginSchema.safeParse(body);

    if (!result.success) {
      const errorMsg = result.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { email, password } = result.data;
    console.log(`[Admin Login API] Attempting login for email: ${email}`);

    // Find the user
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`[Admin Login API] User not found for email: ${email}`);
      return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
    }

    // Check credentials
    if (user.password !== password) {
      console.log(`[Admin Login API] Password mismatch for email: ${email}`);
      return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
    }

    // Verify role is strictly ADMIN
    if (user.role.toUpperCase() !== "ADMIN") {
      console.log(`[Admin Login API] Role verification failed. User role is: ${user.role}`);
      return NextResponse.json({ error: "Access denied. Not an administrator." }, { status: 403 });
    }

    // Create session token placeholder with ADMIN role and APPROVED status
    const sessionTokenPlaceholder = `jwt-session-token-placeholder-${user.id}-${user.role.toUpperCase()}-${user.status || "APPROVED"}-${Date.now()}`;
    console.log(`[Admin Login API] Login successful for user ID: ${user.id}. Token generated: ${sessionTokenPlaceholder}`);

    return NextResponse.json(
      {
        message: "Admin login successful.",
        token: sessionTokenPlaceholder,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Admin Login API] Critical handler error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
