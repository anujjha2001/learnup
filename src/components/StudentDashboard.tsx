"use client";

import React, { useState, useEffect } from "react";

// Types and constants
import { TabType, StatItem, CourseItem, ResourceItem, CertificateItem } from "@/types/dashboard";
import { STATS_DATA, ALL_COURSES_DATA, RESOURCES_DATA, CERTIFICATES_DATA } from "@/constants/dashboardData";

// Path elements dynamically matched for modular rendering
import StreakCard from "@/components/dashboard/StreakCard";
import StatCard from "@/components/dashboard/StatCard";
import ContinueCourseCard from "@/components/dashboard/ContinueCourseCard";
import DeadlineItem from "@/components/dashboard/DeadlineItem";
import CourseGridCard from "@/components/courses/CourseGridCard";
import TimeAllocationChart from "@/components/analytics/TimeAllocationChart";
import ResourcesTab from "@/components/resources/ResourcesTab";
import CertificatesTab from "@/components/certificates/CertificatesTab";
import QuizLobby from "@/components/quiz/QuizLobby";
import NotificationBell from "@/components/NotificationBell";

// NEW IMPORT FOR SETTINGS (Only necessary change)
import SettingsForm from "@/components/settings/SettingsForm";

interface StudentDashboardProps {
  onLogout: () => void;
}

