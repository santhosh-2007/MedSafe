from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.models.domain import User, RiskAlert, AuditLog
from backend.app.schemas.domain import RiskAlertSchema, ReviewRequest
from backend.app.auth.security import get_current_user
from backend.app.auth.rbac import require_roles

router = APIRouter(prefix="/api", tags=["Risk Alerts"])

@router.get("/patients/{patient_id}/risks", response_model=List[RiskAlertSchema])
def get_patient_risks(
    patient_id: str,
    current_user: User = Depends(require_roles(["DOCTOR", "NURSE"])),
    db: Session = Depends(get_db)
):
    return db.query(RiskAlert).filter(RiskAlert.patient_id == patient_id).all()

@router.get("/risks/{risk_id}", response_model=RiskAlertSchema)
def get_risk_by_id(
    risk_id: str,
    current_user: User = Depends(require_roles(["DOCTOR", "NURSE"])),
    db: Session = Depends(get_db)
):
    alert = db.query(RiskAlert).filter(RiskAlert.risk_id == risk_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Risk alert not found")

    # Audit evidence viewing
    audit = AuditLog(
        username=current_user.username,
        role=current_user.role,
        action="EVIDENCE_VIEWED",
        patient_id=alert.patient_id,
        details=f"Viewed evidence details for risk alert {risk_id} ({alert.risk_type})"
    )
    db.add(audit)
    db.commit()

    return alert

@router.post("/risks/{risk_id}/review", response_model=RiskAlertSchema)
def review_risk_alert(
    risk_id: str,
    req: ReviewRequest,
    current_user: User = Depends(require_roles(["DOCTOR"])),
    db: Session = Depends(get_db)
):
    alert = db.query(RiskAlert).filter(RiskAlert.risk_id == risk_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Risk alert not found")

    valid_statuses = ["REVIEWED_NO_ACTION", "REVIEWED_FOLLOW_UP", "FALSE_POSITIVE", "UNABLE_TO_DETERMINE"]
    if req.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid review status. Must be one of {valid_statuses}")

    alert.status = req.status
    alert.review_comment = req.comment or ""
    alert.reviewed_by = current_user.username
    alert.reviewed_at = datetime.utcnow()

    # Log audit event
    audit = AuditLog(
        username=current_user.username,
        role=current_user.role,
        action="ALERT_REVIEWED",
        patient_id=alert.patient_id,
        details=f"Alert {risk_id} reviewed with status '{req.status}'. Comment: '{req.comment}'"
    )
    db.add(audit)
    db.commit()
    db.refresh(alert)

    return alert
