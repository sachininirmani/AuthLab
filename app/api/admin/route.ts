import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { requireSimulatedRole } from "@/lib/auth/requireRole";
import { audit } from "@/lib/logger";

/**
 * Admin API: requires:
 * - authenticated user (Supabase)
 * - simulated role ADMIN (cookie sim_role=ADMIN)
 *
 * NOTE: This is an educational sandbox.
 * Real applications must use database-backed roles, not cookies.
 */
export async function GET() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  // 1️⃣ Authentication check
  if (!data.user) {
    await audit("call_admin_api", false, "No authenticated user");
    return NextResponse.json(
      { reason: "Not authenticated" },
      { status: 401 }
    );
  }

  // 2️⃣ Authorization check (simulated role)
  const roleCheck = await requireSimulatedRole("ADMIN");
  if (!roleCheck.ok) {
    await audit("call_admin_api", false, roleCheck.reason);
    return NextResponse.json(
      { reason: roleCheck.reason },
      { status: 403 }
    );
  }

  // 3️⃣ Authorized
  await audit("call_admin_api", true);
  return NextResponse.json({
    reason: "Authorized as ADMIN (simulated)",
    data: {
      secret: "This is demo admin data.",
      time: new Date().toISOString(),
    },
  });
}

/**
 * POST variant used by JWT lab to demonstrate tampering.
 * If body.tokenOverride === "TAMPERED", we intentionally reject the request.
 */
export async function POST(request: Request) {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  // 1️⃣ Authentication check
  if (!data.user) {
    await audit("call_admin_api_post", false, "No authenticated user");
    return NextResponse.json(
      { reason: "Not authenticated" },
      { status: 401 }
    );
  }

  // 2️⃣ JWT tampering simulation
  const body = await request.json().catch(() => ({}));
  if (body?.tokenOverride === "TAMPERED") {
    await audit("jwt_tamper_demo", false, "Signature mismatch (simulated)");
    return NextResponse.json(
      { reason: "Signature mismatch (simulated tampering)" },
      { status: 401 }
    );
  }

  // 3️⃣ Authorization check (simulated role)
  const roleCheck = await requireSimulatedRole("ADMIN");
  if (!roleCheck.ok) {
    await audit("call_admin_api_post", false, roleCheck.reason);
    return NextResponse.json(
      { reason: roleCheck.reason },
      { status: 403 }
    );
  }

  // 4️⃣ Authorized
  await audit("call_admin_api_post", true);
  return NextResponse.json({
    reason: "Authorized",
    note: "Valid token + ADMIN role.",
  });
}
