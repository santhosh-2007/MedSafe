from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from backend.app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False) # DOCTOR, NURSE, ADMIN
    full_name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Patient(Base):
    __tablename__ = "patients"

    patient_id = Column(String, primary_key=True, index=True)
    age = Column(Integer, nullable=False)
    sex = Column(String, nullable=False)
    ward = Column(String, nullable=False)
    admission_date = Column(String, nullable=False)
    consent_status = Column(String, default="CONSENTED")

    medications = relationship("Medication", back_populates="patient", cascade="all, delete-orphan")
    allergies = relationship("Allergy", back_populates="patient", cascade="all, delete-orphan")
    conditions = relationship("Condition", back_populates="patient", cascade="all, delete-orphan")
    observations = relationship("Observation", back_populates="patient", cascade="all, delete-orphan")
    risk_alerts = relationship("RiskAlert", back_populates="patient", cascade="all, delete-orphan")

class Medication(Base):
    __tablename__ = "medications"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.patient_id"), nullable=False)
    medication_name = Column(String, nullable=False)
    dose = Column(String)
    route = Column(String)
    start_date = Column(String)
    end_date = Column(String)
    status = Column(String, default="ACTIVE") # ACTIVE, ENDED

    patient = relationship("Patient", back_populates="medications")

class Allergy(Base):
    __tablename__ = "allergies"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.patient_id"), nullable=False)
    allergen = Column(String, nullable=False)
    reaction = Column(String)
    severity = Column(String) # MILD, MODERATE, SEVERE
    recorded_date = Column(String)
    status = Column(String, default="ACTIVE")

    patient = relationship("Patient", back_populates="allergies")

class Condition(Base):
    __tablename__ = "conditions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.patient_id"), nullable=False)
    condition = Column(String, nullable=False)
    severity = Column(String)
    diagnosis_date = Column(String)
    status = Column(String, default="ACTIVE")

    patient = relationship("Patient", back_populates="conditions")

class Observation(Base):
    __tablename__ = "observations"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.patient_id"), nullable=False)
    observation_date = Column(String)
    blood_pressure = Column(String)
    heart_rate = Column(Integer)
    temperature = Column(Float)
    oxygen_saturation = Column(Integer)
    creatinine = Column(Float)
    glucose = Column(Integer)

    patient = relationship("Patient", back_populates="observations")

class RiskAlert(Base):
    __tablename__ = "risk_alerts"

    risk_id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.patient_id"), nullable=False)
    risk_type = Column(String, nullable=False) # Medication-Allergy, Medication-Medication, Medication-Comorbidity
    medication_a = Column(String, nullable=False)
    medication_b = Column(String, default="")
    related_allergen = Column(String, default="")
    related_condition = Column(String, default="")
    risk_level = Column(String, nullable=False) # HIGH, MODERATE, REVIEW
    score = Column(Float, nullable=False) # 0-100
    confidence = Column(Float, nullable=False) # 0-100%
    uncertainty = Column(String, nullable=False)
    potential_harm = Column(Text, nullable=False)
    safety_disclaimer = Column(Text, nullable=False)
    status = Column(String, default="UNREVIEWED") # UNREVIEWED, REVIEWED_NO_ACTION, REVIEWED_FOLLOW_UP, FALSE_POSITIVE, UNABLE_TO_DETERMINE
    review_comment = Column(Text, default="")
    reviewed_by = Column(String, default="")
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="risk_alerts")
    evidences = relationship("RiskEvidence", back_populates="risk_alert", cascade="all, delete-orphan")

class RiskEvidence(Base):
    __tablename__ = "risk_evidences"

    id = Column(Integer, primary_key=True, index=True)
    risk_id = Column(String, ForeignKey("risk_alerts.risk_id"), nullable=False)
    evidence_item = Column(Text, nullable=False)
    evidence_type = Column(String, nullable=False) # MEDICATION, ALLERGY, CONDITION, OBSERVATION, RULE_MATCH
    record_date = Column(String, default="")

    risk_alert = relationship("RiskAlert", back_populates="evidences")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    username = Column(String, nullable=False)
    role = Column(String, nullable=False)
    action = Column(String, nullable=False)
    patient_id = Column(String, default="")
    details = Column(Text, default="")

class Consent(Base):
    __tablename__ = "consents"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    notice_version = Column(String, default="v1.0")
    accepted_at = Column(DateTime, default=datetime.utcnow)
    disclaimer_accepted = Column(Boolean, default=True)

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    usability_score = Column(Integer, nullable=False) # 1-5
    evidence_clarity_score = Column(Integer, nullable=False) # 1-5
    uncertainty_clarity_score = Column(Integer, nullable=False) # 1-5
    comments = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

class EvaluationResult(Base):
    __tablename__ = "evaluation_results"

    id = Column(Integer, primary_key=True, index=True)
    run_timestamp = Column(DateTime, default=datetime.utcnow)
    total_cases = Column(Integer, nullable=False)
    baseline_median_time_sec = Column(Float, nullable=False)
    prototype_median_time_sec = Column(Float, nullable=False)
    time_reduction_pct = Column(Float, nullable=False)
    precision = Column(Float, nullable=False)
    recall = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    false_positives = Column(Integer, nullable=False)
    false_negatives = Column(Integer, nullable=False)
    missed_risks = Column(Integer, nullable=False)
    status = Column(String, nullable=False) # TARGET_ACHIEVED / TARGET_NOT_ACHIEVED
