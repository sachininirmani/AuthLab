import { NextResponse } from "next/server";
import { audit } from "@/lib/logger";

/**
 * Threat-model simulation endpoint.
 * Returns a structured response describing attacker goal, defense layers, and why it fails.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const attack = String(body?.attack ?? "");

  const map: Record<string, any> = {
    jwt_tamper: {
      ok: false,
      reason: "Blocked: JWT signature mismatch",
      attackerTries: "Modify JWT payload role USER→ADMIN",
      defense: ["JWT signing (signature verification)", "Backend rejects invalid token"],
      whyFails: "Attacker cannot generate a valid signature without the server secret.",
    },
    csrf: {
      ok: false,
      reason: "Blocked: SameSite prevents cross-site cookie sending",
      attackerTries: "Trigger a request from evil.com to a state-changing endpoint",
      defense: ["Cookie SameSite=Lax/Strict", "Backend treats missing cookie as logged out"],
      whyFails: "Browser refuses to attach authentication cookie to cross-site request.",
    },
    xss_cookie: {
      ok: false,
      reason: "Blocked: HttpOnly cookies are not accessible from JavaScript",
      attackerTries: "Run document.cookie to steal auth token",
      defense: ["HttpOnly flag", "CSP (optional)"],
      whyFails: "HttpOnly cookies are hidden from JS; attacker can't read them directly.",
    },
    replay: {
      ok: false,
      reason: "Blocked: token expired",
      attackerTries: "Reuse an old token captured earlier",
      defense: ["Token expiry (exp)", "Backend checks expiration"],
      whyFails: "Expired tokens are rejected even if signature is valid.",
    },
  };

  const data = map[attack];
  if (!data) return NextResponse.json({ reason: "Unknown attack type" }, { status: 400 });

  await audit(`threat_model_${attack}`, data.ok, data.reason);

  return NextResponse.json({
    attack,
    ...data,
    note: "This is an educational simulation. Real systems may have additional layers (rate limiting, device fingerprinting, etc.).",
  }, { status: data.ok ? 200 : 403 });
}