export default function StudentDashboard({ onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      console.warn("Failed to fetch student courses", err);
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="flex h-screen w-full bg-[#f8f9ff] text-[#0b1c30] font-sans antialiased overflow-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
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

        {/* BRAND IDENTITY: EXACTLY MATCHED WITH AUTH PAGE & INSTRUCTOR HUB */}
        <div className="flex items-center gap-3 px-2 py-4 mb-4">
          <svg className="h-9 w-9 shrink-0 transition-transform duration-200 hover:scale-105" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#4F46E5', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#7C3AED', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <rect width="200" height="200" rx="40" fill="transparent" />
            <path d="M60 40 V140 H140" stroke="url(#grad1)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M110 90 L140 60 L170 90" stroke="#06B6D4" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M140 60 V120" stroke="#06B6D4" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <div>
            <span className="text-2xl font-black bg-gradient-to-r from-[#3525cd] to-[#712ae2] bg-clip-text text-transparent tracking-tight block leading-none">
              LearnUp
            </span>
            <p className="text-[10px] text-[#464555] opacity-75 mt-1 font-bold uppercase tracking-widest leading-none">
              Student Hub
            </p>
          </div>
        </div>

        {/* SIDEBAR TABS NAV */}
        <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto pr-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: "dashboard" },
            { id: "courses", label: "My Courses", icon: "menu_book" },
            { id: "analytics", label: "Analytics", icon: "bar_chart" },
            { id: "resources", label: "Resources", icon: "folder_open" },
            { id: "certificates", label: "Certificates", icon: "workspace_premium" },
            { id: "quiz", label: "Quiz Lobby", icon: "quiz" },
            { id: "settings", label: "Settings", icon: "settings" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${isActive
                  ? "bg-[#3525cd] text-white shadow-md shadow-[#3525cd]/15"
                  : "text-[#464555] hover:bg-white/60 hover:text-[#3525cd]"
                  }`}
              >
                <span className="material-symbols-outlined text-lg select-none">{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Footer Area of Sidebar */}
        <div className="mt-auto flex flex-col gap-1.5 pt-4 border-t border-[#c7c4d8]/20">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#464555] hover:bg-white/60 hover:text-[#3525cd] transition-all cursor-pointer">
            <span className="material-symbols-outlined text-lg select-none">contact_support</span>
            Support Center
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg select-none">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT SPACE CONTAINER */}
      <main className="flex-1 overflow-y-auto scroll-smooth flex flex-col justify-between h-screen">

        {/* 2. TOP NAVBAR HEADER (INTEGRATED PROFILE AND SEARCH) */}
        <header className="sticky top-0 z-40 bg-[#f8f9ff]/80 backdrop-blur-xl border-b border-[#c7c4d8]/20 h-16 flex justify-between items-center px-8 shrink-0">
          <div className="flex items-center gap-6">
            <div className="relative w-96 max-w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777587] select-none">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lectures, resource links, tasks..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#eff4ff] border-none rounded-full text-sm focus:ring-2 focus:ring-[#3525cd]/20 transition-all placeholder:text-[#777587]/60 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="w-px h-6 bg-[#c7c4d8]/30 mx-1"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-[#0b1c30] leading-tight">Anuj</p>
                <p className="text-[11px] text-[#464555] font-semibold opacity-80">Premium Student</p>
              </div>
              <img
                alt="Anuj Profile"
                className="w-10 h-10 rounded-full border-2 border-[#3525cd]/20 object-cover shadow-sm transition-transform hover:scale-105"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
              />
            </div>
          </div>
        </header>

        {/* 3. DYNAMIC BODY SCREENS */}
        <div className="p-8 max-w-[1280px] w-full mx-auto space-y-8 flex-1 pb-12">

          {/* SCREEN 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fadeIn">
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col justify-center">
                  <h2 className="text-3xl font-black tracking-tight text-[#12] mb-1">Welcome back, Anuj</h2>
                  <p className="text-base text-[#464555] max-w-xl"> .</p>
                </div>
                <StreakCard />
              </section>

              <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {STATS_DATA.map((stat: StatItem, idx: number) => (
                  <StatCard key={idx} {...stat} />
                ))}
              </section>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">Continue Learning</h3>
                    <button onClick={() => setActiveTab("courses")} className="text-[#3525cd] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
                      View Library <span className="material-symbols-outlined text-md select-none">arrow_forward</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ContinueCourseCard {...ALL_COURSES_DATA[0]} />
                    <ContinueCourseCard {...ALL_COURSES_DATA[1]} />
                  </div>
                </div>

                <div className="xl:col-span-4 space-y-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#c7c4d8]/10">
                    <h3 className="text-lg font-bold mb-4">Upcoming Deadlines</h3>
                    <div className="space-y-3">
                      <DeadlineItem
                        month="NOV"
                        day="24"
                        title="Final UX Case Study"
                        subtitle="Advanced Design Systems"
                        badgeBg="bg-[#ffdad6]"
                        badgeText="text-[#ba1a1a]"
                      />
                      <DeadlineItem
                        month="NOV"
                        day="28"
                        title="API Integration Quiz"
                        subtitle="AWS & Python Scalability"
                        badgeBg="bg-[#e2dfff]"
                        badgeText="text-[#3525cd]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: COURSES */}
          {activeTab === "courses" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-[#0b1c30]">My Enrolled Courses</h2>
                <p className="text-sm text-[#464555]">Track, browse, and continue your technical deep dives.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.map((course: any, idx: number) => (
                  <CourseGridCard 
                    key={idx} 
                    title={course.title}
                    cat="Development"
                    progress={idx === 0 ? 64 : idx === 1 ? 42 : 0}
                    img={course.image || "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80"}
                  />
                ))}
              </div>
            </div>
          )}

          {/* SCREEN 3: ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-[#0b1c30]">Performance Analytics</h2>
                <p className="text-sm text-[#464555]">Data tracking parameters on time distribution.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-[#c7c4d8]/20 shadow-sm space-y-4">
                  <h3 className="font-bold text-[#0b1c30]">Time Allocation</h3>
                  <TimeAllocationChart />
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 4: RESOURCES */}
          {activeTab === "resources" && (
            <ResourcesTab />
          )}

          {/* SCREEN 5: CERTIFICATES */}
          {activeTab === "certificates" && (
            <CertificatesTab />
          )}

          {/* SCREEN 6: QUIZ LOBBY  */}
          {activeTab === "quiz" && (
            <div className="animate-fadeIn">
              <QuizLobby />
            </div>
          )}

          {/* SCREEN 7: SETTINGS - INTEGRATED WITH PREVIOUS WORK */}
          {activeTab === "settings" && (
            <div className="animate-fadeIn">
              <SettingsForm />
            </div>
          )}

        </div>

        {/* 4. CLEAN SYSTEM FOOTER */}

        <footer className="bg-[#d3e4fe] border-t border-[#c7c4d8]/20 mt-auto shrink-0">

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