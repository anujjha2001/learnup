import { NextResponse } from "next/server";
import { db, checkDatabaseConnection } from "@/lib/db";
import { SEED_QUIZZES } from "@/constants/seedData";

export async function GET() {
  try {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.warn("Database offline, returning seed quizzes.");
      return NextResponse.json(SEED_QUIZZES, { status: 200 });
    }
    const dbQuizzes = await db.quiz.findMany({
      orderBy: { createdAt: "desc" }
    });
    // Merge DB quizzes with our rich seed list
    const uniqueTitles = new Set(dbQuizzes.map((q: any) => q.title));
    const filteredSeeds = SEED_QUIZZES.filter((q) => !uniqueTitles.has(q.title));
    return NextResponse.json([...dbQuizzes, ...filteredSeeds], { status: 200 });
  } catch (error) {
    console.error("GET /api/quizzes error:", error);
    return NextResponse.json(SEED_QUIZZES, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, topic, courseId = "c1", questions = [] } = body;

    if (!title) {
      return NextResponse.json({ error: "Quiz title is required" }, { status: 400 });
    }

    // Fetch Unsplash image based on topic query
    let imageUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600"; // default high-contrast abstract purple-orange artwork
    if (topic) {
      try {
        const unsplashRes = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(topic)}&per_page=1&client_id=rV6E3zK1Q0J52T7P1-8a8w7p3z2x5h3zQWp5h3zQWp5`);
        if (unsplashRes.ok) {
          const data = await unsplashRes.json();
          if (data.results && data.results.length > 0) {
            imageUrl = data.results[0].urls.regular;
          }
        }
      } catch (err) {
        console.warn("Unsplash API query fallback trigger:", err);
      }
    }

    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      const mockQuiz = {
        id: `q-mock-${Date.now()}`,
        title,
        description,
        image: imageUrl,
        courseId,
        questions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return NextResponse.json(mockQuiz, { status: 201 });
    }

    const newQuiz = await db.quiz.create({
      data: {
        title,
        description,
        courseId,
        questions: questions as any,
        image: imageUrl,
      }
    });

    // Trigger In-App Notifications for students enrolled in this course
    try {
      const existingEnrollments = await db.courseEnrollment.findMany({
        where: { courseId: courseId },
        select: { userId: true },
        distinct: ['userId']
      });

      if (existingEnrollments.length > 0) {
        const notifications = existingEnrollments.map((enr) => ({
          title: "New Quiz Available!",
          message: `A new quiz '${title}' has been added to your course.`,
          isRead: false,
          userId: enr.userId,
        }));

        await db.notification.createMany({
          data: notifications
        });
      }
    } catch (notifErr) {
      console.error("Failed to send quiz notifications:", notifErr);
    }

    return NextResponse.json(newQuiz, { status: 201 });
  } catch (error) {
    console.error("POST /api/quizzes error:", error);
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, title, description, topic, courseId, questions } = body;

    if (!id) {
      return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 });
    }

    let imageUrl: string | undefined = undefined;
    if (topic) {
      try {
        const unsplashRes = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(topic)}&per_page=1&client_id=rV6E3zK1Q0J52T7P1-8a8w7p3z2x5h3zQWp5h3zQWp5`);
        if (unsplashRes.ok) {
          const data = await unsplashRes.json();
          if (data.results && data.results.length > 0) {
            imageUrl = data.results[0].urls.regular;
          }
        }
      } catch (err) {
        console.warn("Unsplash API query fallback trigger:", err);
      }
    }

    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json({ id, title, description, courseId, questions, image: imageUrl }, { status: 200 });
    }

    const updatedQuiz = await db.quiz.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(courseId && { courseId }),
        ...(questions && { questions: questions as any }),
        ...(imageUrl && { image: imageUrl }),
      }
    });
    return NextResponse.json(updatedQuiz, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/quizzes error:", error);
    return NextResponse.json({ error: "Failed to update quiz" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 });
    }

    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json({ success: true, message: "Quiz deleted successfully (mock)" }, { status: 200 });
    }

    await db.quiz.delete({
      where: { id }
    });
    return NextResponse.json({ success: true, message: "Quiz deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/quizzes error:", error);
    return NextResponse.json({ error: "Failed to delete quiz" }, { status: 500 });
  }
}
