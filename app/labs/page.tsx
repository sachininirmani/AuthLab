import Link from "next/link";

const labs = [
  {
    href: "/labs/hashing-encryption",
    title: "Hashing vs Encryption",
    desc: "Where hashing & encryption fit, and why passwords are hashed.",
  },
  {
    href: "/labs/jwt",
    title: "JWT Lab",
    desc: "Decode token, attempt tampering, see why signature blocks it.",
  },
  {
    href: "/labs/cookies",
    title: "Cookies Lab",
    desc: "HttpOnly, Secure, SameSite — how browser rules affect security.",
  },
  {
    href: "/labs/authorization",
    title: "Authorization Lab",
    desc: "Role-based access control (USER vs ADMIN) with a safe role simulator.",
  },
  {
    href: "/labs/csrf",
    title: "CSRF Lab",
    desc: "See how cross-site requests abuse cookies, and how SameSite blocks it.",
  },
  {
    href: "/labs/threat-model",
    title: "Threat Model",
    desc: "Attacker actions → defenses → why they fail.",
  },
];


export default function LabsPage() {
  return (
    <main className="container">
      <div className="card">
        <h1 className="h1">Labs</h1>
        <p className="p">Pick a lab. Each lab includes (1) concept explanation, (2) interactive actions, (3) a decision flow that reveals the backend logic.</p>
      </div>

      <div className="grid grid-3" style={{ marginTop: 16 }}>
        {labs.map((l) => (
          <Link key={l.href} href={l.href} className="card" style={{ display: "block" }}>
            <div className="h2">{l.title}</div>
            <p className="p">{l.desc}</p>
            <hr className="sep" />
            <span className="btn">Open</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
