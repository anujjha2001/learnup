import React from "react";
import type { CourseItem } from "@/types/dashboard";

export default function ContinueCourseCard({ title, cat, progress, img }: CourseItem) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#c7c4d8]/10 hover:shadow-xl hover:-translate-y-2 transform transition-all duration-300 group">
      <div className="relative h-48 bg-slate-200 overflow-hidden">
        <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={img} alt={title} />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#0b1c30]">{cat}</div>
      </div>
      <div className="p-6 space-y-4">
        <h4 className="text-lg font-bold text-[#0b1c30] leading-tight">{title}</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-[#464555]">Progress</span>
            <span className="text-[#3525cd]">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-[#e5eeff] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#3525cd] to-[#712ae2] rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <button className="w-full bg-[#4f46e5] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#3525cd] transition-all active:scale-95 shadow-sm">Continue</button>
      </div>
    </div>
  );
}