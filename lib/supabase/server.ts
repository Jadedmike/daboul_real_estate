import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function createServerClient(useServiceRole = false) {
  const key = useServiceRole && supabaseServiceRoleKey ? supabaseServiceRoleKey : supabaseAnonKey;

  return createClient<Database>(
    supabaseUrl || "https://placeholder-project.supabase.co",
    key || "placeholder-key",
    {
      auth: {
        persistSession: false,
      },
    }
  );
}
