/**
 * Small JWT decoder for educational display.
 * IMPORTANT: decoding does NOT verify the signature.
 * Verification must happen on the backend (Supabase / server verification).
 */
export function decodeJwt(token: string): { header: any; payload: any } | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const decodePart = (p: string) => {
    const b64 = p.replace(/-/g, "+").replace(/_/g, "/");
    const pad = "=".repeat((4 - (b64.length % 4)) % 4);
    return JSON.parse(atob(b64 + pad));
  };

  try {
    return { header: decodePart(parts[0]), payload: decodePart(parts[1]) };
  } catch {
    return null;
  }
}
