import React from "react";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Sidebar from "@/components/admin/Sidebar";
import type { Metadata } from "next";
import NotificationBell from "@/components/NotificationBell";

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
    redirect("/unauthorized");
  }

  const user = await db.user.findUnique({
    where: { id: session.id },
    select: { name: true, email: true, avatar: true },
  });

  const adminUser = {
    name: user?.name || "System Admin",
    email: user?.email || "admin@learnup.com",
    avatar: user?.avatar || undefined,
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full lu-page font-sans overflow-hidden">
      <Sidebar user={adminUser} />

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-hidden relative flex flex-col">
        {/* Ambient glow orbs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="lu-blob-purple w-[55%] h-[55%] -top-[20%] -right-[15%]" />
          <div className="lu-blob-teal   w-[50%] h-[50%] -bottom-[20%] -left-[15%]" />
        </div>

        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-[#000]/80 backdrop-blur-md border-b border-white/8 h-16 flex justify-between items-center px-8 shrink-0">
          <div className="flex items-center gap-3">
            <span className="lu-eyebrow text-purple-400">Admin Gateway</span>
            <span className="lu-eyebrow text-white/20">·</span>
            <span className="lu-eyebrow text-white/40">Console</span>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="w-px h-6 bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-extrabold text-white leading-tight">{adminUser.name}</p>
                <p className="lu-eyebrow text-teal-300 mt-0.5">Super Administrator</p>
              </div>
              {adminUser.avatar ? (
                <img
                  src={adminUser.avatar}
                  alt={adminUser.name}
                  className="w-9 h-9 rounded-xl border border-white/10 object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl border border-white/10 bg-[var(--lu-purple-dim)] flex items-center justify-center font-bold text-purple-300 select-none text-sm">
                  {adminUser.name[0].toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 relative">
          <div className="relative z-10 max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
