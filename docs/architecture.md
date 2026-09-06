# MEDSAFE - Architecture Specification

## Overview

MEDSAFE is structured as an explainable, transparent clinical decision-support application. The software architecture strictly isolates synthetic dataset pipelines, explainable rule matching engines, relational persistence, REST APIs, and a modern TypeScript user interface.

```
+-----------------------------------------------------------------------+
|                         React / Vite Frontend                         |
|  (TypeScript, Tailwind CSS, Lucide Icons, Recharts, React Router)    |
+-----------------------------------------------------------------------+
                                   |
                             HTTP / REST (JWT)
                                   v
+-----------------------------------------------------------------------+
|                           FastAPI Backend                             |
|  - Auth & Security (JWT, bcrypt)                                      |
|  - RBAC Enforcement (DOCTOR, NURSE, ADMIN)                             |
|  - Audit Log Service                                                  |
|  - Patient Data REST API                                              |
|  - Decision Support API                                               |
+-----------------------------------------------------------------------+
                                   |
                         SQLAlchemy ORM / SQLite
                                   v
+-----------------------------------------------------------------------+
|                    Explainable Rule-Based Risk Engine                 |
|  - Allergy Rules (Cross-reactivity matching)                          |
|  - Interaction Rules (Synthetic drug-drug combinations)               |
|  - Comorbidity Rules (Drug-condition contraindications)              |
|  - Observation Context (Creatinine & BP escalation)                  |
|  - Scoring Engine (0-100 score, confidence & harm disclaimers)        |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                      Synthetic Data Pipeline                          |
|  - scripts/generate_data.py (100 synthetic + 8 explicit DEMO patients)|
|  - scripts/clean_data.py (Normalization, deduplication, report)       |
|  - scripts/run_evaluation.py (Empirical baseline vs prototype runner) |
+-----------------------------------------------------------------------+
```

## Component Breakdown

1. **Frontend**: Vite-powered React single page app with Tailwind CSS styling, responsive sidebar navigation, interactive evidence drawers, clinician review workflow modals, baseline comparison mode, and evaluation dashboard.
2. **Backend API**: FastAPI framework providing password hashing (bcrypt), OAuth2 JWT bearer tokens, role-based access control, tamper-evident audit logging, and risk alert review management.
3. **Transparent Risk Engine**: Fully deterministic, rule-based decision support engine. Avoids black-box ML models to maintain explainability in medical safety evaluation.
4. **Data & Persistence**: SQLite database initialized via SQLAlchemy ORM. Synthetic raw datasets cleansed and normalized prior to database seeding.
