import React from "react";

interface DeadlineProps {
  month: string;
  day: string;
  title: string;
  subtitle: string;
  badgeBg: string;
  badgeText: string;
}

export default function DeadlineItem({ month, day, title, subtitle, badgeBg, badgeText }: DeadlineProps) {
  return (
    <div className="flex gap-4 p-3 hover:bg-[#eff4ff] rounded-xl transition-all border border-transparent hover:border-[#c7c4d8]/10 items-center">
      <div className={`flex flex-col items-center justify-center w-12 h-12 ${badgeBg} ${badgeText} rounded-xl font-bold text-xs`}>
        <span>{month}</span><span className="text-base">{day}</span>
      </div>
      <div className="flex-1">
        <p className="font-bold text-[#0b1c30] text-sm">{title}</p>
        <p className="text-xs text-[#464555]">{subtitle}</p>
      </div>
    </div>
  );
}