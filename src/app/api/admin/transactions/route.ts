import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transactions = await db.transaction.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        student: { select: { name: true, email: true } },
        instructor: { select: { name: true, email: true } },
        course: { select: { title: true } }
      }
    });

    const metrics = transactions.reduce((acc, txn) => {
      acc.totalRevenue += txn.amount;
      acc.adminEarnings += txn.adminShare;
      acc.instructorEarnings += txn.instShare;
      return acc;
    }, {
      totalRevenue: 0.0,
      adminEarnings: 0.0,
      instructorEarnings: 0.0
    });

    return NextResponse.json({
      transactions,
      metrics: {
        ...metrics,
        count: transactions.length
      }
    });
  } catch (error: any) {
    console.error("Admin transactions GET error:", error);
    return NextResponse.json({ error: error.message || "Failed to load transactions" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find all paid courses
    const courses = await db.course.findMany({
      where: { price: { gt: 0 } },
      include: { instructor: true }
    });

    if (courses.length === 0) {
      return NextResponse.json({ error: "No paid courses found in database to simulate sales" }, { status: 400 });
    }

    // Find all students
    const students = await db.user.findMany({
      where: { role: "STUDENT" }
    });

    if (students.length === 0) {
      return NextResponse.json({ error: "No student records found to simulate purchases" }, { status: 400 });
    }

    // Pick random course and random student
    const randomCourse = courses[Math.floor(Math.random() * courses.length)];
    const randomStudent = students[Math.floor(Math.random() * students.length)];

    // Fetch admin share percent
    let adminSharePercent = 20.0;
    const setting = await db.adminSetting.findUnique({
      where: { key: "admin_revenue_share" }
    });
    if (setting) {
      adminSharePercent = parseFloat(setting.value);
    }

    const amount = randomCourse.price;
    const adminShare = amount * (adminSharePercent / 100);
    const instShare = amount - adminShare;

    // Create a Transaction record
    const transaction = await db.transaction.create({
      data: {
        courseId: randomCourse.id,
        studentId: randomStudent.id,
        instructorId: randomCourse.instructorId,
        amount,
        adminShare,
        instShare
      },
      include: {
        student: { select: { name: true, email: true } },
        instructor: { select: { name: true, email: true } },
        course: { select: { title: true } }
      }
    });

    // Also create course enrollment if it doesn't already exist
    try {
      await db.courseEnrollment.create({
        data: {
          userId: randomStudent.id,
          courseId: randomCourse.id
        }
      });
    } catch (enrollErr) {
      // Safe to ignore if already enrolled
    }

    return NextResponse.json({
      success: true,
      transaction
    });
  } catch (error: any) {
    console.error("Admin transaction simulation error:", error);
    return NextResponse.json({ error: error.message || "Failed to simulate transaction" }, { status: 500 });
  }
}
