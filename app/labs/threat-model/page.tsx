"use client";

import { useState } from "react";
import AttackResult from "@/components/AttackResult";
import DecisionFlow from "@/components/DecisionFlow";

const attacks = [
  { key: "jwt_tamper", label: "JWT Tampering (role escalation)" },
  { key: "csrf", label: "CSRF (cross-site cookie abuse)" },
  { key: "xss_cookie", label: "XSS attempt (read HttpOnly cookie)" },
  { key: "replay", label: "Replay attack (expired token)" },
];

export default function ThreatModelLabPage() {
  const [selected, setSelected] = useState(attacks[0].key);
  const [result, setResult] = useState<any>(null);

  async function run() {
    const res = await fetch("/api/simulate/attack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attack: selected }),
    });
    const data = await res.json();
    setResult({ ok: res.ok, status: res.status, ...data });
  }

  return (
    <main className="container">
      <div className="card">
        <h1 className="h1">Threat Model Lab</h1>
        <p className="p">
          Goal: learn attacker thinking. Pick an attack, run it, and see the defense layers and reasons for failure.
        </p>
      </div>

      <div style={{ marginTop: 16 }} className="grid grid-2">
        <div className="card">
          <div className="h2">Attack Selector</div>
          <p className="p">This is safe simulation for education.</p>
          <hr className="sep" />
          <div className="grid" style={{ gap: 10 }}>
            {attacks.map(a => (
              <button key={a.key} className={"btn " + (selected === a.key ? "primary" : "")} onClick={() => setSelected(a.key)}>
                {a.label}
              </button>
            ))}
          </div>
          <hr className="sep" />
          <button className="btn danger" onClick={run}>Run simulation</button>
        </div>

        <DecisionFlow
          title="Defense-in-Depth (Layers)"
          steps={[
            { label: "Transport security (HTTPS)", ok: true, detail: "Protects data in transit." },
            { label: "Auth: verify session token", ok: true, detail: "Rejects missing/invalid/expired tokens." },
            { label: "Browser protections (HttpOnly/SameSite)", ok: true, detail: "Blocks cookie theft and CSRF." },
            { label: "Authorization: role checks", ok: true, detail: "Prevents privilege escalation." },
            { label: "Audit logging", ok: true, detail: "Records events for investigation." },
          ]}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <AttackResult title="Simulation result" result={result} />
      </div>
    </main>
  );
}
