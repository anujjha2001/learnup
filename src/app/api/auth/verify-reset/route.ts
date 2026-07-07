import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const VerifyResetSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = VerifyResetSchema.safeParse(body);

    if (!result.success) {
      const errorMsg = result.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { email, otp, newPassword } = result.data;

    // Find the user
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify reset OTP
    if (!user.resetOtp || user.resetOtp !== otp) {
      return NextResponse.json({ error: "Invalid OTP code" }, { status: 401 });
    }

    if (user.resetOtpExpiry && new Date() > new Date(user.resetOtpExpiry)) {
      return NextResponse.json({ error: "OTP code has expired" }, { status: 401 });
    }

    // Update password and clear reset OTP fields
    await db.user.update({
      where: { id: user.id },
      data: {
        password: newPassword,
        resetOtp: null,
        resetOtpExpiry: null,
      },
    });

    return NextResponse.json(
      {
        message: "Password reset verification successful. Password updated.",
        userId: user.id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Verify reset error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
