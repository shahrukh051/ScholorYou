# Unista Submission Kit: Digital Dark Spot
**Shinchan Online Hackathon 2026**
*Submission Deadline: 1 November 2026 • 5:00 PM*

---

### Field 1: Project Name (Mandatory)
```text
Digital Dark Spot: AI-Assisted Information Gap & Verification Platform
```

---

### Field 2: Project Description (Mandatory)
*(Copy and paste the formatted text below directly into the Unista project description box)*

```markdown
### 1. Problem Statement
When people make high-stakes decisions regarding scholarships, government schemes, university admissions, and public regulations, they face a dangerous form of information blindness:
- Search engines only surface documents that already exist.
- AI summarizers condense what is already written.
- Neither tool tells the user what is missing, what has quietly changed, or whether multiple agreeing websites are merely unverified copycats.
Missing a single undisclosed renewal clause, an unannounced deadline extension, or conflicting income criteria can cost an applicant their scholarship or admission.

### 2. Proposed Solution
Digital Dark Spot is an AI-assisted research and decision verification platform that moves beyond generic chatbots. Rather than simply summarizing text, Digital Dark Spot:
1. Generates an expectation rubric of what a complete answer must contain before reading any source.
2. Extracts atomic factual claims and verifies every quoted sentence directly against raw source text using fuzzy string matching.
3. Visually maps information blind spots as literal "Dark Spots" on an interactive rubric grid.
4. Uses Wayback Machine historical diffing to catch silent deadline and policy changes over time.
5. Employs n-gram shingle overlap analysis to expose false-consensus echo chambers where blogs simply copy each other.
6. Generates an actionable, prioritized verification checklist guiding users on what official documents to verify next.

### 3. How the Project Works (Workflow)
1. Ingestion: Users enter a research question or goal and input multi-format sources (web URLs, PDF documents, or sample datasets). Ingestion features SSRF defense with synchronous DNS pinning and private subnet blocking.
2. Expectation Rubric Generation: The system establishes what a complete, safe answer requires across core topics (e.g., Eligibility, Documents, Income Limits, Renewal Policy, Deadlines) before reading the sources.
3. Evidence Extraction & Strict Verification: Atomic claims are extracted with verbatim quotations. A dedicated verification engine cross-references quotes against source text using rapidfuzz partial ratio matching (>=92%). Any unverified quote is visibly flagged.
4. Multi-Stage Pipeline Analysis: The system analyzes cross-source contradictions, queries temporal snapshots, and runs n-gram shingle overlap to measure source independence.
5. Interactive Results Dashboard: Findings are presented via an interactive Expectation Grid, sliding Evidence Drawer with source authority tags (Official, Secondary, Community), Time-Travel timeline, and a Prioritized Action Checklist.

### 4. Major Features
- Expectation Rubric & Dark Spot Grid: Visual 2D/3D matrix highlighting verified topics, conflicting points, and literal obsidian "Dark Spots" where information is missing.
- Source Time-Travel (Wayback Diff): Historical CDX diffing that detects when an official portal quietly alters deadlines or rules, turning staleness into hard evidence.
- False-Consensus & Echo Detector: N-gram shingle comparison with Jaccard coefficient analysis to detect copycat articles masquerading as separate confirmations.
- Verbatim Evidence Inspection: Sliding drawer showing side-by-side quotes, source authority rankings, and tamper-proof verification stamps.
- Prioritized Next-Step Checklist: Actionable checklist categorizing tasks into Critical, Important, and Optional steps.
- Zero-Latency Demo Pack: Built-in pre-computed scholarship case (`/results/demo`) ensuring instant, bulletproof demonstrations during evaluation.

### 5. Uniqueness & Innovation
While standard submissions use a basic LLM prompt to summarize and guess gaps, Digital Dark Spot implements three verifiable, mathematically grounded innovations:
1. Wayback Machine CDX Time-Travel: Transforms temporal staleness from an omission into demonstrable chronological evidence.
2. N-Gram Shingle Overlap (False Consensus): Distinguishes independent confirmation from viral republishing.
3. Expectation-First Rubric: Prevents the system from inheriting the blind spots of the reviewed sources by defining completeness before ingestion.
4. Epistemic Transparency: Every signal is strictly labeled as a "Potential Gap" or "Signal", with confidence ratings (Low, Medium, High) rather than asserting unverified certainty.

### 6. Technology Stack
- Backend: Python 3.11, FastAPI, Pydantic v2, RapidFuzz, Trafilatura, BeautifulSoup4, PyPDF, Uvicorn, Server-Sent Events (SSE).
- Security: Socket-level SSRF protection, IP sanitization, and DNS pinning.
- Frontend: React 18, TypeScript, Vite, Vanilla CSS design tokens.
- UI/3D Components: ThreeUI AnimatedTopDock (Sable Glass Variant) with WebGL and Three.js r128 runtime.
- Design System: Curated 4-color palette (Red Chicory #A73D4D, Mustard Oil #D4C26B, Breezy Beige #F7F2D7, Buffalo Sauce #F25A1A).

### 7. Future Scope
- Automated FOIA / RTI Request Generator: One-click drafting of Right to Information filings for persistent dark spots.
- Domain-Specific Ontologies: Ready-made rubrics for clinical trial evaluation, legal due diligence, and visa compliance.
- Autonomous Monitoring Watchdogs: Background cron daemons that track official portals and notify citizens immediately when a policy drifts.
```

---

### Field 3: GitHub Repository Link (Mandatory)
```text
https://github.com/<your-username>/digital-dark-spot
```
*(Ensure your repository is set to **Public** before submitting, and that `README.md` is at the root).*

---

### Optional Fields (Helpful for Scoring 10/10)
- **Live Demo Link (Optional)**: `http://localhost:5173` (or your deployed URL if hosted)
- **Demo Video Link (Optional)**: A 2-minute Loom/YouTube screen recording demonstrating the scholarship use case:
  1. Open `/` ➔ Click "Explore Demo Results"
  2. Inspect the Dark Spot on "Renewal Conditions"
  3. Inspect the Conflict on "Family Income Limit"
  4. View the Wayback Machine Time-Travel diff on the deadline
  5. View the Echo Detector comparing EduNews vs ScholarshipDaily
  6. Check off items in the Verification Checklist
