import React, { useEffect } from "react";
import { Project } from "../types";
import { X, User, MessageSquare, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import { toYouTubeEmbedUrl, resolveProjectCover } from "../lib/youtube";

const EASE = [0.16, 1, 0.3, 1] as const;

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onStartTalk: () => void;
}

export default function ProjectModal({ project, onClose, onStartTalk }: ProjectModalProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Prevent background scroll when modal is active
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  // Close on Escape while the modal is open
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 select-none" id="case-study-overlay" role="dialog" aria-modal="true" aria-label={`Case study: ${project.title}`}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.95 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          onClick={onClose}
          aria-hidden="true"
          className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Sheet container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 16 }}
          transition={{ duration: 0.45, ease: EASE }}
          className={`relative w-full max-w-5xl border h-[90vh] md:h-[85vh] flex flex-col overflow-hidden transition-colors duration-300 ${
            isLight ? "bg-white border-black/10 text-black" : "bg-[#131313] border-white/10 text-white"
          }`}
        >
          {/* Header Action bar */}
          <div className={`flex justify-between items-center px-6 py-4 border-b backdrop-blur sticky top-0 z-10 transition-colors duration-300 ${
            isLight ? "border-b-black/10 bg-zinc-100/80 text-black" : "border-b-white/10 bg-[#0e0e0e]/80 text-white"
          }`}>
            <span className={`font-mono text-xs uppercase tracking-widest font-bold ${
              isLight ? "text-gray-700" : "text-gray-400"
            }`}>
              Case Study Analysis
            </span>
            <button 
              onClick={onClose}
              className={`w-10 h-10 border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                isLight 
                  ? "border-black/10 text-black hover:bg-black hover:text-white hover:border-black" 
                  : "border-white/10 text-white hover:bg-white hover:text-black hover:border-white"
              }`}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal scroll area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12 scrollbar-none select-text">
            {/* Project Hero Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className={`lg:col-span-7 aspect-[16/10] overflow-hidden border transition-colors duration-300 ${
                isLight ? "bg-zinc-200 border-black/5" : "bg-[#262626] border-white/5"
              }`}>
                <img
                  alt={project.title}
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                  src={resolveProjectCover(project) ?? ""}
                />
              </div>

              {/* Core Meta Details */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div>
                  <h2 className={`text-4xl md:text-5xl font-extrabold tracking-display uppercase select-none ${
                    isLight ? "text-black" : "text-white"
                  }`}>
                    {project.title}
                  </h2>
                  <p className={`font-sans text-sm mt-4 leading-relaxed ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}>
                    {project.description}
                  </p>
                </div>

                {/* Client */}
                {project.client && (
                  <div className={`flex items-center space-x-3 border-t pt-6 transition-colors duration-300 ${
                    isLight ? "border-black/10" : "border-white/10"
                  }`}>
                    <User className={`w-4 h-4 ${isLight ? "text-gray-600" : "text-gray-500"}`} />
                    <div>
                      <p className={`text-[9px] font-mono tracking-widest uppercase ${isLight ? "text-gray-600" : "text-gray-500"}`}>Client</p>
                      <p className={`text-sm font-sans font-bold ${isLight ? "text-black" : "text-white"}`}>{project.client}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* YouTube video embed — Requirements 7.1–7.5 */}
            {project.video_url && toYouTubeEmbedUrl(project.video_url) && (
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={toYouTubeEmbedUrl(project.video_url)!}
                  title={`${project.title} video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Client Testimonial Monochromatic block */}
            {project.testimonial_quote && (
              <div className={`border p-8 md:p-12 relative flex flex-col md:flex-row items-start md:space-x-8 transition-colors duration-300 ${
                isLight ? "bg-zinc-50 border-black/5" : "bg-[#0e0e0e] border-white/5"
              }`}>
                <MessageSquare className={`w-12 h-12 shrink-0 mb-4 md:mb-0 ${isLight ? "text-gray-600" : "text-gray-400"}`} strokeWidth={1} />
                <div className="space-y-4">
                  <p className={`text-sm md:text-base italic font-sans leading-relaxed ${
                    isLight ? "text-gray-700" : "text-gray-300"
                  }`}>
                    "{project.testimonial_quote}"
                  </p>
                  <div>
                    <p className={`text-xs font-mono tracking-widest uppercase font-bold ${
                      isLight ? "text-black font-semibold" : "text-white"
                    }`}>
                      — {project.testimonial_author}
                    </p>
                    <p className={`text-[10px] font-mono tracking-widest uppercase mt-1 ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>
                      {project.testimonial_role}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick action footer inside modal */}
            <div className={`pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-colors duration-300 ${
              isLight ? "border-black/10" : "border-white/10"
            }`}>
              <div>
                <p className={`text-lg font-extrabold uppercase tracking-tight ${
                  isLight ? "text-black" : "text-white"
                }`}>
                  INSPIRED BY THIS WORK?
                </p>
                <p className={`text-xs font-sans mt-1 ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}>
                  Let's discuss how we can adapt similar strategic geometry to your brand.
                </p>
              </div>
              <button 
                onClick={onStartTalk}
                className={`inline-flex items-center gap-3 px-8 py-4 text-xs font-mono font-bold uppercase tracking-widest transition-all cursor-pointer active:scale-95 ${
                  isLight 
                    ? "bg-black text-white hover:bg-gray-800" 
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                Let's Talk About Your Project
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
