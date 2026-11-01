# ScholorYou (Digital Dark Spot)
### AI-Assisted Scholarship Intelligence & Decision Verification Platform
**Shinchan Online Hackathon 2026** • *Web Development • Artificial Intelligence • Higher Education & Information Integrity*

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.110+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 18](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Three.js](https://img.shields.io/badge/3D_Dock-ThreeUI_r128-000000?logo=three.js&logoColor=white)](https://threejs.org)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org)
[![Vite](https://img.shields.io/badge/Bundler-Vite_5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)

---

## 📌 Executive Summary

Every year, millions of students miss out on scholarships, fellowships, and tuition waivers not because they weren't qualified, but because **online scholarship information is broken**:
- **Official portals** bury renewal rules, income thresholds, and gazette amendments across multiple PDFs.
- **Edtech blogs and news portals** copy-paste outdated notices, circulate inaccurate deadlines, and propagate rumors.
- **Search engines** only index documents that already exist.
- **Standard AI chatbots (LLMs)** summarize whatever they are fed, inheriting the sources' blind spots and hallucinating missing facts.

**ScholorYou** is an AI-assisted scholarship intelligence and research verification platform. Powered by the **Digital Dark Spot Engine**, ScholorYou cross-examines official government gazettes, university circulars, and state portal feeds. It identifies critical information blind spots *before* reading sources, checks every extracted quote verbatim against original text, catches silent deadline changes using the Wayback Machine, and filters out false-consensus echo chambers.

---

## 🎯 What ScholorYou Can Do

### 1. 🎓 Instant Student Eligibility Evaluation (`/eligibility`)
- **Multi-Factor Criteria Cross-Examination**: Students enter their academic profile (College, Degree/Course, Current Academic Year, Reservation Category: General / OBC-NCL / SC / ST / EWS / PwD / Minority, Domicile State, Family Income bracket, and GPA/Percentage).
- **Automated Scheme Matching**: Instantly evaluates student profiles against verified central and state schemes (e.g., National Scholarship Portal Central Sector Scheme, Post-Matric SC/ST/OBC Scheme, AICTE Pragati, State Directorate Merit Schemes).
- **Traffic-Light Verdict**: Delivers an immediate status breakdown:
  - 🟢 **Eligible**: All criteria strictly satisfied.
  - 🟡 **Conditional / Needs Verification**: Ambiguous criteria or state-specific discrepancies detected.
  - 🔴 **Ineligible**: Fails mandatory thresholds (e.g., income ceiling or score cutoff).
- **Granular Checks & Discrepancy Warnings**: Line-by-line validation badges (Score Cutoff, Income Bracket, Domicile match, Category certificates required) with warnings on conflicting rules.
- **One-Click Gap Investigation**: Jump directly from an eligibility check into a full Digital Dark Spot verification pipeline.

### 2. 🔍 AI-Guided Scholarship Research Intake (`/` & `IntakeForm`)
- **Natural Language Inquiry**: Ask queries like *"Am I eligible for the State Merit Scholarship 2026 as a 2nd year B.Tech student with 8.4 CGPA?"*
- **Intelligent Query Synthesis**: Combines the student's background profile with their question to generate a targeted research goal.
- **Sample Scenario Launchers**: One-click pills to test common high-stakes scenarios (State Merit Scholarship, Central Sector percentiles, OBC hostel reimbursement rules).

### 3. ⚫ The Digital Dark Spot Radar (Visual Expectation Rubric)
- **Expectation-First Methodology**: Rather than waiting for sources to define the narrative, ScholorYou generates an **explicit expectation rubric** of what an official scholarship notice *must* contain:
  1. *Eligibility & Minimum Academic Cutoffs*
  2. *Family Income Ceilings & Certifying Authorities*
  3. *Category & Reservation Quotas*
  4. *Mandatory Documents & Attestation Rules*
  5. *Renewal Conditions & Minimum CGPA Requirements*
  6. *Application Deadlines, Grace Periods & Appeal Channels*
- **Tactile Blind Spot Grid**:
  - 🟩 **Covered Areas**: Verified with supporting source evidence.
  - 🟨 **Contradictory Areas**: Conflicting statements found across documents.
  - ⬛ **Obsidian Dark Spots (`#230B0F`)**: Critical areas completely omitted by portals or blogs. Clicking any dark spot opens the exact verification action needed.

### 4. ⚡ Contradiction & Conflict Resolution Matrix (`/results/:id`)
- **Cross-Document Discrepancy Detection**: Detects conflicting claims across different sources (e.g., Official Portal lists a ₹6,00,000 family income ceiling, whereas the Directorate Gazette specifies ₹8,00,000).
- **Side-by-Side Evidence Drawer**: Inspects opposing claims side-by-side with source authority tags (Primary Government Gazette vs. Secondary EdTech Portal vs. Tertiary Forum).

### 5. 🔬 Verbatim Quote Verification Engine (`rapidfuzz` >=92%)
- **Zero-Tolerance Hallucination Guard**: Never trusts an LLM's claim blindly.
- Every quoted snippet is cross-referenced against the raw scraped HTML or PDF document using `rapidfuzz` fuzzy partial matching.
- Any claim failing the 92% verbatim threshold is visibly flagged with `⚠ Unverified Quote`.

### 6. ⏳ Source Time-Travel (Wayback Machine CDX Diffing)
- **Historical Snapshot Audit**: Automatically queries the Internet Archive Wayback Machine CDX API for official scholarship URLs.
- **Silent Policy Drift Tracking**: Detects when official portals update application deadlines (e.g., deadline extended from 15 July to 31 July) or change renewal conditions without publishing an errata.
- **Verifiable Chronology**: Converts vague "outdated information" complaints into timestamped, mathematical evidence.

### 7. 📢 False-Consensus & Echo-Chamber Detection
- **$n$-Gram Shingling & Jaccard Lexical Similarity**: Analyzes the lexical overlap between multiple secondary articles and blogs citing the same rules.
- **Copycat Detection**: When two blogs (e.g., EduNews and ScholarshipDaily) share over 50% identical $n$-gram shingles, ScholorYou flags: *"False Consensus: Sources share 94% identical text and echo a single unverified root source."*

### 8. ✅ Actionable Verification Checklist (`/results/:id/checklist`)
- **Synthesized To-Do List**: Converts dark spots, conflicts, and temporal drift into a prioritized, actionable checklist:
  - 🔴 **Critical**: Actions required to avoid application rejection.
  - 🟡 **Important**: Ambiguities to confirm with university nodal officers.
  - ⚪ **Optional**: Supporting documentation best practices.
- **State Synchronization & Persistence**: Check off completed items in real time.
- **1-Click Markdown Export**: Copy the entire checklist formatted in GitHub Markdown to share with college administrators or attach to inquiries.

### 9. 👤 Student Authentication & Profile Management (`/login`, `/register`)
- **Student Profile Hub**: Save academic credentials, caste/category status, domicile, and college affiliation.
- **Local & Persistent Auth**: Syncs state seamlessly across all pages without requiring external credential exposure during offline demos.

### 10. 🌐 Central & State Scholarship Search API (`/api/scholarships/search`)
- **Unified Querying**: Direct backend endpoint to query curated, verified schemes by name, category, or degree course.
- **Known Discrepancy Annotations**: Each scheme comes pre-annotated with known government vs. portal inconsistencies.

### 11. 🎨 ThreeUI Sable Animated WebGL TopDock
- **Immersive 3D Experience**: Custom floating top capsule navigation built with ThreeUI on Three.js r128 WebGL runtime.
- **Interactive Shader Feedback**: Smooth particle responsiveness, live active-route highlighting, and instant navigation between research, eligibility, demo, time-travel, echo detection, and checklist tabs.

---

## 🚀 System Architecture & Pipeline

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 SCHOLORYOU PIPELINE                                   │
│                                                                                        │
│  [ Student Question / Profile ] ──► [ 1. Expectation-First Rubric Generator ]          │
│                                                     │                                  │
│  [ Sources: URLs / PDF Circulars ] ─────────────────┴─► [ 2. Text Extraction & SSRF ]  │
│                                                                   │                    │
│  [ Verbatim Quote Verification ] ◄────────────────────────────────┤ (rapidfuzz >=92%)  │
│                                                                   │                    │
│  ┌──────────────────────────────┬─────────────────────────────────┴─────────────────┐  │
│  ▼                              ▼                                                   ▼  │
│ [ Innovation 1:              ] [ Innovation 2:                                   ] [ Innovation 3:              ] │
│ [ Wayback Time-Travel Engine ] [ False-Consensus & Echo Detection                ] [ The Dark Spot Radar        ] │
│ [ CDX API historical diffs   ] [ N-Gram shingle Jaccard overlap (>=50% duplicate)] [ Obsidian void visual grid] │
│  └──────────────────────────────┴─────────────────────────────────┬─────────────────┘  │
│                                                                   │                    │
│                                                                   ▼                    │
│                              [ Prioritized Student Action Checklist ]                  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏆 Scoring Alignment Matrix (Official 10-Mark Rubric)

| Criteria | Weight | How ScholorYou Delivers |
| :--- | :---: | :--- |
| **Problem Understanding & Relevance** | **15% (1.5 pts)** | Solves real-world information vulnerability in scholarships, civil exams, and grants where missing one requirement leads to disqualification. |
| **Innovation & Originality** | **20% (2.0 pts)** | Moves beyond generic chat: Wayback Machine time-travel diffing + shingle false-consensus detection + expectation-first rubric. |
| **Working Prototype & Functionality** | **25% (2.5 pts)** | Complete working pipeline: URL/PDF ingest → text parsing → quote verification → conflict resolution → live checklist. Includes instant demo runner (`/results/demo`). |
| **Technical Implementation** | **15% (1.5 pts)** | Production-grade Python FastAPI backend + SSRF protections (DNS pinning, private IP blocks) + React 18 frontend with ThreeUI WebGL TopDock. |
| **Evidence, Accuracy & Transparency** | **15% (1.5 pts)** | Every quote is checked against source text via `rapidfuzz` (>=92% verbatim match). AI claims are labeled as *"signals/potential gaps"*, never guaranteed facts. |
| **Presentation & Demo** | **10% (1.0 pts)** | ThreeUI Sable glass capsule dock, custom 4-color palette (Red Chicory, Mustard Oil, Breezy Beige, Buffalo Sauce), and interactive sliding evidence drawer. |

---

## 🛠️ Technology Stack

- **Backend**:
  - **Framework**: FastAPI (Python 3.11+)
  - **Extraction Engines**: `trafilatura` & `BeautifulSoup4` (HTML web scraping), `pypdf` (Gazette / Circular PDF extraction)
  - **Verification & Analytics**: `rapidfuzz` (fuzzy verbatim quote matching), $n$-gram shingling & Jaccard similarity
  - **Security & Networking**: Custom `ssrf.py` with socket-level DNS pinning and private subnet blocking (`10.0.0.0/8`, `127.0.0.0/8`, `192.168.0.0/16`, `169.254.0.0/16`)
  - **Data Validation**: Pydantic v2 schemas
  - **Real-Time Streaming**: Server-Sent Events (SSE) for 8-stage pipeline visualization

- **Frontend**:
  - **Framework**: React 18 with TypeScript & Vite
  - **3D & Shader Dock**: ThreeUI `AnimatedTopDock` (Sable Glass Variant) with Three.js r128 WebGL runtime
  - **Styling**: Editorial 4-color design system (Red Chicory, Mustard Oil, Breezy Beige, Buffalo Sauce) in Vanilla CSS
  - **Routing & Navigation**: React Router v6
  - **Icons & Graphics**: Custom SVG iconography + official ScholorYou brand vector assets

---

## 📦 Project Structure

```
ScholorYou/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI endpoints, SSE stream & scholarship search
│   │   ├── pipeline.py          # Multi-stage extraction & conflict engine
│   │   ├── extract.py           # HTML / PDF text extractor & authority classifier
│   │   ├── verify.py            # Verbatim quote checker & n-gram shingle analyzer
│   │   ├── ssrf.py              # Safe HTTP fetching & socket IP filter
│   │   ├── llm.py               # Swappable JSON completion provider
│   │   ├── scholarships.py      # Curated Indian scholarship database & query engine
│   │   └── demo_scholarship.json# Pre-computed scholarship dataset for zero-latency demo
│   ├── requirements.txt         # Python dependencies
│   └── .env.example             # Environment variables template
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SiteTopDock.tsx       # ThreeUI Sable animated dock integration
│   │   │   ├── DarkSpotMap.tsx       # Expectation rubric & visual dark spot matrix
│   │   │   ├── Drawer.tsx            # Verified quote & authority inspector
│   │   │   ├── TimeTravelView.tsx    # Wayback snapshot diff visualizer
│   │   │   ├── EchoDetectorView.tsx  # False-consensus shingle comparison
│   │   │   ├── ExplainerModal.tsx    # Interactive architecture explainer
│   │   │   ├── IntakeForm.tsx        # Guided student profile & question builder
│   │   │   ├── StudentAuthModal.tsx  # Student quick login/register modal
│   │   │   └── Scene.tsx             # ThreeUI shader scene canvas
│   │   ├── pages/
│   │   │   ├── Landing.tsx           # ScholorYou homepage & quick launch
│   │   │   ├── Eligibility.tsx       # Interactive student eligibility evaluation
│   │   │   ├── Workspace.tsx         # Source entry (URLs/PDFs) & live SSE tracker
│   │   │   ├── Results.tsx           # Findings dashboard, tabs, and filters
│   │   │   ├── Checklist.tsx         # Prioritized verification checklist
│   │   │   └── Login.tsx             # Student account & profile settings
│   │   ├── shaders/                  # ThreeUI Three.js shader implementations
│   │   ├── utils/                    # Local storage & student profile helpers
│   │   ├── types.ts                  # TypeScript interface definitions
│   │   └── styles.css                # 4-color palette tokens & responsive CSS
│   ├── public/                       # Logos, brand marks & favicon assets
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── SUBMISSION.md                     # Unista Hackathon Submission Kit
├── .gitignore                        # Comprehensive security & build exclusions
└── README.md                         # Project documentation
```

---

## ⚡ Quickstart & Local Installation

### Prerequisites
- **Node.js**: v18+ & npm
- **Python**: 3.10+
- **OS**: Linux / macOS / Windows WSL

### 1. Backend Setup
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env    # Optional: configure custom LLM API key if desired
uvicorn app.main:app --reload --port 8000
```
- Health check: `http://localhost:8000/api/health` ➔ `{"ok": true}`
- Scholarships search check: `http://localhost:8000/api/scholarships/search?q=merit`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Open **`http://localhost:5173`** in your browser.

---

## 🎬 3-Minute Interactive Demo Walkthrough

1. **Brand Homepage (`/`)**:
   - Greeted by the floating **ThreeUI Sable TopDock** and ScholorYou brand insignia.
   - Click **"Check Student Eligibility →"** or explore sample pills.
2. **Student Eligibility Evaluator (`/eligibility`)**:
   - Select your scholarship scheme (e.g., *State Merit Scholarship Scheme 2026*).
   - Adjust Academic Year, Category (e.g., *OBC-NCL*), Domicile State (*Delhi*), Family Income (*₹2.5L - ₹6.0 Lakhs*), and Score (*8.4 CGPA*).
   - View the instant verdict: **Conditional / Verification Required**, highlighting conflicting income thresholds between the official gazette (₹8.0L) and the portal (₹6.0L).
3. **Workspace Pipeline (`/workspace/:id`)**:
   - Click **"⚡ Fill 3 Sample Sources"** to automatically load 3 real-world scholarship URLs.
   - Click **"Run Analysis →"** to watch the 8-stage pipeline execute with live SSE status updates.
   - *(Or click "View sample analysis" on the landing page for zero-latency instant loading).*
4. **Results Dashboard (`/results/demo`)**:
   - **Expectation Rubric & Dark Spot Grid**: Inspect the 6 rubric areas. Click the obsidian void **"Renewal Conditions (Dark Spot)"** to inspect why zero sources mentioned the mandatory renewal CGPA.
   - **Contradiction Matrix**: Click **"Possible Conflict: Family Income Limit"** to view side-by-side quotes: ₹6,00,000 (Portal) vs ₹8,00,000 (Gazette) with verbatim verification stamps.
   - **Source Time-Travel Tab (⏳)**: View the Wayback Machine timeline showing how the deadline shifted from July 15 to July 31.
   - **False-Consensus Tab (📢)**: See how EduNews and ScholarshipDaily share 94% identical text, proving they are copycat echoes.
5. **Actionable Verification Checklist (`/results/demo/checklist`)**:
   - Check off prioritized action items categorized by **Critical**, **Important**, and **Optional**.
   - Click **"Copy Checklist (Markdown)"** to instantly copy formatted notes to your clipboard.

---

## 🔒 Security & Evidence Integrity

- **SSRF Defense**: Automated fetch requests pass through `ssrf.py`, which validates URL schemes, resolves IPs synchronously, and drops any private, loopback, or link-local subnet connections.
- **Hallucination Shield**: An LLM quotation is never taken as proof. The backend executes `rapidfuzz.fuzz.partial_ratio` between the quote and raw extracted text. Quotes failing the 92% threshold are marked with `⚠ Unverified Quote`.
- **Epistemic Humility**: Every signal is explicitly labeled as a *"Potential Gap"* or *"Signal"*, preventing false certainty.

---

## 🔮 Future Roadmap
- **Direct DigiLocker / ABC Integration**: Automatically import student marks and income certificates to verify eligibility in one tap.
- **Automated FOIA / RTI Generator**: Pre-fill Right to Information requests for dark spots that remain unanswered across all public sources.
- **Autonomous Monitoring Daemons**: Background cron-tasks that watch official state scholarship URLs and notify students whenever a dark spot or temporal drift is detected.

---
**Shinchan Online Hackathon 2026** • Built with ❤️ by **Devengers**.
