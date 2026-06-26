import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const VerifySchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = VerifySchema.safeParse(body);

    if (!result.success) {
      const errorMsg = result.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { email, otp } = result.data;

    // Find the user
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ message: "User is already verified" }, { status: 200 });
    }

    // Verify OTP
    if (!user.otp || user.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }

    if (user.otpExpiry && new Date() > new Date(user.otpExpiry)) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }

    // Update user to verified
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otp: null,
        otpExpiry: null,
      },
    });

    // Create session token placeholder
    const sessionTokenPlaceholder = `jwt-session-token-placeholder-${user.id}-${Date.now()}`;

    return NextResponse.json(
      {
        message: "OTP verification successful. User account activated.",
        userId: user.id,
        isVerified: true,
        token: sessionTokenPlaceholder,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          phone: updatedUser.phone,
          role: updatedUser.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
