import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import type { StudentProfile } from "../types";
import { getStoredProfile, subscribeToProfile } from "../utils/studentStorage";

type NavItem = {
  id: string;
  label: string;
  shortLabel?: string;
  title: string;
  icon: React.ReactNode;
  href: string;
};

export default function SiteTopDock({
  onOpenGuide
}: {
  onOpenGuide: () => void;
  onOpenAuth?: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [student, setStudent] = useState<StudentProfile | null>(() => getStoredProfile());

  useEffect(() => {
    setStudent(getStoredProfile());
    const unsub = subscribeToProfile(p => setStudent(p));
    return unsub;
  }, []);

  // Determine active item based on current route & tab param
  let activeId = "research";
  if (location.pathname.startsWith("/eligibility")) {
    activeId = "eligibility";
  } else if (location.pathname.includes("checklist")) {
    activeId = "checklist";
  } else if (location.pathname.startsWith("/results")) {
    const tab = searchParams.get("tab");
    if (tab === "timetravel") activeId = "timetravel";
    else if (tab === "echo") activeId = "echo";
    else if (tab === "sources") activeId = "sources";
    else activeId = "radar";
  } else if (location.pathname.startsWith("/workspace")) {
    activeId = "research";
  }

  const items: NavItem[] = [
    {
      id: "research",
      label: "Research",
      title: "Start new research or ask question",
      icon: (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="6.5" cy="6.5" r="4" />
          <path d="m9.5 9.5 4 4" />
        </svg>
      ),
      href: "/",
    },
    {
      id: "eligibility",
      label: "Eligibility",
      title: "Check student eligibility and scholarship criteria",
      icon: (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="5" r="3" />
          <path d="M3 14a5 5 0 0 1 10 0" />
        </svg>
      ),
      href: "/eligibility",
    },
    {
      id: "demo",
      label: "Demo",
      title: "Explore State Merit Scholarship sample case",
      icon: (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8.5 1.5 3 9h5l-1 5.5 6.5-8.5H8.5z" />
        </svg>
      ),
      href: "/results/demo",
    },
    {
      id: "radar",
      label: "Radar",
      title: "Expectation rubric & Dark Spot Matrix",
      icon: (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="6" />
          <circle cx="8" cy="8" r="2.5" />
          <path d="M8 2v12M2 8h12" />
        </svg>
      ),
      href: "/results/demo?tab=overview",
    },
    {
      id: "timetravel",
      label: "Time-Travel",
      title: "Wayback Machine history diff & deadline shifts",
      icon: (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="6" />
          <path d="M8 4.5v4l2.5 1.5" />
        </svg>
      ),
      href: "/results/demo?tab=timetravel",
    },
    {
      id: "echo",
      label: "Echo",
      title: "False consensus & copycat blog detection",
      icon: (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 6.5h2l4-3v9l-4-3H3z" />
          <path d="M12 5.5a4 4 0 0 1 0 5" />
          <path d="M13.5 3.5a7 7 0 0 1 0 9" />
        </svg>
      ),
      href: "/results/demo?tab=echo",
    },
    {
      id: "checklist",
      label: "Checklist",
      title: "Actionable pre-application verification list",
      icon: (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="2.5" y="2.5" width="11" height="11" rx="2.5" />
          <path d="m5.5 8 2 2 3.5-4" />
        </svg>
      ),
      href: "/results/demo/checklist",
    },
  ];

  return (
    <header className="site-top-bar" role="banner">
      {/* Brand — left zone */}
      <button
        className="site-brand"
        onClick={() => navigate("/")}
        title="ScholorYou Home"
        type="button"
      >
        <div className="site-brand__mark-box">
          <img
            src="/scholoryou-mark-trans.png"
            alt="ScholorYou Logo Mark"
            className="site-brand__logo"
          />
        </div>
        <div className="site-brand__info">
          <span className="site-brand__title">
            <span className="brand-scholor">Scholor</span>
            <span className="brand-you">You</span>
          </span>
          <span className="site-brand__badge">SCHOLARSHIP RADAR</span>
        </div>
      </button>

      {/* Center nav capsule */}
      <nav className="site-nav" aria-label="Main Navigation">
        {items.map((item) => (
          <button
            key={item.id}
            className={`site-nav__item${activeId === item.id ? " site-nav__item--active" : ""}`}
            title={item.title}
            type="button"
            aria-pressed={activeId === item.id}
            onClick={() => navigate(item.href)}
          >
            <span className="site-nav__icon">{item.icon}</span>
            <span className="site-nav__label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Right — Actions: Student Profile / Sign In & How It Works */}
      <div className="site-header-actions">
        {student && student.name ? (
          <button
            className="site-student-badge-btn"
            onClick={() => navigate("/eligibility")}
            title={`Logged in as ${student.name} (${student.college || "Student"}) - Click to edit profile & eligibility`}
            type="button"
          >
            <span className="student-dot-live" />
            <span className="student-name">{student.name.split(" ")[0]}</span>
            <span className="student-tag">{student.year || "Student"}</span>
          </button>
        ) : (
          <button
            className="site-auth-btn"
            onClick={() => navigate("/login")}
            title="Sign In to Student Account"
            type="button"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="8" cy="5" r="3" />
              <path d="M3 14a5 5 0 0 1 10 0" />
            </svg>
            <span>Sign In</span>
          </button>
        )}

        <button
          className="site-guide-btn"
          onClick={onOpenGuide}
          title="Learn how ScholorYou detects gaps and conflicts"
          type="button"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" className="site-guide-icon">
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 7v5M8 5.5v.5" strokeLinecap="round" />
          </svg>
          <span className="site-guide-label">How It Works</span>
        </button>
      </div>
    </header>
  );
}
