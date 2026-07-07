import React from "react";
import { Users, Hourglass, BookOpen, Activity } from "lucide-react";

interface MetricCardsProps {
  totalInstructors: number;
  pendingApprovals: number;
  activeCourses: number;
  platformStatus: string;
}

export default function MetricCards({
  totalInstructors,
  pendingApprovals,
  activeCourses,
  platformStatus
}: MetricCardsProps) {
  const stats = [
    {
      label: "Total Instructors",
      value: totalInstructors,
      icon: Users,
      color: "text-purple-400",
      bgGlow: "bg-purple-600/10",
      borderColor: "hover:border-purple-500/30",
    },
    {
      label: "Pending Approvals",
      value: pendingApprovals,
      icon: Hourglass,
      color: "text-amber-400",
      bgGlow: "bg-amber-600/10",
      borderColor: "hover:border-amber-500/30",
      pulse: pendingApprovals > 0,
    },
    {
      label: "Active Courses",
      value: activeCourses,
      icon: BookOpen,
      color: "text-teal-400",
      bgGlow: "bg-teal-600/10",
      borderColor: "hover:border-teal-500/30",
    },
    {
      label: "Platform Status",
      value: platformStatus,
      icon: Activity,
      color: "text-emerald-400",
      bgGlow: "bg-emerald-600/10",
      borderColor: "hover:border-emerald-500/30",
      pulse: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className={`relative overflow-hidden bg-slate-900/50 backdrop-blur-md border border-white/10 p-6 rounded-3xl transition-all duration-300 ${stat.borderColor} group`}
          >
            {/* Background glow effects */}
            <div className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full ${stat.bgGlow} blur-2xl group-hover:scale-150 transition-transform duration-500`} />
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                {stat.label}
              </span>
              <div className={`p-2.5 rounded-2xl bg-white/5 border border-white/5 ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-100">
                {stat.value}
              </span>
              {stat.pulse && (
                <span className="relative flex h-2 w-2 mb-1.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    stat.color.replace("text-", "bg-")
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    stat.color.replace("text-", "bg-")
                  }`}></span>
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
