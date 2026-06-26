import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { sendOTP } from "@/lib/mail";

const ResetPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = ResetPasswordSchema.safeParse(body);

    if (!result.success) {
      const errorMsg = result.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { email } = result.data;

    // Find the user
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate reset OTP
    const resetOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user record
    await db.user.update({
      where: { id: user.id },
      data: {
        resetOtp: resetOtpCode,
        resetOtpExpiry,
      },
    });

    // Send real reset OTP via Nodemailer
    const delivery = await sendOTP(email, user.phone || "", resetOtpCode);
    if (!delivery.success) {
      console.error(`[OTP Error] Failed to send password reset code to ${email}: ${delivery.error}`);
      return NextResponse.json({ error: delivery.error || "Failed to send verification code." }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "Password reset OTP sent successfully.",
        email,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
