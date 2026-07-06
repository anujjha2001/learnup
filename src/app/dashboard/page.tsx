import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import StudentDashboard from "@/components/StudentDashboard";
import InstructorDashboard from "@/components/InstructorDashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/?auth=true");
  }

  const role = (session.user as any).role?.toUpperCase() || "STUDENT";

  if (role === "INSTRUCTOR") {
    return <InstructorDashboard user={session.user} />;
  }

  // Render the original StudentDashboard component natively with real session data.
  return <StudentDashboard user={session.user} />;
}
