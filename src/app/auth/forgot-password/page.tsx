"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");

    const res = await authClient.resetPassword({ email }, setLoading);

    if (!res.success) {
      setError(res.error || "User not found or an error occurred.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    }, 1500);
  };

  return (
    <div className="bg-[#070710] min-h-screen flex flex-col items-center justify-center p-4 relative overflow-x-hidden antialiased text-slate-100">
      {/* Dynamic injection of Material Symbols */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* Subtle Atmospheric Background Patterns */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-[#8b5cf6]/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-[#f97316]/5 rounded-full blur-[120px]"></div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02]"
          style={{ backgroundImage: "radial-gradient(#8b5cf6 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        ></div>
      </div>

      {/* Top Navigation Brand Block */}
      <div className="w-full max-w-[1280px] mx-auto px-6 md:px-8 pt-6 flex justify-start items-center mb-6 absolute top-0 left-0 right-0">
        <div className="flex items-center gap-3">
          <svg className="h-9 w-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="global-header-grad-forgot" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#f97316", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#8b5cf6", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <rect width="200" height="200" rx="40" fill="transparent" />
            <path
              d="M60 40 V140 H140"
              stroke="url(#global-header-grad-forgot)"
              strokeWidth="24"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M110 90 L140 60 L170 90"
              stroke="#8b5cf6"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M140 60 V120"
              stroke="#8b5cf6"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span className="text-2xl font-black bg-gradient-to-r from-[#8b5cf6] via-[#f97316] to-[#8b5cf6] bg-clip-text text-transparent tracking-tight">
            LearnUp
          </span>
        </div>
      </div>

      <div className="w-full max-w-[480px] bg-[#0d0c22]/90 backdrop-blur-xl rounded-3xl p-8 md:p-10 text-center relative z-10 border border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.15)] animate-fadeIn">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center text-[#f97316] mb-4">
            <span className="material-symbols-outlined text-[36px] select-none">
              lock_reset
            </span>
          </div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-[#8b5cf6] via-[#f97316] to-[#8b5cf6] bg-clip-text text-transparent tracking-tight">
            Forgot Password
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-[320px] mx-auto leading-relaxed">
            {success
              ? "Account recognized. Directing to password reset screen..."
              : "Enter your registered email address below. We'll send you a 6-digit OTP code to reset your password securely."
            }
          </p>
        </div>

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="space-y-2">
              <label className="font-bold text-slate-300 text-xs uppercase tracking-wider" htmlFor="email">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#f97316] transition-colors">
                  <span className="material-symbols-outlined text-md select-none">mail</span>
                </div>
                <input
                  className="w-full bg-white/5 border border-white/10 focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 rounded-xl py-4 pl-12 transition-all outline-none text-sm text-white placeholder-slate-500"
                  id="email"
                  placeholder="name@example.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-red-400 text-[18px] select-none">error</span>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3 text-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#f97316] hover:from-[#712ae2] hover:to-[#ea580c] text-white font-black shadow-lg hover:shadow-orange-500/20 hover:-translate-y-0.5 flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 cursor-pointer text-sm"
              >
                <span>{loading ? "Sending..." : "Send Verification OTP"}</span>
                {!loading && <span className="material-symbols-outlined text-[18px] select-none">send</span>}
              </button>

              <Link
                href="/auth"
                className="inline-block text-xs font-bold text-purple-400 hover:text-orange-400 transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        )}

        {success && (
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <footer className="w-full py-8 text-center border-t border-white/5 bg-[#070710]/40 absolute bottom-0 left-0 right-0">
        <p className="text-xs text-slate-500">© 2026 LearnUp LMS. All rights reserved.</p>
      </footer>
    </div>
  );
}
