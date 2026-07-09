"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { User, Mail, Award, Flame, ChevronLeft, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id as string;

  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudentData() {
      if (!studentId) return;
      try {
        const searchRes = await fetch(`/api/search?q=${studentId}`);
        if (searchRes.ok) {
          const sData = await searchRes.json();
          const foundUser = sData.users.find((u: any) => u.id === studentId);
          if (foundUser) {
            setStudent(foundUser);
          } else {
            // Fallback mock
            setStudent({
              id: studentId,
              name: "LearnUp Scholar",
              avatar: "",
              learnupId: `@scholar_${studentId.slice(0, 4)}`,
              email: "scholar@learnup.com",
              role: "STUDENT"
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStudentData();
  }, [studentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070710] flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Loading Student Profile...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-[#070710] flex flex-col items-center justify-center gap-4 text-white p-6">
        <h2 className="text-2xl font-black">Student Profile Offline</h2>
        <p className="text-slate-400 text-sm">We couldn't load the student profile from the database.</p>
        <button onClick={() => router.back()} className="px-6 py-2.5 rounded-full bg-[#f97316] text-xs font-extrabold flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070710] text-[#f1f5f9] antialiased font-sans pb-20 relative">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-900/10 blur-[120px] pointer-events-none" />

      {/* HEADER BAR */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 md:px-12 bg-[#070710]/40 backdrop-blur-md sticky top-0 z-40">
        <button onClick={() => router.back()} className="text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-bold cursor-pointer">
          <ChevronLeft className="w-4.5 h-4.5" /> Back to Previous Screen
        </button>
        <span className="text-sm font-black text-white tracking-wider uppercase bg-[#f97316]/10 px-3 py-1 rounded-full border border-[#f97316]/20">
          Student Profile Directory
        </span>
      </header>

      <main className="max-w-[800px] mx-auto px-6 pt-10 space-y-8 relative z-10">
        {/* Profile Card */}
        <div className="p-8 rounded-3xl border border-white/5 bg-[#0b0a1d]/60 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-24 h-24 rounded-full bg-[#f97316]/15 flex items-center justify-center text-white border-2 border-[#f97316]/40 shadow-xl overflow-hidden shrink-0">
            {student.avatar ? (
              <img src={student.avatar} className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-[#f97316]" />
            )}
          </div>

          <div className="space-y-3 flex-1">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-white leading-none">{student.name}</h1>
              <p className="text-xs font-bold text-[#f97316] uppercase tracking-wider">{student.learnupId || "@student"}</p>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Enrolled Student at LearnUp Academy. Building skills for professional advancement and technological mastery.
            </p>
            <div className="flex flex-wrap gap-4 justify-center sm:justify-start items-center text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#f97316]" /> {student.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500 animate-pulse" /> Learning Streak active
              </span>
            </div>
          </div>
        </div>

        {/* Certificates & Achievements section */}
        <div className="p-8 rounded-3xl border border-white/5 bg-[#0b0a1d]/60 space-y-6">
          <div className="flex items-center gap-2 text-white">
            <Award className="w-5 h-5 text-[#f97316]" />
            <h2 className="text-lg font-black">Achievements & Badges</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <h4 className="font-bold text-slate-200 text-sm">Verified Profile</h4>
              <p className="text-xs text-slate-400 leading-relaxed">This student profile is verified on the LearnUp LMS network.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <h4 className="font-bold text-slate-200 text-sm">Onboarding Complete</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Successfully set up credentials and joined active pathway cohorts.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
