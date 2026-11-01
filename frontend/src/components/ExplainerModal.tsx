export default function ExplainerModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <button className="drawer-close" onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "8px" }}>
          How It Works
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "28px", lineHeight: 1.6 }}>
          Conventional search and AI summaries only show what's written.
          ScholorYou reveals what scholarship sources contradict, what changed silently, and what's entirely missing.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div className="explainer-step">
            <div className="explainer-step__num" style={{ borderColor: "var(--c-chicory)", color: "var(--c-chicory)" }}>1</div>
            <div>
              <div className="explainer-step__title">Dark Spot Radar</div>
              <div className="explainer-step__desc">
                An expectation rubric is generated before reading sources. Areas absent from every source are flagged as dark spots.
              </div>
            </div>
          </div>

          <div className="explainer-step">
            <div className="explainer-step__num" style={{ borderColor: "var(--c-buffalo)", color: "var(--c-buffalo)" }}>2</div>
            <div>
              <div className="explainer-step__title">Source Time-Travel</div>
              <div className="explainer-step__desc">
                Official pages are diffed against Wayback Machine snapshots. Silent deadline or criteria changes become hard evidence.
              </div>
            </div>
          </div>

          <div className="explainer-step">
            <div className="explainer-step__num" style={{ borderColor: "var(--c-mustard-deep)", color: "var(--c-mustard-deep)" }}>3</div>
            <div>
              <div className="explainer-step__title">False Consensus Filter</div>
              <div className="explainer-step__desc">
                N-gram overlap detection uncovers copycat sources. Three blogs agreeing is not verification if two copied the first.
              </div>
            </div>
          </div>

          <div className="explainer-step">
            <div className="explainer-step__num" style={{ borderColor: "var(--c-chicory-deep)", color: "var(--c-chicory-deep)" }}>4</div>
            <div>
              <div className="explainer-step__title">Verified Contradictions</div>
              <div className="explainer-step__desc">
                Every quote is verified verbatim against original source text. Conflicting numbers are flagged with actionable next steps.
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: "28px",
            width: "100%",
            background: "var(--c-chicory)",
            color: "#F7F2D7",
            fontWeight: 700,
            fontSize: "13px",
            padding: "12px",
            borderRadius: "var(--radius-md)",
            border: "none",
            cursor: "pointer",
            letterSpacing: "0.04em"
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
