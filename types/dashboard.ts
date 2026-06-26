// types/dashboard.ts

export type TabType =
  | "dashboard"
  | "courses"
  | "analytics"
  | "resources"
  | "certificates"
  | "settings"
  | "quiz"; // Quiz tab add ho gaya

export interface StatItem {
  label: string;
  val: string;
  icon: string;
  bg: string;
}

export interface CourseItem {
  title: string;
  cat: string;
  progress: number;
  img: string;
}

export interface ResourceItem {
  name: string;
  size: string;
  desc: string;
  icon: string;
}

export interface CertificateItem {
  title: string;
  id: string;
  date: string;
}

export interface Quiz {
  title: string;
  desc: string;
  progress: number;
  difficulty: "Easy" | "Med" | "Hard";
  image: string;
  status: "Continue" | "Start Quiz" | "Finish Up" | "Unlock";
}