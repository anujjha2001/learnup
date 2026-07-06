"use client";

import React, { useState, useEffect } from "react";
import { Award, Download, RefreshCw, Loader2, Calendar, FileText, CheckCircle2, Eye, X } from "lucide-react";
import dynamic from "next/dynamic";
import CertificateTemplate from "../certificates/CertificateTemplate";

// Dynamically import PDFViewer with SSR disabled to prevent Next.js hydration issues
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

interface Certificate {
  id: string;
  quizId: string;
  quizTitle: string;
  courseTitle: string;
  score: number;
  issuedAt: string;
  url: string | null;
  uniqueCode: string | null;
  status: "completed" | "processing";
}

export default function CertificatesList({ certificates }: { certificates: Certificate[] }) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [studentName, setStudentName] = useState("LearnUp Student");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("learnup_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) {
          setStudentName(parsed.name);
        }
      }
    } catch (e) {
      console.error("Failed to load user details for certificate preview:", e);
    }
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-black tracking-widest text-[#f97316] uppercase">ACHIEVEMENTS</span>
          <h2 className="text-3xl font-black text-white">My Credentials</h2>
          <p className="text-xs text-slate-400 mt-1">
            Official verifiable certificates for completed courses and passing grades.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-bold text-slate-300 transition duration-300 cursor-pointer active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh List
        </button>
      </div>

      {certificates.length === 0 ? (
        <div className="p-12 rounded-3xl border border-white/5 bg-[#0b0a1d]/60 text-center space-y-4 max-w-xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-500">
            <Award className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-extrabold text-white text-base">No certificates yet</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              Pass any course quiz with a score of <span className="text-[#f97316] font-bold">60% or higher</span> to automatically generate your credential.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => {
            const isProcessing = cert.status === "processing" || !cert.url;
            return (
              <div
                key={cert.id}
                className="relative p-6 rounded-3xl border border-purple-500/10 bg-purple-950/10 backdrop-blur-md shadow-[0_0_30px_rgba(139,92,246,0.03)] hover:shadow-[0_0_40px_rgba(139,92,246,0.06)] hover:border-purple-500/20 transition-all duration-300 flex flex-col justify-between space-y-6 group overflow-hidden"
              >
                {/* Background soft color spots */}
                <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-[#f97316]/5 blur-xl group-hover:bg-[#f97316]/8 transition-all duration-500" />
                <div className="absolute -left-8 -bottom-8 w-24 h-24 rounded-full bg-[#8b5cf6]/5 blur-xl group-hover:bg-[#8b5cf6]/8 transition-all duration-500" />

                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-2xl ${isProcessing ? 'bg-amber-500/10 text-amber-400' : 'bg-purple-500/10 text-purple-400'}`}>
                    <Award className="w-6 h-6" />
                  </div>
                  {isProcessing ? (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Processing
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3" />
                      Verifiable
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="font-black text-slate-100 text-lg group-hover:text-purple-300 transition duration-300 line-clamp-1">
                    {cert.courseTitle}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1">{cert.quizTitle}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-white/5 text-xs">
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Score</p>
                    <p className={`font-black mt-0.5 ${cert.score >= 80 ? 'text-emerald-400' : 'text-purple-400'}`}>
                      {cert.score}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Issue Date</p>
                    <p className="font-semibold text-slate-300 mt-0.5">
                      {new Date(cert.issuedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                </div>

                {isProcessing ? (
                  <div className="space-y-2">
                    <button
                      disabled
                      className="w-full py-3 flex items-center justify-center gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400/70 text-xs font-bold"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Compiling Certificate PDF...
                    </button>
                    <p className="text-[10px] text-slate-500 text-center">
                      Takes about 5-10 seconds. Click "Refresh List" above to update.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <a
                        href={cert.url!}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-3 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#8b5cf6] to-[#f97316] hover:from-[#7c3aed] hover:to-[#ea580c] text-white text-xs font-bold transition duration-300 shadow-md shadow-purple-500/5 cursor-pointer active:scale-95"
                      >
                        <Download className="w-4 h-4" /> Download PDF
                      </a>
                      <a
                        href={`/verify/${cert.uniqueCode}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-3 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition duration-300 cursor-pointer active:scale-95"
                        title="Verify Authenticity"
                      >
                        <FileText className="w-4 h-4" />
                      </a>
                    </div>
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="w-full py-2.5 flex items-center justify-center gap-2 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 hover:text-white text-xs font-bold transition duration-300 cursor-pointer active:scale-95"
                    >
                      <Eye className="w-4 h-4" /> Live Preview
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Certificate Live Preview Modal */}
      {selectedCert && mounted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#0b0a1d] border border-[#8b5cf6]/30 shadow-2xl shadow-purple-500/15 rounded-3xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#070710]/40">
              <div>
                <span className="text-[9px] font-black tracking-widest text-[#f97316] uppercase">CREDENTIAL PREVIEW</span>
                <h4 className="font-extrabold text-white text-base leading-tight mt-0.5">
                  {selectedCert.courseTitle}
                </h4>
              </div>
              <button 
                onClick={() => setSelectedCert(null)} 
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PDFViewer containing CertificateTemplate */}
            <div className="flex-1 bg-[#121124] p-4 flex items-center justify-center relative">
              <PDFViewer className="w-full h-full border-none rounded-xl shadow-inner">
                <CertificateTemplate
                  studentName={studentName}
                  courseTitle={selectedCert.courseTitle}
                  issueDate={new Date(selectedCert.issuedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  uniqueCode={selectedCert.uniqueCode || ""}
                  qrCodeDataUrl={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                    `${window.location.origin}/verify/${selectedCert.uniqueCode}`
                  )}`}
                  signaturePath="/signature.png"
                />
              </PDFViewer>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/5 flex justify-end gap-3 bg-[#070710]/40">
              <button
                onClick={() => setSelectedCert(null)}
                className="py-2.5 px-6 border border-white/10 rounded-xl text-slate-400 hover:text-white font-bold text-xs hover:bg-white/5 transition cursor-pointer"
              >
                Close Preview
              </button>
              <a
                href={selectedCert.url!}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-6 bg-gradient-to-r from-[#8b5cf6] to-[#f97316] hover:from-[#7c3aed] hover:to-[#ea580c] text-white rounded-xl font-extrabold text-xs transition duration-300 shadow-lg shadow-purple-500/10 cursor-pointer"
              >
                Download PDF File
              </a>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
