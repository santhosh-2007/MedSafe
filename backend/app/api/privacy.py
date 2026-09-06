from fastapi import APIRouter

router = APIRouter(prefix="/api/privacy", tags=["Privacy"])

@router.get("")
def get_privacy_statement():
    return {
        "title": "MEDSAFE Privacy & Data Protection Statement",
        "data_mode": "SYNTHETIC_DATA_ONLY",
        "notice": "This academic prototype relies exclusively on algorithmically generated synthetic patient profiles. No Real Patient Information (PHI/PII) is processed, stored, or transmitted.",
        "principles": [
            {
                "name": "Synthetic Data Guarantee",
                "description": "All patient identifiers (P001-P100, DEMO-001 to DEMO-008), clinical histories, and observations are synthetic."
            },
            {
                "name": "Data Minimization & Role-Based Access Control (RBAC)",
                "description": "Access is strictly enforced via JWT authentication. Administrative users have access to system performance and evaluation metrics only, preventing unnecessary clinical detail exposure."
            },
            {
                "name": "Audit Logging",
                "description": "All user actions (login, consent, patient views, risk views, reviews, feedback) are recorded with timestamps for governance."
            },
            {
                "name": "Local Execution Boundary",
                "description": "No external third-party LLM or paid web services are invoked. Data remains strictly within the local application boundary."
            }
        ],
        "disclaimer": "MEDSAFE is an academic research prototype for clinical decision support evaluation. It does NOT replace human clinical judgment or constitute a certified medical device."
    }
