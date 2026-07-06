import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, message } = await req.json();
    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }

    const ticket = await db.supportTicket.create({
      data: {
        userId: session.id,
        subject,
        message,
        status: "OPEN",
      },
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error: any) {
    console.error("Failed to create support ticket:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
