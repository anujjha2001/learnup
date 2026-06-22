"use client";

import React from "react";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({ searchQuery, setSearchQuery }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#f8f9ff]/80 backdrop-blur-xl border-b border-[#c7c4d8]/20 h-16 flex justify-between items-center px-8 shadow-sm">
      <div className="flex items-center gap-6">
        <div className="relative w-96 max-w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777587]">search</span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-[#eff4ff] border-none rounded-full text-base focus:ring-2 focus:ring-[#3525cd]/20 transition-all text-[#0b1c30] placeholder-[#777587]"
            placeholder="Search courses, modules, records..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-[#464555] hover:bg-[#d3e4fe]/50 rounded-full transition-all relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
        </button>
        <div className="w-[1px] h-6 bg-[#c7c4d8]/30 mx-2"></div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-bold text-[#0b1c30] text-sm leading-tight">Anuj Jha</p>
            <p className="text-[11px] text-[#464555] font-medium">Student • Level 24</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-[#3525cd]/20 bg-[#3525cd] flex items-center justify-center text-white font-bold shadow-sm">
            AJ
          </div>
        </div>
      </div>
    </header>
  );
}