import React from "react";
import { db } from "@/lib/db";
import { ShieldAlert } from "lucide-react";
import CourseModerationTable from "./CourseModerationTable";

export const dynamic = "force-dynamic";

export default async function ContentModerationPage() {
  const courses = await db.course.findMany({
    include: {
      instructor: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Map courses to plain objects
  const plainCourses = courses.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    price: c.price,
    instructorName: c.instructor?.name || "Unknown Instructor",
    instructorEmail: c.instructor?.email || "N/A",
    enrollmentCount: c._count.enrollments,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-white/10 pb-6 space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-3 mb-2 text-red-400">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest font-black">Content Compliance</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            Content Moderation
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Review and securely delete courses violating platform policies.
          </p>
        </div>
      </header>

      {/* Moderation Actions Table */}
      <CourseModerationTable initialCourses={plainCourses} />
    </div>
  );
}
