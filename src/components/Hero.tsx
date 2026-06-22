"use client";

import React from "react";

interface HeroProps {
  setCurrentScreen: (screen: string) => void;
  setAuthMode: (mode: "login" | "register") => void;
}

export default function Hero({ setCurrentScreen, setAuthMode }: HeroProps) {
  return (
    <section className="hero-gradient relative overflow-hidden py-16 lg:py-24 max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full px-4 sm:p-8">
      {/* Hero Left Content */}
      <div className="lg:col-span-7 space-y-6 text-center md:text-left z-10 animate-fadeIn">
        <div className="inline-flex items-center gap-2 bg-[#e2dfff] text-[#3323cc] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-sm select-none">auto_awesome</span>
          Next-Gen Learning Platform
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.1] text-[#0b1c30]">
          Master the Future of{" "}
          <span className="text-[#4f46e5] bg-gradient-to-r from-[#4f46e5] to-[#712ae2] bg-clip-text text-transparent">
            Learning
          </span>{" "}
          Today
        </h1>
        <p className="text-base md:text-lg text-[#464555] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
          Unlock your potential with AI-driven personalized tracks, world-class mentors, and a community of global tech innovators.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start w-full pt-2">
          <button
            onClick={() => setCurrentScreen("courses")}
            className="bg-[#4f46e5] text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-[#3525cd] transition shadow-lg shadow-[#4f46e5]/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            Explore All Courses
            <span className="material-symbols-outlined text-lg select-none">arrow_forward</span>
          </button>
          <button
            onClick={() => {
              setAuthMode("register");
              setCurrentScreen("auth");
            }}
            className="glass-card text-[#3525cd] px-8 py-4 rounded-xl font-bold text-sm hover:bg-white/90 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#712ae2] text-xl select-none">rocket_launch</span>
            Join Platform Now
          </button>
        </div>

        {/* Stats and Reviews */}
        <div className="pt-8 border-t border-[#c7c4d8]/20 flex flex-wrap gap-6 justify-center lg:justify-start">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              <img
                className="w-9 h-9 rounded-full border-2 border-white object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="User Avatar"
              />
              <img
                className="w-9 h-9 rounded-full border-2 border-white object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                alt="User Avatar"
              />
              <img
                className="w-9 h-9 rounded-full border-2 border-white object-cover"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                alt="User Avatar"
              />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-[#0b1c30]">12,000+ Students</p>
              <p className="text-xs text-[#464555]">Trust LearnUp for growth</p>
            </div>
          </div>
          <div className="h-8 w-px bg-[#c7c4d8]/30 self-center hidden sm:block"></div>
          <div className="text-left">
            <p className="text-xl font-bold text-[#3525cd]">4.9/5</p>
            <p className="text-xs text-[#464555]">From 2,500+ global reviews</p>
          </div>
        </div>
      </div>

      {/* Hero Right Visual Column - SVG Animation Mesh */}
      <div className="w-full max-w-[420px] aspect-square mx-auto lg:col-span-5 animate-fadeIn">
        <div className="relative w-full h-full bg-[#0c0a3e] rounded-3xl overflow-hidden shadow-2xl border border-indigo-500/20 group flex items-center justify-center">
          {/* Subtle Background Glow Elements */}
          <div
            className="absolute top-10 left-10 w-44 h-44 bg-purple-600/25 rounded-full blur-[65px] animate-pulse"
            style={{ animationDuration: "4s" }}
          ></div>
          <div
            className="absolute bottom-10 right-10 w-48 h-48 bg-cyan-500/20 rounded-full blur-[55px] animate-bounce"
            style={{ animationDuration: "6s" }}
          ></div>
          <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-indigo-500/20 rounded-full blur-[50px] animate-pulse"></div>
          
          {/* Matrix Grid Lines */}
          <div className="absolute inset-0 opacity-[0.15] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

          {/* Interactive SVG Group */}
          <div className="absolute inset-0 flex items-center justify-center scale-95 md:scale-105 transition-transform duration-500 group-hover:scale-110">
            <svg
              className="w-4/5 h-4/5 text-indigo-500/40"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="100"
                cy="100"
                r="82"
                stroke="url(#hero-io-grad)"
                strokeWidth="1"
                strokeDasharray="4 8"
                className="animate-[spin_120s_linear_infinite]"
              />
              <circle
                cx="100"
                cy="100"
                r="65"
                stroke="#06b6d4"
                strokeWidth="0.75"
                strokeDasharray="2 12"
                strokeOpacity="0.4"
                className="animate-[spin_60s_linear_infinite_reverse]"
              />
              <path d="M20 100 H180 M100 20 V180" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.25" />
              <path
                d="M 30,100 Q 65,25 100,100 T 170,100"
                stroke="url(#hero-mesh-grad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="animate-pulse"
              />
              <path
                d="M 30,100 Q 65,175 100,100 T 170,100"
                stroke="#06b6d4"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeOpacity="0.5"
              />
              <circle
                cx="100"
                cy="100"
                r="28"
                fill="url(#hero-io-grad)"
                opacity="0.15"
                className="animate-ping"
                style={{ animationDuration: "3s" }}
              />

              {/* Centered Brand Mark Logo */}
              <g transform="translate(68, 68) scale(0.32)">
                <rect width="200" height="200" rx="40" fill="rgba(12, 10, 62, 0.85)" stroke="url(#hero-io-grad)" strokeWidth="6" />
                <path
                  d="M60 40 V140 H140"
                  stroke="url(#hero-io-grad)"
                  strokeWidth="26"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M110 90 L140 60 L170 90"
                  stroke="#06B6D4"
                  strokeWidth="22"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M140 60 V120"
                  stroke="#06B6D4"
                  strokeWidth="22"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </g>

              {/* Bouncing & Pulsing Nodes */}
              <circle cx="65" cy="35" r="3" fill="#06b6d4" className="animate-bounce" style={{ animationDelay: "0.5s" }} />
              <circle cx="135" cy="165" r="4" fill="#7c3aed" className="animate-pulse" />
              <circle cx="170" cy="70" r="2.5" fill="#4f46e5" className="animate-bounce" style={{ animationDelay: "1.2s" }} />

              <defs>
                <linearGradient id="hero-io-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="hero-mesh-grad" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="50%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none mix-blend-overlay"></div>
        </div>
      </div>
    </section>
  );
}
