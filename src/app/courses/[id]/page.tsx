"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, User, Wallet, ChevronLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!courseId) return;
      try {
        // Fetch session
        const sessRes = await fetch("/api/auth/session");
        let activeSession = null;
        if (sessRes.ok) {
          const s = await sessRes.json();
          setSession(s.user || s);
          activeSession = s.user || s;
        } else {
          // Fallback to local storage session
          const localUser = localStorage.getItem("learnup_user");
          if (localUser) {
            activeSession = JSON.parse(localUser);
            setSession(activeSession);
          }
        }

        // Fetch course details
        const courseRes = await fetch(`/api/courses`);
        if (courseRes.ok) {
          const coursesList = await courseRes.json();
          const found = coursesList.find((c: any) => c.id === courseId);
          if (found) {
            setCourse(found);
            setIsEnrolled(!!found.isEnrolled);
          } else {
            // Try single course fetch if available
            const singleRes = await fetch(`/api/courses/${courseId}`);
            if (singleRes.ok) {
              const singleCourse = await singleRes.json();
              setCourse(singleCourse);
              setIsEnrolled(!!singleCourse.isEnrolled);
            }
          }
        }

        // Fetch wallet if session exists
        if (activeSession?.id) {
          const walletRes = await fetch(`/api/payout/wallet?userId=${activeSession.id}`);
          if (walletRes.ok) {
            const wData = await walletRes.json();
            setWalletBalance(wData.balance || 0);
          }

          // Check enrollment directly from courses if not already true
          const checkRes = await fetch(`/api/courses?userId=${activeSession.id}`);
          if (checkRes.ok) {
            const data = await checkRes.json();
            const matching = data.find((c: any) => c.id === courseId);
            if (matching) {
              setIsEnrolled(!!matching.isEnrolled);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [courseId]);

  const handleEnroll = async () => {
    if (!session) {
      toast.error("Please sign in to enroll in this course.");
      router.push("/auth?auth=true");
      return;
    }

    if (course.price > 0 && walletBalance < course.price) {
      toast.error(`Insufficient wallet balance (₹${walletBalance.toFixed(2)}). Redirecting to dashboard to add funds.`);
      router.push("/auth/dashboard/student");
      return;
    }

    setBuying(true);
    try {
      const res = await fetch("/api/payment/wallet-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id })
      });

      if (res.ok) {
        toast.success(course.price === 0 ? "Successfully enrolled for free!" : "Successfully enrolled using wallet balance!");
        setIsEnrolled(true);
        // refresh wallet
        const wRes = await fetch(`/api/payout/wallet?userId=${session.id}`);
        if (wRes.ok) {
          const wData = await wRes.json();
          setWalletBalance(wData.balance || 0);
        }
      } else {
        const err = await res.json();
        toast.error(err.error || "Enrollment failed.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error processing enrollment.");
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070710] flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#f97316]" />
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Fetching Course Blueprint...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#070710] flex flex-col items-center justify-center gap-4 text-white p-6">
        <h2 className="text-2xl font-black">Course Matrix Offline</h2>
        <p className="text-slate-400 text-sm">We couldn't load the requested course. It may not exist in the database.</p>
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
          <ChevronLeft className="w-4.5 h-4.5" /> Back to Dashboard
        </button>
        <span className="text-sm font-black text-white tracking-wider uppercase bg-[#8b5cf6]/10 px-3 py-1 rounded-full border border-[#8b5cf6]/20">
          LearnUp Academy
        </span>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 pt-10 space-y-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cover, Info */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-3xl overflow-hidden border border-white/5 bg-[#0b0a1d]/60 shadow-2xl relative">
              <img src={course.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"} alt={course.title} className="w-full h-80 object-cover" />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${course.price > 0 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-teal-500/10 text-teal-400 border-teal-500/20"}`}>
                  {course.price > 0 ? "Premium Pathway" : "Free Syllabus"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">{course.title}</h1>
              <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{course.description}</p>
            </div>
          </div>

          {/* Right Column: Checkout Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl border border-white/5 bg-[#0b0a1d]/60 backdrop-blur-md shadow-2xl space-y-6">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Pathway Price</span>
                <div className="text-3xl font-black text-white mt-1">
                  {course.price > 0 ? `₹${course.price.toFixed(2)}` : "FREE"}
                </div>
              </div>

              {course.instructor && (
                <div className="p-4 rounded-2xl bg-[#070710]/40 border border-white/5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#8b5cf6]/10 flex items-center justify-center text-[#8b5cf6] font-bold">
                    {course.instructor.avatar ? <img src={course.instructor.avatar} className="w-full h-full object-cover rounded-full" /> : <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lead Instructor</span>
                    <Link href={`/instructors/${course.instructor.id}`} className="text-xs font-black text-white hover:text-[#f97316] transition">
                      {course.instructor.name || "LearnUp Mentor"}
                    </Link>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-white/5 space-y-4">
                {isEnrolled ? (
                  <div className="w-full py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Already Enrolled
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={buying}
                    className="w-full py-3.5 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-black uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {buying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enroll in Pathway"}
                  </button>
                )}

                {session && course.price > 0 && (
                  <div className="flex justify-between items-center text-xs text-slate-400 bg-[#070710]/40 p-3.5 rounded-2xl border border-white/5">
                    <span className="flex items-center gap-1"><Wallet className="w-3.5 h-3.5" /> Wallet Balance:</span>
                    <span className="font-bold text-white">₹{walletBalance.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
