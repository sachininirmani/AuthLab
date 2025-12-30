import Link from "next/link";
import { getServerUser } from "@/lib/auth/serverUser";

export default async function DashboardPage() {
  const user = await getServerUser();

  return (
    <main className="container">
      <div className="card">
        <h1 className="h1">Dashboard</h1>
        <p className="p">
          {user ? (
            <>Logged in as <span className="mono">{user.email}</span>.</>
          ) : (
            <>You are not logged in. Please login to use protected labs.</>
          )}
        </p>
        <hr className="sep" />
        <div className="row">
          <Link className="btn primary" href="/labs">Open Labs</Link>
          <Link className="btn" href="/labs/threat-model">Threat Model</Link>
          <Link className="btn" href="/admin">Admin Panel</Link>
        </div>
      </div>
    </main>
  );
}
