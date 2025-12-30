"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import Link from "next/link";

export default function RegisterPage() {
  const supabase = supabaseBrowser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("Creating account...");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMsg("❌ " + error.message);
    else setMsg("✅ Account created. Now login.");
  }

  return (
    <main className="container">
      <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
        <h1 className="h1">Register</h1>
        <p className="p">
          This is a learning app. Use any email you own. (If email confirmations are enabled in Supabase, you may need to confirm.)
        </p>
        <hr className="sep" />
        <form onSubmit={onSubmit} className="grid" style={{ gap: 10 }}>
          <label className="p">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required
            style={{ padding: 10, borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.25)", color: "white" }}
          />
          <label className="p">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
            style={{ padding: 10, borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.25)", color: "white" }}
          />
          <button className="btn primary" type="submit">Create account</button>
        </form>
        {msg ? <p className="p" style={{ marginTop: 10 }}>{msg}</p> : null}
        <hr className="sep" />
        <div className="row">
          <Link className="btn" href="/auth/login">Go to login</Link>
          <Link className="btn" href="/labs">Browse labs</Link>
        </div>
      </div>
    </main>
  );
}
