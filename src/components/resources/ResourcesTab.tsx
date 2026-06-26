"use client";

import React from "react";

export default function ResourcesTab() {
  const folders = [
    {
      title: "Course Materials",
      count: "124 items",
      lastAdded: "Last added 2 days ago",
      colorClass: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white",
      icon: "folder",
      extra: (
        <div className="flex -space-x-2 mt-2">
          <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-high"></div>
          <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-high"></div>
          <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-high text-[10px] flex items-center justify-center font-bold text-primary">
            +12
          </div>
        </div>
      ),
    },
    {
      title: "E-books",
      count: "45 items",
      lastAdded: "Last added 1 week ago",
      colorClass: "bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white",
      icon: "auto_stories",
      extra: (
        <div className="h-8 mt-2 flex items-center gap-1">
          <span className="px-2 py-1 bg-surface-container text-on-surface-variant rounded text-[10px] font-bold">
            PDF
          </span>
          <span className="px-2 py-1 bg-surface-container text-on-surface-variant rounded text-[10px] font-bold">
            EPUB
          </span>
        </div>
      ),
    },
    {
      title: "Templates",
      count: "18 items",
      lastAdded: "Last added 4 hours ago",
      colorClass:
        "bg-tertiary-container/10 text-tertiary-container group-hover:bg-tertiary-container group-hover:text-white",
      icon: "description",
      extra: (
        <div className="flex items-center gap-2 mt-2">
          <span className="material-symbols-outlined text-on-surface-variant text-sm">
            schedule
          </span>
          <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
            New Content Available
          </span>
        </div>
      ),
    },
  ];

  const recentFiles = [
    {
      name: "UX Principles Guide v2.pdf",
      type: "PDF Document",
      size: "4.2 MB",
      icon: "picture_as_pdf",
      iconColor: "text-red-500",
    },
    {
      name: "Weekly Assignment Brief.docx",
      type: "Word File",
      size: "1.1 MB",
      icon: "description",
      iconColor: "text-blue-500",
    },
    {
      name: "Project Budget Template.xlsx",
      type: "Excel Spreadsheet",
      size: "890 KB",
      icon: "table_view",
      iconColor: "text-green-600",
    },
    {
      name: "Final Presentation Deck.pptx",
      type: "PowerPoint",
      size: "15.4 MB",
      icon: "slideshow",
      iconColor: "text-orange-500",
    },
  ];

  const tutorials = [
    {
      title: "Advanced UI Layouts with Flexbox",
      chapter: "Chapter 4 • Design Systems",
      duration: "12:40",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC1yO_H3iM2GmKdq4Xpy2nv5MtRsrzknTfEycEFbDXIoV4rV7aRmSE31-Z8qTU6XwlhV4-sSsh4Zjs1MUEE4XUtdsMY9O-3slbhJZQGQotKHNR8HSrLvDyb0Hr_JXl6AGqBThW5I2zDT5J8VO581Zfg8LXw5PCK4ecmB_wswH1e7fsf0fKxlXGFaYdO9ewRYBcgTR4B8XoiUuVnoGYgYFA0HnX_Wqjm-2qIFK2f0GbQ76OunU2xyXvpO5tgRtSWEUHk2eyvVe2Tug8",
      dataAlt:
        "A cinematic, shallow depth-of-field shot of a person's hands coding on a high-end backlit mechanical keyboard. The scene is illuminated by the soft glow of multiple computer monitors showing lines of elegant code in a dark mode editor. The overall mood is focused and professional, with a color palette dominated by deep purples and indigos with pops of cyan light.",
    },
    {
      title: "Prototyping Motion and Transitions",
      chapter: "Chapter 5 • Interaction Design",
      duration: "08:15",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBFwZRa1DxS5qmqHUiDyOfsBqpwhKmuLWtrmCHKLqmBzKi5whS6OQt3kxcJya2EULtfc7fS90i76diP_Mry-sdMbZ1eNjMFrK6lMJy0HRUGE2q7Kf8OfG_7gwKYkbL_s5cF5X3PjvlEmGL_s31k7qPRj9x5kp3OGNF4iq-d2Yx6nMn7mQM3CY2Wy25wZ3Mu_DrhKdPpqyFKziLaAb_kUZlH1-40kAhwBIKH8PHEvNfeFYaGUhCkikzu9FMtvTclLpWj_qYd9mhbUJs",
      dataAlt:
        "A clean and artistic flat-lay of designer tools: a stylus, a sleek tablet, a minimal notebook, and a cup of coffee on a pristine white desk. The lighting is bright and natural, coming from a side window, creating soft shadows. The style is minimal and professional, perfectly fitting a light-mode LMS aesthetic with white and pale blue tones.",
    },
  ];

  return (
    <div className="space-y-10 animate-fadeIn relative pb-20">
      <style dangerouslySetInnerHTML={{
        __html: `
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.05);
        }
      `}} />

      {/* Welcome/Header Section */}
      <section>
        <h1 className="text-3xl font-bold text-on-surface">Resource Center</h1>
        <p className="text-base text-on-surface-variant mt-2">
          Your centralized library for learning assets and documentation.
        </p>
      </section>

      {/* Library Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {folders.map((folder, index) => (
          <div
            key={index}
            className="glass-card rounded-xl p-6 flex flex-col gap-4 hover-lift cursor-pointer group"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${folder.colorClass}`}>
              <span className="material-symbols-outlined text-3xl">
                {folder.icon}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-on-surface">
                {folder.title}
              </h3>
              <p className="text-on-surface-variant text-sm font-medium mt-1">
                {folder.count} • {folder.lastAdded}
              </p>
            </div>
            {folder.extra}
          </div>
        ))}
      </section>

      {/* Content Row: Files & Tutorials */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* File Library List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-2xl font-bold text-on-surface">Recent Files</h2>
            <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline cursor-pointer">
              View All <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
          <div className="bg-white rounded-xl overflow-hidden border border-outline-variant/30 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant text-sm">
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Type</th>
                    <th className="p-4 font-semibold">Size</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {recentFiles.map((file, index) => (
                    <tr
                      key={index}
                      className="hover:bg-surface-container-low transition-colors group"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className={`material-symbols-outlined ${file.iconColor}`}>
                            {file.icon}
                          </span>
                          <span className="text-sm font-semibold text-on-surface">
                            {file.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-on-surface-variant text-sm">
                        {file.type}
                      </td>
                      <td className="p-4 text-on-surface-variant text-sm">
                        {file.size}
                      </td>
                      <td className="p-4 text-right">
                        <button className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-all cursor-pointer">
                          <span className="material-symbols-outlined">
                            download
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Video Tutorials / Sidebar section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-on-surface">Video Tutorials</h2>
          <div className="flex flex-col gap-4">
            {tutorials.map((video, index) => (
              <div
                key={index}
                className="glass-card rounded-xl overflow-hidden hover-lift cursor-pointer group"
              >
                <div className="relative h-32 w-full bg-surface-container-high">
                  <img
                    className="w-full h-full object-cover"
                    src={video.image}
                    alt={video.title}
                    data-alt={video.dataAlt}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <span
                        className="material-symbols-outlined text-primary"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        play_arrow
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1 py-0.5 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    {video.chapter}
                  </p>
                </div>
              </div>
            ))}
            <button className="w-full py-2.5 text-primary font-bold text-sm border-2 border-primary/10 rounded-xl hover:bg-primary hover:text-white transition-all cursor-pointer">
              Browse All Videos
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Section: Recent Activity / Usage */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined">cloud_done</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-on-surface">
                Storage Sync Active
              </h4>
              <p className="text-xs text-on-surface-variant mt-0.5">
                All resources are up to date.
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-on-surface">1.2 GB / 10 GB</p>
            <div className="w-32 h-1.5 bg-surface-container-high rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-primary w-[12%]"></div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl flex items-center justify-between bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-2xl">
              auto_awesome
            </span>
            <div>
              <h4 className="font-bold text-sm text-on-surface font-sans">
                Smart Search
              </h4>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Try searching for concepts, not just file names.
              </p>
            </div>
          </div>
          <button className="bg-primary-container text-on-primary-container hover:bg-opacity-95 px-4 py-2 rounded-lg font-bold text-xs cursor-pointer">
            Learn More
          </button>
        </div>
      </section>

      {/* Floating Action Button (FAB) */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 cursor-pointer">
        <span className="material-symbols-outlined text-3xl">upload_file</span>
      </button>
    </div>
  );
}
