"use client";

import { useEffect, useState } from "react";

/**
 * RoleSwitcher controls the "simulated role" for the learning sandbox.
 *
 * IMPORTANT:
 * - This does NOT change the real Supabase user account.
 * - We store a small cookie like sim_role=USER/ADMIN for demo purposes.
 * - Backend checks both: real auth (Supabase session) + simulated role cookie.
 */
export default function RoleSwitcher() {
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    // Load current simulated role from the server cookie.
    (async () => {
      const res = await fetch("/api/simulate/role", { method: "GET" });
      const data = await res.json();
      if (data?.role === "ADMIN" || data?.role === "USER") setRole(data.role);
    })();
  }, []);

  async function update(next: "USER" | "ADMIN") {
    setStatus("Updating...");
    const res = await fetch("/api/simulate/role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: next }),
    });
    const data = await res.json();
    if (res.ok) {
      setRole(data.role);
      setStatus("Updated ✓");
      setTimeout(() => setStatus(""), 1200);
    } else {
      setStatus(data?.error ?? "Failed");
    }
  }

  return (
    <div className="card">
      <div className="h2">Simulated Role (Sandbox Control)</div>
      <p className="p">
        Use one email account, then switch roles here to learn authorization behavior safely.
      </p>
      <hr className="sep" />
      <div className="row">
        <span className="badge">Current:</span>
        <span className="badge mono">{role}</span>
        <button className={"btn " + (role === "USER" ? "primary" : "")} onClick={() => update("USER")}>USER</button>
        <button className={"btn " + (role === "ADMIN" ? "primary" : "")} onClick={() => update("ADMIN")}>ADMIN</button>
        {status ? <span className="badge">{status}</span> : null}
      </div>
      <p className="p" style={{ marginTop: 10 }}>
        The backend will enforce: <span className="mono">/api/admin</span> requires simulated ADMIN.
      </p>
    </div>
  );
}
