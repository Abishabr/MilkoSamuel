/**
 * initError.ts
 *
 * Holds the initialisation error message captured when `supabase.ts` fails to
 * set up the Supabase client (e.g. missing env vars). Exporting a plain `string
 * | null` value instead of throwing ensures the React tree can still mount and
 * render a visible error state instead of a blank white page.
 *
 * Requirements: 1.1, 1.2, 1.3
 */

let _initError: string | null = null;

/**
 * Called once by `supabase.ts` when initialisation fails.
 * Internal to the lib — not part of the public API.
 */
export function initErrorSetter(message: string): void {
  _initError = message;
}

/**
 * The initialisation error message, or `null` if Supabase initialised
 * successfully. Import this in `App.tsx` to gate the render.
 */
export { _initError as initError };
