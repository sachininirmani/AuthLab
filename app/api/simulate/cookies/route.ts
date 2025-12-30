import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies(); 

  const all = cookieStore.getAll().map(c => ({
    name: c.name,
    valuePreview:
      c.value.slice(0, 10) + (c.value.length > 10 ? "…" : ""),
  }));

  const simRole = cookieStore.get("sim_role")?.value ?? "USER";

  return NextResponse.json({
    note: "Server can read HttpOnly cookies. Browser JS cannot.",
    cookies: all,
    simRole,
  });
}
