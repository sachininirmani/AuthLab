"use client";

import { useEffect, useMemo, useState } from "react";
import AttackResult from "@/components/AttackResult";
import DecisionFlow from "@/components/DecisionFlow";

/**
 * NOTE: A true CSRF demo needs two origins (evil.com and app.com).
 * In a single deployed app, we simulate the browser decision:
 * - If SameSite=Strict, cookies would NOT be sent on cross-site requests.
 * - If SameSite=None, cookies WOULD be sent.
 *
 * The lab uses a simulated "origin" selector and shows the expected outcome.
 */
export default function CsrfLabPage() {
  const [sameSite, setSameSite] = useState<"Strict" | "Lax" | "None">("Lax");
  const [origin, setOrigin] = useState<"authlab.com" | "evil.com">("evil.com");
  const [attack, setAttack] = useState<any>(null);
  const [cookieInfo, setCookieInfo] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/simulate/cookies");
      setCookieInfo(await res.json());
    })();
  }, []);

  const cookieWouldSend = useMemo(() => {
    // Simplified rule:
    // - Strict: send only when same-site
    // - Lax: allow top-level navigations (not simulated), block most programmatic cross-site requests
    // - None: allow cross-site
    if (origin === "authlab.com") return true;
    if (sameSite === "None") return true;
    return false;
  }, [sameSite, origin]);

  async function runAttack() {
    // Call a simulated endpoint that behaves like a state-changing action.
    // We pass whether the cookie would have been sent (simulation).
    const res = await fetch("/api/simulate/csrf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origin, sameSite, cookieWouldSend }),
    });
    const data = await res.json();
    setAttack({ ok: res.ok, status: res.status, ...data });
  }

  return (
    <main className="container">
      <div className="card">
        <h1 className="h1">CSRF Lab</h1>
        <p className="p">
          Goal: understand how <b>cross-site requests</b> can abuse cookies, and how <b>SameSite</b> prevents this.
        </p>
      </div>

      <div style={{ marginTop: 16 }} className="grid grid-2">
        {/* LEFT: Explanation */}
        <div className="card">
          <div className="h2">What is CSRF?</div>

          <p className="p">
            <strong>Cross-Site Request Forgery (CSRF)</strong> is an attack where a malicious
            website tricks a user’s browser into sending a request to a trusted site
            where the user is already logged in.
          </p>

          <p className="p">
            Because browsers automatically send cookies with requests, the server may
            believe the request was intentionally made by the user — even when it was not.
          </p>

          <p className="p">
            Modern browsers defend against CSRF using the <strong>SameSite</strong> cookie
            attribute, which controls whether cookies are sent on cross-site requests.
          </p>

          <ul className="p">
            <li>
              <strong>SameSite=Strict</strong> → cookies sent only for same-site requests
            </li>
            <li>
              <strong>SameSite=Lax</strong> → limited cross-site sending (safe defaults)
            </li>
            <li>
              <strong>SameSite=None</strong> → cookies sent on all requests (highest risk)
            </li>
          </ul>

          <p className="p">
            In this lab, we simulate how the <strong>browser decides</strong> whether to send
            cookies before a request reaches the server.
          </p>
        </div>

        {/* RIGHT: Image */}
        <div className="card">
          <div className="h2">CSRF Flow</div>

          <img
            src="/images/csrf-samesite-flow.png"
            alt="CSRF attack and SameSite protection flow"
            style={{
              width: "100%",
              borderRadius: 6,
              marginTop: 8,
            }}
          />

          <p className="p" style={{ marginTop: 8 }}>
            The browser may block cookies on cross-site requests depending on the
            SameSite policy, preventing CSRF attacks.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 16 }} className="grid grid-2">
        <div className="card">
          <div className="h2">Simulation Controls</div>
          <p className="p">Pick request origin + SameSite policy, then run a CSRF attempt.</p>
          <hr className="sep" />
          <div className="row">
            <span className="badge">Origin</span>
            <button className={"btn " + (origin === "evil.com" ? "primary" : "")} onClick={() => setOrigin("evil.com")}>evil.com</button>
            <button className={"btn " + (origin === "authlab.com" ? "primary" : "")} onClick={() => setOrigin("authlab.com")}>authlab.com</button>
          </div>
          <div className="row" style={{ marginTop: 10 }}>
            <span className="badge">SameSite</span>
            {(["Strict","Lax","None"] as const).map(v => (
              <button key={v} className={"btn " + (sameSite === v ? "primary" : "")} onClick={() => setSameSite(v)}>{v}</button>
            ))}
          </div>
          <hr className="sep" />
          <div className="code">
            {JSON.stringify({
              cookieStoredForDomain: "authlab.com",
              requestOrigin: origin,
              sameSitePolicy: sameSite,
              cookieWouldSend
            }, null, 2)}
          </div>
          <hr className="sep" />
          <button className="btn danger" onClick={runAttack}>Simulate CSRF attempt</button>
        </div>

        <DecisionFlow
          title="Browser Decision (SameSite)"
          steps={[
            { label: "Is request cross-site?", ok: origin !== "authlab.com", detail: "Cross-site means request comes from a different site." },
            { label: "SameSite blocks cookie?", ok: !cookieWouldSend, detail: "If cookie is not sent, server can't treat it as logged-in." },
            { label: "Server receives session cookie?", ok: cookieWouldSend, detail: "If cookie is sent, CSRF may succeed (unless other defenses exist)." },
          ]}
        />
      </div>

      <div style={{ marginTop: 16 }} className="grid grid-2">
        <div className="card">
          <div className="h2">Server Cookie Snapshot</div>
          <p className="p">This shows current server-visible cookies (HttpOnly included).</p>
          <hr className="sep" />
          <div className="code">{JSON.stringify(cookieInfo ?? { note: "Loading..." }, null, 2)}</div>
        </div>
        <AttackResult title="Attack result" result={attack} />
      </div>
    </main>
  );
}
