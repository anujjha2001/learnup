import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    // 1. Fetch course details
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: { instructor: true }
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const price = course.price;

    // 2. If course is free, bypass wallet check
    if (price === 0) {
      const student = await db.user.findUnique({
        where: { id: session.id },
        select: { name: true }
      });
      const studentName = student?.name || "A student";

      const enrollment = await db.courseEnrollment.create({
        data: { userId: session.id, courseId: courseId }
      });

      await db.notification.create({
        data: {
          title: "New Student Enrollment",
          message: `${studentName} enrolled in ${course.title} (Free).`,
          isRead: false,
          userId: course.instructorId,
        }
      });

      return NextResponse.json({ success: true, message: "Enrolled for free!" }, { status: 200 });
    }

    const adminShare = parseFloat((price * 0.20).toFixed(2));
    const instShare = parseFloat((price * 0.80).toFixed(2));

    // 3. Process the purchase atomically inside db.$transaction
    const result = await db.$transaction(async (tx) => {
      // Fetch student's wallet balance inside transaction to ensure atomicity
      const wallet = await tx.wallet.findUnique({
        where: { userId: session.id }
      });

      if (!wallet || wallet.balance < price) {
        throw new Error("Insufficient wallet balance. Please top up your wallet.");
      }

      // Deduct from student's wallet
      await tx.wallet.update({
        where: { userId: session.id },
        data: {
          balance: {
            decrement: price
          }
        }
      });

      // Credit instructor's wallet (80%)
      if (course.instructorId) {
        await tx.wallet.upsert({
          where: { userId: course.instructorId },
          create: {
            userId: course.instructorId,
            balance: instShare
          },
          update: {
            balance: {
              increment: instShare
            }
          }
        });
      }

      // Credit admin's wallet (20%)
      await tx.wallet.upsert({
        where: { userId: "admin-1" },
        create: {
          userId: "admin-1",
          balance: adminShare
        },
        update: {
          balance: {
            increment: adminShare
          }
        }
      });

      // Enroll student in the course
      await tx.courseEnrollment.upsert({
        where: {
          userId_courseId: {
            userId: session.id,
            courseId: courseId
          }
        },
        create: {
          userId: session.id,
          courseId: courseId
        },
        update: {}
      });

      // Create notification for instructor
      const student = await tx.user.findUnique({
        where: { id: session.id },
        select: { name: true }
      });
      const studentName = student?.name || "A student";

      await tx.notification.create({
        data: {
          title: "New Student Enrollment",
          message: `${studentName} enrolled in ${course.title}.`,
          isRead: false,
          userId: course.instructorId,
        }
      });

      // Record transaction
      const transaction = await tx.transaction.create({
        data: {
          razorpayOrderId: `wallet_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          razorpayPaymentId: `wal_pay_${Date.now()}`,
          userId: session.id,
          courseId: courseId,
          instructorId: course.instructorId,
          amount: price,
          adminShare,
          instShare,
          status: "SUCCESS"
        }
      });

      return transaction;
    });

    return NextResponse.json({ success: true, transaction: result });
  } catch (error: any) {
    console.error("Wallet purchase error:", error);
    return NextResponse.json({ error: error.message || "Failed to process wallet purchase" }, { status: 500 });
  }
}
