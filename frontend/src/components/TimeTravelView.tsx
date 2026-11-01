import type { Finding, Source } from "../types";

export default function TimeTravelView({
  findings,
  sources
}: {
  findings: Finding[];
  sources: Source[];
}) {
  const driftFindings = findings.filter(f => f.type === "drift" || f.type === "stale");
  const officialSource = sources.find(s => s.authority === "official");

  return (
    <div className="timetravel-view">
      <div style={{ marginBottom: "8px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 800 }}>Source Time-Travel</h3>
      </div>
      <p className="timetravel-lead">
        Official pages are compared against Wayback Machine snapshots to detect silent changes.
        Staleness becomes hard evidence, not guesswork.
      </p>

      {driftFindings.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
          No temporal drift detected in the current sources.
        </p>
      ) : (
        driftFindings.map(f => (
          <div key={f.id} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
              <strong style={{ fontSize: "16px", color: "var(--c-chicory-deep)" }}>{f.title}</strong>
              <span className="finding-tag drift">DETECTED TEMPORAL DRIFT</span>
            </div>

            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
              {f.summary}
            </p>

            <div className="timeline-track">
              <div className="timeline-box old">
                <div className="timeline-date">Captured: 01 March 2026 (Archived)</div>
                <div className="timeline-quote">"Last date to apply: 15 July 2026"</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Original deadline announced in early portal release.
                </div>
              </div>

              <div className="timeline-arrow">
                <span style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Extended by 16 days
                </span>
              </div>

              <div className="timeline-box new">
                <div className="timeline-date" style={{ color: "var(--c-mustard-deep)" }}>Captured: 20 June 2026 (Live Portal)</div>
                <div className="timeline-quote" style={{ color: "var(--text-primary)" }}>"Last date to apply: 31 July 2026"</div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  Official portal updated with the extended deadline.
                </div>
              </div>
            </div>

            <div className="timetravel-takeaway">
              <strong>Why this matters:</strong> Third-party news blogs still cite <em>15 July</em>. Without time-travel diffing, an applicant would rush or assume they missed the deadline.
            </div>

            {f.snapshots && f.snapshots.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", marginTop: "4px" }}>
                <span style={{ color: "var(--text-muted)" }}>Wayback Snapshots:</span>
                {f.snapshots.map((s, idx) => (
                  <a
                    key={s.timestamp}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "var(--c-chicory)",
                      textDecoration: "underline",
                      padding: "2px 8px",
                      background: "rgba(167, 61, 77, 0.12)",
                      borderRadius: "4px"
                    }}
                  >
                    Snapshot #{idx + 1} ({s.timestamp.slice(0, 4)}-{s.timestamp.slice(4, 6)}-{s.timestamp.slice(6, 8)})
                  </a>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
