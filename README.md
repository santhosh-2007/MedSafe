# MEDSAFE

### Medication Safety & Clinical Decision Support

> **Tagline:** *"Surface the right evidence. Support safer clinical review."*

---

## Executive Summary

Hospital clinicians manage patients whose conditions and treatments evolve rapidly between ward rounds. Important safety-critical information can be buried across long longitudinal records—including active medications, past allergies, comorbidities, and lab trends—increasing the search time required to spot potential medication interaction risks.

**MEDSAFE** is a decision-support prototype built to summarize:
```
MEDICATIONS + ALLERGIES + COMORBIDITIES + RECENT OBSERVATIONS
```
and highlight potential:
1. **Medication-Allergy risks**
2. **Medication-Medication interaction risks**
3. **Medication-Comorbidity risks**
4. **Relevant recent-observation context**

---

## Demo Accounts (Demo Environment)

| Role | Username | Password | Access Capabilities |
|---|---|---|---|
| **Doctor / Clinician** | `doctor` | `doctor123` | Patient list, profiles, risk alerts, evidence drawers, review workflow, audit log, feedback |
| **Nurse** | `nurse` | `nurse123` | Patient list, medication status, allergy alerts, basic risk alerts |
| **Administrator** | `admin` | `admin123` | System metrics, user management, audit logs, evaluation metrics |

---

## Primary Measurable Objective & Measured Results

* **Target Objective:** "Reduce median risk-identification time by at least 25% compared with baseline."
* **Baseline Median Time (Chronological Record):** `29.5 seconds`
* **MEDSAFE Median Time (Prioritized Summary):** `4.5 seconds`
* **Measured Time Reduction:** `84.7%` (Target Achieved)
* **Precision:** `0.615` | **Recall:** `0.800` | **F1 Score:** `0.695`

---

## Technology Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Recharts, React Router v6
- **Backend API:** Python 3.11+, FastAPI, Pydantic v2, PyJWT, Passlib (bcrypt)
- **Database:** SQLite with SQLAlchemy ORM
- **Testing:** Pytest
- **Containerization:** Docker & Docker Compose

---

## Dedicated Demo Patient Scenarios

- `DEMO-001`: Medication-Allergy Risk (Amoxicillin active vs Penicillin allergy documented)
- `DEMO-002`: Medication-Medication Risk (Warfarin + Aspirin concurrent therapy)
- `DEMO-003`: Medication-Comorbidity Risk (Gentamicin active with Chronic Kidney Disease Stage 3)
- `DEMO-004`: Missing Allergy Information (Edge case: empty allergy documentation)
- `DEMO-005`: Conflicting Allergy Records (Penicillin recorded as SEVERE and INACTIVE)
- `DEMO-006`: Unknown Medication ("UnrecognizedDrug-X9")
- `DEMO-007`: Duplicate Medication Orders (Duplicate Lisinopril entries)
- `DEMO-008`: No Significant Priority Alert (Safe regimen: Metformin + Atorvastatin)

---

## Installation & Local Execution

### 1. Backend Setup & Data Initialization

```bash
# Install Python backend dependencies
pip install -r backend/requirements.txt

# Run synthetic data generator, data cleaning, DB seed, and evaluation benchmark
python scripts/generate_data.py
python scripts/clean_data.py
python scripts/seed_database.py
python scripts/run_evaluation.py

# Start FastAPI dev server
uvicorn backend.app.main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

### 3. Automated Tests

```bash
pytest
```

### 4. Running with Docker Compose

```bash
docker-compose up --build
```

---

## Three-Minute Demo Script

1. **0:00–0:20 (Problem):** Log in as `doctor / doctor123`, accept the Consent Notice, and introduce the challenge of long longitudinal records.
2. **0:20–0:45 (Baseline):** Open `/baseline` and demonstrate the search effort required to find risks in chronological records (29.5s).
3. **0:45–1:30 (MEDSAFE):** Open `/patients/DEMO-001` to show the prioritized safety card highlighting Amoxicillin ↕ Penicillin allergy.
4. **1:30–2:00 (Evidence & Safety):** Click **View Evidence** to open the audit drawer (confidence 91%, potential harm, and disclaimers).
5. **2:00–2:20 (Review & Edge Cases):** Click **Mark Reviewed**, record clinical notes, view `/audit-logs` and `/failure-cases`.
6. **2:20–3:00 (Results):** Open `/evaluation` to show the **84.7% time reduction** chart and statistical performance.

---

## Medical Safety Disclaimer

MEDSAFE is an academic research prototype using synthetic data. It is NOT a diagnostic or prescription ordering system and does NOT replace human clinical judgment.
