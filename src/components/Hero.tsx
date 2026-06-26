"use client";

import React from "react";

interface HeroProps {
  setCurrentScreen: (screen: string) => void;
  setAuthMode: (mode: "login" | "register") => void;
}

export default function Hero({ setCurrentScreen, setAuthMode }: HeroProps) {
  return (
    <div className="w-full bg-[#f8f9ff] text-slate-900 selection:bg-indigo-500 selection:text-white antialiased">

      {/* ================= 1. THE HERO SECTION ================= */}
      <section className="relative overflow-hidden py-20 lg:py-28 max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full px-6 md:px-12">
        {/* Decorative subtle abstract layer */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl -z-10 animate-pulse"></div>

        {/* Hero Left Content */}
        <div className="lg:col-span-7 space-y-6 text-center md:text-left z-10 dynamic-fade-in">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-[#3323cc] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
            <span className="material-symbols-outlined text-sm select-none animate-spin">auto_awesome</span>
            The Next-Gen Knowledge Pipeline
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-[#0b1c30]">
            Master the Future of{" "}
            <span className="bg-gradient-to-r from-[#4f46e5] via-[#712ae2] to-[#06b6d4] bg-clip-text text-transparent">
              Learning
            </span>{" "}
            Today
          </h1>
          <p className="text-base md:text-lg text-[#464555] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
            Unlock elite engineer tracks with adaptive real-time dashboard tracking, dedicated industry mentors, and enterprise-grade deployment practicals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start w-full pt-4">
            <button
              onClick={() => setCurrentScreen("courses")}
              className="bg-[#4f46e5] text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-[#3525cd] transition-all duration-300 shadow-xl shadow-[#4f46e5]/20 hover:shadow-[#4f46e5]/40 flex items-center justify-center gap-2 cursor-pointer group hover:-translate-y-0.5"
            >
              Explore All Courses
              <span className="material-symbols-outlined text-lg select-none group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <button
              onClick={() => {
                setAuthMode("register");
                setCurrentScreen("auth");
              }}
              className="bg-white/80 backdrop-blur-md text-[#3525cd] border border-[#4f46e5]/20 px-8 py-4 rounded-xl font-bold text-sm hover:bg-white hover:border-[#4f46e5]/50 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-[#712ae2] text-xl select-none">rocket_launch</span>
              Join Platform Now
            </button>
          </div>

          {/* Premium Endorsements / Stats */}
          <div className="pt-10 border-t border-[#c7c4d8]/30 flex flex-wrap gap-8 justify-center lg:justify-start items-center">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                <img
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="User Tech Lead"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="User Senior Dev"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                  alt="User Product Manager"
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-[#0b1c30]">12,000+ Engineers</p>
                <p className="text-xs text-[#464555] font-medium">Syncing architectural pipelines</p>
              </div>
            </div>
            <div className="h-8 w-px bg-[#c7c4d8]/40 self-center hidden sm:block"></div>
            <div className="text-left">
              <p className="text-2xl font-black bg-gradient-to-r from-[#3525cd] to-[#712ae2] bg-clip-text text-transparent">4.9 / 5.0</p>
              <p className="text-xs text-[#464555] font-medium">From 2,500+ production critiques</p>
            </div>
          </div>
        </div>

        {/* Hero Right Visual Column */}
        <div className="w-full max-w-[440px] aspect-square mx-auto lg:col-span-5 duration-700">
          <div className="relative w-full h-full bg-gradient-to-br from-[#0c0a3e] to-[#05041a] rounded-3xl overflow-hidden shadow-2xl shadow-indigo-950/40 border border-indigo-500/30 group flex items-center justify-center animate-bounce [animation-duration:10s]">

            {/* Immersive Plasma Flares */}
            <div className="absolute top-4 left-4 w-52 h-52 bg-purple-600/30 rounded-full blur-[70px] mix-blend-screen"></div>
            <div className="absolute bottom-4 right-4 w-52 h-52 bg-cyan-500/25 rounded-full blur-[60px] mix-blend-screen"></div>

            {/* Structured Cyber Mesh Grid */}
            <div className="absolute inset-0 opacity-[0.18] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>

            {/* Mechanical Animated Graph Nodes */}
            <div className="absolute inset-0 flex items-center justify-center scale-105 group-hover:scale-110 transition-transform duration-700">
              <svg className="w-5/6 h-5/6 text-indigo-400/30" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="85" stroke="url(#hero-io-grad-v3)" strokeWidth="1.25" strokeDasharray="6 8" className="animate-spin [animation-duration:60s]" />
                <circle cx="100" cy="100" r="66" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 10" strokeOpacity="0.5" className="animate-spin [animation-duration:30s] [animation-direction:reverse]" />

                <path d="M 30,100 Q 65,15 100,100 T 170,100" stroke="url(#hero-mesh-grad-v3)" strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
                <path d="M 30,100 Q 65,185 100,100 T 170,100" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />

                {/* Animated Ring Core */}
                <circle cx="100" cy="100" r="30" fill="url(#hero-io-grad-v3)" opacity="0.15" className="animate-ping [animation-duration:4s]" />

                {/* Glassmorphic Brand Logo Badge Inside Core */}
                <g transform="translate(68, 68) scale(0.32)">
                  <rect width="200" height="200" rx="45" fill="rgba(6, 4, 34, 0.9)" stroke="url(#hero-io-grad-v3)" strokeWidth="6" />
                  <path d="M60 40 V140 H140" stroke="url(#hero-io-grad-v3)" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M110 90 L140 60 L170 90" stroke="#06B6D4" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M140 60 V120" stroke="#06B6D4" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </g>

                <defs>
                  <linearGradient id="hero-io-grad-v3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                  <linearGradient id="hero-mesh-grad-v3" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="50%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. THE VISION STATS BLOCK ================= */}
      <section className="py-24 bg-gradient-to-b from-[#f8f9ff] via-[#f1f4ff] to-white border-t border-[#c7c4d8]/20 relative">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Vision Left Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#8a4cfc]/10 text-[#8a4cfc] border border-[#8a4cfc]/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm select-none">visibility</span> Platform Blueprint
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-[#0b1c30] tracking-tight leading-tight">
              Shaping the Architects of <span className="bg-gradient-to-r from-[#3525cd] via-[#4f46e5] to-[#712ae2] bg-clip-text text-transparent">Tomorrow&apos;s Systems</span>
            </h3>

            <p className="text-base text-[#464555] leading-relaxed">
              At LearnUp, our mission shifts away from hosting static tutorial libraries. We are engineering a live production pipeline where students master industry-standard solutions, architectural node structuring, and direct execution on real-world production codebases.
            </p>

            <div className="p-5 rounded-2xl bg-white/60 border border-indigo-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3525cd]"></div>
              <p className="text-sm text-[#0b1c30] font-semibold leading-relaxed italic">
                &quot;We are completely bypassing linear video playback systems to transform engineering education into a hyper-focused, live production track matrix.&quot;
              </p>
            </div>

            {/* Dynamic Stats Panels */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                <h4 className="text-3xl font-black text-[#3525cd]">94%</h4>
                <p className="text-xs text-[#464555] font-bold mt-1">Production Deployment Success</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                <h4 className="text-3xl font-black text-[#712ae2]">120+</h4>
                <p className="text-xs text-[#464555] font-bold mt-1">Global Tech Evaluators</p>
              </div>
            </div>
          </div>

          {/* Vision Right Graphics Cards Stack */}
          <div className="lg:col-span-7 relative flex justify-center items-center">
            <div className="absolute w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl -z-10 top-0 left-0 animate-pulse"></div>
            <div className="absolute w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl -z-10 bottom-0 right-0 animate-pulse"></div>

            {/* Core Glassmorphic Board */}
            <div className="w-full max-w-xl bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white shadow-xl shadow-indigo-950/5 space-y-6 hover:scale-[1.01] transition-transform duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#3525cd] to-[#4f46e5] flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                  <span className="material-symbols-outlined select-none">hub</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-[#0b1c30] text-lg">Platform Node Advantages</h4>
                  <p className="text-xs text-[#464555] font-medium">Fully Optimized Stack Architecture</p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex gap-4 items-start p-3 rounded-2xl hover:bg-slate-50/80 transition-colors">
                  <span className="material-symbols-outlined text-emerald-500 bg-emerald-50 p-1.5 rounded-xl font-bold select-none">verified</span>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">Decentralized Knowledge Stack</h5>
                    <p className="text-xs text-[#464555] mt-0.5">Direct architecture logs from global advisors without boilerplate or outdated lag.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start p-3 rounded-2xl hover:bg-slate-50/80 transition-colors">
                  <span className="material-symbols-outlined text-emerald-500 bg-emerald-50 p-1.5 rounded-xl font-bold select-none">verified</span>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">Production-Ready Sandbox Tracks</h5>
                    <p className="text-xs text-[#464555] mt-0.5">Skip fluff tutorials. Focus purely on structures that can directly scale and configure modern servers.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start p-3 rounded-2xl hover:bg-slate-50/80 transition-colors">
                  <span className="material-symbols-outlined text-emerald-500 bg-emerald-50 p-1.5 rounded-xl font-bold select-none">verified</span>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">Integrated Credentials Ledger</h5>
                    <p className="text-xs text-[#464555] mt-0.5">Automated node evaluation based on performance arrays, visible directly in your student dashboard.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= 3. MEET THE ARCHITECTS (TEAM GRID) ================= */}
      <section className="py-26 bg-white relative">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 space-y-16">

          {/* Header Block */}
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm select-none">diversity_3</span> Governance Crew
            </div>
            <h2 className="text-4xl font-black text-[#0b1c30] tracking-tight">
              Meet Our <span className="bg-gradient-to-r from-[#3525cd] to-[#712ae2] bg-clip-text text-transparent">Tech Architects</span>
            </h2>

            <p className="text-sm md:text-base text-[#464555] max-w-xl mx-auto">
              We have built an elite team of software developers, product heads, and solution strategists dedicated to delivering next-level operational assistance for your platform.
            </p>
          </div>

          {/* Premium High-Gloss Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Anuj",
                role: "Chief Tech Architect / Founder",
                image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop",
                bio: "Enterprise Solution Architect & Platform Innovator. Engineering hyper-scalable core systems.",
                glow: "group-hover:shadow-indigo-500/10 border-indigo-100 group-hover:border-indigo-400/40",
                badge: "bg-indigo-50 text-indigo-600"
              },
              {
                name: "Sneha",
                role: "Head of UX & Product Design",
                image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
                bio: "Former Enterprise Design Lead. Specializing in macro user-journeys and layout systems.",
                glow: "group-hover:shadow-purple-500/10 border-purple-100 group-hover:border-purple-400/40",
                badge: "bg-purple-50 text-purple-600"
              },
              {
                name: "Vikram",
                role: "Lead Cloud Infrastructure Node",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
                bio: "Core DevOps Contributor. Handling global container distributions, CDNs, and orchestration routes.",
                glow: "group-hover:shadow-cyan-500/10 border-cyan-100 group-hover:border-cyan-400/40",
                badge: "bg-cyan-50 text-cyan-600"
              },
              {
                name: "Rohan",
                role: "Director of Curriculum Strategy",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
                bio: "Pedagogical Advisor. Creating modular roadmap frameworks to match enterprise node hiring protocols.",
                glow: "group-hover:shadow-emerald-500/10 border-emerald-100 group-hover:border-emerald-400/40",
                badge: "bg-emerald-50 text-emerald-600"
              }
            ].map((member, idx) => (
              <div
                key={idx}
                className={`bg-[#f8f9ff]/60 border backdrop-blur-sm p-6 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-xl group flex flex-col items-center text-center ${member.glow}`}
              >
                <div className="relative w-28 h-28 mb-5">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#4f46e5] to-[#06b6d4] rounded-full group-hover:rotate-180 transition-transform duration-700"></div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="absolute inset-[3px] w-[106px] h-[106px] rounded-full object-cover border-2 border-white transition-all duration-300"
                  />
                </div>

                <h4 className="font-black text-lg text-[#0b1c30] group-hover:text-[#4f46e5] transition-colors duration-300">{member.name}</h4>
                <span className={`text-[10px] font-extrabold tracking-wider px-3 py-1 rounded-full uppercase mt-1.5 ${member.badge}`}>
                  {member.role}
                </span>

                <div className="w-12 h-[2px] bg-slate-200 my-4 group-hover:w-24 transition-all duration-500 bg-gradient-to-r from-indigo-500 to-cyan-400"></div>
                <p className="text-xs text-[#464555] font-medium leading-relaxed px-1 flex-1">{member.bio}</p>

                <div className="flex gap-4 mt-5 pt-3 border-t border-slate-200/60 w-full justify-center text-slate-400 group-hover:text-indigo-500 transition-colors duration-300">
                  <span className="material-symbols-outlined text-base cursor-pointer hover:scale-110 transition-transform select-none">language</span>
                  <span className="material-symbols-outlined text-base cursor-pointer hover:scale-110 transition-transform select-none">verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 4. THE BRAND FOOTER SYSTEM ================= */}
      <footer className="w-full bg-[#070524] text-slate-300 border-t border-indigo-950/60 py-12 relative overflow-hidden">
        <div className="absolute -bottom-10 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-[1280px] mx-auto px-6 md:px-12 relative z-10 flex flex-col">

          {/* Layer 1: Top Brand Identity */}
          <div className="text-center sm:text-left space-y-2 max-w-sm mb-10">
            <div className="flex items-center justify-center sm:justify-start gap-2.5 text-white font-black text-xl tracking-tight">
              <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4V16C4 18.2091 5.79086 20 8 20H20V16H8V4H4Z" fill="#4f46e5" />
                <path d="M12 13V7H10L13 3L16 7H14V13H12Z" fill="#06b6d4" />
              </svg>
              LearnUp
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Engineering complex architectural roadmaps and high-performance system tracks for next-generation core developers.
            </p>
          </div>

          {/* Layer 2: Copyright & Legal Corporate Links */}
          <div className="pt-6 border-t border-indigo-950/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-semibold text-slate-500 tracking-wide">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <span className="text-[#4f46e5] font-black tracking-tight text-xs flex items-center gap-0.5">
                <span className="inline-block w-1.5 h-1.5 bg-[#06b6d4] rounded-full"></span>
                LearnUp
              </span>
              <span>© {new Date().getFullYear()} Learning Stack Ecosystem.</span>
            </div>
            <div className="flex gap-6 justify-center sm:justify-end">
              <a href="#" className="hover:text-indigo-400 transition-colors">Security Metrics</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Workspace terms</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">API Routing Logs</a>
            </div>
          </div>

          {/* Layer 3: STRICTLY UNDERNEATH COPYRIGHT LAYER */}
          <div className="mt-8 pt-6 border-t border-indigo-950/20 flex w-full items-center justify-center sm:justify-end">
            <div className="flex items-center gap-4">
              {[
                {
                  name: "LinkedIn",
                  href: "https://linkedin.com",
                  color: "hover:text-[#0077B5] hover:border-[#0077B5]/40 hover:bg-[#0077B5]/5",
                  svg: <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                },
                {
                  name: "Instagram",
                  href: "https://instagram.com",
                  color: "hover:text-[#E1306C] hover:border-[#E1306C]/40 hover:bg-[#E1306C]/5",
                  svg: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                },
                {
                  name: "X (Twitter)",
                  href: "https://x.com",
                  color: "hover:text-white hover:border-slate-700 hover:bg-white/5",
                  svg: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                }
              ].map((social, sIdx) => (
                <a
                  key={sIdx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.name}
                  className={`w-10 h-10 rounded-xl border border-indigo-950 bg-[#0c0a31] text-slate-400 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 ${social.color}`}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {social.svg}
                  </svg>
                </a>
              ))}
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}