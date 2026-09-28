from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.models.domain import User, Patient, Medication, Allergy, Condition, Observation, RiskAlert
from backend.app.auth.rbac import require_roles
from scripts.fhir_adapter import convert_patient_to_fhir_bundle

router = APIRouter(prefix="/api/fhir", tags=["FHIR Interoperability"])

@router.get("/patients/{patient_id}")
def get_patient_fhir_bundle(
    patient_id: str,
    current_user: User = Depends(require_roles(["DOCTOR", "ADMIN"])),
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    meds = db.query(Medication).filter(Medication.patient_id == patient_id).all()
    algs = db.query(Allergy).filter(Allergy.patient_id == patient_id).all()
    conds = db.query(Condition).filter(Condition.patient_id == patient_id).all()
    obss = db.query(Observation).filter(Observation.patient_id == patient_id).all()
    alerts = db.query(RiskAlert).filter(RiskAlert.patient_id == patient_id).all()

    return convert_patient_to_fhir_bundle(patient, meds, algs, conds, obss, alerts)
