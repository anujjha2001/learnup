"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function OAuthMockContent() {
  const searchParams = useSearchParams();
  const provider = searchParams.get("provider") || "google";
  const role = searchParams.get("role") || "student";
  const [loading, setLoading] = useState(false);

  const handleAuthorize = () => {
    setLoading(true);
    setTimeout(() => {
      const mockUser = {
        email: `${provider}-user-${role}@example.com`,
        name: `Mock ${provider.charAt(0).toUpperCase() + provider.slice(1)} ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      };

      if (window.opener) {
        window.opener.postMessage(
          {
            type: "oauth_success",
            provider,
            role,
            user: mockUser,
          },
          window.location.origin
        );
        window.close();
      } else {
        alert("Opener window not found. OAuth simulation completed locally.");
      }
    }, 1200);
  };

  return (
    <div className="bg-[#f8f9ff] min-h-screen flex flex-col items-center justify-center p-6 font-sans relative overflow-x-hidden antialiased">
      {/* Styles for animation and logos */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* Subtle Atmospheric Background Patterns */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-[#3525cd]/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-[#712ae2]/10 rounded-full blur-[120px]"></div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(#3525cd 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        ></div>
      </div>

      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          {/* Brand/Connection header */}
          <div className="flex items-center gap-3 justify-center">
            <div className="h-10 w-10 bg-gradient-to-tr from-[#3525cd] to-[#712ae2] rounded-xl flex items-center justify-center font-bold text-white shadow-lg">
              LU
            </div>
            <span className="material-symbols-outlined text-slate-400">sync_alt</span>
            {provider === "google" && (
              <div className="h-10 w-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-md p-2">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
            )}
            {provider === "github" && (
              <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg text-white">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
            )}
            {provider === "linkedin" && (
              <div className="h-10 w-10 bg-[#0077B5] rounded-xl flex items-center justify-center shadow-lg text-white font-bold text-xl">
                in
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black bg-gradient-to-r from-[#3525cd] to-[#712ae2] bg-clip-text text-transparent tracking-tight">
              Sign in with {provider.charAt(0).toUpperCase() + provider.slice(1)}
            </h2>
            <p className="text-xs text-slate-500">
              to continue to <span className="text-[#3525cd] font-semibold">LearnUp LMS</span>
            </p>
          </div>

          {/* User selector mock screen */}
          <div className="w-full bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-left space-y-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Choose an account</p>
            
            <button
              onClick={handleAuthorize}
              disabled={loading}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white transition border border-transparent hover:border-slate-200 text-left"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3525cd] to-[#712ae2] flex items-center justify-center font-bold text-xs text-white">
                {role === "student" ? "S" : "I"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-700">
                  {role === "student" ? "Mock Student Account" : "Mock Instructor Account"}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {provider}-user-{role}@example.com
                </p>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-xs text-[#3525cd] font-medium">
              <span className="material-symbols-outlined animate-spin text-sm">sync</span>
              Authenticating secure handshake...
            </div>
          ) : (
            <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed">
              This is a secure OAuth simulation. No passwords are required. Clicking authorize will grant LearnUp mock API access to this session.
            </p>
          )}

          <div className="w-full pt-4 border-t border-slate-100 flex justify-end gap-3 text-xs">
            <button
              onClick={() => window.close()}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAuthorize}
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#3525cd] to-[#712ae2] text-white font-bold hover:brightness-110 transition disabled:opacity-50 shadow-md shadow-indigo-600/10"
            >
              Authorize
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OAuthMockPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#f8f9ff] min-h-screen flex flex-col items-center justify-center p-6 font-sans">
        <div className="text-xs text-[#3525cd] font-medium animate-pulse">Loading secure handshake...</div>
      </div>
    }>
      <OAuthMockContent />
    </Suspense>
  );
}
