import React from "react";
import { db } from "@/lib/db";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GraduationCap, User, Mail, Phone, Calendar, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ManageStudentsPage() {
  const students = await db.user.findMany({
    where: {
      role: "STUDENT",
    },
    include: {
      _count: {
        select: { enrolled: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatDate = (dateVal: Date | string) => {
    const d = new Date(dateVal);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-white/10 pb-6 space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-3 mb-2 text-purple-400">
            <GraduationCap className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest font-black">Administration Gateway</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            Manage Students
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            View registered students and their platform course enrollment status.
          </p>
        </div>
      </header>

      {/* Students Table */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {students.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <User className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-lg font-semibold text-slate-300">No Students Registered</p>
            <p className="text-sm mt-1 text-slate-500">Wait for users to sign up as students.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white/10 hover:bg-transparent">
                  <TableHead className="py-4 pl-6 text-slate-400 font-bold text-xs uppercase tracking-wider">Student</TableHead>
                  <TableHead className="py-4 text-slate-400 font-bold text-xs uppercase tracking-wider">Contact Details</TableHead>
                  <TableHead className="py-4 text-slate-400 font-bold text-xs uppercase tracking-wider">Registered On</TableHead>
                  <TableHead className="py-4 pr-6 text-right text-slate-400 font-bold text-xs uppercase tracking-wider">Enrolled Courses</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id} className="border-b border-white/5 hover:bg-slate-800/20 transition duration-150">
                    {/* Identity */}
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-teal-400 border border-slate-700/50">
                          {student.name ? student.name[0].toUpperCase() : <User className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-200">{student.name || "Unnamed Student"}</p>
                          <p className="text-xs text-slate-500">ID: {student.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Contact details */}
                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{student.email}</span>
                        </div>
                        {student.phone && (
                          <div className="flex items-center space-x-2 text-xs text-slate-400">
                            <Phone className="w-3.5 h-3.5 text-slate-500" />
                            <span>{student.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Registered date */}
                    <TableCell className="py-4 text-xs text-slate-400">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{formatDate(student.createdAt)}</span>
                      </div>
                    </TableCell>

                    {/* Courses Count */}
                    <TableCell className="py-4 pr-6 text-right font-semibold text-slate-200 text-sm">
                      <div className="flex items-center justify-end space-x-1.5">
                        <BookOpen className="w-4 h-4 text-slate-500" />
                        <span>{student._count.enrolled}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
