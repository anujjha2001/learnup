import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, image, thumbnailUrl, isFree, price, template, modules, instructorId } = body;

    if (!title || !instructorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newCourse = await db.course.create({
      data: {
        title,
        description,
        image,
        thumbnailUrl: thumbnailUrl || image || "",
        isFree,
        price,
        template,
        modules,
        instructorId,
      },
    });

    // Save modular video pathways securely in the VideoModule table
    if (Array.isArray(modules)) {
      await Promise.all(
        modules.map((mod: any, index: number) =>
          db.videoModule.create({
            data: {
              courseId: newCourse.id,
              title: mod.title || `Module ${index + 1}`,
              videoUrl: mod.url || mod.videoUrl || "",
              order: index + 1,
            }
          })
        )
      );
    }

    // Trigger In-App Notifications for students enrolled in this instructor's other courses
    try {
      const existingEnrollments = await db.courseEnrollment.findMany({
        where: {
          course: {
            instructorId: instructorId
          }
        },
        select: { userId: true },
        distinct: ['userId']
      });

      if (existingEnrollments.length > 0) {
        const notifications = existingEnrollments.map((enr) => ({
          title: "New Course Published!",
          message: `Your instructor just published a new course: ${title}`,
          isRead: false,
          userId: enr.userId,
        }));

        await db.notification.createMany({
          data: notifications
        });
      }
    } catch (notifErr) {
      console.error("Failed to send course notifications:", notifErr);
    }

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error: any) {
    console.error("Course creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
