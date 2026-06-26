"use client";

import React, { useState } from "react";

export interface QuestionData {
  text: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

interface QuizBuilderProps {
  questions: QuestionData[];
  onChange: (questions: QuestionData[]) => void;
}

export default function QuizBuilder({ questions, onChange }: QuizBuilderProps) {
  const [newQuestionText, setNewQuestionText] = useState("");
  const [type, setType] = useState<"mcq" | "tf">("mcq");
  
  // Options state
  const [options, setOptions] = useState<string[]>(["", "", ""]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);
  
  // True/False correct option state
  const [tfCorrect, setTfCorrect] = useState<"True" | "False">("True");

  const [points, setPoints] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleOptionChange = (index: number, val: string) => {
    setOptions((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const addOptionField = () => {
    if (options.length < 6) {
      setOptions((prev) => [...prev, ""]);
    }
  };

  const removeOptionField = (index: number) => {
    if (options.length > 2) {
      setOptions((prev) => prev.filter((_, idx) => idx !== index));
      if (correctOptionIndex >= options.length - 1) {
        setCorrectOptionIndex(0);
      }
    }
  };

  const handleAddQuestion = () => {
    setError(null);

    if (!newQuestionText.trim()) {
      setError("Question text cannot be empty.");
      return;
    }

    let finalOptions: string[] = [];
    let correctAnswer = "";

    if (type === "mcq") {
      // Validate Options
      const filteredOptions = options.map(o => o.trim()).filter(Boolean);
      if (filteredOptions.length < 2) {
        setError("Please define at least two filled options.");
        return;
      }
      finalOptions = filteredOptions;
      
      const selectedOption = options[correctOptionIndex]?.trim();
      if (!selectedOption) {
        setError("Correct choice must refer to a non-empty option.");
        return;
      }
      correctAnswer = selectedOption;
    } else {
      finalOptions = ["True", "False"];
      correctAnswer = tfCorrect;
    }

    const questionObj: QuestionData = {
      text: newQuestionText.trim(),
      options: finalOptions,
      correctAnswer,
      points,
    };

    onChange([...questions, questionObj]);

    // Reset editor
    setNewQuestionText("");
    setOptions(["", "", ""]);
    setCorrectOptionIndex(0);
    setPoints(1);
  };

  const handleRemoveQuestion = (index: number) => {
    onChange(questions.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-6">
      {/* Question Form */}
      <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Append Quiz Question</h4>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600">Question Text</label>
          <textarea
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
            rows={2}
            placeholder="e.g. Which hook is utilized to register layout updates synchronously?"
            className="w-full p-3 bg-white border border-[#c7c4d8]/30 rounded-xl focus:outline-none focus:border-[#3525cd] text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Question Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "mcq" | "tf")}
              className="w-full px-3 py-2.5 bg-white border border-[#c7c4d8]/30 rounded-xl focus:outline-none focus:border-[#3525cd] text-sm font-semibold"
            >
              <option value="mcq">Multiple Choice (MCQ)</option>
              <option value="tf">True / False</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Points Value</label>
            <input
              type="number"
              min={1}
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-white border border-[#c7c4d8]/30 rounded-xl focus:outline-none focus:border-[#3525cd] text-sm"
            />
          </div>
        </div>

        {/* Dynamic Fields depending on type selection */}
        {type === "mcq" ? (
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-600">Enter Choices & Select Correct Answer</label>
              {options.length < 6 && (
                <button
                  type="button"
                  onClick={addOptionField}
                  className="text-xs font-bold text-[#3525cd] hover:underline cursor-pointer"
                >
                  + Add Option
                </button>
              )}
            </div>
            <div className="space-y-2">
              {options.map((opt, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="correct-answer"
                    checked={correctOptionIndex === index}
                    onChange={() => setCorrectOptionIndex(index)}
                    className="h-4 w-4 text-[#3525cd] border-[#c7c4d8]/30 focus:ring-[#3525cd]"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-3 py-2 bg-white border border-[#c7c4d8]/30 rounded-xl focus:outline-none focus:border-[#3525cd] text-sm"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOptionField(index)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base select-none">delete</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-600">Select Correct Answer</label>
            <div className="flex gap-4">
              {["True", "False"].map((val) => (
                <label key={val} className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="tf-correct"
                    checked={tfCorrect === val}
                    onChange={() => setTfCorrect(val as "True" | "False")}
                    className="h-4 w-4 text-[#3525cd]"
                  />
                  {val}
                </label>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleAddQuestion}
          className="w-full bg-[#f0f2fe] text-[#3525cd] py-2.5 rounded-xl text-xs font-bold hover:bg-[#3525cd] hover:text-white transition cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-sm select-none">add</span>
          Add Question to List
        </button>
      </div>

      {/* Added Questions List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Questions Queue ({questions.length})
        </h4>

        {questions.length === 0 ? (
          <div className="p-6 border border-dashed border-[#c7c4d8]/40 rounded-2xl text-center text-xs text-slate-400">
            No questions added to this quiz yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            {questions.map((q, idx) => (
              <div key={idx} className="p-4 bg-white border border-[#c7c4d8]/20 rounded-xl flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400">Question {idx + 1} ({q.points} pt)</p>
                  <p className="text-sm font-bold text-[#0b1c30]">{q.text}</p>
                  <div className="flex flex-wrap gap-2 pt-1.5">
                    {q.options.map((opt, oIdx) => (
                      <span
                        key={oIdx}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          opt === q.correctAnswer
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-slate-50 text-slate-500 border border-slate-100"
                        }`}
                      >
                        {opt}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(idx)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base select-none">delete</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
