import React, { useState, useEffect } from "react";
import { Search, Loader2, BookOpen, User, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ courses: any[], users: any[], resources: any[] }>({ courses: [], users: [], resources: [] });
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length >= 2) {
        fetchResults();
      } else {
        setResults({ courses: [], users: [], resources: [] });
        setIsOpen(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const fetchResults = async () => {
    setLoading(true);
    setIsOpen(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const hasResults = results.courses.length > 0 || results.users.length > 0 || results.resources.length > 0;

  return (
    <div className="relative z-50 w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl leading-5 bg-[#0b0a1d]/80 text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all"
          placeholder="Search courses, instructors (@username), or resources..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.length >= 2) setIsOpen(true); }}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Loader2 className="h-4 w-4 text-purple-400 animate-spin" />
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute mt-2 w-full rounded-xl bg-[#0b0a1d]/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden max-h-96 overflow-y-auto animate-fadeIn">
          {!loading && !hasResults && query.length >= 2 && (
            <div className="p-4 text-sm text-slate-400 text-center">No results found for "{query}"</div>
          )}

          {results.users.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-1 text-xs font-bold text-purple-400 uppercase tracking-wider bg-white/5">People / Profiles</div>
              {results.users.map((user) => (
                <Link key={user.id} href={user.role === "STUDENT" ? `/students/${user.id}` : `/instructors/${user.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold overflow-hidden text-xs">
                    {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : (user.role === "STUDENT" ? "S" : "I")}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.role} • {user.learnupId}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Link>
              ))}
            </div>
          )}

          {results.courses.length > 0 && (
            <div className="py-2 border-t border-white/10">
              <div className="px-4 py-1 text-xs font-bold text-blue-400 uppercase tracking-wider bg-white/5">Courses</div>
              {results.courses.map((course) => (
                <Link key={course.id} href={`/courses/${course.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 overflow-hidden flex shrink-0 items-center justify-center">
                    {course.image ? <img src={course.image} className="w-full h-full object-cover" /> : <BookOpen className="w-5 h-5 text-blue-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white line-clamp-1">{course.title}</p>
                    <p className="text-xs text-slate-400">By {course.instructor?.name || 'Instructor'}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Link>
              ))}
            </div>
          )}

          {results.resources.length > 0 && (
            <div className="py-2 border-t border-white/10">
              <div className="px-4 py-1 text-xs font-bold text-emerald-400 uppercase tracking-wider bg-white/5">Resources & Quizzes</div>
              {results.resources.map((res) => (
                <Link key={res.id} href={res.url || `/courses/${res.courseId}`} target={res.url ? "_blank" : undefined} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex shrink-0 items-center justify-center">
                    <FileText className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white line-clamp-1">{res.title}</p>
                    <p className="text-xs text-slate-400 capitalize">{res.type}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
