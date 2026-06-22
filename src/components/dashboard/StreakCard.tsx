import React from "react";

export default function StreakCard() {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-black/5 p-6 rounded-2xl flex items-center justify-between relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="z-10">
        <p className="text-xs font-bold text-[#712ae2] uppercase tracking-wider mb-1">Learning Streak</p>
        <h3 className="text-5xl font-bold text-[#3525cd] leading-tight">14 <span className="text-xl font-semibold">Days</span></h3>
        <p className="text-sm text-[#464555] mt-1">Keep it up to reach Gold tier!</p>
      </div>
      <div className="absolute -right-4 -bottom-4 transition-transform group-hover:scale-110 duration-500 text-[#3525cd]/10">
        <span className="material-symbols-outlined text-[120px]!" style={{ fontVariationSettings: "'FILL' 1" }}>
          local_fire_department
        </span>
      </div>
    </div>
  );
}