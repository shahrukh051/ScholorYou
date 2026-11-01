import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import type { Source } from "../types";
import { useAnalysisStream } from "../hooks/useAnalysisStream";

const STAGES = [
  { name: "Extracting", label: "Extracting readable text & metadata" },
  { name: "Rubric", label: "Generating expectations rubric" },
  { name: "Claims", label: "Extracting atomic claims" },
  { name: "Verifying quotes", label: "Verifying quotes verbatim against text" },
  { name: "Conflicts", label: "Detecting contradictions & dark spots" },
  { name: "Time-Travel", label: "Checking Wayback Machine diffs" },
  { name: "Echo", label: "Analyzing text overlap for false consensus" },
  { name: "Checklist", label: "Synthesizing actionable checklist" }
];

const PREFILL_SOURCES = [
  "https://scholarships.example.gov.in/eligibility",
  "https://edunews.example.com/merit-2026",
  "https://scholarshipdaily.example.com/merit"
];

export default function Workspace() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const [sources, setSources] = useState<Source[]>([]);
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);

  const events = useAnalysisStream(id, isRunning);
  const lastEvent = (stageName: string) => [...events].reverse().find(e => e.stage === stageName);
  const failedEvent = events.find(e => e.status === "failed");

  useEffect(() => {
    if (lastEvent("Checklist")?.status === "done") {
      nav(`/results/${id}`);
    }
  }, [events, id, nav]);

  const handleAddUrl = async (customUrl?: string) => {
    const targetUrl = (customUrl || url).trim();
    if (!targetUrl) return;
    setErr("");
    setLoadingAdd(true);
    try {
      const s = await api.addUrl(id, targetUrl);
      setSources(prev => [...prev, s]);
      if (!customUrl) setUrl("");
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoadingAdd(false);
    }
  };

  const handlePrefill = async () => {
    for (const u of PREFILL_SOURCES) {
      await handleAddUrl(u);
    }
  };

  const handleStartAnalysis = async () => {
    setErr("");
    try {
      setIsRunning(true);
      await api.analyze(id);
    } catch (e) {
      setIsRunning(false);
      setErr((e as Error).message);
    }
  };

  const okCount = sources.filter(s => s.status === "ok").length;

  return (
    <section className="wrap">
      <div className="workspace-card">
        {/* Stepper */}
        <div className="stepper">
          <div className="step-item done">
            <div className="step-circle">1</div>
            <span style={{ fontSize: "12px", fontWeight: 600 }}>1. Question</span>
          </div>
          <div className={`step-item ${isRunning ? "done" : "active"}`}>
            <div className="step-circle">2</div>
            <span style={{ fontSize: "12px", fontWeight: 600 }}>2. Sources</span>
          </div>
          <div className={`step-item ${isRunning ? "active" : ""}`}>
            <div className="step-circle">3</div>
            <span style={{ fontSize: "12px", fontWeight: 600 }}>3. Analysis</span>
          </div>
        </div>

        <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "8px" }}>
          Add your research sources
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
          Provide the URLs or documents you are relying on. ScholorYou will cross-examine them for gaps and conflicts.
        </p>

        {/* URL Input */}
        <div className="ask-box" style={{ maxWidth: "100%", margin: "0 0 16px" }}>
          <input
            className="ask-input"
            aria-label="Source URL"
            placeholder="https://official-portal.gov.in/policy or news article URL..."
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAddUrl()}
            disabled={isRunning || loadingAdd}
          />
          <button
            className="ask-submit"
            onClick={() => handleAddUrl()}
            disabled={!url.trim() || isRunning || loadingAdd}
          >
            {loadingAdd ? "Adding..." : "+ Add Source"}
          </button>
        </div>

        {/* Quick Demo Pre-fill */}
        {sources.length === 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", margin: "12px 0 24px" }}>
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Need test sources quickly?
            </span>
            <button
              onClick={handlePrefill}
              style={{
                background: "rgba(212, 194, 107, 0.20)",
                color: "var(--c-mustard-deep)",
                border: "1px solid rgba(212, 194, 107, 0.45)",
                padding: "6px 14px",
                borderRadius: "var(--radius-sm)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Fill 3 Sample Sources
            </button>
          </div>
        )}

        {err && (
          <p role="alert" style={{ color: "var(--color-conflict)", margin: "12px 0", fontSize: "14px" }}>
            {err}
          </p>
        )}

        {/* Sources List */}
        {sources.length > 0 && (
          <div style={{ margin: "24px 0" }}>
            <h4 style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "12px" }}>
              Sources Added ({sources.length})
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {sources.map(s => (
                <div
                  key={s.id}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    padding: "12px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px"
                  }}
                >
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {s.title || s.url}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      {s.url}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                    <span className={`source-authority ${s.authority}`}>
                      {s.authority}
                    </span>
                    <span style={{ fontSize: "12px", color: s.status === "failed" ? "var(--color-conflict)" : "var(--color-found)" }}>
                      {s.status === "ok" ? "Extracted" : s.status}
                    </span>
                    {!isRunning && (
                      <button
                        onClick={() => {
                          api.remove(id, s.id);
                          setSources(p => p.filter(x => x.id !== s.id));
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--text-muted)",
                          cursor: "pointer",
                          fontSize: "14px"
                        }}
                        title="Remove source"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Run Analysis Action */}
        <div style={{ marginTop: "32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
          <button
            onClick={handleStartAnalysis}
            disabled={!okCount || isRunning}
            style={{
              background: okCount && !isRunning ? "linear-gradient(135deg, var(--c-buffalo) 0%, var(--c-buffalo-dark) 100%)" : "rgba(35, 11, 15, 0.08)",
              color: okCount && !isRunning ? "var(--c-beige)" : "var(--text-muted)",
              fontWeight: 700,
              fontSize: "15px",
              padding: "14px 28px",
              borderRadius: "var(--radius-md)",
              border: "none",
              cursor: okCount && !isRunning ? "pointer" : "not-allowed"
            }}
          >
            {isRunning ? "Running Multi-Stage Analysis..." : "Run Analysis →"}
          </button>

          <Link to="/results/demo" style={{ fontSize: "13px", color: "var(--text-secondary)", textDecoration: "underline" }}>
            Or view pre-computed demo results
          </Link>
        </div>

        {/* Live Stages Display */}
        {isRunning && (
          <div style={{ marginTop: "32px", borderTop: "1px solid var(--border-subtle)", paddingTop: "24px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px" }}>
              Analysis Pipeline in Progress:
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {STAGES.map(s => {
                const ev = lastEvent(s.name);
                const isDone = ev?.status === "done";
                const isRunningStage = ev?.status === "running";
                const isFailed = ev?.status === "failed";

                return (
                  <div
                    key={s.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: "var(--radius-sm)",
                      background: isRunningStage ? "rgba(242, 90, 26, 0.10)" : "rgba(35, 11, 15, 0.03)",
                      border: isRunningStage ? "1px solid rgba(242, 90, 26, 0.35)" : "1px solid transparent"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{
                        display: "inline-block",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: isDone ? "var(--color-found)" : isFailed ? "var(--color-conflict)" : isRunningStage ? "var(--c-buffalo)" : "var(--border-subtle)"
                      }} />
                      <strong style={{ fontSize: "13px", color: isDone ? "var(--text-primary)" : "var(--text-secondary)" }}>
                        {s.name}
                      </strong>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        — {s.label}
                      </span>
                    </div>

                    {ev?.detail && (
                      <span style={{ fontSize: "12px", color: "var(--c-buffalo)" }}>
                        {ev.detail}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {failedEvent && (
          <div style={{ marginTop: "20px", padding: "14px", background: "rgba(167, 61, 77, 0.15)", border: "1px solid rgba(167, 61, 77, 0.35)", borderRadius: "var(--radius-md)", color: "var(--c-chicory)", fontSize: "14px" }}>
            <strong>Analysis error:</strong> {failedEvent.detail}
          </div>
        )}
      </div>
    </section>
  );
}
