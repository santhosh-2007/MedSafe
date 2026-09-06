from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.models.domain import User, AuditLog
from backend.app.schemas.domain import AuditLogSchema
from backend.app.auth.rbac import require_roles

router = APIRouter(prefix="/api/audit", tags=["Audit Log"])

@router.get("", response_model=List[AuditLogSchema])
def get_audit_logs(
    limit: int = Query(100, le=500),
    username: Optional[str] = Query(None),
    patient_id: Optional[str] = Query(None),
    current_user: User = Depends(require_roles(["ADMIN", "DOCTOR"])),
    db: Session = Depends(get_db)
):
    q = db.query(AuditLog)
    if username:
        q = q.filter(AuditLog.username == username)
    if patient_id:
        q = q.filter(AuditLog.patient_id == patient_id)

    return q.order_by(AuditLog.timestamp.desc()).limit(limit).all()
