import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");
  const instructorId = searchParams.get("instructorId");

  try {
    const where: any = { isLive: true };
    if (courseId) where.courseId = courseId;
    if (instructorId) where.instructorId = instructorId;

    const sessions = await prisma.liveSession.findMany({
      where,
      orderBy: { startedAt: "desc" }
    });
    
    return NextResponse.json(sessions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch live sessions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { courseId, instructorId, roomName } = body;

    if (!courseId || !instructorId || !roomName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if there is already an active session for this course
    const existing = await prisma.liveSession.findFirst({
      where: { courseId, isLive: true }
    });

    if (existing) {
      // Just return the existing one
      return NextResponse.json(existing);
    }

    const session = await prisma.liveSession.create({
      data: {
        courseId,
        instructorId,
        roomName,
        isLive: true,
      }
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to start live session" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, isLive } = body;

    if (!id) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const session = await prisma.liveSession.update({
      where: { id },
      data: { 
        isLive,
        endedAt: isLive ? null : new Date()
      }
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update live session" }, { status: 500 });
  }
}
