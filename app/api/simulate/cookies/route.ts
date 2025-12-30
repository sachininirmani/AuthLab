import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Returns cookies visible to the server (includes HttpOnly).
 * This is used in Cookies/CSRF labs to show what the server can read.
 */
export async function GET() {
  const all = cookies().getAll().map(c => ({ name: c.name, valuePreview: c.value.slice(0, 10) + (c.value.length > 10 ? "…" : "") }));
  const simRole = cookies().get("sim_role")?.value ?? "USER";
  return NextResponse.json({
    note: "Server can read HttpOnly cookies. Browser JS cannot.",
    simulatedRoleCookie: simRole,
    cookieCount: all.length,
    cookies: all,
  });
}
