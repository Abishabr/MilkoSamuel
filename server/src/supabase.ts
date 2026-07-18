import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './config';

// Admin client using the service-role key — server-side only, bypasses RLS.
export const supabase: SupabaseClient = createClient(
  config.supabaseUrl,
  config.supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
