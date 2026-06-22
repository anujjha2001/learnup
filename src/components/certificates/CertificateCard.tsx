import React from "react";
import { CertificateItem } from "@/types/dashboard";

export default function CertificateCard({ title, id, date }: CertificateItem) {
  return (
    <div className="bg-white border-2 border-dashed border-[#c7c4d8]/40 p-6 rounded-2xl flex flex-col justify-between space-y-6 relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] bg-[#eaddff] text-[#25005a] font-bold px-2 py-0.5 rounded-full">VERIFIED ID: {id}</span>
          <h4 className="text-lg font-bold text-[#0b1c30] mt-2">{title}</h4>
          <p className="text-xs text-[#464555] mt-1">Issued securely by LearnUp Accreditation Board</p>
        </div>
        <span className="material-symbols-outlined text-[#8a4cfc] text-4xl">workspace_premium</span>
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-[#c7c4d8]/10 text-xs">
        <span className="text-[#777587]">Issued {date}</span>
        <div className="flex gap-2">
          <button className="text-[#3525cd] font-bold hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">share</span> Share
          </button>
          <button className="bg-[#3525cd] text-white px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-[#4d44e3]">
            PDF Download
          </button>
        </div>
      </div>
    </div>
  );
}
