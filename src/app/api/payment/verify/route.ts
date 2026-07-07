import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Helper to log payment failures to file
function logPaymentFailure(details: any) {
  try {
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    const logFilePath = path.join(logsDir, 'payment_failures.log');
    const logEntry = `[${new Date().toISOString()}] ${JSON.stringify(details)}\n`;
    fs.appendFileSync(logFilePath, logEntry);
  } catch (err) {
    console.error("Failed to write to payment_failures.log:", err);
  }
}

export async function POST(req: Request) {
  let requestBody: any = {};
  try {
    requestBody = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = requestBody;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Sandbox / fallback mode if keys aren't configured
    if (!keySecret) {
      console.warn("RAZORPAY_KEY_SECRET is missing. Automatically verifying transaction for sandbox mode.");
      
      const transaction = await db.transaction.findUnique({
        where: { razorpayOrderId: razorpay_order_id }
      });

      if (!transaction) {
        logPaymentFailure({ reason: "Transaction not found in sandbox mode", request: requestBody });
        return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
      }

      const finalPaymentId = razorpay_payment_id || `pay_mock_${Date.now()}`;

      // Run database updates atomically using a Prisma Transaction
      const result = await db.$transaction(async (tx) => {
        const initialTx = await tx.transaction.findUnique({
          where: { razorpayOrderId: razorpay_order_id }
        });
        if (!initialTx) throw new Error("Transaction not found");

        const adminShare = parseFloat((initialTx.amount * 0.20).toFixed(2));
        const instShare = parseFloat((initialTx.amount * 0.80).toFixed(2));

        const updatedTx = await tx.transaction.update({
          where: { razorpayOrderId: razorpay_order_id },
          data: { 
            status: "SUCCESS", 
            razorpayPaymentId: finalPaymentId,
            adminShare,
            instShare
          }
        });

        if (updatedTx.courseId) {
          // 1. Enroll the student
          await tx.courseEnrollment.upsert({
            where: {
              userId_courseId: {
                userId: updatedTx.userId,
                courseId: updatedTx.courseId
              }
            },
            create: {
              userId: updatedTx.userId,
              courseId: updatedTx.courseId,
            },
            update: {}
          });

          // 2. Fetch course to identify instructor
          const course = await tx.course.findUnique({
            where: { id: updatedTx.courseId },
            select: { instructorId: true, title: true }
          });

          const student = await tx.user.findUnique({
            where: { id: updatedTx.userId },
            select: { name: true }
          });
          const studentName = student?.name || "A student";

          await tx.notification.create({
            data: {
              title: "New Student Enrollment",
              message: `${studentName} enrolled in ${course?.title || 'a course'}.`,
              isRead: false,
              userId: course?.instructorId || "inst-1",
            }
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
        } else {
          // Wallet Top-up flow: Credit student's wallet balance directly
          await tx.wallet.upsert({
            where: { userId: updatedTx.userId },
            create: {
              userId: updatedTx.userId,
              balance: updatedTx.amount
            },
            update: {
              balance: {
                increment: updatedTx.amount
              }
            }
          });
        }
        return updatedTx;
      });

      // Email notification skipped as requested (In-app only)

      return NextResponse.json({ success: true, message: "Sandbox bypass verification success" });
    }

    const generated_signature = crypto
      .createHmac('sha256', keySecret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      logPaymentFailure({ reason: "Signature mismatch", request: requestBody, generated_signature });
      await db.transaction.update({
        where: { razorpayOrderId: razorpay_order_id },
        data: { status: "FAILED", razorpayPaymentId: razorpay_payment_id }
      });
      return NextResponse.json({ error: "Invalid signature verification" }, { status: 400 });
    }

    // Run database updates atomically using a Prisma Transaction
    const result = await db.$transaction(async (tx) => {
      const initialTx = await tx.transaction.findUnique({
        where: { razorpayOrderId: razorpay_order_id }
      });
      if (!initialTx) throw new Error("Transaction not found");

      const adminShare = parseFloat((initialTx.amount * 0.20).toFixed(2));
      const instShare = parseFloat((initialTx.amount * 0.80).toFixed(2));

      const transaction = await tx.transaction.update({
        where: { razorpayOrderId: razorpay_order_id },
        data: { 
          status: "SUCCESS", 
          razorpayPaymentId: razorpay_payment_id,
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
            courseId: transaction.courseId,
          },
          update: {}
        });

        // 2. Fetch course to identify instructor
        const course = await tx.course.findUnique({
          where: { id: transaction.courseId },
          select: { instructorId: true, title: true }
        });

        const student = await tx.user.findUnique({
          where: { id: transaction.userId },
          select: { name: true }
        });
        const studentName = student?.name || "A student";

        await tx.notification.create({
          data: {
            title: "New Student Enrollment",
            message: `${studentName} enrolled in ${course?.title || 'a course'}.`,
            isRead: false,
            userId: course?.instructorId || "inst-1",
          }
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
      } else {
        // Wallet Top-up flow: Credit student's wallet balance directly
        await tx.wallet.upsert({
          where: { userId: transaction.userId },
          create: {
            userId: transaction.userId,
            balance: transaction.amount
          },
          update: {
            balance: {
              increment: transaction.amount
            }
          }
        });
      }
      return transaction;
    });

    // Email notification skipped as requested (In-app only)

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Verification failed:", error);
    logPaymentFailure({ reason: "Server error during verification", error: error.message, request: requestBody });
    return NextResponse.json({ error: error.message || "Verification failed" }, { status: 500 });
  }
}

async function sendReceiptEmail(email: string, name: string, courseTitle: string, amount: number) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });

  const mailOptions = {
    from: `"LearnUp LMS" <${process.env.SMTP_USER || 'noreply@learnup.com'}>`,
    to: email,
    subject: `[LearnUp Receipt] Successfully Enrolled in ${courseTitle}`,
    html: `
      <div style="font-family: sans-serif; padding: 25px; max-width: 600px; margin: 0 auto; background-color: #f8f9ff; border-radius: 16px; border: 1px solid #e2dfff;">
        <h2 style="color: #3525cd; margin-bottom: 20px;">Payment Confirmed</h2>
        <p style="color: #0b1c30; font-size: 15px;">Hello <strong>${name}</strong>,</p>
        <p style="color: #0b1c30; font-size: 15px;">Your payment has been successfully processed. You are now enrolled in the course: <strong>${courseTitle}</strong>.</p>
        <div style="background-color: white; border: 1px solid #c7c4d8/30; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <table style="width: 100%; font-size: 14px;">
            <tr>
              <td style="color: #464555; padding-bottom: 8px;">Course Name:</td>
              <td style="font-weight: bold; text-align: right; padding-bottom: 8px;">${courseTitle}</td>
            </tr>
            <tr>
              <td style="color: #464555;">Amount Paid:</td>
              <td style="font-weight: bold; color: #3525cd; text-align: right;">₹${amount.toFixed(2)}</td>
            </tr>
          </table>
        </div>
        <p style="font-size: 13px; color: #464555; margin-top: 25px;">Happy learning!<br>The LearnUp LMS Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log(`[Email Success] Receipt sent to ${email}`);
  } catch (error) {
    console.error(`[Email Failed] Failed sending receipt email to ${email}:`, error);
  }
}
