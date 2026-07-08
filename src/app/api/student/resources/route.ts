import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/getAuthSession";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.user?.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.id;

    // Fetch enrolled courses and their associated instructor resources
    const enrollments = await db.courseEnrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            resources: true
          }
        }
      }
    });

    // Fetch resources the student has chosen to delete/hide from view
    const deletedList = await db.studentDeletedResource.findMany({
      where: { userId },
      select: { resourceId: true }
    });
    const deletedIds = new Set(deletedList.map(d => d.resourceId));

    // Map DB resources
    const dbResources = enrollments.flatMap(e =>
      e.course.resources.map(r => ({
        id: r.id,
        courseId: e.courseId,
        courseTitle: e.course.title,
        title: r.title,
        type: r.type,
        size: r.size,
        url: r.url
      }))
    );

    // Mock default resources for fallback study material
    const mockResources = enrollments.flatMap(e => [
      {
        id: `res-${e.courseId}`,
        courseId: e.courseId,
        courseTitle: e.course.title,
        title: `${e.course.title} - Complete Study Guide`,
        type: "PDF",
        size: "2.4 MB",
        url: "#"
      },
      {
        id: `res-cheat-${e.courseId}`,
        courseId: e.courseId,
        courseTitle: e.course.title,
        title: `${e.course.title} - Cheatsheet`,
        type: "PDF",
        size: "1.1 MB",
        url: "#"
      }
    ]);

    const allResources = [...dbResources, ...mockResources];

    // Filter out deleted items
    const filteredResources = allResources.filter(r => !deletedIds.has(r.id));

    return NextResponse.json(filteredResources);
  } catch (error: any) {
    console.error("Resources GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.user?.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resourceId } = await req.json();
    if (!resourceId) {
      return NextResponse.json({ error: "Resource ID is required" }, { status: 400 });
    }

    // Save deletion record atomically
    await db.studentDeletedResource.upsert({
      where: {
        userId_resourceId: {
          userId: session.id,
          resourceId
        }
      },
      create: {
        userId: session.id,
        resourceId
      },
      update: {}
    });

    return NextResponse.json({ success: true, message: "Resource removed from view successfully." });
  } catch (error: any) {
    console.error("Resources DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
