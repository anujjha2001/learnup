"use client";

import React, { useState, useEffect } from "react";

interface CourseItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  price: number;
  instructorId: string;
  createdAt: string;
}

export default function CoursesView() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Drawer / Form state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    price: "",
  });

  // Fetch courses on mount
  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch("/api/courses");
        if (!res.ok) throw new Error("Failed to load courses");
        const data = await res.json();
        setCourses(data);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic Validation
    if (!formData.title.trim()) {
      setFormError("Course title is required.");
      return;
    }
    if (!formData.description.trim()) {
      setFormError("Course description is required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create course");
      }

      const newCourse = await res.json();
      setCourses((prev) => [newCourse, ...prev]);
      
      // Reset form & drawer
      setFormData({ title: "", description: "", image: "", price: "" });
      setIsDrawerOpen(false);
    } catch (err: any) {
      setFormError(err.message || "Failed to create course. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0b1c30] tracking-tight">Your Syllabus Assets</h1>
          <p className="text-sm text-[#464555] mt-1">Manage, update, and build academic curricula models.</p>
        </div>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="bg-[#3525cd] text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md shadow-[#3525cd]/15 hover:brightness-110 transition cursor-pointer flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg select-none">add</span>
          Create New Course
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3525cd] border-t-transparent" />
          <p className="text-sm font-medium text-slate-400">Loading catalog modules...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium">
          {error}
        </div>
      ) : courses.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center flex flex-col items-center justify-center gap-4">
          <span className="material-symbols-outlined text-4xl text-slate-300 select-none">import_contacts</span>
          <div>
            <h3 className="font-bold text-[#0b1c30]">No courses found</h3>
            <p className="text-xs text-[#464555] mt-1">Get started by building your first curriculum track.</p>
          </div>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="mt-2 bg-[#f0f2fe] text-[#3525cd] hover:bg-[#3525cd] hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Create Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="glass-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <img
                  src={course.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80"}
                  alt={course.title}
                  className="h-40 w-full object-cover border-b border-[#c7c4d8]/10"
                />
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold font-mono text-slate-400">ID: {course.id.slice(0, 8)}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#f0f2fe] text-[#3525cd]">
                      {course.price > 0 ? `${course.price} INR` : "Free"}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#0b1c30] text-sm leading-snug">{course.title}</h3>
                  <p className="text-xs text-[#464555] line-clamp-3">{course.description}</p>
                </div>
              </div>
              <div className="p-5 pt-0">
                <div className="h-px bg-slate-100 mb-4" />
                <div className="flex items-center justify-between text-xs font-semibold text-[#464555]">
                  <span>Active Curriculum</span>
                  <button className="text-[#3525cd] hover:underline flex items-center gap-1 cursor-pointer">
                    Configure <span className="material-symbols-outlined text-sm select-none">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-out Form Drawer (Modal Overlay) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md bg-white h-full p-6 shadow-2xl flex flex-col justify-between z-50 animate-slideLeft overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-[#0b1c30]">Add New Syllabus</h2>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                >
                  <span className="material-symbols-outlined select-none">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateCourse} className="space-y-5 pt-6">
                {formError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold">
                    {formError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0b1c30] uppercase tracking-wider">Course Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Docker Container Deployment Hub"
                    className="w-full px-4 py-3 rounded-xl border border-[#c7c4d8]/30 focus:outline-none focus:border-[#3525cd] text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0b1c30] uppercase tracking-wider">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Enter the detailed curriculum outline..."
                    className="w-full px-4 py-3 rounded-xl border border-[#c7c4d8]/30 focus:outline-none focus:border-[#3525cd] text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0b1c30] uppercase tracking-wider">Cover Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-3 rounded-xl border border-[#c7c4d8]/30 focus:outline-none focus:border-[#3525cd] text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0b1c30] uppercase tracking-wider">Syllabus Price (INR)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g. 499"
                    className="w-full px-4 py-3 rounded-xl border border-[#c7c4d8]/30 focus:outline-none focus:border-[#3525cd] text-sm"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex-1 px-4 py-3 border border-[#c7c4d8]/30 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-[#3525cd] text-white px-4 py-3 rounded-xl text-sm font-bold hover:brightness-110 disabled:opacity-50 transition cursor-pointer flex items-center justify-center"
                  >
                    {submitting ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      "Publish Course"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
