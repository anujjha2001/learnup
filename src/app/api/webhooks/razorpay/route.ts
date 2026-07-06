import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

    // Check webhook signature if secret exists
    if (secret) {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        console.warn("Invalid webhook signature received");
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
      }
    } else {
      console.warn("RAZORPAY_WEBHOOK_SECRET is not defined, skipping webhook validation.");
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    
    if (event === "payment.captured" || event === "order.paid") {
      const payment = payload.payload.payment.entity;
      const orderId = payment.order_id;

      const transaction = await db.transaction.findUnique({
        where: { razorpayOrderId: orderId }
      });

      if (transaction && transaction.status !== "SUCCESS") {
        // Run database updates atomically using a Prisma Transaction
        await db.$transaction(async (tx) => {
          const adminShare = parseFloat((transaction.amount * 0.20).toFixed(2));
          const instShare = parseFloat((transaction.amount * 0.80).toFixed(2));

          await tx.transaction.update({
            where: { razorpayOrderId: orderId },
            data: { 
              status: "SUCCESS", 
              razorpayPaymentId: payment.id,
              adminShare,
              instShare
            }
          });

          if (transaction.courseId) {
            // 1. Enroll the student
            await tx.courseEnrollment.upsert({
              where: {
                userId_courseId: {
                  userId: transaction.userId,
                  courseId: transaction.courseId
                }
              },
              create: {
                userId: transaction.userId,
                courseId: transaction.courseId
              },
              update: {}
            });

            // 2. Fetch course to identify instructor
            const course = await tx.course.findUnique({
              where: { id: transaction.courseId },
              select: { instructorId: true }
            });

            if (course?.instructorId) {
              // 3. Credit instructor's wallet balance
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

              // 4. Credit admin's wallet balance
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
            }
          }
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: error.message || "Webhook processing failed" }, { status: 500 });
  }
}
