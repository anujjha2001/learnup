"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { approveInstructor, rejectInstructor } from "@/app/actions/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserCheck, UserX, User, Mail, Phone, Clock, AlertTriangle } from "lucide-react";

interface Instructor {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date | string;
  isApproved?: boolean;
  cvUrl?: string | null;
  degreeUrl?: string | null;
  collegeName?: string | null;
  courseName?: string | null;
}

interface InstructorTableProps {
  initialInstructors: Instructor[];
}

export default function InstructorTable({ initialInstructors }: InstructorTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<{ id: string; name: string; type: "approve" | "reject" } | null>(null);

  // Set up Supabase real-time listener for the User table
  useEffect(() => {
    const channel = supabase
      .channel("admin-gateway-user-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "User",
        },
        (payload: any) => {
          // Refresh page if an instructor is modified or added
          if (payload.new && payload.new.role === "INSTRUCTOR") {
            router.refresh();
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [router]);

  const triggerAction = (id: string, name: string, type: "approve" | "reject") => {
    setActiveAction({ id, name, type });
    setModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (!activeAction) return;

    startTransition(async () => {
      if (activeAction.type === "approve") {
        await approveInstructor(activeAction.id);
      } else {
        await rejectInstructor(activeAction.id);
      }
      setModalOpen(false);
      setActiveAction(null);
      router.refresh();
    });
  };

  const formatDate = (dateVal: Date | string) => {
    const d = new Date(dateVal);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  };

  return (
    <div className="space-y-6">
      {/* Table Card */}
      <div className="lu-card-static overflow-hidden">
        {initialInstructors.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <User className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-lg font-semibold text-slate-300">No Instructors Found</p>
            <p className="text-sm mt-1 text-slate-500">There are no instructor accounts registered yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white/8 hover:bg-transparent">
                  <TableHead className="lu-table-head py-4 pl-6">Instructor</TableHead>
                  <TableHead className="lu-table-head py-4">Contact Info</TableHead>
                  <TableHead className="lu-table-head py-4">Verification Info</TableHead>
                  <TableHead className="lu-table-head py-4">Joined Date</TableHead>
                  <TableHead className="lu-table-head py-4">Current Status</TableHead>
                  <TableHead className="lu-table-head py-4 pr-6 text-right">Moderation Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialInstructors.map((inst) => (
                  <TableRow key={inst.id} className="lu-table-row">
                    {/* Profile */}
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-[rgba(139,92,246,0.10)] border border-purple-500/20 flex items-center justify-center font-bold text-purple-300">
                          {inst.name ? inst.name[0].toUpperCase() : <User className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-100 text-sm">{inst.name || "Unnamed Instructor"}</p>
                          <p className="lu-caption">ID: {inst.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </TableCell>
                    
                    {/* Contact Info */}
                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 lu-caption">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{inst.email}</span>
                        </div>
                        {inst.phone && (
                          <div className="flex items-center space-x-2 lu-caption">
                            <Phone className="w-3.5 h-3.5 text-slate-500" />
                            <span>{inst.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    {/* Verification Info */}
                    <TableCell className="py-4">
                      <div className="space-y-1 text-xs">
                        {inst.collegeName ? (
                          <div className="text-slate-300">
                            <span className="text-slate-500 font-bold">College:</span> {inst.collegeName}
                          </div>
                        ) : (
                          inst.isApproved && <div className="text-slate-500 italic">Pre-approved System User</div>
                        )}
                        {inst.courseName && (
                          <div className="text-slate-300">
                            <span className="text-slate-500 font-bold">Course:</span> {inst.courseName}
                          </div>
                        )}
                        <div className="flex gap-2.5 mt-1.5 text-[11px]">
                          {inst.cvUrl ? (
                            <a href={inst.cvUrl} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300 underline font-bold">
                              CV Doc
                            </a>
                          ) : (
                            <span className="text-slate-600 italic">No CV</span>
                          )}
                          <span className="text-slate-700">|</span>
                          {inst.degreeUrl ? (
                            <a href={inst.degreeUrl} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300 underline font-bold">
                              Degree Doc
                            </a>
                          ) : (
                            <span className="text-slate-600 italic">No Degree</span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Joined Date */}
                    <TableCell className="py-4 lu-caption">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5 text-slate-600" />
                        <span>{formatDate(inst.createdAt)}</span>
                      </div>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="py-4">
                      <span
                        className={`lu-badge ${
                          inst.status === "APPROVED"
                            ? "lu-badge-success"
                            : inst.status === "REJECTED"
                            ? "lu-badge-danger"
                            : "lu-badge-warning"
                        }`}
                      >
                        {inst.status}
                      </span>
                    </TableCell>

                    {/* Action Buttons */}
                    <TableCell className="py-4 pr-6 text-right">
                      <div className="flex justify-end items-center space-x-2">
                        {inst.status !== "APPROVED" && (
                          <button
                            onClick={() => triggerAction(inst.id, inst.name || inst.email, "approve")}
                            disabled={isPending}
                            className="lu-btn lu-btn-success text-xs"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}
                        
                        {inst.status !== "REJECTED" && (
                          <button
                            onClick={() => triggerAction(inst.id, inst.name || inst.email, "reject")}
                            disabled={isPending}
                            className="lu-btn lu-btn-danger text-xs"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {modalOpen && activeAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-950 border border-white/10 max-w-sm w-full rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center space-x-3 text-amber-500">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-100">Confirm Action</h3>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed">
              Are you sure you want to <strong className="text-slate-200">{activeAction.type}</strong> access request for{" "}
              <strong className="text-slate-200">{activeAction.name}</strong>?
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 h-10 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={isPending}
                className={`flex-1 h-10 rounded-xl text-white text-xs font-bold transition cursor-pointer ${
                  activeAction.type === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-500"
                    : "bg-red-600 hover:bg-red-500"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
