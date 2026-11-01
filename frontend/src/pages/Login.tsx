import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { StudentProfile } from "../types";
import { getStoredProfile, saveStoredProfile, DEFAULT_STUDENT_PROFILE } from "../utils/studentStorage";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Postgraduate", "Doctoral / PhD"];
const CATEGORIES = ["General", "OBC-NCL", "SC", "ST", "EWS", "PwD", "Minority"];
const STATES = [
  "Delhi", "Maharashtra", "Karnataka", "Uttar Pradesh", "Tamil Nadu",
  "Gujarat", "Rajasthan", "West Bengal", "Telangana", "Andhra Pradesh",
  "Madhya Pradesh", "Bihar", "Punjab", "Haryana", "Kerala", "Odisha"
];

export default function Login({ initialMode = "login" }: { initialMode?: "login" | "register" }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // Form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Registration profile states
  const [name, setName] = useState("");
  const [college, setCollege] = useState("IIT Delhi");
  const [course, setCourse] = useState("B.Tech Computer Science");
  const [year, setYear] = useState("2nd Year");
  const [category, setCategory] = useState("OBC-NCL");
  const [state, setState] = useState("Delhi");

  const [activeSlide, setActiveSlide] = useState(0);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = getStoredProfile();
    const profile: StudentProfile = existing || {
      name: username.includes("@") ? username.split("@")[0] : (username || "Student"),
      email: username.includes("@") ? username : `${username || "student"}@university.ac.in`,
      college: "IIT Delhi",
      course: "B.Tech Computer Science",
      year: "2nd Year",
      category: "OBC-NCL",
      state: "Delhi",
      familyIncome: "₹2.5L - ₹6.0 Lakhs",
      gpaOrMarks: "8.4 CGPA"
    };
    saveStoredProfile(profile);
    navigate("/eligibility");
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: StudentProfile = {
      name: name || username || "Student User",
      email: username.includes("@") ? username : `${username || "student"}@college.edu`,
      college: college || "IIT Delhi",
      course: course || "B.Tech Computer Science",
      year: year || "1st Year",
      category: category || "General",
      state: state || "Delhi",
      familyIncome: "₹2.5L - ₹6.0 Lakhs",
      gpaOrMarks: "8.0 CGPA"
    };
    saveStoredProfile(profile);
    navigate("/eligibility");
  };

  const handleQuickDemo = () => {
    saveStoredProfile(DEFAULT_STUDENT_PROFILE);
    navigate("/eligibility");
  };

  return (
    <div className="login-page-wrap">
      <div className="login-card">
        {/* LEFT COLUMN: FORM */}
        <div className="login-left-pane">
          <div className="login-pane-inner">
            {/* ScholorYou Logo & Title */}
            <div className="login-brand-header">
              <img
                src="/scholoryou-mark-trans.png"
                alt="ScholorYou Logo"
                className="login-brand-icon"
              />
              <span className="login-brand-title">
                <span className="brand-scholor">Scholor</span>
                <span className="brand-you">You</span>
              </span>
            </div>

            <h1 className="login-title">
              {mode === "login" ? "Welcome back!" : "Create an account"}
            </h1>
            <p className="login-subtitle">
              {mode === "login"
                ? "Verify scholarship eligibility and uncover hidden rules with ScholorYou. Get started for free."
                : "Enter your academic details to automatically verify scheme criteria and detect dark spots."}
            </p>

            {mode === "login" ? (
              <form onSubmit={handleLoginSubmit} className="login-form">
                {/* Username Input */}
                <div className="pill-input-box">
                  <input
                    type="text"
                    className="pill-input"
                    placeholder="Username or Email"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="pill-input-box password-box">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="pill-input"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="pill-input-eye"
                    onClick={() => setShowPassword(p => !p)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    )}
                  </button>
                </div>

                <div className="login-forgot-row">
                  <button
                    type="button"
                    className="login-forgot-link"
                    onClick={() => setForgotSent(true)}
                  >
                    Forgot Password?
                  </button>
                </div>

                {forgotSent && (
                  <div className="login-info-msg">
                    Password reset link sent to your registered email address.
                  </div>
                )}

                {/* Sign In Button */}
                <button type="submit" className="login-submit-btn">
                  Sign in
                </button>

                {/* Bottom switch to register */}
                <div className="login-switch-row" style={{ marginTop: "24px" }}>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="login-switch-btn"
                    onClick={() => setMode("register")}
                  >
                    Sign up
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="login-form">
                {/* Full Name */}
                <div className="pill-input-box">
                  <input
                    type="text"
                    className="pill-input"
                    placeholder="Full Name (e.g. Priya Nair)"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Email */}
                <div className="pill-input-box">
                  <input
                    type="email"
                    className="pill-input"
                    placeholder="Email Address"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                  />
                </div>

                {/* Password */}
                <div className="pill-input-box password-box">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="pill-input"
                    placeholder="Create a Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="pill-input-eye"
                    onClick={() => setShowPassword(p => !p)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    )}
                  </button>
                </div>

                {/* Academic Fields Grid */}
                <div className="register-grid">
                  <div className="pill-input-box">
                    <input
                      type="text"
                      className="pill-input"
                      placeholder="College (e.g. IIT Delhi)"
                      value={college}
                      onChange={e => setCollege(e.target.value)}
                    />
                  </div>

                  <div className="pill-input-box">
                    <input
                      type="text"
                      className="pill-input"
                      placeholder="Course (e.g. B.Tech CS)"
                      value={course}
                      onChange={e => setCourse(e.target.value)}
                    />
                  </div>

                  <div className="pill-input-box">
                    <select
                      className="pill-input pill-select"
                      value={year}
                      onChange={e => setYear(e.target.value)}
                    >
                      {YEARS.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pill-input-box">
                    <select
                      className="pill-input pill-select"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                    >
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submit Register Button */}
                <button type="submit" className="login-submit-btn">
                  Create Account
                </button>

                <div className="login-switch-row" style={{ marginTop: "24px" }}>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="login-switch-btn"
                    onClick={() => setMode("login")}
                  >
                    Sign in
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: BRAND VISUAL & LOGO CARD */}
        <div className="login-right-pane">
          <div className="login-illustration-card">
            {/* Official ScholorYou Logo Artwork */}
            <div className="illustration-center" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <img
                src="/scholoryou-full-trans.png"
                alt="ScholorYou Official Logo"
                style={{
                  maxWidth: "340px",
                  maxHeight: "260px",
                  width: "90%",
                  objectFit: "contain",
                  filter: "drop-shadow(0 12px 28px rgba(56, 189, 248, 0.25))"
                }}
              />
            </div>

            {/* Pagination Carousel Dots */}
            <div className="login-dots-row">
              <span className={`login-dot ${activeSlide === 0 ? "active" : ""}`} onClick={() => setActiveSlide(0)} />
              <span className={`login-dot ${activeSlide === 1 ? "active" : ""}`} onClick={() => setActiveSlide(1)} />
              <span className={`login-dot ${activeSlide === 2 ? "active" : ""}`} onClick={() => setActiveSlide(2)} />
            </div>

            {/* Headline matching image */}
            <h2 className="login-right-title">
              Make your scholarship journey verified and confident with ScholorYou
            </h2>

            {/* Quick Demo Login Button */}
            <div style={{ marginTop: "16px" }}>
              <button
                type="button"
                className="login-quick-demo-btn"
                onClick={handleQuickDemo}
              >
                1-Click Student Demo Login (IIT Delhi, OBC-NCL)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
