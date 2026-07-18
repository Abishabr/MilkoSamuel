import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Central, validated configuration.
 * Fails fast with a clear message listing ALL missing variables at once,
 * instead of dying on the first one.
 */
const REQUIRED = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'] as const;

const missing = REQUIRED.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(
    `[config] Missing required environment variable(s): ${missing.join(', ')}\n` +
      `[config] Copy server/.env.example to server/.env and fill in the values.`,
  );
  process.exit(1);
}

export const config = {
  supabaseUrl: process.env.SUPABASE_URL as string,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  port: parseInt(process.env.PORT || '3001', 10),
  // Comma-separated list of allowed origins, e.g.
  // CLIENT_URL=http://localhost:5173,https://milkosamuel.vercel.app
  clientOrigins: (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  isProduction: process.env.NODE_ENV === 'production',
};
