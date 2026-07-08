import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/getAuthSession";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tickets = await db.supportTicket.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tickets);
  } catch (error: any) {
    console.error("Failed to fetch support tickets:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
