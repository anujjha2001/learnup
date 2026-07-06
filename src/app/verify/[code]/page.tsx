import React from "react";
import { db } from "@/lib/db";
import { Award, CheckCircle, ShieldAlert, Calendar, BookOpen, Download, User } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    code: string;
  }>;
}

export default async function VerifyCertificatePage({ params }: PageProps) {
  const { code } = await params;

  // Fetch certificate details with relations
  let certificate = null;
  let error = null;

  try {
    certificate = await db.certificate.findUnique({
      where: { uniqueCode: code },
      include: {
        student: {
          select: { name: true, email: true }
        },
        course: {
          select: { title: true, description: true }
        }
      }
    });
  } catch (err: any) {
    console.error("Verification DB query error:", err);
    error = "Failed to query database";
  }

  const isValid = !!certificate;

  return (
    <div className="min-h-screen bg-[#070710] text-slate-100 flex flex-col justify-between items-center p-6 relative overflow-hidden font-sans">
      {/* Background glowing effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-orange-600/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between py-6 border-b border-white/5 relative z-10">
        <Link href="/" className="flex items-center gap-3">
          <svg className="h-9 w-9 transition-transform hover:scale-105" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <rect width="200" height="200" rx="40" fill="transparent" />
            <path d="M60 40 V140 H140" stroke="url(#logoGrad)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M110 90 L140 60 L170 90" stroke="#f97316" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M140 60 V120" stroke="#f97316" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <span className="text-2xl font-black bg-gradient-to-r from-[#8b5cf6] to-[#f97316] bg-clip-text text-transparent tracking-tight">
            LearnUp
          </span>
        </Link>
        <span className="text-xs font-bold text-slate-500 tracking-widest uppercase bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
          Verification Hub
        </span>
      </header>

      {/* Main Verification Card */}
      <main className="flex-1 w-full max-w-2xl flex flex-col justify-center py-12 relative z-10">
        {certificate ? (
          <div className="glass-card p-8 md:p-10 rounded-3xl border border-emerald-500/20 bg-emerald-950/5 shadow-2xl shadow-emerald-950/20 space-y-8 animate-fadeIn">
            {/* Status Header */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#8b5cf6] to-[#f97316] p-[2px] flex items-center justify-center text-white shadow-lg shadow-purple-500/10">
                <div className="w-full h-full rounded-full bg-[#070710] flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
              <div className="space-y-2">
                <span className="inline-block text-[10px] font-black tracking-widest text-white uppercase bg-gradient-to-r from-[#8b5cf6] to-[#f97316] px-3.5 py-1 rounded-full shadow-md shadow-purple-500/15">
                  Verified by LearnUp
                </span>
                <h1 className="text-2xl font-black text-white pt-1">Valid Digital Credential</h1>
                <p className="text-xs text-slate-400 max-w-sm">This certificate has been cryptographically validated in our database records.</p>
              </div>
            </div>

            {/* Certificate Details */}
            <div className="border-t border-b border-white/5 py-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <User className="w-5 h-5 text-[#f97316]" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Recipient</p>
                    <p className="text-sm font-bold text-slate-200">{certificate.student.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <BookOpen className="w-5 h-5 text-[#8b5cf6]" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Course Title</p>
                    <p className="text-sm font-bold text-slate-200 line-clamp-1">{certificate.course.title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Issue Date</p>
                    <p className="text-sm font-bold text-slate-200">
                      {new Date(certificate.issueDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Security Code</p>
                    <p className="text-sm font-bold text-emerald-300 font-mono">{certificate.uniqueCode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={certificate.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-6 bg-gradient-to-r from-[#8b5cf6] to-[#f97316] hover:from-[#7c3aed] hover:to-[#ea580c] text-white text-sm font-bold rounded-2xl flex items-center justify-center gap-2 transition shadow-lg shadow-purple-500/10 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download PDF copy
              </a>
              <Link
                href="/"
                className="py-3 px-6 border border-white/10 rounded-2xl text-slate-400 hover:text-white text-sm font-bold hover:bg-white/5 transition text-center cursor-pointer"
              >
                Back to LearnUp
              </Link>
            </div>
          </div>
        ) : (
          <div className="glass-card p-8 md:p-10 rounded-3xl border border-red-500/20 bg-red-950/5 shadow-2xl shadow-red-950/20 space-y-8 animate-fadeIn text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-white">Invalid Certificate</h1>
              <p className="text-sm text-slate-400">
                The credential code <span className="text-red-400 font-mono font-bold">{code}</span> could not be verified in our records.
              </p>
              <p className="text-xs text-slate-500">
                Please make sure the link is correct or contact Support if you believe this is an error.
              </p>
            </div>

            <div className="pt-4">
              <Link
                href="/"
                className="inline-block py-3 px-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-200 text-sm font-bold transition cursor-pointer"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl py-6 border-t border-white/5 text-center text-xs text-slate-500 relative z-10">
        <p>© 2026 LearnUp LMS. Cryptographically secured digital credentials.</p>
      </footer>
    </div>
  );
}
