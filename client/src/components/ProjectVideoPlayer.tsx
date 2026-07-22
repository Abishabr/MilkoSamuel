import React from "react";
import { toYouTubeEmbedUrl } from "../lib/youtube";
import {
  VideoOrientation,
  aspectRatioValue,
  isPlayableVideoFile,
} from "../lib/videoOrientation";

interface ProjectVideoPlayerProps {
  videoUrl: string;
  orientation: VideoOrientation;
  title: string;
  poster?: string | null;
  className?: string;
}

/**
 * Renders a project video in its native aspect ratio — the core requirement.
 * A YouTube URL becomes an iframe embed; a direct upload (Cloudinary) becomes a
 * native <video>. The wrapper is sized by orientation so landscape, portrait,
 * and square videos each get an appropriately-shaped, centered player instead
 * of being forced into one box:
 *
 *   • landscape → large centered player, max-width ~1200px, 16:9
 *   • portrait  → tall player, capped at ~80vh, width follows 9:16
 *   • square    → responsive 1:1, centered
 */
export default function ProjectVideoPlayer({
  videoUrl,
  orientation,
  title,
  poster,
  className = "",
}: ProjectVideoPlayerProps) {
  const embedUrl = toYouTubeEmbedUrl(videoUrl);
  const isFile = isPlayableVideoFile(videoUrl);
  if (!embedUrl && !isFile) return null;

  // Orientation-specific sizing for the centered wrapper.
  const wrapperStyle: React.CSSProperties = { aspectRatio: aspectRatioValue(orientation) };
  let wrapperClass = "relative w-full mx-auto overflow-hidden bg-black rounded-xl md:rounded-2xl";

  if (orientation === "landscape") {
    wrapperClass += " max-w-[1200px]";
  } else if (orientation === "portrait") {
    // Height-driven: cap at 80vh and let 9:16 dictate the width.
    wrapperStyle.maxHeight = "80vh";
    wrapperStyle.height = "min(80vh, 80vw)";
    wrapperStyle.aspectRatio = "9 / 16";
    wrapperStyle.width = "auto";
    wrapperClass += " max-w-full";
  } else {
    // square
    wrapperClass += " max-w-[600px]";
  }

  return (
    <div className={`flex justify-center w-full ${className}`}>
      <div className={wrapperClass} style={wrapperStyle}>
        {embedUrl ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={embedUrl}
            title={`${title} video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            className="absolute inset-0 w-full h-full object-contain bg-black"
            src={videoUrl}
            poster={poster ?? undefined}
            controls
            playsInline
            preload="metadata"
          />
        )}
      </div>
    </div>
  );
}
