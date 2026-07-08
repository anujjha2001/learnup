import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/getAuthSession";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const submissionId = searchParams.get("submissionId");
    const userId = session.id;

    if (submissionId) {
      // Fetch messages for a specific submission
      const messages = await db.mentorMessage.findMany({
        where: { submissionId },
        include: {
          sender: { select: { id: true, name: true, role: true, avatar: true } }
        },
        orderBy: { createdAt: "asc" }
      });
      return NextResponse.json(messages);
    } else {
      // Fetch submissions that belong to the user (if student) or user's courses (if instructor)
      // to display a list of active Q&A threads.
      if (session.user?.role === "INSTRUCTOR") {
        const submissions = await db.submission.findMany({
          where: {
            quiz: { course: { instructorId: userId } }
          },
          include: {
            quiz: { select: { title: true } },
            student: { select: { name: true, avatar: true } },
            mentorMessages: {
              orderBy: { createdAt: "desc" },
              take: 1
            }
          },
          orderBy: { submittedAt: "desc" }
        });
        return NextResponse.json(submissions);
      } else {
        const submissions = await db.submission.findMany({
          where: { studentId: userId },
          include: {
            quiz: { select: { title: true } },
            mentorMessages: {
              orderBy: { createdAt: "desc" },
              take: 1
            }
          },
          orderBy: { submittedAt: "desc" }
        });
        return NextResponse.json(submissions);
      }
    }
  } catch (error: any) {
    console.error("Mentor messages GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { submissionId, message } = body;

    if (!submissionId || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newMessage = await db.mentorMessage.create({
      data: {
        submissionId,
        senderId: session.id,
        message
      },
      include: {
        sender: { select: { id: true, name: true, role: true, avatar: true } }
      }
    });

    // If instructor replies, update submission status to REVIEWED
    if (session.user?.role === "INSTRUCTOR") {
      await db.submission.update({
        where: { id: submissionId },
        data: { status: "REVIEWED" }
      });
    }

    // Fetch submission details to notify the other party
    try {
      const submission = await db.submission.findUnique({
        where: { id: submissionId },
        include: {
          quiz: { include: { course: true } }
        }
      });

      if (submission) {
        const senderName = session.user?.name || "Someone";
        if (session.user?.role === "INSTRUCTOR") {
          // Notify Student of feedback reply
          await db.notification.create({
            data: {
              title: "New Mentor Feedback",
              message: `Instructor ${senderName} replied to your query.`,
              type: "QUERY_REPLY",
              userId: submission.studentId,
            }
          });
        } else {
          // Notify Instructor of query received
          const instructorId = submission.quiz?.course?.instructorId || "inst-1";
          await db.notification.create({
            data: {
              title: "New Student Query",
              message: `Student ${senderName} sent a query for ${submission.quiz?.title || 'the quiz'}.`,
              type: "QUERY_RECEIVED",
              userId: instructorId,
            }
          });
        }
      }
    } catch (notifErr) {
      console.warn("Mentor message notification failed:", notifErr);
    }

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error: any) {
    console.error("Mentor messages POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
