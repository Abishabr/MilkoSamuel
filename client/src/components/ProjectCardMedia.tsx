import React, { useRef, useState } from "react";
import { Project } from "../types";
import { resolveProjectCover } from "../lib/youtube";
import { projectOrientation, aspectRatioClass, isPlayableVideoFile } from "../lib/videoOrientation";

interface ProjectCardMediaProps {
  project: Project;
  isLight: boolean;
  /** Overlay label shown on hover. */
  label?: string;
  /** Force a fixed aspect ratio instead of adapting to the video orientation. */
  fixedAspectClass?: string;
}

/**
 * Card media that adapts to the project's video orientation and, on hover,
 * plays a muted looped preview when the project has a directly-playable video
 * (Cloudinary upload). Falls back to the cover image with a smooth zoom.
 */
export default function ProjectCardMedia({
  project,
  isLight,
  label = "View Project",
  fixedAspectClass,
}: ProjectCardMediaProps) {
  const cover = resolveProjectCover(project);
  const orientation = projectOrientation(project);
  const canPreview = isPlayableVideoFile(project.video_url);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [previewing, setPreviewing] = useState(false);

  const startPreview = () => {
    if (!canPreview) return;
    setPreviewing(true);
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      void v.play().catch(() => {});
    }
  };

  const stopPreview = () => {
    if (!canPreview) return;
    setPreviewing(false);
    const v = videoRef.current;
    if (v) v.pause();
  };

  const aspect = fixedAspectClass ?? aspectRatioClass(orientation);

  return (
    <div
      className={`group/media relative overflow-hidden border rounded-xl md:rounded-2xl transition-colors duration-300 ${aspect} ${
        isLight ? "bg-zinc-100 border-black/10" : "bg-[#161616] border-white/10"
      }`}
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
    >
      <img
        alt={project.title}
        src={cover ?? undefined}
        referrerPolicy="no-referrer"
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.05] ${
          previewing ? "opacity-0" : "opacity-100"
        }`}
      />

      {canPreview && (
        <video
          ref={videoRef}
          src={project.video_url ?? undefined}
          muted
          loop
          playsInline
          preload="none"
          poster={cover ?? undefined}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            previewing ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-white border border-white/70 px-5 py-2 rounded-full bg-black/30 backdrop-blur-sm">
          {label}
        </span>
      </div>
    </div>
  );
}
