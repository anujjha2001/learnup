"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationBell from "@/components/NotificationBell";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ShieldAlert,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  user: { name: string; email: string; avatar?: string };
}

const navItems = [
  { name: "Overview",           href: "/admin-gateway",              icon: LayoutDashboard },
  { name: "Manage Instructors", href: "/admin-gateway/instructors",  icon: Users },
  { name: "Manage Students",    href: "/admin-gateway/students",     icon: GraduationCap },
  { name: "Content Moderation", href: "/admin-gateway/moderation",  icon: ShieldAlert },
  { name: "Settings",           href: "/admin-gateway/settings",    icon: Settings },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    document.cookie = "learnup_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("learnup_user");
    localStorage.removeItem("learnup_token");
    window.location.href = "/?auth=true";
  };

  /* ── Logo SVG ──────────────────────────────────────────────────────── */
  const Logo = ({ id }: { id: string }) => (
    <svg className="h-9 w-9 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   style={{ stopColor: "#8b5cf6", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#a78bfa", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect width="200" height="200" rx="40" fill="transparent" />
      <path d="M60 40 V140 H140" stroke={`url(#${id})`} strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M110 90 L140 60 L170 90" stroke="#8b5cf6" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M140 60 V120"            stroke="#8b5cf6" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );

  /* ── Nav content (shared between mobile drawer & desktop aside) ────── */
  const NavContent = () => (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Brand */}
      <div className="h-20 flex items-center px-5 border-b border-white/8">
        <div className="flex items-center gap-3">
          <Logo id="sidebar-grad-desktop" />
          <div>
            <span className="text-xl font-black bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent tracking-tight block leading-none">
              LearnUp
            </span>
            <span className="lu-eyebrow text-teal-300 block mt-1.5">Admin Gateway</span>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`lu-nav-item ${isActive ? "lu-nav-item-active" : ""}`}
            >
              {/* Active accent line */}
              {isActive && (
                <span className="absolute left-0 w-[3px] h-5 bg-gradient-to-b from-purple-400 to-violet-500 rounded-full" />
              )}
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-violet-300" : "text-slate-500"}`} />
              <span className={`text-sm ${isActive ? "font-bold text-violet-200" : "font-semibold"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-white/8">
        <div className="flex items-center gap-3 mb-4 px-1">
          <div className="w-9 h-9 rounded-xl bg-[rgba(139,92,246,0.12)] border border-purple-500/20 flex items-center justify-center font-bold text-purple-300 overflow-hidden shrink-0">
            {user.avatar
              ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              : user.name[0].toUpperCase()
            }
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-100 truncate">{user.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="lu-btn lu-btn-danger w-full text-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          Exit Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile header ─────────────────────────────────────────────── */}
      <header className="lg:hidden w-full h-16 bg-black/80 backdrop-blur-md border-b border-white/8 flex items-center justify-between px-6 sticky top-0 z-40 text-white">
        <div className="flex items-center gap-3">
          <Logo id="sidebar-grad-mobile" />
          <div>
            <span className="text-lg font-black bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent tracking-tight block leading-none">
              LearnUp
            </span>
            <span className="lu-eyebrow text-teal-300 block mt-1">Admin Gateway</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-400 hover:text-white transition focus:outline-none"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ── Desktop sidebar ────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#070710] border-r border-white/8 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavContent />
      </aside>

      {/* ── Mobile overlay ─────────────────────────────────────────────── */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/65 backdrop-blur-sm"
        />
      )}
    </>
  );
}
