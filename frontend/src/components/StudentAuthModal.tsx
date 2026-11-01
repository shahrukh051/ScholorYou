import { useState, useEffect } from "react";
import type { StudentProfile } from "../types";
import { getStoredProfile, saveStoredProfile, clearStoredProfile, DEFAULT_STUDENT_PROFILE } from "../utils/studentStorage";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Postgraduate", "Doctoral / PhD"];
const CATEGORIES = ["General", "OBC-NCL", "SC", "ST", "EWS", "PwD", "Minority"];
const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Chandigarh", "Jammu & Kashmir", "Ladakh"
];

const INCOME_RANGES = [
  "Below ₹1.0 Lakh",
  "₹1.0L - ₹2.5 Lakhs",
  "₹2.5L - ₹6.0 Lakhs",
  "₹6.0L - ₹8.0 Lakhs",
  "Above ₹8.0 Lakhs"
];

export default function StudentAuthModal({
  isOpen,
  onClose,
  onSuccess
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (profile: StudentProfile) => void;
}) {
  const [profile, setProfile] = useState<StudentProfile>(() => {
    return getStoredProfile() || {
      name: "",
      email: "",
      college: "",
      course: "",
      year: "1st Year",
      category: "General",
      state: "Delhi",
      familyIncome: "₹2.5L - ₹6.0 Lakhs",
      gpaOrMarks: ""
    };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredProfile();
      if (stored) setProfile(stored);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof StudentProfile, val: string) => {
    setProfile(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => {
      onSuccess?.(profile);
      onClose();
    }, 600);
  };

  const handleFillSample = () => {
    setProfile(DEFAULT_STUDENT_PROFILE);
  };

  const handleClear = () => {
    clearStoredProfile();
    setProfile({
      name: "",
      email: "",
      college: "",
      course: "",
      year: "1st Year",
      category: "General",
      state: "Delhi",
      familyIncome: "₹2.5L - ₹6.0 Lakhs",
      gpaOrMarks: ""
    });
    setSavedSuccess(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog auth-dialog" onClick={e => e.stopPropagation()}>
        <button className="drawer-close" onClick={onClose} aria-label="Close modal">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="auth-header">
          <div className="auth-eyebrow">Student Verification Account</div>
          <h2 className="auth-title">Student Profile & Credentials</h2>
          <p className="auth-desc">
            Provide your academic year, course, college, and category. The gap detection engine uses this data to cross-examine eligibility rules and scholarship schemes.
          </p>
        </div>

        <form onSubmit={handleSave} className="auth-form">
          <div className="auth-row-2">
            <div className="auth-field">
              <label htmlFor="auth-name" className="auth-label">Full Name</label>
              <input
                id="auth-name"
                className="auth-input"
                placeholder="e.g. Rahul Sharma"
                value={profile.name}
                onChange={e => handleChange("name", e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="auth-email" className="auth-label">Student Email / ID</label>
              <input
                id="auth-email"
                type="email"
                className="auth-input"
                placeholder="e.g. rahul@university.ac.in"
                value={profile.email}
                onChange={e => handleChange("email", e.target.value)}
              />
            </div>
          </div>

          <div className="auth-row-2">
            <div className="auth-field">
              <label htmlFor="auth-college" className="auth-label">College / University</label>
              <input
                id="auth-college"
                className="auth-input"
                placeholder="e.g. IIT Delhi, Delhi University"
                value={profile.college}
                onChange={e => handleChange("college", e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="auth-course" className="auth-label">Course / Degree</label>
              <input
                id="auth-course"
                className="auth-input"
                placeholder="e.g. B.Tech Computer Science"
                value={profile.course}
                onChange={e => handleChange("course", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-row-3">
            <div className="auth-field">
              <label htmlFor="auth-year" className="auth-label">Academic Year</label>
              <select
                id="auth-year"
                className="auth-select"
                value={profile.year}
                onChange={e => handleChange("year", e.target.value)}
              >
                {YEARS.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="auth-field">
              <label htmlFor="auth-category" className="auth-label">Category</label>
              <select
                id="auth-category"
                className="auth-select"
                value={profile.category}
                onChange={e => handleChange("category", e.target.value)}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="auth-field">
              <label htmlFor="auth-state" className="auth-label">Domicile State</label>
              <select
                id="auth-state"
                className="auth-select"
                value={profile.state}
                onChange={e => handleChange("state", e.target.value)}
              >
                {STATES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="auth-row-2">
            <div className="auth-field">
              <label htmlFor="auth-income" className="auth-label">Annual Family Income</label>
              <select
                id="auth-income"
                className="auth-select"
                value={profile.familyIncome}
                onChange={e => handleChange("familyIncome", e.target.value)}
              >
                {INCOME_RANGES.map(inc => (
                  <option key={inc} value={inc}>{inc}</option>
                ))}
              </select>
            </div>

            <div className="auth-field">
              <label htmlFor="auth-marks" className="auth-label">Previous Year Marks / CGPA</label>
              <input
                id="auth-marks"
                className="auth-input"
                placeholder="e.g. 82% or 8.2 CGPA"
                value={profile.gpaOrMarks}
                onChange={e => handleChange("gpaOrMarks", e.target.value)}
              />
            </div>
          </div>

          {savedSuccess && (
            <div className="auth-success-alert">
              Profile details saved successfully. Ready for eligibility verification.
            </div>
          )}

          <div className="auth-action-row">
            <div className="auth-secondary-actions">
              <button
                type="button"
                className="auth-btn-ghost"
                onClick={handleFillSample}
                title="Fill sample student details"
              >
                Autofill Sample Profile
              </button>
              {getStoredProfile() && (
                <button
                  type="button"
                  className="auth-btn-ghost danger"
                  onClick={handleClear}
                >
                  Sign Out / Clear
                </button>
              )}
            </div>

            <button
              type="submit"
              className="auth-btn-primary"
            >
              Save Profile & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
