"use client";

import React, { useState } from "react";

export default function StudentDashboard() {
  // Navigation tabs state matching the requested separate screens
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "courses" | "analytics" | "resources" | "certificates" | "settings"
  >("dashboard");

  // Search input state
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen w-full bg-[#f8f9ff] text-[#0b1c30] font-sans antialiased overflow-hidden">
      {/* Dynamic Material Symbols Injector */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* Global CSS Injector for Smooth Content Fades */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}} />

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 flex flex-col h-full bg-[#eff4ff] border-r border-[#c7c4d8]/20 shadow-md sticky left-0 top-0 z-50 p-4 gap-2">
        <div className="flex items-center gap-4 px-2 py-4 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#3525cd] flex items-center justify-center text-white font-bold shadow-sm">
            L
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#3525cd] leading-none">LearnUp</h1>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
          {/* Dashboard Tab */}
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full rounded-xl font-bold flex items-center gap-4 px-4 py-3 transition-all duration-200 active:scale-95 ${
              activeTab === "dashboard"
                ? "bg-[#8a4cfc] text-[#fffbff] translate-x-1 shadow-md"
                : "text-[#464555] hover:bg-[#d3e4fe]/30 hover:translate-x-1"
            }`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm tracking-wide">Dashboard</span>
          </button>

          {/* Courses Tab */}
          <button
            onClick={() => setActiveTab("courses")}
            className={`w-full rounded-xl font-bold flex items-center gap-4 px-4 py-3 transition-all duration-200 active:scale-95 ${
              activeTab === "courses"
                ? "bg-[#8a4cfc] text-[#fffbff] translate-x-1 shadow-md"
                : "text-[#464555] hover:bg-[#d3e4fe]/30 hover:translate-x-1"
            }`}
          >
            <span className="material-symbols-outlined">menu_book</span>
            <span className="text-sm tracking-wide">Courses</span>
          </button>

          {/* Analytics Tab */}
          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full rounded-xl font-bold flex items-center gap-4 px-4 py-3 transition-all duration-200 active:scale-95 ${
              activeTab === "analytics"
                ? "bg-[#8a4cfc] text-[#fffbff] translate-x-1 shadow-md"
                : "text-[#464555] hover:bg-[#d3e4fe]/30 hover:translate-x-1"
            }`}
          >
            <span className="material-symbols-outlined">bar_chart</span>
            <span className="text-sm tracking-wide">Analytics</span>
          </button>

          {/* Resources Tab */}
          <button
            onClick={() => setActiveTab("resources")}
            className={`w-full rounded-xl font-bold flex items-center gap-4 px-4 py-3 transition-all duration-200 active:scale-95 ${
              activeTab === "resources"
                ? "bg-[#8a4cfc] text-[#fffbff] translate-x-1 shadow-md"
                : "text-[#464555] hover:bg-[#d3e4fe]/30 hover:translate-x-1"
            }`}
          >
            <span className="material-symbols-outlined">folder_open</span>
            <span className="text-sm tracking-wide">Resources</span>
          </button>

          {/* Certificates Tab */}
          <button
            onClick={() => setActiveTab("certificates")}
            className={`w-full rounded-xl font-bold flex items-center gap-4 px-4 py-3 transition-all duration-200 active:scale-95 ${
              activeTab === "certificates"
                ? "bg-[#8a4cfc] text-[#fffbff] translate-x-1 shadow-md"
                : "text-[#464555] hover:bg-[#d3e4fe]/30 hover:translate-x-1"
            }`}
          >
            <span className="material-symbols-outlined">verified</span>
            <span className="text-sm tracking-wide">Certificates</span>
          </button>

          {/* Settings Tab */}
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full rounded-xl font-bold flex items-center gap-4 px-4 py-3 transition-all duration-200 active:scale-95 ${
              activeTab === "settings"
                ? "bg-[#8a4cfc] text-[#fffbff] translate-x-1 shadow-md"
                : "text-[#464555] hover:bg-[#d3e4fe]/30 hover:translate-x-1"
            }`}
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm tracking-wide">Settings</span>
          </button>

          <div className="mt-8 pt-8 border-t border-[#c7c4d8]/20">
            <button className="w-full bg-[#3525cd] text-white py-3 px-4 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all hover:bg-[#4d44e3]">
              Upgrade Pro
            </button>
          </div>
        </nav>

        <div className="mt-auto flex flex-col gap-2 pt-4">
          <a className="text-[#464555] flex items-center gap-4 px-4 py-2 hover:bg-[#d3e4fe]/30 rounded-xl transition-all" href="#">
            <span className="material-symbols-outlined">contact_support</span>
            <span className="text-sm font-medium">Help Center</span>
          </a>
          <a className="text-[#464555] flex items-center gap-4 px-4 py-2 hover:bg-[#d3e4fe]/30 rounded-xl transition-all" href="#">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Logout</span>
          </a>
        </div>
      </aside>

      {/* MAIN CONTAINER AREA */}
      <main className="flex-1 overflow-y-auto scroll-smooth flex flex-col justify-between">
        
        {/* TOP NAVBAR */}
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

        {/* CONTROLLABLE SCREENS SWITCH CONTAINER */}
        <div className="p-8 max-w-[1280px] w-full mx-auto space-y-8 flex-1">
          
          {/* SCREEN 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fadeIn">
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold tracking-tight text-[#0b1c30] mb-1">Welcome back, Anuj</h2>
                  <p className="text-lg text-[#464555] max-w-xl">You&apos;re making great progress. You&apos;ve completed 82% of your &quot;Advanced UX Architecture&quot; track this week.</p>
                </div>
                {/* Learning Streak Card */}
                <div className="bg-white/80 backdrop-blur-md border border-black/5 p-6 rounded-2xl flex items-center justify-between relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="z-10">
                    <p className="text-xs font-bold text-[#712ae2] uppercase tracking-wider mb-1">Learning Streak</p>
                    <h3 className="text-5xl font-bold text-[#3525cd] leading-tight">14 <span className="text-xl font-semibold">Days</span></h3>
                    <p className="text-sm text-[#464555] mt-1">Keep it up to reach Gold tier!</p>
                  </div>
                  {/* Streak Flame Icon */}
                  <div className="absolute -right-4 -bottom-4 transition-transform group-hover:scale-110 duration-500 text-[#3525cd]/10">
                    <span className="material-symbols-outlined !text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      local_fire_department
                    </span>
                  </div>
                </div>
              </section>

              {/* Bento Stat Grid with Pop-up Effects */}
              <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Total Courses", val: "12", icon: "menu_book", bg: "bg-[#3525cd]/10 text-[#3525cd]" },
                  { label: "Certificates", val: "5", icon: "verified", bg: "bg-[#712ae2]/10 text-[#712ae2]" },
                  { label: "Weekly Hours", val: "18.4", icon: "schedule", bg: "bg-[#a44100]/20 text-[#7e3000]" },
                  { label: "Completion Rate", val: "82%", icon: "analytics", bg: "bg-[#ffdad6] text-[#ba1a1a]" },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-[#c7c4d8]/10 hover:shadow-xl hover:-translate-y-2 transform transition-all duration-300 cursor-pointer group">
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                      <span className="material-symbols-outlined">{stat.icon}</span>
                    </div>
                    <p className="text-sm text-[#464555] font-medium">{stat.label}</p>
                    <h4 className="text-2xl font-bold text-[#0b1c30] mt-1">{stat.val}</h4>
                  </div>
                ))}
              </section>

              {/* Grid Content Column Stream */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">Continue Learning</h3>
                    <button onClick={() => setActiveTab("courses")} className="text-[#3525cd] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                      View Library <span className="material-symbols-outlined text-md">arrow_forward</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Course 1 */}
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#c7c4d8]/10 hover:shadow-xl hover:-translate-y-2 transform transition-all duration-300 group">
                      <div className="relative h-48 bg-slate-200 overflow-hidden">
                        <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80" alt="UI/UX course" />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#0b1c30]">UI/UX Design</div>
                      </div>
                      <div className="p-6 space-y-4">
                        <h4 className="text-lg font-bold text-[#0b1c30] leading-tight">Advanced Design Systems for Enterprise</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-[#464555]">Progress</span>
                            <span className="text-[#3525cd]">64%</span>
                          </div>
                          <div className="h-2 w-full bg-[#e5eeff] rounded-full overflow-hidden">
                            <div className="h-full w-[64%] bg-gradient-to-r from-[#3525cd] to-[#712ae2] rounded-full"></div>
                          </div>
                        </div>
                        <button className="w-full bg-[#4f46e5] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#3525cd] transition-all active:scale-95 shadow-sm">Continue</button>
                      </div>
                    </div>

                    {/* Course 2 */}
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#c7c4d8]/10 hover:shadow-xl hover:-translate-y-2 transform transition-all duration-300 group">
                      <div className="relative h-48 bg-slate-200 overflow-hidden">
                        <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80" alt="Backend Dev course" />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#0b1c30]">Backend Dev</div>
                      </div>
                      <div className="p-6 space-y-4">
                        <h4 className="text-lg font-bold text-[#0b1c30] leading-tight">Scalable Architecture with Python & AWS</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-[#464555]">Progress</span>
                            <span className="text-[#3525cd]">42%</span>
                          </div>
                          <div className="h-2 w-full bg-[#e5eeff] rounded-full overflow-hidden">
                            <div className="h-full w-[42%] bg-gradient-to-r from-[#3525cd] to-[#712ae2] rounded-full"></div>
                          </div>
                        </div>
                        <button className="w-full bg-[#4f46e5] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#3525cd] transition-all active:scale-95 shadow-sm">Continue</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side Sticky components */}
                <div className="xl:col-span-4 space-y-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c7c4d8]/10">
                    <h3 className="text-lg font-bold mb-4">Upcoming Deadlines</h3>
                    <div className="space-y-3">
                      <div className="flex gap-4 p-3 hover:bg-[#eff4ff] rounded-xl transition-all border border-transparent hover:border-[#c7c4d8]/10 items-center">
                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-[#ffdad6] text-[#ba1a1a] rounded-xl font-bold text-xs">
                          <span>NOV</span><span className="text-base">24</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-[#0b1c30] text-sm">Final UX Case Study</p>
                          <p className="text-xs text-[#464555]">Advanced Design Systems</p>
                        </div>
                      </div>
                      <div className="flex gap-4 p-3 hover:bg-[#eff4ff] rounded-xl transition-all border border-transparent hover:border-[#c7c4d8]/10 items-center">
                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-[#e2dfff] text-[#3525cd] rounded-xl font-bold text-xs">
                          <span>NOV</span><span className="text-base">28</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-[#0b1c30] text-sm">API Integration Quiz</p>
                          <p className="text-xs text-[#464555]">AWS & Python Scalability</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: COURSES (With Pop-up Effects and Full High-Res Images) */}
          {activeTab === "courses" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">My Enrolled Courses</h2>
                  <p className="text-sm text-[#464555]">Track, browse, and continue your technical deep dives.</p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-[#3525cd] text-white px-4 py-2 rounded-xl text-sm font-bold">All Courses</button>
                  <button className="bg-white text-[#0b1c30] border border-[#c7c4d8]/30 px-4 py-2 rounded-xl text-sm font-medium">In Progress</button>
                  <button className="bg-white text-[#0b1c30] border border-[#c7c4d8]/30 px-4 py-2 rounded-xl text-sm font-medium">Completed</button>
                </div>
              </div>

              {/* Grid with pop-up transformations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Advanced Design Systems for Enterprise", cat: "UI/UX Design", progress: 64, img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80" },
                  { title: "Scalable Architecture with Python & AWS", cat: "Backend Dev", progress: 42, img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80" },
                  { title: "Next.js 15 & Tailwind CSS Production Architecture", cat: "Frontend Dev", progress: 90, img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80" },
                  { title: "Data Structures & Enterprise Algorithms", cat: "Computer Science", progress: 15, img: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=800&q=80" },
                  { title: "SAP ABAP & Fiori Cloud Extensions", cat: "Enterprise ERP", progress: 0, img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" },
                  { title: "Product Strategy & Technical Leadership", cat: "Management", progress: 0, img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" },
                ].map((course, idx) => (
                  <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#c7c4d8]/20 hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300 group cursor-pointer">
                    <div className="relative h-44 bg-slate-100 overflow-hidden">
                      <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={course.img} alt={course.title} />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-0.5 rounded-full text-xs font-bold text-[#0b1c30] shadow-sm">{course.cat}</div>
                    </div>
                    <div className="p-5 space-y-4">
                      <h4 className="text-base font-bold text-[#0b1c30] line-clamp-2 min-h-[3rem] group-hover:text-[#3525cd] transition-colors">{course.title}</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-[#464555]">Completion Status</span>
                          <span className="text-[#3525cd]">{course.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#e5eeff] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#3525cd] to-[#8a4cfc]" style={{ width: `${course.progress}%` }}></div>
                        </div>
                      </div>
                      <button className="w-full bg-[#eff4ff] text-[#3525cd] hover:bg-[#3525cd] hover:text-white py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm">
                        {course.progress > 0 ? "Resume Course" : "Start Learning"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCREEN 3: ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold">Performance Analytics</h2>
                <p className="text-sm text-[#464555]">Deep metrics regarding your retention, study speeds, and benchmark rankings.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-[#c7c4d8]/20 shadow-sm space-y-4">
                  <h3 className="font-bold text-[#0b1c30]">Time Allocation</h3>
                  <div className="h-40 flex items-end justify-between gap-2 pt-4">
                    {[30, 45, 70, 90, 60, 85, 100].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-[#8a4cfc] rounded-t-md transition-all duration-500" style={{ height: `${h}%` }}></div>
                        <span className="text-[10px] text-[#464555] font-bold">M{i+1}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-[#464555] text-center">Velocity spikes show peak engineering focus over weekends.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#c7c4d8]/20 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-[#0b1c30] mb-2">Skill Matrix Distribution</h3>
                    <p className="text-xs text-[#464555]">Your technical assessment results normalized against tier performance criteria.</p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { skill: "Frontend Architecture", score: "92%" },
                      { skill: "Data System Management", score: "78%" },
                      { skill: "Cloud Deployments", score: "60%" },
                    ].map((s, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span>{s.skill}</span>
                          <span className="text-[#8a4cfc]">{s.score}</span>
                        </div>
                        <div className="h-2 w-full bg-[#e5eeff] rounded-full overflow-hidden">
                          <div className="h-full bg-[#8a4cfc]" style={{ width: s.score }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#c7c4d8]/20 shadow-sm space-y-4">
                  <h3 className="font-bold text-[#0b1c30]">Milestones Checked</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-[#464555]">
                      <span className="material-symbols-outlined text-green-500">check_circle</span>
                      <span>Completed 4 Mock Technical Interviews</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#464555]">
                      <span className="material-symbols-outlined text-green-500">check_circle</span>
                      <span>Passed Advanced AWS Deployment Suite</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#464555]">
                      <span className="material-symbols-outlined text-orange-500">pending</span>
                      <span>Pending Verification: System UI Architecture Case Study</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 4: RESOURCES */}
          {activeTab === "resources" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold">Shared Student Resources</h2>
                <p className="text-sm text-[#464555]">Downloadable starter files, design systems, boilerplate codebases, and reading packets.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Enterprise-UI-Kit-v2.fig", size: "48.2 MB", desc: "Complete UI tokens and component architectures for the Figma UX Track.", icon: "draw" },
                  { name: "AWS-Deployment-Scripts-CloudFormation.zip", size: "4.1 MB", desc: "Production templates for scaling automated microservices safely.", icon: "terminal" },
                  { name: "Python-DataStructures-Handout.pdf", size: "12.8 MB", desc: "Core reference layouts for high-performance algorithm design patterns.", icon: "description" },
                  { name: "Fiori-Design-Guidelines-Summary.pdf", size: "6.5 MB", desc: "Cheat sheets for modern enterprise layouts and components.", icon: "menu_book" },
                ].map((res, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-[#c7c4d8]/20 flex items-start gap-4 hover:shadow-md transition-all">
                    <div className="p-3 rounded-xl bg-[#3525cd]/10 text-[#3525cd]">
                      <span className="material-symbols-outlined">{res.icon}</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-bold text-sm text-[#0b1c30]">{res.name}</h4>
                      <p className="text-xs text-[#464555] line-clamp-2">{res.desc}</p>
                      <p className="text-[11px] text-[#777587] font-semibold">{res.size}</p>
                    </div>
                    <button className="p-2 text-[#3525cd] hover:bg-[#eff4ff] rounded-full transition-all">
                      <span className="material-symbols-outlined">download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCREEN 5: CERTIFICATES */}
          {activeTab === "certificates" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold">Verified Certificates</h2>
                <p className="text-sm text-[#464555]">Display, download, and share your earned accomplishments directly to LinkedIn.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "Foundation of UI Design Certification", id: "LUP-9831A", date: "Jan 14, 2026" },
                  { title: "Advanced Architecture Masterclass", id: "LUP-0042B", date: "Mar 22, 2026" },
                ].map((cert, idx) => (
                  <div key={idx} className="bg-white border-2 border-dashed border-[#c7c4d8]/40 p-6 rounded-2xl flex flex-col justify-between space-y-6 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] bg-[#eaddff] text-[#25005a] font-bold px-2 py-0.5 rounded-full">VERIFIED ID: {cert.id}</span>
                        <h4 className="text-lg font-bold text-[#0b1c30] mt-2">{cert.title}</h4>
                        <p className="text-xs text-[#464555] mt-1">Issued securely by LearnUp Accreditation Board</p>
                      </div>
                      <span className="material-symbols-outlined text-[#8a4cfc] text-4xl">workspace_premium</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-[#c7c4d8]/10 text-xs">
                      <span className="text-[#777587]">Issued {cert.date}</span>
                      <div className="flex gap-2">
                        <button className="text-[#3525cd] font-bold hover:underline flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">share</span> Share
                        </button>
                        <button className="bg-[#3525cd] text-white px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-[#4d44e3]">
                          PDF Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCREEN 6: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fadeIn bg-white p-8 rounded-2xl border border-[#c7c4d8]/20 shadow-sm">
              <div>
                <h2 className="text-2xl font-bold">Account Profiles & Settings</h2>
                <p className="text-sm text-[#464555]">Manage your personal system preferences, platform notifications, and profile details.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#c7c4d8]/10">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase text-[#712ae2] tracking-wider">Profile Information</h3>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#464555]">Full Name</label>
                    <input className="w-full bg-[#f8f9ff] border border-[#c7c4d8]/40 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#3525cd]" type="text" defaultValue="Anuj Jha" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#464555]">Email Address</label>
                    <input className="w-full bg-[#f8f9ff] border border-[#c7c4d8]/40 rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#3525cd]" type="email" defaultValue="anuj.jha@example.com" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase text-[#712ae2] tracking-wider">Dashboard Configurations</h3>
                  <div className="flex items-center justify-between p-3 bg-[#f8f9ff] rounded-xl">
                    <div>
                      <p className="text-sm font-bold">Email Notifications</p>
                      <p className="text-xs text-[#464555]">Receive direct updates on scheduled modular tracking tests.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded text-[#3525cd] focus:ring-[#3525cd]" />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="bg-[#3525cd] text-white py-2 px-6 rounded-xl font-bold text-sm hover:bg-[#4d44e3] transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <footer className="bg-[#e5eeff] border-t border-[#c7c4d8]/20 mt-12">
          <div className="max-w-[1280px] mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-lg font-bold text-[#3525cd]">LearnUp</span>
              <p className="text-xs text-[#464555]">© 2026 LearnUp LMS. All rights reserved.</p>
            </div>
            <div className="flex gap-6 text-xs font-medium text-[#464555]">
              <a className="hover:text-[#3525cd] hover:underline transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-[#3525cd] hover:underline transition-colors" href="#">Terms of Service</a>
              <a className="hover:text-[#3525cd] hover:underline transition-colors" href="#">Support Desk</a>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}