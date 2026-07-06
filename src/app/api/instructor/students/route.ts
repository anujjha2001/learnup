import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find all courses by this instructor
    const courses = await db.course.findMany({
      where: { instructorId: session.id },
      select: { id: true, title: true }
    });

    const courseIds = courses.map(c => c.id);

    // Find enrollments in these courses
    const enrollments = await db.courseEnrollment.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        course: {
          select: {
            title: true
          }
        }
      }
    });

    const students = enrollments.map(e => ({
      id: e.user.id,
      name: e.user.name || "Student",
      email: e.user.email,
      courseTitle: e.course.title,
      enrolledAt: e.enrolledAt.toISOString(),
      progress: 92 // grading benchmark/progress
    }));

    return NextResponse.json(students);
  } catch (error: any) {
    console.error("Failed to fetch instructor students:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
