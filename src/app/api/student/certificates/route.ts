import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/getAuthSession";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    const anySession = session as any;
    if (!anySession || anySession.user?.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = anySession.id || anySession.user?.id;

    // 1. Fetch passing submissions (score >= 60)
    const passingSubmissions = await db.submission.findMany({
      where: {
        studentId: userId,
        score: { gte: 60 }
      },
      include: {
        quiz: {
          include: { course: true }
        }
      },
      orderBy: { submittedAt: "desc" }
    });

    // Deduplicate submissions by courseId so we only have one certificate per course
    const uniqueCourseSubmissions: any[] = [];
    const seenCourses = new Set();
    for (const sub of passingSubmissions) {
      const courseId = sub.quiz?.courseId;
      if (courseId && !seenCourses.has(courseId)) {
        seenCourses.add(courseId);
        uniqueCourseSubmissions.push(sub);
      }
    }

    // 2. Fetch existing certificates from the database
    const dbCertificates = await db.certificate.findMany({
      where: { studentId: userId },
      include: { course: true }
    });

    const certMap = new Map();
    dbCertificates.forEach(cert => {
      certMap.set(cert.courseId, cert);
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 3. Construct response and trigger missing certificates asynchronously
    const certificates = uniqueCourseSubmissions.map(sub => {
      const course = sub.quiz.course;
      const courseId = course?.id;
      const existingCert = certMap.get(courseId);

      if (existingCert) {
        return {
          id: existingCert.id,
          quizId: sub.quizId,
          quizTitle: sub.quiz.title,
          courseTitle: course?.title || "Unknown Course",
          score: sub.score,
          issuedAt: existingCert.issueDate,
          url: existingCert.pdfUrl,
          uniqueCode: existingCert.uniqueCode,
          status: "completed"
        };
      } else {
        // Trigger certificate generation in the background (asynchronous, do not await)
        if (courseId) {
          fetch(`${appUrl}/api/certificates/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentId: userId, courseId })
          }).catch(err => {
            console.error("Async certificate generation trigger failed:", err);
          });
        }

        return {
          id: `cert-pending-${sub.id}`,
          quizId: sub.quizId,
          quizTitle: sub.quiz.title,
          courseTitle: course?.title || "Unknown Course",
          score: sub.score,
          issuedAt: sub.submittedAt,
          url: null,
          uniqueCode: null,
          status: "processing"
        };
      }
    });

    return NextResponse.json(certificates);
  } catch (error: any) {
    console.error("Certificates GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
