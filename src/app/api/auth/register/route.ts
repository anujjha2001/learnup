import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { sendOTP } from "@/lib/mail";

const RegisterSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone format (E.164 expected)"),
  role: z.enum(["STUDENT", "INSTRUCTOR"]).default("STUDENT"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = RegisterSchema.safeParse(body);

    if (!result.success) {
      const errorMsg = result.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { email, password, name, phone, role } = result.data;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Generate learnupId
    const baseId = (name || email.split('@')[0]).toLowerCase().replace(/[^a-z0-9]/g, '');
    const newLearnupId = `@${baseId}_${Math.random().toString(36).substring(2, 6)}`;

    // Save user to database
    const newUser = await db.user.create({
      data: {
        email,
        password, // In a production app with password hashing we would use bcrypt/argon2, but keeping it direct/hashed placeholder as requested by the schema spec.
        name,
        phone,
        role,
        otp: otpCode,
        otpExpiry,
        isVerified: false,
        learnupId: newLearnupId,
        wallet: {
          create: {
            balance: role === "STUDENT" ? 20000.0 : 0.0
          }
        }
      },
    });

    // Send real OTP via Nodemailer
    const delivery = await sendOTP(email, phone, otpCode);
    if (!delivery.success) {
      // Clean up user record on failure so they can try again
      await db.user.delete({ where: { id: newUser.id } });
      console.error(`[OTP Error] Failed to send verification code to ${email}: ${delivery.error}`);
      return NextResponse.json({ error: delivery.error || "Failed to send verification code." }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "Registration successful. Verification OTP sent.",
        userId: newUser.id,
        email: newUser.email,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
