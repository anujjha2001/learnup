"use client";

import React, { useState } from "react";

interface CertificateCardProps {
  title: string;
  issuedDate: string;
  credentialId: string;
  imageSrc: string;
  dataAlt?: string;
}

function CertificateCard({
  title,
  issuedDate,
  credentialId,
  imageSrc,
  dataAlt,
}: CertificateCardProps) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="relative h-48 bg-surface-container-highest overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={imageSrc}
          alt={title}
          data-alt={dataAlt}
        />
        <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
          <span
            className="material-symbols-outlined text-sm"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
          Blockchain Verified
        </div>
      </div>
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        <div>
          <h3 className="text-xl font-semibold text-on-surface leading-tight">
            {title}
          </h3>
          <p className="text-sm text-on-surface-variant mt-2">
            Issued on {issuedDate} • Credential ID: {credentialId}
          </p>
        </div>
        <div className="flex gap-3 pt-4 mt-auto">
          <button className="flex-1 bg-surface-container-high hover:bg-surface-container-highest text-primary font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-lg">download</span>
            Download
          </button>
          <button className="flex-1 border border-primary text-primary font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-lg">share</span>
            LinkedIn
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CertificatesTab() {
  const [copied, setCopied] = useState(false);

  const certificatesData = [
    {
      title: "Advanced Machine Learning with Python",
      issuedDate: "Sept 24, 2023",
      credentialId: "LUP-99283-ML",
      imageSrc:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCPs7XBWy4FOlPFYoQ9Yes7V8mxOcdWBeOTDvIzfsoMUqVY6u-9Ln6qYr4vZtsKH_VvALh8ODqVqu-NhDpxxE9-RK2pvD7FPRvpG07TUBD54KgAJM-ZXirSLuXeY95oYmvPWhXlFd8utblliy0q_JSI3OxE6Gf0uFl54z8ggYsgEEpj9cF6IkE-hHyQRiEQ4zd1mqYnUAb0IKZmMSiGySZuVSzEGlVhK0jmU6bIKQdDjjQjQlt94p7tAl0yLi1KxjNHgHhLXZtlzbA",
      dataAlt:
        "A premium horizontal digital certificate design with elegant indigo borders and gold foil seals. The background features subtle geometric patterns and the LearnUp brand logo. High-resolution design with a sophisticated corporate aesthetic, soft lighting casting a gentle glow on the paper texture.",
    },
    {
      title: "Full-Stack Web Engineering Mastery",
      issuedDate: "Aug 12, 2023",
      credentialId: "LUP-11204-FS",
      imageSrc:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCJw6GItStJDm3UBrd5gNWSB44RcloCccJBIRobvR2M2MLPd62Td957vjYs_Jy_kXJg9Fd0issYYDvHXjs4su7bQ9qpyXOhu_sn8el0PzLtV4K1Ld5wKPdknOU2oCgucN9x1Wwk_GyYm020i-QIA_3SDW3b1KkxEiVQllLtFODfwhp1jH97eiffHCdV4gKF3HwldijXGR0y0r1K-uvGFLxcyDfYXY3UAIPOyqkxUAkp9dizaEnFuc8Hejxeygd__M09coTTkJ4qDeU",
      dataAlt:
        "A professional certification award layout for Full-Stack Web Development, showcasing complex abstract network graphics in deep blues and purples. Elegant typography with a modern minimalist layout, crisp digital paper texture, and premium embossed details. Subtle cinematic lighting reflecting off a glossy finish.",
    },
    {
      title: "UX/UI Design: Advanced Prototyping",
      issuedDate: "June 05, 2023",
      credentialId: "LUP-05531-UX",
      imageSrc:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC759j7JK8TlbaF88BKoRuelfxEZvkyiHoPI8pGAsy_4t4hWG9CT5p_XgSqc1liEDoT-qmThSxJ-S9PhWLX9TX3wWcG1yGVcY1mWDQwkm_umabb959EEhsURNgk_gdQveSeEQANaIyS2lySo7xetsgLXiTtl9Y53_YMxxLej1DHWnZM_BuTfJgDX-Ays31NQnu69a_tgI-Tw0fUQXN-AfOUD1Sekngrc3lufryf3fowdPUrMfSxKhuf3SphM7WIoJ7xhiHMM85fa78",
      dataAlt:
        "A certificate of completion for UX/UI Design Excellence featuring clean swiss-style typography and vibrant abstract gradients of pink and orange. The design is modern, professional, and features a prominent digital signature and a 3D hologram security sticker in the corner. Minimalist, premium aesthetic with soft ambient occlusion.",
    },
  ];

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-on-surface">
            Achievements &amp; Certificates
          </h1>
          <p className="text-on-surface-variant text-base">
            Manage, share, and track your professional milestones.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="glass-card px-6 py-3 rounded-xl flex flex-col shadow-sm">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Total Earned
            </span>
            <span className="text-2xl font-bold text-primary">12</span>
          </div>
          <div className="glass-card px-6 py-3 rounded-xl flex flex-col shadow-sm">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              In Progress
            </span>
            <span className="text-2xl font-bold text-secondary">03</span>
          </div>
        </div>
      </div>

      {/* Earned Certificates Bento Grid */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
          <h2 className="text-2xl font-semibold text-on-surface">
            Verified Certificates
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificatesData.map((cert, index) => (
            <CertificateCard key={index} {...cert} />
          ))}
        </div>
      </section>

      {/* Upcoming & In-Progress Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Progress Tracker */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-secondary text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              hourglass_top
            </span>
            <h2 className="text-2xl font-semibold text-on-surface">
              Upcoming Certificates
            </h2>
          </div>
          <div className="space-y-4">
            {/* Progress Item 1 */}
            <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-center group">
              <div className="w-full md:w-24 h-24 bg-surface-container-high rounded-xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-5xl text-primary/40 group-hover:scale-110 transition-transform">
                  cloud_done
                </span>
              </div>
              <div className="flex-1 w-full space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-on-surface text-lg">
                      Cloud Infrastructure Architect
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                      Estimated completion: Oct 15, 2023
                    </p>
                  </div>
                  <span className="text-primary font-bold">85%</span>
                </div>
                <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden relative">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary w-[85%] rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 shimmer"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs font-bold text-on-surface-variant">
                  <span>Last lesson: Serverless Computing</span>
                  <span>2 modules left</span>
                </div>
              </div>
            </div>

            {/* Progress Item 2 */}
            <div className="glass-card p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-center group">
              <div className="w-full md:w-24 h-24 bg-surface-container-high rounded-xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-5xl text-primary/40 group-hover:scale-110 transition-transform">
                  security
                </span>
              </div>
              <div className="flex-1 w-full space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-on-surface text-lg">
                      Cybersecurity Professional Path
                    </h4>
                    <p className="text-sm text-on-surface-variant">
                      Estimated completion: Nov 02, 2023
                    </p>
                  </div>
                  <span className="text-primary font-bold">42%</span>
                </div>
                <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden relative">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary w-[42%] rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 shimmer"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs font-bold text-on-surface-variant">
                  <span>Last lesson: Network Encryption</span>
                  <span>7 modules left</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Stats/Features */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">
              info
            </span>
            <h2 className="text-2xl font-semibold text-on-surface">
              Certification Perks
            </h2>
          </div>
          <div className="bg-gradient-to-br from-primary to-secondary p-6 rounded-2xl text-white shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <span className="material-symbols-outlined text-5xl opacity-40">
              workspace_premium
            </span>
            <h4 className="font-bold text-xl leading-tight">
              Join the Talent Network
            </h4>
            <p className="text-sm text-white/80">
              Earned certificates unlock direct access to our 500+ partner
              companies and priority hiring queues.
            </p>
            <button className="w-full bg-white text-primary font-bold py-2 rounded-xl hover:bg-opacity-90 transition-all cursor-pointer">
              Update Portfolio
            </button>
          </div>
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h4 className="font-bold text-on-surface">Verification Hub</h4>
            <div className="flex items-start gap-4">
              <div className="bg-surface-container-high p-2 rounded-lg">
                <span className="material-symbols-outlined text-primary">
                  lock_reset
                </span>
              </div>
              <div>
                <p className="text-sm font-bold">Blockchain Security</p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  All certificates are cryptographically signed on the Ethereum
                  blockchain for tamper-proof verification.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-surface-container-high p-2 rounded-lg">
                <span className="material-symbols-outlined text-primary">
                  contact_page
                </span>
              </div>
              <div>
                <p className="text-sm font-bold">Automatic Resume Sync</p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Connect your LinkedIn and Indeed profiles to sync new
                  achievements automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
