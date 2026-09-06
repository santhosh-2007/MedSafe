# MEDSAFE - Three-Minute Product Demonstration Script

## Overview
This script is designed for hackathon judges, university evaluators, or academic research reviewers.

---

### 0:00–0:20 | Problem Statement
> *"Hospital clinicians manage complex patients whose treatments change across ward rounds. Critical information—such as active medications, past allergies, comorbidities, and lab values—is often buried across long longitudinal records. This increases search time and risks missing critical safety concerns."*

---

### 0:20–0:45 | Baseline EHR View vs MEDSAFE
> *"First, let's look at the standard Baseline view (`/baseline`). Here we see raw chronological medical records. Finding a medication-allergy risk like Amoxicillin vs Penicillin requires manual scrolling through dozens of entries, taking an average of 29.5 seconds."*

---

### 0:45–1:30 | MEDSAFE Patient Summary (`DEMO-001`)
> *"Now let's open MEDSAFE's summary for patient **DEMO-001** (`/patients/DEMO-001`). Instantly, the prioritized risk engine highlights a **HIGH PRIORITY Medication-Allergy Concern**."*

---

### 1:30–2:00 | Evidence, Confidence & Safety Disclaimers
> *"Clicking 'View Evidence' opens the traceable audit drawer. It shows the exact rule match, active medication start dates, and allergen documentation dates. Notice that system confidence is clearly marked as 91% match confidence, accompanied by potential harm warnings and safety disclaimers."*

---

### 2:00–2:20 | Clinician Review & Edge Cases
> *"The clinician can mark the alert as reviewed (`Reviewed — no further action`), which is immutably logged in the audit trail (`/audit-logs`). In Failure Cases (`/failure-cases`), we see how the system robustly handles missing allergies, conflicting records, and unknown drugs."*

---

### 2:20–3:00 | Measured Evaluation & Conclusion
> *"Finally, in the Evaluation Dashboard (`/evaluation`), empirical benchmark results show an **84.7% reduction in risk identification time** (4.5s vs 29.5s), comfortably exceeding our 25% target. MEDSAFE surfaces the right evidence while keeping the clinician firmly in control."*
