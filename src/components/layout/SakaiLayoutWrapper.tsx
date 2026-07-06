import React from "react";

interface SakaiLayoutWrapperProps {
  children: React.ReactNode;
  showBlobs?: boolean;
  lowOpacityBlobs?: boolean;
}

export function SakaiLayoutWrapper({ children, showBlobs = true, lowOpacityBlobs = false }: SakaiLayoutWrapperProps) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden sakai-gradient-bg text-white">
      {/* Background Liquid/Blob Shapes */}
      {showBlobs && (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden z-0 transition-opacity duration-500 ${lowOpacityBlobs ? "opacity-[0.35]" : "opacity-100"}`}>
          {/* Blob 1: Violet/Purple */}
          <div className="absolute top-[5%] left-[-15%] w-[40rem] h-[40rem] rounded-full bg-purple-600/20 blur-[130px] animate-blob-1" />
          
          {/* Blob 2: Orange/Yellow */}
          <div className="absolute top-[25%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-amber-500/15 blur-[110px] animate-blob-2" />
          
          {/* Blob 3: Teal/Mint */}
          <div className="absolute bottom-[15%] left-[10%] w-[45rem] h-[45rem] rounded-full bg-teal-400/15 blur-[140px] animate-blob-3" />
          
          {/* Blob 4: Deep Blue */}
          <div className="absolute bottom-[-15%] right-[5%] w-[40rem] h-[40rem] rounded-full bg-blue-600/18 blur-[120px] animate-blob-1" />
        </div>
      )}

      {/* Content wrapper */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
}
