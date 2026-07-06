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

    // Calculate streak
    const now = new Date();
    let newStreak = (user as any).streak || 0;
    if ((user as any).lastLogin) {
      const lastLoginDate = new Date((user as any).lastLogin);
      const lastMidnight = new Date(lastLoginDate.getFullYear(), lastLoginDate.getMonth(), lastLoginDate.getDate());
      const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const diffDays = Math.round((todayMidnight.getTime() - lastMidnight.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        lastLogin: now,
        streak: newStreak
      }
    });

    // Create session token placeholder
    const sessionTokenPlaceholder = `jwt-session-token-placeholder-${user.id}-${user.role}-${user.status || "APPROVED"}-${Date.now()}`;

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
          streak: newStreak,
          lastLogin: now.toISOString(),
          learnupId: (user as any).learnupId,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
