import React, { useState } from "react";
import { Plus, X, Upload, CheckCircle, Video, Tag, LayoutTemplate } from "lucide-react";

interface CourseBuilderProps {
  onBack: () => void;
  instructorId: string;
}

export default function CourseBuilder({ onBack, instructorId }: CourseBuilderProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [price, setPrice] = useState("99");
  const [template, setTemplate] = useState("default");
  
  const [modules, setModules] = useState([{ title: "", url: "", duration: "" }]);
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddModule = () => {
    setModules([...modules, { title: "", url: "", duration: "" }]);
  };

  const handleRemoveModule = (index: number) => {
    const newModules = [...modules];
    newModules.splice(index, 1);
    setModules(newModules);
  };

  const handleModuleChange = (index: number, field: string, value: string) => {
    const newModules = [...modules];
    (newModules[index] as any)[field] = value;
    setModules(newModules);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title,
        description,
        image: image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600",
        thumbnailUrl: thumbnailUrl || image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600",
        isFree,
        price: isFree ? 0 : parseFloat(price),
        template,
        modules,
        instructorId
      };

      const res = await fetch("/api/courses/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onBack();
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
        <CheckCircle className="w-20 h-20 text-emerald-400 mb-4" />
        <h2 className="text-3xl font-black text-white mb-2">Course Deployed!</h2>
        <p className="text-slate-400">Your interactive syllabus framework is now live.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn w-full max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack} 
          className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-300 hover:bg-white/10 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined select-none text-sm">arrow_back</span>
        </button>
        <div>
          <h2 className="text-2xl font-black text-white">Course Creation Studio</h2>
          <p className="text-slate-400 text-sm">Build and deploy structured learning paths.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card rounded-2xl border border-white/5 overflow-hidden shadow-2xl bg-[#0b0a1d]/60 backdrop-blur-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Main Content Area */}
          <div className="lg:col-span-2 p-8 space-y-8 border-b lg:border-b-0 lg:border-r border-white/10">
            <h3 className="text-sm font-black text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <Upload className="w-4 h-4" /> Core Parameters
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Course Title</label>
                <input 
                  type="text" required value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="e.g., Advanced React Architecture" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl text-sm py-3 px-4 focus:ring-2 focus:ring-purple-500/50 outline-none text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Description</label>
                <textarea 
                  rows={3} required value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="A detailed breakdown of the syllabus..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl text-sm py-3 px-4 focus:ring-2 focus:ring-purple-500/50 outline-none text-white transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Cover Image / Poster Poster URL</label>
                <div className="flex gap-4 items-center">
                  <input 
                    type="text" value={image} onChange={e => { setImage(e.target.value); setThumbnailUrl(e.target.value); }}
                    placeholder="https://..." 
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl text-sm py-3 px-4 focus:ring-2 focus:ring-purple-500/50 outline-none text-white transition-all"
                  />
                  <label className="bg-[#f97316] hover:bg-[#ea580c] text-white py-3 px-4 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-all shrink-0">
                    <Upload className="w-3.5 h-3.5" /> Upload File
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("bucket", "course-videos");
                        try {
                          const res = await fetch("/api/media/upload", {
                            method: "POST",
                            body: formData,
                          });
                          if (res.ok) {
                            const data = await res.json();
                            setImage(data.url);
                            setThumbnailUrl(data.url);
                            alert("Poster uploaded successfully!");
                          } else {
                            alert("Poster upload failed.");
                          }
                        } catch (err) {
                          console.error(err);
                          alert("Error uploading poster.");
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-blue-400 uppercase tracking-wider flex items-center gap-2">
                    <Video className="w-4 h-4" /> Video Modules
                  </h3>
                  <button type="button" onClick={handleAddModule} className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Module
                  </button>
                </div>
                
                <div className="space-y-4">
                  {modules.map((mod, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-white/5 bg-white/5 relative group">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Module Title</label>
                          <input type="text" required value={mod.title} onChange={e => handleModuleChange(idx, 'title', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg text-xs py-2 px-3 text-white focus:outline-none focus:border-blue-500/50" placeholder="Introduction" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Duration</label>
                          <input type="text" required value={mod.duration} onChange={e => handleModuleChange(idx, 'duration', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg text-xs py-2 px-3 text-white focus:outline-none focus:border-blue-500/50" placeholder="45 mins" />
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Video File / URL</label>
                          <div className="flex gap-2 items-center">
                            <input type="text" required value={mod.url} onChange={e => handleModuleChange(idx, 'url', e.target.value)} className="flex-1 bg-black/20 border border-white/10 rounded-lg text-xs py-2.5 px-3 text-white focus:outline-none focus:border-blue-500/50" placeholder="https://youtube.com/... or raw video file URL" />
                            <label className="bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-4 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-all shrink-0">
                              <Upload className="w-3.5 h-3.5" /> Upload Video
                              <input
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const formData = new FormData();
                                  formData.append("file", file);
                                  formData.append("bucket", "course-videos");
                                  try {
                                    const res = await fetch("/api/media/upload", {
                                      method: "POST",
                                      body: formData,
                                    });
                                    if (res.ok) {
                                      const data = await res.json();
                                      handleModuleChange(idx, 'url', data.url);
                                      alert(`Video file ${file.name} uploaded successfully!`);
                                    } else {
                                      alert("Video upload failed.");
                                    }
                                  } catch (err) {
                                    console.error(err);
                                    alert("Error uploading video file.");
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      {modules.length > 1 && (
                        <button type="button" onClick={() => handleRemoveModule(idx)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="p-8 space-y-8 bg-black/20">
            <div>
              <h3 className="text-sm font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2 mb-6">
                <Tag className="w-4 h-4" /> Pricing Control
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={isFree} onChange={e => setIsFree(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                  <span className="text-sm font-bold text-slate-300">Make this course free</span>
                </div>

                {!isFree && (
                  <div className="pt-4 animate-fadeIn">
                    <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Price (INR)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input 
                        type="number" required={!isFree} value={price} onChange={e => setPrice(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl text-sm py-3 pl-8 pr-4 focus:ring-2 focus:ring-emerald-500/50 outline-none text-white transition-all font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <h3 className="text-sm font-black text-pink-400 uppercase tracking-wider flex items-center gap-2 mb-6">
                <LayoutTemplate className="w-4 h-4" /> Course Template
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <label className={`border rounded-xl p-3 cursor-pointer transition-all ${template === 'default' ? 'border-pink-500 bg-pink-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                  <input type="radio" name="template" value="default" checked={template === 'default'} onChange={() => setTemplate("default")} className="hidden" />
                  <div className="w-full h-16 bg-slate-800 rounded mb-2"></div>
                  <p className="text-[10px] font-bold text-center text-slate-300">Standard</p>
                </label>
                <label className={`border rounded-xl p-3 cursor-pointer transition-all ${template === 'hero' ? 'border-pink-500 bg-pink-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                  <input type="radio" name="template" value="hero" checked={template === 'hero'} onChange={() => setTemplate("hero")} className="hidden" />
                  <div className="w-full h-16 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded mb-2"></div>
                  <p className="text-[10px] font-bold text-center text-slate-300">Hero Focus</p>
                </label>
              </div>
            </div>

            <div className="pt-10">
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-[#5436f9] hover:bg-[#4325e8] text-white font-black text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(84,54,249,0.3)] transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Deploying..." : "Deploy Course"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
