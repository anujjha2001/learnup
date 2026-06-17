'use client';

import React, { useState } from 'react';

export default function AuthPage() {
  const [role, setRole] = useState<'student' | 'instructor'>('student');
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Simulated submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted for role:', role, 'via tab:', authTab);
  };

  return (
    <>
      {/* Dynamic injection of Material Symbols and Custom Classes */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
        }
        .primary-glow {
          box-shadow: 0 0 15px -3px rgba(79, 70, 229, 0.4);
          transition: all 0.3s ease;
        }
        .primary-glow:hover {
          box-shadow: 0 0 25px -2px rgba(79, 70, 229, 0.6);
          transform: translateY(-1px);
        }
      `}} />

      <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen flex flex-col items-center justify-center relative overflow-x-hidden font-sans">
        
        {/* Subtle Atmospheric Background Patterns */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-[#3525cd]/10 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-[#712ae2]/10 rounded-full blur-[120px]"></div>
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]" 
            style={{ backgroundImage: 'radial-gradient(#3525cd 1px, transparent 1px)', backgroundSize: '32px 32px' }}
          ></div>
        </div>

        {/* Main Container */}
        <main className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-10 flex flex-col items-center">
          
          {/* Branding Header */}
          <header className="mb-10 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#3525cd] to-[#712ae2] bg-clip-text text-transparent">
              Accelerate Your Growth
            </h1>
            <p className="text-[#464555] mt-2"></p>
          </header>

          {/* Split Layout / Centered Card */}
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Role Selection Panel (Col 1-5) */}
            <section className="lg:col-span-5 flex flex-col gap-4">
              <div className="mb-2 px-1">
                <h2 className="text-2xl text-[#0b1c30] font-bold">Select Your Role</h2>
                <p className="text-[#464555]">Choose how you'll interact with LearnUp</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Student Role */}
                <button 
                  type="button"
                  onClick={() => setRole('student')}
                  className={`group glass-card p-10 rounded-xl flex items-center gap-6 text-left transition-all hover:border-[#3525cd]/50 ${role === 'student' ? 'border-2 border-[#3525cd] bg-[#eff4ff]' : ''}`}
                >
                  <div className="w-16 h-16 rounded-xl bg-[#4f46e5]/10 flex items-center justify-center text-[#3525cd] transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined text-[40px]">school</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Student</h3>
                    <p className="text-[#464555]">I want to learn new skills and advance my career.</p>
                  </div>
                </button>

                {/* Instructor Role */}
                <button 
                  type="button"
                  onClick={() => setRole('instructor')}
                  className={`group glass-card p-10 rounded-xl flex items-center gap-6 text-left transition-all hover:border-[#3525cd]/50 ${role === 'instructor' ? 'border-2 border-[#3525cd] bg-[#eff4ff]' : ''}`}
                >
                  <div className="w-16 h-16 rounded-xl bg-[#8a4cfc]/10 flex items-center justify-center text-[#712ae2] transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined text-[40px]">co_present</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Instructor</h3>
                    <p className="text-[#464555]">I want to share my knowledge and manage my students.</p>
                  </div>
                </button>
              </div>

              {/* Descriptive Visual Card */}
              <div className="mt-4 p-6 glass-card rounded-xl relative overflow-hidden hidden lg:block">
                <div className="relative z-10">
                  <span className="material-symbols-outlined text-[#3525cd] mb-2">verified_user</span>
                  <h4 className="font-bold text-[#0b1c30]">Secure &amp; Scalable</h4>
                  <p className="text-[13px] text-[#464555] leading-relaxed">Enterprise-grade security protecting your data and intellectual property across all learning paths.</p>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-5">
                  <span className="material-symbols-outlined text-[120px]">shield</span>
                </div>
              </div>
            </section>

            {/* Authentication Panel (Col 6-12) */}
            <section className="lg:col-span-7">
              <div className="glass-card rounded-xl overflow-hidden shadow-xl border-[#c7c4d8]/10">
                
                {/* Tab Switcher */}
                <div className="flex border-b border-[#c7c4d8]/10">
                  <button 
                    type="button"
                    onClick={() => setAuthTab('login')}
                    className={`flex-1 py-6 text-center font-bold transition-all ${authTab === 'login' ? 'border-b-2 border-[#3525cd] text-[#3525cd]' : 'text-[#464555] hover:text-[#0b1c30]'}`}
                  >
                    Log In
                  </button>
                  <button 
                    type="button"
                    onClick={() => setAuthTab('register')}
                    className={`flex-1 py-6 text-center font-bold transition-all ${authTab === 'register' ? 'border-b-2 border-[#3525cd] text-[#3525cd]' : 'text-[#464555] hover:text-[#0b1c30]'}`}
                  >
                    Register
                  </button>
                </div>

                <div className="p-10 md:p-8">
                  {/* Social Auth */}
                  <button type="button" className="w-full flex items-center justify-center gap-4 py-4 px-6 rounded-xl border border-[#c7c4d8]/20 bg-[#f8f9ff] text-[#0b1c30] font-bold hover:bg-[#eff4ff] transition-all active:scale-[0.98] mb-6 group">
                    <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-[1px] flex-1 bg-[#c7c4d8]/20"></div>
                    <span className="text-[12px] font-bold text-[#777587] uppercase tracking-widest">or continue with email</span>
                    <div className="h-[1px] flex-1 bg-[#c7c4d8]/20"></div>
                  </div>

                  {/* Auth Form */}
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2 transition-transform duration-200 focus-within:scale-[1.01]">
                      <label className="font-bold text-[#0b1c30]" htmlFor="email">Email Address</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#464555] group-focus-within:text-[#3525cd]">
                          <span className="material-symbols-outlined text-md">mail</span>
                        </div>
                        <input 
                          className="w-full bg-[#eff4ff] border border-[#c7c4d8]/20 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20 rounded-xl py-4 pl-12 transition-all outline-none" 
                          id="email" 
                          placeholder="name@example.com" 
                          required 
                          type="email" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2 transition-transform duration-200 focus-within:scale-[1.01]">
                      <div className="flex justify-between items-center">
                        <label className="font-bold text-[#0b1c30]" htmlFor="password">Password</label>
                        {authTab === 'login' && (
                          <a className="text-sm font-bold text-[#3525cd] hover:underline" href="#">Forgot password?</a>
                        )}
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#464555] group-focus-within:text-[#3525cd]">
                          <span className="material-symbols-outlined text-md">lock</span>
                        </div>
                        <input 
                          className="w-full bg-[#eff4ff] border border-[#c7c4d8]/20 focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20 rounded-xl py-4 pl-12 transition-all outline-none" 
                          id="password" 
                          placeholder="••••••••" 
                          required 
                          type={showPassword ? "text" : "password"} 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#464555] hover:text-[#0b1c30]"
                        >
                          <span className="material-symbols-outlined text-md">
                            {showPassword ? "visibility_off" : "visibility"}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Register Specific Fields */}
                    {authTab === 'register' && (
                      <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex items-start gap-4">
                          <input className="mt-1 rounded text-[#3525cd] focus:ring-[#3525cd]" id="terms" type="checkbox" required />
                          <label className="text-sm text-[#464555]" htmlFor="terms">
                            I agree to the <a className="text-[#3525cd] hover:underline" href="#">Terms of Service</a> and <a className="text-[#3525cd] hover:underline" href="#">Privacy Policy</a>.
                          </label>
                        </div>
                      </div>
                    )}

                    <button className="w-full py-4 rounded-xl bg-[#3525cd] text-white font-bold primary-glow flex items-center justify-center gap-4 transition-all" type="submit">
                      <span>{authTab === 'login' ? 'Sign In' : 'Create Account'}</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </form>
                </div>

                {/* Footer Help */}
                <div className="bg-[#eff4ff] p-4 px-10 flex justify-center border-t border-[#c7c4d8]/10">
                  <p className="text-sm text-[#464555]">Need help? <a className="font-bold text-[#3525cd] hover:underline" href="#">Contact Support</a></p>
                </div>
              </div>
            </section>

          </div>
        </main>

        {/* Footer Copyright */}
        <footer className="mt-auto py-10 text-center w-full">
          <p className="text-[#464555] opacity-60">© 2026 LearnUp. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}