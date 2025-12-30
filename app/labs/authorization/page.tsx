"use client";

import { useState } from "react";
import RoleSwitcher from "@/components/RoleSwitcher";
import AttackResult from "@/components/AttackResult";
import DecisionFlow from "@/components/DecisionFlow";

export default function AuthorizationLabPage() {
  const [userApi, setUserApi] = useState<any>(null);
  const [adminApi, setAdminApi] = useState<any>(null);

  async function call(path: string, setter: (v: any) => void) {
  const res = await fetch(path);

  let data = {};
  try {
    data = await res.json();
  } catch {
    // response has no JSON body (expected for 401/403)
    data = {};
  }

  setter({
    ok: res.ok,
    status: res.status,
    ...data,
  });
}


  return (
    <main className="container">
      <div className="card">
        <h1 className="h1">Authorization Lab (RBAC)</h1>
        <p className="p">Goal: see how backend enforces roles even if frontend tries to bypass.</p>
      </div>

      
      <div style={{ marginTop: 16 }} className="grid grid-2">
        {/* LEFT: Explanation */}
        <div className="card">
          <div className="h2">What is Authorization?</div>

          <p className="p">
            Authorization decides <strong>what an authenticated user is allowed to do</strong>.
            Logging in proves <em>who you are</em>, but authorization controls <em>what you can access</em>.
          </p>

          <p className="p">
            This lab demonstrates <strong>Role-Based Access Control (RBAC)</strong>, where users
            are assigned roles such as <span className="mono">USER</span> or{" "}
            <span className="mono">ADMIN</span>. The backend checks these roles before allowing
            access to protected APIs.
          </p>

          <p className="p">
            Even if the frontend tries to bypass restrictions, the{" "}
            <strong>backend always enforces authorization rules</strong>. If the role does not
            match, the server returns <span className="mono">403 Forbidden</span>.
          </p>

          <ul className="p">
            <li><strong>401 Unauthorized</strong> → user is not logged in</li>
            <li><strong>403 Forbidden</strong> → user is logged in but lacks permission</li>
          </ul>
        </div>

        {/* RIGHT: Image */}
        <div className="card">
          <div className="h2">Authorization Flow</div>

          <img
            src="/images/authorization-rbac.png"
            alt="Role based authorization flow"
            style={{
              width: "100%",
              borderRadius: 6,
              marginTop: 8,
            }}
          />

          <p className="p" style={{ marginTop: 8 }}>
            The backend verifies the user's role before granting access.
            Frontend checks alone are never trusted.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 16 }} className="grid grid-2">
        <RoleSwitcher />
        <DecisionFlow
          title="Authorization Checklist"
          steps={[
            { label: "User is authenticated", ok: true, detail: "Protected endpoints require valid session." },
            { label: "Check required role", ok: true, detail: "Admin endpoints require ADMIN role." },
            { label: "Deny by default", ok: true, detail: "If role doesn't match, return 403." },
          ]}
        />
      </div>

      <div style={{ marginTop: 16 }} className="grid grid-2">
        <div className="card">
          <div className="h2">Call User API</div>
          <p className="p">Should succeed for both USER and ADMIN.</p>
          <hr className="sep" />
          <button className="btn primary" onClick={() => call("/api/protected", setUserApi)}>Call /api/protected</button>
        </div>
        <div className="card">
          <div className="h2">Call Admin API</div>
          <p className="p">Should succeed only if your simulated role is ADMIN.</p>
          <hr className="sep" />
          <button className="btn danger" onClick={() => call("/api/admin", setAdminApi)}>Call /api/admin</button>
        </div>
      </div>

      <div style={{ marginTop: 16 }} className="grid grid-2">
        <AttackResult title="User API result" result={userApi} />
        <AttackResult title="Admin API result" result={adminApi} />
      </div>
    </main>
  );
}
