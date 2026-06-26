import { NextResponse } from "next/server";
import { db, checkDatabaseConnection } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    return NextResponse.json({ error: "Failed to connect to submissions data service." }, { status: 500 });
  }

  try {
    const dbSubmissions = await db.submission.findMany({
      orderBy: { submittedAt: 'desc' },
      include: {
        student: {
          select: { name: true }
        },
        quiz: {
          select: { title: true }
        }
      }
    });

    const formatted = dbSubmissions.map(sub => ({
      id: sub.id,
      studentId: sub.studentId,
      studentName: sub.student?.name || "Student",
      quizId: sub.quizId,
      quizTitle: sub.quiz?.title || "Quiz",
      score: sub.score,
      answers: sub.answers,
      submittedAt: sub.submittedAt.toISOString()
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("GET /api/submissions db read error:", error);
    return NextResponse.json({ error: "Failed to connect to submissions data service." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    return NextResponse.json({ error: "Failed to connect to submissions data service." }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { studentId = "std-1", studentName = "Student", quizId, answers } = body;

    if (!quizId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Missing required parameters (quizId, answers)" }, { status: 400 });
    }

    // Try to load quiz details from database
    const dbQuiz = await db.quiz.findUnique({
      where: { id: quizId },
    });

    if (!dbQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const quizQuestions = (dbQuiz.questions as any) || [];
    const title = dbQuiz.title;

    // Calculate score
    let scoreCount = 0;
    const totalQuestions = quizQuestions.length || 1;

    quizQuestions.forEach((q: any, idx: number) => {
      const studentAnswer = answers[idx];
      const correctAnswer = q.correctAnswer;

      if (studentAnswer !== undefined && studentAnswer !== null) {
        if (typeof correctAnswer === "number") {
          if (studentAnswer === correctAnswer) {
            scoreCount++;
          }
        } else if (typeof correctAnswer === "string") {
          const studentText = typeof studentAnswer === "number" ? q.options?.[studentAnswer] : studentAnswer;
          if (studentText?.toString().trim().toLowerCase() === correctAnswer.toString().trim().toLowerCase()) {
            scoreCount++;
          }
        }
      }
    });

    const finalPercent = Math.round((scoreCount / totalQuestions) * 100);

    // Save submission to database
    const dbSubmission = await db.submission.create({
      data: {
        studentId,
        quizId,
        score: finalPercent,
        answers: answers as any,
      },
    });

    // Insert notification for instructor
    try {
      await db.notification.create({
        data: {
          title: "New Quiz Submission",
          message: `${studentName} completed ${title} scoring ${finalPercent}%.`,
          isRead: false,
          userId: "inst-1", // default instructor id
        },
      });
    } catch (notifErr) {
      console.warn("Notification insert failed:", notifErr);
    }

    // Trigger realtime notification event
    try {
      if (typeof (supabase as any).triggerSubmissionNotification === "function") {
        (supabase as any).triggerSubmissionNotification(studentName, title, finalPercent);
      } else {
        await supabase.from("Notification").insert([
          {
            title: "New Quiz Submission",
            message: `${studentName} completed ${title} scoring ${finalPercent}%.`,
            isRead: false,
            userId: "inst-1",
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (supaError) {
      console.warn("Supabase Realtime notification dispatch failed:", supaError);
    }

    return NextResponse.json({
      success: true,
      score: scoreCount,
      total: totalQuestions,
      percentage: finalPercent,
      submissionId: dbSubmission.id,
    }, { status: 200 });
  } catch (error: any) {
    console.error("Submission processing error:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Failed to process quiz submission"
    }, { status: 500 });
  }
}
