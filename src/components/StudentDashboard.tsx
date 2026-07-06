"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import { 
  BookOpen, 
  Wallet, 
  BarChart2, 
  FolderOpen, 
  Award, 
  HelpCircle, 
  Settings, 
  LogOut, 
  Search, 
  Flame, 
  CheckCircle, 
  X,
  CreditCard,
  History,
  TrendingUp,
  Mail,
  User,
  ShieldCheck,
  Send,
  MessageSquare
} from "lucide-react";
import NotificationBell from "@/components/NotificationBell";
import GlobalSearch from "@/components/GlobalSearch";
import SettingsForm from "@/components/settings/SettingsForm";
import QuizLobby from "./student/QuizLobby";
import ResourcesList from "./student/ResourcesList";
import CertificatesList from "./student/CertificatesList";
import MentorQA from "./student/MentorQA";
import LiveClassRoom from "./live/LiveClassRoom";

interface StudentDashboardProps {
  onLogout?: () => void;
  user?: any;
}

export default function StudentDashboard({ onLogout, user }: StudentDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Data States
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loadingWallet, setLoadingWallet] = useState(false);
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  
  const [streak, setStreak] = useState<number>(0);
  const [loadingStreak, setLoadingStreak] = useState(false);
  
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [resources, setResources] = useState<any[]>([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loadingCertificates, setLoadingCertificates] = useState(false);
  const [mentorThreads, setMentorThreads] = useState<any[]>([]);
  const [loadingMentorThreads, setLoadingMentorThreads] = useState(false);
  
  const [liveSessions, setLiveSessions] = useState<any[]>([]);
  const [loadingLiveSessions, setLoadingLiveSessions] = useState(false);
  const [activeLiveRoom, setActiveLiveRoom] = useState<any>(null);

  const [currentUser, setCurrentUser] = useState<any>(user || null);

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  // Modals & Action States
  const [topUpAmount, setTopUpAmount] = useState<string>("");
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [buying, setBuying] = useState(false);
  const [topUpLoading, setTopUpLoading] = useState(false);

  // Lecture / Video Player States
  const [activeLectureCourse, setActiveLectureCourse] = useState<any>(null);
  const [lectureModules, setLectureModules] = useState<any[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState<number>(0);
  const [completedModules, setCompletedModules] = useState<Record<string, boolean>>({});
  const [showCongratulationsModal, setShowCongratulationsModal] = useState<boolean>(false);
  const [loadingLectures, setLoadingLectures] = useState<boolean>(false);

  const enterLecture = async (course: any) => {
    setActiveLectureCourse(course);
    setLoadingLectures(true);
    setCurrentModuleIndex(0);
    try {
      const res = await fetch(`/api/courses/${course.id}/modules`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setLectureModules(data);
          setLoadingLectures(false);
          return;
        }
      }
      // Fallback to course.modules JSON field
      let parsed = [];
      if (course.modules) {
        parsed = typeof course.modules === "string" ? JSON.parse(course.modules) : course.modules;
      }
      // Normalize to list
      const normalized = parsed.map((mod: any, idx: number) => ({
        id: mod.id || `mod-${idx}-${Date.now()}`,
        title: mod.title || `Module ${idx + 1}`,
        videoUrl: mod.url || mod.videoUrl || "",
        order: idx + 1,
        duration: mod.duration || "10 mins"
      }));
      setLectureModules(normalized);
    } catch (err) {
      console.error("Lecture modules fetch failed:", err);
    } finally {
      setLoadingLectures(false);
    }
  };

  // Support Form State
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportStatus, setSupportStatus] = useState<string | null>(null);
  const [supportLoading, setSupportLoading] = useState(false);

  useEffect(() => {
    if (user) return;
    const handleProfileUpdate = () => {
      const userStr = localStorage.getItem("learnup_user");
      if (userStr) {
        try {
          setCurrentUser(JSON.parse(userStr));
        } catch (e) {
          console.error(e);
        }
      }
    };

    handleProfileUpdate();
    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, []);

  // Fetch all necessary data
  const fetchData = async () => {
    if (!currentUser) return;
    
    setLoadingCourses(true);
    setLoadingWallet(true);
    setLoadingTransactions(true);
    setLoadingStreak(true);
    setLoadingSubmissions(true);
    setLoadingLiveSessions(true);

    try {
      // 1. Fetch courses
      const courseRes = await fetch(`/api/courses?userId=${currentUser.id}`);
      if (courseRes.ok) {
        const data = await courseRes.json();
        setCourses(data);
      }

      // 2. Fetch Wallet balance
      const walletRes = await fetch(`/api/payout/wallet?userId=${currentUser.id}`);
      if (walletRes.ok) {
        const data = await walletRes.json();
        setWalletBalance(data.balance || 0);
      }

      // 3. Fetch transaction history
      const txRes = await fetch(`/api/payment/history?userId=${currentUser.id}`);
      if (txRes.ok) {
        const data = await txRes.json();
        setTransactions(data);
      }

      // 4. Fetch Streak
      const streakRes = await fetch("/api/user/streak");
      if (streakRes.ok) {
        const data = await streakRes.json();
        setStreak(data.streak || 0);
      }

      // 5. Fetch submissions
      const submissionsRes = await fetch("/api/submissions");
      if (submissionsRes.ok) {
        const data = await submissionsRes.json();
        const mySubs = data.filter((s: any) => s.studentId === currentUser.id);
        setSubmissions(mySubs);
      }

      // 6. Fetch Quizzes
      const quizzesRes = await fetch("/api/quizzes");
      if (quizzesRes.ok) {
        setQuizzes(await quizzesRes.json());
      }

      // 7. Fetch Certificates
      const certRes = await fetch("/api/student/certificates");
      if (certRes.ok) {
        setCertificates(await certRes.json());
      }

      // 8. Fetch Resources
      const resRes = await fetch("/api/student/resources");
      if (resRes.ok) {
        setResources(await resRes.json());
      }

      // 9. Fetch Mentor Threads
      const threadRes = await fetch("/api/mentor/messages");
      if (threadRes.ok) {
        setMentorThreads(await threadRes.json());
      }

      // 10. Fetch Live Sessions
      const liveRes = await fetch("/api/live");
      if (liveRes.ok) {
        setLiveSessions(await liveRes.json());
      }
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoadingCourses(false);
      setLoadingWallet(false);
      setLoadingTransactions(false);
      setLoadingStreak(false);
      setLoadingSubmissions(false);
      setLoadingQuizzes(false);
      setLoadingCertificates(false);
      setLoadingResources(false);
      setLoadingMentorThreads(false);
      setLoadingLiveSessions(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetchData();
    }
  }, [currentUser]);

  // Load Razorpay Checkout Script
  useEffect(() => {
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);

  // Razorpay Payment Top-Up
  const handleTopUp = async () => {
    const amt = parseFloat(topUpAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid top-up amount");
      return;
    }
    setTopUpLoading(true);

    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amt,
          userId: currentUser.id,
        })
      });

      if (!res.ok) throw new Error("Failed to initialize top-up");

      const orderData = await res.json();

      // Sandbox flow check
      if (orderData.id.startsWith("order_mock_")) {
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: orderData.id,
            razorpay_payment_id: `pay_mock_${Date.now()}`,
            razorpay_signature: "mock_signature",
          })
        });
        if (verifyRes.ok) {
          toast.success("Wallet topped up successfully (Sandbox Mode)!");
          setTopUpModalOpen(false);
          setTopUpAmount("");
          fetchData();
        } else {
          toast.error("Failed to verify top-up in Sandbox.");
        }
        setTopUpLoading(false);
        return;
      }

      // Real Razorpay integration
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_T8ZU2nOxnPTQvI",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "LearnUp LMS Wallet",
        description: `Top up Wallet by ₹${amt}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            });

            if (verifyRes.ok) {
              toast.success("Wallet Top-up Successful!");
              setTopUpModalOpen(false);
              setTopUpAmount("");
              fetchData();
            } else {
              toast.error("Top-up signature verification failed.");
            }
          } catch (e) {
            console.error(e);
            toast.error("Verification request failed.");
          }
        },
        prefill: {
          name: currentUser.name || "Student",
          email: currentUser.email || "",
        },
        theme: {
          color: "#8b5cf6",
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || "Failed to process wallet top-up");
    } finally {
      setTopUpLoading(false);
    }
  };

  // Direct purchase via Razorpay Checkout
  const handleBuyWithRazorpay = async () => {
    if (!selectedCourse) return;
    setBuying(true);

    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedCourse.price,
          userId: currentUser.id,
          courseId: selectedCourse.id
        })
      });

      if (!res.ok) throw new Error("Failed to create purchase order");
      const orderData = await res.json();

      // Sandbox flow check
      if (orderData.id.startsWith("order_mock_")) {
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: orderData.id,
            razorpay_payment_id: `pay_mock_${Date.now()}`,
            razorpay_signature: "mock_signature",
          })
        });
        if (verifyRes.ok) {
          toast.success(`Successfully enrolled in ${selectedCourse.title} (Sandbox Mode)!`);
          setPurchaseModalOpen(false);
          fetchData();
        } else {
          toast.error("Sandbox enrollment verification failed.");
        }
        setBuying(false);
        return;
      }

      // Real Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_T8ZU2nOxnPTQvI",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "LearnUp LMS",
        description: `Enroll in ${selectedCourse.title}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            });

            if (verifyRes.ok) {
              toast.success("Payment Verified! You are now enrolled.");
              setPurchaseModalOpen(false);
              fetchData();
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (e) {
            console.error(e);
            toast.error("Verification failed.");
          }
        },
        prefill: {
          name: currentUser.name || "Student",
          email: currentUser.email || "",
        },
        theme: {
          color: "#8b5cf6",
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || "Failed to initialize payment");
    } finally {
      setBuying(false);
    }
  };

  // Buy course using Wallet Balance
  const handleBuyWithWallet = async () => {
    if (!selectedCourse) return;
    if (walletBalance < selectedCourse.price) {
      toast.error("Insufficient wallet balance. Please top up first.");
      return;
    }
    setBuying(true);

    try {
      const res = await fetch("/api/payment/wallet-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: selectedCourse.id })
      });

      if (res.ok) {
        const msg = selectedCourse.price === 0 
          ? `Successfully enrolled in ${selectedCourse.title} for free!` 
          : `Successfully enrolled in ${selectedCourse.title} using Wallet Balance!`;
        toast.error(msg);
        setPurchaseModalOpen(false);
        fetchData();
      } else {
        const data = await res.json();
        toast.error(data.error || "Wallet purchase failed.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error processing wallet purchase.");
    } finally {
      setBuying(false);
    }
  };

  // Support Ticket Submission
  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportSubject || !supportMessage) return;
    setSupportLoading(true);
    setSupportStatus(null);

    try {
      const res = await fetch("/api/support/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: supportSubject,
          message: supportMessage,
        })
      });

      if (res.ok) {
        setSupportStatus("success");
        setSupportSubject("");
        setSupportMessage("");
      } else {
        setSupportStatus("error");
      }
    } catch (e) {
      setSupportStatus("error");
    } finally {
      setSupportLoading(false);
    }
  };

  // Filter courses based on query
  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const enrolledCourses = courses.filter((c) => c.isEnrolled);
  const premiumCourses = courses.filter((c) => c.price > 0);

  // Stats calculation
  const totalEnrolled = enrolledCourses.length;
  const quizzesTaken = submissions.length;
  const avgPerformance = quizzesTaken > 0 
    ? Math.round(submissions.reduce((acc, s) => acc + s.score, 0) / quizzesTaken) 
    : 0;
  const certificatesEarned = submissions.filter((s) => s.score >= 80).length;

  return (
    <div className="flex h-screen w-full bg-[#080710] text-[#f1f5f9] antialiased overflow-hidden font-sans relative">
      {/* Background blur effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />

      {/* 1. SIDEBAR */}
      <aside className="w-64 flex flex-col h-full bg-[#070710] border-r border-white/5 sticky left-0 top-0 z-50 p-4 gap-2 shrink-0">
        
        {/* BRAND IDENTITY */}
        <div className="flex items-center gap-3 px-3 py-5 border-b border-white/5 mb-4">
          <svg className="h-9 w-9 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="logo-grad-student" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#f97316", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#8b5cf6", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <rect width="200" height="200" rx="40" fill="transparent" />
            <path d="M60 40 V140 H140" stroke="url(#logo-grad-student)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M110 90 L140 60 L170 90" stroke="#8b5cf6" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M140 60 V120" stroke="#8b5cf6" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <div>
            <span className="text-xl font-black text-white tracking-tight block leading-none">
              LearnUp
            </span>
            <p className="text-[9px] font-black tracking-widest text-[#f97316] uppercase block mt-1">
              STUDENT HUB
            </p>
          </div>
        </div>

        {/* SIDEBAR TABS NAV */}
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {[
            { id: "dashboard", label: "Dashboard", icon: BookOpen },
            { id: "courses", label: "Course Catalog", icon: FolderOpen },
            { id: "live-sessions", label: "Live Sessions", icon: Flame },
            { id: "quizzes", label: "Quiz Lobby", icon: CheckCircle },
            { id: "resources", label: "Resources", icon: FolderOpen },
            { id: "certificates", label: "Certificates", icon: Award },
            { id: "mentor-qa", label: "Mentor Q&A", icon: MessageSquare },
            { id: "wallet", label: "Wallet & Payments", icon: Wallet },
            { id: "analytics", label: "Analytics Hub", icon: BarChart2 },
            { id: "support", label: "Support Center", icon: HelpCircle },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition relative cursor-pointer ${
                  isActive
                    ? "bg-[#140e2d]/80 text-[#f97316]"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 w-[3px] h-5 bg-gradient-to-b from-[#8b5cf6] to-[#f97316] rounded-full" />
                )}
                <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-[#f97316]" : "text-slate-500"}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-3">
          <button
            onClick={() => {
              if (onLogout) onLogout();
              signOut({ callbackUrl: '/' });
            }}
            className="flex items-center justify-center gap-2 border border-white/10 bg-transparent hover:bg-white/5 text-slate-300 hover:text-white transition w-full py-2 px-3 rounded-full text-xs font-bold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-y-auto h-screen relative">
        
        {/* HEADER */}
        <header className="h-16 border-b border-white/5 flex justify-between items-center px-8 bg-[#080710]/40 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <GlobalSearch />
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="w-px h-6 bg-white/10 mx-1"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-black text-slate-200 leading-tight">{currentUser?.name || "Student"}</p>
                <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mt-0.5">Premium Student</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-extrabold text-sm border border-white/10 shadow-sm shadow-purple-500/10">
                {(currentUser?.name || "S")[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* CONTAINER */}
        <div className="p-8 max-w-[1200px] w-full mx-auto space-y-8 flex-1 pb-16">
          
          {/* LECTURE VIDEO PLAYER AREA */}
          {activeLectureCourse ? (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveLectureCourse(null)}
                    className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-300 hover:bg-white/10 transition cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm select-none">arrow_back</span>
                  </button>
                  <div>
                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">Active Media Node</span>
                    <h2 className="text-xl font-black text-white mt-1">{activeLectureCourse.title}</h2>
                  </div>
                </div>
                <button
                  onClick={() => setActiveLectureCourse(null)}
                  className="text-xs font-bold text-slate-400 hover:text-white transition"
                >
                  Exit Lecture
                </button>
              </div>

              {loadingLectures ? (
                <div className="text-center py-20 text-slate-400 text-sm">Loading course lecture matrix...</div>
              ) : lectureModules.length === 0 ? (
                <div className="p-12 text-center rounded-3xl border border-white/5 bg-[#0b0a1d]/60 text-slate-400">
                  No video modules loaded for this pathway yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Player column */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="aspect-video w-full rounded-3xl border border-white/5 bg-black overflow-hidden shadow-2xl relative">
                      {lectureModules[currentModuleIndex]?.videoUrl ? (
                        lectureModules[currentModuleIndex].videoUrl.includes("youtube.com") || lectureModules[currentModuleIndex].videoUrl.includes("youtu.be") ? (
                          <iframe
                            className="w-full h-full"
                            src={lectureModules[currentModuleIndex].videoUrl.replace("watch?v=", "embed/")}
                            title={lectureModules[currentModuleIndex].title}
                            allowFullScreen
                          />
                        ) : lectureModules[currentModuleIndex].videoUrl.includes("vimeo.com") ? (
                          <iframe
                            className="w-full h-full"
                            src={`https://player.vimeo.com/video/${lectureModules[currentModuleIndex].videoUrl.split("/").pop()}`}
                            title={lectureModules[currentModuleIndex].title}
                            allowFullScreen
                          />
                        ) : (
                          <video
                            key={lectureModules[currentModuleIndex].id}
                            className="w-full h-full object-cover"
                            controls
                            src={lectureModules[currentModuleIndex].videoUrl}
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                          <span className="material-symbols-outlined text-4xl mb-2">videocam_off</span>
                          <span className="text-xs">No video stream linked for this module</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 rounded-3xl border border-white/5 bg-[#0b0a1d]/60 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Module {currentModuleIndex + 1} of {lectureModules.length}</span>
                          <h3 className="text-lg font-black text-slate-100 mt-1">{lectureModules[currentModuleIndex]?.title}</h3>
                        </div>
                        <span className="text-xs font-bold text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg">{lectureModules[currentModuleIndex]?.duration || "45 mins"}</span>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                        <button
                          disabled={currentModuleIndex === 0}
                          onClick={() => setCurrentModuleIndex(prev => prev - 1)}
                          className="px-4 py-2 border border-white/10 rounded-xl font-bold text-xs hover:bg-white/5 transition text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Previous Module
                        </button>
                        <button
                          onClick={() => {
                            const modId = lectureModules[currentModuleIndex].id;
                            const isLast = currentModuleIndex + 1 === lectureModules.length;
                            setCompletedModules(prev => ({ ...prev, [modId]: true }));
                            if (isLast) {
                              setShowCongratulationsModal(true);
                            } else {
                              setCurrentModuleIndex(prev => prev + 1);
                            }
                          }}
                          className="px-5 py-2.5 bg-[#f97316] text-white hover:bg-[#ea580c] transition rounded-xl font-bold text-xs flex items-center gap-1 shadow-lg shadow-orange-500/10 cursor-pointer"
                        >
                          {currentModuleIndex + 1 === lectureModules.length ? "Complete Course" : "Mark Complete & Next"}
                          <span className="material-symbols-outlined text-sm select-none">check_circle</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Modules Sidebar column */}
                  <div className="space-y-4">
                    <div className="p-6 rounded-3xl border border-white/5 bg-[#0b0a1d]/60 space-y-4">
                      <h4 className="text-xs font-black tracking-widest text-slate-400 uppercase">Syllabus Pathway</h4>
                      <div className="space-y-2">
                        {lectureModules.map((mod, idx) => {
                          const isActive = idx === currentModuleIndex;
                          const isCompleted = completedModules[mod.id];
                          return (
                            <button
                              key={mod.id}
                              onClick={() => setCurrentModuleIndex(idx)}
                              className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3 transition-all duration-200 cursor-pointer ${
                                isActive
                                  ? "border-[#8b5cf6] bg-[#8b5cf6]/10 text-white"
                                  : "border-white/5 hover:border-white/10 hover:bg-white/5 text-slate-400"
                              }`}
                            >
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 text-[10px] font-bold ${
                                isCompleted
                                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                                  : isActive
                                  ? "border-purple-400 text-purple-400"
                                  : "border-slate-600 text-slate-500"
                              }`}>
                                {isCompleted ? (
                                  <span className="material-symbols-outlined text-xs select-none">check</span>
                                ) : (
                                  idx + 1
                                )}
                              </span>
                              <div className="flex-1 space-y-0.5">
                                <p className={`text-xs font-bold ${isActive ? "text-white" : "text-slate-200"}`}>{mod.title}</p>
                                <p className="text-[10px] text-slate-400">{mod.duration || "45 mins"}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === "live-sessions" && activeLiveRoom ? (
            <div className="space-y-6 animate-fadeIn h-full flex flex-col">
              <div className="flex items-center justify-between border-b border-white/5 pb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveLiveRoom(null)}
                    className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-300 hover:bg-white/10 transition cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm select-none">arrow_back</span>
                  </button>
                  <div>
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 flex items-center gap-1 w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> LIVE
                    </span>
                    <h2 className="text-xl font-black text-white mt-1">Live Class Session</h2>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <LiveClassRoom
                  roomId={activeLiveRoom.roomName}
                  courseTitle={courses.find(c => c.id === activeLiveRoom.courseId)?.title || "Live Session"}
                  isInstructor={false}
                  user={currentUser || { name: "Student" }}
                  onLeave={() => setActiveLiveRoom(null)}
                />
              </div>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <div className="space-y-8 animate-fadeIn">
              
              {/* Welcome Header */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col justify-center space-y-2">
                  <span className="text-[10px] font-black tracking-widest text-purple-400 uppercase">STUDENT COMMAND</span>
                  <h1 className="text-3xl font-black tracking-tight text-white">Welcome back, {currentUser?.name || "Student"}</h1>
                  <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
                    Track your daily streak, enroll in modern technical paths, and explore course modules in the catalog.
                  </p>
                </div>
                
                {/* STREAK CARD */}
                <div className="p-6 rounded-3xl border border-white/5 bg-[#0b0a1d]/60 backdrop-blur-md shadow-lg flex items-center justify-between relative overflow-hidden group">
                  <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-purple-600/10 blur-2xl group-hover:scale-150 transition-transform duration-500" />
                  <div className="space-y-2">
                    <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">DAILY STREAK</span>
                    <h3 className="text-3xl font-black text-white">{streak} Days Active</h3>
                    <p className="text-xs text-purple-300 font-semibold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-purple-400 animate-pulse fill-purple-400" />
                      Login tomorrow to keep it hot!
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Flame className="w-8 h-8 fill-purple-400" />
                  </div>
                </div>
              </div>

              {/* STATS MATRIX */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: "Courses Enrolled", value: totalEnrolled, icon: BookOpen, color: "text-purple-400 bg-purple-600/5 border-purple-500/10" },
                  { name: "Quizzes Taken", value: quizzesTaken, icon: ShieldCheck, color: "text-teal-400 bg-teal-600/5 border-teal-500/10" },
                  { name: "Avg Performance %", value: `${avgPerformance}%`, icon: TrendingUp, color: "text-amber-400 bg-amber-600/5 border-amber-500/10" },
                  { name: "Certificates Earned", value: certificatesEarned, icon: Award, color: "text-emerald-400 bg-emerald-600/5 border-emerald-500/10" },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="p-5 rounded-3xl border border-white/5 bg-[#0b0a1d]/60 backdrop-blur-md shadow-lg space-y-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#8b5cf6]/5 hover:border-[#8b5cf6]/20">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase">{stat.name}</span>
                        <div className={`p-2 rounded-xl border ${stat.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <h4 className="text-2xl font-black text-slate-100">{stat.value}</h4>
                    </div>
                  );
                })}
              </div>

              {/* CURRENT LEARNING ENROLLMENTS */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-200">Enrolled Programs</h3>
                {enrolledCourses.length === 0 ? (
                  <div className="p-8 rounded-3xl border border-white/5 bg-[#0b0a1d]/60 text-center space-y-4">
                    <p className="text-slate-400 text-sm">You haven't enrolled in any courses yet.</p>
                    <button
                      onClick={() => setActiveTab("courses")}
                      className="px-5 py-2.5 rounded-full bg-[#f97316] text-white font-extrabold text-xs cursor-pointer hover:bg-[#ea580c] transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10"
                    >
                      Browse Course Catalog
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.map((c) => (
                      <div key={c.id} className="rounded-3xl border border-white/5 bg-[#0b0a1d]/60 overflow-hidden shadow-lg hover:border-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#8b5cf6]/5 hover:border-[#8b5cf6]/30 flex flex-col justify-between">
                        <img src={c.image} alt={c.title} className="w-full h-40 object-cover border-b border-white/5" />
                        <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            <h4 className="font-extrabold text-slate-100 text-sm line-clamp-1">{c.title}</h4>
                            <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>
                            {c.instructor && (
                              <div className="mt-2 text-[10px] text-slate-500 flex flex-col gap-0.5">
                                <span className="font-semibold text-slate-300">Instructor: {c.instructor.name || "LearnUp Expert"}</span>
                                <span className="font-mono text-purple-400/80">ID: {c.instructor.learnupId?.startsWith("LUP-") ? c.instructor.learnupId : `LUP-2026-${(c.instructor.learnupId || c.instructor.id).substring(0,4).toUpperCase()}`}</span>
                              </div>
                            )}
                          </div>
                          <div className="pt-2 flex justify-between items-center border-t border-white/5">
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider">
                              Enrolled
                            </span>
                            <button 
                              onClick={() => enterLecture(c)}
                              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                            >
                              Enter Lecture
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: COURSE CATALOG */}
          {activeTab === "courses" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-purple-400 uppercase">CURATED PATHS</span>
                  <h2 className="text-2xl font-black text-white">Course Catalog</h2>
                  <p className="text-xs text-slate-400 mt-1">Select from 40+ courses. Explore our premium programs priced in INR (₹).</p>
                </div>
              </div>

              {loadingCourses ? (
                <div className="text-center py-12 text-slate-400 text-sm">Loading course catalog...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((c) => {
                    const isPremium = c.price > 0;
                    return (
                      <div key={c.id} className="rounded-3xl border border-white/5 bg-[#0b0a1d]/60 overflow-hidden shadow-lg hover:border-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#8b5cf6]/5 hover:border-[#8b5cf6]/30 flex flex-col justify-between">
                        <img src={c.image} alt={c.title} className="w-full h-40 object-cover border-b border-white/5" />
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                isPremium 
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                                  : "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                              }`}>
                                {isPremium ? "Premium" : "Free"}
                              </span>
                              {isPremium && (
                                <span className="text-xs font-black text-purple-300">₹{c.price}</span>
                              )}
                            </div>
                            <h4 className="font-extrabold text-slate-100 text-sm line-clamp-1">{c.title}</h4>
                            <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>
                            {c.instructor && (
                              <div className="mt-2 text-[10px] text-slate-500 flex flex-col gap-0.5">
                                <span className="font-semibold text-slate-300">Instructor: {c.instructor.name || "LearnUp Expert"}</span>
                                <span className="font-mono text-purple-400/80">ID: {c.instructor.learnupId?.startsWith("LUP-") ? c.instructor.learnupId : `LUP-2026-${(c.instructor.learnupId || c.instructor.id).substring(0,4).toUpperCase()}`}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="pt-2 border-t border-white/5">
                             {c.isEnrolled ? (
                              <button className="w-full py-2 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 text-[#8b5cf6] text-xs font-bold cursor-pointer" disabled>
                                Already Enrolled
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  if (c.price > 0 && walletBalance < c.price) {
                                    toast.error(`Insufficient wallet balance. Redirecting to Top-Up screen to add funds.`);
                                    setSelectedCourse(c);
                                    setActiveTab("wallet");
                                    setTopUpAmount(String(c.price - walletBalance));
                                    setTopUpModalOpen(true);
                                    return;
                                  }
                                  setSelectedCourse(c);
                                  setPurchaseModalOpen(true);
                                }}
                                className="w-full py-2.5 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-extrabold cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10"
                              >
                                Enroll Now
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {activeTab === "quizzes" && (
            <QuizLobby quizzes={quizzes} currentUser={currentUser} />
          )}

          {activeTab === "resources" && (
            <ResourcesList resources={resources} />
          )}

          {activeTab === "certificates" && (
            <CertificatesList certificates={certificates} />
          )}

          {activeTab === "mentor-qa" && (
            <MentorQA mentorThreads={mentorThreads} currentUser={currentUser} />
          )}

          {/* TAB 3: WALLET & PAYMENTS */}
          {activeTab === "wallet" && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <span className="text-[10px] font-black tracking-widest text-purple-400 uppercase">LEDGER BALANCE</span>
                <h2 className="text-2xl font-black text-white">Student Wallet</h2>
                <p className="text-xs text-slate-400 mt-1">Track your program spending, course credits, and add funds securely via Razorpay Checkout.</p>
              </div>

              {/* Balance Widget */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 rounded-3xl border border-white/5 bg-[#0b0a1d]/60 backdrop-blur-md shadow-lg flex flex-col justify-between space-y-6 relative overflow-hidden group">
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-purple-600/10 blur-3xl group-hover:scale-150 transition-transform duration-500" />
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">AVAILABLE WALLET FUNDS</span>
                      <h3 className="text-4xl font-black text-white">₹{walletBalance.toFixed(2)}</h3>
                    </div>
                    <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                      <Wallet className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setTopUpModalOpen(true)}
                      className="px-5 py-2.5 rounded-full bg-purple-500 hover:bg-purple-600 text-white font-extrabold text-xs cursor-pointer transition flex items-center gap-2"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Top Up Wallet
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-3xl border border-white/5 bg-[#0b0a1d]/60 backdrop-blur-md shadow-lg flex flex-col justify-between space-y-4">
                  <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase font-black">CREDITS & STATS</span>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-xs text-slate-400">Enrolled Premium Programs:</span>
                      <span className="text-xs font-extrabold text-white">{enrolledCourses.filter((e) => e.price > 0).length}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-xs text-slate-400">Total Spent:</span>
                      <span className="text-xs font-extrabold text-purple-300">₹{transactions.reduce((acc, t) => acc + t.amount, 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400">Transactions Count:</span>
                      <span className="text-xs font-extrabold text-white">{transactions.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions list */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-200 flex items-center gap-2">
                  <History className="w-5 h-5 text-slate-400" />
                  Transaction Registry
                </h3>
                
                {loadingTransactions ? (
                  <div className="text-slate-400 text-sm">Loading transaction registry...</div>
                ) : transactions.length === 0 ? (
                  <div className="p-8 rounded-3xl border border-white/5 bg-[#0b0a1d]/60 text-center text-slate-400 text-sm">
                    No transactions found in this wallet.
                  </div>
                ) : (
                  <div className="rounded-3xl border border-white/5 bg-[#0b0a1d]/60 overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 text-slate-400 text-[10px] font-black tracking-wider uppercase bg-[#070710]/40">
                            <th className="py-3.5 px-6">Order ID</th>
                            <th className="py-3.5 px-6">Payment ID</th>
                            <th className="py-3.5 px-6">Amount</th>
                            <th className="py-3.5 px-6">Status</th>
                            <th className="py-3.5 px-6 text-right">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-300 text-xs">
                          {transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                              <td className="py-4 px-6 font-mono text-purple-300">{tx.razorpayOrderId}</td>
                              <td className="py-4 px-6 font-mono text-slate-400">{tx.razorpayPaymentId || "N/A"}</td>
                              <td className="py-4 px-6 font-extrabold text-white">₹{tx.amount}</td>
                              <td className="py-4 px-6">
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                                  tx.status === "SUCCESS" 
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                }`}>
                                  {tx.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right text-slate-500">
                                {new Date(tx.createdAt).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ANALYTICS HUB */}
          {activeTab === "analytics" && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <span className="text-[10px] font-black tracking-widest text-purple-400 uppercase">DYNAMIC TELEMETRY</span>
                <h2 className="text-2xl font-black text-white">Performance Analytics</h2>
                <p className="text-xs text-slate-400 mt-1">Review live student progress parameters. Connected to databases.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stats Summary Card */}
                <div className="p-6 rounded-3xl border border-white/5 bg-[#0b0a1d]/60 space-y-6">
                  <h4 className="font-extrabold text-slate-100 text-sm">Key Metrics</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-xs text-slate-400">Total Enrolled Courses</span>
                      <span className="text-sm font-extrabold text-white">{totalEnrolled}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-xs text-slate-400">Quiz Submissions Submitted</span>
                      <span className="text-sm font-extrabold text-teal-400">{quizzesTaken}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-xs text-slate-400">Passed (Score &gt;= 80%)</span>
                      <span className="text-sm font-extrabold text-emerald-400">{certificatesEarned}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Overall Average Score</span>
                      <span className="text-sm font-extrabold text-amber-400">{avgPerformance}%</span>
                    </div>
                  </div>
                </div>

                {/* Submissions Summary */}
                <div className="p-6 rounded-3xl border border-white/5 bg-[#0b0a1d]/60 space-y-4 flex flex-col justify-between">
                  <h4 className="font-extrabold text-slate-100 text-sm">Passed Quizzes & Certificates</h4>
                  {submissions.length === 0 ? (
                    <div className="text-slate-400 text-xs py-8 text-center">No quiz submissions found. Attempt quizzes to earn certificates!</div>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {submissions.map((sub) => {
                        const passed = sub.score >= 80;
                        return (
                          <div key={sub.id} className="p-3 rounded-2xl bg-[#070710]/40 border border-white/5 flex justify-between items-center">
                            <div>
                              <p className="text-xs font-bold text-white line-clamp-1">{sub.quizTitle}</p>
                              <p className="text-[10px] text-slate-500">{new Date(sub.submittedAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className={`text-xs font-extrabold ${passed ? "text-emerald-400" : "text-amber-400"}`}>{sub.score}%</p>
                              <span className="text-[9px] text-slate-500 uppercase tracking-widest">{passed ? "Passed" : "Attempted"}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SUPPORT CENTER */}
          {activeTab === "support" && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <span className="text-[10px] font-black tracking-widest text-purple-400 uppercase">HELP & FEEDBACK</span>
                <h2 className="text-2xl font-black text-white">Support Center</h2>
                <p className="text-xs text-slate-400 mt-1">Submit feedback or request administrative support. All tickets save to our live database.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 rounded-3xl border border-white/5 bg-[#0b0a1d]/60 backdrop-blur-md shadow-lg space-y-6">
                  <h4 className="font-extrabold text-slate-100 text-sm flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-400" />
                    Submit Support Request
                  </h4>

                  <form onSubmit={handleSupportSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase">Subject Title</label>
                      <input
                        type="text"
                        required
                        value={supportSubject}
                        onChange={(e) => setSupportSubject(e.target.value)}
                        placeholder="e.g. Ingress Network connectivity lag, Payment checkout timeout..."
                        className="w-full px-4 py-3 bg-[#070710]/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 placeholder:text-slate-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase">Message Details</label>
                      <textarea
                        required
                        rows={5}
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        placeholder="Describe the issue in detail..."
                        className="w-full px-4 py-3 bg-[#070710]/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 placeholder:text-slate-500"
                      />
                    </div>

                    {supportStatus === "success" && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Ticket submitted successfully and saved to DB!
                      </div>
                    )}

                    {supportStatus === "error" && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
                        <X className="w-4 h-4" />
                        Failed to submit support ticket. Please try again.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={supportLoading}
                      className="px-5 py-2.5 rounded-full bg-purple-500 hover:bg-purple-600 text-white font-extrabold text-xs cursor-pointer transition flex items-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {supportLoading ? "Submitting..." : "Submit Ticket"}
                    </button>
                  </form>
                </div>

                <div className="p-6 rounded-3xl border border-white/5 bg-[#0b0a1d]/60 shadow-lg space-y-4">
                  <h4 className="font-extrabold text-slate-100 text-sm">Escalation Policy</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Once submitted, your ticket is posted directly to our system database. Admin operators oversee the command center and will resolve your query within 24 hours.
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Check your system notifications bell at the top header for answers or status updates regarding your tickets.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === "settings" && (
            <div className="animate-fadeIn">
              <SettingsForm user={currentUser} />
            </div>
          )}

          {activeTab === "live-sessions" && !activeLiveRoom && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <Flame className="w-6 h-6 text-[#f97316]" /> Live Sessions
                </h2>
                <p className="text-sm text-slate-400 mt-1">Join interactive live classes for your enrolled courses.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loadingLiveSessions ? (
                  <div className="col-span-full py-12 text-center text-slate-400">Loading active sessions...</div>
                ) : liveSessions.length === 0 ? (
                  <div className="col-span-full py-12 text-center rounded-3xl border border-white/5 bg-[#0b0a1d]/60 text-slate-400 flex flex-col items-center">
                    <span className="material-symbols-outlined text-4xl mb-3 opacity-50">videocam_off</span>
                    No active live sessions at the moment.
                  </div>
                ) : (
                  liveSessions.map((session) => {
                    const course = courses.find((c) => c.id === session.courseId);
                    const isEnrolled = course?.isEnrolled;

                    if (!course) return null;

                    return (
                      <div key={session.id} className="p-5 rounded-3xl border border-white/5 bg-[#0b0a1d]/80 relative overflow-hidden flex flex-col h-full group transition-all hover:-translate-y-1 hover:border-white/10 hover:shadow-2xl hover:shadow-[#f97316]/5">
                        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#f97316] to-[#8b5cf6]" />
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                            <Flame className="w-5 h-5 text-orange-500" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-md flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> LIVE
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-white leading-tight mb-2">{course.title}</h3>
                        <p className="text-xs text-slate-400 mb-6">Started {new Date(session.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>

                        <div className="mt-auto">
                          {isEnrolled ? (
                            <button
                              onClick={() => setActiveLiveRoom(session)}
                              className="w-full py-3 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-bold transition shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                            >
                              Join Live <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                          ) : (
                            <div className="w-full py-3 rounded-xl bg-white/5 text-slate-500 text-xs font-bold text-center border border-white/10 flex items-center justify-center gap-2">
                              <span className="material-symbols-outlined text-sm">lock</span>
                              Enroll to Join
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </>
        )}
        </div>
      </main>

      {/* MODALS */}
      
      {/* 1. TOP UP WALLET MODAL */}
      {topUpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 rounded-3xl border border-white/10 bg-[#0b0a1d] shadow-2xl space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h4 className="font-black text-white text-sm">Add Funds to Wallet</h4>
              <button onClick={() => setTopUpModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase">Top Up Amount (INR ₹)</label>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="e.g. 1000"
                  className="w-full px-4 py-2.5 bg-[#070710]/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 placeholder:text-slate-500"
                />
              </div>

              <button
                onClick={handleTopUp}
                disabled={topUpLoading}
                className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-xs font-extrabold cursor-pointer transition disabled:opacity-50"
              >
                {topUpLoading ? "Initializing checkout..." : "Proceed to Checkout"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PURCHASE COURSE CONFIRMATION MODAL */}
      {purchaseModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl border border-white/10 bg-[#0b0a1d] shadow-2xl space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h4 className="font-black text-white text-sm">Enrollment Summary</h4>
              <button onClick={() => setPurchaseModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SELECTED PATHWAY</p>
                <h5 className="font-extrabold text-white text-sm">{selectedCourse.title}</h5>
                <p className="text-xs text-slate-400">{selectedCourse.description}</p>
                {selectedCourse.instructor?.name && (
                  <p className="text-xs font-bold text-[#f97316] mt-2">
                    Purchasing from Instructor: {selectedCourse.instructor.name}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-[#070710]/60 border border-white/5 flex justify-between items-center">
                <span className="text-xs text-slate-400 font-bold uppercase">Price:</span>
                <span className="text-sm font-black text-purple-300">
                  {selectedCourse.price > 0 ? `₹${selectedCourse.price}` : "Free"}
                </span>
              </div>

              {selectedCourse.price > 0 ? (
                <div className="flex flex-col gap-3">
                  {walletBalance >= selectedCourse.price ? (
                    <button
                      onClick={handleBuyWithWallet}
                      disabled={buying}
                      className="w-full py-2.5 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-extrabold cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 disabled:opacity-50"
                    >
                      {buying ? "Processing..." : `Buy Course with Wallet (₹${selectedCourse.price})`}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setPurchaseModalOpen(false);
                        setActiveTab("wallet");
                        setTopUpAmount(String(selectedCourse.price - walletBalance));
                        setTopUpModalOpen(true);
                      }}
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold cursor-pointer transition"
                    >
                      Insufficient Balance - Top Up ₹{(selectedCourse.price - walletBalance).toFixed(2)} via Razorpay
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleBuyWithWallet} // free course bypasses payment splits
                  disabled={buying}
                  className="w-full py-2.5 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-white text-xs font-extrabold cursor-pointer transition"
                >
                  Enroll Instantly (Free)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Congratulations Modal */}
      {showCongratulationsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#0b0a1d] border border-[#8b5cf6]/30 shadow-2xl shadow-[#8b5cf6]/20 rounded-3xl max-w-md w-full p-8 text-center space-y-6 relative overflow-hidden">
            <div className="absolute -left-12 -top-12 w-32 h-32 rounded-full bg-purple-600/20 blur-2xl" />
            <div className="absolute -right-12 -bottom-12 w-32 h-32 rounded-full bg-orange-600/10 blur-2xl" />
            
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#f97316] flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-500/20">
              <span className="material-symbols-outlined text-3xl select-none">workspace_premium</span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">Congratulations!</h3>
              <p className="text-sm text-slate-300">
                You have successfully completed all video modules for <span className="font-extrabold text-[#f97316]">{activeLectureCourse?.title}</span>.
              </p>
              <p className="text-xs text-slate-400">
                You're now ready to challenge the final course assessment blueprint and claim your verified digital credential.
              </p>
            </div>
            
            <div className="pt-4 flex gap-4">
              <button
                onClick={() => {
                  setShowCongratulationsModal(false);
                  setActiveLectureCourse(null);
                  setActiveTab("quizzes");
                }}
                className="flex-1 py-3 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-xl font-extrabold text-xs transition duration-300 shadow-lg shadow-orange-500/10 cursor-pointer animate-pulse"
              >
                Take Course Quiz
              </button>
              <button
                onClick={() => {
                  setShowCongratulationsModal(false);
                }}
                className="py-3 px-5 border border-white/10 rounded-xl text-slate-400 hover:text-white font-bold text-xs hover:bg-white/5 transition cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}