import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const modules = await db.videoModule.findMany({
      where: { courseId: id },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(modules, { status: 200 });
  } catch (error: any) {
    console.error("Fetch course modules error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
