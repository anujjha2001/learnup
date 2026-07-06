"use client";

import React, { useState, useEffect } from "react";
import NotificationBell from "@/components/NotificationBell";
import GlobalSearch from "@/components/GlobalSearch";
import QuizReviewScreen from "./instructor/QuizReviewScreen";
import CourseBuilder from "./instructor/CourseBuilder";
import SettingsForm from "@/components/settings/SettingsForm";
import LiveClassRoom from "./live/LiveClassRoom";

// Strict type parameters for instructor pipeline tracking
type InstructorTabType = 
  | "dashboard" 
  | "courses" 
  | "quizzes"
  | "quiz-review"
  | "students" 
  | "analytics" 
  | "payments" 
  | "settings" 
  | "live-class"
  | "create-course";

interface Question {
  text: string;
  options: string[];
  correctAnswer: number; // 0-3 index
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  questions: Question[];
  createdAt?: string;
}

interface InstructorDashboardProps {
  onLogout?: () => void;
  user?: any;
}

export default function InstructorDashboard({ onLogout, user }: InstructorDashboardProps) {
  const [activeTab, setActiveTab] = useState<InstructorTabType>("dashboard");
  
  // Wallet / Payout states
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [payoutHistory, setPayoutHistory] = useState<any[]>([]);
  const [loadingWallet, setLoadingWallet] = useState<boolean>(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [withdrawModalOpen, setWithdrawModalOpen] = useState<boolean>(false);
  const [withdrawing, setWithdrawing] = useState<boolean>(false);
  const [withdrawError, setWithdrawError] = useState<string>("");

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Submissions review states
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submissionsError, setSubmissionsError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(user || null);

  // Course states
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    price: "199",
    category: "Software Engineering Modules",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=400&auto=format&fit=crop"
  });

  // Quiz Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [quizForm, setQuizForm] = useState({
    title: "",
    description: "",
    courseId: "c1",
    topic: "",
  });
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([
    { text: "", options: ["", "", "", ""], correctAnswer: 0, points: 1 }
  ]);

  // Quiz Preview State
  const [previewQuiz, setPreviewQuiz] = useState<Quiz | null>(null);
  const [previewQuestionIndex, setPreviewQuestionIndex] = useState(0);
  const [previewSelectedAnswer, setPreviewSelectedAnswer] = useState<number | null>(null);
  const [previewScore, setPreviewScore] = useState(0);
  const [previewDone, setPreviewDone] = useState(false);

  // Live Class States
  const [activeLiveSession, setActiveLiveSession] = useState<any>(null);
  const [selectedCourseForLive, setSelectedCourseForLive] = useState("");
  const [isStartingLive, setIsStartingLive] = useState(false);

  const handleStartLiveClass = async () => {
    if (!selectedCourseForLive) return;
    setIsStartingLive(true);
    try {
      const roomName = `room-${Date.now()}`;
      const res = await fetch("/api/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourseForLive,
          instructorId: currentUser?.id || "inst-1",
          roomName
        })
      });
      const data = await res.json();
      if (res.ok) {
        setActiveLiveSession(data);
      } else {
        alert(data.error || "Failed to start live session");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsStartingLive(false);
    }
  };

  const handleEndLiveClass = async () => {
    if (!activeLiveSession) return;
    try {
      await fetch("/api/live", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeLiveSession.id,
          isLive: false
        })
      });
      setActiveLiveSession(null);
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      console.warn("Failed to fetch courses, using defaults.", err);
    } finally {
      setLoadingCourses(false);
    }
  };

  // Fetch quizzes
  const fetchQuizzes = async () => {
    setLoadingQuizzes(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/quizzes");
      if (res.ok) {
        const data = await res.json();
        setQuizzes(data);
      } else {
        const errData = await res.json().catch(() => ({}));
        setErrorMessage(errData.error || "Failed to load quizzes from repository database.");
        throw new Error("Failed to load quizzes from repository database.");
      }
    } catch (err) {
      console.warn("DB offline, using mock local storage fallback.");
      setErrorMessage("Failed to load quizzes from repository database.");
      const stored = localStorage.getItem("instructor_quizzes");
      if (stored) {
        setQuizzes(JSON.parse(stored));
      } else {
        // Seed default
        const defaults: Quiz[] = [
          {
            id: "q1",
            title: "React Architecture Fundamentals",
            description: "Assess understanding of folder architectures, state providers, and module boundaries.",
            courseId: "c1",
            questions: [
              {
                text: "What is the recommended approach for Next.js App Router route components?",
                options: ["Store everything in route.ts", "Use colocated components or a dedicated src/components folder", "Place components inside public/"],
                correctAnswer: 1,
                points: 2
              }
            ]
          }
        ];
        setQuizzes(defaults);
        localStorage.setItem("instructor_quizzes", JSON.stringify(defaults));
      }
    } finally {
      setLoadingQuizzes(false);
    }
  };

  const getInstructorId = () => {
    if (typeof window === "undefined") return "inst-1";
    const userStr = localStorage.getItem("learnup_user");
    if (!userStr) return "inst-1";
    try {
      const u = JSON.parse(userStr);
      return u.id || "inst-1";
    } catch {
      return "inst-1";
    }
  };

  const fetchWallet = async () => {
    setLoadingWallet(true);
    try {
      const uid = getInstructorId();
      const res = await fetch(`/api/payout/wallet?userId=${uid}`);
      if (res.ok) {
        const data = await res.json();
        setWalletBalance(data.balance);
      }
      const historyRes = await fetch(`/api/payout/history?userId=${uid}`);
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setPayoutHistory(historyData);
      }
    } catch (err) {
      console.error("Failed to fetch wallet info:", err);
    } finally {
      setLoadingWallet(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError("");
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt < 500) {
      setWithdrawError("Minimum withdrawal amount is ₹500");
      return;
    }
    setWithdrawing(true);
    try {
      const uid = getInstructorId();
      const res = await fetch("/api/payout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid, amount: withdrawAmount })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process withdrawal");
      }
      setToastMessage(`Successfully withdrew ₹${parseFloat(withdrawAmount).toFixed(2)}`);
      setWithdrawAmount("");
      setWithdrawModalOpen(false);
      fetchWallet(); // Reload wallet balance and history
      
      // Clear toast after 5 seconds
      setTimeout(() => setToastMessage(""), 5000);
    } catch (err: any) {
      setWithdrawError(err.message || "Withdrawal failed");
    } finally {
      setWithdrawing(false);
    }
  };

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const res = await fetch("/api/instructor/students");
      if (res.ok) {
        const data = await res.json();
        setEnrolledStudents(data);
      }
    } catch (e) {
      console.error("Failed to fetch students:", e);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch("/api/instructor/analytics");
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
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

    fetchQuizzes();
    fetchCourses();
    fetchWallet();
    fetchStudents();
    fetchSubmissions();

    return () => window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, []);

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "analytics") {
      fetchAnalytics();
    }
  }, [activeTab]);

  // Fetch submissions from API
  const fetchSubmissions = async () => {
    setLoadingSubmissions(true);
    setSubmissionsError("");
    try {
      const res = await fetch("/api/submissions");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to connect to submissions data service.");
      }
    } catch (err: any) {
      setSubmissionsError(err.message || "Failed to connect to submissions data service.");
      setToastMessage(err.message || "Failed to load student submissions. Using offline state.");
      
      // Fallback seed
      const mockSubmissions = [
        { id: "sub-1", studentId: "std-1", studentName: "Felix Chen", quizId: "q1", quizTitle: "React Architecture Fundamentals", score: 95, submittedAt: new Date(Date.now() - 120000).toISOString() },
        { id: "sub-2", studentId: "std-2", studentName: "Sarah Miller", quizId: "q1", quizTitle: "React Architecture Fundamentals", score: 80, submittedAt: new Date(Date.now() - 900000).toISOString() },
      ];
      setSubmissions(mockSubmissions);
      
      // Clear toast after 5 seconds
      setTimeout(() => setToastMessage(""), 5000);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    if (activeTab === "quiz-review") {
      fetchSubmissions();
    }
  }, [activeTab]);

  // Sync to local storage for offline robustness
  const syncQuizzesState = (updatedQuizzes: Quiz[]) => {
    setQuizzes(updatedQuizzes);
    localStorage.setItem("instructor_quizzes", JSON.stringify(updatedQuizzes));
  };

  // Form question actions
  const handleAddQuestion = () => {
    setQuizQuestions((prev) => [
      ...prev,
      { text: "", options: ["", "", "", ""], correctAnswer: 0, points: 1 }
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (quizQuestions.length > 1) {
      setQuizQuestions((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const handleQuestionTextChange = (idx: number, val: string) => {
    setQuizQuestions((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, text: val } : q))
    );
  };

  const handleOptionChange = (qIdx: number, optIdx: number, val: string) => {
    setQuizQuestions((prev) =>
      prev.map((q, i) => {
        if (i === qIdx) {
          const updatedOpts = [...q.options];
          updatedOpts[optIdx] = val;
          return { ...q, options: updatedOpts };
        }
        return q;
      })
    );
  };

  const handleCorrectAnswerChange = (qIdx: number, val: number) => {
    setQuizQuestions((prev) =>
      prev.map((q, i) => (i === qIdx ? { ...q, correctAnswer: val } : q))
    );
  };

  const handlePointsChange = (qIdx: number, val: number) => {
    setQuizQuestions((prev) =>
      prev.map((q, i) => (i === qIdx ? { ...q, points: val } : q))
    );
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim()) {
      alert("Please enter a course title.");
      return;
    }
    setLoadingCourses(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: courseForm.title,
          description: courseForm.description,
          price: parseFloat(courseForm.price) || 0.0,
          image: courseForm.image,
          instructorId: "inst-1"
        })
      });
      if (res.ok) {
        setCourseForm({
          title: "",
          description: "",
          price: "199",
          category: "Software Engineering Modules",
          image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=400&auto=format&fit=crop"
        });
        await fetchCourses();
        setActiveTab("courses");
      } else {
        const errData = await res.json().catch(() => ({}));
        setToastMessage(errData.error || "Failed to create course.");
      }
    } catch (err) {
      setToastMessage("Network error: failed to create course.");
    } finally {
      setLoadingCourses(false);
    }
  };

  // Quiz submission actions
  const handleSaveQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizForm.title.trim()) {
      alert("Please enter a quiz title.");
      return;
    }

    const payload = {
      title: quizForm.title,
      description: quizForm.description,
      courseId: quizForm.courseId,
      questions: quizQuestions,
      topic: quizForm.topic,
    };

    setLoadingQuizzes(true);
    try {
      if (editingQuizId) {
        // Edit flow
        const res = await fetch(`/api/quizzes`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingQuizId, ...payload }),
        });

        if (res.ok) {
          const updatedQuiz = await res.json();
          const updated = quizzes.map((q) => (q.id === editingQuizId ? updatedQuiz : q));
          syncQuizzesState(updated);
        } else {
          // Fallback update
          const updated = quizzes.map((q) =>
            q.id === editingQuizId ? { ...q, ...payload } : q
          );
          syncQuizzesState(updated);
        }
      } else {
        // Create flow
        const res = await fetch("/api/quizzes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const newQuiz = await res.json();
          syncQuizzesState([newQuiz, ...quizzes]);
        } else {
          // Fallback create
          const mockNew = {
            id: `q-mock-${Date.now()}`,
            ...payload,
            createdAt: new Date().toISOString()
          };
          syncQuizzesState([mockNew, ...quizzes]);
        }
      }

      // Reset
      setIsEditing(false);
      setEditingQuizId(null);
      setQuizForm({ title: "", description: "", courseId: "c1", topic: "" });
      setQuizQuestions([{ text: "", options: ["", "", "", ""], correctAnswer: 0, points: 1 }]);
    } catch (err) {
      console.error("Save failed:", err);
      // Fallback
      if (editingQuizId) {
        const updated = quizzes.map((q) =>
          q.id === editingQuizId ? { ...q, ...payload } : q
        );
        syncQuizzesState(updated);
      } else {
        const mockNew = {
          id: `q-mock-${Date.now()}`,
          ...payload,
          createdAt: new Date().toISOString()
        };
        syncQuizzesState([mockNew, ...quizzes]);
      }
      setIsEditing(false);
      setEditingQuizId(null);
    } finally {
      setLoadingQuizzes(false);
    }
  };

  const handleTriggerEdit = (q: Quiz) => {
    setEditingQuizId(q.id);
    setQuizForm({
      title: q.title,
      description: q.description || "",
      courseId: q.courseId,
      topic: (q as any).topic || "",
    });
    setQuizQuestions(q.questions || [{ text: "", options: ["", "", "", ""], correctAnswer: 0, points: 1 }]);
    setIsEditing(true);
  };

  const handleDeleteQuiz = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this quiz?")) return;

    setLoadingQuizzes(true);
    try {
      const res = await fetch(`/api/quizzes?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        syncQuizzesState(quizzes.filter((q) => q.id !== id));
      } else {
        // Fallback
        syncQuizzesState(quizzes.filter((q) => q.id !== id));
      }
    } catch (err) {
      console.error("Delete failed:", err);
      syncQuizzesState(quizzes.filter((q) => q.id !== id));
    } finally {
      setLoadingQuizzes(false);
    }
  };

  // Preview flow
  const handleStartPreview = (q: Quiz) => {
    setPreviewQuiz(q);
    setPreviewQuestionIndex(0);
    setPreviewSelectedAnswer(null);
    setPreviewScore(0);
    setPreviewDone(false);
  };

  const handleNextPreview = () => {
    if (previewQuiz && previewSelectedAnswer !== null) {
      const currentQ = previewQuiz.questions[previewQuestionIndex];
      if (previewSelectedAnswer === currentQ.correctAnswer) {
        setPreviewScore((s) => s + (currentQ.points || 1));
      }
      setPreviewSelectedAnswer(null);
      if (previewQuestionIndex + 1 < previewQuiz.questions.length) {
        setPreviewQuestionIndex((prev) => prev + 1);
      } else {
        setPreviewDone(true);
      }
    }
  };

  const milestones = [
    {
      id: 1,
      name: "Felix Chen",
      action: "scored 95% on Quiz 4",
      meta: "2 mins ago • Advanced UX",
      img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Sarah Miller",
      action: "finished Module 2",
      meta: "15 mins ago • UI Masterclass",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "John Doe",
      action: "requested certification",
      meta: "1 hr ago • React Patterns",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
    },
  ];

  return (
    <div className="flex h-screen w-full bg-[#070710] text-[#f1f5f9] antialiased overflow-hidden font-sans relative">
      
      {/* Background glow effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-900/10 blur-[120px] pointer-events-none" />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }

        /* Live Skin Overrides for Instructor Glassmorphic Dark UI */
        .bg-white {
          background-color: rgba(11, 10, 29, 0.6) !important;
          backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          color: #f1f5f9 !important;
        }
        .text-\[\#0b1c30\] {
          color: #f1f5f9 !important;
        }
        .text-\[\#464555\] {
          color: #94a3b8 !important;
        }
        .border-\[\#c7c4d8\]\/10 {
          border-color: rgba(255, 255, 255, 0.05) !important;
        }
        .bg-\[\#eff4ff\] {
          background-color: rgba(7, 7, 16, 0.6) !important;
        }
        .bg-\[\#f8f9ff\]\/80 {
          background-color: rgba(8, 7, 16, 0.4) !important;
        }
        .border-\[\#c7c4d8\]\/20 {
          border-color: rgba(255, 255, 255, 0.05) !important;
        }
        table th {
          background-color: rgba(7, 7, 16, 0.4) !important;
          color: #94a3b8 !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
        }
        table td {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          color: #e2e8f0 !important;
        }
        tr:hover td {
          background-color: rgba(255, 255, 255, 0.02) !important;
        }
        input, textarea, select {
          background-color: rgba(7, 7, 16, 0.6) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #fff !important;
        }
        input::placeholder {
          color: #64748b !important;
        }
        label {
          color: #94a3b8 !important;
        }
        
        /* Modal background overlay */
        .fixed.inset-0 {
          background-color: rgba(0, 0, 0, 0.6) !important;
          backdrop-filter: blur(4px) !important;
        }
        
        /* Dropdowns and select options styling */
        select option {
          background-color: #0b0a1d !important;
          color: #fff !important;
        }
      `}} />

      {/* 1. SIDEBAR ARCHITECTURE */}
      <aside className="w-64 flex flex-col h-full bg-[#070710] border-r border-white/5 sticky left-0 top-0 z-50 p-4 gap-2 shrink-0">
        
        {/* BRAND IDENTITY */}
        <div className="flex items-center gap-3 px-2 py-4 mb-4">
          <svg className="h-9 w-9 shrink-0 transition-transform duration-200 hover:scale-105" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="logo-grad-instructor" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <rect width="200" height="200" rx="40" fill="transparent"/>
            <path d="M60 40 V140 H140" stroke="url(#logo-grad-instructor)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M110 90 L140 60 L170 90" stroke="#8b5cf6" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M140 60 V120" stroke="#8b5cf6" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <div>
            <span className="text-2xl font-black text-white tracking-tight block leading-none">
              LearnUp
            </span>
            <p className="text-[9px] font-black tracking-widest text-[#f97316] uppercase block mt-1">
              INSTRUCTOR HUB
            </p>
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: "dashboard" },
            { id: "courses", label: "Courses", icon: "menu_book" },
            { id: "quizzes", label: "Quizzes", icon: "quiz" },
            { id: "quiz-review", label: "Quiz Review", icon: "rate_review" },
            { id: "students", label: "Students", icon: "group" },
            { id: "analytics", label: "Analytics", icon: "bar_chart" },
            { id: "payments", label: "Payments", icon: "payments" },
            { id: "live-class", label: "Live Class", icon: "video_camera_front" },
            { id: "settings", label: "Settings", icon: "settings" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as InstructorTabType);
                  setIsEditing(false);
                }}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer relative ${
                  isActive
                    ? "bg-[#140e2d]/80 text-[#f97316] font-bold"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 w-[3px] h-5 bg-gradient-to-b from-[#8b5cf6] to-[#f97316] rounded-full" />
                )}
                <span className={`material-symbols-outlined transition-transform group-hover:scale-110 select-none ${isActive ? "text-[#f97316]" : "text-slate-500"}`}>{tab.icon}</span>
                <span className="text-xs font-bold tracking-wide">{tab.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-white/5">
          <button className="text-slate-400 flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 rounded-xl transition-all text-left w-full cursor-pointer">
            <span className="material-symbols-outlined text-sm select-none">contact_support</span>
            <span className="text-xs font-bold">Help Center</span>
          </button>
          <button
            onClick={onLogout}
            className="text-slate-400 flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 rounded-xl transition-all text-left w-full cursor-pointer font-bold text-red-500/90"
          >
            <span className="material-symbols-outlined text-sm select-none">logout</span>
            <span className="text-xs font-bold">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN DATA STREAM WRAPPER */}
      <main className="flex-1 overflow-y-auto scroll-smooth flex flex-col h-screen relative">
        
        {/* 2. TOP NAVBAR */}
        <header className="sticky top-0 z-40 bg-[#070710]/40 backdrop-blur-md border-b border-white/5 h-16 flex justify-between items-center px-8 shrink-0">
          <div className="flex items-center gap-6">
            <GlobalSearch />
          </div>
          
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="w-px h-6 bg-white/10 mx-1"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-black text-slate-200 leading-tight">{currentUser?.name || "Instructor"}</p>
                <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mt-0.5">Senior Instructor</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#f97316] flex items-center justify-center text-white font-extrabold text-sm border border-white/10 shadow-sm shadow-purple-500/10">
                {(currentUser?.name || "I")[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* 3. DYNAMIC CONTENT SCREENS */}
        <div className="p-8 max-w-[1280px] w-full mx-auto flex-1 pb-12 relative">
          
          {/* Toast Notification Banner */}
          {toastMessage && (
            <div className="fixed top-4 right-4 z-50 p-4 bg-red-600 text-white rounded-xl shadow-xl flex items-center gap-3 transition-all duration-300 transform translate-y-0 animate-bounce">
              <span className="material-symbols-outlined select-none text-xl">warning</span>
              <p className="text-xs font-bold">{toastMessage}</p>
              <button onClick={() => setToastMessage("")} className="text-white hover:text-slate-200 ml-2">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}
          
          {/* SCREEN: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-[#0b1c30]">Instructor Overview</h2>
                  <p className="text-[#464555] text-sm mt-1">Welcome back, {currentUser?.name || "Instructor"}! Monitor real-time dynamic course matrices here.</p>
                </div>
                <button 
                  onClick={() => setActiveTab("create-course")}
                  className="bg-[#f97316] hover:bg-[#ea580c] text-white py-3 px-6 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-95 text-sm shadow-orange-500/10 cursor-pointer"
                >
                  <span className="material-symbols-outlined select-none">add_circle</span> Create New Course
                </button>
              </div>

              {/* METRIC FACTOR CARDS */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Total Earnings", val: `₹${walletBalance.toFixed(2)}`, meta: "Current wallet balance", up: true, icon: "payments", color: "text-[#f97316] bg-[#f97316]/10" },
                  { title: "Active Students", val: "1,284", meta: "Across 8 live modules", up: false, icon: "group", color: "text-[#8b5cf6] bg-[#8b5cf6]/10" },
                  { title: "Avg Rating Matrix", val: "4.9 / 5.0", meta: "Top 2% satisfaction", up: false, icon: "star", color: "text-amber-600 bg-amber-500/10" },
                  { title: "Monthly Trajectory", val: "18.4%", meta: "Consistent scaling loop", up: true, icon: "trending_up", color: "text-emerald-500 bg-emerald-500/10" },
                ].map((card, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-[#c7c4d8]/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#8b5cf6]/5 hover:border-[#8b5cf6]/20 active:scale-[0.99] cursor-pointer">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
                      <span className="material-symbols-outlined select-none">{card.icon}</span>
                    </div>
                    <p className="text-xs font-bold text-[#464555] uppercase tracking-wider">{card.title}</p>
                    <h4 className="text-2xl font-black text-[#0b1c30] mt-1">{card.val}</h4>
                    <p className={`text-[12px] font-bold mt-1.5 flex items-center gap-1 ${card.up ? "text-green-600" : "text-[#464555]/80"}`}>
                      {card.up && <span className="material-symbols-outlined text-[14px] select-none">trending_up</span>} {card.meta}
                    </p>
                  </div>
                ))}
              </section>

              {/* BENTO GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#c7c4d8]/10 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h4 className="text-lg font-bold text-[#0b1c30]">Revenue Progression</h4>
                      <p className="text-[#464555] text-xs">Payout progression metrics for the past cycle</p>
                    </div>
                  </div>
                  <div className="relative flex-1 min-h-[240px] flex items-end justify-between gap-4 pt-6 bg-gradient-to-b from-[#8b5cf6]/5 to-transparent rounded-xl p-2">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
                      <div className="border-t border-[#c7c4d8]/10 w-full h-px"></div>
                      <div className="border-t border-[#c7c4d8]/10 w-full h-px"></div>
                      <div className="border-t border-[#c7c4d8]/10 w-full h-px"></div>
                    </div>
                    <div className="w-full bg-[#8b5cf6]/35 rounded-t-lg transition-all hover:bg-[#8b5cf6]/55 h-[35%] cursor-pointer"></div>
                    <div className="w-full bg-[#f97316]/45 rounded-t-lg transition-all hover:bg-[#f97316]/65 h-[55%] cursor-pointer"></div>
                    <div className="w-full bg-[#8b5cf6]/55 rounded-t-lg transition-all hover:bg-[#8b5cf6]/75 h-[45%] cursor-pointer"></div>
                    <div className="w-full bg-[#f97316]/75 rounded-t-lg transition-all hover:bg-[#f97316]/85 h-[80%] cursor-pointer"></div>
                    <div className="w-full bg-[#8b5cf6]/85 rounded-t-lg transition-all hover:bg-[#8b5cf6]/95 h-[65%] cursor-pointer"></div>
                    <div className="w-full bg-[#f97316] rounded-t-lg transition-all hover:brightness-110 h-[95%] cursor-pointer"></div>
                  </div>
                  <div className="flex justify-between mt-4 px-1 border-t border-[#c7c4d8]/10 pt-4 text-[#777587] font-bold text-xs">
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                  </div>
                </div>

                {/* RECENT MILESTONES */}
                <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#c7c4d8]/10 shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-lg font-bold text-[#0b1c30]">Recent Milestones</h4>
                    <span className="px-2 py-0.5 bg-[#f97316]/10 text-[#f97316] text-[10px] font-black rounded-full uppercase tracking-wider">Live Feed</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-5">
                    {milestones.map((milestone) => (
                      <div key={milestone.id} className="flex gap-3 items-center transition-all hover:translate-x-0.5">
                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-[#3525cd]/20 shadow-sm">
                          <img alt={milestone.name} className="w-full h-full object-cover" src={milestone.img} />
                        </div>
                        <div>
                          <p className="text-sm text-[#0b1c30]"><strong>{milestone.name}</strong> {milestone.action}</p>
                          <p className="text-[11px] text-[#464555] font-medium mt-0.5">{milestone.meta}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-6 py-3 w-full border border-[#c7c4d8]/30 rounded-xl text-[#3525cd] font-bold text-xs hover:bg-[#3525cd]/5 transition-all active:scale-95 cursor-pointer">
                    View Activity Logs
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN: LIVE CLASS */}
          {activeTab === "live-class" && (
            <div className="space-y-8 animate-fadeIn h-full flex flex-col">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-[#0b1c30]">Live Class Studio</h2>
                  <p className="text-[#464555] text-sm mt-1">Host interactive live sessions with your enrolled students.</p>
                </div>
              </div>

              {activeLiveSession ? (
                <div className="flex-1 min-h-0">
                  <LiveClassRoom
                    roomId={activeLiveSession.roomName}
                    courseTitle={courses.find(c => c.id === activeLiveSession.courseId)?.title || "Live Session"}
                    isInstructor={true}
                    user={currentUser || { name: "Instructor" }}
                    onLeave={handleEndLiveClass}
                  />
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-12 rounded-3xl border border-white/5 bg-[#0b0a1d]/60">
                  <span className="material-symbols-outlined text-6xl text-slate-500 mb-6">video_camera_front</span>
                  <h3 className="text-xl font-bold text-white mb-2">Start a New Live Session</h3>
                  <p className="text-slate-400 text-sm mb-8 text-center max-w-md">Select a course to generate a unique secure room. Enrolled students will instantly be notified and able to join.</p>
                  
                  <div className="w-full max-w-sm space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-2">Select Course</label>
                      <select
                        value={selectedCourseForLive}
                        onChange={(e) => setSelectedCourseForLive(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#f97316] transition-colors appearance-none"
                      >
                        <option value="">-- Choose a course --</option>
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <button
                      onClick={handleStartLiveClass}
                      disabled={!selectedCourseForLive || isStartingLive}
                      className="w-full bg-[#f97316] hover:bg-[#ea580c] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 transition-colors"
                    >
                      {isStartingLive ? (
                        "Starting..."
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">play_circle</span>
                          Go Live Now
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SCREEN: COURSES */}
          {activeTab === "courses" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-[#0b1c30]">Course Management Vault</h2>
                  <p className="text-[#464555] text-sm">Configure modules, draft blueprints, deploy code courses.</p>
                </div>
                <button onClick={() => setActiveTab("create-course")} className="bg-[#3525cd] text-white py-2.5 px-4 rounded-xl font-bold transition-all hover:-translate-y-0.5 active:scale-95 text-sm flex items-center gap-1 cursor-pointer">
                  <span className="material-symbols-outlined text-sm select-none">add</span> Add New Syllabus
                </button>
              </div>
              
              {loadingCourses && courses.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-64 bg-slate-200/50 rounded-2xl border border-slate-100" />
                  ))}
                </div>
              ) : courses.length === 0 ? (
                <div className="bg-white border border-[#c7c4d8]/20 rounded-2xl p-16 text-center text-[#464555] text-sm">
                  No courses found. Click "Add New Syllabus" to create one.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-white rounded-2xl border border-[#c7c4d8]/20 shadow-sm overflow-hidden flex flex-col hover:-translate-y-1 transition-all">
                      <img className="w-full h-44 object-cover" src={course.image || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=400&auto=format&fit=crop"} alt={course.title} />
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="bg-[#3525cd]/10 text-[#3525cd] text-[10px] font-black uppercase px-2 py-0.5 rounded-full">Development</span>
                          <h4 className="text-base font-bold text-[#0b1c30] mt-3">{course.title}</h4>
                          <p className="text-xs text-[#464555] mt-1">{course.description || "No description provided."}</p>
                          <p className="text-[10px] font-mono text-slate-400 mt-2">ID: {course.id}</p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-[#c7c4d8]/10 flex justify-between items-center">
                          <span className="text-sm font-bold text-[#3525cd]">${course.price}</span>
                          <span className="text-xs font-bold text-[#712ae2] bg-[#eaddff] px-3 py-1.5 rounded-lg">Active Node</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SCREEN: QUIZZES MODULE (NEW & COMPLETE CRUD FLOW) */}
          {activeTab === "quizzes" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-[#0b1c30]">Quiz Blueprint Matrix</h2>
                  <p className="text-[#464555] text-sm mt-1">Construct JSONB-driven quizzes and preview live questions states.</p>
                </div>
                {!isEditing && (
                  <button 
                    onClick={() => {
                      setEditingQuizId(null);
                      setQuizForm({ title: "", description: "", courseId: "c1", topic: "" });
                      setQuizQuestions([{ text: "", options: ["", "", "", ""], correctAnswer: 0, points: 1 }]);
                      setIsEditing(true);
                    }}
                    className="bg-[#3525cd] text-white py-2.5 px-5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:-translate-y-0.5 active:scale-95 transition text-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm select-none">add</span> Add New Quiz
                  </button>
                )}
              </div>

              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined select-none text-sm">error</span>
                    <span>{errorMessage}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={fetchQuizzes}
                    className="bg-[#3525cd] text-white px-4 py-2 rounded-xl text-xs font-bold transition hover:bg-[#4f46e5] active:scale-95 cursor-pointer shrink-0"
                  >
                    Retry Connection
                  </button>
                </div>
              )}

              {/* LIST / CARDS VIEW */}
              {!isEditing && (
                <>
                  {loadingQuizzes && quizzes.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-48 bg-white border border-[#c7c4d8]/20 rounded-2xl" />
                      ))}
                    </div>
                  ) : quizzes.length === 0 ? (
                    <div className="bg-white border border-[#c7c4d8]/20 rounded-2xl p-16 text-center text-[#464555] text-sm">
                      No active quiz blueprints deployed. Click "Add New Quiz" to start.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {quizzes.map((quiz) => (
                        <div key={quiz.id} className="bg-white rounded-2xl border border-[#c7c4d8]/20 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition">
                          <div className="space-y-3">
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-[#eff4ff] text-[#3525cd] rounded-md uppercase font-mono">
                              {quiz.questions?.length || 0} Questions
                            </span>
                            <h4 className="font-bold text-lg text-[#0b1c30] leading-snug">{quiz.title}</h4>
                            <p className="text-xs text-[#464555] leading-relaxed line-clamp-3">{quiz.description || "No abstract details provided."}</p>
                          </div>

                          <div className="mt-6 pt-4 border-t border-[#c7c4d8]/10 flex gap-2">
                            <button 
                              onClick={() => handleStartPreview(quiz)}
                              className="flex-1 py-2 bg-[#f0f2fe] text-[#3525cd] hover:bg-[#3525cd] hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm select-none">visibility</span> Preview
                            </button>
                            <button 
                              onClick={() => handleTriggerEdit(quiz)}
                              className="p-2 border border-[#c7c4d8]/30 rounded-xl hover:bg-slate-50 transition cursor-pointer text-[#464555] flex items-center justify-center"
                            >
                              <span className="material-symbols-outlined text-sm select-none">edit</span>
                            </button>
                            <button 
                              onClick={() => handleDeleteQuiz(quiz.id)}
                              className="p-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition cursor-pointer flex items-center justify-center"
                            >
                              <span className="material-symbols-outlined text-sm select-none">delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* CREATE / EDIT FORM VIEW */}
              {isEditing && (
                <form onSubmit={handleSaveQuiz} className="bg-white rounded-2xl border border-[#c7c4d8]/20 shadow-sm p-8 space-y-6 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-[#c7c4d8]/10 pb-4">
                    <h3 className="font-bold text-[#0b1c30] text-lg">
                      {editingQuizId ? "Edit Quiz Blueprint" : "Create Quiz Blueprint"}
                    </h3>
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-[#c7c4d8]/30 rounded-xl text-xs font-bold text-[#464555] hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Base quiz info */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider">Quiz Title</label>
                      <input 
                        type="text" 
                        required
                        value={quizForm.title}
                        onChange={(e) => setQuizForm({...quizForm, title: e.target.value})}
                        placeholder="e.g., React Lifecycle Hooks Mastery" 
                        className="w-full bg-[#eff4ff] border-none rounded-xl text-sm py-3 px-4 focus:ring-2 focus:ring-[#3525cd]/20 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider">Linked Course ID</label>
                      <input 
                        type="text" 
                        required
                        value={quizForm.courseId}
                        onChange={(e) => setQuizForm({...quizForm, courseId: e.target.value})}
                        placeholder="c1" 
                        className="w-full bg-[#eff4ff] border-none rounded-xl text-sm py-3 px-4 focus:ring-2 focus:ring-[#3525cd]/20 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider">Topic</label>
                      <input 
                        type="text" 
                        required
                        value={quizForm.topic}
                        onChange={(e) => setQuizForm({...quizForm, topic: e.target.value})}
                        placeholder="e.g., programming" 
                        className="w-full bg-[#eff4ff] border-none rounded-xl text-sm py-3 px-4 focus:ring-2 focus:ring-[#3525cd]/20 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider">Description Abstract</label>
                    <textarea 
                      rows={3} 
                      value={quizForm.description}
                      onChange={(e) => setQuizForm({...quizForm, description: e.target.value})}
                      placeholder="Brief details about the quiz topic expectations..." 
                      className="w-full bg-[#eff4ff] border-none rounded-xl text-sm p-4 focus:ring-2 focus:ring-[#3525cd]/20 outline-none"
                    />
                  </div>

                  {/* Questions builder */}
                  <div className="space-y-6 pt-4 border-t border-[#c7c4d8]/10">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-black text-[#3525cd] uppercase tracking-wider">Quiz Questions Sheets</h4>
                      <button 
                        type="button" 
                        onClick={handleAddQuestion}
                        className="text-xs font-bold text-white bg-[#3525cd] hover:bg-[#4f46e5] px-3.5 py-2 rounded-xl flex items-center gap-1 active:scale-95 transition cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px] select-none">add</span> Add Question Row
                      </button>
                    </div>

                    <div className="space-y-8">
                      {quizQuestions.map((q, qIdx) => (
                        <div key={qIdx} className="bg-slate-50/50 p-6 rounded-2xl border border-[#c7c4d8]/20 space-y-4 relative">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-mono font-bold text-[#464555]">Question #{qIdx + 1}</span>
                            {quizQuestions.length > 1 && (
                              <button 
                                type="button" 
                                onClick={() => handleRemoveQuestion(qIdx)}
                                className="text-xs text-red-500 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm select-none">delete</span> Delete Row
                              </button>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[11px] font-bold text-[#464555] uppercase">Question Text</label>
                            <input 
                              type="text" 
                              required
                              value={q.text}
                              onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                              placeholder="Enter the question query..." 
                              className="w-full bg-white border border-[#c7c4d8]/30 rounded-xl text-sm py-3 px-4 focus:ring-1 focus:ring-[#3525cd] outline-none"
                            />
                          </div>

                          {/* Options Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {q.options.map((opt, optIdx) => (
                              <div key={optIdx} className="space-y-1">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase">Option {String.fromCharCode(65 + optIdx)}</label>
                                <input 
                                  type="text" 
                                  required
                                  value={opt}
                                  onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                                  placeholder={`Option ${optIdx + 1} text`} 
                                  className="w-full bg-white border border-[#c7c4d8]/30 rounded-xl text-xs py-2 px-3 focus:ring-1 focus:ring-[#3525cd] outline-none"
                                />
                              </div>
                            ))}
                          </div>

                          {/* Correct option & points */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-[#464555] uppercase">Correct Option Answer</label>
                              <select 
                                value={q.correctAnswer}
                                onChange={(e) => handleCorrectAnswerChange(qIdx, parseInt(e.target.value))}
                                className="w-full bg-white border border-[#c7c4d8]/30 rounded-xl text-xs py-2.5 px-3 text-[#464555] focus:ring-1 focus:ring-[#3525cd] outline-none"
                              >
                                <option value={0}>Option A</option>
                                <option value={1}>Option B</option>
                                <option value={2}>Option C</option>
                                <option value={3}>Option D</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-[#464555] uppercase">Points Allocated</label>
                                <input 
                                  type="number" 
                                  required
                                  min={1}
                                  value={q.points ?? ""}
                                  onChange={(e) => handlePointsChange(qIdx, parseInt(e.target.value) || 1)}
                                  className="w-full bg-white border border-[#c7c4d8]/30 rounded-xl text-xs py-2.5 px-3 focus:ring-1 focus:ring-[#3525cd] outline-none"
                                />
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#c7c4d8]/10 flex gap-4">
                    <button 
                      type="submit"
                      disabled={loadingQuizzes}
                      className="bg-[#3525cd] text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-md hover:bg-[#4f46e5] transition cursor-pointer disabled:opacity-50"
                    >
                      {loadingQuizzes ? "Deploying..." : "Save & Deployed Blueprint"}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)}
                      className="bg-transparent text-[#464555] hover:bg-[#c7c4d8]/20 px-6 py-3.5 rounded-xl font-bold text-xs transition cursor-pointer"
                    >
                      Discard Draft
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* SCREEN: QUIZ REVIEW */}
          {activeTab === "quiz-review" && (
            <QuizReviewScreen 
              submissions={submissions}
              loadingSubmissions={loadingSubmissions}
              submissionsError={submissionsError}
              fetchSubmissions={fetchSubmissions}
            />
          )}

          {/* SCREEN: STUDENTS */}
          {activeTab === "students" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-bold text-white">Enrolled Cohort Roster</h2>
                <p className="text-slate-400 text-sm">Monitor student analytics pipelines and grading benchmarks.</p>
              </div>
              <div className="bg-[#0b0a1d]/60 rounded-3xl border border-white/5 shadow-sm overflow-hidden">
                <div className="p-5 flex items-center justify-between border-b border-white/5 bg-[#070710]/40">
                  <span className="text-xs font-black tracking-widest text-slate-400 uppercase">Roster Manifest</span>
                </div>
                {loadingStudents ? (
                  <div className="p-5 text-slate-400 text-sm">Loading cohort roster...</div>
                ) : enrolledStudents.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm">No students currently enrolled in your courses.</div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {enrolledStudents.map((st) => (
                      <div key={st.id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center font-extrabold text-sm border border-white/10 shadow-sm text-white">
                            {st.name[0].toUpperCase()}
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-slate-100">{st.name}</h5>
                            <p className="text-xs text-slate-400">{st.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full">{st.courseTitle}</span>
                          <p className="text-[10px] text-slate-500 mt-1">Progress Check: {st.progress}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SCREEN: ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-8 animate-fadeIn text-slate-100">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-[#3525cd] uppercase font-mono bg-[#eff4ff] px-2.5 py-1 rounded-md">LIVE TELEMETRY</span>
                  <h2 className="text-2xl font-black text-[#0b1c30] mt-1">Instructor Analytics</h2>
                  <p className="text-xs text-[#464555]">Real-time system diagnostics, program revenues, and cohort progress metrics.</p>
                </div>
                <button
                  onClick={fetchAnalytics}
                  disabled={loadingAnalytics}
                  className="px-4 py-2 border border-[#c7c4d8]/40 hover:bg-[#3525cd] hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer text-[#464555] bg-white"
                >
                  <span className="material-symbols-outlined text-sm select-none">refresh</span>
                  {loadingAnalytics ? "Syncing..." : "Sync Live Data"}
                </button>
              </div>

              {loadingAnalytics && !analyticsData ? (
                <div className="text-slate-500 text-sm">Synchronizing ledger matrices...</div>
              ) : !analyticsData ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-[#c7c4d8]/25 text-[#464555] text-xs">
                  No real-time diagnostic parameters loaded.
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Grid cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Glassmorphic Card 1: Revenue */}
                    <div className="p-6 rounded-2xl border border-[#c7c4d8]/20 bg-white/70 backdrop-blur-md shadow-sm relative overflow-hidden flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">INSTRUCTOR EARNINGS (80% SHARE)</span>
                          <h3 className="text-3xl font-black text-[#0b1c30]">₹{analyticsData.totalInstructorRevenue.toFixed(2)}</h3>
                        </div>
                        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 border border-purple-500/20">
                          <span className="material-symbols-outlined select-none text-xl">payments</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-4">Calculated from course purchases matching ₹ (INR).</p>
                    </div>

                    {/* Glassmorphic Card 2: Support Tickets */}
                    <div className="p-6 rounded-2xl border border-[#c7c4d8]/20 bg-white/70 backdrop-blur-md shadow-sm relative overflow-hidden flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">ACTIVE OPEN SUPPORT TICKETS</span>
                          <h3 className="text-3xl font-black text-red-600">{analyticsData.openSupportTicketsCount}</h3>
                        </div>
                        <div className="p-2.5 rounded-xl bg-red-50/10 text-red-600 border border-red-200">
                          <span className="material-symbols-outlined select-none text-xl">support_agent</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-4">Needs immediate instructor resolution response.</p>
                    </div>

                    {/* Glassmorphic Card 3: Total Enrolled */}
                    <div className="p-6 rounded-2xl border border-[#c7c4d8]/20 bg-white/70 backdrop-blur-md shadow-sm relative overflow-hidden flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">TOTAL MATRICULATED STUDENTS</span>
                          <h3 className="text-3xl font-black text-indigo-600">{analyticsData.studentMatrix.length}</h3>
                        </div>
                        <div className="p-2.5 rounded-xl bg-indigo-50/10 text-indigo-600 border border-indigo-200">
                          <span className="material-symbols-outlined select-none text-xl">groups</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-4">Dynamic count mapped from CourseEnrollment records.</p>
                    </div>
                  </div>

                  {/* Revenue Graph Over Time */}
                  <div className="p-6 rounded-2xl border border-[#c7c4d8]/20 bg-white/70 backdrop-blur-md shadow-sm space-y-4">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Revenue Ledger Timeline</h4>
                      <p className="text-[10px] text-slate-400">Total transaction earnings mapped daily/monthly.</p>
                    </div>
                    {analyticsData.revenueGraphData.length === 0 ? (
                      <div className="h-40 flex items-center justify-center text-slate-400 text-xs">
                        No transactions recorded. Sell courses to populate.
                      </div>
                    ) : (
                      <div className="h-40 bg-[#f8f9ff]/50 border border-[#c7c4d8]/10 rounded-xl flex items-end p-4 justify-start gap-4 overflow-x-auto">
                        {analyticsData.revenueGraphData.map((data: any, idx: number) => {
                          const maxRevenue = Math.max(...analyticsData.revenueGraphData.map((d: any) => d.revenue), 1);
                          const barHeight = `${(data.revenue / maxRevenue) * 80 + 10}%`;
                          return (
                            <div key={idx} className="flex flex-col items-center gap-1.5 shrink-0 group relative">
                              {/* Hover Tooltip */}
                              <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[9px] px-2 py-0.5 rounded pointer-events-none whitespace-nowrap z-10">
                                ₹{data.revenue.toFixed(2)}
                              </div>
                              <div 
                                style={{ height: barHeight }} 
                                className="bg-[#3525cd] hover:bg-[#712ae2] w-10 rounded-t-md transition-all duration-300"
                              />
                              <span className="text-[8px] font-mono text-slate-500">{data.date}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Dynamic Tables: Quiz Averages & Student Matrix */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-medium">
                    {/* Performance Metrics Table */}
                    <div className="p-6 rounded-2xl border border-[#c7c4d8]/20 bg-white/70 backdrop-blur-md shadow-sm space-y-4 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">Program Quality & Performance</h4>
                        <p className="text-[10px] text-slate-400">Average quiz score benchmarks computed from Student Submissions.</p>
                      </div>
                      
                      {analyticsData.coursePerformance.length === 0 ? (
                        <div className="text-slate-400 text-xs py-8 text-center">No program parameters linked.</div>
                      ) : (
                        <div className="max-h-64 overflow-y-auto pr-1">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-slate-200 text-slate-400 text-[9px] uppercase tracking-wider font-mono">
                                <th className="pb-2">Course Module</th>
                                <th className="pb-2 text-center">Submissions</th>
                                <th className="pb-2 text-right">Avg Score</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {analyticsData.coursePerformance.map((item: any) => (
                                <tr key={item.courseId} className="hover:bg-slate-50/50">
                                  <td className="py-2.5 font-semibold text-slate-700">{item.courseTitle}</td>
                                  <td className="py-2.5 text-center text-slate-500">{item.submissionsCount}</td>
                                  <td className={`py-2.5 text-right font-bold ${
                                    item.averageScore >= 80 ? "text-green-600" : item.averageScore >= 50 ? "text-amber-600" : "text-red-500"
                                  }`}>{item.averageScore}%</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Student Matrix Table */}
                    <div className="p-6 rounded-2xl border border-[#c7c4d8]/20 bg-white/70 backdrop-blur-md shadow-sm space-y-4 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">Student Cohort Matrix</h4>
                        <p className="text-[10px] text-slate-400">Active roster enrolled via CourseEnrollment logs.</p>
                      </div>
                      
                      {analyticsData.studentMatrix.length === 0 ? (
                        <div className="text-slate-400 text-xs py-8 text-center">No students registered.</div>
                      ) : (
                        <div className="max-h-64 overflow-y-auto pr-1">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-slate-200 text-slate-400 text-[9px] uppercase tracking-wider font-mono">
                                <th className="pb-2">Student Name</th>
                                <th className="pb-2">Target Course</th>
                                <th className="pb-2 text-right">Enrolled At</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {analyticsData.studentMatrix.map((st: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50/50">
                                  <td className="py-2.5">
                                    <div className="font-semibold text-slate-800">{st.name}</div>
                                    <div className="text-[9px] text-slate-400 font-mono">{st.email}</div>
                                  </td>
                                  <td className="py-2.5 text-slate-600 font-semibold">{st.courseTitle}</td>
                                  <td className="py-2.5 text-right text-slate-400 font-mono text-[9px]">
                                    {new Date(st.enrolledAt).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SCREEN: PAYMENTS */}
          {activeTab === "payments" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#0b1c30]">Instructor Wallet</h2>
                  <p className="text-[#464555] text-sm">Manage your course earnings and request bank payouts.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setWithdrawError("");
                    setWithdrawAmount("");
                    setWithdrawModalOpen(true);
                  }}
                  className="bg-[#3525cd] text-white py-3 px-6 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 text-sm shadow-[#3525cd]/20 cursor-pointer"
                >
                  <span className="material-symbols-outlined select-none text-base">account_balance_wallet</span>
                  Withdraw Funds
                </button>
              </div>

              {/* Balance Card */}
              <div className="bg-gradient-to-br from-[#3525cd] to-[#712ae2] text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="space-y-2">
                  <p className="text-sm font-semibold opacity-85 uppercase tracking-wider">Available Balance</p>
                  <h3 className="text-4xl font-black">₹{walletBalance.toFixed(2)}</h3>
                </div>
                <p className="text-xs opacity-75 mt-6">Instant bank transfers via Razorpay mode.</p>
              </div>

              {/* Payout History Ledger */}
              <div className="space-y-4">
                <h4 className="text-base font-bold text-[#0b1c30]">Payout Transactions</h4>
                {payoutHistory.length === 0 ? (
                  <div className="bg-white border border-[#c7c4d8]/20 rounded-2xl p-16 text-center text-[#464555] text-sm">
                    No payouts requested yet.
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-[#c7c4d8]/10 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#eff4ff] text-xs font-bold text-[#464555] uppercase tracking-wider">
                        <tr>
                          <th className="p-4">Payout ID</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#c7c4d8]/10">
                        {payoutHistory.map((payout: any) => (
                          <tr key={payout.id} className="hover:bg-[#f8f9ff]">
                            <td className="p-4 font-mono text-xs text-[#3525cd]">
                              {payout.razorpayPayoutId || payout.id}
                            </td>
                            <td className="p-4 font-bold text-[#0b1c30]">₹{payout.amount.toFixed(2)}</td>
                            <td className="p-4 text-xs text-[#464555]">
                              {new Date(payout.createdAt).toLocaleDateString()} at{" "}
                              {new Date(payout.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </td>
                            <td className="p-4">
                              <span
                                className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                                  payout.status === "SUCCESS"
                                    ? "bg-green-100 text-green-800"
                                    : payout.status === "FAILED"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {payout.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Withdraw Modal */}
              {withdrawModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                  <div className="bg-white rounded-3xl max-w-md w-full p-8 border border-[#c7c4d8]/30 shadow-2xl relative space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-bold text-[#0b1c30]">Withdraw Balance</h4>
                      <button
                        type="button"
                        onClick={() => setWithdrawModalOpen(false)}
                        className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm select-none">close</span>
                      </button>
                    </div>

                    <form onSubmit={handleWithdraw} className="space-y-4">
                      {withdrawError && (
                        <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold">
                          {withdrawError}
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-[#464555] uppercase tracking-wider">
                          Withdrawal Amount (INR)
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                          <input
                            type="number"
                            required
                            min={1}
                            max={walletBalance}
                            step="0.01"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-[#eff4ff] border-none rounded-xl text-sm py-3.5 pl-8 pr-4 focus:ring-2 focus:ring-[#3525cd]/20 outline-none font-bold text-[#0b1c30]"
                          />
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Maximum available for withdrawal: ₹{walletBalance.toFixed(2)}
                        </p>
                      </div>

                      <div className="pt-4 flex gap-3">
                        <button
                          type="button"
                          onClick={() => setWithdrawModalOpen(false)}
                          className="flex-1 py-3 border border-[#c7c4d8]/40 rounded-xl font-bold text-xs hover:bg-slate-50 transition cursor-pointer text-[#464555]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={withdrawing || !withdrawAmount || parseFloat(withdrawAmount) > walletBalance}
                          className="flex-1 py-3 bg-[#3525cd] text-white hover:bg-[#4f46e5] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed rounded-xl font-bold text-xs transition cursor-pointer"
                        >
                          {withdrawing ? "Processing..." : "Confirm Payout"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SCREEN: SETTINGS */}
          {activeTab === "settings" && (
            <div className="animate-fadeIn">
              <SettingsForm onClose={() => setActiveTab("dashboard")} />
            </div>
          )}

          {/* SCREEN: CREATE NEW COURSE */}
          {activeTab === "create-course" && (
            <CourseBuilder 
              onBack={() => setActiveTab("dashboard")} 
              instructorId={getInstructorId()} 
            />
          )}

        </div>

        {/* 4. SYSTEM FOOTER */}
        <footer className="bg-[#d3e4fe] mt-auto shrink-0 border-t border-[#c7c4d8]/20">
          <div className="max-w-[1280px] mx-auto px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-xs text-[#464555] font-medium">© 2026 LearnUp LMS Ecosystem. Technical system pipeline optimized.</p>
            </div>
            <div className="flex gap-6 text-xs font-bold text-[#464555]/80">
              <a className="hover:text-[#3525cd] transition-colors hover:underline cursor-pointer">Security Nodes</a>
              <a className="hover:text-[#3525cd] transition-colors hover:underline cursor-pointer">Platform Status</a>
            </div>
          </div>
        </footer>
      </main>

      {/* QUIZ LIVE PREVIEW MODAL */}
      {previewQuiz && (
        <div className="fixed inset-0 bg-[#0b1c30]/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#c7c4d8]/20 overflow-hidden flex flex-col justify-between">
            <header className="p-6 border-b border-[#c7c4d8]/20 bg-slate-50/50 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black bg-[#e2dfff] text-[#3525cd] px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  Live Preview mode
                </span>
                <h4 className="font-bold text-base text-[#0b1c30] mt-1">{previewQuiz.title}</h4>
              </div>
              <button 
                onClick={() => setPreviewQuiz(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200 transition text-slate-400 hover:text-black cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm select-none">close</span>
              </button>
            </header>

            <div className="p-8 space-y-6">
              {!previewDone ? (
                <>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                    <span>Question {previewQuestionIndex + 1} of {previewQuiz.questions.length}</span>
                    <span>{previewQuiz.questions[previewQuestionIndex].points} Points</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0b1c30]">
                    {previewQuiz.questions[previewQuestionIndex].text}
                  </h3>

                  <div className="space-y-3 pt-2">
                    {previewQuiz.questions[previewQuestionIndex].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPreviewSelectedAnswer(idx)}
                        className={`w-full p-4 rounded-xl border text-left text-sm transition cursor-pointer ${
                          previewSelectedAnswer === idx 
                            ? "border-[#3525cd] bg-[#eff4ff] text-[#3525cd]" 
                            : "border-[#c7c4d8]/30 hover:border-[#3525cd]/40 hover:bg-slate-50 text-[#464555]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center p-6 space-y-4">
                  <span className="material-symbols-outlined text-[50px] text-green-500 select-none">check_circle</span>
                  <div>
                    <h3 className="text-xl font-bold text-[#0b1c30]">Preview Completed!</h3>
                    <p className="text-xs text-[#464555] mt-1">Live grading calculations executed successfully.</p>
                  </div>
                  <div className="bg-[#eff4ff] p-4 rounded-xl text-sm font-bold text-[#3525cd]">
                    Score Result: {previewScore} Points
                  </div>
                </div>
              )}
            </div>

            <footer className="p-6 border-t border-[#c7c4d8]/20 bg-slate-50/50 flex justify-end gap-2">
              {!previewDone ? (
                <button
                  disabled={previewSelectedAnswer === null}
                  onClick={handleNextPreview}
                  className="px-6 py-2.5 bg-[#3525cd] text-white hover:bg-[#4f46e5] rounded-xl text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-md shadow-[#3525cd]/10"
                >
                  {previewQuestionIndex + 1 === previewQuiz.questions.length ? "Finish Preview" : "Next Question"}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setPreviewQuiz(null);
                  }}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#464555] rounded-xl text-xs font-bold cursor-pointer"
                >
                  Close Preview
                </button>
              )}
            </footer>
          </div>
        </div>
      )}

    </div>
  );
}
