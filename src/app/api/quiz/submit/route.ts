import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { getAuthSession } from "@/lib/getAuthSession";

// Strict validation schema for submission parameters
const SubmissionBodySchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  studentName: z.string().min(1, "Student Name is required"),
  quizId: z.string().min(1, "Quiz ID is required"),
  quizTitle: z.string().optional(),
  answers: z.array(z.any()), // Array of option indices or answer values
});

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // Zod validation check
    const validationResult = SubmissionBodySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({
        error: validationResult.error.issues[0]?.message || "Validation failed"
      }, { status: 400 });
    }

    const { studentId, studentName, quizId, quizTitle, answers } = validationResult.data;

    // Load quiz details from database or fallback to mock quizzes
    let quizQuestions: any[] = [];
    let title = quizTitle || "Quiz";
    let instructorId = "inst-1";
    let dbQuiz: any = null;

    try {
      dbQuiz = await db.quiz.findUnique({
        where: { id: quizId },
        include: { course: true }
      });
      if (dbQuiz) {
        title = dbQuiz.title;
        quizQuestions = (dbQuiz.questions as any) || [];
        instructorId = dbQuiz.course?.instructorId || "inst-1";
      }
    } catch (dbError) {
      console.warn("DB offline or Quiz table missing, using static fallback");
    }

    // Fallback if DB doesn't have the quiz or is offline
    if (quizQuestions.length === 0) {
      const allMockQuizzes = getStaticQuizzes();
      const matched = allMockQuizzes.find((q) => q.id === quizId);
      if (matched) {
        title = matched.title;
        quizQuestions = matched.questions;
      }
    }

    // Calculate score
    let scoreCount = 0;
    const totalQuestions = quizQuestions.length || 1;
    const results: any[] = [];

    // console.log('Submitted Answers:', answers, 'Correct Answers:', quizQuestions.map((q: any) => q.correctAnswer), 'Calculated Score:', scoreCount);

    quizQuestions.forEach((q, idx) => {
      let studentAnswer = answers[idx]; 
      let correctAnswer = q.correctAnswer; 
      let isCorrect = false;

      // Extract value if it's an object
      if (typeof studentAnswer === 'object' && studentAnswer !== null) {
        studentAnswer = studentAnswer.id ?? studentAnswer.value ?? studentAnswer;
      }
      if (typeof correctAnswer === 'object' && correctAnswer !== null) {
        correctAnswer = correctAnswer.id ?? correctAnswer.value ?? correctAnswer;
      }

      if (studentAnswer !== undefined && studentAnswer !== null && correctAnswer !== undefined && correctAnswer !== null) {
        // Deep Validation: strict string comparison with trim to avoid hidden whitespace
        const studentAnswerStr = studentAnswer.toString().trim();
        const correctAnswerStr = correctAnswer.toString().trim();

        if (studentAnswerStr === correctAnswerStr) {
          isCorrect = true;
        } else if (studentAnswerStr.toLowerCase() === correctAnswerStr.toLowerCase()) {
           // Fallback case-insensitive match for text-based answers
          isCorrect = true;
        } else if (typeof correctAnswer === "number") {
          // If it was a number index (e.g. index 0, 1, 2 for options)
          if (Number(studentAnswerStr) === correctAnswer) {
            isCorrect = true;
          }
        } else if (typeof correctAnswer === "string" && q.options) {
           // If answer matches text of the option
           const studentText = typeof studentAnswer === "number" ? q.options[studentAnswer] : studentAnswer;
           if (studentText?.toString().trim().toLowerCase() === correctAnswerStr.toLowerCase()) {
             isCorrect = true;
           }
        }
      }

      if (isCorrect) scoreCount++;

      results.push({
        questionIndex: idx,
        isCorrect,
        studentAnswer,
        correctAnswer
      });
    });

    const finalPercent = Math.round((scoreCount / totalQuestions) * 100);
    const passingThreshold = 60;
    const passed = finalPercent >= passingThreshold;
    const submissionStatus = passed ? "passed" : "failed";

    // Save to PostgreSQL via Prisma Client
    let dbSubmission = null;
    try {
      dbSubmission = await db.submission.create({
        data: {
          studentId,
          quizId,
          score: finalPercent,
          answers: answers as any,
          status: submissionStatus
        },
      });

      // Log notification
      await db.notification.create({
        data: {
          title: "New Quiz Submission",
          message: `${studentName} completed ${title} scoring ${finalPercent}%. Result: ${passed ? 'PASS' : 'FAIL'}`,
          type: "QUIZ_SUBMITTED",
          isRead: false,
          userId: instructorId,
        },
      });

      // Course Completion Notification
      if (finalPercent >= 80) {
        await db.notification.create({
          data: {
            title: "Course Completed",
            message: `${studentName} completed ${dbQuiz?.course?.title || 'the course'} with score ${finalPercent}%.`,
            type: "QUIZ_SUBMITTED",
            isRead: false,
            userId: instructorId,
          },
        });
      }

      // Generate certificate asynchronously if passed
      if (finalPercent >= 60 && dbQuiz?.courseId) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        fetch(`${appUrl}/api/certificates/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId, courseId: dbQuiz.courseId })
        }).catch(err => console.error("Async cert generate trigger failed:", err));
      }
    } catch (dbError) {
      console.warn("Prisma failed to write submission, relying on runtime mock");
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
            userId: instructorId,
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
      passed,
      results,
      submissionId: dbSubmission?.id || `sub-mock-${Date.now()}`,
      debugInfo: {
        submittedAnswers: answers,
        expectedAnswers: quizQuestions.map((q: any) => q.correctAnswer),
        comparisonLog: results.map(r => ({
          questionId: r.questionIndex + 1,
          match: r.isCorrect
        }))
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Submission handler error:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Failed to process quiz submission"
    }, { status: 500 });
  }
}

// Fallback seed definitions
function getStaticQuizzes() {
  return [
    { id: "q1", title: "React Architecture Fundamentals", questions: [{ text: "What is nextjs recommended folder structure?", options: ["Everything in route.ts", "Colocated in components folder", "Place in public/"], correctAnswer: 1 }] },
    { id: "q2", title: "Cloud Computing Staging", questions: [{ text: "What does AWS stand for?", options: ["Amazon Web Services", "Alpha Web Software", "App Wire System"], correctAnswer: 0 }] },
    { id: "q3", title: "JavaScript Closures & Scopes", questions: [{ text: "Which keyword creates block scope?", options: ["var", "let/const", "function"], correctAnswer: 1 }] },
    { id: "q4", title: "TypeScript Interface Matrices", questions: [{ text: "How to declare an optional parameter?", options: ["param?", "param!", "param:optional"], correctAnswer: 0 }] },
    { id: "q5", title: "Next.js Server Actions Protocol", questions: [{ text: "Where do Server Actions run?", options: ["On the Client", "On the Server", "In the database"], correctAnswer: 1 }] },
    { id: "q6", title: "Go Concurrency & Channels", questions: [{ text: "Which keyword launches a goroutine?", options: ["run", "go", "launch"], correctAnswer: 1 }] },
    { id: "q7", title: "Docker Container Pipelines", questions: [{ text: "What command starts docker compose?", options: ["docker-compose up", "docker run", "docker start"], correctAnswer: 0 }] },
    { id: "q8", title: "Kubernetes Manifest Scaling", questions: [{ text: "What manages pod replicas in Kubernetes?", options: ["Service", "ReplicaSet", "Ingress"], correctAnswer: 1 }] },
    { id: "q9", title: "PostgreSQL Isolation Levels", questions: [{ text: "Which level prevents phantom reads?", options: ["Read Committed", "Serializable", "Repeatable Read"], correctAnswer: 1 }] },
    { id: "q10", title: "CSS Flexbox & Grid Matrix", questions: [{ text: "Which property centers items along flex direction?", options: ["justify-content", "align-items", "display"], correctAnswer: 0 }] },
    { id: "q11", title: "Git Workflow Rebase Loop", questions: [{ text: "How to apply commits on top of another branch?", options: ["git merge", "git rebase", "git checkout"], correctAnswer: 1 }] },
    { id: "q12", title: "LLMOps Validation Pipelines", questions: [{ text: "What is ML model quantization?", options: ["Reducing parameter precision", "Increasing parameters", "Deleting weights"], correctAnswer: 0 }] },
    { id: "q13", title: "Next.js Dynamic Routing Layers", questions: [{ text: "What file handles custom loading state?", options: ["page.tsx", "loading.tsx", "layout.tsx"], correctAnswer: 1 }] },
    { id: "q14", title: "Web Security Headers Suite", questions: [{ text: "What does CSP stand for?", options: ["Content Security Policy", "Client State Parameter", "Connection Secure Port"], correctAnswer: 0 }] },
    { id: "q15", title: "React State hooks performance", questions: [{ text: "Which hook stores mutable state without triggering renders?", options: ["useState", "useRef", "useEffect"], correctAnswer: 1 }] },
    { id: "q16", title: "Tailwind CSS Utility Design", questions: [{ text: "What class adds display flex?", options: ["block", "flex", "grid"], correctAnswer: 1 }] },
    { id: "q17", title: "Redux Toolkit State Trees", questions: [{ text: "What updates Redux state?", options: ["Actions", "Reducers", "Selectors"], correctAnswer: 1 }] },
    { id: "q18", title: "Next.js Middleware Gateways", questions: [{ text: "Where should middleware.ts be located?", options: ["In root or src/", "In app/api/", "In public/"], correctAnswer: 0 }] },
    { id: "q19", title: "AWS Lambda Provisioning", questions: [{ text: "What is Lambda's max timeout?", options: ["5 mins", "15 mins", "30 mins"], correctAnswer: 1 }] },
    { id: "q20", title: "JWT Authentication Tokens", questions: [{ text: "What does JWT stand for?", options: ["JSON Web Token", "Java Wire Transfer", "Joint Web Term"], correctAnswer: 0 }] },
    { id: "q21", title: "REST vs GraphQL Endpoints", questions: [{ text: "Which handles overfetching?", options: ["REST", "GraphQL", "SOAP"], correctAnswer: 1 }] }
  ].map(quiz => {
    while (quiz.questions.length < 10) {
      quiz.questions.push({
        text: `Practice Question ${quiz.questions.length + 1} for ${quiz.title}`,
        options: ["Correct Answer", "Incorrect Answer 1", "Incorrect Answer 2", "Incorrect Answer 3"],
        correctAnswer: 0
      });
    }
    return quiz;
  });
}
