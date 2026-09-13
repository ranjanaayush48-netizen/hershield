import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AsyncLocalStorage } from 'async_hooks';

// Read credentials securely from server environment
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
const supabaseAnonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || supabaseSecretKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseSecretKey);

export const authContext = new AsyncLocalStorage<string>();

let supabaseAdminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    return null;
  }
  
  if (!supabaseAdminClient && supabaseUrl && supabaseSecretKey) {
    supabaseAdminClient = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseAdminClient;
}

let supabaseServiceAdminClient: SupabaseClient | null = null;

export function getSupabaseServiceAdmin(): SupabaseClient | null {
  if (!isSupabaseConfigured || !supabaseUrl || !supabaseSecretKey) {
    return null;
  }
  if (!supabaseServiceAdminClient) {
    supabaseServiceAdminClient = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseServiceAdminClient;
}

export { supabaseUrl };
