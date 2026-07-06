import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const UpdateProfileSchema = z.object({
  userId: z.string().uuid("Invalid User ID"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone format"),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = UpdateProfileSchema.safeParse(body);

    if (!result.success) {
      const errorMsg = result.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { userId, name, email, phone, password } = result.data;

    // Check if email belongs to someone else
    const emailConflict = await db.user.findFirst({
      where: {
        email,
        id: { not: userId }
      }
    });

    if (emailConflict) {
      return NextResponse.json({ error: "Email address is already in use by another account." }, { status: 409 });
    }

    // Update payload
    const updateData: any = {
      name,
      email,
      phone,
    };

    if (password && password.trim() !== "") {
      updateData.password = password;
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      message: "Profile updated successfully.",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
