import { extractYouTubeId } from "./youtube";

/**
 * The three orientations a project video can take. Stored on the project row
 * and used everywhere a video (or its thumbnail) is rendered so the media
 * always appears in its native aspect ratio rather than a forced box.
 */
export type VideoOrientation = "landscape" | "portrait" | "square";

export const DEFAULT_ORIENTATION: VideoOrientation = "landscape";

/**
 * Classifies an orientation from raw pixel dimensions.
 * A small tolerance treats near-square videos (e.g. 1080×1000) as square.
 */
export function orientationFromDimensions(width: number, height: number): VideoOrientation {
  if (!width || !height) return DEFAULT_ORIENTATION;
  const ratio = width / height;
  if (ratio > 1.15) return "landscape";
  if (ratio < 0.85) return "portrait";
  return "square";
}

/**
 * CSS aspect-ratio string ("16 / 9") for a given orientation — used by grid
 * cards and preview boxes to reserve the correct space before media loads.
 */
export function aspectRatioValue(orientation: VideoOrientation): string {
  switch (orientation) {
    case "portrait":
      return "9 / 16";
    case "square":
      return "1 / 1";
    case "landscape":
    default:
      return "16 / 9";
  }
}

/**
 * Tailwind aspect-ratio utility class for a given orientation.
 */
export function aspectRatioClass(orientation: VideoOrientation): string {
  switch (orientation) {
    case "portrait":
      return "aspect-[9/16]";
    case "square":
      return "aspect-square";
    case "landscape":
    default:
      return "aspect-video";
  }
}

/**
 * Best-effort orientation guess for a YouTube URL without loading the video:
 * `/shorts/` links are always vertical, everything else is treated as landscape.
 * Returns null when the URL is not YouTube so callers can fall back to probing.
 */
export function orientationFromYouTubeUrl(url: string): VideoOrientation | null {
  if (!url) return null;
  if (!extractYouTubeId(url)) return null;
  if (/youtube\.com\/shorts\//i.test(url)) return "portrait";
  return "landscape";
}

/**
 * Loads a video file just far enough to read its intrinsic dimensions, then
 * resolves the detected orientation. Used after a Cloudinary upload when the
 * upload result did not already include width/height. Resolves to the default
 * orientation if the metadata cannot be read (never rejects).
 */
export function detectVideoOrientation(videoUrl: string): Promise<VideoOrientation> {
  return new Promise((resolve) => {
    if (!videoUrl) return resolve(DEFAULT_ORIENTATION);

    const yt = orientationFromYouTubeUrl(videoUrl);
    if (yt) return resolve(yt);

    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.crossOrigin = "anonymous";

    let settled = false;
    const finish = (orientation: VideoOrientation) => {
      if (settled) return;
      settled = true;
      video.removeAttribute("src");
      resolve(orientation);
    };

    video.onloadedmetadata = () => {
      finish(orientationFromDimensions(video.videoWidth, video.videoHeight));
    };
    video.onerror = () => finish(DEFAULT_ORIENTATION);

    // Safety timeout so a stalled network never leaves the admin form hanging.
    setTimeout(() => finish(DEFAULT_ORIENTATION), 12000);

    video.src = videoUrl;
  });
}

/**
 * True when a URL points at a directly-playable video file (e.g. a Cloudinary
 * upload) rather than a YouTube embed. Cloudinary delivers under `/video/`.
 */
export function isPlayableVideoFile(url: string | null | undefined): boolean {
  if (!url) return false;
  if (extractYouTubeId(url)) return false;
  return /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(url) || /\/video\/upload\//i.test(url);
}

/**
 * Reads a project's stored orientation, defaulting safely for legacy rows that
 * predate the video_orientation column.
 */
export function projectOrientation(project: {
  video_orientation?: string | null;
}): VideoOrientation {
  const value = project.video_orientation;
  if (value === "portrait" || value === "square" || value === "landscape") {
    return value;
  }
  return DEFAULT_ORIENTATION;
}
