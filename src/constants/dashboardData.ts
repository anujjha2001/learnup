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