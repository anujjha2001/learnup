"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrackProgress from "@/components/TrackProgress";
import AuthCard from "@/components/AuthCard";
import StudentDashboard from "@/components/StudentDashboard";
import InstructorDashboard from "@/components/InstructorDashboard";
import { SakaiLayoutWrapper } from "@/components/layout/SakaiLayoutWrapper";

// Platform tour simulation chapter data
const CHAPTERS_DATA = [
  {
    title: "AI-Driven Learning Dashboards",
    duration: "2:15",
    description: "See how our core machine learning layer dynamically updates your syllabus matrix based on real-time performance and focus areas.",
    tag: "Core Tech",
    icon: "psychology"
  },
  {
    title: "Interactive Cloud Dev Environment",
    duration: "3:40",
    description: "Watch a student spinning up a multi-node Kubernetes container layout natively from our built-in browser terminal sandbox.",
    tag: "Live Demo",
    icon: "terminal"
  },
  {
    title: "1:1 Expert Matching Matrix",
    duration: "1:55",
    description: "How our scheduling algorithms auto-allocate dedicated calendar blocks with silicon-valley engineering leads.",
    tag: "Mentorship",
    icon: "groups"
  }
];

export default function HomePage() {
  // NAVIGATION STATE 
  // Options: 'home' | 'courses' | 'mentors' | 'pricing' | 'community' | 'auth' | 'student_dashboard' | 'instructor_dashboard'
  const [currentScreen, setCurrentScreen] = useState("home");

  // AUTH MODE STATE
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Interactive platform tour chapter state
  const [activeChapter, setActiveChapter] = useState(0);

  const [clientParticles, setClientParticles] = useState<{ id: number; size: number; left: number; top: number; duration: number; targetY: number; targetX: number }[]>([]);

  useEffect(() => {
    const list = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      size: Math.random() * 6 + 3,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 12 + 8,
      targetY: Math.random() * -120 - 40,
      targetX: Math.random() * 50 - 25,
    }));
    setClientParticles(list);
  }, []);

  // Check URL query parameters for auth triggers
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const authParam = params.get("auth");
      if (authParam === "true" || authParam === "login") {
        setCurrentScreen("auth");
        setAuthMode("login");
      } else if (authParam === "register") {
        setCurrentScreen("auth");
        setAuthMode("register");
      }
    }
  }, []);

  // Check for admin redirection on mount
  useEffect(() => {
    async function checkAdminRedirect() {
      try {
        const { getNavbarSession } = await import("@/app/actions/auth");
        const session = await getNavbarSession();
        if (session?.user?.role?.toUpperCase() === "ADMIN") {
          window.location.href = "/admin-gateway";
        }
      } catch (e) {
        console.error("Admin redirect check failed:", e);
      }
    }
    checkAdminRedirect();
  }, []);

  // Dynamic Routing Handler for Auth Submit
  const handleAuthSubmit = async (selectedRole: "student" | "instructor") => {
    try {
      const { getNavbarSession } = await import("@/app/actions/auth");
      const session = await getNavbarSession();
      if (session?.user?.role?.toUpperCase() === "ADMIN") {
        window.location.href = "/admin-gateway";
        return;
      }
    } catch (e) { }

    if (selectedRole === "student") {
      setCurrentScreen("student_dashboard");
    } else {
      setCurrentScreen("instructor_dashboard");
    }
  };

  const handleSocialAuth = async (provider: "google" | "linkedin" | "github", role: "student" | "instructor") => {
    const width = 600;
    const height = 750;
    const left = (window.innerWidth - width) / 2 + window.screenX;
    const top = (window.innerHeight - height) / 2 + window.screenY;

    window.open(
      `/auth/oauth-mock?provider=${provider}&role=${role}`,
      `${provider}_oauth`,
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
    );
  };

  useEffect(() => {
    const handleOAuthMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "oauth_success") {
        const { provider, role, user } = event.data;

        try {
          const res = await fetch("/api/auth/oauth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              provider,
              role,
              email: user.email,
              name: user.name,
            }),
          });

          if (!res.ok) {
            throw new Error("Failed to process OAuth on server");
          }

          const result = await res.json();

          // Save local session
          localStorage.setItem("learnup_user", JSON.stringify(result.user));
          localStorage.setItem("user_email", result.user.email);
          localStorage.setItem("user_name", result.user.name);
          localStorage.setItem("user_avatar", result.user.avatar);
          localStorage.setItem("user_tier", result.user.role === "STUDENT" ? "Premium Student" : "Senior Instructor");
          localStorage.setItem("learnup_token", result.token);
          if (typeof document !== "undefined") {
            document.cookie = `learnup_token=${result.token}; path=/; max-age=86400; SameSite=Lax`;
          }

          // Sync Zustand store
          const { useUserStore } = await import("@/store/useUserStore");
          useUserStore.getState().setUser(result.user);

          // Sync legacy profileStore just in case
          const { useProfileStore } = await import("@/store/profileStore");
          useProfileStore.getState().updateProfile({
            fullName: result.user.name,
            email: result.user.email,
            avatar: result.user.avatar,
            tier: result.user.role === "STUDENT" ? "Premium Student" : "Senior Instructor",
          });

          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("profile_update_event"));
            window.dispatchEvent(new Event("profileUpdated"));
          }

          // Redirect or set state
          if (role === "student") {
            setCurrentScreen("student_dashboard");
          } else {
            setCurrentScreen("instructor_dashboard");
          }
        } catch (error) {
          console.error("OAuth connectivity error:", error);
        }
      }
    };

    window.addEventListener("message", handleOAuthMessage);
    return () => window.removeEventListener("message", handleOAuthMessage);
  }, []);

  return (
    <>
      {/* Premium UI Component Styles injection */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          display: inline-block;
          line-height: 1;
          text-transform: none;
          letter-spacing: normal;
          word-wrap: normal;
          white-space: nowrap;
          direction: ltr;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        .shimmer-progress {
          position: relative;
          overflow: hidden;
        }
        .shimmer-progress::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer {
          100% { left: 200%; }
        }
        .hero-gradient {
          background: radial-gradient(circle at top right, rgba(79, 70, 229, 0.08), transparent 40%),
                      radial-gradient(circle at bottom left, rgba(6, 182, 212, 0.05), transparent 40%);
        }
      `}} />

      <SakaiLayoutWrapper
        showBlobs={true}
        lowOpacityBlobs={["student_dashboard", "instructor_dashboard"].includes(currentScreen)}
      >
        <div className="text-slate-100 font-sans selection:bg-[#6d28d9]/20 min-h-screen antialiased flex flex-col justify-between w-full relative">
          {/* Floating background particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20">
            {clientParticles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full bg-gradient-to-r from-[#6d28d9] to-[#2dd4bf]"
                style={{
                  width: p.size,
                  height: p.size,
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  opacity: 0.15,
                }}
                animate={{
                  y: [0, p.targetY],
                  x: [0, p.targetX],
                  opacity: [0.15, 0.35, 0.15],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* ========================================================= */}
          {/* GLOBAL HEADER (NAVBAR)                                    */}
          {/* ========================================================= */}
          {!["student_dashboard", "instructor_dashboard"].includes(currentScreen) && (
            <Navbar
              currentScreen={currentScreen}
              setCurrentScreen={setCurrentScreen}
              setAuthMode={setAuthMode}
            />
          )}

          {/* ========================================================= */}
          {/* DYNAMIC SCREEN CONTENT INJECTION REGION                   */}
          {/* ========================================================= */}
          <main className="flex-grow">

            {/* SCREEN 1: HOME LANDING PAGE */}
            {currentScreen === "home" && (
              <div className="animate-fadeIn">
                <Hero setCurrentScreen={setCurrentScreen} setAuthMode={setAuthMode} />

                {/* Feature Highlights Grid */}
                <section className="py-12 px-6 md:px-16 max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-sm space-y-4 hover:shadow-md transition text-white">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-300 flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl select-none">psychology</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">AI-Adaptive Curriculum</h3>
                    <p className="text-sm text-slate-300">
                      Smart algorithms configured to auto-serve layout variables aligned with individual pace scales.
                    </p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-sm space-y-4 hover:shadow-md transition text-white">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-300 flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl select-none">groups</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Elite 1:1 Mentorship</h3>
                    <p className="text-sm text-slate-300">
                      Live syncing workspace blocks built with veteran software leaders to debug production codebases.
                    </p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-sm space-y-4 hover:shadow-md transition text-white">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-300 flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl select-none">terminal</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Interactive Sandboxes</h3>
                    <p className="text-sm text-slate-300">
                      Spin up Kubernetes instances and test container setups natively straight inside your dashboard tab.
                    </p>
                  </div>
                </section>

                {/* Progress Tracking Cards Module */}
                <TrackProgress />

                {/* Product Experience Tour */}
                <section id="product-tour" className="py-16 px-6 md:px-16 max-w-[1280px] mx-auto border-t border-white/10">
                  <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white">Experience LearnUp In Action</h2>
                    <p className="text-sm text-slate-300">Interactive platform simulations built to map technical architecture metrics cleanly.</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    <div className="lg:col-span-7 space-y-4">
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-xl">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=80')` }}></div>
                        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]"></div>
                        <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md text-white rounded-xl px-5 py-3 flex items-center gap-3 border border-white/10 shadow-lg">
                          <span className="material-symbols-outlined text-2xl text-cyan-400 animate-pulse select-none">{CHAPTERS_DATA[activeChapter].icon}</span>
                          <div className="text-left">
                            <p className="text-[10px] uppercase font-bold text-slate-400">Streaming Demo</p>
                            <p className="text-xs font-semibold">{CHAPTERS_DATA[activeChapter].tag}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex items-start gap-4">
                        <div className="p-2.5 bg-indigo-500/10 text-indigo-300 rounded-lg"><span className="material-symbols-outlined select-none">{CHAPTERS_DATA[activeChapter].icon}</span></div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{CHAPTERS_DATA[activeChapter].title}</h4>
                          <p className="text-xs text-slate-300 mt-1">{CHAPTERS_DATA[activeChapter].description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-5 space-y-3">
                      {CHAPTERS_DATA.map((chapter, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveChapter(idx)}
                          className={`w-full text-left p-4 rounded-xl transition border flex gap-4 items-center cursor-pointer ${activeChapter === idx
                            ? "bg-white/10 border-teal-500/50 shadow-sm"
                            : "bg-white/5 border-transparent hover:bg-white/10"
                            }`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${activeChapter === idx ? "bg-teal-400 text-slate-950" : "bg-white/10 text-slate-300"}`}>{idx + 1}</div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm truncate text-white">{chapter.title}</p>
                            <p className="text-xs text-slate-300 truncate">{chapter.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* SCREEN 2: COURSES EXPLORER SCREEN */}
            {currentScreen === "courses" && (
              <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-12 space-y-8 animate-fadeIn">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
                  <div>
                    <h1 className="text-3xl font-extrabold text-white">All Certified Tracks</h1>
                    <p className="text-sm text-slate-300 mt-1">Explore curriculum architectures custom tailored for production environments.</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-sm w-full md:w-auto">
                    <span className="material-symbols-outlined text-slate-400 text-lg select-none">search</span>
                    <input type="text" placeholder="Search technology tracks..." className="bg-transparent text-sm text-white focus:outline-none w-full placeholder:text-slate-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { title: "Full-Stack Next.js Enterprise Hub", lectures: "48 Modules", level: "Advanced", levelColor: "text-red-400 bg-red-500/10 border border-red-500/20", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80" },
                    { title: "Machine Learning Operational Scaling", lectures: "36 Modules", level: "Intermediate", levelColor: "text-amber-400 bg-amber-500/10 border border-amber-500/20", img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=400&q=80" },
                    { title: "Cloud Architecture & Kubernetes Grid", lectures: "52 Modules", level: "Expert", levelColor: "text-purple-400 bg-purple-500/10 border border-purple-500/20", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80" }
                  ].map((course, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-sm hover:shadow-md hover:border-teal-500/30 transition flex flex-col justify-between">
                      <div>
                        <img src={course.img} alt={course.title} className="h-44 w-full object-cover" />
                        <div className="p-5 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] font-bold font-mono text-slate-300">{course.lectures}</span>
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${course.levelColor}`}>{course.level}</span>
                          </div>
                          <h3 className="font-bold text-base text-white leading-snug">{course.title}</h3>
                          <p className="text-xs text-slate-300">Master modern workflows, clean structures, testing integration suites, and cloud pipeline staging environments natively.</p>
                        </div>
                      </div>
                      <div className="p-5 pt-0">
                        <button
                          onClick={() => {
                            setAuthMode("register");
                            setCurrentScreen("auth");
                          }}
                          className="w-full bg-white/10 text-white hover:bg-teal-500 hover:text-slate-950 border border-white/10 transition py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          Review Syllabus Architecture <span className="material-symbols-outlined text-sm select-none">chevron_right</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN 3: MENTORS SCREEN */}
            {currentScreen === "mentors" && (
              <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-12 space-y-8 animate-fadeIn">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <h1 className="text-3xl font-extrabold text-white">Silicon Valley Engineering Advisors</h1>
                  <p className="text-sm text-slate-300">Skip generic tutorial blocks. Pair synchronously with professionals deploying core systems daily.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                  {[
                    { name: "Arjun", role: "Principal Cloud Architect", comp: "Ex-Google / Netflix", tags: ["Kubernetes", "Go", "AWS Grid"], avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" },
                    { name: "Ronak", role: "Staff Frontend Engineer", comp: "Vercel Core Team", tags: ["Next.js", "React Core", "WebPerf"], avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80" },
                    { name: "Ayush", role: "Lead ML Platform Engineer", comp: "OpenAI Infrastructure", tags: ["PyTorch", "CUDA Testing", "LLMOps"], avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" }
                  ].map((mentor, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-sm text-center space-y-4 hover:shadow-md hover:border-teal-500/30 transition">
                      <img src={mentor.avatar} alt={mentor.name} className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white/10" />
                      <div>
                        <h3 className="font-bold text-lg text-white">{mentor.name}</h3>
                        <p className="text-xs font-semibold text-teal-400">{mentor.role}</p>
                        <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5 font-medium">{mentor.comp}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {mentor.tags.map((t, idx) => (
                          <span key={idx} className="bg-white/10 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-md">{t}</span>
                        ))}
                      </div>
                      <div className="h-px bg-white/10 my-2"></div>
                      <button
                        onClick={() => {
                          setAuthMode("register");
                          setCurrentScreen("auth");
                        }}
                        className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 py-2 rounded-xl text-xs font-bold shadow-md hover:brightness-110 transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm select-none">calendar_month</span> Book 1:1 Live Sync Block
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN 4: PRICING SCREEN */}
            {currentScreen === "pricing" && (
              <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-12 space-y-8 animate-fadeIn">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <h1 className="text-3xl font-extrabold text-white">Predictable, High-ROI Plans</h1>
                  <p className="text-sm text-slate-300">All packages scale transparently with cloud workspace allowances and sandbox hours.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto gap-8 pt-6">
                  <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-sm space-y-6 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-lg text-white">Pro Core Track</h3>
                        <p className="text-xs text-slate-300">Perfect for engineers seeking structured platform transitions.</p>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-white tracking-tight">499 INR</span>
                        <span className="text-xs font-bold text-slate-300">/ month</span>
                      </div>
                      <div className="h-px bg-white/10"></div>
                      <ul className="space-y-2.5 text-xs text-slate-300">
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-teal-400 text-sm font-bold select-none">check</span> Access to all 48 Next.js & Go modules</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-teal-400 text-sm font-bold select-none">check</span> 20 Hours/mo Cloud Terminal Sandbox allowance</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-teal-400 text-sm font-bold select-none">check</span> Slack community tier entry block</li>
                      </ul>
                    </div>
                    <button
                      onClick={() => {
                        setAuthMode("register");
                        setCurrentScreen("auth");
                      }}
                      className="w-full bg-white/10 text-white hover:bg-teal-500 hover:text-slate-950 border border-white/10 transition py-3 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Initialize Core Subscription
                    </button>
                  </div>

                  <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border-2 border-teal-500 shadow-xl space-y-6 flex flex-col justify-between relative">
                    <div className="absolute top-0 right-6 -translate-y-1/2 bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full shadow-md">Popular Tier</div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-lg text-white">Elite Mentor Stack</h3>
                        <p className="text-xs text-slate-300">Tailored for senior engineers aiming for tech lead roles.</p>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-white tracking-tight">999 INR</span>
                        <span className="text-xs font-bold text-slate-300">/ month</span>
                      </div>
                      <div className="h-px bg-white/10"></div>
                      <ul className="space-y-2.5 text-xs text-slate-300">
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-teal-400 text-sm font-bold select-none">check</span> Unrestricted access to all core & expert syllabus tracks</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-teal-400 text-sm font-bold select-none">check</span> <strong>Unlimited</strong> Cloud Container Terminals sandbox execution</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-teal-400 text-sm font-bold select-none">check</span> <strong>2 Live 1:1 Booking Slots</strong> per month with selected staff mentors</li>
                      </ul>
                    </div>
                    <button
                      onClick={() => {
                        setAuthMode("register");
                        setCurrentScreen("auth");
                      }}
                      className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 hover:brightness-110 transition py-3 rounded-xl text-xs font-bold shadow-lg shadow-teal-500/20 cursor-pointer"
                    >
                      Initialize Elite Subscription
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 5: COMMUNITY DISCUSSIONS SCREEN */}
            {currentScreen === "community" && (
              <div className="max-w-[1280px] mx-auto px-6 md:px-16 py-12 space-y-8 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-white/10 pb-6">
                  <div>
                    <h1 className="text-3xl font-extrabold text-white">Global Tech Innovators Guild</h1>
                    <p className="text-sm text-slate-300 mt-1">Review live bug reports, architecture reviews, and open source pull requests.</p>
                  </div>
                  <button
                    onClick={() => {
                      setAuthMode("register");
                      setCurrentScreen("auth");
                    }}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl hover:brightness-110 transition self-start sm:self-auto flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm select-none">add_comment</span> Open New Matrix Topic
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { title: "Optimizing Next.js 15 Server Action payload streams over poor edge gateways", author: "Hitesh K.", responses: "14 replies", tag: "WebPerf" },
                    { title: "How to safely abstract high-concurrency database states inside Docker containers", author: "Deepak S.", responses: "29 replies", tag: "Backend Architecture" },
                    { title: "Deploying automated model validation pipelines inside air-gapped clusters", author: "Preeti M.", responses: "8 replies", tag: "LLMOps Grid" }
                  ].map((post, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-sm hover:border-teal-500/40 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <span className="bg-teal-500/10 text-teal-400 text-[10px] font-black tracking-wide uppercase px-2.5 py-0.5 rounded-md border border-teal-500/20">{post.tag}</span>
                        <h3 onClick={() => { setAuthMode("register"); setCurrentScreen("auth"); }} className="font-bold text-sm md:text-base text-white hover:text-teal-400 cursor-pointer transition">{post.title}</h3>
                        <p className="text-xs text-slate-400">Initiated by <span className="font-semibold text-slate-300">{post.author}</span> • Active 23 minutes ago</p>
                      </div>
                      <span className="text-xs font-mono font-bold bg-white/10 text-slate-300 px-3 py-1 rounded-lg border border-white/10 shrink-0">{post.responses}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN 6: CENTRAL AUTHENTICATION LAYER */}
            {currentScreen === "auth" && (
              <div className="max-w-6xl mx-auto my-12 px-6">
                <div className="text-center space-y-2 mb-8 animate-fadeIn">
                  <h1 className="text-3xl font-black bg-gradient-to-r from-teal-400 to-indigo-300 bg-clip-text text-transparent tracking-tight">
                    {authMode === "login" ? "Welcome Back To LearnUp" : "Create Expert Account"}
                  </h1>
                  <p className="text-xs text-slate-300 font-medium">
                    {authMode === "login"
                      ? "Access your unified learning matrix dashboard"
                      : "Sign up to begin deploying cloud sandbox containers"}
                  </p>
                </div>

                {/* Renders the decoupled original Auth block */}
                <div className="flex justify-center">
                  <AuthCard
                    authMode={authMode}
                    setAuthMode={setAuthMode}
                    onAuthSubmit={handleAuthSubmit}
                    onSocialAuth={handleSocialAuth}
                  />
                </div>
              </div>
            )}

            {/* STANDALONE VIEWPORTS FOR DASHBOARDS */}
            {currentScreen === "student_dashboard" && (
              <StudentDashboard onLogout={() => setCurrentScreen("home")} />
            )}

            {currentScreen === "instructor_dashboard" && (
              <InstructorDashboard onLogout={() => setCurrentScreen("home")} />
            )}

          </main>

          {/* ========================================================= */}
          {/* GLOBAL FOOTER                                             */}
          {/* ========================================================= */}
          {!["student_dashboard", "instructor_dashboard"].includes(currentScreen) && (
            <footer className="w-full bg-slate-950/45 backdrop-blur-xl border-t border-white/10 py-12 relative overflow-hidden">
              <div className="absolute -bottom-10 right-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="max-w-[1280px] mx-auto px-6 md:px-12 relative z-10 flex flex-col gap-8">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  {/* Brand Identity */}
                  <div className="space-y-2 max-w-sm">
                    <div className="flex items-center gap-2.5 text-white font-black text-xl tracking-tight">
                      <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4V16C4 18.2091 5.79086 20 8 20H20V16H8V4H4Z" fill="#00c0a8" />
                        <path d="M12 13V7H10L13 3L16 7H14V13H12Z" fill="#06b6d4" />
                      </svg>
                      LearnUp
                    </div>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      Engineering complex architectural roadmaps and high-performance system tracks for next-generation core developers.
                    </p>
                  </div>

                  {/* Social Links inside Global Footer */}
                  <div className="flex items-center gap-4">
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 text-slate-400 flex items-center justify-center transition-all hover:-translate-y-0.5 hover:text-[#0077B5] hover:bg-[#0077B5]/10">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram" className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 text-slate-400 flex items-center justify-center transition-all hover:-translate-y-0.5 hover:text-[#E1306C] hover:bg-[#E1306C]/10">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                    </a>
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" title="X (Twitter)" className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 text-slate-400 flex items-center justify-center transition-all hover:-translate-y-0.5 hover:text-white hover:bg-white/10">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    </a>
                  </div>
                </div>

                {/* Copyright & Legal Corporate Links */}
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-semibold text-slate-400 tracking-wide">
                  <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                    <span className="bg-gradient-to-r from-teal-400 to-indigo-300 bg-clip-text text-transparent font-black tracking-tight text-xs flex items-center gap-0.5">
                      <span className="inline-block w-1.5 h-1.5 bg-teal-400 rounded-full"></span>
                      LearnUp
                    </span>
                    <span>© {new Date().getFullYear()} Learnup. All rights reserved.</span>
                  </div>
                  <div className="flex gap-6 justify-center sm:justify-end">
                    <a href="#" className="hover:text-teal-400 transition-colors">Security Metrics</a>
                    <a href="#" className="hover:text-teal-400 transition-colors">Workspace terms</a>
                    <a href="#" className="hover:text-teal-400 transition-colors">Learnup</a>
                  </div>
                </div>

              </div>
            </footer>
          )}

        </div>
      </SakaiLayoutWrapper>
    </>
  );
}