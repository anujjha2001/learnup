
"use client";

import React from "react";

export interface ProgressItem {
  title: string;
  cat: string;
  progress: number;
  lectures: string;
  level: string;
  levelColor: string;
  img: string;
  description: string;
}

const DEFAULT_TRACKS: ProgressItem[] = [
  {
    title: "Full-Stack Next.js Enterprise Hub",
    cat: "Frontend Dev",
    progress: 90,
    lectures: "48 Modules",
    level: "Advanced",
    levelColor: "text-red-400 bg-red-950/20 border-red-900/30",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80",
    description: "Deep dive into app router architecture, Server Components execution flow, and edge rendering pipelines."
  },
  {
    title: "Machine Learning Operational Scaling (ML Ops)",
    cat: "LLMOps Grid",
    progress: 65,
    lectures: "36 Modules",
    level: "Intermediate",
    levelColor: "text-amber-400 bg-amber-950/20 border-amber-900/30",
    img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=400&q=80",
    description: "Deploy and optimize high-concurrency model validation clusters and real-time inference routing."
  },
  {
    title: "Cloud Architecture & Kubernetes Grid",
    cat: "Cloud Arch",
    progress: 48,
    lectures: "52 Modules",
    level: "Expert",
    levelColor: "text-purple-400 bg-purple-950/20 border-purple-900/30",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
    description: "Architect multi-region active-active cloud nodes and automated container scaling groups."
  }
];

export default function TrackProgress() {
  const widthClasses: { [key: number]: string } = {
    90: "w-[90%]",
    65: "w-[65%]",
    48: "w-[48%]"
  };

  return (
    <section className="py-16 px-6 md:px-16 max-w-[1280px] mx-auto space-y-8 animate-fadeIn">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Active Progress Tracking Tracks
        </h2>
        <p className="text-sm text-neutral-400">
          Monitor real-time progress diagnostics across core certified architecture syllabus nodes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-2 sm:px-0">
        {DEFAULT_TRACKS.map((track, i) => (
          <div
            key={i}
            className="bg-[#0A0A0A] rounded-2xl overflow-hidden border border-[#2A2A2A] shadow-lg shadow-purple-950/5 hover:shadow-purple-500/10 hover:-translate-y-2 transform transition-all duration-300 group flex flex-col justify-between text-white"
          >
            <div>
              {/* Image Container with Hover Scale */}
              <div className="relative h-44 bg-neutral-900 overflow-hidden">
                <img
                  src={track.img}
                  alt={track.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-[#0A0A0A]/90 backdrop-blur-md px-3 py-0.5 rounded-full text-[11px] font-bold text-white shadow-sm border border-[#2A2A2A]">
                  {track.cat}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold font-mono text-neutral-400">
                    {track.lectures}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${track.levelColor}`}
                  >
                    {track.level}
                  </span>
                </div>

                <h3 className="font-bold text-base text-white leading-snug group-hover:text-[#8b5cf6] transition-colors line-clamp-2 min-h-[3rem]">
                  {track.title}
                </h3>
                <p className="text-xs text-neutral-400 line-clamp-2">
                  {track.description}
                </p>

                {/* Styled Completion Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-neutral-400">Track Progress</span>
                    <span className="text-[#8b5cf6] font-bold">{track.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden shimmer-progress relative">
                    <div
                      className={`h-full bg-gradient-to-r from-[#8b5cf6] to-[#f97316] rounded-full ${widthClasses[track.progress] || "w-0"}`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm flex items-center justify-center gap-1 cursor-pointer">
                Resume Course Grid <span className="material-symbols-outlined text-sm select-none">chevron_right</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
