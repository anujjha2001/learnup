import React, { useState, useEffect } from "react";
import { Search, Send, User } from "lucide-react";

export default function QuizReviewScreen({ submissions, loadingSubmissions, submissionsError, fetchSubmissions }: any) {
  const [activeSubmission, setActiveSubmission] = useState<any>(null);
  const [feedback, setFeedback] = useState("");
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (activeSubmission) {
      // Fetch mentor messages for this submission
      fetch(`/api/mentor/messages?submissionId=${activeSubmission.id}`)
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(err => console.error(err));
    }
  }, [activeSubmission]);

  const sendFeedback = async () => {
    if (!feedback.trim() || !activeSubmission) return;
    setSendingFeedback(true);
    try {
      const res = await fetch("/api/mentor/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: activeSubmission.id,
          message: feedback
        })
      });
      if (res.ok) {
        const newMsg = await res.json();
        setMessages([...messages, newMsg]);
        setFeedback("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSendingFeedback(false);
    }
  };

  if (activeSubmission) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-[#0b1c30]">Review Submission</h2>
            <p className="text-[#464555] text-sm mt-1">Student: {activeSubmission.studentName} | Score: {activeSubmission.score}%</p>
          </div>
          <button onClick={() => setActiveSubmission(null)} className="text-sm font-bold text-[#3525cd] hover:underline transition">
            &larr; Back to Submissions
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#171717] rounded-3xl border border-white/10 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-white text-lg">Feedback & Mentor Q&A</h3>
            <div className="h-64 overflow-y-auto space-y-3 bg-[#0d0d0d] rounded-2xl p-4 border border-white/5">
              {messages.length === 0 ? (
                <p className="text-xs text-slate-400 text-center">No feedback provided yet.</p>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className={`flex ${m.sender?.role === "INSTRUCTOR" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm font-medium ${m.sender?.role === "INSTRUCTOR" ? "bg-[#8b5cf6] text-white rounded-br-sm" : "bg-[#22222d] border border-white/10 text-slate-100 rounded-bl-sm"}`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <User className="w-3 h-3 text-[#f97316]" />
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${m.sender?.role === "INSTRUCTOR" ? "text-purple-200" : "text-[#f97316]"}`}>{m.sender?.name}</span>
                      </div>
                      <span className="text-slate-100 font-medium">{m.message}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Type your feedback..."
                className="flex-1 bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8b5cf6] placeholder-slate-500 transition font-medium"
                onKeyDown={(e) => e.key === "Enter" && sendFeedback()}
              />
              <button
                onClick={sendFeedback}
                disabled={sendingFeedback}
                className="p-3 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white transition disabled:opacity-50 font-bold"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#c7c4d8]/20 shadow-sm p-6 space-y-4">
             <h3 className="font-bold text-[#0b1c30] text-lg">Quiz Details</h3>
             <div className="space-y-2">
               <p className="text-sm"><span className="font-bold text-[#464555]">Quiz:</span> {activeSubmission.quiz?.title || activeSubmission.quizTitle || activeSubmission.quizId}</p>
               <p className="text-sm"><span className="font-bold text-[#464555]">Score:</span> {activeSubmission.score}%</p>
               <p className="text-sm"><span className="font-bold text-[#464555]">Status:</span> {activeSubmission.status}</p>
               <p className="text-sm"><span className="font-bold text-[#464555]">Submitted at:</span> {new Date(activeSubmission.submittedAt).toLocaleString()}</p>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-[#0b1c30]">Quiz Review Terminal</h2>
          <p className="text-[#464555] text-sm mt-1">Review live student submissions and grading metrics fetched from database.</p>
        </div>
        <button 
          onClick={fetchSubmissions}
          className="bg-[#eff4ff] border border-[#c7c4d8]/20 p-2.5 rounded-xl text-[#3525cd] hover:bg-[#d3e4fe] transition cursor-pointer flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-lg select-none">refresh</span>
        </button>
      </div>

      {submissionsError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm select-none">error</span>
            <span>{submissionsError}</span>
          </div>
          <button 
            type="button"
            onClick={fetchSubmissions}
            className="bg-[#3525cd] text-white px-4 py-2 rounded-xl text-xs font-bold transition hover:bg-[#4f46e5] active:scale-95 cursor-pointer shrink-0"
          >
            Retry Connection
          </button>
        </div>
      )}

      {loadingSubmissions ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-white border border-[#c7c4d8]/15 rounded-2xl" />
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white border border-[#c7c4d8]/20 rounded-2xl p-16 text-center text-slate-400 text-sm">
          No submissions logged in database records yet.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#c7c4d8]/10 shadow-sm overflow-hidden">
          <div className="p-5 flex items-center justify-between border-b border-[#c7c4d8]/10 bg-[#eff4ff]/30 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="w-1/3">Student Name</span>
            <span className="w-1/3">Quiz Target</span>
            <span className="w-1/6 text-center">Score Grade</span>
            <span className="w-1/6 text-right">Action</span>
          </div>
          <div className="divide-y divide-[#c7c4d8]/10">
            {submissions.map((sub: any) => (
              <div key={sub.id} className="p-5 flex items-center justify-between hover:bg-[#f8f9ff]/80 transition">
                <div className="w-1/3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#3525cd]/10 text-[#3525cd] flex items-center justify-center font-bold text-xs">
                    {sub.studentName ? sub.studentName[0] : "S"}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#0b1c30]">{sub.studentName || `User (${sub.studentId?.substring(0,6)})`}</h5>
                    <p className="text-[10px] font-mono text-slate-400">ID: {sub.studentId}</p>
                  </div>
                </div>
                <div className="w-1/3">
                  <p className="text-sm font-semibold text-[#464555]">{sub.quiz?.title || sub.quizTitle || `Quiz ID: ${sub.quizId?.substring(0,8)}`}</p>
                </div>
                <div className="w-1/6 text-center">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    sub.score >= 80 ? "text-green-700 bg-green-50" : "text-amber-700 bg-amber-50"
                  }`}>
                    {sub.score}%
                  </span>
                </div>
                <div className="w-1/6 text-right">
                  <button onClick={() => setActiveSubmission(sub)} className="text-xs font-bold text-[#3525cd] bg-[#eff4ff] hover:bg-[#d3e4fe] px-4 py-2 rounded-lg transition">
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
