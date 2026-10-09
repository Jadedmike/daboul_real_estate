import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./types";

const defaultSupabaseUrl = "https://mkgvkimtbsvegmqlbsnu.supabase.co";
const defaultSupabaseAnonKey = "sb_publishable_HocxBE2eAOB9NLEnAh_QhA_77WXjcNk";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || defaultSupabaseUrl;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || defaultSupabaseAnonKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function createClient() {
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  );
}

export const supabase = createClient();
