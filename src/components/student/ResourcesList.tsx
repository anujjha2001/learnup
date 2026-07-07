import React from "react";
import { FolderOpen, Download, Trash2 } from "lucide-react";

interface ResourcesListProps {
  resources: any[];
  onDelete: (id: string) => void;
}

export default function ResourcesList({ resources, onDelete }: ResourcesListProps) {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <span className="text-[10px] font-black tracking-widest text-purple-400 uppercase">COURSE MATERIALS</span>
        <h2 className="text-2xl font-black text-white">Resources</h2>
        <p className="text-xs text-slate-400 mt-1">Downloadable materials for your enrolled courses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            No resources available at this time.
          </div>
        ) : (
          resources.map((res, i) => (
            <div key={res.id || i} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-[#0b0a1d]/60 shadow hover:bg-white/5 transition">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100 line-clamp-1">{res.title}</h4>
                  <p className="text-xs text-slate-400">{res.type || "PDF"} • {res.size || "Unknown size"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {res.url && res.url !== "#" && (
                  <a href={res.url} target="_blank" rel="noopener noreferrer" download className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition" title="Download">
                    <Download className="w-4 h-4" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => onDelete(res.id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                  title="Remove resource"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
