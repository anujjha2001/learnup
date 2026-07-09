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
    redirect("/auth/dashboard/instructor");
  } else {
    redirect("/auth/dashboard/student");
  }
}
