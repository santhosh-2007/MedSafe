from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.models.domain import User, Patient, Medication, Allergy, Condition, Observation, RiskAlert, AuditLog
from backend.app.schemas.domain import PatientSummarySchema, PatientDetailSchema, MedicationSchema, AllergySchema, ConditionSchema, ObservationSchema
from backend.app.auth.security import get_current_user
from backend.app.auth.rbac import require_roles
from backend.app.risk_engine.engine import run_patient_risk_assessment

router = APIRouter(prefix="/api/patients", tags=["Patients"])

@router.get("", response_model=List[PatientSummarySchema])
def list_patients(
    query: Optional[str] = Query(None),
    ward: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    current_user: User = Depends(require_roles(["DOCTOR", "NURSE", "ADMIN"])),
    db: Session = Depends(get_db)
):
    q = db.query(Patient)
    if query:
        q = q.filter(Patient.patient_id.ilike(f"%{query}%"))
    if ward:
        q = q.filter(Patient.ward == ward)

    patients = q.all()
    summaries = []

    for p in patients:
        meds = db.query(Medication).filter(Medication.patient_id == p.patient_id, Medication.status == "ACTIVE").all()
        algs = db.query(Allergy).filter(Allergy.patient_id == p.patient_id, Allergy.status == "ACTIVE").all()
        conds = db.query(Condition).filter(Condition.patient_id == p.patient_id, Condition.status == "ACTIVE").all()
        alerts = db.query(RiskAlert).filter(RiskAlert.patient_id == p.patient_id).all()

        highest = "SAFE"
        for a in alerts:
            if a.risk_level == "HIGH":
                highest = "HIGH"
                break
            elif a.risk_level == "MODERATE" and highest != "HIGH":
                highest = "MODERATE"
            elif a.risk_level == "REVIEW" and highest not in ["HIGH", "MODERATE"]:
                highest = "REVIEW"

        if risk_level and highest != risk_level:
            continue

        summaries.append(PatientSummarySchema(
            patient_id=p.patient_id,
            age=p.age,
            sex=p.sex,
            ward=p.ward,
            admission_date=p.admission_date,
            active_medication_count=len(meds),
            allergy_count=len(algs),
            condition_count=len(conds),
            highest_risk_level=highest,
            risk_alert_count=len(alerts)
        ))

    return summaries

@router.get("/{patient_id}", response_model=PatientDetailSchema)
def get_patient_detail(
    patient_id: str,
    current_user: User = Depends(require_roles(["DOCTOR", "NURSE", "ADMIN"])),
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(Patient.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail=f"Patient {patient_id} not found")

    meds = db.query(Medication).filter(Medication.patient_id == patient_id).all()
    algs = db.query(Allergy).filter(Allergy.patient_id == patient_id).all()
    conds = db.query(Condition).filter(Condition.patient_id == patient_id).all()
    obss = db.query(Observation).filter(Observation.patient_id == patient_id).all()
    
    # Run dynamic risk assessment to make sure latest calculation is returned
    assessment = run_patient_risk_assessment(patient, meds, algs, conds, obss)
    alerts = db.query(RiskAlert).filter(RiskAlert.patient_id == patient_id).all()

    # Log audit event
    audit = AuditLog(
        username=current_user.username,
        role=current_user.role,
        action="PATIENT_VIEWED",
        patient_id=patient_id,
        details=f"Viewed full patient profile for {patient_id}"
    )
    db.add(audit)
    db.commit()

    return PatientDetailSchema(
        patient_id=patient.patient_id,
        age=patient.age,
        sex=patient.sex,
        ward=patient.ward,
        admission_date=patient.admission_date,
        consent_status=patient.consent_status,
        medications=meds,
        allergies=algs,
        conditions=conds,
        observations=obss,
        risk_alerts=alerts
    )

@router.get("/{patient_id}/medications", response_model=List[MedicationSchema])
def get_patient_medications(
    patient_id: str,
    current_user: User = Depends(require_roles(["DOCTOR", "NURSE"])),
    db: Session = Depends(get_db)
):
    return db.query(Medication).filter(Medication.patient_id == patient_id).all()

@router.get("/{patient_id}/allergies", response_model=List[AllergySchema])
def get_patient_allergies(
    patient_id: str,
    current_user: User = Depends(require_roles(["DOCTOR", "NURSE"])),
    db: Session = Depends(get_db)
):
    return db.query(Allergy).filter(Allergy.patient_id == patient_id).all()

@router.get("/{patient_id}/conditions", response_model=List[ConditionSchema])
def get_patient_conditions(
    patient_id: str,
    current_user: User = Depends(require_roles(["DOCTOR", "NURSE"])),
    db: Session = Depends(get_db)
):
    return db.query(Condition).filter(Condition.patient_id == patient_id).all()

@router.get("/{patient_id}/observations", response_model=List[ObservationSchema])
def get_patient_observations(
    patient_id: str,
    current_user: User = Depends(require_roles(["DOCTOR", "NURSE"])),
    db: Session = Depends(get_db)
):
    return db.query(Observation).filter(Observation.patient_id == patient_id).all()
