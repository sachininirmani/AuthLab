"use client";

import { useMemo, useState } from "react";
import { decodeJwt } from "@/lib/security/jwt";

/**
 * TokenViewer is used in the JWT Lab.
 * We NEVER show secrets. We only decode and display the JWT header/payload.
 * Reminder: JWT payload is NOT encrypted; it's readable, but it is SIGNED (tamper-resistant).
 */
export default function TokenViewer({ token }: { token: string | null }) {
  const [tamperRole, setTamperRole] = useState<"USER" | "ADMIN">("ADMIN");

  const decoded = useMemo(() => {
    if (!token) return null;
    return decodeJwt(token);
  }, [token]);

  const tampered = useMemo(() => {
    if (!token) return null;
    // Educational tamper: modify payload role only (signature remains unchanged => invalid).
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    try {
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      payload.role = tamperRole;
      const newPayloadB64 = btoa(JSON.stringify(payload)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      return `${parts[0]}.${newPayloadB64}.${parts[2]}`;
    } catch {
      return null;
    }
  }, [token, tamperRole]);

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="card">
        <div className="h2">Your JWT (Decoded)</div>
        <p className="p">
          JWT has 3 parts: <span className="mono">header.payload.signature</span>.
          Payload is readable, but the signature prevents tampering.
        </p>
        <hr className="sep" />
        <div className="code">{token ? token : "No token found. Login first."}</div>

        <hr className="sep" />
        <div className="grid grid-2">
          <div>
            <div className="badge">Header</div>
            <div className="code">{decoded ? JSON.stringify(decoded.header, null, 2) : "{}"}</div>
          </div>
          <div>
            <div className="badge">Payload</div>
            <div className="code">{decoded ? JSON.stringify(decoded.payload, null, 2) : "{}"}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="h2">Tamper Demo (Role Escalation Attempt)</div>
        <p className="p">
          Try to change <span className="mono">role</span> inside payload. The signature is unchanged, so the backend will reject it.
        </p>
        <hr className="sep" />
        <div className="row">
          <label className="badge">Set role to:</label>
          <button className={"btn " + (tamperRole === "ADMIN" ? "primary" : "")} onClick={() => setTamperRole("ADMIN")}>ADMIN</button>
          <button className={"btn " + (tamperRole === "USER" ? "primary" : "")} onClick={() => setTamperRole("USER")}>USER</button>
        </div>
        <hr className="sep" />
        <div className="badge">Tampered token (invalid)</div>
        <div className="code">{tampered ?? "—"}</div>

        <hr className="sep" />
        <p className="p">
          Next, call the admin API using this tampered token (button in the lab). You will get <span className="mono">401/403</span>.
        </p>
      </div>
    </div>
  );
}
