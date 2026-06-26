"use client";

import React from "react";
import { TabType } from "@/types/dashboard";

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onLogout?: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "courses", label: "My Courses", icon: "menu_book" },
    { id: "analytics", label: "Analytics", icon: "bar_chart" },
    { id: "resources", label: "Resources", icon: "folder_open" },
    { id: "certificates", label: "Certificates", icon: "workspace_premium" },
    { id: "quiz", label: "Quiz Lobby", icon: "quiz" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  return (
    <aside className="w-64 flex flex-col h-full bg-[#eff4ff] border-r border-[#c7c4d8]/20 shadow-md sticky left-0 top-0 z-50 p-4 gap-2 shrink-0">

      {/* BRAND IDENTITY - Matching Main Dashboard */}
      <div className="flex items-center gap-3 px-2 py-4 mb-4">
        <svg className="h-9 w-9 shrink-0 transition-transform duration-200 hover:scale-105" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#4F46E5', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#7C3AED', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <rect width="200" height="200" rx="40" fill="transparent" />
          <path d="M60 40 V140 H140" stroke="url(#grad1)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M110 90 L140 60 L170 90" stroke="#06B6D4" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M140 60 V120" stroke="#06B6D4" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <div>
          <span className="text-2xl font-black bg-gradient-to-r from-[#3525cd] to-[#712ae2] bg-clip-text text-transparent tracking-tight block leading-none">
            LearnUp
          </span>
          <p className="text-[10px] text-[#464555] opacity-75 mt-1 font-bold uppercase tracking-widest leading-none">
            Student Hub
          </p>
        </div>
      </div>

      {/* NAV ITEMS */}
      <nav className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 group cursor-pointer ${isActive
                ? "bg-[#8a4cfc] text-[#fffbff] font-bold shadow-md shadow-[#8a4cfc]/20"
                : "text-[#464555] hover:bg-[#d3e4fe]/30"
                }`}
            >
              <span className="material-symbols-outlined transition-transform group-hover:scale-110 select-none">
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-[#c7c4d8]/10">
        <button className="text-[#464555] flex items-center gap-3 px-4 py-2.5 hover:bg-[#d3e4fe]/30 rounded-xl transition-all active:scale-95 text-left w-full cursor-pointer">
          <span className="material-symbols-outlined text-sm select-none">contact_support</span>
          <span className="text-sm font-medium">Support Center</span>
        </button>

        <button
          onClick={onLogout}
          className="text-[#464555] flex items-center gap-3 px-4 py-2.5 hover:bg-[#d3e4fe]/30 rounded-xl transition-all active:scale-95 text-left w-full cursor-pointer font-semibold text-red-600/90"
        >
          <span className="material-symbols-outlined text-sm select-none">logout</span>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}