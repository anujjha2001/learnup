import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (query.length < 2) {
      return NextResponse.json({ courses: [], users: [], resources: [] });
    }

    const lowerQuery = query.toLowerCase();

    // Search Users (Instructors by name or learnupId)
    const users = await db.user.findMany({
      where: {
        role: "INSTRUCTOR",
        OR: [
          { name: { contains: lowerQuery } },
          { learnupId: { contains: lowerQuery } }
        ]
      },
      select: {
        id: true,
        name: true,
        learnupId: true,
        avatar: true
      },
      take: 5
    });

    // Search Courses
    const courses = await db.course.findMany({
      where: {
        OR: [
          { title: { contains: lowerQuery } },
          { description: { contains: lowerQuery } }
        ]
      },
      select: {
        id: true,
        title: true,
        image: true,
        instructor: { select: { name: true, learnupId: true } }
      },
      take: 5
    });

    // Search Quizzes as resources
    const quizzes = await db.quiz.findMany({
      where: {
        OR: [
          { title: { contains: lowerQuery } },
          { description: { contains: lowerQuery } }
        ]
      },
      select: {
        id: true,
        title: true
      },
      take: 5
    });

    const resources = quizzes.map(q => ({ ...q, type: "quiz" }));

    return NextResponse.json({
      users,
      courses,
      resources
    });
  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}
