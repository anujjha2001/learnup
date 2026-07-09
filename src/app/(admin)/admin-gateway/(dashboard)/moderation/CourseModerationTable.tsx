"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCourse } from "@/app/actions/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, BookOpen, AlertTriangle, DollarSign, Users } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string | null;
  price: number;
  instructorName: string;
  instructorEmail: string;
  enrollmentCount: number;
  createdAt: string;
}

interface CourseModerationTableProps {
  initialCourses: Course[];
}

export default function CourseModerationTable({ initialCourses }: CourseModerationTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  const triggerDelete = (course: Course) => {
    setActiveCourse(course);
    setModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!activeCourse) return;

    startTransition(async () => {
      const res = await deleteCourse(activeCourse.id);
      if (res.success) {
        setModalOpen(false);
        setActiveCourse(null);
        router.refresh();
      } else {
        alert(res.error || "Failed to delete course");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {initialCourses.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-lg font-semibold text-slate-300">No Courses Registered</p>
            <p className="text-sm mt-1 text-slate-500">There are no courses currently uploaded to the platform.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white/10 hover:bg-transparent">
                  <TableHead className="py-4 pl-6 text-slate-400 font-bold text-xs uppercase tracking-wider">Course Title</TableHead>
                  <TableHead className="py-4 text-slate-400 font-bold text-xs uppercase tracking-wider">Instructor</TableHead>
                  <TableHead className="py-4 text-slate-400 font-bold text-xs uppercase tracking-wider">Pricing</TableHead>
                  <TableHead className="py-4 text-slate-400 font-bold text-xs uppercase tracking-wider">Enrollments</TableHead>
                  <TableHead className="py-4 pr-6 text-right text-slate-400 font-bold text-xs uppercase tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialCourses.map((course) => (
                  <TableRow key={course.id} className="border-b border-white/5 hover:bg-slate-800/20 transition duration-150">
                    {/* Title */}
                    <TableCell className="py-4 pl-6">
                      <div>
                        <p className="font-semibold text-slate-200">{course.title}</p>
                        <p className="text-xs text-slate-500 truncate max-w-xs">{course.description || "No description provided"}</p>
                      </div>
                    </TableCell>

                    {/* Instructor */}
                    <TableCell className="py-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-300">{course.instructorName}</p>
                        <p className="text-[10px] text-slate-500">{course.instructorEmail}</p>
                      </div>
                    </TableCell>

                    {/* Price */}
                    <TableCell className="py-4 text-xs text-slate-300">
                      <div className="flex items-center space-x-1 font-semibold">
                        <span className="text-slate-500 font-bold mr-0.5">₹</span>
                        <span>{course.price.toFixed(2)}</span>
                      </div>
                    </TableCell>

                    {/* Enrollments count */}
                    <TableCell className="py-4 text-xs text-slate-300">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        <span>{course.enrollmentCount}</span>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-4 pr-6 text-right">
                      <button
                        onClick={() => triggerDelete(course)}
                        disabled={isPending}
                        className="h-9 px-3.5 rounded-xl border border-white/10 hover:border-red-500/20 text-slate-400 hover:text-red-400 hover:bg-red-500/5 text-xs font-semibold flex items-center space-x-1.5 transition-all duration-200 cursor-pointer ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {modalOpen && activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-950 border border-white/10 max-w-sm w-full rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center space-x-3 text-red-500">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
              <h3 className="text-lg font-bold text-slate-100">Critical Action</h3>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-slate-200">{activeCourse.title}</strong>? This action is irreversible and will delete all associated student enrollments and progress.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 h-10 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isPending}
                className="flex-1 h-10 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition cursor-pointer"
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
