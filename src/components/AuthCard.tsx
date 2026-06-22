"use client";

import React, { useState } from "react";

interface AuthCardProps {
  authMode: "login" | "register";
  setAuthMode: (mode: "login" | "register") => void;
  onAuthSubmit: (role: "student" | "instructor") => void;
}

export default function AuthCard({
  authMode,
  setAuthMode,
  onAuthSubmit,
}: AuthCardProps) {
  const [role, setRole] = useState<"student" | "instructor">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authForm, setAuthForm] = useState({ email: "", password: "", name: "", phone: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock network latency for seamless client transitions
    setTimeout(() => {
      setLoading(false);
      onAuthSubmit(role);
    }, 800);
  };

  const handleInputChange = (field: string, value: string) => {
    setAuthForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .primary-glow {
          box-shadow: 0 0 15px -3px rgba(79, 70, 229, 0.4);
          transition: all 0.3s ease;
        }
        .primary-glow:hover {
          box-shadow: 0 0 25px -2px rgba(79, 70, 229, 0.6);
          transform: translateY(-1px);
        }
      `}} />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
        {/* Role Selection Panel (Col 1-5) */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          <div className="mb-2 px-1">
            <h2 className="text-2xl text-[#0b1c30] font-bold">Select Your Role</h2>
            <p className="text-[#464555] text-sm">Choose how you&apos;ll interact with LearnUp</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Student Role */}
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`group glass-card p-10 rounded-xl flex items-center gap-6 text-left transition-all hover:border-[#3525cd]/50 cursor-pointer ${
                role === "student" ? "border-2 border-[#3525cd] bg-[#eff4ff]" : ""
              }`}
            >
              <div className="w-16 h-16 rounded-xl bg-[#4f46e5]/10 flex items-center justify-center text-[#3525cd] transition-transform group-hover:scale-110 shrink-0">
                <span className="material-symbols-outlined text-[40px] select-none">school</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Student</h3>
                <p className="text-[#464555] text-xs mt-1">I want to learn new skills and advance my career.</p>
              </div>
            </button>

            {/* Instructor Role */}
            <button
              type="button"
              onClick={() => setRole("instructor")}
              className={`group glass-card p-10 rounded-xl flex items-center gap-6 text-left transition-all hover:border-[#3525cd]/50 cursor-pointer ${
                role === "instructor" ? "border-2 border-[#3525cd] bg-[#eff4ff]" : ""
              }`}
            >
              <div className="w-16 h-16 rounded-xl bg-[#8a4cfc]/10 flex items-center justify-center text-[#712ae2] transition-transform group-hover:scale-110 shrink-0">
                <span className="material-symbols-outlined text-[40px] select-none">co_present</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Instructor</h3>
                <p className="text-[#464555] text-xs mt-1">I want to share my knowledge and manage my students.</p>
              </div>
            </button>
          </div>

          {/* Descriptive Visual Card */}
          <div className="mt-4 p-6 glass-card rounded-xl relative overflow-hidden hidden lg:block">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-[#3525cd] mb-2 select-none">verified_user</span>
              <h4 className="font-bold text-[#0b1c30]">Secure &amp; Scalable</h4>
              <p className="text-[13px] text-[#464555] leading-relaxed">
                Enterprise-grade security protecting your data and intellectual property across all learning paths.
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <span className="material-symbols-outlined text-[120px] select-none">shield</span>
            </div>
          </div>
        </section>

        {/* Authentication Panel (Col 6-12) */}
        <section className="lg:col-span-7">
          <div className="glass-card rounded-xl overflow-hidden shadow-xl border-[#c7c4d8]/10 bg-white">
            {/* Tab Switcher */}
            <div className="flex border-b border-[#c7c4d8]/10">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`flex-1 py-6 text-center font-bold transition-all cursor-pointer ${
                  authMode === "login"
                    ? "border-b-2 border-[#3525cd] text-[#3525cd]"
                    : "text-[#464555] hover:text-[#0b1c30]"
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                className={`flex-1 py-6 text-center font-bold transition-all cursor-pointer ${
                  authMode === "register"
                    ? "border-b-2 border-[#3525cd] text-[#3525cd]"
                    : "text-[#464555] hover:text-[#0b1c30]"
                }`}
              >
                Register
              </button>
            </div>

            <div className="p-10 md:p-8">
              {/* Social Auth */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-4 py-4 px-6 rounded-xl border border-[#c7c4d8]/20 bg-[#f8f9ff] text-[#0b1c30] font-bold hover:bg-[#eff4ff] transition-all active:scale-[0.98] mb-6 group cursor-pointer"
              >
                <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  ></path>
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] flex-1 bg-[#c7c4d8]/20"></div>
                <span className="text-[12px] font-bold text-[#777587] uppercase tracking-widest">
                  or continue with email
                </span>
                <div className="h-[1px] flex-1 bg-[#c7c4d8]/20"></div>
              </div>

              {/* Auth Credentials Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Register Specific Fields: Full Name */}
                {authMode === "register" && (
                  <div className="space-y-2 transition-transform duration-200 focus-within:scale-[1.01] animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="font-bold text-[#0b1c30] text-sm" htmlFor="name">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#464555] group-focus-within:text-[#3525cd]">
                        <span className="material-symbols-outlined text-md select-none">person</span>
                      </div>
                      <input
                        className="w-full bg-[#eff4ff] border border-[#c7c4d8]/20 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20 rounded-xl py-4 pl-12 transition-all outline-none text-sm"
                        id="name"
                        placeholder="John Doe"
                        required={authMode === "register"}
                        type="text"
                        value={authForm.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2 transition-transform duration-200 focus-within:scale-[1.01]">
                  <label className="font-bold text-[#0b1c30] text-sm" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#464555] group-focus-within:text-[#3525cd]">
                      <span className="material-symbols-outlined text-md select-none">mail</span>
                    </div>
                    <input
                      className="w-full bg-[#eff4ff] border border-[#c7c4d8]/20 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20 rounded-xl py-4 pl-12 transition-all outline-none text-sm"
                      id="email"
                      placeholder="name@example.com"
                      required
                      type="email"
                      value={authForm.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                </div>

                {/* Register Specific Fields: Phone Number */}
                {authMode === "register" && (
                  <div className="space-y-2 transition-transform duration-200 focus-within:scale-[1.01] animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="font-bold text-[#0b1c30] text-sm" htmlFor="phone">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#464555] group-focus-within:text-[#3525cd]">
                        <span className="material-symbols-outlined text-md select-none">call</span>
                      </div>
                      <input
                        className="w-full bg-[#eff4ff] border border-[#c7c4d8]/20 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20 rounded-xl py-4 pl-12 transition-all outline-none text-sm"
                        id="phone"
                        placeholder="+91 98765 43210"
                        required={authMode === "register"}
                        type="tel"
                        value={authForm.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2 transition-transform duration-200 focus-within:scale-[1.01]">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-[#0b1c30] text-sm" htmlFor="password">
                      Password
                    </label>
                    {authMode === "login" && (
                      <a className="text-xs font-bold text-[#3525cd] hover:underline" href="#">
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#464555] group-focus-within:text-[#3525cd]">
                      <span className="material-symbols-outlined text-md select-none">lock</span>
                    </div>
                    <input
                      className="w-full bg-[#eff4ff] border border-[#c7c4d8]/20 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20 rounded-xl py-4 pl-12 transition-all outline-none text-sm"
                      id="password"
                      placeholder="••••••••"
                      required
                      type={showPassword ? "text" : "password"}
                      value={authForm.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
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

                {/* Register Terms Checkbox */}
                {authMode === "register" && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-start gap-4">
                      <input
                        className="mt-1 rounded text-[#3525cd] focus:ring-[#3525cd]"
                        id="terms"
                        type="checkbox"
                        required
                      />
                      <label className="text-xs text-[#464555]" htmlFor="terms">
                        I agree to the{" "}
                        <a className="text-[#3525cd] hover:underline" href="#">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a className="text-[#3525cd] hover:underline" href="#">
                          Privacy Policy
                        </a>
                        .
                      </label>
                    </div>
                  </div>
                )}

                <button
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-[#3525cd] text-white font-bold primary-glow flex items-center justify-center gap-4 transition-all disabled:opacity-50 cursor-pointer text-sm"
                  type="submit"
                >
                  <span>
                    {loading
                      ? "Processing..."
                      : authMode === "login"
                      ? "Sign In"
                      : "Create Account"}
                  </span>
                  {!loading && <span className="material-symbols-outlined select-none">arrow_forward</span>}
                </button>
              </form>
            </div>

            {/* Footer Help */}
            <div className="bg-[#eff4ff] p-4 px-10 flex justify-center border-t border-[#c7c4d8]/10">
              <p className="text-xs text-[#464555]">
                Need help?{" "}
                <a className="font-bold text-[#3525cd] hover:underline" href="#">
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
