import Link from "next/link";
import { getServerUser } from "@/lib/auth/serverUser";

/**
 * Simple server component navbar.
 * Shows different links depending on whether the user is logged in.
 */
export default async function Navbar() {
  const user = await getServerUser();

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 20, backdropFilter: "blur(10px)", background: "rgba(11,16,32,0.65)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, paddingTop: 14, paddingBottom: 14 }}>
        <div className="row">
          <Link href="/" className="row" style={{ gap: 10 }}>
            <span className="badge mono">AuthLab</span>
            <span style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Security Sandbox</span>
          </Link>
          <span className="badge">Next.js + Supabase</span>
        </div>

        <div className="row">
          <Link className="btn" href="/labs">Labs</Link>
          {user ? (
            <>
              <Link className="btn" href="/dashboard">Dashboard</Link>
              <Link className="btn" href="/auth/logout">Logout</Link>
            </>
          ) : (
            <>
              <Link className="btn" href="/auth/login">Login</Link>
              <Link className="btn primary" href="/auth/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
