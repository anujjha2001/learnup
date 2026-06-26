"use client";

import React from "react";

type InstructorTabType =
  | "dashboard"
  | "courses"
  | "students"
  | "analytics"
  | "payments"
  | "settings";

interface InstructorSidebarProps {
  activeTab: InstructorTabType;
  setActiveTab: (tab: InstructorTabType) => void;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const TAB_CONFIG = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "courses", label: "Manage Courses", icon: "menu_book" },
  { id: "students", label: "Students Matrix", icon: "school" },
  { id: "analytics", label: "Performance Metrics", icon: "analytics" },
  { id: "payments", label: "Payout Registry", icon: "payments" },
  { id: "settings", label: "Institution Settings", icon: "settings" },
] as const;

export default function InstructorSidebar({
  activeTab,
  setActiveTab,
  onLogout,
  isOpen,
  setIsOpen,
}: InstructorSidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-45 h-screen w-64 flex flex-col bg-[#eff4ff] border-r border-[#c7c4d8]/20 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#c7c4d8]/20 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-[#3525cd] tracking-tight">LearnUp</h2>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Instructor Suite</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <span className="material-symbols-outlined select-none">close</span>
          </button>
        </div>

        {/* Navigation Tab Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {TAB_CONFIG.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as InstructorTabType);
                  setIsOpen(false); // Close sidebar on mobile
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#3525cd] text-white shadow-md shadow-[#3525cd]/15"
                    : "text-[#464555] hover:bg-white/60 hover:text-[#3525cd]"
                }`}
              >
                <span className="material-symbols-outlined text-lg select-none">{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#c7c4d8]/20">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg select-none">logout</span>
            Exit Dashboard
          </button>
        </div>
      </aside>
    </>
  );
}
