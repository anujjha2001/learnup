import { NextResponse } from "next/server";
import { db, checkDatabaseConnection } from "@/lib/db";

export async function GET() {
  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    return NextResponse.json({ error: "Failed to load quizzes from repository database." }, { status: 500 });
  }

  try {
    const dbQuizzes = await db.quiz.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(dbQuizzes, { status: 200 });
  } catch (error) {
    console.error("GET /api/quizzes db read error:", error);
    return NextResponse.json({ error: "Failed to load quizzes from repository database." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    return NextResponse.json({ error: "Failed to connect to database." }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { title, description, courseId = "c1", questions = [] } = body;

    if (!title) {
      return NextResponse.json({ error: "Quiz title is required" }, { status: 400 });
    }

    const newQuiz = await db.quiz.create({
      data: {
        title,
        description,
        courseId,
        questions: questions as any,
      }
    });
    return NextResponse.json(newQuiz, { status: 201 });
  } catch (error) {
    console.error("POST /api/quizzes db create error:", error);
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    return NextResponse.json({ error: "Failed to connect to database." }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { id, title, description, courseId, questions } = body;

    if (!id) {
      return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 });
    }

    const updatedQuiz = await db.quiz.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(courseId && { courseId }),
        ...(questions && { questions: questions as any }),
      }
    });
    return NextResponse.json(updatedQuiz, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/quizzes db update error:", error);
    return NextResponse.json({ error: "Failed to update quiz" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    return NextResponse.json({ error: "Failed to connect to database." }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 });
    }

    await db.quiz.delete({
      where: { id }
    });
    return NextResponse.json({ success: true, message: "Quiz deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/quizzes db delete error:", error);
    return NextResponse.json({ error: "Failed to delete quiz" }, { status: 500 });
  }
}
