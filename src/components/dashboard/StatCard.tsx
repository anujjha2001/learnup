"use client";

import React from "react";
// FIXED: Removed broken space and set exact relative path to types
import { StatItem } from "@/types/dashboard";

export default function StatCard({ label, val, icon, bg }: StatItem) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c7c4d8]/10 hover:shadow-xl hover:-translate-y-2 transform transition-all duration-300 cursor-pointer group">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <p className="text-sm text-[#464555] font-medium">{label}</p>
      <h4 className="text-2xl font-bold text-[#0b1c30] mt-1">{val}</h4>
    </div>
  );
}