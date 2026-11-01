import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import IntakeForm from "../components/IntakeForm";

const SAMPLE_QUESTIONS = [
  "Am I eligible for the State Merit Scholarship 2026?",
  "Central Sector Scholarship cutoff percentiles by board and course",
  "Post-Matric OBC fee reimbursement income criteria and hostel rules",
];

export default function Landing() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [showIntake, setShowIntake] = useState(false);

  const startIntake = (question: string) => {
    const finalQ = question.trim() || q.trim() || "Am I eligible for the State Merit Scholarship 2026?";
    setQ(finalQ);
    setShowIntake(true);
  };

  const handleAnalyzeClick = () => {
    if (q.trim()) {
      startIntake(q);
    } else {
      navigate("/eligibility");
    }
  };

  if (showIntake) {
    return (
      <IntakeForm
        initialQuestion={q}
        onBack={() => setShowIntake(false)}
      />
    );
  }

  return (
    <section className="hero wrap">
      {/* Official ScholorYou Logo Banner */}
      <div className="hero-logo-banner">
        <img src="/scholoryou-mark-trans.png" alt="ScholorYou" className="hero-logo-icon" />
        <span className="hero-brand-name">
          <span className="brand-scholor">Scholor</span>
          <span className="brand-you">You</span>
        </span>
        <span style={{ fontSize: "10.5px", color: "rgba(212, 194, 107, 0.9)", fontWeight: 700, letterSpacing: "0.08em" }}>
          AI SCHOLARSHIP INTELLIGENCE
        </span>
      </div>

      <h1>
        Uncover the scholarship rules<br />the portals left out.
      </h1>

      <p className="hero-subtitle">
        Cross-examines official government gazettes, university circulars, and state portal feeds to verify student eligibility, unearth conflicting deadlines, and detect silent disqualifiers before you apply.
      </p>

      {/* Prominent Action Buttons */}
      <div className="hero-action-buttons">
        <Link to="/eligibility" className="hero-btn-primary">
          Check Student Eligibility →
        </Link>
        <Link to="/results/demo" className="hero-btn-secondary">
          Explore Sample Case
        </Link>
      </div>

      {/* Search Input Box */}
      <div className="ask-box">
        <input
          className="ask-input"
          aria-label="Research question"
          placeholder="Ask about scholarship eligibility, deadlines, OBC criteria, income ceilings…"
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              handleAnalyzeClick();
            }
          }}
          autoFocus
        />
        <button
          className="ask-submit active-always"
          onClick={handleAnalyzeClick}
          type="button"
          title="Run gap analysis on this question"
        >
          {q.trim() ? "Analyze →" : "Check Eligibility →"}
        </button>
      </div>

      {/* Sample suggestion pills */}
      <div className="sample-pills">
        {SAMPLE_QUESTIONS.map((sq, i) => (
          <button
            key={i}
            className="sample-pill"
            type="button"
            onClick={() => startIntake(sq)}
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Quiet demo link */}
      <div className="demo-link-row">
        <Link to="/results/demo" className="demo-quiet-link">
          View sample analysis — State Merit Scholarship case
        </Link>
      </div>
    </section>
  );
}
