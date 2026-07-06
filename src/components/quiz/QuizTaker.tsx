"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Question {
  q?: string;
  text?: string; // Support either .q or .text
  options: string[];
  correctAnswer: any; // index (number) or text (string)
  points?: number;
}

interface Quiz {
  id?: string;
  title: string;
  description: string;
  difficulty?: "Easy" | "Med" | "Hard";
  questions: Question[];
}

interface QuizTakerProps {
  quiz: Quiz;
  onClose: () => void;
  onComplete: (score: number, percentage: number) => void;
}

export default function QuizTaker({ quiz, onClose, onComplete }: QuizTakerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleSelectOption = (optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIdx,
    }));
  };

  const handleNext = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    // Map answers into an array aligned with questions indices
    const answersArray = Array.from({ length: totalQuestions }).map(
      (_, idx) => selectedAnswers[idx] ?? null
    );

    // Get current user session from auth
    let studentId = "std-1";
    let studentName = "Anuj Jha";
    try {
      const storedUser = localStorage.getItem("learnup_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        studentId = parsed.id || studentId;
        studentName = parsed.name || studentName;
      }
    } catch (e) {
      console.error("Failed to parse user details:", e);
    }

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          studentName,
          quizId: quiz.id || `q-mock-${Date.now()}`,
          quizTitle: quiz.title,
          answers: answersArray,
        }),
      });

      if (!response.ok) {
        let errorMsg = "Failed to submit results. Please try again.";
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            errorMsg = errData.error;
          }
        } catch (_) {}
        throw new Error(errorMsg);
      }

      const data = await response.json();
      onComplete(data.score, data.percentage);
    } catch (err: any) {
      console.error("Submission failed:", err);
      setError(err.message || "Something went wrong during submission.");
      setSubmitting(false);
    }
  };

  // Progress percentage calculation
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  if (totalQuestions === 0) {
    return (
      <div className="p-8 text-center glass-card rounded-2xl">
        <p className="text-red-500 font-bold mb-4">This quiz has no questions compiled.</p>
        <button onClick={onClose} className="px-4 py-2 bg-[#3525cd] text-white rounded-xl font-bold">
          Close View
        </button>
      </div>
    );
  }

  // Retrieve question text correctly supporting different database models
  const questionText = currentQuestion.text || currentQuestion.q || "Question";
  const selectedOptionIndex = selectedAnswers[currentIndex];

  return (
    <div className="fixed inset-0 bg-[#0b1c30]/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className={`w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#c7c4d8]/20 overflow-hidden flex flex-col justify-between ${submitting ? "animate-pulse" : ""}`}>
        
        {/* Header */}
        <header className="p-6 border-b border-[#c7c4d8]/20 bg-slate-50/50 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#3525cd] bg-[#3525cd]/10 px-2 py-0.5 rounded-md">
              Attempting Quiz
            </span>
            <h2 className="text-lg font-black text-[#0b1c30] mt-1">{quiz.title}</h2>
          </div>
          <button 
            disabled={submitting}
            onClick={onClose} 
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer text-slate-400 hover:text-[#0b1c30]"
          >
            <span className="material-symbols-outlined text-sm select-none">close</span>
          </button>
        </header>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 relative overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#3525cd] to-[#4f46e5] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-6 flex-1 max-h-[60vh] overflow-y-auto">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm select-none">error</span>
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-xs text-slate-400 font-bold">
            <span>QUESTION {currentIndex + 1} OF {totalQuestions}</span>
            <span>{currentQuestion.points || 1} Points</span>
          </div>

          <h3 className="text-xl font-bold text-[#0b1c30] leading-snug">
            {questionText}
          </h3>

          <div className="grid grid-cols-1 gap-3 pt-2">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOptionIndex === idx;
              return (
                <motion.button
                  key={idx}
                  disabled={submitting}
                  onClick={() => handleSelectOption(idx)}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition duration-200 cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? "border-[#3525cd] bg-[#eff4ff] text-[#3525cd]"
                      : "border-[#c7c4d8]/40 hover:border-[#3525cd]/40 hover:bg-slate-50 text-[#464555]"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                    isSelected ? "border-[#3525cd] bg-[#3525cd] text-white" : "border-slate-300 bg-white"
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Actions Footer */}
        <footer className="p-6 border-t border-[#c7c4d8]/20 bg-slate-50/50 flex justify-between items-center gap-4">
          <button
            disabled={currentIndex === 0 || submitting}
            onClick={handlePrev}
            className="px-5 py-3 rounded-xl border border-[#c7c4d8]/30 font-bold text-xs hover:bg-[#c7c4d8]/10 text-[#464555] active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-all flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm select-none">chevron_left</span> Previous
          </button>

          <button
            disabled={selectedOptionIndex === undefined || submitting}
            onClick={handleNext}
            className="px-6 py-3 rounded-xl bg-[#3525cd] text-white font-bold text-xs hover:bg-[#4f46e5] active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-all flex items-center gap-1 shadow-md shadow-[#3525cd]/15"
          >
            {currentIndex + 1 === totalQuestions 
              ? (submitting ? "Submitting..." : "Submit Attempt") 
              : "Next Question"
            }
            {currentIndex + 1 !== totalQuestions && <span className="material-symbols-outlined text-sm select-none">chevron_right</span>}
          </button>
        </footer>

      </div>
    </div>
  );
}
