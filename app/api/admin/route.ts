import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { requireSimulatedRole } from "@/lib/auth/requireRole";
import { audit } from "@/lib/logger";

/**
 * Admin API: requires:
 * - authenticated user (Supabase)
 * - simulated role ADMIN (cookie sim_role=ADMIN)
 *
 * NOTE: This is an educational sandbox. Real apps should base roles on DB claims, not a demo cookie.
 */
export async function GET() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    await audit("call_admin_api", false, "No authenticated user");
    return NextResponse.json({ reason: "Not authenticated" }, { status: 401 });
  }

  const roleCheck = requireSimulatedRole("ADMIN");
  if (!roleCheck.ok) {
    await audit("call_admin_api", false, roleCheck.reason);
    return NextResponse.json({ reason: roleCheck.reason }, { status: 403 });
  }

  await audit("call_admin_api", true);
  return NextResponse.json({
    reason: "Authorized as ADMIN (simulated)",
    data: { secret: "This is demo admin data.", time: new Date().toISOString() },
  });
}

/**
 * POST variant used by JWT lab to demonstrate tampering.
 * If body.tokenOverride === "TAMPERED", we intentionally reject.
 */
export async function POST(request: Request) {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    await audit("call_admin_api_post", false, "No authenticated user");
    return NextResponse.json({ reason: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  if (body?.tokenOverride === "TAMPERED") {
    await audit("jwt_tamper_demo", false, "Signature mismatch (simulated)");
    return NextResponse.json({ reason: "Signature mismatch (simulated tampering)" }, { status: 401 });
  }

  const roleCheck = requireSimulatedRole("ADMIN");
  if (!roleCheck.ok) {
    await audit("call_admin_api_post", false, roleCheck.reason);
    return NextResponse.json({ reason: roleCheck.reason }, { status: 403 });
  }

  await audit("call_admin_api_post", true);
  return NextResponse.json({ reason: "Authorized", note: "Valid token + ADMIN role." });
}
