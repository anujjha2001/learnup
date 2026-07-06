"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const expected = searchParams.get("expected") || "ADMIN";
  const found = searchParams.get("found") || "GUEST";

  const handleLogout = () => {
    // Clear cookie
    document.cookie = "learnup_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("learnup_token");
    localStorage.removeItem("learnup_user");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");
    
    // Redirect to home/login
    router.push("/?auth=login");
  };

  return (
    <div className="bg-[#070710] text-white min-h-screen flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[130px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px]" />
      </div>

      <div className="max-w-md w-full bg-[#0d0d21]/80 border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative z-10 text-center space-y-6 backdrop-blur-md">
        <div className="inline-flex h-16 w-16 bg-red-500/10 border border-red-500/30 rounded-2xl items-center justify-center text-red-500 animate-bounce">
          <span className="material-symbols-outlined text-3xl select-none">gpp_maybe</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-white">Access Denied</h1>
          <p className="text-sm text-slate-400">
            You do not have the required permissions to access this control panel.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs space-y-2 text-left font-mono">
          <div className="flex justify-between">
            <span className="text-slate-500">Required Role:</span>
            <span className="text-emerald-400 font-bold">{expected}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Your Current Role:</span>
            <span className="text-red-400 font-bold">{found}</span>
          </div>
        </div>

        <div className="text-xs text-slate-400 leading-relaxed">
          If you recently changed your account role, please log out and log back in to refresh your secure session token.
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => router.push("/")}
            className="flex-1 px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition font-bold text-xs"
          >
            Go Home
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-purple-600 text-white font-bold hover:brightness-110 transition shadow-lg shadow-red-500/10 text-xs"
          >
            Log Out & Re-verify
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#070710] min-h-screen flex items-center justify-center">
        <div className="text-xs text-purple-400 font-medium animate-pulse">Loading auth details...</div>
      </div>
    }>
      <UnauthorizedContent />
    </Suspense>
  );
}
