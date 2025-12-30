"use client";

export default function AttackResult({ title, result }: { title: string; result: any }) {
  const ok = Boolean(result?.ok);
  return (
    <div className="card">
      <div className="h2">{title}</div>
      <p className="p">This panel shows the request result and the backend reason.</p>
      <hr className="sep" />
      <div className="row">
        <span className={"badge mono"} style={{ borderColor: ok ? "rgba(45,212,191,0.35)" : "rgba(255,107,107,0.35)" }}>
          {ok ? "SUCCESS" : "BLOCKED"}
        </span>
        {result?.status ? <span className="badge">HTTP {result.status}</span> : null}
        {result?.reason ? <span className="badge">{result.reason}</span> : null}
      </div>
      <hr className="sep" />
      <div className="code">{JSON.stringify(result ?? { note: "Run an action to see results." }, null, 2)}</div>
    </div>
  );
}
