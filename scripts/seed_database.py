import os
import sys
import csv
from datetime import datetime

# Add project root to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from passlib.context import CryptContext
from backend.app.database.session import engine, SessionLocal, Base

from backend.app.models.domain import User, Patient, Medication, Allergy, Condition, Observation, RiskAlert, RiskEvidence, AuditLog
from backend.app.risk_engine.engine import run_patient_risk_assessment

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
PROCESSED_DIR = os.path.join(DATA_DIR, "processed")
if not os.path.exists(os.path.join(PROCESSED_DIR, "patients.csv")):
    PROCESSED_DIR = DATA_DIR

def load_csv(filename):
    path = os.path.join(PROCESSED_DIR, filename)
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return list(csv.DictReader(f))

def seed_db():
    print("[SEED DB] Re-creating database schema...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 1. SEED USERS
        users = [
            User(username="doctor", hashed_password=pwd_context.hash("doctor123"), role="DOCTOR", full_name="Dr. Demo"),
            User(username="nurse", hashed_password=pwd_context.hash("nurse123"), role="NURSE", full_name="Nurse Demo"),
            User(username="admin", hashed_password=pwd_context.hash("admin123"), role="ADMIN", full_name="Admin Demo")
        ]
        db.add_all(users)
        db.commit()
        print(f"[SEED DB] Created {len(users)} default users (doctor, nurse, admin).")

        # 2. SEED PATIENTS
        raw_patients = load_csv("patients.csv")
        patient_objs = []
        for p in raw_patients:
            patient_objs.append(Patient(
                patient_id=p["patient_id"],
                age=int(p["age"]),
                sex=p["sex"],
                ward=p["ward"],
                admission_date=p["admission_date"],
                consent_status=p.get("consent_status", "CONSENTED")
            ))
        db.add_all(patient_objs)
        db.commit()
        print(f"[SEED DB] Seeded {len(patient_objs)} patients.")

        # 3. SEED MEDICATIONS
        raw_meds = load_csv("medications.csv")
        med_objs = []
        for m in raw_meds:
            med_objs.append(Medication(
                patient_id=m["patient_id"],
                medication_name=m["medication_name"],
                dose=m.get("dose", ""),
                route=m.get("route", ""),
                start_date=m.get("start_date", ""),
                end_date=m.get("end_date", ""),
                status=m.get("status", "ACTIVE")
            ))
        db.add_all(med_objs)
        db.commit()
        print(f"[SEED DB] Seeded {len(med_objs)} medications.")

        # 4. SEED ALLERGIES
        raw_allergies = load_csv("allergies.csv")
        alg_objs = []
        for a in raw_allergies:
            alg_objs.append(Allergy(
                patient_id=a["patient_id"],
                allergen=a["allergen"],
                reaction=a.get("reaction", ""),
                severity=a.get("severity", "MODERATE"),
                recorded_date=a.get("recorded_date", ""),
                status=a.get("status", "ACTIVE")
            ))
        db.add_all(alg_objs)
        db.commit()
        print(f"[SEED DB] Seeded {len(alg_objs)} allergies.")

        # 5. SEED CONDITIONS
        raw_conditions = load_csv("conditions.csv")
        cond_objs = []
        for c in raw_conditions:
            cond_objs.append(Condition(
                patient_id=c["patient_id"],
                condition=c["condition"],
                severity=c.get("severity", "MODERATE"),
                diagnosis_date=c.get("diagnosis_date", ""),
                status=c.get("status", "ACTIVE")
            ))
        db.add_all(cond_objs)
        db.commit()
        print(f"[SEED DB] Seeded {len(cond_objs)} conditions.")

        # 6. SEED OBSERVATIONS
        raw_obs = load_csv("observations.csv")
        obs_objs = []
        for o in raw_obs:
            obs_objs.append(Observation(
                patient_id=o["patient_id"],
                observation_date=o.get("observation_date", ""),
                blood_pressure=o.get("blood_pressure", ""),
                heart_rate=int(o["heart_rate"]) if o.get("heart_rate") else None,
                temperature=float(o["temperature"]) if o.get("temperature") else None,
                oxygen_saturation=int(o["oxygen_saturation"]) if o.get("oxygen_saturation") else None,
                creatinine=float(o["creatinine"]) if o.get("creatinine") else None,
                glucose=int(o["glucose"]) if o.get("glucose") else None
            ))
        db.add_all(obs_objs)
        db.commit()
        print(f"[SEED DB] Seeded {len(obs_objs)} observations.")

        # 7. GENERATE AND SEED INITIAL RISK ALERTS
        all_patients = db.query(Patient).all()
        alert_count = 0
        for pat in all_patients:
            meds = db.query(Medication).filter(Medication.patient_id == pat.patient_id).all()
            algs = db.query(Allergy).filter(Allergy.patient_id == pat.patient_id).all()
            conds = db.query(Condition).filter(Condition.patient_id == pat.patient_id).all()
            obss = db.query(Observation).filter(Observation.patient_id == pat.patient_id).all()

            assessment = run_patient_risk_assessment(pat, meds, algs, conds, obss)
            for alert_dict in assessment["alerts"]:
                ra = RiskAlert(
                    risk_id=alert_dict["risk_id"],
                    patient_id=pat.patient_id,
                    risk_type=alert_dict["risk_type"],
                    medication_a=alert_dict["medication_a"],
                    medication_b=alert_dict["medication_b"],
                    related_allergen=alert_dict["related_allergen"],
                    related_condition=alert_dict["related_condition"],
                    risk_level=alert_dict["risk_level"],
                    score=alert_dict["score"],
                    confidence=alert_dict["confidence"],
                    uncertainty=alert_dict["uncertainty"],
                    potential_harm=alert_dict["potential_harm"],
                    safety_disclaimer=alert_dict["safety_disclaimer"],
                    status="UNREVIEWED"
                )
                db.add(ra)

                for ev_text in alert_dict["evidence"]:
                    ev_type = "RULE_MATCH"
                    if "Medication" in ev_text:
                        ev_type = "MEDICATION"
                    elif "Allergy" in ev_text:
                        ev_type = "ALLERGY"
                    elif "condition" in ev_text:
                        ev_type = "CONDITION"
                    elif "observation" in ev_text:
                        ev_type = "OBSERVATION"

                    re = RiskEvidence(
                        risk_id=alert_dict["risk_id"],
                        evidence_item=ev_text,
                        evidence_type=ev_type
                    )
                    db.add(re)
                alert_count += 1

        db.commit()
        print(f"[SEED DB] Seeded {alert_count} initial risk alerts and evidence records.")

        # Seed initial audit log
        audit = AuditLog(
            username="system",
            role="SYSTEM",
            action="DATABASE_SEEDED",
            patient_id="",
            details="Initial synthetic database seeding completed successfully."
        )
        db.add(audit)
        db.commit()

    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
