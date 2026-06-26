"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrackProgress from "@/components/TrackProgress";
import AuthCard from "@/components/AuthCard";
import StudentDashboard from "@/components/StudentDashboard";
import InstructorDashboard from "@/components/InstructorDashboard";

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

  // Dynamic Routing Handler for Auth Submit
  const handleAuthSubmit = (selectedRole: "student" | "instructor") => {
    if (selectedRole === "student") {
      setCurrentScreen("student_dashboard");
    } else {
      setCurrentScreen("instructor_dashboard");
    }
  };   

  const handleSocialAuth = (provider: "google" | "linkedin" | "github", role: "student" | "instructor") => {
    console.log(`Initiating social auth for ${provider}`);
    
    // Save local mock user session so dashboard renders with authenticated context
    const sessionUser = {
      id: `oauth-mock-${provider}-${Date.now()}`,
      name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      email: `${provider}-user@example.com`,
      phone: "+1234567890",
      role: role,
      isVerified: true,
      avatar: `https://ui-avatars.com/api/?name=${provider}&background=3525cd&color=fff`,
    };

    localStorage.setItem("learnup_user", JSON.stringify(sessionUser));
    localStorage.setItem("user_email", sessionUser.email);
    localStorage.setItem("user_name", sessionUser.name);
    localStorage.setItem("user_avatar", sessionUser.avatar);
    localStorage.setItem("user_tier", sessionUser.role === "student" ? "Premium Student" : "Senior Instructor");

    if (role === "student") {
      setCurrentScreen("student_dashboard");
    } else {
      setCurrentScreen("instructor_dashboard");
    }
  };

  return (
    <>
      {/* Premium UI Component Styles injection */}
      <style dangerouslySetInnerHTML={{ __html: `
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
          border: 1px solid rgba(79, 70, 229, 0.1);
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

      <div className="bg-[#f8f9ff] text-[#0b1c30] font-sans selection:bg-[#3525cd]/20 min-h-screen antialiased flex flex-col justify-between">
        
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
                <div className="bg-white p-6 rounded-2xl border border-[#c7c4d8]/20 shadow-sm space-y-4 hover:shadow-md transition">
                  <div className="w-12 h-12 rounded-xl bg-[#e2dfff] text-[#3525cd] flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl select-none">psychology</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0b1c30]">AI-Adaptive Curriculum</h3>
                  <p className="text-sm text-[#464555]">
                    Smart algorithms configured to auto-serve layout variables aligned with individual pace scales.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-[#c7c4d8]/20 shadow-sm space-y-4 hover:shadow-md transition">
                  <div className="w-12 h-12 rounded-xl bg-[#ffdbcc] text-[#7e3000] flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl select-none">groups</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0b1c30]">Elite 1:1 Mentorship</h3>
                  <p className="text-sm text-[#464555]">
                    Live syncing workspace blocks built with veteran software leaders to debug production codebases.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-[#c7c4d8]/20 shadow-sm space-y-4 hover:shadow-md transition">
                  <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl select-none">terminal</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0b1c30]">Interactive Sandboxes</h3>
                  <p className="text-sm text-[#464555]">
                    Spin up Kubernetes instances and test container setups natively straight inside your dashboard tab.
                  </p>
                </div>
              </section>

              {/* Progress Tracking Cards Module */}
              <TrackProgress />

              {/* Product Experience Tour */}
              <section id="product-tour" className="py-16 px-6 md:px-16 max-w-[1280px] mx-auto border-t border-[#c7c4d8]/20">
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                  <h2 className="text-3xl font-extrabold tracking-tight text-[#0b1c30]">Experience LearnUp In Action</h2>
                  <p className="text-sm text-[#464555]">Interactive platform simulations built to map technical architecture metrics cleanly.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-[#c7c4d8]/30 shadow-xl">
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
                    <div className="p-4 bg-white rounded-xl border border-[#c7c4d8]/20 flex items-start gap-4">
                      <div className="p-2.5 bg-indigo-50 text-[#4f46e5] rounded-lg"><span className="material-symbols-outlined select-none">{CHAPTERS_DATA[activeChapter].icon}</span></div>
                      <div>
                        <h4 className="font-bold text-[#0b1c30] text-sm">{CHAPTERS_DATA[activeChapter].title}</h4>
                        <p className="text-xs text-[#464555] mt-1">{CHAPTERS_DATA[activeChapter].description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-5 space-y-3">
                    {CHAPTERS_DATA.map((chapter, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setActiveChapter(idx)} 
                        className={`w-full text-left p-4 rounded-xl transition border flex gap-4 items-center cursor-pointer ${
                          activeChapter === idx 
                            ? "bg-white border-[#4f46e5] shadow-sm" 
                            : "bg-[#f0f2fe]/60 border-transparent hover:bg-white"
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${activeChapter === idx ? "bg-[#4f46e5] text-white" : "bg-slate-200 text-slate-600"}`}>{idx + 1}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate text-[#0b1c30]">{chapter.title}</p>
                          <p className="text-xs text-[#464555] truncate">{chapter.description}</p>
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
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#c7c4d8]/20 pb-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-[#0b1c30]">All Certified Tracks</h1>
                  <p className="text-sm text-[#464555] mt-1">Explore curriculum architectures custom tailored for production environments.</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-[#c7c4d8]/30 shadow-sm w-full md:w-auto">
                  <span className="material-symbols-outlined text-slate-400 text-lg select-none">search</span>
                  <input type="text" placeholder="Search technology tracks..." className="bg-transparent text-sm focus:outline-none w-full" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: "Full-Stack Next.js Enterprise Hub", lectures: "48 Modules", level: "Advanced", levelColor: "text-red-600 bg-red-50", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80" },
                  { title: "Machine Learning Operational Scaling", lectures: "36 Modules", level: "Intermediate", levelColor: "text-amber-600 bg-amber-50", img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=400&q=80" },
                  { title: "Cloud Architecture & Kubernetes Grid", lectures: "52 Modules", level: "Expert", levelColor: "text-purple-600 bg-purple-50", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80" }
                ].map((course, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#c7c4d8]/20 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div>
                      <img src={course.img} alt={course.title} className="h-44 w-full object-cover" />
                      <div className="p-5 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-bold font-mono text-[#464555]">{course.lectures}</span>
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${course.levelColor}`}>{course.level}</span>
                        </div>
                        <h3 className="font-bold text-base text-[#0b1c30] leading-snug">{course.title}</h3>
                        <p className="text-xs text-[#464555]">Master modern workflows, clean structures, testing integration suites, and cloud pipeline staging environments natively.</p>
                      </div>
                    </div>
                    <div className="p-5 pt-0">
                      <button 
                        onClick={() => {
                          setAuthMode("register");
                          setCurrentScreen("auth");
                        }}
                        className="w-full bg-[#f0f2fe] text-[#3525cd] hover:bg-[#3525cd] hover:text-white transition py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
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
                <h1 className="text-3xl font-extrabold text-[#0b1c30]">Silicon Valley Engineering Advisors</h1>
                <p className="text-sm text-[#464555]">Skip generic tutorial blocks. Pair synchronously with professionals deploying core systems daily.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                {[
                  { name: "Arjun Mehta", role: "Principal Cloud Architect", comp: "Ex-Google / Netflix", tags: ["Kubernetes", "Go", "AWS Grid"], avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" },
                  { name: "Ronak Sharma", role: "Staff Frontend Engineer", comp: "Vercel Core Team", tags: ["Next.js", "React Core", "WebPerf"], avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80" },
                  { name: "Ayush Pandey", role: "Lead ML Platform Engineer", comp: "OpenAI Infrastructure", tags: ["PyTorch", "CUDA Testing", "LLMOps"], avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" }
                ].map((mentor, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-[#c7c4d8]/20 shadow-sm text-center space-y-4 hover:shadow-md transition">
                    <img src={mentor.avatar} alt={mentor.name} className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-indigo-50" />
                    <div>
                      <h3 className="font-bold text-lg text-[#0b1c30]">{mentor.name}</h3>
                      <p className="text-xs font-semibold text-[#4f46e5]">{mentor.role}</p>
                      <p className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5 font-medium">{mentor.comp}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {mentor.tags.map((t, idx) => (
                        <span key={idx} className="bg-slate-100 text-[#464555] text-[10px] font-bold px-2 py-0.5 rounded-md">{t}</span>
                      ))}
                    </div>
                    <div className="h-px bg-slate-100 my-2"></div>
                    <button 
                      onClick={() => {
                        setAuthMode("register");
                        setCurrentScreen("auth");
                      }}
                      className="w-full bg-[#4f46e5] text-white py-2 rounded-xl text-xs font-bold shadow-md shadow-[#4f46e5]/10 hover:bg-[#3525cd] transition flex items-center justify-center gap-1 cursor-pointer"
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
                <h1 className="text-3xl font-extrabold text-[#0b1c30]">Predictable, High-ROI Plans</h1>
                <p className="text-sm text-[#464555]">All packages scale transparently with cloud workspace allowances and sandbox hours.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto gap-8 pt-6">
                <div className="bg-white p-8 rounded-2xl border border-[#c7c4d8]/20 shadow-sm space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg text-[#0b1c30]">Pro Core Track</h3>
                      <p className="text-xs text-[#464555]">Perfect for engineers seeking structured platform transitions.</p>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-[#0b1c30] tracking-tight">499 INR</span>
                      <span className="text-xs font-bold text-[#464555]">/ month</span>
                    </div>
                    <div className="h-px bg-slate-100"></div>
                    <ul className="space-y-2.5 text-xs text-[#464555]">
                      <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-600 text-sm font-bold select-none">check</span> Access to all 48 Next.js & Go modules</li>
                      <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-600 text-sm font-bold select-none">check</span> 20 Hours/mo Cloud Terminal Sandbox allowance</li>
                      <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-600 text-sm font-bold select-none">check</span> Slack community tier entry block</li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => {
                      setAuthMode("register");
                      setCurrentScreen("auth");
                    }}
                    className="w-full bg-[#f0f2fe] text-[#3525cd] hover:bg-[#3525cd] hover:text-white transition py-3 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Initialize Core Subscription
                  </button>
                </div>

                <div className="bg-white p-8 rounded-2xl border-2 border-[#4f46e5] shadow-xl space-y-6 flex flex-col justify-between relative">
                  <div className="absolute top-0 right-6 -translate-y-1/2 bg-gradient-to-r from-[#4f46e5] to-[#712ae2] text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full shadow-md">Popular Tier</div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg text-[#0b1c30]">Elite Mentor Stack</h3>
                      <p className="text-xs text-[#464555]">Tailored for senior engineers aiming for tech lead roles.</p>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-[#0b1c30] tracking-tight">999 INR</span>
                      <span className="text-xs font-bold text-[#464555]">/ month</span>
                    </div>
                    <div className="h-px bg-slate-100"></div>
                    <ul className="space-y-2.5 text-xs text-[#464555]">
                      <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-600 text-sm font-bold select-none">check</span> Unrestricted access to all core & expert syllabus tracks</li>
                      <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-600 text-sm font-bold select-none">check</span> <strong>Unlimited</strong> Cloud Container Terminals sandbox execution</li>
                      <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-600 text-sm font-bold select-none">check</span> <strong>2 Live 1:1 Booking Slots</strong> per month with selected staff mentors</li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => {
                      setAuthMode("register");
                      setCurrentScreen("auth");
                    }}
                    className="w-full bg-[#4f46e5] text-white hover:bg-[#3525cd] transition py-3 rounded-xl text-xs font-bold shadow-lg shadow-[#4f46e5]/20 cursor-pointer"
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
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-[#c7c4d8]/20 pb-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-[#0b1c30]">Global Tech Innovators Guild</h1>
                  <p className="text-sm text-[#464555] mt-1">Review live bug reports, architecture reviews, and open source pull requests.</p>
                </div>
                <button 
                  onClick={() => {
                    setAuthMode("register");
                    setCurrentScreen("auth");
                  }}
                  className="bg-[#4f46e5] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#3525cd] transition self-start sm:self-auto flex items-center gap-1 cursor-pointer"
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
                  <div key={i} className="bg-white p-5 rounded-xl border border-[#c7c4d8]/20 shadow-sm hover:border-[#4f46e5]/40 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <span className="bg-[#f0f2fe] text-[#3525cd] text-[10px] font-black tracking-wide uppercase px-2.5 py-0.5 rounded-md">{post.tag}</span>
                      <h3 onClick={() => { setAuthMode("register"); setCurrentScreen("auth"); }} className="font-bold text-sm md:text-base text-[#0b1c30] hover:text-[#4f46e5] cursor-pointer transition">{post.title}</h3>
                      <p className="text-xs text-slate-400">Initiated by <span className="font-semibold text-[#464555]">{post.author}</span> • Active 23 minutes ago</p>
                    </div>
                    <span className="text-xs font-mono font-bold bg-slate-50 text-slate-500 px-3 py-1 rounded-lg border border-slate-100 shrink-0">{post.responses}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCREEN 6: CENTRAL AUTHENTICATION LAYER */}
          {currentScreen === "auth" && (
            <div className="max-w-6xl mx-auto my-12 px-6">
              <div className="text-center space-y-2 mb-8 animate-fadeIn">
                <h1 className="text-3xl font-black bg-gradient-to-r from-[#3525cd] to-[#712ae2] bg-clip-text text-transparent tracking-tight">
                  {authMode === "login" ? "Welcome Back To LearnUp" : "Create Expert Account"}
                </h1>
                <p className="text-xs text-[#464555]">
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
          <footer className="w-full px-6 md:px-12 py-8 bg-white border-t border-[#c7c4d8]/20 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#3525cd] tracking-tight">LearnUp</span>
              <span className="text-xs text-[#464555]">© 2026 Learning Stack Ecosystem.</span>
            </div>
            <div className="flex gap-6 text-xs text-[#464555] font-medium">
              <a href="#" className="hover:text-[#3525cd] transition">Security Metrics</a>
              <a href="#" className="hover:text-[#3525cd] transition">Workspace terms</a>
              <a href="#" className="hover:text-[#3525cd] transition">API Routing Logs</a>
            </div>
          </footer>
        )}

      </div>
    </>
  );
}