import React, { useEffect, useMemo } from "react";
import { Project } from "../types";
import { ArrowLeft, ArrowRight, Calendar, Folder } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import { useData } from "../context/DataContext";
import { resolveProjectCover } from "../lib/youtube";
import { projectOrientation, aspectRatioClass, isPlayableVideoFile } from "../lib/videoOrientation";
import ProjectVideoPlayer from "./ProjectVideoPlayer";

const EASE = [0.16, 1, 0.3, 1] as const;

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onStartTalk: () => void;
  onSelectProject: (project: Project) => void;
}

function formatPublishedDate(project: Project): string {
  const raw = project.created_at || (project.project_date ?? "");
  if (!raw) return "";
  const parsed = new Date(raw);
  if (!isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  }
  // Legacy rows may store just a year string.
  return String(raw);
}

export default function ProjectModal({ project, onClose, onStartTalk, onSelectProject }: ProjectModalProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { projects, categories } = useData();

  // Prevent background scroll when modal is active
  useEffect(() => {
    document.body.style.overflow = project ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
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

  const categoryName = useMemo(() => {
    if (!project) return "";
    return categories.find((c) => c.id === project.category_id)?.name || "Uncategorized";
  }, [project, categories]);

  // 3–6 related projects from the same category (published only).
  const related = useMemo(() => {
    if (!project) return [];
    return projects
      .filter((p) => p.id !== project.id && p.published !== false && p.category_id === project.category_id)
      .slice(0, 6);
  }, [project, projects]);

  if (!project) return null;

  const orientation = projectOrientation(project);
  const publishedDate = formatPublishedDate(project);

  const surface = isLight ? "bg-white text-black" : "bg-[#0b0b0b] text-white";
  const subtle = isLight ? "text-gray-600" : "text-gray-400";
  const hairline = isLight ? "border-black/10" : "border-white/10";

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-stretch justify-center select-none"
        id="case-study-overlay"
        role="dialog"
        aria-modal="true"
        aria-label={`Project: ${project.title}`}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          onClick={onClose}
          aria-hidden="true"
          className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
        />

        {/* Full-height cinematic sheet */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: EASE }}
          className={`relative w-full h-full overflow-y-auto scrollbar-none ${surface} transition-colors duration-300`}
        >
          {/* Sticky top bar with Back button */}
          <div className={`sticky top-0 z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b backdrop-blur ${hairline} ${
            isLight ? "bg-white/80" : "bg-[#0b0b0b]/80"
          }`}>
            <button
              onClick={onClose}
              className={`group inline-flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-widest transition-colors cursor-pointer ${subtle} hover:${isLight ? "text-black" : "text-white"}`}
              aria-label="Back to portfolio"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
            <span className={`font-mono text-[10px] uppercase tracking-[0.25em] ${subtle}`}>{categoryName}</span>
          </div>

          <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-16 space-y-14">
            {/* Title + category */}
            <div className="text-center space-y-4">
              <p className={`font-mono text-[11px] uppercase tracking-[0.3em] ${subtle}`}>{categoryName}</p>
              <h1 className="text-4xl md:text-7xl font-extrabold tracking-display uppercase leading-[0.95]">
                {project.title}
              </h1>
            </div>

            {/* Adaptive video player — native aspect ratio */}
            {project.video_url && (
              <ProjectVideoPlayer
                videoUrl={project.video_url}
                orientation={orientation}
                title={project.title}
                poster={project.cover_image_url}
              />
            )}

            {/* Fallback cover if there is no video */}
            {!project.video_url && resolveProjectCover(project) && (
              <div className="flex justify-center">
                <div className={`relative overflow-hidden rounded-2xl ${aspectRatioClass(orientation)} ${
                  orientation === "portrait" ? "h-[70vh]" : "w-full max-w-4xl"
                } ${isLight ? "bg-zinc-100" : "bg-[#161616]"}`}>
                  <img
                    src={resolveProjectCover(project) ?? ""}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            )}

            {/* Meta + description */}
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className={`border-t pt-4 ${hairline}`}>
                  <div className={`flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest ${subtle}`}>
                    <Folder className="w-3.5 h-3.5" /> Category
                  </div>
                  <p className="mt-1.5 text-sm font-bold">{categoryName}</p>
                </div>
                {publishedDate && (
                  <div className={`border-t pt-4 ${hairline}`}>
                    <div className={`flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest ${subtle}`}>
                      <Calendar className="w-3.5 h-3.5" /> Published
                    </div>
                    <p className="mt-1.5 text-sm font-bold">{publishedDate}</p>
                  </div>
                )}
              </div>

              {project.description && (
                <div className={`border-t pt-8 ${hairline}`}>
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase mb-4">{project.title}</h2>
                  <p className={`text-base md:text-lg leading-relaxed font-sans ${subtle}`}>
                    {project.description}
                  </p>
                </div>
              )}
            </div>

            {/* Related Projects */}
            {related.length > 0 && (
              <div className={`border-t pt-12 ${hairline}`}>
                <h2 className="text-xs font-bold uppercase tracking-[0.3em] mb-8 font-mono text-center">
                  Related Projects
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {related.map((rel) => {
                    const relCover = resolveProjectCover(rel);
                    const relOrientation = projectOrientation(rel);
                    return (
                      <button
                        key={rel.id}
                        onClick={() => onSelectProject(rel)}
                        className="group text-left cursor-pointer"
                      >
                        <div className={`relative overflow-hidden rounded-xl border ${aspectRatioClass(relOrientation)} ${
                          isLight ? "bg-zinc-100 border-black/10" : "bg-[#161616] border-white/10"
                        }`}>
                          <img
                            src={relCover ?? ""}
                            alt={rel.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-white border border-white/70 px-3 py-1.5 rounded-full">
                              View Project
                            </span>
                          </div>
                        </div>
                        <h3 className="mt-3 text-sm font-bold uppercase tracking-tight truncate">{rel.title}</h3>
                        <p className={`text-[10px] font-mono uppercase tracking-widest ${subtle}`}>
                          {categories.find((c) => c.id === rel.category_id)?.name || "Uncategorized"}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className={`border-t pt-14 text-center ${hairline}`}>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-display uppercase mb-8">
                Interested in working together?
              </h2>
              <button
                onClick={onStartTalk}
                className={`inline-flex items-center gap-3 px-10 py-5 text-xs font-mono font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer active:scale-95 ${
                  isLight ? "bg-black text-white hover:bg-gray-800" : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                Start a Project
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
