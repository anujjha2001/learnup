"use client";

import React from "react";
import { TabType } from "@/types/dashboard";

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "courses", label: "Courses", icon: "menu_book" },
    { id: "analytics", label: "Analytics", icon: "bar_chart" },
    { id: "resources", label: "Resources", icon: "folder_open" },
    { id: "certificates", label: "Certificates", icon: "verified" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  return (
    <aside className="w-64 flex flex-col h-full bg-[#eff4ff] border-r border-[#c7c4d8]/20 shadow-md sticky left-0 top-0 z-50 p-4 gap-2">
      <div className="flex items-center gap-4 px-2 py-4 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#3525cd] flex items-center justify-center text-white font-bold shadow-sm">
          L
        </div>
        <div>
          <h1 className="text-2xl font-black text-[#3525cd] leading-none">LearnUp</h1>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full rounded-xl font-bold flex items-center gap-4 px-4 py-3 transition-all duration-200 active:scale-95 ${
              activeTab === item.id
                ? "bg-[#8a4cfc] text-[#fffbff] translate-x-1 shadow-md"
                : "text-[#464555] hover:bg-[#d3e4fe]/30 hover:translate-x-1"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-sm tracking-wide">{item.label}</span>
          </button>
        ))}

        <div className="mt-8 pt-8 border-t border-[#c7c4d8]/20">
          <button className="w-full bg-[#3525cd] text-white py-3 px-4 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all hover:bg-[#4d44e3]">
            Upgrade Pro
          </button>
        </div>
      </nav>

      <div className="mt-auto flex flex-col gap-2 pt-4">
        <a className="text-[#464555] flex items-center gap-4 px-4 py-2 hover:bg-[#d3e4fe]/30 rounded-xl transition-all" href="#">
          <span className="material-symbols-outlined">contact_support</span>
          <span className="text-sm font-medium">Help Center</span>
        </a>
        <a className="text-[#464555] flex items-center gap-4 px-4 py-2 hover:bg-[#d3e4fe]/30 rounded-xl transition-all" href="#">
          <span className="material-symbols-outlined">logout</span>
          <span className="text-sm font-medium">Logout</span>
        </a>
      </div>
    </aside>
  );
}