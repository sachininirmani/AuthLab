"use client";

import { useEffect, useState } from "react";
import TokenViewer from "@/components/TokenViewer";
import AttackResult from "@/components/AttackResult";
import DecisionFlow from "@/components/DecisionFlow";
import RoleSwitcher from "@/components/RoleSwitcher";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function JwtLabPage() {
  const supabase = supabaseBrowser();
  const [token, setToken] = useState<string | null>(null);
  const [adminCall, setAdminCall] = useState<any>(null);
  const [tamperedCall, setTamperedCall] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const access = data.session?.access_token ?? null;
      setToken(access);
    })();
  }, []);

  async function callAdminWithToken(useTampered: boolean) {
    const body = { tokenOverride: useTampered ? "TAMPERED" : null }; // server will look for header if provided
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" , ...(token ? { "Authorization": `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    const output = { ok: res.ok, status: res.status, ...data };
    if (useTampered) setTamperedCall(output); else setAdminCall(output);
  }

  return (
    <main className="container">
      <div className="card">
        <h1 className="h1">JWT Lab</h1>
        <p className="p">Goal: understand why JWT payload is readable, but tampering fails due to signature verification.</p>
      </div>

      <div style={{ marginTop: 16 }} className="grid grid-2">
        {/* LEFT: Explanation */}
        <div className="card">
          <div className="h2">What is a JWT?</div>

          <p className="p">
            A <strong>JSON Web Token (JWT)</strong> is a compact token used to prove a user's
            identity to the backend without sending a password on every request.
          </p>

          <p className="p">
            A JWT has three parts separated by dots:
            <span className="mono"> header.payload.signature</span>
          </p>

          <ul className="p">
            <li>
              <strong>Header</strong> → token type and signing algorithm
            </li>
            <li>
              <strong>Payload</strong> → user data (readable, not secret)
            </li>
            <li>
              <strong>Signature</strong> → prevents tampering
            </li>
          </ul>

          <p className="p">
            The payload is intentionally readable, but if even one character is changed,
            the signature will no longer match and the backend will reject the token.
          </p>

          <p className="p">
            In this lab, you will decode a real JWT and see why tampering always fails,
            even if the payload looks editable.
          </p>
        </div>

        {/* RIGHT: Image */}
        <div className="card">
          <div className="h2">JWT Verification Flow</div>

          <img
            src="/images/jwt-flow.png"
            alt="JWT structure and signature verification"
            style={{
              width: "100%",
              borderRadius: 6,
              marginTop: 8,
            }}
          />

          <p className="p" style={{ marginTop: 8 }}>
            The backend verifies the JWT signature using a secret key.
            Any modification breaks trust.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 16 }} className="grid grid-2">
        <RoleSwitcher />
        <DecisionFlow
          title="Backend Decision Flow (Admin API)"
          steps={[
            { label: "Is the user authenticated?", ok: Boolean(token), detail: "We expect a valid Supabase session token." },
            { label: "Is the token cryptographically valid?", ok: true, detail: "Supabase verifies signature + expiry server-side." },
            { label: "Is simulated role ADMIN?", ok: true, detail: "Role is controlled in sandbox via sim_role cookie." },
          ]}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <TokenViewer token={token} />
      </div>

      <div style={{ marginTop: 16 }} className="grid grid-2">
        <div className="card">
          <div className="h2">Call Admin API (valid token)</div>
          <p className="p">This should succeed only if your simulated role is ADMIN.</p>
          <hr className="sep" />
          <button className="btn primary" onClick={() => callAdminWithToken(false)}>Call /api/admin</button>
        </div>

        <div className="card">
          <div className="h2">Call Admin API (tampering demo)</div>
          <p className="p">We simulate sending an invalid token. Backend should reject it.</p>
          <hr className="sep" />
          <button className="btn danger" onClick={() => callAdminWithToken(true)}>Call with tampered token</button>
        </div>
      </div>

      <div style={{ marginTop: 16 }} className="grid grid-2">
        <AttackResult title="Result: Valid token call" result={adminCall} />
        <AttackResult title="Result: Tampered token call" result={tamperedCall} />
      </div>
    </main>
  );
}
