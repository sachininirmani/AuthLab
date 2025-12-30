import { cookies } from "next/headers";

/**
 * Sandbox role simulation:
 * - role is stored in a cookie 'sim_role' (USER/ADMIN)
 * - This is only for learning labs, not for real production authorization.
 */
export function getSimulatedRole(): "USER" | "ADMIN" {
  const role = cookies().get("sim_role")?.value;
  return role === "ADMIN" ? "ADMIN" : "USER";
}

export function requireSimulatedRole(required: "USER" | "ADMIN") {
  const role = getSimulatedRole();
  if (required === "ADMIN" && role !== "ADMIN") {
    return { ok: false as const, reason: "Role mismatch (simulated role is USER)" };
  }
  return { ok: true as const };
}
