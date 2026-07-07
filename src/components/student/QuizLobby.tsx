import React, { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

import QuizResultScreen from "./QuizResultScreen";

export default function QuizLobby({ quizzes, currentUser }: { quizzes: any[], currentUser: any }) {
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleStart = (quiz: any) => {
    setActiveQuiz(quiz);
    setAnswers({});
    setResult(null);
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: currentUser.id,
          studentName: currentUser.name,
          quizId: activeQuiz.id,
          quizTitle: activeQuiz.title,
          answers: Array.from({ length: activeQuiz.questions.length }).map((_, idx) => answers[idx] ?? null)
        })
      });
      
      if (!res.ok) {
         console.error("Submission failed:", await res.text());
         setSubmitting(false);
         return;
      }
      
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (activeQuiz && !result) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <button onClick={() => setActiveQuiz(null)} className="text-slate-400 text-xs hover:text-white transition">
          &larr; Back to Lobby
        </button>
        <div>
          <h2 className="text-2xl font-black text-white">{activeQuiz.title}</h2>
          <p className="text-xs text-slate-400 mt-1">{activeQuiz.description}</p>
        </div>
        <div className="space-y-6">
          {activeQuiz.questions.map((q: any, i: number) => (
            <div key={i} className="p-5 rounded-3xl border border-white/5 bg-[#0b0a1d]/60 shadow-lg space-y-4">
              <h4 className="text-sm font-bold text-slate-100">Q{i + 1}. {q.text}</h4>
              <div className="space-y-2">
                {q.options.map((opt: string, optIdx: number) => (
                  <label key={optIdx} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:bg-white/5 cursor-pointer transition">
                    <input type="radio" name={`q-${i}`} value={optIdx} checked={answers[i] === optIdx} onChange={() => setAnswers({...answers, [i]: optIdx})} className="text-purple-500 bg-transparent border-slate-600 focus:ring-purple-500 focus:ring-offset-gray-900" />
                    <span className="text-xs text-slate-300">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button onClick={submitQuiz} disabled={submitting} className="px-6 py-3 rounded-full bg-purple-500 hover:bg-purple-600 text-white font-black text-xs cursor-pointer transition w-full md:w-auto">
          {submitting ? "Submitting..." : "Submit Quiz"}
        </button>
      </div>
    );
  }

  if (result) {
    return (
      <QuizResultScreen 
        quizTitle={activeQuiz.title}
        score={result.score}
        total={result.total}
        percentage={result.percentage}
        passed={result.passed}
        results={result.results}
        onRetry={() => handleStart(activeQuiz)}
        onBackToLobby={() => {
          setActiveQuiz(null);
          setResult(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <span className="text-[10px] font-black tracking-widest text-purple-400 uppercase">ASSESSMENTS</span>
        <h2 className="text-2xl font-black text-white">Quiz Lobby</h2>
        <p className="text-xs text-slate-400 mt-1">Test your knowledge. Score 60% or higher to pass.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((q) => (
          <div key={q.id} className="p-5 rounded-3xl border border-white/5 bg-[#0b0a1d]/60 shadow-lg hover:border-white/10 transition flex flex-col justify-between space-y-4">
            <div>
              <h4 className="font-extrabold text-slate-100 text-sm line-clamp-1">{q.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1">{q.description}</p>
            </div>
            <button onClick={() => handleStart(q)} className="w-full py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 text-xs font-bold cursor-pointer transition">
              Start Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
