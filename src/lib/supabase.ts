import { createClient } from '@supabase/supabase-js';

const supabaseUrlRaw = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Normalize to avoid accidental trailing slashes or prefixed paths in env
const supabaseUrl = supabaseUrlRaw?.replace(/\/+$/, '')
  .replace(/\/(rest\/v1|auth\/v1)\/?$/, '') as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  throw new Error(
    [
      'Supabase is not configured.',
      'Missing required Vite environment variables:',
      '- VITE_SUPABASE_URL',
      '- VITE_SUPABASE_ANON_KEY',
      '',
      'Set them in your .env file and restart the dev server.',
    ].join('\n'),
  );
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

