# Digital Dark Spot
### AI-Assisted Information Gap & Decision Verification Platform
**Shinchan Online Hackathon 2026** • *Web Development • Artificial Intelligence • Research & Information Technology*

---

## 📌 Executive Summary

People rely on online sources to make high-stakes decisions about education, careers, public services, research, and legal matters. However, online information is fragmented, outdated, conflicting, and incomplete. 

- **Search engines** help you find documents.
- **AI summarizers** condense what is already written.
- **Neither tells you what is missing, what is contradictory, or what is an unverified copycat rumor.**

**Digital Dark Spot** is an AI-assisted verification platform that analyzes multi-source research, detects critical information blind spots before reading, traces claims to verbatim source evidence, detects temporal drift through Wayback Machine archives, and filters out false-consensus echo chambers.

---

## 🚀 The 3 Core Innovations (Beyond Standard LLM Wrappers)

Most hackathon submissions wrap an LLM prompt asking for a summary and a guess at gaps. Digital Dark Spot introduces three architectural innovations that provide verifiable, mathematically backed evidence:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       DIGITAL DARK SPOT PIPELINE                            │
│                                                                             │
│  [ Research Goal ] ──► [ 1. Expectation-First Rubric ]                      │
│                                 │                                           │
│  [ Sources: URL / PDF ] ────────┴─► [ 2. Atomic Claim Extraction ]          │
│                                           │                                 │
│  [ Verbatim Quote Verification ] ◄────────┤ (rapidfuzz partial ratio >=92)  │
│                                           │                                 │
│  ┌───────────────────────┬────────────────┴─────────────────────────┐       │
│  ▼                       ▼                                          ▼       │
│ [ Innovation 1:       ] [ Innovation 2:                         ] [ Innovation 3:       ] │
│ [ Source Time-Travel  ] [ False-Consensus & Echo Detection      ] [ The Dark Spot Radar ] │
│ [ Wayback CDX diffs   ] [ N-Gram shingle Jaccard overlap (>=50%)] [ Obsidian void visual] │
│  └───────────────────────┴────────────────┬─────────────────────────┘       │
│                                           │                                 │
│                                           ▼                                 │
│                      [ Prioritized Verification Checklist ]                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1. ⏳ Source Time-Travel (Wayback Machine Diffing)
- **The Problem**: Sources quietly change deadlines, policies, or criteria without notifying users. Other blogs keep citing stale information.
- **The Solution**: Queries the Internet Archive Wayback Machine CDX API for official URLs across time. When the content digest changes, our diff engine compares historical snapshots (e.g. *Official deadline extended from 15 July to 31 July*).
- **Impact**: **Staleness becomes verifiable chronological evidence**, rather than just guessing "no date found".

### 2. 📢 False-Consensus & Echo-Chamber Detection
- **The Problem**: If three blogs all say the deadline is July 15, users believe they have "three independent confirmations." In reality, two of them simply copy-pasted the first.
- **The Solution**: Using $n$-gram shingle overlap and Jaccard similarity analysis, the platform analyzes lexical proximity across sources. When overlap exceeds 50%, it flags: *"False Consensus: Sources share identical text verbatim and trace back to a single origin."*
- **Impact**: Protects applicants from being tricked by viral misinformation masquerading as consensus.

### 3. ⚫ Expectation-First Rubric & The Dark Spot Radar
- **The Problem**: If an LLM only reads the sources you give it, it inherits their blind spots.
- **The Solution**: Before ingesting any source, the system generates an explicit expectation rubric of what a complete, safe answer must contain (e.g. *Eligibility, Income Limit, Documents, Renewal Conditions, Appeals*).
- **The Visual Edge**: Rubric areas are rendered on a tactile grid. Covered areas light up, conflicts glow amber, and unmentioned areas stay as **literal obsidian Dark Spots** (`#230B0F`). Clicking any spot opens the exact checklist action required.

---

## 🏆 Scoring Alignment Matrix (Official 10-Mark Rubric)

| Criteria | Weight | How Digital Dark Spot Solves It |
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
  - **Data Parsing**: `trafilatura` & `BeautifulSoup4` (HTML extraction), `pypdf` (PDF extraction)
  - **Verification Engine**: `rapidfuzz` (fuzzy verbatim quote matching), $n$-gram shingling (Jaccard similarity)
  - **Security**: SSRF protection with socket-level DNS pinning and private subnet blocking (`10.0.0.0/8`, `127.0.0.0/8`, `192.168.0.0/16`, `169.254.0.0/16`)
  - **Data Validation**: Pydantic v2 schemas
  - **Streaming**: Server-Sent Events (SSE) for pipeline stage monitoring

