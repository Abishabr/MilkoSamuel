// Admin session time limit.
// Supabase keeps its own token, but we enforce a stricter dashboard policy:
// after SESSION_LIMIT_MS of inactivity the admin must sign in again.

const STORAGE_KEY = "admin-session-expires-at";
export const SESSION_LIMIT_MS = 30 * 60 * 1000; // 30 minutes

/** Start (or restart) the session window — call on login and on user activity. */
export function touchAdminSession(): void {
  localStorage.setItem(STORAGE_KEY, String(Date.now() + SESSION_LIMIT_MS));
}

/** True while the session window is still open. */
export function isAdminSessionValid(): boolean {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  return Date.now() < Number(raw);
}

/** Milliseconds until the session expires (0 if already expired / absent). */
export function adminSessionRemainingMs(): number {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return 0;
  return Math.max(0, Number(raw) - Date.now());
}

/** Clear the session window — call on logout. */
export function clearAdminSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}
