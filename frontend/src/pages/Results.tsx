import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getResult } from "../api/client";
import type { Finding, Result, Source } from "../types";
import DarkSpotMap from "../components/DarkSpotMap";
import Drawer, { ConfidenceBadge, TAG_LABELS } from "../components/Drawer";
import TimeTravelView from "../components/TimeTravelView";
import EchoDetectorView from "../components/EchoDetectorView";

type TabType = "overview" | "timetravel" | "echo" | "checklist" | "sources";

export default function Results() {
  const { id = "" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") as TabType | null;
  const [resultData, setResultData] = useState<{ data: Result; sample: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>(tabParam || "overview");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [inspectFinding, setInspectFinding] = useState<Finding | null>(null);

  useEffect(() => {
    if (tabParam && ["overview", "timetravel", "echo", "checklist", "sources"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabSelect = (t: TabType) => {
    setActiveTab(t);
    setSearchParams({ tab: t });
  };

  useEffect(() => {
    setLoading(true);
    getResult(id)
      .then(setResultData)
      .finally(() => setLoading(false));
  }, [id]);

  const findings = resultData?.data.findings ?? [];
  const rubric = resultData?.data.rubric ?? [];
  const sources = resultData?.data.sources ?? [];
  const claims = resultData?.data.claims ?? [];
  const checklist = resultData?.data.checklist ?? [];

  // Filtered findings for the overview tab
  const filteredFindings = useMemo(() => {
    if (!filterType) return findings;
    return findings.filter(f => f.type === filterType);
  }, [findings, filterType]);

  const counts = useMemo(() => {
    return {
      conflicts: findings.filter(f => f.type === "conflict").length,
      drift: findings.filter(f => f.type === "drift" || f.type === "stale").length,
      echo: findings.filter(f => f.type === "echo").length,
      gaps: findings.filter(f => f.type === "gap").length,
      okSources: sources.filter(s => s.status === "ok").length,
      failedSources: sources.filter(s => s.status === "failed")
    };
  }, [findings, sources]);

  if (loading) {
    return (
      <section className="wrap" style={{ textAlign: "center", padding: "140px 20px" }}>
        <div className="brand-dot" style={{ margin: "0 auto 16px", width: "12px", height: "12px" }} />
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-secondary)" }}>Analyzing…</h2>
      </section>
    );
  }

  if (!resultData) {
    return (
      <section className="wrap" style={{ textAlign: "center", padding: "140px 20px" }}>
        <h2 style={{ fontSize: "18px", color: "var(--color-conflict)", fontWeight: 700 }}>Could not load analysis</h2>
        <p style={{ color: "var(--text-secondary)", margin: "12px 0 24px", fontSize: "14px" }}>
          The session could not be retrieved.
        </p>
        <Link to="/results/demo" className="nav-btn primary">Load demo →</Link>
      </section>
    );
  }

  const { data, sample } = resultData;

  return (
    <section className="wrap">
      {/* Dashboard Header */}
      <div className="dash-header">
        <div className="dash-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="brand-dot" />
            <span style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>
              Research Intelligence Dashboard
            </span>
            {sample && <span className="badge-demo">Sample Scholarship Case</span>}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <Link to={`/results/${id}/checklist`} className="nav-btn primary">
              Open Full Checklist ({checklist.length})
            </Link>
            <Link to="/" className="nav-btn">
              + New Question
            </Link>
          </div>
        </div>

        <h1 className="dash-question">
          {data.question}
        </h1>
      </div>

      {/* High-Level Stat Metrics */}
      <div className="metrics-strip">
        <div className="metric-card darkspot">
          <span className="label">Dark Spots</span>
          <span className="value">{counts.gaps}</span>
        </div>

        <div className="metric-card conflict">
          <span className="label">Contradictions</span>
          <span className="value">{counts.conflicts}</span>
        </div>

        <div className="metric-card drift">
          <span className="label">Drift</span>
          <span className="value">{counts.drift}</span>
        </div>

        <div className="metric-card echo">
          <span className="label">Echo</span>
          <span className="value">{counts.echo}</span>
        </div>

        <div className="metric-card sources">
          <span className="label">Sources</span>
          <span className="value">{counts.okSources}<span style={{ fontSize: "13px", opacity: 0.55 }}>/{sources.length}</span></span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="tabs-nav" role="tablist">
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => handleTabSelect("overview")}
          role="tab"
          aria-selected={activeTab === "overview"}
        >
          <span>Radar &amp; Findings</span>
          <span className="tab-badge">{findings.length}</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "timetravel" ? "active" : ""}`}
          onClick={() => handleTabSelect("timetravel")}
          role="tab"
          aria-selected={activeTab === "timetravel"}
        >
          <span>Time-Travel</span>
          <span className="tab-badge" style={{ background: "rgba(212, 194, 107, 0.25)", color: "var(--c-mustard-deep)" }}>
            {counts.drift}
          </span>
        </button>

        <button
          className={`tab-btn ${activeTab === "echo" ? "active" : ""}`}
          onClick={() => handleTabSelect("echo")}
          role="tab"
          aria-selected={activeTab === "echo"}
        >
          <span>Echo Detector</span>
          <span className="tab-badge" style={{ background: "rgba(242, 90, 26, 0.2)", color: "var(--c-buffalo)" }}>
            {counts.echo}
          </span>
        </button>

        <button
          className={`tab-btn ${activeTab === "checklist" ? "active" : ""}`}
          onClick={() => handleTabSelect("checklist")}
          role="tab"
          aria-selected={activeTab === "checklist"}
        >
          <span>Checklist</span>
          <span className="tab-badge" style={{ background: "rgba(167, 61, 77, 0.2)", color: "var(--c-chicory)" }}>
            {checklist.length}
          </span>
        </button>

        <button
          className={`tab-btn ${activeTab === "sources" ? "active" : ""}`}
          onClick={() => handleTabSelect("sources")}
          role="tab"
          aria-selected={activeTab === "sources"}
        >
          <span>Sources</span>
          <span className="tab-badge">{sources.length}</span>
        </button>
      </nav>

      {/* TAB CONTENT 1: OVERVIEW & RADAR */}
      {activeTab === "overview" && (
        <div>
          {/* Dark Spot 2D Grid */}
          <DarkSpotMap
            areas={rubric}
            onPick={area => {
              const matched = findings.find(f => f.areaId === area.id);
              if (matched) {
                setInspectFinding(matched);
              }
            }}
          />

          {/* Findings Filter & List */}
          <div style={{ marginTop: "40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: 700 }}>
                Findings
              </h3>

              {/* Filter chips */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[
                  { id: null, label: "All" },
                  { id: "conflict", label: "Conflict" },
                  { id: "drift", label: "Drift" },
                  { id: "echo", label: "Echo" },
                  { id: "gap", label: "Dark Spot" }
                ].map(opt => (
                  <button
                    key={opt.label}
                    onClick={() => setFilterType(opt.id)}
                    style={{
                      background: filterType === opt.id ? "var(--c-chicory-deep)" : "var(--c-beige-card)",
                      color: filterType === opt.id ? "var(--c-beige)" : "var(--text-secondary)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: 600,
                      padding: "6px 14px",
                      cursor: "pointer",
                      transition: "var(--transition)"
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="findings-container">
              {filteredFindings.map(f => {
                const tag = TAG_LABELS[f.type] || TAG_LABELS.conflict;
                return (
                  <div
                    key={f.id}
                    className={`finding-card t-${f.type}`}
                    onClick={() => setInspectFinding(f)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setInspectFinding(f); }}
                  >
                    <div className="finding-card-header">
                      <span className={`finding-tag ${tag.className}`}>
                        {tag.icon} {tag.label}
                      </span>
                      <span className="finding-priority">
                        Priority: <strong style={{ color: f.priority === "critical" ? "var(--color-conflict)" : "var(--text-primary)" }}>{f.priority}</strong>
                      </span>
                    </div>

                    <div className="finding-title">
                      {f.title}
                    </div>

                    <div className="finding-summary">
                      {f.summary}
                    </div>

                    <div className="finding-footer">
                      <ConfidenceBadge c={f.confidence} />
                      <span style={{ color: "var(--c-buffalo)", fontWeight: 700 }}>
                        Inspect verified evidence →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: TIME-TRAVEL */}
      {activeTab === "timetravel" && (
        <TimeTravelView findings={findings} sources={sources} />
      )}

      {/* TAB CONTENT 3: ECHO DETECTOR */}
      {activeTab === "echo" && (
        <EchoDetectorView findings={findings} sources={sources} />
      )}

      {/* TAB CONTENT 4: CHECKLIST PREVIEW */}
      {activeTab === "checklist" && (
        <div className="checklist-view">
          <div className="checklist-actions-bar">
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 800 }}>Pre-Application Verification Checklist</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                Resolve these critical discrepancies before submitting your scholarship form.
              </p>
            </div>
            <Link to={`/results/${id}/checklist`} className="nav-btn primary">
              Open Full Checklist Screen →
            </Link>
          </div>

          <ul className="checklist-items">
            {checklist.map(item => (
              <li key={item.id} className="checklist-item">
                <input
                  type="checkbox"
                  className="check-input"
                  defaultChecked={item.done}
                  aria-label={item.text}
                />
                <div className="checklist-content">
                  <div className="checklist-title">
                    <span style={{ color: item.priority === "critical" ? "var(--color-conflict)" : "var(--color-partial)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginRight: "8px" }}>
                      [{item.priority}]
                    </span>
                    {item.text}
                  </div>
                  <div className="checklist-why">
                    {item.why}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* TAB CONTENT 5: SOURCES */}
      {activeTab === "sources" && (
        <div className="sources-grid">
          {sources.map(s => (
            <div key={s.id} className={`source-card ${s.status === "failed" ? "failed" : ""}`}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className={`source-authority ${s.authority}`}>
                  {s.authority} Source
                </span>
                <span style={{ fontSize: "12px", color: s.status === "failed" ? "var(--color-conflict)" : "var(--color-found)" }}>
                  {s.status === "ok" ? "Extracted (200 OK)" : "Failed"}
                </span>
              </div>

              <strong style={{ fontSize: "15px", color: "var(--text-primary)" }}>
                {s.title}
              </strong>

              <div style={{ fontSize: "12px", color: "var(--text-muted)", wordBreak: "break-all" }}>
                <a href={s.url} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
                  {s.url}
                </a>
              </div>

              {s.date && (
                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  Document date: {s.date}
                </div>
              )}

              {s.error && (
                <div style={{ fontSize: "12px", color: "var(--color-conflict)", background: "rgba(244, 63, 94, 0.1)", padding: "8px", borderRadius: "4px" }}>
                  Error: {s.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Inspect Finding Drawer */}
      {inspectFinding && (
        <Drawer
          f={inspectFinding}
          claims={claims}
          sources={sources}
          onClose={() => setInspectFinding(null)}
          onGoToChecklist={() => setActiveTab("checklist")}
        />
      )}
    </section>
  );
}