- **Frontend**:
  - **Framework**: React 18, Vite, TypeScript
  - **3D / Shader UI**: ThreeUI `AnimatedTopDock` (Sable Glass Variant) with Three.js r128 WebGL runtime
  - **Styling**: Curated 4-color editorial design system (Red Chicory, Mustard Oil, Breezy Beige, Buffalo Sauce) in Vanilla CSS
  - **Routing**: React Router v6

---

## 📦 Project Structure

```
digital-dark-spot/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI endpoints & SSE stream
│   │   ├── pipeline.py          # Multi-stage extraction & conflict engine
│   │   ├── extract.py           # HTML / PDF text extractor & authority detector
│   │   ├── verify.py            # Verbatim quote checker & n-gram shingle analyzer
│   │   ├── ssrf.py              # Safe HTTP fetching & IP filter
│   │   ├── llm.py               # Swappable JSON completion provider
│   │   └── demo_scholarship.json# Pre-computed scholarship dataset for instant demo
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SiteTopDock.tsx  # ThreeUI Sable animated dock integration
│   │   │   ├── DarkSpotMap.tsx  # Expectation rubric & visual dark spot matrix
│   │   │   ├── Drawer.tsx       # Verified quote & authority inspector
│   │   │   ├── TimeTravelView.tsx # Wayback snapshot diff visualizer
│   │   │   ├── EchoDetectorView.tsx # False-consensus shingle comparison
│   │   │   └── ExplainerModal.tsx # Interactive architecture explainer
│   │   ├── pages/
│   │   │   ├── Landing.tsx      # Platform overview & 3 pillars
│   │   │   ├── Workspace.tsx    # Source entry (URLs/PDFs) & live SSE tracker
│   │   │   ├── Results.tsx      # Findings dashboard, tabs, and filters
│   │   │   └── Checklist.tsx    # Prioritized verification checklist
│   │   ├── shaders/             # ThreeUI Three.js shader implementations
│   │   └── styles.css           # 4-color palette tokens & responsive CSS
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## ⚡ Quickstart & Local Installation

### Prerequisites
- Node.js 18+ & npm
- Python 3.10+
- Linux / macOS / Windows WSL

### 1. Backend Setup
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env    # Optional: configure custom LLM API key
uvicorn app.main:app --reload --port 8000
```
Backend health check: `http://localhost:8000/api/health` ➔ `{"ok": true}`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🎬 2-Minute Judge Demo Walkthrough

1. **Landing Page (`/`)**:
   - Notice the **ThreeUI Sable Dock** floating smoothly at the top.
   - Click **"Explore Demo Results"** or **"Launch Workspace"**.
2. **Workspace (`/workspace`)**:
   - Click **"⚡ Fill 3 Sample Sources"** to load the State Merit Scholarship scenario.
   - Click **"Run Analysis →"** to watch the 8-stage pipeline execute with live status updates.
   - *Alternatively, click "Or view pre-computed demo results" for instant zero-latency loading.*
3. **Results Dashboard (`/results/demo`)**:
   - **Expectation Rubric & Dark Spot Grid**: Note the 6 rubric areas. Click on the obsidian void **"Renewal Conditions (Dark Spot)"** to open the drawer showing zero source coverage.
   - **Conflicting Claims**: Click on **"Possible Conflict: Family Income Limit"** to inspect side-by-side quotes: ₹6,00,000 (Portal) vs ₹8,00,000 (Notification PDF) with verbatim verified stamps.
   - **Source Time-Travel Tab (⏳)**: View the Wayback Machine timeline showing how the official application deadline extended from 15 July to 31 July.
   - **False-Consensus Tab (📢)**: See how EduNews and ScholarshipDaily share 94% identical text, proving they are a copycat echo rather than two independent sources.
4. **Verification Checklist (`/checklist`)**:
   - Check off prioritized action items categorized by **Critical**, **Important**, and **Optional**.

---

## 🔒 Security & Evidence Integrity

- **SSRF Defense**: Automated fetch requests pass through `ssrf.py`, which validates URL schemes, resolves IPs synchronously, and drops any private, loopback, or link-local subnet connections.
- **Hallucination Shield**: An LLM quotation is never taken as proof. The backend executes `rapidfuzz.fuzz.partial_ratio` between the quote and raw extracted text. Quotes failing the 92% threshold are marked with `⚠ Unverified Quote`.
- **Epistemic Humility**: Every signal is explicitly labeled as a *"Potential Gap"* or *"Signal"*, preventing false certainty.

---

## 🔮 Future Scope
- **Domain-Specific Ontologies**: Pre-packaged expectation rubrics for clinical trials, visa applications, and SEC filings.
- **Automated FOIA / RTI Generator**: Pre-fill Right to Information requests for dark spots that remain unanswered across all public sources.
- **Autonomous Monitoring Daemons**: Background cron-tasks that watch official URLs and trigger alerts whenever a dark spot or temporal drift is detected.

---
**Shinchan Online Hackathon 2026** • Built by Devengers.
