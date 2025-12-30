"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const supabase = supabaseBrowser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("Signing in...");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMsg("❌ " + error.message);
    } else {
      setMsg("✅ Signed in. Go to Dashboard.");
    }
  }

  return (
    <main className="container">
      <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
        <h1 className="h1">Login</h1>
        <p className="p">Use your email/password. Supabase Auth handles password hashing securely.</p>
        <hr className="sep" />
        <form onSubmit={onSubmit} className="grid" style={{ gap: 10 }}>
          <label className="p">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required
            style={{ padding: 10, borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.25)", color: "white" }}
          />
          <label className="p">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            style={{ padding: 10, borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.25)", color: "white" }}
          />
          <button className="btn primary" type="submit">Sign in</button>
        </form>
        {msg ? <p className="p" style={{ marginTop: 10 }}>{msg}</p> : null}
        <hr className="sep" />
        <div className="row">
          <Link className="btn" href="/dashboard">Dashboard</Link>
          <Link className="btn" href="/auth/register">Create account</Link>
        </div>
      </div>
    </main>
  );
}
