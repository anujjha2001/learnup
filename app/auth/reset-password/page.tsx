"use client";

import React, { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { PasswordSchema } from "@/lib/auth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    setError("");

    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
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

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (pasteData.length !== 6 || isNaN(Number(pasteData))) return;

    const newOtp = pasteData.split("");
    setOtp(newOtp);
    setError("");
    inputRefs.current[5]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the 6-digit OTP code.");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    // Validate new password rules using validation schema
    const validationResult = PasswordSchema.safeParse(newPassword);
    if (!validationResult.success) {
      setError(validationResult.error.issues[0].message);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const res = await authClient.verifyReset({
      email,
      otp: otpCode,
      newPassword,
    }, setLoading);

    if (!res.success) {
      setError(res.error || "Failed to reset password. Please check the OTP.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/auth");
    }, 2000);
  };

  return (
    <div className="w-full max-w-[480px] glass-card rounded-2xl overflow-hidden shadow-2xl border border-[#c7c4d8]/20 bg-white/95 p-8 md:p-10 text-center relative z-10 animate-fadeIn">
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#3525cd] mb-4">
          <span className="material-symbols-outlined text-[36px] select-none">
            {success ? "task_alt" : "shield_lock"}
          </span>
        </div>
        <h2 className="text-3xl font-black bg-gradient-to-r from-[#3525cd] to-[#712ae2] bg-clip-text text-transparent tracking-tight">
          {success ? "Password Reset!" : "Create New Password"}
        </h2>
        <p className="text-slate-500 text-sm mt-2 max-w-[320px] mx-auto leading-relaxed">
          {success
            ? "Your password has been successfully reset. Redirecting you to sign in..."
            : `Enter the 6-digit verification code sent to ${email} along with your new password.`
          }
        </p>
      </div>

      {!success && (
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          {/* OTP Digit Container */}
          <div className="space-y-2 text-center">
            <label className="font-bold text-[#0b1c30] text-xs block text-left">Verification Code (OTP)</label>
            <div className="flex justify-between gap-2 max-w-[320px] mx-auto">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target, idx)}
                  onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                  onPaste={idx === 0 ? handleOtpPaste : undefined}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-[#c7c4d8]/40 bg-[#eff4ff] focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20 transition-all outline-none text-[#0b1c30]"
                />
              ))}
            </div>
          </div>

          {/* New Password input */}
          <div className="space-y-2">
            <label className="font-bold text-[#0b1c30] text-sm" htmlFor="newPassword">New Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#464555] group-focus-within:text-[#3525cd]">
                <span className="material-symbols-outlined text-md select-none">lock</span>
              </div>
              <input
                className="w-full bg-[#eff4ff] border border-[#c7c4d8]/20 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20 rounded-xl py-4 pl-12 pr-12 transition-all outline-none text-sm text-[#0b1c30]"
                id="newPassword"
                placeholder="••••••••"
                required
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#464555] hover:text-[#0b1c30] cursor-pointer"
              >
                <span className="material-symbols-outlined text-md select-none">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Confirm Password input */}
          <div className="space-y-2">
            <label className="font-bold text-[#0b1c30] text-sm" htmlFor="confirmPassword">Confirm New Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#464555] group-focus-within:text-[#3525cd]">
                <span className="material-symbols-outlined text-md select-none">lock</span>
              </div>
              <input
                className="w-full bg-[#eff4ff] border border-[#c7c4d8]/20 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20 rounded-xl py-4 pl-12 pr-12 transition-all outline-none text-sm text-[#0b1c30]"
                id="confirmPassword"
                placeholder="••••••••"
                required
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600 text-[18px] select-none">error</span>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3 text-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#3525cd] text-white font-bold shadow-lg hover:shadow-xl hover:bg-[#2b1db0] flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer text-sm"
            >
              <span>{loading ? "Resetting Password..." : "Reset Password"}</span>
              {!loading && <span className="material-symbols-outlined text-[18px] select-none">vpn_key</span>}
            </button>

            <Link
              href="/auth"
              className="inline-block text-xs font-bold text-[#3525cd] hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      )}

      {success && (
        <div className="py-6 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#3525cd] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-[#c7c4d8]/10 text-[11px] text-slate-400">
        <p>Didn&apos;t receive the code? You can check your terminal console logs for the mocked reset OTP message.</p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-[#f8f9ff] min-h-screen flex flex-col items-center justify-center p-4 relative overflow-x-hidden antialiased">
      {/* Dynamic injection of Material Symbols */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* Subtle Atmospheric Background Patterns */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-[#3525cd]/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-[#712ae2]/10 rounded-full blur-[120px]"></div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(#3525cd 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        ></div>
      </div>

      {/* Top Navigation Brand Block */}
      <div className="w-full max-w-[1280px] mx-auto px-6 md:px-8 pt-6 flex justify-start items-center mb-6 absolute top-0 left-0 right-0">
        <div className="flex items-center gap-3">
          <svg className="h-9 w-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="grad-auth-logo" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#4F46E5", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#7C3AED", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <rect width="200" height="200" rx="40" fill="transparent" />
            <path d="M60 40 V140 H140" stroke="url(#grad-auth-logo)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M110 90 L140 60 L170 90" stroke="#06B6D4" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M140 60 V120" stroke="#06B6D4" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <span className="text-2xl font-black bg-gradient-to-r from-[#3525cd] to-[#712ae2] bg-clip-text text-transparent tracking-tight">
            LearnUp
          </span>
        </div>
      </div>

      <Suspense fallback={
        <div className="w-full max-w-[480px] glass-card rounded-2xl p-10 text-center relative z-10 bg-white/95">
          <p className="text-slate-500 font-medium">Loading reset context...</p>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>

      <footer className="w-full py-8 text-center border-t border-[#c7c4d8]/10 bg-white/40 absolute bottom-0 left-0 right-0">
        <p className="text-xs text-[#464555] opacity-70">© 2026 LearnUp LMS. All rights reserved.</p>
      </footer>
    </div>
  );
}
