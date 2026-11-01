import type { Area } from "../types";

const STATUS_CONFIG = {
  found: {
    className: "found",
    badgeClass: "found",
    badgeLabel: "Found & Sourced",
    hint: "Verified in reviewed sources"
  },
  partial: {
    className: "partial",
    badgeClass: "partial",
    badgeLabel: "Partly Sourced",
    hint: "Mentioned, but some details missing"
  },
  conflict: {
    className: "conflict",
    badgeClass: "conflict",
    badgeLabel: "Contradiction",
    hint: "Sources give disagreeing figures"
  },
  not_found: {
    className: "darkspot",
    badgeClass: "darkspot",
    badgeLabel: "Dark Spot (Missing)",
    hint: "CRITICAL: Not found in any reviewed source!"
  }
} as const;

export default function DarkSpotMap({
  areas,
  onPick
}: {
  areas: Area[];
  onPick: (a: Area) => void;
}) {
  return (
    <div className="radar-section">
      <div className="section-head">
        <div>
          <h3>Expectation Rubric & Dark Spot Grid</h3>
          <p>
            The system sets expectations of a complete answer before reading. Areas that stay dark are information blind spots.
          </p>
        </div>
        <div className="legend-row">
          <span className="legend-item"><span className="legend-dot found" /> Found</span>
          <span className="legend-item"><span className="legend-dot partial" /> Partial</span>
          <span className="legend-item"><span className="legend-dot conflict" /> Conflict</span>
          <span className="legend-item"><span className="legend-dot darkspot" /> Dark Spot</span>
        </div>
      </div>

      <div className="radar-grid" role="region" aria-label="Expectation rubric grid">
        {areas.map(a => {
          const cfg = STATUS_CONFIG[a.status] || STATUS_CONFIG.not_found;
          return (
            <div
              key={a.id}
              className={`radar-cell ${cfg.className}`}
              onClick={() => onPick(a)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onPick(a); }}
              title={`Click to inspect details for ${a.label}`}
            >
              <div>
                <div className="radar-cell-top">
                  <span className="radar-label">{a.label}</span>
                  <span className={`radar-badge ${cfg.badgeClass}`}>
                    <span className="radar-badge-dot" /> {cfg.badgeLabel}
                  </span>
                </div>
                <p className="radar-desc">{cfg.hint}</p>
              </div>

              <div className="radar-hint">
                <span>Click to inspect evidence</span>
                <span aria-hidden="true">→</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
