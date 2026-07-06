"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useProfileStore } from "@/store/profileStore";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const roleParam = searchParams.get("role") || "student";

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    setError("");

    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1]?.focus();
        newOtp[index - 1] = "";
      } else {
        newOtp[index] = "";
      }
      setOtp(newOtp);
      setError("");
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (pasteData.length !== 6 || isNaN(Number(pasteData))) return;

    const newOtp = pasteData.split("");
    setOtp(newOtp);
    setError("");
    inputRefs.current[5]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter a valid 6-digit OTP code.");
      return;
    }

    setLoading(true);
    setError("");

    const res = await authClient.verify(
      { email, otp: otpCode },
      setLoading
    );

    if (!res.success) {
      setError(res.error || "Verification failed. Please try again.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    
    const userRole = (res.data?.user?.role?.toLowerCase() || roleParam.toLowerCase()) as "student" | "instructor";
    const userName = res.data?.user?.name || "User";
    const userAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=8b5cf6&color=fff`;

    const sessionUser = {
      id: res.data?.userId || "usr-unknown",
      name: userName,
      email: email,
      phone: res.data?.user?.phone,
      role: userRole,
      isVerified: true,
      avatar: userAvatar,
    };

    localStorage.setItem("learnup_user", JSON.stringify(sessionUser));
    useProfileStore.getState().updateProfile({
      fullName: userName,
      email: email,
      avatar: userAvatar
    });

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <div className="w-full max-w-[480px] bg-[#0d0c22]/90 backdrop-blur-xl rounded-3xl p-8 md:p-10 text-center relative z-10 border border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.15)] animate-fadeIn">
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center text-[#f97316] mb-4">
          <span className="material-symbols-outlined text-[36px] select-none">
            {success ? "verified" : "mark_email_unread"}
          </span>
        </div>
        <h2 className="text-3xl font-black bg-gradient-to-r from-[#8b5cf6] via-[#f97316] to-[#8b5cf6] bg-clip-text text-transparent tracking-tight">
          {success ? "Success!" : "Verification Required"}
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-[320px] mx-auto leading-relaxed">
          {success 
            ? "Your account has been activated. Redirecting you to the dashboard..." 
            : `Enter the 6-digit OTP code sent to your email (${email}) and registered phone number.`
          }
        </p>
      </div>

      {!success && (
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-between gap-2 max-w-[320px] mx-auto">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onPaste={idx === 0 ? handlePaste : undefined}
                className="w-12 h-14 text-center text-xl font-black rounded-xl border border-white/10 bg-white/5 focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-all outline-none text-white font-mono"
              />
            ))}
          </div>

          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 animate-bounce">
              <span className="material-symbols-outlined text-red-400 text-[18px] select-none">error</span>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#f97316] hover:from-[#712ae2] hover:to-[#ea580c] text-white font-black shadow-lg hover:shadow-orange-500/10 hover:-translate-y-0.5 flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 cursor-pointer text-sm"
            >
              <span>{loading ? "Verifying..." : "Verify & Log In"}</span>
              {!loading && <span className="material-symbols-outlined text-[18px] select-none">verified_user</span>}
            </button>

            <button
              type="button"
              onClick={() => router.push("/auth")}
              className="text-xs font-bold text-purple-400 hover:text-orange-400 transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        </form>
      )}

      {success && (
        <div className="py-6 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-white/5 text-[11px] text-slate-500">
        <p>Didn&apos;t receive the code? You can check your terminal console logs for the mocked system OTP delivery message.</p>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
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
              <linearGradient id="global-header-grad-otp" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#f97316", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#8b5cf6", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <rect width="200" height="200" rx="40" fill="transparent" />
            <path
              d="M60 40 V140 H140"
              stroke="url(#global-header-grad-otp)"
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

      <Suspense fallback={
        <div className="w-full max-w-[480px] bg-[#0d0c22]/90 backdrop-blur-xl rounded-3xl p-10 text-center relative z-10 border border-white/10">
          <p className="text-slate-400 font-medium">Loading verification context...</p>
        </div>
      }>
        <VerifyOtpForm />
      </Suspense>

      <footer className="w-full py-8 text-center border-t border-white/5 bg-[#070710]/40 absolute bottom-0 left-0 right-0">
        <p className="text-xs text-slate-500">© 2026 LearnUp LMS. All rights reserved.</p>
      </footer>
    </div>
  );
}
