"use client";

import React, { useEffect, useState } from "react";
import { MessageSquare, Calendar, User, Clock, CheckCircle } from "lucide-react";

export default function AdminSupportOversight() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/admin/tickets");
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn text-[#f1f5f9]">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-black tracking-widest text-purple-400 uppercase">
          <span className="material-symbols-outlined text-sm select-none">support_agent</span>
          OVERSIGHT CENTER
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white">Support Tickets</h1>
        <p className="text-sm text-slate-400">
          Oversight and management of all support submissions from students and instructors.
        </p>
      </div>

      <div className="bg-[#0b0a1d]/60 border border-white/5 rounded-3xl p-6 backdrop-blur-md shadow-lg space-y-6">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-400" />
          Active Inquiries Queue
        </h3>

        {loading ? (
          <div className="text-slate-400 text-xs py-8 text-center">Loading ticket queue...</div>
        ) : tickets.length === 0 ? (
          <div className="text-slate-400 text-xs py-8 text-center">No support tickets submitted yet. Queue clear!</div>
        ) : (
          <div className="divide-y divide-white/5">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/5 px-4 rounded-2xl transition-colors">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                      ticket.user?.role === "ADMIN" 
                        ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                        : ticket.user?.role === "INSTRUCTOR"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-teal-500/10 text-teal-400 border-teal-500/20"
                    }`}>
                      {ticket.user?.role || "STUDENT"}
                    </span>
                    <span className="text-slate-400 text-xs font-bold">{ticket.user?.name || "Anonymous User"} ({ticket.user?.email})</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-100">{ticket.subject}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed bg-[#070710]/40 p-3 rounded-xl border border-white/5 max-w-2xl">{ticket.message}</p>
                </div>

                <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-black border ${
                    ticket.status === "OPEN" 
                      ? "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse" 
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  }`}>
                    {ticket.status}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(ticket.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
