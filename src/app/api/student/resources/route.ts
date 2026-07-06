import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.id;

    // Fetch enrolled courses
    const enrollments = await db.courseEnrollment.findMany({
      where: { userId },
      include: { course: true }
    });

    const resources = enrollments.map(e => ({
      id: `res-${e.courseId}`,
      courseId: e.courseId,
      courseTitle: e.course.title,
      title: `${e.course.title} - Complete Study Guide`,
      type: "PDF",
      size: "2.4 MB",
      url: "#"
    }));

    // Add a few generic resources for each course
    const allResources = resources.flatMap(res => [
      res,
      {
        id: `res-cheat-${res.courseId}`,
        courseId: res.courseId,
        courseTitle: res.courseTitle,
        title: `${res.courseTitle} - Cheatsheet`,
        type: "PDF",
        size: "1.1 MB",
        url: "#"
      },
      {
        id: `res-code-${res.courseId}`,
        courseId: res.courseId,
        courseTitle: res.courseTitle,
        title: `${res.courseTitle} - Source Code Boilerplate`,
        type: "ZIP",
        size: "4.8 MB",
        url: "#"
      }
    ]);

    return NextResponse.json(allResources);
  } catch (error: any) {
    console.error("Resources GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
