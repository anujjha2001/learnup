"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import StudentDashboard from "@/components/StudentDashboard";

export default function StudentDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-[#070710]">
        <p className="text-white">Loading your dashboard...</p>
      </div>
    );
  }

  if (status === "unauthenticated" || !session?.user) {
    router.push("/auth");
    return null;
  }

  return (
    <StudentDashboard 
      user={session.user}
      onLogout={async () => {
        await signOut({ redirect: false });
        localStorage.removeItem("learnup_user");
        localStorage.removeItem("learnup_token");
        document.cookie = "learnup_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/auth");
      }} 
    />
  );
}