import React from "react";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Sidebar from "@/components/admin/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Gateway | LearnUp",
  description: "Administrative console for LearnUp LMS.",
};

export const dynamic = "force-dynamic";

export default async function AdminGatewayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin-gateway/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.id },
    select: { name: true, email: true, avatar: true },
  });

  const adminUser = {
    name: user?.name || "Admin Lead",
    email: user?.email || "admin@learnup.com",
    avatar: user?.avatar || undefined,
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full font-sans overflow-hidden bg-[#070710]">
      <Sidebar user={adminUser} />

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-hidden relative flex flex-col bg-[#090816]">
        {/* Ambient glow orbs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-15%] w-[55%] h-[55%] rounded-full bg-purple-600/10 blur-[130px]" />
          <div className="absolute bottom-[-20%] left-[-15%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px]" />
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 relative z-10">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
