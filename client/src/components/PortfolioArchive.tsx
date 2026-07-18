import React, { useState, useMemo } from "react";
import { Project } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import { useData } from "../context/DataContext";

interface PortfolioArchiveProps {
  onSelectProject: (project: Project) => void;
}

export default function PortfolioArchive({ onSelectProject }: PortfolioArchiveProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { projects, categories } = useData();
  // Holds the selected category id, or "ALL" for no filter
  const [selectedFilter, setSelectedFilter] = useState("ALL");

  // Filter tabs: "All Works" + one tab per category (label shown, id used for matching)
  const filters = useMemo(() => {
    const list = [{ id: "ALL", label: "ALL WORKS" }];
    (categories || []).forEach(cat => {
      if (cat.name) {
        list.push({ id: cat.id, label: cat.name.toUpperCase() });
      }
    });
    return list;
  }, [categories]);

  // Match projects by category_id (a UUID) against the selected category's id
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (selectedFilter === "ALL") return projects;
    return projects.filter((project) => project.category_id === selectedFilter);
  }, [selectedFilter, projects]);

  return (
    <>
      <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
        {/* Portfolio Title Section */}
        <header className={`flex flex-col items-center justify-center text-center py-20 border mb-16 relative transition-colors duration-300 ${
          isLight ? "bg-zinc-200 border-black/5" : "bg-[#262626] border-white/5"
        }`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          <div className="max-w-2xl px-6 relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`text-5xl md:text-8xl font-extrabold mb-6 leading-tight tracking-tighter select-none ${
                isLight ? "text-black" : "text-white"
              }`}
            >
              PORTFOLIO <br /> ARCHIVE
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-base md:text-lg max-w-lg mx-auto leading-relaxed font-sans ${
                isLight ? "text-gray-600" : "text-gray-400"
              }`}
            >
              A curated, high-contrast selection of digital products, branding architectures, and cinematic visual systems built to push strategic boundaries.
            </motion.p>
          </div>
        </header>

        {/* Toolbar: Category Filters */}
        <div className={`mb-12 flex flex-col md:flex-row justify-center items-center gap-6 border-b pb-4 transition-colors duration-300 ${
          isLight ? "border-black/10" : "border-white/10"
        }`}>
          {/* Horizontal filters */}
          <div className="overflow-x-auto w-full md:w-auto flex gap-6 scrollbar-none py-2 justify-center">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 py-2 border-b-2 cursor-pointer whitespace-nowrap ${
                  selectedFilter === filter.id
                    ? (isLight ? "border-black text-black" : "border-white text-white")
                    : (isLight ? "border-transparent text-gray-500 hover:text-black" : "border-transparent text-gray-400 hover:text-white")
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => {
                const projectImg = project.cover_image_url;
                const projectYear = project.project_date;
                const tagsList = project.technologies || [];
                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    onClick={() => onSelectProject(project)}
                    className="group cursor-pointer flex flex-col"
                  >
                    {/* Image Wrap */}
                    <div className={`relative overflow-hidden aspect-[16/10] border mb-6 transition-colors duration-300 ${
                      isLight ? "bg-zinc-50 border-black/5" : "bg-[#1f1f1f] border-white/5"
                    }`}>
                      <img
                        alt={project.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                        referrerPolicy="no-referrer"
                        src={projectImg}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-xs font-mono font-bold tracking-widest border border-white px-6 py-2.5 bg-black/80 text-white">
                          VIEW CASE STUDY
                        </span>
                      </div>
                    </div>

                    {/* Info block */}
                    <div className="flex justify-between items-start flex-col items-center text-center">
                      <h3 className={`font-extrabold text-2xl tracking-tight mb-1 transition-colors uppercase ${
                        isLight ? "text-black group-hover:text-gray-600" : "text-white group-hover:text-gray-300"
                      }`}>
                        {project.title}
                      </h3>
                      <p className={`text-xs font-mono tracking-[0.2em] uppercase mt-1 ${
                        isLight ? "text-gray-500" : "text-gray-400"
                      }`}>
                        {project.client} — {projectYear}
                      </p>
                    </div>

                    {/* Subtag pills */}
                    <div className="mt-4 flex gap-2 justify-center flex-wrap">
                      {tagsList.map((tag) => (
                        <span
                          key={tag}
                          className={`px-3 py-1 border rounded-full text-xs font-mono tracking-widest transition-colors duration-300 ${
                            isLight ? "border-black/10 text-gray-600" : "border-white/10 text-gray-400"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className={`col-span-full py-20 text-center border transition-colors duration-300 ${
                isLight ? "bg-zinc-200 border-black/5" : "bg-[#262626] border-white/5"
              }`}>
                <p className={`font-sans mb-4 ${isLight ? "text-gray-600" : "text-gray-400"}`}>No projects match your current filters.</p>
                <button 
                  onClick={() => { setSelectedFilter("ALL"); }}
                  className={`border px-6 py-2.5 text-[10px] font-mono uppercase tracking-widest transition-all ${
                    isLight 
                      ? "border-black/20 hover:border-black text-black" 
                      : "border-white/20 hover:border-white text-white"
                  }`}
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Portfolio CTA Block */}
      <section className={`py-24 border-t text-center transition-colors duration-300 ${
        isLight ? "bg-zinc-200 border-black/10" : "bg-[#0e0e0e] border-white/10"
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className={`text-4xl md:text-7xl font-extrabold tracking-tighter mb-8 select-none ${
            isLight ? "text-black" : "text-white"
          }`}>
            LET'S START SOMETHING.
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            {projects && projects.length > 0 && (
              <button 
                onClick={() => onSelectProject(projects[0])}
                className={`px-12 py-5 font-bold text-xs uppercase tracking-widest transition-all cursor-pointer active:scale-95 ${
                  isLight 
                    ? "bg-black text-white hover:bg-gray-800" 
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                START A PROJECT
              </button>
            )}
            <a 
              href="mailto:milkosamuel470@gmail.com"
              className={`px-12 py-5 border font-bold text-xs uppercase tracking-widest transition-all text-center cursor-pointer active:scale-95 ${
                isLight 
                  ? "border-black text-black hover:bg-black hover:text-white" 
                  : "border-white text-white hover:bg-white hover:text-black"
              }`}
            >
              EMAIL ME DIRECTLY
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
