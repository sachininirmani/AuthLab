"use client";

type Step = { label: string; ok: boolean; detail?: string };

export default function DecisionFlow({ title, steps }: { title: string; steps: Step[] }) {
  return (
    <div className="card">
      <div className="h2">{title}</div>
      <div className="p">This panel explains the system decision step-by-step (like a backend checklist).</div>
      <hr className="sep" />
      <div className="grid" style={{ gap: 10 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: 10, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}>
            <div className="mono" style={{ minWidth: 26, textAlign: "center", borderRadius: 10, padding: "4px 6px", background: s.ok ? "rgba(45,212,191,0.18)" : "rgba(255,107,107,0.18)", border: s.ok ? "1px solid rgba(45,212,191,0.28)" : "1px solid rgba(255,107,107,0.28)" }}>
              {s.ok ? "✓" : "✗"}
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{s.label}</div>
              {s.detail ? <div className="p" style={{ marginTop: 2 }}>{s.detail}</div> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
