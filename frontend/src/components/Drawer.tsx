import { useEffect, useRef } from "react";
import type { Claim, Finding, Source } from "../types";

export const TAG_LABELS: Record<Finding["type"], { label: string; icon: string; className: string }> = {
  gap: { label: "Dark Spot", icon: "", className: "gap" },
  conflict: { label: "Contradiction", icon: "", className: "conflict" },
  drift: { label: "Temporal Drift", icon: "", className: "drift" },
  echo: { label: "False Consensus", icon: "", className: "echo" },
  stale: { label: "Possibly Stale", icon: "", className: "drift" }
};

export function ConfidenceBadge({ c }: { c: Finding["confidence"] }) {
  const levels = { low: 1, med: 2, high: 3 }[c];
  const labels = { low: "Low Confidence Signal", med: "Medium Confidence Signal", high: "High Confidence Evidence" }[c];

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-secondary)" }}>
      <div style={{ display: "flex", gap: "3px" }}>
        {[1, 2, 3].map(i => (
          <span
            key={i}
            style={{
              width: "12px",
              height: "4px",
              borderRadius: "2px",
              background: i <= levels ? "var(--c-buffalo)" : "rgba(35, 11, 15, 0.15)"
            }}
          />
        ))}
      </div>
      <span>{labels}</span>
    </div>
  );
}

export default function Drawer({
  f,
  claims,
  sources,
  onClose,
  onGoToChecklist
}: {
  f: Finding;
  claims: Claim[];
  sources: Source[];
  onClose: () => void;
  onGoToChecklist?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    ref.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const tag = TAG_LABELS[f.type] || TAG_LABELS.conflict;
  const matchedClaims = f.claimIds
    .map(cid => claims.find(c => c.id === cid))
    .filter(Boolean) as Claim[];

  return (
    <div className="scrim" onClick={onClose} role="dialog" aria-modal="true">
      <aside className={`drawer t-${f.type}`} onClick={e => e.stopPropagation()}>
        <button ref={ref} className="drawer-close" onClick={onClose} aria-label="Close drawer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div>
          <span className={`finding-tag ${tag.className}`}>
            {tag.label}
          </span>
          <h2 style={{ fontSize: "24px", fontWeight: 800, marginTop: "12px", lineHeight: 1.25 }}>
            {f.title}
          </h2>
          <div style={{ marginTop: "8px" }}>
            <ConfidenceBadge c={f.confidence} />
          </div>
        </div>

        {/* The Problem / Summary */}
        <div className="drawer-section">
          <h4>What was detected</h4>
          <p style={{ fontSize: "14px", color: "var(--text-primary)", lineHeight: 1.6 }}>
            {f.summary}
          </p>
        </div>

        {/* Sourced Evidence */}
        {matchedClaims.length > 0 && (
          <div className="drawer-section">
            <h4>Extracted & Verified Evidence</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {matchedClaims.map(c => {
                const src = sources.find(s => s.id === c.sourceId);
                return (
                  <div key={c.id} style={{ background: "var(--c-beige-card)", padding: "14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <strong>{src?.title || "Unknown source"}</strong>
                      <span className={`source-authority ${src?.authority || "secondary"}`}>
                        {src?.authority || "source"}
                      </span>
                    </div>

                    <div className="quote-box">
                      "{c.quote}"
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
                      <span>
                        {c.date ? `Date: ${c.date}` : "Date: not stated"}
                      </span>
                      {c.verified ? (
                        <span className="verified-stamp">Verified verbatim</span>
                      ) : (
                        <span style={{ color: "var(--color-conflict)" }}>Unverified quote</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* If gap / no claims */}
        {matchedClaims.length === 0 && (
          <div className="drawer-section" style={{ borderLeft: "3px solid var(--c-chicory)" }}>
            <h4>Why is this a Dark Spot?</h4>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              This required topic was generated in the expectation rubric, but <strong>zero sources</strong> in your research dataset contain any mention or rule regarding it.
            </p>
          </div>
        )}

        {/* Suggested Action */}
        <div className="drawer-section" style={{ background: "rgba(242, 90, 26, 0.08)", border: "1px solid rgba(242, 90, 26, 0.28)" }}>
          <h4 style={{ color: "var(--c-buffalo)" }}>Recommended Action</h4>
          <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "14px" }}>
            {f.action}
          </p>

          {onGoToChecklist && (
            <button
              onClick={() => {
                onClose();
                onGoToChecklist();
              }}
              style={{
                background: "var(--c-buffalo)",
                color: "var(--c-beige)",
                fontWeight: 700,
                fontSize: "13px",
                padding: "8px 16px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                cursor: "pointer"
              }}
            >
              Open Verification Checklist
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
