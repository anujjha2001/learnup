import React from "react";
import { db } from "@/lib/db";
import InstructorTable from "../../../../../components/admin/InstructorTable";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ManageInstructorsPage() {
  const instructors = await db.user.findMany({
    where: { role: "INSTRUCTOR" },
    orderBy: { createdAt: "desc" },
  });

  const plainInstructors = instructors.map((inst) => ({
    id: inst.id,
    name: inst.name,
    email: inst.email,
    phone: inst.phone,
    role: inst.role,
    status: inst.status as "PENDING" | "APPROVED" | "REJECTED",
    avatar: inst.avatar,
    createdAt: inst.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="lu-page-header">
        <div className="lu-page-header-eyebrow">
          <Users className="w-4 h-4" />
          Moderation Gateway
        </div>
        <h1 className="lu-heading">Manage Instructors</h1>
        <p className="lu-caption mt-1">
          Review, approve or reject instructor onboarding requests.
        </p>
      </div>

      <InstructorTable initialInstructors={plainInstructors} />
    </div>
  );
}
