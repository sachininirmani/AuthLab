import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { audit } from "@/lib/logger";

/**
 * Protected API: requires the user to be authenticated (Supabase session cookie).
 * The lab uses this to show: "backend must enforce auth, not frontend."
 */
export async function GET() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    await audit("call_protected_api", false, "No authenticated user");
    return NextResponse.json({ reason: "Not authenticated" }, { status: 401 });
  }

  await audit("call_protected_api", true);
  return NextResponse.json({
    reason: "Authorized",
    user: { id: data.user.id, email: data.user.email },
    tip: "This endpoint is protected server-side.",
  });
}
