import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Stores the simulated role in a cookie.
 * This is ONLY for the sandbox learning experience.
 */
export async function GET() {
  const cookieStore = await cookies(); 
  const role = cookieStore.get("sim_role")?.value;

  return NextResponse.json({
    role: role === "ADMIN" ? "ADMIN" : "USER",
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const role = body?.role === "ADMIN" ? "ADMIN" : "USER";

  const cookieStore = await cookies(); // ✅ await cookies

  cookieStore.set("sim_role", role, {
    httpOnly: true,   // not accessible from JS (teaches HttpOnly)
    sameSite: "lax",  // default safe-ish setting
    secure: true,     // HTTPS only (Vercel OK, localhost may vary)
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ role });
}

export async function DELETE() {
  const cookieStore = await cookies(); // ✅ await cookies
  cookieStore.delete("sim_role");

  return NextResponse.json({ ok: true });
}
