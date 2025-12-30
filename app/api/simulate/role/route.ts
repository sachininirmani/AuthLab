import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Stores the simulated role in a cookie.
 * This is ONLY for the sandbox learning experience.
 */
export async function GET() {
  const role = cookies().get("sim_role")?.value;
  return NextResponse.json({ role: role === "ADMIN" ? "ADMIN" : "USER" });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const role = body?.role === "ADMIN" ? "ADMIN" : "USER";

  cookies().set("sim_role", role, {
    httpOnly: true,     // not accessible from JS (teaches HttpOnly)
    sameSite: "lax",    // default safe-ish setting
    secure: true,       // requires HTTPS (on localhost, Next will still set; browsers may treat differently)
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ role });
}

export async function DELETE() {
  cookies().delete("sim_role");
  return NextResponse.json({ ok: true });
}
