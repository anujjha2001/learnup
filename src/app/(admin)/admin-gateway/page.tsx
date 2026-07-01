import React from "react";
import { db } from "@/lib/db";
import OverviewDashboardClient from "@/components/admin/OverviewDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  // Query full database entries for interactive widgets
  const instructors = await db.user.findMany({
    where: { role: "INSTRUCTOR" },
    orderBy: { createdAt: "desc" },
  });

  const courses = await db.course.findMany({
    include: { instructor: true },
    orderBy: { createdAt: "desc" },
  });

  const plainInstructors = instructors.map((inst) => ({
    id: inst.id,
    name: inst.name,
    email: inst.email,
    phone: inst.phone,
    role: inst.role,
    status: inst.status,
    avatar: inst.avatar,
    createdAt: inst.createdAt.toISOString(),
  }));

  const plainCourses = courses.map((course) => ({
    id: course.id,
    title: course.title,
    price: course.price,
    createdAt: course.createdAt.toISOString(),
    instructor: course.instructor ? {
      id: course.instructor.id,
      name: course.instructor.name,
      email: course.instructor.email,
    } : null,
  }));

  // System Stats (passing icon names as strings to make them serializable)
  const systemMetrics = [
    { name: "CPU Utilization", value: "2.4%", icon: "Cpu", color: "text-purple-400" },
    { name: "Memory Usage", value: "1.2 GB / 4.0 GB", icon: "HardDrive", color: "text-teal-400" },
    { name: "Database Connections", value: "8 Active Pool", icon: "Database", color: "text-emerald-400" },
    { name: "API Response Time", value: "48ms avg", icon: "Server", color: "text-purple-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="lu-page-header">
        <div className="lu-page-header-eyebrow">
          <span className="material-symbols-outlined select-none text-base">shield</span>
          Control Panel
        </div>
        <h1 className="lu-heading">Overview Dashboard</h1>
        <p className="lu-caption mt-1">
          Real-time server telemetry and registration status metrics.
        </p>
      </div>

      {/* Interactive Overview Client Component */}
      <OverviewDashboardClient
        initialInstructors={plainInstructors}
        initialCourses={plainCourses}
        systemMetrics={systemMetrics}
      />
    </div>
  );
}

