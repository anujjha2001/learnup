"use client";

import React, { useState, useEffect } from "react";
import { triggerProfileUpdate } from "../utils/profileSync";

interface NavbarProps {
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  setAuthMode: (mode: "login" | "register") => void;
}

export default function Navbar({
  currentScreen,
  setCurrentScreen,
  setAuthMode,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center w-full px-4 sm:px-6 md:px-12 h-16 bg-[#f8f9ff]/80 backdrop-blur-xl border-b border-[#c7c4d8]/10 shadow-sm relative">

      {/* Brand Logo and Name */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => {
          setCurrentScreen("home");
          setIsMobileMenuOpen(false);
        }}
      >
        <svg className="h-9 w-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="global-header-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#4F46E5", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#7C3AED", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <rect width="200" height="200" rx="40" fill="transparent" />
          <path
            d="M60 40 V140 H140"
            stroke="url(#global-header-grad)"
            strokeWidth="24"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M110 90 L140 60 L170 90"
            stroke="#06B6D4"
            strokeWidth="20"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M140 60 V120"
            stroke="#06B6D4"
            strokeWidth="20"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <span className="text-xl font-bold text-[#3525cd] tracking-tight">LearnUp</span>
      </div>

      {/* Desktop Navigation & Actions (Enforces gap-6 spacing between Community and Sign In) */}
      <div className="hidden lg:flex items-center gap-6 ml-auto">
        <nav className="flex items-center gap-6 text-[#464555] font-medium text-sm">
          <button
            onClick={() => setCurrentScreen("home")}
            className={`transition cursor-pointer ${currentScreen === "home" ? "text-[#3525cd] font-bold" : "hover:text-[#3525cd]"
              }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentScreen("courses")}
            className={`transition cursor-pointer ${currentScreen === "courses" ? "text-[#3525cd] font-bold" : "hover:text-[#3525cd]"
              }`}
          >
            Courses
          </button>
          <button
            onClick={() => setCurrentScreen("mentors")}
            className={`transition cursor-pointer ${currentScreen === "mentors" ? "text-[#3525cd] font-bold" : "hover:text-[#3525cd]"
              }`}
          >
            Mentors
          </button>
          <button
            onClick={() => setCurrentScreen("pricing")}
            className={`transition cursor-pointer ${currentScreen === "pricing" ? "text-[#3525cd] font-bold" : "hover:text-[#3525cd]"
              }`}
          >
            Pricing
          </button>
          <button
            onClick={() => setCurrentScreen("community")}
            className={`transition cursor-pointer ${currentScreen === "community" ? "text-[#3525cd] font-bold" : "hover:text-[#3525cd]"
              }`}
          >
            Community
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setAuthMode("login");
              setCurrentScreen("auth");
            }}
            className="text-[#464555] text-sm font-medium hover:text-[#3525cd] transition cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthMode("register");
              setCurrentScreen("auth");
            }}
            className="bg-[#4f46e5] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#3525cd] transition shadow-md shadow-[#4f46e5]/20 cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Mobile Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="flex lg:hidden p-2 text-[#464555] hover:bg-[#d3e4fe]/50 rounded-lg transition-all cursor-pointer items-center justify-center"
      >
        <span className="material-symbols-outlined text-2xl select-none">
          {isMobileMenuOpen ? "close" : "menu"}
        </span>
      </button>

      {/* Mobile Drawer (UNCHANGED) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-white border-b border-[#c7c4d8]/20 shadow-lg px-6 py-4 flex flex-col gap-4 z-40 animate-fadeIn">
          <button onClick={() => setCurrentScreen("home")} className="text-left py-2 text-sm font-medium">
            Home
          </button>
          <button onClick={() => setCurrentScreen("courses")} className="text-left py-2 text-sm font-medium">
            Courses
          </button>
          <button onClick={() => setCurrentScreen("mentors")} className="text-left py-2 text-sm font-medium">
            Mentors
          </button>
          <button onClick={() => setCurrentScreen("pricing")} className="text-left py-2 text-sm font-medium">
            Pricing
          </button>
          <button onClick={() => setCurrentScreen("community")} className="text-left py-2 text-sm font-medium">
            Community
          </button>
        </div>
      )}
    </header>
  );
}