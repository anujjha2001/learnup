import React from "react";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Sidebar from "@/components/admin/Sidebar";
import type { Metadata } from "next";
import { cookies } from "next/headers";

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
  let isAdmin = false;
  let adminId = "";

  const session = await getServerSession();
  if (session && session.user.role === "ADMIN") {
    isAdmin = true;
    adminId = session.id;
  } else {
    // Check learnup_token cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("learnup_token")?.value;
    if (token && token.startsWith("jwt-session-token-placeholder-")) {
      const tokenPart = token.replace("jwt-session-token-placeholder-", "");
      const parts = tokenPart.split("-");
      const role = parts[parts.length - 3]?.toUpperCase();
      if (role === "ADMIN") {
        isAdmin = true;
        adminId = parts.slice(0, parts.length - 3).join("-");
      }
    }
  }

  if (!isAdmin) {
    redirect("/admin-gateway/login");
  }

  const user = await db.user.findUnique({
    where: { id: adminId },
    select: { name: true, email: true, avatar: true },
  });

  const adminUser = {
    name: user?.name || "Admin Lead",
    email: user?.email || "admin@learnup.com",
    avatar: user?.avatar || undefined,
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full font-sans lg:overflow-hidden bg-[#070710]">
      <Sidebar user={adminUser} />

      {/* Main Content Area */}
      <main className="flex-1 lg:h-screen lg:overflow-hidden relative flex flex-col bg-[#070710]">
        {/* Ambient glow orbs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-15%] w-[55%] h-[55%] rounded-full bg-[#8b5cf6]/10 blur-[130px]" />
          <div className="absolute bottom-[-20%] left-[-15%] w-[50%] h-[50%] rounded-full bg-[#f97316]/10 blur-[120px]" />
        </div>

        {/* Top Header Bar with Profile & Notification Bell */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 md:px-8 relative z-20 bg-[#070710]/40 backdrop-blur-md">
          <div></div>
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative shrink-0">
              <button className="p-2 rounded-xl bg-[#0A0A0A] border border-[#2A2A2A] text-slate-400 hover:text-white transition relative cursor-pointer flex items-center justify-center">
                <span className="material-symbols-outlined text-lg select-none">notifications</span>
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#f97316] text-[9px] font-black text-white">2</span>
              </button>
            </div>
            
            <div className="w-px h-6 bg-white/10" />

            {/* Admin Profile Section */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-100 leading-tight">{adminUser.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Admin Lead</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#8b5cf6]/20 border border-[#8b5cf6]/30 flex items-center justify-center font-bold text-purple-300 overflow-hidden shrink-0">
                {adminUser.avatar ? (
                  <img src={adminUser.avatar} alt={adminUser.name} className="w-full h-full object-cover" />
                ) : (
                  "A"
                )}
              </div>
            </div>
          </div>
        </header>

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
