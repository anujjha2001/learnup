"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to log in.");
      }

      // Save token locally and in cookie
      localStorage.setItem("learnup_token", data.token);
      localStorage.setItem("learnup_user", JSON.stringify(data.user));
      document.cookie = `learnup_token=${data.token}; path=/; max-age=86400; SameSite=Lax`;

      // Redirect immediately to admin-gateway
      router.push("/admin-gateway");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#070710] text-white min-h-screen flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[130px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px]" />
      </div>

      <div className="max-w-md w-full bg-[#0d0d21]/80 border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative z-10 space-y-8 backdrop-blur-md">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="h-12 w-12 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg text-lg tracking-wider">
            LU
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-white">Admin Control Gate</h1>
            <p className="text-xs text-slate-400">
              Provide administrator credentials to gain secure panel access.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl p-3.5 flex items-center gap-3">
            <span className="material-symbols-outlined text-lg select-none">error</span>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Admin Email Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg select-none">
                mail
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@learnup.com"
                className="w-full bg-[#13132c] border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Admin Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg select-none">
                lock
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#13132c] border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 active:brightness-95 transition-all duration-200 font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-950/30 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                Verifying Credentials...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">security</span>
                Authenticate Access
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
