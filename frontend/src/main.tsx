import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Workspace from "./pages/Workspace";
import Results from "./pages/Results";
import Checklist from "./pages/Checklist";
import Eligibility from "./pages/Eligibility";
import Login from "./pages/Login";
import ExplainerModal from "./components/ExplainerModal";
import StudentAuthModal from "./components/StudentAuthModal";
import { Scene } from "./components/Scene";
import SiteTopDock from "./components/SiteTopDock";
import "./styles.css";

export default function App() {
  const [showExplainer, setShowExplainer] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <BrowserRouter>
      {/* ThreeUI Sable Dock as our Site's Live Top Navigation */}
      <SiteTopDock
        onOpenGuide={() => setShowExplainer(true)}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login initialMode="login" />} />
          <Route path="/register" element={<Login initialMode="register" />} />
          <Route path="/eligibility" element={<Eligibility />} />
          <Route path="/dock" element={<div className="wrap" style={{ maxWidth: 960, margin: "0 auto" }}><h2 style={{ marginBottom: "16px", fontSize: "24px" }}>ThreeUI Animated Top Dock (Sable)</h2><Scene /></div>} />
          <Route path="/workspace/:id" element={<Workspace />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/results/:id/checklist" element={<Checklist />} />
        </Routes>
      </main>

      {showExplainer && <ExplainerModal onClose={() => setShowExplainer(false)} />}
      <StudentAuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
