"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications — only when authenticated
  const fetchNotifications = async () => {
    if (status !== "authenticated") return;
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status !== "authenticated") return;
    fetchNotifications();

    // Poll the database for real-time notification updates
    const pollInterval = setInterval(() => {
      fetchNotifications();
    }, 4000);

    // Connect to Supabase Realtime channel for Submissions
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Submission",
        },
        (payload: any) => {
          const newSub = payload.new;
          // Construct a dynamic notification from the submission record
          const newNotif: NotificationItem = {
            id: newSub.id || `n-sub-${Date.now()}`,
            title: "New Quiz Attempt",
            message: `Submission received with a grade score of ${newSub.score}%.`,
            isRead: false,
            createdAt: newSub.submittedAt || new Date().toISOString(),
          };
          setNotifications((prev) => {
            if (prev.some((n) => n.id === newNotif.id)) return prev;
            return [newNotif, ...prev];
          });
        }
      )
      .subscribe();

    // Close dropdown on outside click
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      channel.unsubscribe();
      clearInterval(pollInterval);
    };
  }, [status]);

  // Mark single as read
  const markAsRead = async (id: string) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead: true }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true, isRead: true }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-[#0b0a1d] border border-white/5 text-slate-400 hover:text-[#f97316] transition cursor-pointer flex items-center justify-center shadow-md hover:border-[#8b5cf6]/30"
      >
        <span className="material-symbols-outlined select-none text-xl">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#f97316] text-[10px] font-bold text-white ring-2 ring-[#070710] animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-[#0b0a1d]/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden transform origin-top-right animate-fadeIn">
          {/* Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#070710]/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Alerts</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-bold text-[#f97316] hover:text-[#ea580c] cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
            {loading && notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading alerts...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No alerts found.</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && markAsRead(n.id)}
                  className={`p-4 text-left transition-colors cursor-pointer ${
                    n.isRead ? "bg-[#0b0a1d] hover:bg-white/5" : "bg-[#140e2d]/60 hover:bg-[#140e2d]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-xs ${n.isRead ? "text-slate-400" : "font-black text-white"}`}>
                      {n.title}
                    </p>
                    {!n.isRead && (
                      <span className="h-2 w-2 rounded-full bg-[#f97316] shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-slate-500 mt-2 font-medium">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
