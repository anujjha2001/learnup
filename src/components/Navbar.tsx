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
    <header className="sticky top-0 z-50 flex justify-between items-center w-full px-4 sm:px-6 md:px-12 h-16 bg-[#090816]/80 backdrop-blur-xl border-b border-white/10 shadow-sm relative">

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
              <stop offset="0%" style={{ stopColor: "#bc3ef4", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#06B6D4", stopOpacity: 1 }} />
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
        <span className="text-xl font-black text-white tracking-tight">LearnUp</span>
      </div>

      {/* Desktop Navigation & Actions (Enforces gap-6 spacing between Community and Sign In) */}
      <div className="hidden lg:flex items-center gap-6 ml-auto">
        <nav className="flex items-center gap-6 text-slate-300 font-bold text-xs tracking-wider">
          <button
            onClick={() => setCurrentScreen("home")}
            className={`transition cursor-pointer uppercase ${currentScreen === "home" ? "text-purple-400 font-black" : "hover:text-purple-400 text-slate-300"
              }`}
          >
            HOME
          </button>
          <button
            onClick={() => setCurrentScreen("courses")}
            className={`transition cursor-pointer uppercase ${currentScreen === "courses" ? "text-purple-400 font-black" : "hover:text-purple-400 text-slate-300"
              }`}
          >
            COURSES
          </button>
          <button
            onClick={() => setCurrentScreen("mentors")}
            className={`transition cursor-pointer uppercase ${currentScreen === "mentors" ? "text-purple-400 font-black" : "hover:text-purple-400 text-slate-300"
              }`}
          >
            MENTORS
          </button>
          <button
            onClick={() => setCurrentScreen("pricing")}
            className={`transition cursor-pointer uppercase ${currentScreen === "pricing" ? "text-purple-400 font-black" : "hover:text-purple-400 text-slate-300"
              }`}
          >
            PRICING
          </button>
          <button
            onClick={() => setCurrentScreen("community")}
            className={`transition cursor-pointer uppercase ${currentScreen === "community" ? "text-purple-400 font-black" : "hover:text-purple-400 text-slate-300"
              }`}
          >
            COMMUNITY
          </button>
        </nav>

        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              setAuthMode("login");
              setCurrentScreen("auth");
            }}
            className="text-slate-300 text-xs font-bold tracking-wider hover:text-purple-400 transition cursor-pointer uppercase"
          >
            SIGN IN
          </button>
          <button
            onClick={() => {
              setAuthMode("register");
              setCurrentScreen("auth");
            }}
            className="bg-[#6d28d9]/10 text-purple-300 border border-[#6d28d9]/40 hover:border-purple-400 hover:bg-[#6d28d9]/20 hover:text-white px-5 py-2 rounded-full text-xs font-extrabold tracking-wider transition-all duration-300 shadow-md shadow-purple-950/20 cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Mobile Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="flex lg:hidden p-2 text-slate-300 hover:bg-white/10 rounded-lg transition-all cursor-pointer items-center justify-center"
      >
        <span className="material-symbols-outlined text-2xl select-none">
          {isMobileMenuOpen ? "close" : "menu"}
        </span>
      </button>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-[#090816]/95 border-b border-white/10 shadow-lg px-6 py-6 flex flex-col gap-4 z-40 animate-fadeIn text-slate-300">
          <button onClick={() => { setCurrentScreen("home"); setIsMobileMenuOpen(false); }} className="text-left py-2 text-xs font-bold tracking-wider uppercase hover:text-purple-400">
            HOME
          </button>
          <button onClick={() => { setCurrentScreen("courses"); setIsMobileMenuOpen(false); }} className="text-left py-2 text-xs font-bold tracking-wider uppercase hover:text-purple-400">
            COURSES
          </button>
          <button onClick={() => { setCurrentScreen("mentors"); setIsMobileMenuOpen(false); }} className="text-left py-2 text-xs font-bold tracking-wider uppercase hover:text-purple-400">
            MENTORS
          </button>
          <button onClick={() => { setCurrentScreen("pricing"); setIsMobileMenuOpen(false); }} className="text-left py-2 text-xs font-bold tracking-wider uppercase hover:text-purple-400">
            PRICING
          </button>
          <button onClick={() => { setCurrentScreen("community"); setIsMobileMenuOpen(false); }} className="text-left py-2 text-xs font-bold tracking-wider uppercase hover:text-purple-400">
            COMMUNITY
          </button>
          <button onClick={() => { setAuthMode("login"); setCurrentScreen("auth"); setIsMobileMenuOpen(false); }} className="text-left py-2 text-xs font-bold tracking-wider uppercase hover:text-purple-400 border-t border-white/10 pt-4">
            SIGN IN
          </button>
          <button onClick={() => { setAuthMode("register"); setCurrentScreen("auth"); setIsMobileMenuOpen(false); }} className="text-center py-2.5 text-xs font-bold tracking-wider uppercase bg-[#6d28d9]/10 text-purple-300 border border-[#6d28d9]/40 hover:border-purple-400 rounded-full mt-2">
            GET STARTED
          </button>
        </div>
      )}
    </header>
  );
}