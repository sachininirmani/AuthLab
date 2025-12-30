import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container">
      <div className="card">
        <h1 className="h1">AuthLab</h1>
        <p className="p">
          An interactive learning sandbox to understand <b>authentication</b>, <b>authorization</b>, <b>JWT</b>,
          <b> cookies</b>, <b>CSRF</b>, and a beginner-friendly <b>threat model</b>.
          Learners can safely simulate roles and see why requests are allowed or blocked.
        </p>
        <hr className="sep" />
        <div className="row">
          <Link className="btn primary" href="/labs">Open Labs</Link>
          <Link className="btn" href="/auth/register">Create account</Link>
          <Link className="btn" href="/auth/login">Login</Link>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="h2">Learn by breaking</div>
          <p className="p">Try token tampering, replay attempts, and CSRF simulations — then see exactly why they fail.</p>
        </div>
        <div className="card">
          <div className="h2">Real mechanisms</div>
          <p className="p">Uses Supabase Auth (real login, real tokens) and Next.js middleware (real enforcement).</p>
        </div>
        <div className="card">
          <div className="h2">Interactive Labs</div>
          <p className="p">Experiment with authentication flows, token tampering, CSRF attacks, and authorization checks in a safe, hands-on sandbox.</p>
        </div>
      </div>
    </main>
  );
}
