"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import Link from "next/link";

export default function LogoutPage() {
  const supabase = supabaseBrowser();
  const [msg, setMsg] = useState("Logging out...");

  useEffect(() => {
    (async () => {
      await supabase.auth.signOut();
      // also clear simulated role cookie (server-side)
      await fetch("/api/simulate/role", { method: "DELETE" });
      setMsg("✅ Logged out.");
    })();
  }, []);

  return (
    <main className="container">
      <div className="card" style={{ maxWidth: 600, margin: "0 auto" }}>
        <h1 className="h1">Logout</h1>
        <p className="p">{msg}</p>
        <hr className="sep" />
        <div className="row">
          <Link className="btn" href="/">Home</Link>
          <Link className="btn primary" href="/auth/login">Login again</Link>
        </div>
      </div>
    </main>
  );
}
