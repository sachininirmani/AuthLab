import { cookies } from "next/headers";

/**
 * Sandbox role simulation:
 * - role is stored in a cookie 'sim_role' (USER/ADMIN)
 * - This is ONLY for learning labs, not real production authorization.
 */

/**
 * Reads the simulated role from HttpOnly cookies.
 * Must be async because cookies() is async in Next.js 15.
 */
export async function getSimulatedRole(): Promise<"USER" | "ADMIN"> {
  const cookieStore = await cookies();
  const role = cookieStore.get("sim_role")?.value;

  return role === "ADMIN" ? "ADMIN" : "USER";
}

/**
 * Enforces a required simulated role.
 * Used by API routes to demonstrate backend authorization.
 */
export async function requireSimulatedRole(
  required: "USER" | "ADMIN"
): Promise<
  | { ok: true }
  | { ok: false; reason: string }
> {
  const role = await getSimulatedRole();

  if (required === "ADMIN" && role !== "ADMIN") {
    return {
      ok: false,
      reason: "Role mismatch (simulated role is USER)",
    };
  }

  return { ok: true };
}
