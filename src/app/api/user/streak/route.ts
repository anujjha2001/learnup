import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/getAuthSession";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const now = new Date();
    let newStreak = user.streak || 0;
    let didUpdate = false;

    if (user.lastLogin) {
      const lastLoginDate = new Date(user.lastLogin);
      const lastMidnight = new Date(lastLoginDate.getFullYear(), lastLoginDate.getMonth(), lastLoginDate.getDate());
      const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const diffDays = Math.round((todayMidnight.getTime() - lastMidnight.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak += 1;
        didUpdate = true;
      } else if (diffDays > 1) {
        newStreak = 1;
        didUpdate = true;
      }
    } else {
      newStreak = 1;
      didUpdate = true;
    }

    if (didUpdate || !user.lastLogin) {
      await db.user.update({
        where: { id: user.id },
        data: {
          lastLogin: now,
          streak: newStreak
        }
      });
    }

    return NextResponse.json({
      streak: newStreak,
      lastLogin: user.lastLogin ? user.lastLogin.toISOString() : now.toISOString()
    });
  } catch (error: any) {
    console.error("Streak calculation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
