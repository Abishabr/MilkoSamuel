import React from "react";
import { Project } from "../types";
import { motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import { useData } from "../context/DataContext";
import ProjectCardMedia from "./ProjectCardMedia";

const EASE = [0.16, 1, 0.3, 1] as const;

interface FeaturedWorkProps {
  onSelectProject: (project: Project) => void;
  onViewAll: () => void;
}

export default function FeaturedWork({ onSelectProject, onViewAll }: FeaturedWorkProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { projects, categories } = useData();

  // Sort and select featured projects
  const featured = React.useMemo(() => {
    if (!projects || projects.length === 0) return [];

    // Public site shows published work only
    const live = projects.filter(p => p.published !== false);
    // Filter to those explicitly flagged as featured, otherwise take any
    const featuredOnly = live.filter(p => !!p.is_featured);
    const sourceList = featuredOnly.length > 0 ? featuredOnly : live;

    return [...sourceList]
      .sort((a, b) => (a.featured_order || 999) - (b.featured_order || 999))
      .slice(0, 4);
  }, [projects]);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className={`py-24 md:py-40 border-t transition-colors duration-300 ${
      isLight ? "bg-zinc-200 border-black/10" : "bg-[#262626] border-white/10"
    }`} id="work-featured">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className={`text-xs font-bold uppercase tracking-[0.3em] mb-3 font-mono ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}>
              Featured Work
            </h2>
            <div className={`h-[2px] w-12 ${isLight ? "bg-black" : "bg-white"}`} />
          </div>
          <button 
            onClick={onViewAll}
            className={`text-xs font-bold uppercase tracking-widest flex items-center transition-colors cursor-pointer group ${
              isLight ? "text-black hover:text-gray-600" : "text-white hover:text-gray-400"
            }`}
          >
            View All Projects 
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Grid of Projects — cards adapt to each video's native aspect ratio */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {featured.map((project, idx) => {
            const categoryName = categories.find((c) => c.id === project.category_id)?.name;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: EASE }}
                onClick={() => onSelectProject(project)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectProject(project);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`View project: ${project.title}`}
                className="group cursor-pointer"
              >
                <ProjectCardMedia project={project} isLight={isLight} />

                {/* Text Meta */}
                <div className="mt-5">
                  <h3 className={`font-bold text-lg uppercase tracking-tight transition-colors ${
                    isLight ? "text-black group-hover:text-gray-600" : "text-white group-hover:text-gray-300"
                  }`}>
                    {project.title}
                  </h3>
                  <p className={`text-xs uppercase tracking-widest font-mono mt-1 ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}>
                    {categoryName}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
