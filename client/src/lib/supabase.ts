import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { initErrorSetter } from './initError';

let supabaseInstance: SupabaseClient | null = null;

try {
  const REQUIRED_VARS = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
  ] as const;

  for (const key of REQUIRED_VARS) {
    if (!import.meta.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  supabaseInstance = createClient(
    import.meta.env.VITE_SUPABASE_URL as string,
    import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  );
} catch (err) {
  initErrorSetter(err instanceof Error ? err.message : String(err));
}

// Exported for auth operations only (login, logout, getSession).
// Data functions have been moved to client/src/lib/api.ts.
export const supabase = supabaseInstance as SupabaseClient;
