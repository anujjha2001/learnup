"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "@/lib/auth";

export async function approveInstructor(userId: string) {
  try {
    // Optional: Add authorization check to make sure the actor is an ADMIN
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: "Unauthorized session" };
    }

    const actor = await db.user.findUnique({ where: { id: session.id } });
    if (!actor || actor.role !== "ADMIN") {
      return { success: false, error: "Insufficient privileges" };
    }

    const targetUser = await db.user.update({
      where: { id: userId },
      data: { status: "APPROVED" },
    });

    // Notify Admin
    await db.notification.create({
      data: {
        title: "Vendor Onboarding Complete",
        message: `Instructor ${targetUser.name} (${targetUser.email}) has been approved and is ready to access their dashboard.`,
        userId: actor.id,
        isRead: false
      }
    });

    // Notify Instructor
    await db.notification.create({
      data: {
        title: "Account Approved",
        message: "Your instructor account registration has been approved. You are ready to deploy courses.",
        userId: targetUser.id,
        isRead: false
      }
    });

    revalidatePath("/admin-gateway");
    return { success: true };
  } catch (error: any) {
    console.error("approveInstructor error:", error);
    return { success: false, error: error.message || "Failed to approve instructor" };
  }
}

export async function rejectInstructor(userId: string) {
  try {
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: "Unauthorized session" };
    }

    const actor = await db.user.findUnique({ where: { id: session.id } });
    if (!actor || actor.role !== "ADMIN") {
      return { success: false, error: "Insufficient privileges" };
    }

    await db.user.update({
      where: { id: userId },
      data: { status: "REJECTED" },
    });

    revalidatePath("/admin-gateway");
    return { success: true };
  } catch (error: any) {
    console.error("rejectInstructor error:", error);
    return { success: false, error: error.message || "Failed to reject instructor" };
  }
}

export async function deleteCourse(courseId: string) {
  try {
    const session = await getServerSession();
    if (!session) {
      return { success: false, error: "Unauthorized session" };
    }

    const actor = await db.user.findUnique({ where: { id: session.id } });
    if (!actor || actor.role !== "ADMIN") {
      return { success: false, error: "Insufficient privileges" };
    }

    await db.course.delete({
      where: { id: courseId },
    });

    revalidatePath("/admin-gateway");
    revalidatePath("/admin-gateway/moderation");
    return { success: true };
  } catch (error: any) {
    console.error("deleteCourse error:", error);
    return { success: false, error: error.message || "Failed to delete course" };
  }
}
