# MEDSAFE - Privacy & Data Protection Specification

## Principles

1. **Synthetic Data Policy**:
   - MEDSAFE uses 100% algorithmically generated synthetic patient data (P001-P100, DEMO-001 to DEMO-008). No Protected Health Information (PHI) or Personally Identifiable Information (PII) is collected or stored.

2. **Role-Based Access Control (RBAC)**:
   - Access is restricted based on JWT user roles:
     - **DOCTOR**: Access to patient directory, detailed records, risk summaries, evidence drawers, review workflow.
     - **NURSE**: Access to patient directory, active medication status, allergy alerts, basic risk alerts.
     - **ADMIN**: Access to system performance metrics, evaluation results, user management, and audit logs. Clinical detail exposure is minimized.

3. **Tamper-Evident Audit Logging**:
   - All critical actions (login, consent, patient views, evidence views, alert reviews, feedback submissions) are recorded in SQLite with timestamp, username, role, action, patient ID, and details.

4. **Local Execution Boundary**:
   - Runs locally without requiring paid external APIs or third-party cloud data processing.
