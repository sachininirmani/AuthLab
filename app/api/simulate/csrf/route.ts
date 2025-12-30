import { NextResponse } from "next/server";
import { audit } from "@/lib/logger";

/**
 * CSRF simulation endpoint.
 * We do NOT perform real cross-origin networking here; we simulate browser cookie sending decision
 * based on SameSite policy and origin.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { origin, sameSite, cookieWouldSend } = body as { origin: string; sameSite: string; cookieWouldSend: boolean };

  const crossSite = origin !== "authlab.com";
  const blockedBy = cookieWouldSend ? null : "SameSite policy blocked cookie";

  const ok = !crossSite || cookieWouldSend; // if same-site, it's allowed; if cross-site, depends on cookie sending
  const reason = ok
    ? "Request could be authenticated (cookie present)"
    : "Blocked: cookie not sent, so server would treat you as logged out";

  await audit("csrf_simulation", ok, blockedBy ?? reason);

  return NextResponse.json({
    origin,
    sameSite,
    crossSite,
    cookieWouldSend,
    blockedBy,
    reason,
    tip: "In real systems, servers also use CSRF tokens for stronger protection when using cookies.",
  }, { status: ok ? 200 : 401 });
}
