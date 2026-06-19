import { createClient } from '@supabase/supabase-js';
import { loadEnv } from './env.js';

loadEnv();

let supabase;

export const isSupabaseConfigured = () =>
  Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY));

export const getSupabase = () => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  if (!supabase) {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
    );
  }

  return supabase;
};

export default getSupabase;
