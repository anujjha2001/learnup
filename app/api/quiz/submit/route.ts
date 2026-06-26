import { NextResponse } from "next/server";
import { db, checkDatabaseConnection } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

const SubmissionBodySchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  studentName: z.string().min(1, "Student Name is required"),
  quizId: z.string().min(1, "Quiz ID is required"),
  quizTitle: z.string().optional(),
  answers: z.array(z.any()),
});

export async function POST(req: Request) {
  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    return NextResponse.json({ error: "Failed to connect to database." }, { status: 500 });
  }

  try {
    const body = await req.json();
    console.log("Incoming Quiz Submission Payload:", JSON.stringify(body, null, 2));
    
    const validationResult = SubmissionBodySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({
        error: validationResult.error.issues[0]?.message || "Validation failed"
      }, { status: 400 });
    }

    const { studentId, studentName, quizId, quizTitle, answers } = validationResult.data;

    // Load quiz details from database
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

    // Save to PostgreSQL via Prisma Client
    const dbSubmission = await db.submission.create({
      data: {
        studentId,
        quizId,
        score: finalPercent,
        answers: answers as any,
      },
    });

    // Log notification
    try {
      await db.notification.create({
        data: {
          title: "New Quiz Submission",
          message: `${studentName} completed ${title} scoring ${finalPercent}%.`,
          isRead: false,
          userId: "inst-1",
        },
      });
    } catch (dbError) {
      console.warn("Notification insert failed:", dbError);
    }

    // Dispatch realtime event to alert instructors
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
      console.warn("Realtime channel publish skipped:", supaError);
    }

    return NextResponse.json({
      success: true,
      score: scoreCount,
      total: totalQuestions,
      percentage: finalPercent,
      submissionId: dbSubmission.id,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Submission handler error:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Failed to process quiz submission"
    }, { status: 500 });
  }
}
