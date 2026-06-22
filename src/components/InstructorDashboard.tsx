"use client";

import React, { useState } from "react";

// Strict type parameters for instructor pipeline tracking
type InstructorTabType = 
  | "dashboard" 
  | "courses" 
  | "students" 
  | "analytics" 
  | "payments" 
  | "settings" 
  | "create-course";

interface InstructorDashboardProps {
  onLogout: () => void;
}

export default function InstructorDashboard({ onLogout }: InstructorDashboardProps) {
  const [activeTab, setActiveTab] = useState<InstructorTabType>("dashboard");

  // Mock milestone data with validated high-reliability Unsplash image streams
  const milestones = [
    {
      id: 1,
      name: "Felix Chen",
      action: "scored 95% on Quiz 4",
      meta: "2 mins ago • Advanced UX",
      img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Sarah Miller",
      action: "finished Module 2",
      meta: "15 mins ago • UI Masterclass",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "John Doe",
      action: "requested certification",
      meta: "1 hr ago • React Patterns",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
    },
  ];

  return (
    <div className="flex h-screen w-full bg-[#f8f9ff] text-[#0b1c30] antialiased overflow-hidden font-sans">
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}} />

      {/* 1. SIDEBAR ARCHITECTURE (EXACT LOGO & IDENTITY MATCH) */}
      <aside className="w-64 flex flex-col h-full bg-[#eff4ff] border-r border-[#c7c4d8]/20 shadow-md sticky left-0 top-0 z-50 p-4 gap-2 shrink-0">
        
        {/* BRAND IDENTITY: EXACTLY MATCHED WITH STUDENT DASHBOARD */}
        <div className="flex items-center gap-3 px-2 py-4 mb-4">
          <svg className="h-9 w-9 shrink-0 transition-transform duration-200 hover:scale-105" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#4F46E5', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#7C3AED', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <rect width="200" height="200" rx="40" fill="transparent"/>
            <path d="M60 40 V140 H140" stroke="url(#grad1)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M110 90 L140 60 L170 90" stroke="#06B6D4" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M140 60 V120" stroke="#06B6D4" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <div>
            <span className="text-2xl font-black bg-gradient-to-r from-[#3525cd] to-[#712ae2] bg-clip-text text-transparent tracking-tight block leading-none">
              LearnUp
            </span>
            <p className="text-[10px] text-[#464555] opacity-75 mt-1 font-bold uppercase tracking-widest leading-none">
              Instructor Hub
            </p>
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: "dashboard" },
            { id: "courses", label: "Courses", icon: "menu_book" },
            { id: "students", label: "Students", icon: "group" },
            { id: "analytics", label: "Analytics", icon: "bar_chart" },
            { id: "payments", label: "Payments", icon: "payments" },
            { id: "settings", label: "Settings", icon: "settings" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as InstructorTabType)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 group cursor-pointer ${
                  isActive
                    ? "bg-[#3525cd] text-[#fffbff] font-bold shadow-md shadow-[#3525cd]/20"
                    : "text-[#464555] hover:bg-[#d3e4fe]/30"
                }`}
              >
                <span className="material-symbols-outlined transition-transform group-hover:scale-110 select-none">{tab.icon}</span>
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
          
          <div className="mt-6 pt-6 border-t border-[#c7c4d8]/20">
            <button className="w-full bg-gradient-to-r from-[#3525cd] to-[#712ae2] text-white py-3 px-4 rounded-xl font-bold text-sm shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 shadow-[#3525cd]/20 cursor-pointer">
              Upgrade Pro
            </button>
          </div>
        </nav>
        
        <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-[#c7c4d8]/10">
          <button className="text-[#464555] flex items-center gap-3 px-4 py-2.5 hover:bg-[#d3e4fe]/30 rounded-xl transition-all active:scale-95 text-left w-full cursor-pointer">
            <span className="material-symbols-outlined text-sm select-none">contact_support</span>
            <span className="text-sm font-medium">Help Center</span>
          </button>
          <button
            onClick={onLogout}
            className="text-[#464555] flex items-center gap-3 px-4 py-2.5 hover:bg-[#d3e4fe]/30 rounded-xl transition-all active:scale-95 text-left w-full cursor-pointer font-semibold text-red-600/90"
          >
            <span className="material-symbols-outlined text-sm select-none">logout</span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN DATA STREAM WRAPPER */}
      <main className="flex-1 overflow-y-auto scroll-smooth flex flex-col h-screen">
        
        {/* 2. TOP NAVBAR */}
        <header className="sticky top-0 z-40 bg-[#f8f9ff]/80 backdrop-blur-xl border-b border-[#c7c4d8]/20 h-16 flex justify-between items-center px-8 shrink-0">
          <div className="flex items-center gap-6">
            <div className="relative w-96 max-w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777587] select-none">search</span>
              <input 
                type="text" 
                placeholder="Search parameters, courses, rosters..." 
                className="w-full pl-10 pr-4 py-2.5 bg-[#eff4ff] border-none rounded-full text-sm focus:ring-2 focus:ring-[#3525cd]/20 transition-all placeholder:text-[#777587]/60 outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#464555] hover:bg-[#d3e4fe]/50 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer">
              <span className="material-symbols-outlined select-none">notifications</span>
            </button>
            <div className="w-px h-6 bg-[#c7c4d8]/30 mx-1"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-[#0b1c30] leading-tight">Amit</p>
                <p className="text-[11px] text-[#464555] font-semibold opacity-80">Senior Instructor • New Dev</p>
              </div>
              <img 
                alt="Amit Profile" 
                className="w-10 h-10 rounded-full border-2 border-[#3525cd]/20 object-cover shadow-sm transition-transform hover:scale-105" 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
              />
            </div>
          </div>
        </header>

        {/* 3. DYNAMIC CONTENT SCREENS */}
        <div className="p-8 max-w-[1280px] w-full mx-auto flex-1 pb-12">
          
          {/* SCREEN: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-[#0b1c30]">Instructor Overview</h2>
                  <p className="text-[#464555] text-sm mt-1">Welcome back, Amit! Monitor real-time dynamic course matrices here.</p>
                </div>
                <button 
                  onClick={() => setActiveTab("create-course")}
                  className="bg-[#3525cd] text-white py-3 px-6 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 text-sm shadow-[#3525cd]/20 cursor-pointer"
                >
                  <span className="material-symbols-outlined select-none">add_circle</span> Create New Course
                </button>
              </div>

              {/* METRIC FACTOR CARDS */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Total Earnings", val: "$42,904.00", meta: "+12% this month", up: true, icon: "payments", color: "text-[#3525cd] bg-[#3525cd]/10" },
                  { title: "Active Students", val: "1,284", meta: "Across 8 live modules", up: false, icon: "group", color: "text-[#712ae2] bg-[#712ae2]/10" },
                  { title: "Avg Rating Matrix", val: "4.9 / 5.0", meta: "Top 2% satisfaction", up: false, icon: "star", color: "text-amber-600 bg-amber-500/10" },
                  { title: "Monthly Trajectory", val: "18.4%", meta: "Consistent scaling loop", up: true, icon: "trending_up", color: "text-[#ba1a1a] bg-[#ffdad6]" },
                ].map((card, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-[#c7c4d8]/10 transition-all hover:-translate-y-1 hover:shadow-md active:scale-[0.99] cursor-pointer">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
                      <span className="material-symbols-outlined select-none">{card.icon}</span>
                    </div>
                    <p className="text-xs font-bold text-[#464555] uppercase tracking-wider">{card.title}</p>
                    <h4 className="text-2xl font-black text-[#0b1c30] mt-1">{card.val}</h4>
                    <p className={`text-[12px] font-bold mt-1.5 flex items-center gap-1 ${card.up ? "text-green-600" : "text-[#464555]/80"}`}>
                      {card.up && <span className="material-symbols-outlined text-[14px] select-none">trending_up</span>} {card.meta}
                    </p>
                  </div>
                ))}
              </section>

              {/* BENTO GRID GRAPH & FEED */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#c7c4d8]/10 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h4 className="text-lg font-bold text-[#0b1c30]">Revenue Progression</h4>
                      <p className="text-[#464555] text-xs">Payout progression metrics for the past cycle</p>
                    </div>
                  </div>
                  <div className="relative flex-1 min-h-[240px] flex items-end justify-between gap-4 pt-6 bg-gradient-to-b from-[#3525cd]/5 to-transparent rounded-xl p-2">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
                      <div className="border-t border-[#c7c4d8]/10 w-full h-px"></div>
                      <div className="border-t border-[#c7c4d8]/10 w-full h-px"></div>
                      <div className="border-t border-[#c7c4d8]/10 w-full h-px"></div>
                    </div>
                    <div className="w-full bg-[#3525cd]/30 rounded-t-lg transition-all hover:bg-[#3525cd]/50 h-[35%] cursor-pointer"></div>
                    <div className="w-full bg-[#3525cd]/40 rounded-t-lg transition-all hover:bg-[#3525cd]/60 h-[55%] cursor-pointer"></div>
                    <div className="w-full bg-[#3525cd]/50 rounded-t-lg transition-all hover:bg-[#3525cd]/70 h-[45%] cursor-pointer"></div>
                    <div className="w-full bg-[#3525cd]/70 rounded-t-lg transition-all hover:bg-[#3525cd]/80 h-[80%] cursor-pointer"></div>
                    <div className="w-full bg-[#3525cd]/80 rounded-t-lg transition-all hover:bg-[#3525cd]/90 h-[65%] cursor-pointer"></div>
                    <div className="w-full bg-[#3525cd] rounded-t-lg transition-all hover:brightness-110 h-[95%] cursor-pointer"></div>
                  </div>
                  <div className="flex justify-between mt-4 px-1 border-t border-[#c7c4d8]/10 pt-4 text-[#777587] font-bold text-xs">
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                  </div>
                </div>

                {/* RECENT MILESTONES */}
                <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#c7c4d8]/10 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-lg font-bold text-[#0b1c30]">Recent Milestones</h4>
                    <span className="px-2 py-0.5 bg-[#3525cd]/10 text-[#3525cd] text-[10px] font-black rounded-full uppercase tracking-wider">Live Feed</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-5">
                    {milestones.map((milestone) => (
                      <div key={milestone.id} className="flex gap-3 items-center transition-all hover:translate-x-0.5">
                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-[#3525cd]/20 shadow-sm">
                          <img alt={milestone.name} className="w-full h-full object-cover" src={milestone.img} />
                        </div>
                        <div>
                          <p className="text-sm text-[#0b1c30]"><strong>{milestone.name}</strong> {milestone.action}</p>
                          <p className="text-[11px] text-[#464555] font-medium mt-0.5">{milestone.meta}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-6 py-3 w-full border border-[#c7c4d8]/30 rounded-xl text-[#3525cd] font-bold text-xs hover:bg-[#3525cd]/5 transition-all active:scale-95 cursor-pointer">
                    View Activity Logs
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN: COURSES */}
          {activeTab === "courses" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-[#0b1c30]">Course Management Vault</h2>
                  <p className="text-[#464555] text-sm">Configure modules, draft blueprints, deploy code courses.</p>
                </div>
                <button onClick={() => setActiveTab("create-course")} className="bg-[#3525cd] text-white py-2.5 px-4 rounded-xl font-bold transition-all hover:-translate-y-0.5 active:scale-95 text-sm flex items-center gap-1 cursor-pointer">
                  <span className="material-symbols-outlined text-sm select-none">add</span> Add New Syllabus
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-[#c7c4d8]/20 shadow-sm overflow-hidden flex flex-col hover:-translate-y-1 transition-all">
                  <img className="w-full h-44 object-cover" src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=400&auto=format&fit=crop" alt="React" />
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="bg-[#3525cd]/10 text-[#3525cd] text-[10px] font-black uppercase px-2 py-0.5 rounded-full">Development</span>
                      <h4 className="text-base font-bold text-[#0b1c30] mt-3">Advanced React Architecture</h4>
                      <p className="text-xs text-[#464555] mt-1">Deep modular routing engines, server hooks, performance matrices.</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-[#c7c4d8]/10 flex justify-between items-center">
                      <span className="text-sm font-bold text-[#3525cd]">$149.00</span>
                      <button className="text-xs font-bold text-[#712ae2] bg-[#eaddff] px-3 py-1.5 rounded-lg active:scale-95 transition-transform cursor-pointer">Modify System</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN: STUDENTS */}
          {activeTab === "students" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-[#0b1c30]">Enrolled Cohort Roster</h2>
                <p className="text-[#464555] text-sm">Monitor student analytics pipelines and grading benchmarks.</p>
              </div>
              <div className="bg-white rounded-2xl border border-[#c7c4d8]/10 shadow-sm overflow-hidden">
                <div className="p-5 flex items-center justify-between border-b border-[#c7c4d8]/10 bg-[#eff4ff]/30">
                  <span className="text-sm font-bold">Roster Manifest</span>
                </div>
                <div className="p-5 flex items-center justify-between hover:bg-[#f8f9ff]">
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" className="w-11 h-11 rounded-full object-cover border" alt="Student" />
                    <div>
                      <h5 className="text-sm font-bold text-[#0b1c30]">Amara Sterling</h5>
                      <p className="text-xs text-[#464555]">amara.sterling@edu.io</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md">Progress Check: 92%</span>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN: ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-[#0b1c30]">Performance Diagnostics</h2>
                <p className="text-[#464555] text-sm">Systemized retainment heatmaps and tracking matrix arrays.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-[#c7c4d8]/10 shadow-sm">
                <p className="text-xs font-bold text-[#464555] tracking-wider uppercase mb-4">Retention Factor Logs</p>
                <div className="h-40 bg-[#f8f9ff] rounded-xl flex items-end p-4 justify-between gap-4">
                  <div className="h-full bg-[#3525cd] w-12 rounded-t-md"></div>
                  <div className="h-[75%] bg-[#3525cd] w-12 rounded-t-md"></div>
                  <div className="h-[50%] bg-[#3525cd] w-12 rounded-t-md"></div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN: PAYMENTS */}
          {activeTab === "payments" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-[#0b1c30]">Financial Ledger Pipelines</h2>
                <p className="text-[#464555] text-sm">Tracking settlement validation tokens and billing nodes.</p>
              </div>
              <div className="bg-white rounded-2xl border border-[#c7c4d8]/10 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#eff4ff] text-xs font-bold text-[#464555] uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Transaction Identification Token</th>
                      <th className="p-4">Net Allocation Valuation</th>
                      <th className="p-4">Status Node</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c7c4d8]/10">
                    <tr className="hover:bg-[#f8f9ff]">
                      <td className="p-4 font-mono text-xs text-[#3525cd]">TXN-98421-X9</td>
                      <td className="p-4 font-bold">$3,575.00</td>
                      <td className="p-4"><span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-bold">Cleared to Bank</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SCREEN: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-[#0b1c30]">System Parameter Rules</h2>
                <p className="text-[#464555] text-sm">Manage API routing keys and identity credentials.</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-[#c7c4d8]/10 shadow-sm max-w-xl space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#464555] mb-2 uppercase tracking-wider">Instructor Persona Anchor Name</label>
                  <input type="text" defaultValue="Amit" className="w-full bg-[#eff4ff] border-none rounded-xl text-sm focus:ring-1 focus:ring-[#3525cd] outline-none p-3" />
                </div>
                <button className="bg-[#3525cd] text-white py-2.5 px-4 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer">Commit Global Changes</button>
              </div>
            </div>
          )}

          {/* SCREEN: CREATE NEW COURSE */}
          {activeTab === "create-course" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveTab("dashboard")} 
                  className="w-9 h-9 bg-[#eff4ff] rounded-xl flex items-center justify-center text-[#464555] hover:bg-[#d3e4fe] transition-all active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm select-none">arrow_back</span>
                </button>
                <div>
                  <h2 className="text-2xl font-black text-[#0b1c30]">Course Creation Studio</h2>
                  <p className="text-[#464555] text-sm">Deploy new interactive syllabus frameworks to the distribution matrix cloud.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#c7c4d8]/10 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2 p-8 space-y-6 border-r border-[#c7c4d8]/10">
                  <h3 className="text-sm font-black text-[#3525cd] uppercase tracking-wider">Core Curriculum Parameters</h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-[#464555] mb-2 uppercase tracking-wider">Course Syllabus Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Next.js Monolithic Scalability with TypeScript Architecture" 
                        className="w-full bg-[#eff4ff] border-none rounded-xl text-sm py-3 px-4 focus:ring-2 focus:ring-[#3525cd]/20 outline-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#464555] mb-2 uppercase tracking-wider">Domain Stream</label>
                        <select className="w-full bg-[#eff4ff] border-none rounded-xl text-sm py-3 px-4 focus:ring-2 focus:ring-[#3525cd]/20 text-[#464555] outline-none">
                          <option>Software Engineering Modules</option>
                          <option>Distributed Computing System</option>
                          <option>UI/UX Design Frameworks</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#464555] mb-2 uppercase tracking-wider">Price Index Tier (USD)</label>
                        <input 
                          type="number" 
                          placeholder="199" 
                          className="w-full bg-[#eff4ff] border-none rounded-xl text-sm py-3 px-4 focus:ring-2 focus:ring-[#3525cd]/20 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#464555] mb-2 uppercase tracking-wider">Abstract Syllabus Overview</label>
                      <textarea 
                        rows={4} 
                        placeholder="Detail explicit performance nodes, milestones, structural configurations, and target goals..." 
                        className="w-full bg-[#eff4ff] border-none rounded-xl text-sm p-4 focus:ring-2 focus:ring-[#3525cd]/20 outline-none"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-8 bg-[#eff4ff]/20 space-y-6 flex flex-col justify-between">
                  <div className="space-y-5">
                    <h3 className="text-xs font-bold text-[#0b1c30] uppercase tracking-wider">Media Assets Routing</h3>
                    <div className="border-2 border-dashed border-[#c7c4d8]/60 rounded-2xl p-6 text-center bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-[#d3e4fe]/30 transition-all group active:scale-[0.98]">
                      <span className="material-symbols-outlined text-3xl text-[#777587] group-hover:text-[#3525cd] transition-colors select-none">cloud_upload</span>
                      <p className="text-xs font-bold text-[#0b1c30] mt-3">Upload Media Container</p>
                      <p className="text-[10px] text-[#464555] mt-1">Recommended aspect scaling ratio: 16:9</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-[#c7c4d8]/10">
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#464555] mb-1">Allocated Instructor Profile</h5>
                      <p className="text-sm font-bold text-[#0b1c30]">Amit (Senior Lead Node)</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-6">
                    <button className="w-full bg-[#3525cd] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all hover:-translate-y-0.5 active:scale-95 shadow-[#3525cd]/10 cursor-pointer">
                      Commit Draft Node & Live Deploy
                    </button>
                    <button 
                      onClick={() => setActiveTab("dashboard")} 
                      className="w-full bg-transparent text-[#464555] hover:bg-[#c7c4d8]/20 py-3 rounded-xl font-bold text-xs transition-all active:scale-95 cursor-pointer"
                    >
                      Discard Blueprint Draft
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* 4. SYSTEM FOOTER: WITH MATCHED BRAND ARCHITECTURE */}
        <footer className="bg-[#d3e4fe] mt-auto shrink-0 border-t border-[#c7c4d8]/20">
          <div className="max-w-[1280px] mx-auto px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-xs text-[#464555] font-medium">© 2026 LearnUp LMS Ecosystem. Technical system pipeline optimized.</p>
            </div>
            <div className="flex gap-6 text-xs font-bold text-[#464555]/80">
              <a className="hover:text-[#3525cd] transition-colors hover:underline cursor-pointer">Security Nodes</a>
              <a className="hover:text-[#3525cd] transition-colors hover:underline cursor-pointer">Platform Status</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
