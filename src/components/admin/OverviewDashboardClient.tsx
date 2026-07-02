"use client";

import React, { useState, useTransition, useEffect } from "react";
import { 
  Users, 
  Hourglass, 
  BookOpen, 
  Activity, 
  Cpu, 
  HardDrive, 
  Database, 
  Server,
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
  Check,
  X
} from "lucide-react";
import { approveInstructor, rejectInstructor, deleteCourse } from "@/app/actions/admin";

interface OverviewDashboardClientProps {
  initialInstructors: any[];
  initialCourses: any[];
  systemMetrics: any[];
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Cpu,
  HardDrive,
  Database,
  Server,
};

export default function OverviewDashboardClient({
  initialInstructors,
  initialCourses,
  systemMetrics
}: OverviewDashboardClientProps) {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [instructors, setInstructors] = useState(initialInstructors);
  const [courses, setCourses] = useState(initialCourses);
  const [isPending, startTransition] = useTransition();

  // Logs for Platform Status mock console
  const [logs, setLogs] = useState<string[]>([]);
  useEffect(() => {
    if (activeCard === "status") {
      setLogs([
        `[${new Date().toLocaleTimeString()}] System telemetry initialized.`,
        `[${new Date().toLocaleTimeString()}] Prisma DB Client pool active.`,
        `[${new Date().toLocaleTimeString()}] Real-time sync gateway established.`,
      ]);
      const interval = setInterval(() => {
        const fakeLogs = [
          "DB query round-trip: 4ms.",
          "Session validation token check complete.",
          "Supabase realtime heartbeat acknowledged.",
          "Cache eviction cycle skipped - 0 keys stale.",
          "Edge network latency optimized (pop: local).",
        ];
        const randomLog = fakeLogs[Math.floor(Math.random() * fakeLogs.length)];
        setLogs(prev => [...prev.slice(-8), `[${new Date().toLocaleTimeString()}] ${randomLog}`]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeCard]);

  // Counts
  const totalInstructorsCount = instructors.length;
  const pendingApprovalsCount = instructors.filter(i => i.status === "PENDING").length;
  const activeCoursesCount = courses.length;

  const handleApprove = (id: string) => {
    startTransition(async () => {
      const res = await approveInstructor(id);
      if (res.success) {
        setInstructors(prev => prev.map(inst => inst.id === id ? { ...inst, status: "APPROVED" } : inst));
      }
    });
  };

  const handleReject = (id: string) => {
    startTransition(async () => {
      const res = await rejectInstructor(id);
      if (res.success) {
        setInstructors(prev => prev.map(inst => inst.id === id ? { ...inst, status: "REJECTED" } : inst));
      }
    });
  };

  const handleDeleteCourse = (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this course?")) return;
    startTransition(async () => {
      const res = await deleteCourse(id);
      if (res.success) {
        setCourses(prev => prev.filter(c => c.id !== id));
      }
    });
  };

  const stats = [
    {
      id: "instructors",
      label: "Total Instructors",
      value: totalInstructorsCount,
      icon: Users,
      color: "text-purple-400 border-purple-500/20 bg-purple-600/5",
      glowColor: "bg-purple-600/10",
      activeBorder: "border-purple-500 ring-2 ring-purple-500/20"
    },
    {
      id: "pending",
      label: "Pending Approvals",
      value: pendingApprovalsCount,
      icon: Hourglass,
      color: "text-amber-400 border-amber-500/20 bg-amber-600/5",
      glowColor: "bg-amber-600/10",
      activeBorder: "border-amber-500 ring-2 ring-amber-500/20",
      pulse: pendingApprovalsCount > 0
    },
    {
      id: "courses",
      label: "Active Courses",
      value: activeCoursesCount,
      icon: BookOpen,
      color: "text-teal-400 border-teal-500/20 bg-teal-600/5",
      glowColor: "bg-teal-600/10",
      activeBorder: "border-teal-500 ring-2 ring-teal-500/20"
    },
    {
      id: "status",
      label: "Platform Status",
      value: "Operational",
      icon: Activity,
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-600/5",
      glowColor: "bg-emerald-600/10",
      activeBorder: "border-emerald-500 ring-2 ring-emerald-500/20",
      pulse: true
    }
  ];

  return (
    <div className="space-y-8">
      {/* Interactive Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isActive = activeCard === stat.id;
          return (
            <button
              key={stat.id}
              onClick={() => setActiveCard(isActive ? null : stat.id)}
              className={`relative overflow-hidden p-6 rounded-2xl border text-left transition-all duration-300 backdrop-blur-md outline-none cursor-pointer w-full ${
                isActive 
                  ? `${stat.activeBorder} bg-slate-900` 
                  : "border-white/8 bg-[rgba(10,10,18,0.7)] hover:border-white/18"
              } group`}
            >
              {/* Background glow */}
              <div className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full ${stat.glowColor} blur-2xl group-hover:scale-150 transition-transform duration-500`} />
              
              <div className="flex items-center justify-between mb-4">
                <span className="lu-stat-label">{stat.label}</span>
                <div className={`p-2.5 rounded-xl border border-white/5 bg-white/5 ${stat.color}`}>
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
            </button>
          );
        })}
      </div>

      {/* DYNAMIC METRIC VIEWS */}
      <div className="transition-all duration-300">
        
        {/* VIEW: default (System Telemetry & Security Console) */}
        {activeCard === null && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="lg:col-span-2 lu-card-static p-6 space-y-6">
              <h3 className="text-base font-bold text-slate-100">System Telemetry</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemMetrics.map((metric, index) => {
                  const IconComponent = iconMap[metric.icon] || Cpu;
                  return (
                    <div key={index} className="flex items-center space-x-4 p-4 rounded-xl bg-black/50 border border-white/6">
                      <div className="p-2.5 rounded-xl bg-white/5 text-purple-400">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="lu-caption">{metric.name}</p>
                        <p className="text-slate-100 font-bold text-sm mt-0.5">{metric.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lu-card-static p-6 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-100 mb-2">Security Console</h3>
                <p className="lu-caption leading-relaxed">
                  Sessions are fully cryptographically validated on the server. Dynamic role guards prevent non-administrators from bypassing the gateway routing scope.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[rgba(139,92,246,0.06)] border border-[rgba(139,92,246,0.15)] text-violet-300 text-xs flex items-center space-x-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                <span className="font-semibold uppercase tracking-wider">RBAC Guards Enabled</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: Total Instructors */}
        {activeCard === "instructors" && (
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 p-6 rounded-3xl space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-200">Live Instructors Directory</h3>
                <p className="text-xs text-slate-400 mt-1">Full registry of registered educators on the platform.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-xs font-semibold">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 text-sm">
                  {instructors.map((inst) => (
                    <tr key={inst.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">{inst.name}</td>
                      <td className="py-3.5 px-4 text-slate-400">{inst.email}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold border ${
                          inst.status === "APPROVED" 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                            : inst.status === "REJECTED" 
                            ? "bg-red-500/10 text-red-400 border-red-500/20" 
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"
                        }`}>
                          {inst.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-500 text-xs">
                        {new Date(inst.createdAt).toISOString().split("T")[0]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW: Pending Approvals */}
        {activeCard === "pending" && (
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 p-6 rounded-3xl space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-slate-200">Pending Approvals Queue</h3>
              <p className="text-xs text-slate-400 mt-1">Review onboarding requests from prospective instructors.</p>
            </div>

            {instructors.filter(i => i.status === "PENDING").length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <CheckCircle className="w-12 h-12 text-emerald-500/80 animate-bounce" />
                <div>
                  <h4 className="text-slate-200 font-bold">Queue Completely Clear</h4>
                  <p className="text-xs text-slate-500 mt-1">No instructors are currently awaiting approval review.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-xs font-semibold">
                      <th className="py-3 px-4">Instructor</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role Request</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300 text-sm">
                    {instructors.filter(i => i.status === "PENDING").map((inst) => (
                      <tr key={inst.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-white">{inst.name}</td>
                        <td className="py-3.5 px-4 text-slate-400">{inst.email}</td>
                        <td className="py-3.5 px-4 text-amber-400 text-xs font-bold uppercase tracking-wider">Instructor</td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              disabled={isPending}
                              onClick={() => handleApprove(inst.id)}
                              className="p-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              disabled={isPending}
                              onClick={() => handleReject(inst.id)}
                              className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* VIEW: Active Courses */}
        {activeCard === "courses" && (
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 p-6 rounded-3xl space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-slate-200">Active Platform Courses</h3>
              <p className="text-xs text-slate-400 mt-1">Review active syllabus modules deployed on the system.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-xs font-semibold">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Instructor</th>
                    <th className="py-3 px-4">Pricing</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 text-sm">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">{course.title}</td>
                      <td className="py-3.5 px-4 text-slate-400">{course.instructor?.name || "System"}</td>
                      <td className="py-3.5 px-4 text-teal-400 font-bold">${course.price || "199"}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          disabled={isPending}
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW: Platform Status */}
        {activeCard === "status" && (
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 p-6 rounded-3xl space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-slate-200">System Gateway Diagnostic Console</h3>
              <p className="text-xs text-slate-400 mt-1">Active status diagnostics and microservice telemetry checks.</p>
            </div>

            {/* Microservice health indicators */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-black border border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">SQLite Database</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">ONLINE</span>
              </div>
              <div className="p-4 rounded-2xl bg-black border border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">Realtime Client</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">ACTIVE</span>
              </div>
              <div className="p-4 rounded-2xl bg-black border border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">Auth Gateway</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">SECURE</span>
              </div>
              <div className="p-4 rounded-2xl bg-black border border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">Edge Servers</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">99.98%</span>
              </div>
            </div>

            {/* Diagnostic Logs terminal console */}
            <div className="bg-black/90 p-5 rounded-2xl border border-white/10 font-mono text-xs text-slate-300 space-y-2 h-60 overflow-y-auto shadow-inner">
              <div className="text-teal-400 font-semibold uppercase tracking-wider mb-2">--- Live Stream Logs ---</div>
              {logs.map((log, index) => (
                <div key={index} className="animate-fadeIn">{log}</div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
