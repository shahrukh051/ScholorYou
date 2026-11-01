import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, getResult } from "../api/client";
import type { Item } from "../types";

export default function Checklist() {
  const { id = "" } = useParams();
  const [items, setItems] = useState<Item[] | null>(null);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    getResult(id).then(r => setItems(r.data.checklist));
  }, [id]);

  if (!items) {
    return (
      <section className="wrap" style={{ textAlign: "center", padding: "100px 20px" }}>
        <p style={{ color: "var(--text-secondary)" }}>Loading verification checklist...</p>
      </section>
    );
  }

  const toggleItem = (k: string) => {
    setItems(prev =>
      prev!.map(i => {
        if (i.id === k) {
          const next = !i.done;
          api.toggle(id, k, next);
          return { ...i, done: next };
        }
        return i;
      })
    );
  };

  const copyMarkdown = () => {
    const md = items
      .map(i => `- [${i.done ? "x" : " "}] **(${i.priority.toUpperCase()})** ${i.text}\n  *Why:* ${i.why}`)
      .join("\n\n");
    navigator.clipboard.writeText(md).then(() => {
      setNotification("Copied checklist as Markdown to clipboard.");
      setTimeout(() => setNotification(""), 3000);
    });
  };

  const doneCount = items.filter(i => i.done).length;
  const progressPercent = Math.round((doneCount / items.length) * 100);

  return (
    <section className="wrap">
      <div className="checklist-view">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span className="brand-dot" />
              <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>
                Actionable Verification Checklist
              </span>
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: 800 }}>
              {doneCount} of {items.length} Actions Verified
            </h1>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button onClick={copyMarkdown} className="nav-btn primary">
              Copy as Markdown
            </button>
            <button onClick={() => window.print()} className="nav-btn">
              Print / PDF
            </button>
            <Link to={`/results/${id}`} className="nav-btn">
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "20px 0 28px" }}>
          <div className="progress-track" style={{ flex: 1, maxWidth: "100%" }}>
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-secondary)" }}>
            {progressPercent}% Complete
          </span>
        </div>

        {notification && (
          <div style={{ background: "rgba(212, 194, 107, 0.22)", border: "1px solid rgba(212, 194, 107, 0.45)", color: "var(--c-mustard-deep)", fontWeight: 600, padding: "10px 16px", borderRadius: "var(--radius-sm)", marginBottom: "20px", fontSize: "14px" }}>
            {notification}
          </div>
        )}

        {/* Priority Groups */}
        {(["critical", "important", "optional"] as const).map(priority => {
          const group = items.filter(i => i.priority === priority);
          if (group.length === 0) return null;

          const color =
            priority === "critical"
              ? "var(--color-conflict)"
              : priority === "important"
              ? "var(--color-partial)"
              : "var(--text-muted)";

          return (
            <div key={priority} className="checklist-group">
              <div className="checklist-group-title">
                <span style={{ color }}>●</span>
                <span style={{ color }}>{priority} Actions ({group.length})</span>
              </div>

              <ul className="checklist-items">
                {group.map(item => (
                  <li
                    key={item.id}
                    className={`checklist-item ${item.done ? "done" : ""}`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <input
                      type="checkbox"
                      className="check-input"
                      checked={item.done}
                      onChange={() => {}} /* Handled by parent li */
                      aria-label={item.text}
                    />
                    <div className="checklist-content">
                      <div className="checklist-title">
                        {item.text}
                      </div>
                      <div className="checklist-why">
                        <strong>Why:</strong> {item.why}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
