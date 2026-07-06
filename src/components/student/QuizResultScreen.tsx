import React from "react";
import { CheckCircle, XCircle, Award, RefreshCw, ChevronRight } from "lucide-react";

interface QuizResultScreenProps {
  quizTitle: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  results: any[];
  onRetry: () => void;
  onBackToLobby: () => void;
}

export default function QuizResultScreen({
  quizTitle,
  score,
  total,
  percentage,
  passed,
  results,
  onRetry,
  onBackToLobby,
}: QuizResultScreenProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-white flex items-center gap-3">
          <Award className="w-8 h-8 text-[#5436f9]" />
          Quiz Results: {quizTitle}
        </h2>
        <button
          onClick={onBackToLobby}
          className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-1 cursor-pointer"
        >
          Back to Quizzes
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className={`glass-card p-8 rounded-2xl border ${passed ? 'border-green-500/20' : 'border-red-500/20'} relative overflow-hidden`}>
        {/* Background glow based on result */}
        <div className={`absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl opacity-20 ${passed ? 'bg-green-500' : 'bg-red-500'}`}></div>
        
        <div className="text-center space-y-4 mb-10 relative z-10">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${passed ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'} mb-4`}>
            {passed ? <CheckCircle className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
          </div>
          <h3 className={`text-4xl font-black ${passed ? 'text-green-400' : 'text-red-400'}`}>
            {passed ? "PASSED!" : "FAILED"}
          </h3>
          <p className="text-slate-300 text-lg">
            You scored <span className="font-bold text-white">{score}</span> out of {total} (<span className="font-bold text-white">{percentage}%</span>)
          </p>
          <div className="w-full max-w-md mx-auto bg-slate-800/50 rounded-full h-3 mt-4 overflow-hidden border border-slate-700">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${passed ? 'bg-green-500' : 'bg-red-500'}`} 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-slate-400 mt-2">Passing threshold: 60%</p>
        </div>

        <div className="space-y-4 relative z-10">
          <h4 className="text-xl font-bold text-white mb-4 border-b border-slate-700/50 pb-2">Detailed Review</h4>
          {results && results.map((res: any, idx: number) => (
            <div key={idx} className={`p-4 rounded-xl border flex items-start gap-4 transition-colors ${res.isCorrect ? 'bg-green-500/5 border-green-500/10' : 'bg-red-500/5 border-red-500/10'}`}>
              <div className="mt-0.5">
                {res.isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-slate-200 font-medium mb-1">Question {res.questionIndex + 1}</p>
                <div className="text-sm space-y-1">
                  <p className={res.isCorrect ? "text-green-300" : "text-red-300"}>
                    <span className="font-semibold opacity-70">Your Answer:</span> {res.studentAnswer !== undefined && res.studentAnswer !== null ? res.studentAnswer.toString() : "Skipped"}
                  </p>
                  {!res.isCorrect && (
                    <p className="text-slate-400">
                      <span className="font-semibold opacity-70">Correct Answer:</span> {res.correctAnswer !== undefined ? res.correctAnswer.toString() : "N/A"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 flex justify-center gap-4 relative z-10">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all cursor-pointer border border-slate-700 hover:border-slate-600"
          >
            <RefreshCw className="w-5 h-5" />
            Retry Quiz
          </button>
          {passed && (
            <button
              onClick={onBackToLobby}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#5436f9] hover:bg-[#4325e8] text-white font-bold transition-all shadow-[0_0_20px_rgba(84,54,249,0.4)] cursor-pointer"
            >
              Continue Learning
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
