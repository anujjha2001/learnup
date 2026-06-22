"use client";

import React from "react";

export default function TimeAllocationChart() {
  const heights = [30, 45, 70, 90, 60, 85, 100];
  
  return (
    <div className="h-44 flex items-end justify-between gap-2 pt-4">
      {heights.map((h, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
          <div 
            className="w-full bg-[#8a4cfc] rounded-t-md transition-all duration-500 hover:bg-[#3525cd]" 
            style={{ height: `${h}%` }}
          ></div>
          <span className="text-[10px] text-[#464555] font-bold">M{i + 1}</span>
        </div>
      ))}
    </div>
  );
}