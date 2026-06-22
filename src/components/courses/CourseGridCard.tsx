import React from "react";
import { CourseItem } from "@/types/dashboard";

export default function CourseGridCard({ title, cat, progress, img }: CourseItem) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#c7c4d8]/20 hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300 group cursor-pointer">
      <div className="relative h-44 bg-slate-100 overflow-hidden">
        <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={img} alt={title} />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-0.5 rounded-full text-xs font-bold text-[#0b1c30] shadow-sm">{cat}</div>
      </div>
      <div className="p-5 space-y-4">
        <h4 className="text-base font-bold text-[#0b1c30] line-clamp-2 min-h-[3rem] group-hover:text-[#3525cd] transition-colors">{title}</h4>
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-[#464555]">Completion Status</span>
            <span className="text-[#3525cd]">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-[#e5eeff] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#3525cd] to-[#8a4cfc]" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <button className="w-full bg-[#eff4ff] text-[#3525cd] hover:bg-[#3525cd] hover:text-white py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm">
          {progress > 0 ? "Resume Course" : "Start Learning"}
        </button>
      </div>
    </div>
  );
}