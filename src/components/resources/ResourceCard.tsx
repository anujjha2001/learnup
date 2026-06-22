"use client";

import React from "react";
// FIXED: Go 3 levels back to reach src/app/ and get types
import { ResourceItem } from "../../../types/dashboard";

export default function ResourceCard({ name, size, desc, icon }: ResourceItem) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#c7c4d8]/20 flex items-start gap-4 hover:shadow-md transition-all">
      <div className="p-3 rounded-xl bg-[#3525cd]/10 text-[#3525cd] shrink-0">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <h4 className="font-bold text-sm text-[#0b1c30] truncate">{name}</h4>
        <p className="text-xs text-[#464555] line-clamp-2">{desc}</p>
        <span className="text-[10px] text-[#8a4cfc] font-bold">{size}</span>
      </div>
    </div>
  );
}