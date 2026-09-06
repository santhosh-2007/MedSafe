from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.models.domain import User, Feedback, AuditLog
from backend.app.schemas.domain import FeedbackRequest
from backend.app.auth.security import get_current_user
from backend.app.auth.rbac import require_roles

router = APIRouter(prefix="/api/feedback", tags=["Feedback"])

@router.post("")
def submit_feedback(
    req: FeedbackRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not (1 <= req.usability_score <= 5 and 1 <= req.evidence_clarity_score <= 5 and 1 <= req.uncertainty_clarity_score <= 5):
        raise HTTPException(status_code=400, detail="Ratings must be between 1 and 5.")

    fb = Feedback(
        username=current_user.username,
        usability_score=req.usability_score,
        evidence_clarity_score=req.evidence_clarity_score,
        uncertainty_clarity_score=req.uncertainty_clarity_score,
        comments=req.comments or ""
    )
    db.add(fb)

    audit = AuditLog(
        username=current_user.username,
        role=current_user.role,
        action="FEEDBACK_SUBMITTED",
        patient_id="",
        details=f"Usability: {req.usability_score}/5, Evidence: {req.evidence_clarity_score}/5, Uncertainty: {req.uncertainty_clarity_score}/5"
    )
    db.add(audit)
    db.commit()

    return {"status": "SUCCESS", "message": "Feedback recorded successfully."}

@router.get("/summary")
def get_feedback_summary(
    current_user: User = Depends(require_roles(["ADMIN", "DOCTOR"])),
    db: Session = Depends(get_db)
):
    feedbacks = db.query(Feedback).all()
    if not feedbacks:
        return {
            "total_responses": 0,
            "avg_usability": 0.0,
            "avg_evidence_clarity": 0.0,
            "avg_uncertainty_clarity": 0.0,
            "responses": []
        }

    total = len(feedbacks)
    avg_u = sum(f.usability_score for f in feedbacks) / total
    avg_e = sum(f.evidence_clarity_score for f in feedbacks) / total
    avg_unc = sum(f.uncertainty_clarity_score for f in feedbacks) / total

    return {
        "total_responses": total,
        "avg_usability": round(avg_u, 2),
        "avg_evidence_clarity": round(avg_e, 2),
        "avg_uncertainty_clarity": round(avg_unc, 2),
        "responses": [
            {
                "username": f.username,
                "usability": f.usability_score,
                "evidence_clarity": f.evidence_clarity_score,
                "uncertainty_clarity": f.uncertainty_clarity_score,
                "comments": f.comments,
                "created_at": f.created_at.isoformat()
            } for f in feedbacks
        ]
    }
