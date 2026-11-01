import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { getStoredProfile, saveStoredProfile } from "../utils/studentStorage";

type IntakeData = {
  question: string;
  name: string;
  course: string;
  year: string;
  college: string;
  state: string;
  category: string;
};

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Postgraduate", "Doctoral"];
const CATEGORIES = ["General", "OBC-NCL", "SC", "ST", "EWS", "PwD", "Minority"];
const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Chandigarh", "Jammu & Kashmir", "Ladakh", "Puducherry"
];

function buildQuestion(data: IntakeData): string {
  if (!data.question.trim()) return "";
  const parts: string[] = [data.question.trim()];
  if (data.year) parts.push(`I am a ${data.year} student`);
  if (data.course) parts.push(`studying ${data.course}`);
  if (data.college) parts.push(`at ${data.college}`);
  if (data.state) parts.push(`in ${data.state}`);
  if (data.category) parts.push(`under the ${data.category} category`);
  return parts.join(", ") + ".";
}

export default function IntakeForm({
  initialQuestion = "",
  onBack
}: {
  initialQuestion?: string;
  onBack: () => void;
}) {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const stored = getStoredProfile();

  const [data, setData] = useState<IntakeData>({
    question: initialQuestion,
    name: stored?.name || "",
    course: stored?.course || "",
    year: stored?.year || "",
    college: stored?.college || "",
    state: stored?.state || "",
    category: stored?.category || "",
  });

  const set = (k: keyof IntakeData, v: string) =>
    setData(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    if (!data.question.trim()) {
      setErr("Please enter a research question.");
      return;
    }
    setErr("");
    setLoading(true);
    if (data.name || data.college || data.course || data.category) {
      saveStoredProfile({
        name: data.name || stored?.name || "Student",
        email: stored?.email || "",
        college: data.college || stored?.college || "",
        course: data.course || stored?.course || "",
        year: data.year || stored?.year || "1st Year",
        category: data.category || stored?.category || "General",
        state: data.state || stored?.state || "Delhi",
        familyIncome: stored?.familyIncome || "₹2.5L - ₹6.0 Lakhs",
        gpaOrMarks: stored?.gpaOrMarks || ""
      });
    }
    const fullQuestion = buildQuestion(data);
    try {
      const res = await api.create(fullQuestion);
      nav(`/workspace/${res.id}`);
    } catch {
      // Backend unavailable — load demo
      setTimeout(() => nav("/results/demo"), 800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="intake-wrap">
      <div className="intake-card">

        {/* Back */}
        <button className="intake-back" onClick={onBack} type="button">
          ← Back
        </button>

        <div className="intake-header">
          <h1 className="intake-title">Tell us about yourself</h1>
          <p className="intake-subtitle">
            The more context you provide, the more precise the gap analysis.
            All fields except the question are optional.
          </p>
        </div>

        {/* Question */}
        <div className="intake-section">
          <label className="intake-label" htmlFor="intake-question">
            What do you want to verify?
          </label>
          <textarea
            id="intake-question"
            className="intake-textarea"
            placeholder="e.g. Am I eligible for the State Merit Scholarship 2026?"
            value={data.question}
            onChange={e => set("question", e.target.value)}
            rows={3}
          />
        </div>

        {/* Academic context */}
        <div className="intake-section">
          <div className="intake-section-label">Your academic profile</div>
          <div className="intake-grid-2">
            <div className="intake-field">
              <label className="intake-label" htmlFor="intake-course">Course / Degree</label>
              <input
                id="intake-course"
                className="intake-input"
                placeholder="e.g. B.Tech Computer Science"
                value={data.course}
                onChange={e => set("course", e.target.value)}
              />
            </div>
            <div className="intake-field">
              <label className="intake-label" htmlFor="intake-year">Academic Year</label>
              <select
                id="intake-year"
                className="intake-select"
                value={data.year}
                onChange={e => set("year", e.target.value)}
              >
                <option value="">Select year</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="intake-field">
              <label className="intake-label" htmlFor="intake-college">Institution / College</label>
              <input
                id="intake-college"
                className="intake-input"
                placeholder="e.g. IIT Delhi"
                value={data.college}
                onChange={e => set("college", e.target.value)}
              />
            </div>
            <div className="intake-field">
              <label className="intake-label" htmlFor="intake-state">State</label>
              <select
                id="intake-state"
                className="intake-select"
                value={data.state}
                onChange={e => set("state", e.target.value)}
              >
                <option value="">Select state</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="intake-section">
          <div className="intake-section-label">Reservation category</div>
          <div className="intake-category-row">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                className={`intake-category-chip${data.category === cat ? " selected" : ""}`}
                onClick={() => set("category", data.category === cat ? "" : cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Name (optional) */}
        <div className="intake-section">
          <label className="intake-label" htmlFor="intake-name">
            Your name <span className="intake-optional">(optional)</span>
          </label>
          <input
            id="intake-name"
            className="intake-input"
            placeholder="e.g. Rahul Sharma"
            value={data.name}
            onChange={e => set("name", e.target.value)}
          />
        </div>

        {/* Preview of assembled question */}
        {(data.course || data.year || data.college || data.category) && data.question.trim() && (
          <div className="intake-preview">
            <div className="intake-preview-label">Research query we will run</div>
            <div className="intake-preview-text">{buildQuestion(data)}</div>
          </div>
        )}

        {err && <p className="hero-error" style={{ textAlign: "left" }}>{err}</p>}

        <button
          className="intake-submit"
          onClick={handleSubmit}
          disabled={loading || !data.question.trim()}
          type="button"
        >
          {loading ? "Starting analysis…" : "Run Analysis"}
        </button>
      </div>
    </section>
  );
}
