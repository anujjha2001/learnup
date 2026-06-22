// types/dashboard.ts

export type TabType =
  | "dashboard"
  | "courses"
  | "analytics"
  | "resources"
  | "certificates"
  | "settings";

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