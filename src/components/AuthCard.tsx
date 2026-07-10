"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { RegisterValidationSchema, LoginValidationSchema } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { useProfileStore } from "@/store/profileStore";

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
  const router = useRouter();
  const [role, setRole] = useState<"student" | "instructor">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authForm, setAuthForm] = useState({ 
    email: "", 
    password: "", 
    name: "", 
    phone: "",
    collegeName: "",
    courseName: "",
    cvUrl: "",
    degreeUrl: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSubmitError("");

    try {
      if (authMode === "register") {
        // Validation check
        const parseResult = RegisterValidationSchema.safeParse(authForm);
        if (!parseResult.success) {
          const fieldErrors: Record<string, string> = {};
          parseResult.error.issues.forEach((err: any) => {
            if (err.path[0]) {
              fieldErrors[err.path[0].toString()] = err.message;
            }
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        const res = await authClient.register({
          name: authForm.name,
          email: authForm.email,
          phone: authForm.phone,
          password: authForm.password,
          role: role === "student" ? "STUDENT" : "INSTRUCTOR",
          collegeName: role === "instructor" ? authForm.collegeName : undefined,
          courseName: role === "instructor" ? authForm.courseName : undefined,
          cvUrl: role === "instructor" ? authForm.cvUrl : undefined,
          degreeUrl: role === "instructor" ? authForm.degreeUrl : undefined,
        });

        if (!res.success) {
          throw res.error || "Registration failed.";
        }

        // Redirect to OTP verification screen
        router.push(`/auth/verify-otp?email=${encodeURIComponent(authForm.email)}&role=${role}`);
        return;
      } else {
        // Login validation check
        const parseResult = LoginValidationSchema.safeParse({
          email: authForm.email,
          password: authForm.password,
        });
        if (!parseResult.success) {
          const fieldErrors: Record<string, string> = {};
          parseResult.error.issues.forEach((err: any) => {
            if (err.path[0]) {
              fieldErrors[err.path[0].toString()] = err.message;
            }
          });
          setErrors(fieldErrors);
          setLoading(false);
          return;
        }

        const res = await authClient.login({
          email: authForm.email,
          password: authForm.password,
        });

        if (!res.success) {
          // If unverified, redirect to OTP verification screen
          if (res.status === 403) {
            router.push(`/auth/verify-otp?email=${encodeURIComponent(authForm.email)}&role=${role}`);
            return;
          }
          throw res.error || "Invalid credentials.";
        }

        const userData = res.data?.user;
        if (!userData) {
          throw "No user data returned from login.";
        }

        // Save session user
        const sessionUser = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role.toLowerCase() as "student" | "instructor",
          isVerified: true,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=3525cd&color=fff`,
        };

        localStorage.setItem("learnup_user", JSON.stringify(sessionUser));
        localStorage.setItem("user_email", sessionUser.email);
        localStorage.setItem("user_name", sessionUser.name);
        localStorage.setItem("user_avatar", sessionUser.avatar);
        localStorage.setItem("user_tier", sessionUser.role === "student" ? "Premium Student" : "Senior Instructor");
        const token = res.data?.token;
        if (token) {
          localStorage.setItem("learnup_token", token);
          document.cookie = `learnup_token=${token}; path=/; max-age=86400; SameSite=Lax`;
        }

        // Sync store
        const store = useProfileStore.getState();
        store.updateProfile({
          fullName: sessionUser.name,
          email: sessionUser.email,
          avatar: sessionUser.avatar,
          tier: sessionUser.role === "student" ? "Premium Student" : "Senior Instructor",
        });

        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("profile_update_event"));
        }

        // Silent NextAuth login to create next-auth cookies and session state
        await signIn("credentials", {
          email: authForm.email,
          password: authForm.password,
          redirect: false,
        });

        onAuthSubmit(sessionUser.role);
      }
    } catch (err: any) {
      setSubmitError(err || "Authentication check failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setAuthForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        .primary-glow {
          box-shadow: 0 0 15px -3px rgba(79, 70, 229, 0.4);
          transition: all 0.3s ease;
        }
        .primary-glow:hover {
          box-shadow: 0 0 25px -2px rgba(79, 70, 229, 0.6);
          transform: translateY(-1px);
        }
        .social-btn {
          transition: all 0.2s ease;
        }
        .social-btn:hover {
          transform: scale(1.05);
          border-color: #3525cd;
        }
        .social-btn:active {
          transform: scale(0.95);
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
              className={`group glass-card p-10 rounded-xl flex items-center gap-6 text-left transition-all hover:border-[#3525cd]/50 cursor-pointer ${role === "student" ? "border-2 border-[#3525cd] bg-[#eff4ff]" : ""
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
              className={`group glass-card p-10 rounded-xl flex items-center gap-6 text-left transition-all hover:border-[#3525cd]/50 cursor-pointer ${role === "instructor" ? "border-2 border-[#3525cd] bg-[#eff4ff]" : ""
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
          <div className={`glass-card rounded-xl overflow-hidden shadow-xl border-[#c7c4d8]/10 bg-white ${loading ? "animate-pulse" : ""}`}>
            {/* Tab Switcher */}
            <div className="flex border-b border-[#c7c4d8]/10">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setErrors({});
                  setSubmitError("");
                }}
                className={`flex-1 py-6 text-center font-bold transition-all cursor-pointer ${authMode === "login"
                    ? "border-b-2 border-[#3525cd] text-[#3525cd]"
                    : "text-[#464555] hover:text-[#0b1c30]"
                  }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setErrors({});
                  setSubmitError("");
                }}
                className={`flex-1 py-6 text-center font-bold transition-all cursor-pointer ${authMode === "register"
                    ? "border-b-2 border-[#3525cd] text-[#3525cd]"
                    : "text-[#464555] hover:text-[#0b1c30]"
                  }`}
              >
                Register
              </button>
            </div>

            <div className="p-10 md:p-8">
              {/* Primary Social Auth Options */}
              <div className="space-y-3 mb-8">
                {/* Google */}
                <button
                  type="button"
                  onClick={() => {
                    document.cookie = `selected_role=${role}; path=/; max-age=300; SameSite=Lax`;
                    signIn('google', { callbackUrl: '/dashboard' });
                  }}
                  className="social-btn w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm py-3.5 px-4 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* LinkedIn */}
                <button
                  type="button"
                  onClick={() => {
                    document.cookie = `selected_role=${role}; path=/; max-age=300; SameSite=Lax`;
                    signIn('linkedin', { callbackUrl: '/dashboard' });
                  }}
                  className="social-btn w-full flex items-center justify-center gap-3 bg-[#0077B5] hover:bg-[#006699] text-white font-bold text-sm py-3.5 px-4 rounded-xl border border-transparent shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span>Continue with LinkedIn</span>
                </button>

                {/* GitHub */}
                <button
                  type="button"
                  onClick={() => {
                    document.cookie = `selected_role=${role}; path=/; max-age=300; SameSite=Lax`;
                    signIn('github', { callbackUrl: '/dashboard' });
                  }}
                  className="social-btn w-full flex items-center justify-center gap-3 bg-[#0f141c] hover:bg-[#19222f] text-white font-bold text-sm py-3.5 px-4 rounded-xl border border-transparent shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>Continue with GitHub</span>
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] flex-1 bg-[#c7c4d8]/20"></div>
                <span className="text-[12px] font-bold text-[#777587] uppercase tracking-widest">or continue with email</span>
                <div className="h-[1px] flex-1 bg-[#c7c4d8]/20"></div>
              </div>

              {/* Global Error Banner */}
              {submitError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-pulse">
                  <span className="material-symbols-outlined text-red-600 select-none">error</span>
                  <span>{submitError}</span>
                </div>
              )}

              {/* Auth Credentials Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                {authMode === "register" && (
                  <div className="space-y-2 transition-transform duration-200 focus-within:scale-[1.01] animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="font-bold text-[#0b1c30] text-sm" htmlFor="name">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#464555] group-focus-within:text-[#3525cd]">
                        <span className="material-symbols-outlined text-md select-none">person</span>
                      </div>
                      <input className={`w-full bg-[#eff4ff] border ${errors.name ? "border-red-500 focus:ring-red-200" : "border-[#c7c4d8]/20 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20"} rounded-xl py-4 pl-12 transition-all outline-none text-sm text-[#0b1c30]`} id="name" placeholder="John Doe" required={authMode === "register"} type="text" value={authForm.name} onChange={(e) => handleInputChange("name", e.target.value)} />
                    </div>
                    {errors.name && <p className="text-red-600 text-xs font-semibold mt-1">{errors.name}</p>}
                  </div>
                )}

                <div className="space-y-2 transition-transform duration-200 focus-within:scale-[1.01]">
                  <label className="font-bold text-[#0b1c30] text-sm" htmlFor="email">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#464555] group-focus-within:text-[#3525cd]">
                      <span className="material-symbols-outlined text-md select-none">mail</span>
                    </div>
                    <input className={`w-full bg-[#eff4ff] border ${errors.email ? "border-red-500 focus:ring-red-200" : "border-[#c7c4d8]/20 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20"} rounded-xl py-4 pl-12 transition-all outline-none text-sm text-[#0b1c30]`} id="email" placeholder="name@example.com" required type="email" value={authForm.email} onChange={(e) => handleInputChange("email", e.target.value)} />
                  </div>
                  {errors.email && <p className="text-red-600 text-xs font-semibold mt-1">{errors.email}</p>}
                </div>

                {authMode === "register" && (
                  <div className="space-y-2 transition-transform duration-200 focus-within:scale-[1.01] animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="font-bold text-[#0b1c30] text-sm" htmlFor="phone">Phone Number</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#464555] group-focus-within:text-[#3525cd]">
                        <span className="material-symbols-outlined text-md select-none">call</span>
                      </div>
                      <input className={`w-full bg-[#eff4ff] border ${errors.phone ? "border-red-500 focus:ring-red-200" : "border-[#c7c4d8]/20 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20"} rounded-xl py-4 pl-12 transition-all outline-none text-sm text-[#0b1c30]`} id="phone" placeholder="+91 98765 43210" required={authMode === "register"} type="tel" value={authForm.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
                    </div>
                    {errors.phone && <p className="text-red-600 text-xs font-semibold mt-1">{errors.phone}</p>}
                  </div>
                )}

                {authMode === "register" && role === "instructor" && (
                  <>
                    <div className="space-y-2 transition-transform duration-200 focus-within:scale-[1.01] animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="font-bold text-[#0b1c30] text-sm" htmlFor="collegeName">College / University Name</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#464555] group-focus-within:text-[#3525cd]">
                          <span className="material-symbols-outlined text-md select-none">domain</span>
                        </div>
                        <input className="w-full bg-[#eff4ff] border border-[#c7c4d8]/20 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20 rounded-xl py-4 pl-12 transition-all outline-none text-sm text-[#0b1c30]" id="collegeName" placeholder="e.g. Stanford University" required type="text" value={authForm.collegeName} onChange={(e) => handleInputChange("collegeName", e.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-2 transition-transform duration-200 focus-within:scale-[1.01] animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="font-bold text-[#0b1c30] text-sm" htmlFor="courseName">Proposed Course Name</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#464555] group-focus-within:text-[#3525cd]">
                          <span className="material-symbols-outlined text-md select-none">menu_book</span>
                        </div>
                        <input className="w-full bg-[#eff4ff] border border-[#c7c4d8]/20 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20 rounded-xl py-4 pl-12 transition-all outline-none text-sm text-[#0b1c30]" id="courseName" placeholder="e.g. Advanced Cloud Orchestration" required type="text" value={authForm.courseName} onChange={(e) => handleInputChange("courseName", e.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-2 transition-transform duration-200 focus-within:scale-[1.01] animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="font-bold text-[#0b1c30] text-sm" htmlFor="cvUrl">CV / Resume Document URL</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#464555] group-focus-within:text-[#3525cd]">
                          <span className="material-symbols-outlined text-md select-none">description</span>
                        </div>
                        <input className="w-full bg-[#eff4ff] border border-[#c7c4d8]/20 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20 rounded-xl py-4 pl-12 transition-all outline-none text-sm text-[#0b1c30]" id="cvUrl" placeholder="https://example.com/my-cv.pdf" required type="url" value={authForm.cvUrl} onChange={(e) => handleInputChange("cvUrl", e.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-2 transition-transform duration-200 focus-within:scale-[1.01] animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="font-bold text-[#0b1c30] text-sm" htmlFor="degreeUrl">Highest Degree Certificate URL</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#464555] group-focus-within:text-[#3525cd]">
                          <span className="material-symbols-outlined text-md select-none">history_edu</span>
                        </div>
                        <input className="w-full bg-[#eff4ff] border border-[#c7c4d8]/20 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20 rounded-xl py-4 pl-12 transition-all outline-none text-sm text-[#0b1c30]" id="degreeUrl" placeholder="https://example.com/my-degree.pdf" required type="url" value={authForm.degreeUrl} onChange={(e) => handleInputChange("degreeUrl", e.target.value)} />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2 transition-transform duration-200 focus-within:scale-[1.01]">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-[#0b1c30] text-sm" htmlFor="password">Password</label>
                    {authMode === "login" && (
                      <Link className="text-xs font-bold text-[#3525cd] hover:underline" href="/auth/forgot-password">
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#464555] group-focus-within:text-[#3525cd]">
                      <span className="material-symbols-outlined text-md select-none">lock</span>
                    </div>
                    <input className={`w-full bg-[#eff4ff] border ${errors.password ? "border-red-500 focus:ring-red-200" : "border-[#c7c4d8]/20 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20"} rounded-xl py-4 pl-12 transition-all outline-none text-sm text-[#0b1c30]`} id="password" placeholder="••••••••" required type={showPassword ? "text" : "password"} value={authForm.password} onChange={(e) => handleInputChange("password", e.target.value)} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#464555] hover:text-[#0b1c30] cursor-pointer">
                      <span className="material-symbols-outlined text-md select-none">{showPassword ? "visibility_off" : "visibility"}</span>
                    </button>
                  </div>
                  {errors.password && <p className="text-red-600 text-xs font-semibold mt-1">{errors.password}</p>}
                </div>

                {authMode === "register" && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-start gap-4">
                      <input className="mt-1 rounded text-[#3525cd] focus:ring-[#3525cd]" id="terms" type="checkbox" required />
                      <label className="text-xs text-[#464555]" htmlFor="terms">I agree to the <a className="text-[#3525cd] hover:underline" href="#">Terms of Service</a> and <a className="text-[#3525cd] hover:underline" href="#">Privacy Policy</a>.</label>
                    </div>
                  </div>
                )}

                <button disabled={loading} className="w-full py-4 rounded-xl bg-[#3525cd] text-white font-bold primary-glow flex items-center justify-center gap-4 transition-all disabled:opacity-50 cursor-pointer text-sm animate-in fade-in duration-200" type="submit">
                  <span>{loading ? "Processing..." : authMode === "login" ? "Sign In" : "Create Account"}</span>
                  {!loading && <span className="material-symbols-outlined select-none">arrow_forward</span>}
                </button>
              </form>
            </div>
            <div className="bg-[#eff4ff] p-4 px-10 flex justify-center border-t border-[#c7c4d8]/10">
              <p className="text-xs text-[#464555]">Need help? <a className="font-bold text-[#3525cd] hover:underline" href="#">Contact Support</a></p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}






