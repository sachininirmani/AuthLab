import { NextResponse } from "next/server";
import { createHash, randomBytes } from "node:crypto";

/**
 * Educational hashing demo.
 * This is NOT used for real password storage.
 *
 * We show:
 * - hashing is one-way
 * - salt changes output
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = String(body?.input ?? "");
  if (!input) return NextResponse.json({ reason: "Missing input" }, { status: 400 });

  const salt = randomBytes(8).toString("hex");
  const output = createHash("sha256").update(`${salt}:${input}`).digest("hex");

  return NextResponse.json({
    reason: "Hash generated (demo)",
    input,
    salt,
    output,
    note: "Real password hashing uses slow hashes (bcrypt/argon2). This is a teaching demo only.",
  });
}
