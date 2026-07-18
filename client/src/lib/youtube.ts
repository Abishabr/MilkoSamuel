/**
 * Converts a YouTube watch URL or short URL to an embed URL.
 *
 * Supports:
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://youtu.be/VIDEO_ID
 *   https://www.youtube.com/embed/VIDEO_ID  (already embed — returned as-is)
 *
 * Returns null for non-YouTube, empty, or malformed input.
 *
 * Requirements: 7.1, 7.2
 */
export function toYouTubeEmbedUrl(url: string): string | null {
  if (!url || url.trim() === '') return null;

  const trimmed = url.trim();

  // Already an embed URL
  const embedMatch = trimmed.match(/^https?:\/\/(?:www\.)?youtube\.com\/embed\/([A-Za-z0-9_-]{11})/);
  if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}`;

  // Standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  // Short URL: https://youtu.be/VIDEO_ID
  const shortMatch = trimmed.match(/^https?:\/\/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  return null;
}
