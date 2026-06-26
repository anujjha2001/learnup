import React from "react";

export interface QuizCardProps {
  title: string;
  description: string;
  image: string;
  difficulty: "Easy" | "Med" | "Hard";
  progress: number;
  onStart: () => void;
}

const diffStyle = {
  Easy: "text-green-400 bg-green-500/10",
  Med: "text-yellow-400 bg-yellow-500/10",
  Hard: "text-red-400 bg-red-500/10",
};

export const QuizCard: React.FC<QuizCardProps> = ({
  title,
  description,
  image,
  difficulty,
  progress,
  onStart,
}) => {
  return (
    <div
      onClick={onStart}
      className="
        group cursor-pointer rounded-2xl overflow-hidden
        bg-white/10 backdrop-blur-xl border border-white/20
        shadow-lg hover:shadow-2xl
        transition-all duration-300 hover:-translate-y-2
      "
    >
      {/* IMAGE */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          className="w-full h-full object-cover scale-105 group-hover:scale-115 transition duration-700"
        />

        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${diffStyle[difficulty]}`}
        >
          {difficulty}
        </div>

        {/* glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition">
          {title}
        </h3>

        <p className="text-sm text-gray-300 mt-1">{description}</p>

        {/* progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>

          <div className="h-2 bg-white/10 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <button
          className="
            mt-5 w-full py-2 rounded-xl
            bg-gradient-to-r from-blue-600 to-purple-600
            text-white font-semibold
            hover:scale-[1.02] active:scale-95
            transition
          "
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};
