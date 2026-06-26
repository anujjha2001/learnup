import { StatItem, CourseItem, ResourceItem, CertificateItem } from "@/types/dashboard";

export const STATS_DATA: StatItem[] = [
  { label: "Total Courses", val: "12", icon: "menu_book", bg: "bg-[#3525cd]/10 text-[#3525cd]" },
  { label: "Certificates", val: "5", icon: "verified", bg: "bg-[#712ae2]/10 text-[#712ae2]" },
  { label: "Weekly Hours", val: "18.4", icon: "schedule", bg: "bg-[#a44100]/20 text-[#7e3000]" },
  { label: "Completion Rate", val: "82%", icon: "analytics", bg: "bg-[#ffdad6] text-[#ba1a1a]" },
];

export const ALL_COURSES_DATA: CourseItem[] = [
  { title: "Advanced Design Systems for Enterprise", cat: "UI/UX Design", progress: 64, img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80" },
  { title: "Scalable Architecture with Python & AWS", cat: "Backend Dev", progress: 42, img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80" },
  { title: "Next.js 15 & Tailwind CSS Production Architecture", cat: "Frontend Dev", progress: 90, img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80" },
  { title: "Data Structures & Enterprise Algorithms", cat: "Computer Science", progress: 15, img: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=800&q=80" },
  { title: "SAP ABAP & Fiori Cloud Extensions", cat: "Enterprise ERP", progress: 0, img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" },
  { title: "Product Strategy & Technical Leadership", cat: "Management", progress: 0, img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" },
];

export const RESOURCES_DATA: ResourceItem[] = [
  { name: "Enterprise-UI-Kit-v2.fig", size: "48.2 MB", desc: "Complete UI tokens and component architectures for the Figma UX Track.", icon: "draw" },
  { name: "AWS-Deployment-Scripts-CloudFormation.zip", size: "4.1 MB", desc: "Production templates for scaling automated microservices safely.", icon: "terminal" },
  { name: "Python-DataStructures-Handout.pdf", size: "12.8 MB", desc: "Core reference layouts for high-performance algorithm design patterns.", icon: "description" },
  { name: "Fiori-Design-Guidelines-Summary.pdf", size: "6.5 MB", desc: "Cheat sheets for modern enterprise layouts and components.", icon: "menu_book" },
];

export const CERTIFICATES_DATA: CertificateItem[] = [
  { title: "Foundation of UI Design Certification", id: "LUP-9831A", date: "Jan 14, 2026" },
  { title: "Advanced Architecture Masterclass", id: "LUP-0042B", date: "Mar 22, 2026" },
];

// Add this interface to your types/dashboard.ts first if it's missing
export interface QuizItem {
  title: string;
  desc: string;
  progress: number;
  difficulty: "Easy" | "Med" | "Hard";
  image: string;
  status: "Continue" | "Start Quiz" | "Finish Up" | "Unlock";
}

// Add this to dashboardData.ts
export const QUIZ_DATA: QuizItem[] = [
  {
    title: "Advanced UI Patterns",
    desc: "Master the architecture of responsive layouts and complex grids.",
    progress: 65,
    difficulty: "Hard",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDt0RKBz8-zieTb67GL_Pdp4w2YA4s2FYs64MWn1HwWXN4eqUt_mgY87cp7OPQ2eOTeVbmdkL9mCtbwaQ6jaR7qwW6kbrir5twW-sNzcf5banNkL2o5P6CmLECFyFussCmv2iBDDnVz7gxCiOqa4VDWAGPxEXEtDwSURIIgtamOxH8r6pO_3EGV5geLJ-IMY68AMGcIYQ5ZVXMa89QBpCGaJELFvSljpVW-WlUyXsKcirTH16GTRA6ssYreXP_cIauwxzhxQ0Eyc_w",
    status: "Continue"
  },
  {
    title: "Sales Psychology",
    desc: "Understanding cognitive biases to drive better conversion rates.",
    progress: 12,
    difficulty: "Med",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmMWXzLhCIKMGv1Qt9e0Ga0eQfh2rHgPuQuWnWudzM3wEWQ9S0MT0Qlj-qudEuC8C7xZE9rhGueqep2yBgJEvIUrHc_qSEYgBs26TcBrYr3xhTt_lWpXfKBf-UwYQZbcSULuc0HRNCBn02fTNaNA9oSVkGRpaQSK4wgp1T44WX1d-CIUZ_zak5CxErHU2SyqkF8KgZQEsvpEiT9wqZH58Pb2vVbxY2CKIhm3xhu6hk9DUVT7B5eYzNEGrCnWWnNx8xzs2hc7yIcmA",
    status: "Start Quiz"
  },
  {
    title: "Cloud Fundamentals",
    desc: "The basics of serverless architecture and global edge delivery.",
    progress: 90,
    difficulty: "Easy",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKdv1Wu26CMEYIs25HrTFq8DQmIf0FEzerBPE7MDqMdbxK8muZH7rua5yK-6cNlx1xtoho_i-ZbzDOPB6Djn7YHkaQzYaByiUeLHdgacu5Ad8ihf87yIdfhCxY1Eqq5V-J1Lim-9U81ebY0hN5l2DodckssBQaFDB3ImtyVxxbvWc5GiRGmMg8xV7VMC9EsAX_obHSXNFhQDASRfiD0CfmW74nyp7CdmtIjYIaXai_rAQLHNj8fVwXnQAFBVGN7tfDt6pqBLWAZxo",
    status: "Finish Up"
  },
  {
    title: "Growth Marketing",
    desc: "LTV, CAC, and the mathematical framework of rapid scaling.",
    progress: 0,
    difficulty: "Hard",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAU4Gg8TCxNS36FxHVrxiEg9rUUyexDHhbguD36SiMU04GhAK1_DHGKiLPRlubJ9-VnpcwmWYM7jqZsGpnlJC6OfOqN7u4pSRzESdwHhnl9VrDyAIpbHYv9aTYIBZNFzMBuS3H-eoAhpfaKP37uLxkclzkO0p1lKun8fDZnGDg-yorRmzt-vBW1MF-NO4Wkv_9dc_knE--5XbtsVvGA2EM_hEm_qbNmV_Ey-6B3cnnXc9Fo9AW3pcsdPsbE0A7TXaOxMde-u9yemMg",
    status: "Unlock"
  }
];