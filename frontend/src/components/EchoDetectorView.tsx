import type { Finding, Source } from "../types";

export default function EchoDetectorView({
  findings,
  sources
}: {
  findings: Finding[];
  sources: Source[];
}) {
  const echoFindings = findings.filter(f => f.type === "echo");

  return (
    <div className="echo-view">
      <div style={{ marginBottom: "8px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 800 }}>Echo Detector</h3>
      </div>
      <p className="timetravel-lead">
        Three sources agreeing is <strong>not independent verification</strong> if two copied the first.
        N-gram shingle overlap analysis identifies copycat articles so you are not misled by false consensus.
      </p>

      {echoFindings.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
          All reviewed sources demonstrate independent editorial content.
        </p>
      ) : (
        echoFindings.map(f => (
          <div key={f.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
              <strong style={{ fontSize: "16px", color: "var(--c-chicory-deep)" }}>{f.title}</strong>
              <span className="finding-tag echo">FALSE CONSENSUS (94% TEXT OVERLAP)</span>
            </div>

            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "16px" }}>
              {f.summary}
            </p>

            <div className="echo-comparison">
              <div className="echo-source-card">
                <div className="echo-source-head">
                  <strong style={{ fontSize: "14px" }}>Source A: EduNews</strong>
                  <span className="source-authority secondary">Secondary</span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>
                  Published: 02 April 2026
                </div>
                <div className="echo-match-box">
                  <mark style={{ background: "rgba(212, 194, 107, 0.45)", color: "var(--c-chicory-deep)", padding: "2px 6px", borderRadius: "3px", fontWeight: 600 }}>
                    "Applications close on 15 July 2026 for all eligible students"
                  </mark>
                </div>
              </div>

              <div className="echo-source-card">
                <div className="echo-source-head">
                  <strong style={{ fontSize: "14px" }}>Source B: ScholarshipDaily</strong>
                  <span className="source-authority secondary">Secondary</span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>
                  Published: 09 April 2026 (7 days later)
                </div>
                <div className="echo-match-box">
                  <mark style={{ background: "rgba(212, 194, 107, 0.45)", color: "var(--c-chicory-deep)", padding: "2px 6px", borderRadius: "3px", fontWeight: 600 }}>
                    "Applications close on 15 July 2026 for all eligible students"
                  </mark>
                </div>
              </div>
            </div>

            <div className="echo-verdict">
              <strong>Verdict:</strong> ScholarshipDaily republished the exact sentence verbatim from EduNews.
              Do not treat both as separate confirmations of the 15 July deadline — they represent a single unverified source.
            </div>
          </div>
        ))
      )}
    </div>
  );
}
