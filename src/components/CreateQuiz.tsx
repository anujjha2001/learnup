"use client";

import React, { useState } from "react";
import QuizBuilder, { QuestionData } from "./QuizBuilder";

interface CreateQuizProps {
  onSuccess?: () => void;
}

export default function CreateQuiz({ onSuccess }: CreateQuizProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("c1"); // default linked course
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [timeLimit, setTimeLimit] = useState(30); // in minutes
  const [passingScore, setPassingScore] = useState(70); // percentage

  const handleNext = () => {
    setError(null);
    if (currentStep === 1) {
      if (!title.trim()) {
        setError("Quiz title is required.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (questions.length === 0) {
        setError("Please add at least one question to the quiz.");
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePrev = () => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const payload = {
        title,
        description,
        courseId,
        questions,
        timeLimit,
        passingScore,
      };

      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to publish quiz");
      }

      // Success
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form
      setTitle("");
      setDescription("");
      setQuestions([]);
      setCurrentStep(1);
    } catch (err: any) {
      setError(err.message || "Failed to publish quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto py-6 px-4 sm:px-6">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-extrabold text-[#0b1c30] tracking-tight">Create New Quiz</h1>
        <p className="text-sm text-[#464555]">Configure assessment constraints and append question nodes.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between relative mb-10 px-4">
        <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-200 -z-10" />
        <div
          className="absolute top-5 left-0 h-[2px] bg-[#3525cd] transition-all duration-500 -z-10"
          style={{ width: `${(currentStep - 1) * 50}%` }}
        />

        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`flex flex-col items-center gap-2 z-10 ${
              currentStep >= step ? "text-[#3525cd]" : "text-slate-400"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                currentStep >= step ? "bg-[#3525cd] text-white" : "bg-slate-100 text-slate-400"
              }`}
            >
              {step}
            </div>
            <span className="font-semibold text-xs uppercase tracking-wider">
              {step === 1 ? "Details" : step === 2 ? "Builder" : "Settings"}
            </span>
          </div>
        ))}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-semibold animate-fadeIn">
          {error}
        </div>
      )}

      {/* Form Content */}
      <div className="space-y-8">
        {currentStep === 1 && (
          <section className="glass-card p-6 sm:p-8 rounded-2xl space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0b1c30] uppercase tracking-wider">Quiz Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Next.js Server Actions Performance"
                className="w-full p-4 rounded-xl border border-[#c7c4d8]/30 focus:outline-none focus:border-[#3525cd] text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0b1c30] uppercase tracking-wider">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of quiz goals..."
                rows={4}
                className="w-full p-4 rounded-xl border border-[#c7c4d8]/30 focus:outline-none focus:border-[#3525cd] text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0b1c30] uppercase tracking-wider">Linked Syllabus Course</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-4 py-3 border border-[#c7c4d8]/30 rounded-xl focus:outline-none focus:border-[#3525cd] text-sm font-semibold"
              >
                <option value="c1">Advanced React Architecture</option>
                <option value="c2">Machine Learning Operational Scaling</option>
              </select>
            </div>
          </section>
        )}

        {currentStep === 2 && (
          <section className="glass-card p-6 sm:p-8 rounded-2xl">
            <QuizBuilder questions={questions} onChange={setQuestions} />
          </section>
        )}

        {currentStep === 3 && (
          <section className="glass-card p-6 sm:p-8 rounded-2xl space-y-6">
            <h3 className="font-bold text-[#0b1c30] text-lg">Verification & Settings</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0b1c30] uppercase tracking-wider">Time Allowance (Minutes)</label>
                <input
                  type="number"
                  min={1}
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value) || 10)}
                  className="w-full p-4 rounded-xl border border-[#c7c4d8]/30 focus:outline-none focus:border-[#3525cd] text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0b1c30] uppercase tracking-wider">Passing Score (%)</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={passingScore}
                  onChange={(e) => setPassingScore(parseInt(e.target.value) || 70)}
                  className="w-full p-4 rounded-xl border border-[#c7c4d8]/30 focus:outline-none focus:border-[#3525cd] text-sm"
                />
              </div>
            </div>

            <div className="p-4 bg-[#eff4ff] border border-blue-100 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold text-[#3525cd] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm select-none">info</span>
                Quiz Configuration Review
              </h4>
              <ul className="text-xs text-[#464555] space-y-1">
                <li>• <strong>Title:</strong> {title}</li>
                <li>• <strong>Questions Count:</strong> {questions.length} node(s)</li>
                <li>• <strong>Aggregate Points:</strong> {questions.reduce((sum, q) => sum + q.points, 0)} points</li>
              </ul>
            </div>
          </section>
        )}

        {/* Footer Navigation buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1 || loading}
            className={`px-6 py-3 border border-[#c7c4d8]/30 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition ${
              currentStep === 1 ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            Previous
          </button>

          {currentStep === 3 ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-[#3525cd] text-white rounded-xl font-bold shadow-md shadow-[#3525cd]/15 hover:brightness-110 disabled:opacity-50 transition cursor-pointer flex items-center justify-center min-w-[140px]"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Publish Quiz"
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-3 bg-[#3525cd] text-white rounded-xl font-bold shadow-md shadow-[#3525cd]/15 hover:brightness-110 transition cursor-pointer"
            >
              {currentStep === 1 ? "Next: Question Builder" : "Next: Review Settings"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}