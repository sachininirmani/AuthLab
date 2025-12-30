"use client";

import { useEffect, useState } from "react";
import AttackResult from "@/components/AttackResult";
import DecisionFlow from "@/components/DecisionFlow";

export default function CookiesLabPage() {
  const [info, setInfo] = useState<any>(null);
  const [jsRead, setJsRead] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/simulate/cookies");
      const data = await res.json();
      setInfo(data);
    })();
  }, []);

  async function tryReadCookieWithJs() {
    // In real apps, HttpOnly cookies cannot be read by JS.
    // We show what JS can/cannot see.
    const visible = document.cookie; // HttpOnly cookies won't appear here.
    setJsRead({
      ok: true,
      status: 200,
      reason: "document.cookie result",
      details: { documentCookie: visible || "(empty — HttpOnly cookies are hidden)" },
    });
  }

  return (
    <main className="container">
      <div className="card">
        <h1 className="h1">Cookies Lab</h1>
        <p className="p">Goal: understand cookie flags (HttpOnly / Secure / SameSite) and what browsers send automatically.</p>
      </div>

      <div style={{ marginTop: 16 }} className="grid grid-2">
        {/* LEFT: Explanation */}
        <div className="card">
          <div className="h2">What are Cookies?</div>

          <p className="p">
            Cookies are small pieces of data stored by the browser and automatically
            sent to the server with every request to the same site.
          </p>

          <p className="p">
            Modern authentication systems store session information or tokens inside
            cookies so that users do not need to log in again for every request.
          </p>

          <p className="p">
            Cookies can have special <strong>security flags</strong> that control how
            they behave and who can access them.
          </p>

          <ul className="p">
            <li>
              <strong>HttpOnly</strong> → blocks JavaScript access (protects from XSS)
            </li>
            <li>
              <strong>Secure</strong> → sent only over HTTPS (protects on the network)
            </li>
            <li>
              <strong>SameSite</strong> → controls cross-site sending (protects from CSRF)
            </li>
          </ul>

          <p className="p">
            In this lab, you will see what the <strong>server can read</strong> versus
            what <strong>JavaScript in the browser cannot</strong>.
          </p>
        </div>

        {/* RIGHT: Image */}
        <div className="card">
          <div className="h2">Cookie Flow</div>

          <img
            src="/images/cookie-flow.png"
            alt="Browser cookie flow with HttpOnly and SameSite"
            style={{
              width: "100%",
              borderRadius: 6,
              marginTop: 8,
            }}
          />

          <p className="p" style={{ marginTop: 8 }}>
            The browser automatically sends cookies to the backend.
            JavaScript access depends on cookie flags.
          </p>
        </div>
      </div>


      <div style={{ marginTop: 16 }} className="grid grid-2">
        <div className="card">
          <div className="h2">Server Cookie Inspector</div>
          <p className="p">This reads cookies on the server (route handler). Server can see HttpOnly cookies.</p>
          <hr className="sep" />
          <div className="code">{JSON.stringify(info ?? { note: "Loading..." }, null, 2)}</div>
        </div>

        <DecisionFlow
          title="Cookie Safety Rules"
          steps={[
            { label: "Cookies are stored in the browser", ok: true, detail: "They belong to a domain (site) and path." },
            { label: "HttpOnly blocks JavaScript access", ok: true, detail: "Mitigates XSS token theft." },
            { label: "Secure sends cookies only over HTTPS", ok: true, detail: "Protects on the network." },
            { label: "SameSite controls cross-site cookie sending", ok: true, detail: "Mitigates CSRF." },
          ]}
        />
      </div>

      <div style={{ marginTop: 16 }} className="grid grid-2">
        <div className="card">
          <div className="h2">Try reading cookies from JavaScript</div>
          <p className="p">Run <span className="mono">document.cookie</span>. HttpOnly cookies won't appear.</p>
          <hr className="sep" />
          <button className="btn primary" onClick={tryReadCookieWithJs}>Run document.cookie</button>
        </div>
        <AttackResult title="JS cookie read result" result={jsRead} />
      </div>
    </main>
  );
}
