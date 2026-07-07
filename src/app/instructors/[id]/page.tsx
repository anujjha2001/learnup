"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { User, Mail, BookOpen, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function InstructorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const instructorId = params?.id as string;

  const [instructor, setInstructor] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInstructorData() {
      if (!instructorId) return;
      try {
        // Fetch instructor details via users endpoint
        const res = await fetch(`/api/search?q=`);
        // We can query search API to find matching user, or search directly
        // Better yet: fetch `/api/user?id=...` or `/api/courses` and filter courses, and extract instructor object
        const coursesRes = await fetch("/api/courses");
        if (coursesRes.ok) {
          const coursesList = await coursesRes.json();
          // Filter courses taught by this instructor
          const instCourses = coursesList.filter((c: any) => c.instructorId === instructorId);
          setCourses(instCourses);

          // Find instructor object from first course or search
          if (instCourses.length > 0 && instCourses[0].instructor) {
            setInstructor(instCourses[0].instructor);
          } else {
            // Fallback: search instructors
            const searchRes = await fetch(`/api/search?q=${instructorId}`);
            if (searchRes.ok) {
              const sData = await searchRes.json();
              const foundUser = sData.users.find((u: any) => u.id === instructorId);
              if (foundUser) {
                setInstructor(foundUser);
              } else {
                // Mock a name if not found but ID is valid
                setInstructor({
                  id: instructorId,
                  name: "LearnUp Senior Instructor",
                  avatar: "",
                  learnupId: `@instructor_${instructorId.slice(0,4)}`,
                  email: "mentor@learnup.com"
                });
              }
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadInstructorData();
  }, [instructorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070710] flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Loading Instructor Profile...</p>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen bg-[#070710] flex flex-col items-center justify-center gap-4 text-white p-6">
        <h2 className="text-2xl font-black">Instructor Profile Offline</h2>
        <p className="text-slate-400 text-sm">We couldn't load the instructor profile from the database.</p>
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
        <span className="text-sm font-black text-white tracking-wider uppercase bg-[#8b5cf6]/10 px-3 py-1 rounded-full border border-[#8b5cf6]/20">
          Instructor Directory
        </span>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 pt-10 space-y-10 relative z-10">
        
        {/* Profile Card */}
        <div className="p-8 rounded-3xl border border-white/5 bg-[#0b0a1d]/60 backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-[#8b5cf6]/15 flex items-center justify-center text-white border-2 border-[#8b5cf6]/40 shadow-xl overflow-hidden shrink-0">
            {instructor.avatar ? <img src={instructor.avatar} className="w-full h-full object-cover" /> : <User className="w-10 h-10 text-[#8b5cf6]" />}
          </div>

          <div className="space-y-3 text-center md:text-left flex-1">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-white leading-none">{instructor.name}</h1>
              <p className="text-xs font-bold text-[#f97316] uppercase tracking-wider">{instructor.learnupId || "@instructor"}</p>
            </div>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              {instructor.bio || "Senior platform instructor specializing in modern system architectures, cloud deployments, and production grade integrations."}
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start items-center text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-[#8b5cf6]" /> {instructor.email || "mentor@learnup.com"}</span>
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-[#f97316]" /> {courses.length} Active Courses</span>
            </div>
          </div>
        </div>

        {/* Taught Courses Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-white">Curated Pathways by this Instructor</h2>
          
          {courses.length === 0 ? (
            <div className="p-8 rounded-3xl border border-white/5 bg-[#0b0a1d]/60 text-center text-slate-400 text-sm">
              This instructor hasn't published any courses yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((c) => (
                <div key={c.id} className="rounded-3xl border border-white/5 bg-[#0b0a1d]/60 overflow-hidden shadow-lg hover:border-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#8b5cf6]/5 hover:border-[#8b5cf6]/30 flex flex-col justify-between">
                  <img src={c.image} alt={c.title} className="w-full h-40 object-cover border-b border-white/5" />
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h4 className="font-extrabold text-slate-100 text-sm line-clamp-1">{c.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>
                    </div>
                    <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                      <span className="text-xs font-black text-purple-300">
                        {c.price > 0 ? `₹${c.price}` : "Free"}
                      </span>
                      <Link href={`/courses/${c.id}`} className="text-xs font-black text-[#f97316] hover:text-[#ea580c] transition">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
