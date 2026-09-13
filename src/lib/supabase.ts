import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const rawKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim();

export const supabaseUrl = rawUrl;
export const supabasePublishableKey = rawKey;

export const isClientSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  rawUrl.startsWith('https://') &&
  !rawUrl.includes('placeholder') &&
  !rawKey.includes('placeholder')
);

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseClient) {
    return supabaseClient;
  }

  const url = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim();

  if (url && key && url.startsWith('https://')) {
    try {
      supabaseClient = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: window.localStorage,
        },
      });
      return supabaseClient;
    } catch (err) {
      console.error('[HerShield] Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return null;
}
