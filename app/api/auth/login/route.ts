import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = LoginSchema.safeParse(body);

    if (!result.success) {
      const errorMsg = result.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { email, password } = result.data;

    // Find the user
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Check credentials
    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Check if account is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { error: "Please verify your account before logging in." },
        { status: 403 }
      );
    }

    // Create session token placeholder
    const sessionTokenPlaceholder = `jwt-session-token-placeholder-${user.id}-${Date.now()}`;

    return NextResponse.json(
      {
        message: "Login successful.",
        token: sessionTokenPlaceholder,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
