import React from "react";
import { Project } from "../types";
import { motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import { useData } from "../context/DataContext";

interface FeaturedWorkProps {
  onSelectProject: (project: Project) => void;
  onViewAll: () => void;
}

export default function FeaturedWork({ onSelectProject, onViewAll }: FeaturedWorkProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { projects } = useData();
  
  // Sort and select featured projects
  const featured = React.useMemo(() => {
    if (!projects || projects.length === 0) return [];
    
    // Filter to those explicitly flagged as featured, otherwise take any
    const featuredOnly = projects.filter(p => !!p.isFeatured);
    const sourceList = featuredOnly.length > 0 ? featuredOnly : projects;
    
    return [...sourceList]
      .sort((a, b) => (a.featuredOrder || 999) - (b.featuredOrder || 999))
      .slice(0, 4);
  }, [projects]);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className={`py-24 border-t transition-colors duration-300 ${
      isLight ? "bg-zinc-200 border-black/10" : "bg-[#262626] border-white/10"
    }`} id="work-featured">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className={`text-xs font-bold uppercase tracking-[0.3em] mb-3 font-mono ${
              isLight ? "text-gray-500" : "text-gray-400"
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

        {/* Grid of Projects */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((project, idx) => {
            const projectImg = project.image || project.coverImage;
            const projectYear = project.year || project.projectDate;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                onClick={() => onSelectProject(project)}
                className="group cursor-pointer"
              >
                {/* Image Container */}
                <div className={`aspect-[3/4] mb-6 overflow-hidden relative border transition-colors duration-300 ${
                  isLight ? "bg-white border-black/10" : "bg-[#131313] border-white/10"
                }`}>
                  <img 
                    alt={project.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out" 
                    referrerPolicy="no-referrer"
                    src={projectImg}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className={`text-xs font-bold tracking-widest uppercase border px-4 py-2 bg-black/80 ${
                      isLight ? "border-white text-white" : "border-white text-white"
                    }`}>
                      View Case Study
                    </span>
                  </div>
                </div>

                {/* Text Meta */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-bold text-lg uppercase tracking-tight transition-colors ${
                      isLight ? "text-black group-hover:text-gray-600" : "text-white group-hover:text-gray-300"
                    }`}>
                      {project.title}
                    </h3>
                    <p className={`text-xs uppercase tracking-widest font-mono mt-1 ${
                      isLight ? "text-gray-500" : "text-gray-400"
                    }`}>
                      {project.client}
                    </p>
                  </div>
                  <span className={`text-xs font-bold font-mono px-2 py-1 transition-colors duration-300 ${
                    isLight ? "bg-black/5 text-gray-700" : "bg-white/5 text-gray-400"
                  }`}>
                    {projectYear}
                  </span>
                </div>

                {/* View Link */}
                <button className={`mt-4 block text-xs font-bold uppercase tracking-widest transition-all ${
                  isLight 
                    ? "text-gray-600 group-hover:text-black group-hover:underline underline-offset-4" 
                    : "text-gray-400 group-hover:text-white group-hover:underline underline-offset-4"
                }`}>
                  View Project 
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
