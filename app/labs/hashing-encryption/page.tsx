"use client";

import { useState } from "react";
import AttackResult from "@/components/AttackResult";
import DecisionFlow from "@/components/DecisionFlow";

export default function HashingEncryptionLabPage() {
  const [text, setText] = useState("password123");
  const [hashRes, setHashRes] = useState<any>(null);

  async function runHash() {
    const res = await fetch("/api/simulate/hash", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: text }),
    });
    const data = await res.json();
    setHashRes({ ok: res.ok, status: res.status, ...data });
  }

  return (
    <main className="container">
      <div className="card">
        <h1 className="h1">Hashing vs Encryption</h1>
        <p className="p">
          Goal: understand where hashing and encryption appear in real auth systems.
          Passwords are hashed (one-way). HTTPS encrypts traffic (two-way).
        </p>
      </div>

      <div style={{ marginTop: 16 }} className="grid grid-2">
        {/* LEFT: Explanation */}
        <div className="card">
          <div className="h2">Hashing vs Encryption</div>

          <p className="p">
            <strong>Hashing</strong> and <strong>encryption</strong> are both used to protect data,
            but they solve very different problems.
          </p>

          <p className="p">
            <strong>Hashing</strong> is a one-way process. Once data is hashed, it cannot be converted
            back to its original form. This is why passwords are <em>never stored directly</em>.
          </p>

          <p className="p">
            <strong>Encryption</strong> is a two-way process. Data is encrypted before transmission
            and decrypted by the receiver. This protects data while it travels over the network.
          </p>

          <ul className="p">
            <li>
              <strong>Passwords</strong> → hashed (one-way, irreversible)
            </li>
            <li>
              <strong>Network traffic (HTTPS)</strong> → encrypted (two-way)
            </li>
            <li>
              <strong>JWTs</strong> → signed (integrity, not secrecy)
            </li>
          </ul>

          <p className="p">
            In this lab, you will see how hashing behaves and where encryption fits
            in real authentication systems.
          </p>
        </div>

        {/* RIGHT: Image */}
        <div className="card">
          <div className="h2">Where They Are Used</div>

          <img
            src="/images/hashing-encryption-flow.png"
            alt="Hashing vs encryption in authentication systems"
            style={{
              width: "100%",
              borderRadius: 6,
              marginTop: 8,
            }}
          />

          <p className="p" style={{ marginTop: 8 }}>
            Passwords are hashed before storage, while HTTPS encrypts data in transit
            between browser and server.
          </p>
        </div>
      </div>


      <div style={{ marginTop: 16 }} className="grid grid-2">
        <div className="card">
          <div className="h2">Hash Demo (Educational)</div>
          <p className="p">We generate a hash-style output for the same input. In real systems, hashing is done on the server.</p>
          <hr className="sep" />
          <input value={text} onChange={(e) => setText(e.target.value)}
            style={{ width: "100%", padding: 10, borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.25)", color: "white" }}
          />
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn primary" onClick={runHash}>Generate hash</button>
          </div>
          <p className="p" style={{ marginTop: 10 }}>
            Supabase hashes real passwords internally. We don't store plaintext passwords in AuthLab.
          </p>
        </div>

        <DecisionFlow
          title="Where Hashing vs Encryption Fits"
          steps={[
            { label: "Passwords: use hashing (one-way)", ok: true, detail: "If DB leaks, attacker still can't read original passwords." },
            { label: "Transport: use encryption (HTTPS/TLS)", ok: true, detail: "Protects data over the network." },
            { label: "JWT: signed (integrity), not encrypted", ok: true, detail: "Readable payload, but tamper-resistant signature." },
          ]}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <AttackResult title="Hash demo result" result={hashRes} />
      </div>
    </main>
  );
}
