import { createClient } from "@supabase/supabase-js";

// Supports both standard naming and Vercel-Supabase Integration auto-injected environment variables
export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "";

export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

export const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  supabaseAnonKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  (supabaseServiceKey || supabaseAnonKey) &&
  !supabaseUrl.includes("your-project-id") &&
  !supabaseUrl.includes("your-project-url")
);

// Admin/Server-side Client (bypasses RLS with service role key if present, otherwise uses anon key)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
      auth: { persistSession: false },
    })
  : null;

// Browser/Client-side Client
export const getSupabaseClient = () => {
  if (!isSupabaseConfigured) return null;
  return createClient(supabaseUrl, supabaseAnonKey);
};

