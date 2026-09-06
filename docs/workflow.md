# MEDSAFE - Clinical Workflow Guide

## User Journey

```
[LOGIN] ──► [CONSENT NOTICE] ──► [WARD DASHBOARD] ──► [PATIENT SELECT] ──► [SAFETY ALERT] ──► [EVIDENCE DRAWER] ──► [CLINICIAN REVIEW] ──► [AUDIT LOG]
```

1. **Authentication (`/login`)**:
   - Clinician logs into the workstation using demo credentials (`doctor / doctor123`, `nurse / nurse123`, `admin / admin123`).

2. **Mandatory Consent Acknowledgment (`/consent`)**:
   - System enforces acceptance of the decision support notice and safety disclaimer. This action generates a `CONSENT_ACCEPTED` audit log event.

3. **Ward Safety Dashboard (`/dashboard`)**:
   - Displays real-time ward population overview, KPI cards (High Priority, Moderate Priority, Needs Review, Average Identification Time), and dedicated demo patient shortcuts.

4. **Patient Review & Decision Support (`/patients/:id`)**:
   - Surfaces active medications, documented allergies, comorbidities, and recent observations.
   - Presents prioritized safety alerts with rule match confidence %, traceable evidence bullets, potential harm disclaimers, and safety notices.

5. **Traceable Evidence Inspection**:
   - Clicking "View Evidence" slides out an audit drawer displaying source record dates, match types, and recency context.

6. **Clinician Review Submission**:
   - Clinician marks alert status (`REVIEWED_NO_ACTION`, `REVIEWED_FOLLOW_UP`, `FALSE_POSITIVE`, `UNABLE_TO_DETERMINE`) and inputs clinical notes. Recorded immutably in the audit log.
