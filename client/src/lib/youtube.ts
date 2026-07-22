/**
 * Converts a YouTube watch URL or short URL to an embed URL.
 *
 * Supports:
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://youtu.be/VIDEO_ID
 *   https://www.youtube.com/shorts/VIDEO_ID
 *   https://www.youtube.com/embed/VIDEO_ID  (already embed — returned as-is)
 *
 * Returns null for non-YouTube, empty, or malformed input.
 *
 * Requirements: 7.1, 7.2
 */
export function extractYouTubeId(url: string): string | null {
  if (!url || url.trim() === '') return null;

  const trimmed = url.trim();

  // Already an embed URL
  const embedMatch = trimmed.match(/^https?:\/\/(?:www\.)?youtube\.com\/embed\/([A-Za-z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  // Shorts URL: https://www.youtube.com/shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/^https?:\/\/(?:www\.)?youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];

  // Standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  // Short URL: https://youtu.be/VIDEO_ID
  const shortMatch = trimmed.match(/^https?:\/\/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  return null;
}

export function toYouTubeEmbedUrl(url: string): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

/**
 * Derives a thumbnail image URL from a YouTube video URL.
 * Uses hqdefault (480x360) which exists for every video, including Shorts.
 * Returns null for non-YouTube or malformed input.
 */
export function toYouTubeThumbnailUrl(url: string): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

/**
 * Resolves a project's display cover: the uploaded cover image when present,
 * otherwise the thumbnail of its YouTube video.
 */
export function resolveProjectCover(project: {
  cover_image_url: string | null;
  video_url: string | null;
}): string | null {
  if (project.cover_image_url) return project.cover_image_url;
  if (project.video_url) return toYouTubeThumbnailUrl(project.video_url);
  return null;
}
