import { supabaseServer } from "@/lib/supabase/server";

/**
 * Reads currently logged-in user on the server side.
 * Returns null if not logged in.
 */
export async function getServerUser() {
  const supabase = await supabaseServer(); // ✅ await
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

