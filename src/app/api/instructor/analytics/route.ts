import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/getAuthSession";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.user?.role !== "INSTRUCTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const instructorId = session.id;

    // 1. Fetch instructor's courses
    const courses = await db.course.findMany({
      where: { instructorId },
      select: {
        id: true,
        title: true,
        price: true,
      },
    });

    const courseIds = courses.map((c) => c.id);

    // 2. Fetch successful transactions for instructor's courses
    const transactions = await db.transaction.findMany({
      where: {
        courseId: { in: courseIds },
        status: "SUCCESS",
      },
      select: {
        id: true,
        amount: true,
        instShare: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // 3. Student Matrix: get all students enrolled in these courses
    const enrollments = await db.courseEnrollment.findMany({
      where: {
        courseId: { in: courseIds },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        enrolledAt: "desc",
      },
    });

    const studentMatrix = enrollments.map((e) => ({
      id: e.user.id,
      name: e.user.name || "Student",
      email: e.user.email,
      courseTitle: e.course.title,
      enrolledAt: e.enrolledAt.toISOString(),
    }));

    // 4. Performance Metrics: quizzes and average scores
    // Find all quizzes in instructor's courses
    const quizzes = await db.quiz.findMany({
      where: {
        courseId: { in: courseIds },
      },
      select: {
        id: true,
        title: true,
        courseId: true,
        course: {
          select: {
            title: true,
          },
        },
        submissions: {
          select: {
            score: true,
          },
        },
      },
    });

    const quizMetrics = quizzes.map((q) => {
      const submissionsCount = q.submissions.length;
      const avgScore =
        submissionsCount > 0
          ? parseFloat(
              (
                q.submissions.reduce((acc, s) => acc + s.score, 0) /
                submissionsCount
              ).toFixed(1)
            )
          : 0;

      return {
        quizId: q.id,
        quizTitle: q.title,
        courseTitle: q.course.title,
        submissionsCount,
        avgScore,
      };
    });

    // Calculate course-level average quiz scores
    const coursePerformance = courses.map((course) => {
      const courseQuizzes = quizzes.filter((q) => q.courseId === course.id);
      let totalSubmissions = 0;
      let sumScores = 0;
      courseQuizzes.forEach((q) => {
        totalSubmissions += q.submissions.length;
        sumScores += q.submissions.reduce((acc, s) => acc + s.score, 0);
      });

      return {
        courseId: course.id,
        courseTitle: course.title,
        averageScore: totalSubmissions > 0 ? parseFloat((sumScores / totalSubmissions).toFixed(1)) : 0,
        submissionsCount: totalSubmissions,
      };
    });

    // 5. Interaction Data: Open Support Tickets for students enrolled in instructor's courses
    const studentUserIds = Array.from(new Set(enrollments.map((e) => e.userId)));
    const openSupportTicketsCount = await db.supportTicket.count({
      where: {
        status: "OPEN",
        userId: { in: studentUserIds },
      },
    });

    // 6. Format transaction data for the Revenue Graph (e.g. daily group)
    const revenueByDate: { [key: string]: number } = {};
    transactions.forEach((tx) => {
      const dateStr = tx.createdAt.toISOString().split("T")[0]; // YYYY-MM-DD
      revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + tx.instShare;
    });

    const revenueGraphData = Object.entries(revenueByDate).map(([date, revenue]) => ({
      date,
      revenue: parseFloat(revenue.toFixed(2)),
    }));

    return NextResponse.json({
      revenueGraphData,
      studentMatrix,
      quizMetrics,
      coursePerformance,
      openSupportTicketsCount,
      totalInstructorRevenue: transactions.reduce((acc, tx) => acc + tx.instShare, 0),
    });
  } catch (error: any) {
    console.error("Failed to fetch instructor analytics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
