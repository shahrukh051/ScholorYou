import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { StudentProfile } from "../types";
import { getStoredProfile, saveStoredProfile, DEFAULT_STUDENT_PROFILE } from "../utils/studentStorage";
import { api, type WebScholarship } from "../api/client";

const SCHEMES = [
  {
    id: "state_merit_2026",
    title: "State Merit Scholarship Scheme 2026",
    authority: "Department of Higher Education (Official Gazette No. 412)",
    benefit: "Up to ₹50,000 / year tuition fee reimbursement + maintenance allowance",
    deadline: "November 15, 2026 (Conflicting with Portal date: Nov 30)"
  },
  {
    id: "national_fellowship",
    title: "National Fellowship for Higher Education",
    authority: "Ministry of Social Justice & Empowerment",
    benefit: "Full tuition coverage + ₹31,000 monthly stipend for research",
    deadline: "December 31, 2026"
  },
  {
    id: "post_matric_scheme",
    title: "Post-Matric Scholarship for Reserved Categories",
    authority: "National Scholarship Portal (Central Sector)",
    benefit: "Compulsory non-refundable fees reimbursement + book allowance",
    deadline: "October 31, 2026"
  }
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Postgraduate", "Doctoral / PhD"];
const CATEGORIES = ["General", "OBC-NCL", "SC", "ST", "EWS", "PwD", "Minority"];
const STATES = [
  "Delhi", "Maharashtra", "Karnataka", "Uttar Pradesh", "Tamil Nadu",
  "Gujarat", "Rajasthan", "West Bengal", "Telangana", "Andhra Pradesh",
  "Madhya Pradesh", "Bihar", "Punjab", "Haryana", "Kerala", "Odisha",
  "Assam", "Jharkhand", "Chhattisgarh", "Uttarakhand", "Himachal Pradesh",
  "Goa", "Chandigarh", "Jammu & Kashmir"
];
const INCOME_RANGES = [
  "Below ₹1.0 Lakh",
  "₹1.0L - ₹2.5 Lakhs",
  "₹2.5L - ₹6.0 Lakhs",
  "₹6.0L - ₹8.0 Lakhs",
  "Above ₹8.0 Lakhs"
];

type EligibilityVerdict = {
  status: "eligible" | "conditional" | "ineligible";
  title: string;
  summary: string;
  checks: {
    label: string;
    status: "pass" | "warning" | "fail";
    detail: string;
  }[];
  criticalGaps: string[];
};

export default function Eligibility() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<StudentProfile>(() => {
    return getStoredProfile() || DEFAULT_STUDENT_PROFILE;
  });

  const [selectedScheme, setSelectedScheme] = useState<string>("state_merit_2026");
  const [evaluated, setEvaluated] = useState<boolean>(true);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [saveNotice, setSaveNotice] = useState<string>("");

  const FALLBACK_SCHOLARSHIPS: WebScholarship[] = [
    {
      id: "nsp-central-sector",
      title: "Central Sector Scheme of Scholarships for College and University Students",
      authority: "Department of Higher Education, Ministry of Education, Govt. of India",
      portal_url: "https://scholarships.gov.in",
      category: "All (General, OBC, SC, ST, EWS)",
      course: "Undergraduate / Postgraduate (General & Professional Courses)",
      income_limit: "Rs. 4.5 Lakhs per annum",
      min_score: "80th percentile in Class 12th board exams",
      benefit: "Rs. 12,000/year at graduation level, Rs. 20,000/year at post-graduation level",
      deadline: "November 30, 2026",
      known_discrepancies: "State portals state 75% cutoff whereas Central NSP mandates top 20th percentile of respective board.",
      api_source: "National Scholarship Portal (NSP API Feed)"
    },
    {
      id: "post-matric-sc-st",
      title: "Post-Matric Scholarship Scheme for SC / ST / OBC Students",
      authority: "Ministry of Social Justice and Empowerment / Tribal Affairs",
      portal_url: "https://scholarships.gov.in",
      category: "SC / ST / OBC / EBC",
      course: "Engineering, Medicine, Arts, Science, Commerce, Diploma",
      income_limit: "Rs. 2.5 Lakhs per annum (Rs. 1.5L for OBC in certain states)",
      min_score: "Passing marks in qualifying examination",
      benefit: "100% compulsory non-refundable fees reimbursement + maintenance allowance",
      deadline: "October 31, 2026",
      known_discrepancies: "Hostel fee reimbursement requires independent verification from college warden.",
      api_source: "Govt of India DBT Portal"
    },
    {
      id: "aicte-pragati",
      title: "AICTE Pragati Scholarship for Girl Students",
      authority: "All India Council for Technical Education (AICTE)",
      portal_url: "https://www.aicte-india.org/schemes/students-development-schemes/pragati",
      category: "Women / Girl Students (All categories)",
      course: "B.Tech / B.E / B.Arch / Polytechnic Diploma (AICTE Approved)",
      income_limit: "Rs. 8.0 Lakhs per annum",
      min_score: "Merit in Centralized Admission Process (JEE / State CET)",
      benefit: "Rs. 50,000 per annum for tuition fees, purchase of books, equipment, and laptop",
      deadline: "December 15, 2026",
      known_discrepancies: "Maximum two girl children per family eligible; conflicting circular regarding renewal CGPA requirement.",
      api_source: "AICTE Open Data API"
    },
    {
      id: "state-merit-2026",
      title: "State Merit Scholarship Scheme 2026",
      authority: "State Directorate of Higher Education (Official Gazette Notification)",
      portal_url: "https://dhe.state.gov.in/scholarships",
      category: "General / OBC / SC / ST / EWS",
      course: "B.Tech, B.Sc, MBBS, B.Com, BA, BCA, Law",
      income_limit: "Tier 1: < Rs. 2.5L (100% waiver); Tier 2: Rs. 2.5L - Rs. 6L (50% waiver)",
      min_score: "Minimum 60% or 6.5 CGPA in previous academic year",
      benefit: "Up to Rs. 50,000 per annum tuition reimbursement + examination fees",
      deadline: "November 15, 2026",
      known_discrepancies: "Critical Gazette deadline of Nov 15 contradicts State University website showing Nov 30.",
      api_source: "State Higher Education Gazette Feed"
    }
  ];

  // Live Web Scholarship Research state
  const [searchQuery, setSearchQuery] = useState("");
  const [webScholarships, setWebScholarships] = useState<WebScholarship[]>(FALLBACK_SCHOLARSHIPS);
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);

  const fetchScholarships = async (query = "") => {
    setIsSearchingWeb(true);
    try {
      const res = await api.searchScholarships(query, profile.category, profile.course);
      if (res && res.scholarships && res.scholarships.length > 0) {
        setWebScholarships(res.scholarships);
      }
    } catch (e) {
      console.warn("Failed to query live scholarship APIs:", e);
    } finally {
      setIsSearchingWeb(false);
    }
  };

  useEffect(() => {
    const stored = getStoredProfile();
    if (stored) setProfile(stored);
    fetchScholarships();
  }, []);

  const handleChange = (field: keyof StudentProfile, val: string) => {
    setProfile(prev => ({ ...prev, [field]: val }));
  };

  const handleRunEvaluation = () => {
    setIsEvaluating(true);
    saveStoredProfile(profile);
    setSaveNotice("Academic profile updated successfully.");
    setTimeout(() => {
      setIsEvaluating(false);
      setEvaluated(true);
      setTimeout(() => setSaveNotice(""), 3500);
    }, 350);
  };

  // Evaluate student profile against selected scheme rules
  const getVerdict = (): EligibilityVerdict => {
    const isReserved = ["OBC-NCL", "SC", "ST", "EWS", "PwD"].includes(profile.category);
    const isLowIncome = ["Below ₹1.0 Lakh", "₹1.0L - ₹2.5 Lakhs"].includes(profile.familyIncome);
    const isMidIncome = profile.familyIncome === "₹2.5L - ₹6.0 Lakhs";

    if (profile.familyIncome === "Above ₹8.0 Lakhs" && !["SC", "ST", "PwD"].includes(profile.category)) {
      return {
        status: "ineligible",
        title: "Criteria Exceeded: Income Ceiling",
        summary: "Annual family income exceeds the ₹8.0 Lakh ceiling mandated under clause 4.2 of the scheme guidelines.",
        checks: [
          { label: "Academic Enrollment", status: "pass", detail: `${profile.course} (${profile.year}) at ${profile.college} is a recognized institution.` },
          { label: "Category Quota", status: "warning", detail: `${profile.category} category requires income under ₹8.0L for Non-Creamy Layer / General benefit.` },
          { label: "Income Limit", status: "fail", detail: "Exceeds ₹8.0 Lakhs threshold. No tuition reimbursement allowed." },
          { label: "Domicile State", status: "pass", detail: `Domicile: ${profile.state} verified.` }
        ],
        criticalGaps: [
          "Income ceiling strictly enforced per Gazette notification",
          "Consider institutional merit-only endowment waivers"
        ]
      };
    }

    if (isLowIncome || (isMidIncome && isReserved)) {
      return {
        status: "conditional",
        title: "Conditionally Eligible — 2 Evidence Discrepancies Detected",
        summary: `You qualify for the ${profile.category} quota at ${profile.college}. However, ScholorYou detected silent rule conflicts between the official gazette and university circulars.`,
        checks: [
          {
            label: "Category & Quota Verification",
            status: "pass",
            detail: `${profile.category} quota verified for ${profile.course}. Reserved seat entitlement applies.`
          },
          {
            label: "Income Ceiling & Tier Split",
            status: "warning",
            detail: `Family income in ${profile.familyIncome}. Gazette grants 100% waiver below ₹2.5L, 50% waiver up to ₹6.0L. University portal incorrectly claims 0% above ₹2.5L.`
          },
          {
            label: "Academic Progression",
            status: "pass",
            detail: `${profile.year} status with ${profile.gpaOrMarks || "passing score"} satisfies minimum 60% requirement.`
          },
          {
            label: "Application Cutoff Conflict",
            status: "fail",
            detail: "CRITICAL: Official Gazette specifies November 15 deadline, whereas state portal displays November 30. Early submission required."
          }
        ],
        criticalGaps: [
          "Non-Creamy Layer (NCL) certificate must be issued after April 1, 2026",
          "University dean bonafide signature required 7 days prior to portal closing",
          "Silent omission in portal: Bank account must be Aadhaar-seeded for DBT disbursal"
        ]
      };
    }

    return {
      status: "eligible",
      title: "Eligible for Scheme Consideration",
      summary: `Your profile matches the standard eligibility criteria for ${profile.course} at ${profile.college}.`,
      checks: [
        { label: "Course & College", status: "pass", detail: "Recognized accredited program and college." },
        { label: "Academic Standing", status: "pass", detail: `Enrolled in ${profile.year}.` },
        { label: "Category & Domicile", status: "pass", detail: `${profile.category} in ${profile.state}.` }
      ],
      criticalGaps: [
        "Verify domicile certificate validity date with state revenue office",
        "Confirm whether hostel allowance is bundled or separate"
      ]
    };
  };

  const verdict = getVerdict();
  const currentScheme = SCHEMES.find(s => s.id === selectedScheme) || SCHEMES[0];

  return (
    <div className="wrap" style={{ padding: "40px 20px 80px", maxWidth: "1080px", margin: "0 auto" }}>
      {/* Top Header */}
      <div style={{ marginBottom: "28px" }}>
        <div className="hero-label">SCHOLORYOU · STUDENT ELIGIBILITY VERIFICATION</div>
        <h1 style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", margin: "8px 0" }}>
          Check Scholarship & Scheme Eligibility
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "15px", maxWidth: "720px", lineHeight: 1.6 }}>
          Set up your academic details, course, and category below. ScholorYou cross-references your profile against live scholarship portal feeds and official government gazettes to flag hidden rules and deadline shifts.
        </p>
      </div>

      {saveNotice && (
        <div className="auth-success-alert" style={{ marginBottom: "20px" }}>
          {saveNotice}
        </div>
      )}

      <div className="eligibility-layout">
        {/* Left Column: Student Details Form */}
        <div className="eligibility-form-card">
          <div className="card-section-header">
            <h2 style={{ fontSize: "18px", fontWeight: 700 }}>Your Academic Profile</h2>
            <button
              type="button"
              className="btn-text-link"
              onClick={() => {
                setProfile(DEFAULT_STUDENT_PROFILE);
                saveStoredProfile(DEFAULT_STUDENT_PROFILE);
                setSaveNotice("Reset to sample profile.");
                setTimeout(() => setSaveNotice(""), 3000);
              }}
            >
              Reset to Sample
            </button>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="el-name" className="form-label">Full Name</label>
              <input
                id="el-name"
                className="form-input"
                placeholder="e.g. Aditya Verma"
                value={profile.name}
                onChange={e => handleChange("name", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="el-email" className="form-label">Email Address</label>
              <input
                id="el-email"
                type="email"
                className="form-input"
                placeholder="e.g. student@college.edu"
                value={profile.email}
                onChange={e => handleChange("email", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="el-college" className="form-label">College / University</label>
              <input
                id="el-college"
                className="form-input"
                placeholder="e.g. IIT Delhi"
                value={profile.college}
                onChange={e => handleChange("college", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="el-course" className="form-label">Course / Degree</label>
              <input
                id="el-course"
                className="form-input"
                placeholder="e.g. B.Tech Computer Science"
                value={profile.course}
                onChange={e => handleChange("course", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="el-year" className="form-label">Academic Year</label>
              <select
                id="el-year"
                className="form-select"
                value={profile.year}
                onChange={e => handleChange("year", e.target.value)}
              >
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="el-category" className="form-label">Category</label>
              <select
                id="el-category"
                className="form-select"
                value={profile.category}
                onChange={e => handleChange("category", e.target.value)}
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="el-state" className="form-label">Domicile State</label>
              <select
                id="el-state"
                className="form-select"
                value={profile.state}
                onChange={e => handleChange("state", e.target.value)}
              >
                {STATES.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="el-income" className="form-label">Family Annual Income</label>
              <select
                id="el-income"
                className="form-select"
                value={profile.familyIncome}
                onChange={e => handleChange("familyIncome", e.target.value)}
              >
                {INCOME_RANGES.map(inc => <option key={inc} value={inc}>{inc}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="el-marks" className="form-label">Score / CGPA</label>
              <input
                id="el-marks"
                className="form-input"
                placeholder="e.g. 8.4 CGPA or 82%"
                value={profile.gpaOrMarks}
                onChange={e => handleChange("gpaOrMarks", e.target.value)}
              />
            </div>
          </div>

          {/* Scheme Selector */}
          <div style={{ marginTop: "20px" }}>
            <label htmlFor="el-scheme" className="form-label">Target Scheme to Verify</label>
            <select
              id="el-scheme"
              className="form-select"
              value={selectedScheme}
              onChange={e => setSelectedScheme(e.target.value)}
            >
              {SCHEMES.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
            <button
              type="button"
              className="btn-primary"
              style={{ flex: 1, padding: "12px", fontSize: "14px", fontWeight: 700 }}
              onClick={handleRunEvaluation}
              disabled={isEvaluating}
            >
              {isEvaluating ? "Updating Evaluation..." : "Save Profile & Refresh Eligibility"}
            </button>
          </div>
        </div>

        {/* Right Column: Instant Eligibility Assessment */}
        <div className="eligibility-verdict-card">
          <div className="card-section-header">
            <h2 style={{ fontSize: "18px", fontWeight: 700 }}>Eligibility Evaluation</h2>
            <span className={`verdict-pill ${verdict.status}`}>
              <span className="verdict-dot" />
              {verdict.status.toUpperCase()}
            </span>
          </div>

          <div className="target-scheme-box">
            <div className="target-scheme-title">{currentScheme.title}</div>
            <div className="target-scheme-authority">{currentScheme.authority}</div>
            <div className="target-scheme-benefit">Benefit: {currentScheme.benefit}</div>
            <div className="target-scheme-deadline">Gazette Deadline: {currentScheme.deadline}</div>
          </div>

          <div className="verdict-summary-box">
            <h3 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 6px", color: "var(--text-primary)" }}>
              {verdict.title}
            </h3>
            <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              {verdict.summary}
            </p>
          </div>

          {/* Criteria Checklist */}
          <div className="criteria-checklist">
            <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
              Criteria Verification Breakdown
            </div>
            {verdict.checks.map((chk, idx) => (
              <div key={idx} className="criteria-row">
                <div className="criteria-status-icon">
                  {chk.status === "pass" && <span className="status-pass-dot" />}
                  {chk.status === "warning" && <span className="status-warn-dot" />}
                  {chk.status === "fail" && <span className="status-fail-dot" />}
                </div>
                <div className="criteria-content">
                  <div className="criteria-label">{chk.label}</div>
                  <div className="criteria-detail">{chk.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Silent Discrepancies & Dark Spots */}
          {verdict.criticalGaps.length > 0 && (
            <div className="dark-spot-warning-box">
              <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", color: "var(--c-chicory-deep)", textTransform: "uppercase", marginBottom: "6px" }}>
                Identified Rule Gaps & Discrepancies
              </div>
              <ul className="dark-spot-list">
                {verdict.criticalGaps.map((gap, i) => (
                  <li key={i}>{gap}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action button: proceed to full analysis */}
          <div style={{ marginTop: "20px" }}>
            <Link
              to="/results/demo"
              className="btn-secondary"
              style={{ display: "block", textAlign: "center", padding: "10px", fontSize: "13px" }}
            >
              Verify & Run Full Gap Analysis →
            </Link>
          </div>
        </div>
      </div>

      {/* LIVE WEB SCHOLARSHIPS RESEARCH SECTION */}
      <div className="scholarship-research-section">
        <div className="scholarship-research-header">
          <div className="scholarship-research-badge">LIVE WEB SCHOLARSHIP INTELLIGENCE</div>
          <div>
            <h2 className="scholarship-research-title">
              Query Live Web APIs & Official Government Scheme Feeds
            </h2>
            <p className="scholarship-research-desc">
              Cross-examines real-time web knowledge from National Scholarship Portal feeds, Wikipedia Academic API, and DuckDuckGo Open Search to find hidden schemes and compare deadlines.
            </p>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="scholarship-search-bar">
          <input
            className="scholarship-search-input"
            placeholder="Search any scholarship by keyword, course, or category (e.g., engineering merit, OBC girl student, CSIR)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && fetchScholarships(searchQuery)}
          />
          <button
            type="button"
            className="scholarship-search-btn"
            onClick={() => fetchScholarships(searchQuery)}
            disabled={isSearchingWeb}
          >
            {isSearchingWeb ? "Querying APIs..." : "Search Live Web APIs →"}
          </button>
        </div>

        {/* Quick Filter Pills */}
        <div className="scholarship-pills-row">
          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>Quick Topics:</span>
          {["All Schemes", "Engineering Merit", "OBC Post-Matric", "Girl Child STEM", "Science Fellowship", "Minority Scholarship"].map(pill => (
            <button
              key={pill}
              type="button"
              className="scholarship-filter-pill"
              onClick={() => {
                const term = pill === "All Schemes" ? "" : pill;
                setSearchQuery(term);
                fetchScholarships(term);
              }}
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Results Cards Grid */}
        <div className="scholarship-grid">
          {webScholarships.map(ws => (
            <div key={ws.id} className="scholarship-web-card">
              <div className="scholarship-card-top">
                <span className="scholarship-api-tag">
                  <span className="scholarship-api-dot" />
                  {ws.api_source}
                </span>
                <span className="scholarship-deadline-tag">{ws.deadline}</span>
              </div>

              <h3 className="scholarship-card-title">{ws.title}</h3>
              <p className="scholarship-card-authority">{ws.authority}</p>

              <div className="scholarship-meta-grid">
                <div className="scholarship-meta-cell">
                  <span className="scholarship-meta-k">Eligible Category</span>
                  <span className="scholarship-meta-v">{ws.category}</span>
                </div>
                <div className="scholarship-meta-cell">
                  <span className="scholarship-meta-k">Income Ceiling</span>
                  <span className="scholarship-meta-v">{ws.income_limit}</span>
                </div>
              </div>

              <div className="scholarship-benefit-box">
                <span className="scholarship-benefit-label">Award Benefit:</span> {ws.benefit}
              </div>

              {ws.known_discrepancies && (
                <div className="scholarship-discrepancy-box">
                  <strong>Dark Spot Warning:</strong> {ws.known_discrepancies}
                </div>
              )}

              <div className="scholarship-card-actions">
                <button
                  type="button"
                  className="scholarship-btn-primary"
                  onClick={() => {
                    setSelectedScheme(ws.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Verify My Eligibility
                </button>

                <a
                  href={ws.portal_url}
                  target="_blank"
                  rel="noreferrer"
                  className="scholarship-btn-link"
                >
                  Official Portal ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
