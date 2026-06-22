"use client";

import React from "react";
import { useRouter } from "next/navigation";
import StudentDashboard from "@/components/StudentDashboard";

export default function StudentDashboardPage() {
  const router = useRouter();

  return (
    <StudentDashboard 
      onLogout={() => router.push("/auth")} 
    />
  );
}