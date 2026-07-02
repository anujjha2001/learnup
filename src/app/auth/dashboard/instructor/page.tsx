"use client";

import React from "react";
import { useRouter } from "next/navigation";
import InstructorDashboard from "@/components/InstructorDashboard";

export default function InstructorDashboardPage() {
  const router = useRouter();

  return (
    <InstructorDashboard 
      onLogout={() => router.push("/auth")} 
    />
  );
}