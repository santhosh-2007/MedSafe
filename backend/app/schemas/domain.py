from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str
    role: str
    full_name: str

class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    full_name: str

class ConsentRequest(BaseModel):
    disclaimer_accepted: bool

class MedicationSchema(BaseModel):
    id: int
    patient_id: str
    medication_name: str
    dose: Optional[str] = ""
    route: Optional[str] = ""
    start_date: Optional[str] = ""
    end_date: Optional[str] = ""
    status: str

    class Config:
        from_attributes = True

class AllergySchema(BaseModel):
    id: int
    patient_id: str
    allergen: str
    reaction: Optional[str] = ""
    severity: Optional[str] = ""
    recorded_date: Optional[str] = ""
    status: str

    class Config:
        from_attributes = True

class ConditionSchema(BaseModel):
    id: int
    patient_id: str
    condition: str
    severity: Optional[str] = ""
    diagnosis_date: Optional[str] = ""
    status: str

    class Config:
        from_attributes = True

class ObservationSchema(BaseModel):
    id: int
    patient_id: str
    observation_date: Optional[str] = ""
    blood_pressure: Optional[str] = ""
    heart_rate: Optional[int] = None
    temperature: Optional[float] = None
    oxygen_saturation: Optional[int] = None
    creatinine: Optional[float] = None
    glucose: Optional[int] = None

    class Config:
        from_attributes = True

class RiskEvidenceSchema(BaseModel):
    id: int
    evidence_item: str
    evidence_type: str
    record_date: Optional[str] = ""

    class Config:
        from_attributes = True

class RiskAlertSchema(BaseModel):
    risk_id: str
    patient_id: str
    risk_type: str
    medication_a: str
    medication_b: Optional[str] = ""
    related_allergen: Optional[str] = ""
    related_condition: Optional[str] = ""
    risk_level: str
    score: float
    confidence: float
    uncertainty: str
    potential_harm: str
    safety_disclaimer: str
    status: str
    review_comment: Optional[str] = ""
    reviewed_by: Optional[str] = ""
    reviewed_at: Optional[datetime] = None
    evidences: List[RiskEvidenceSchema] = []

    class Config:
        from_attributes = True

class PatientDetailSchema(BaseModel):
    patient_id: str
    age: int
    sex: str
    ward: str
    admission_date: str
    consent_status: str
    medications: List[MedicationSchema] = []
    allergies: List[AllergySchema] = []
    conditions: List[ConditionSchema] = []
    observations: List[ObservationSchema] = []
    risk_alerts: List[RiskAlertSchema] = []

    class Config:
        from_attributes = True

class PatientSummarySchema(BaseModel):
    patient_id: str
    age: int
    sex: str
    ward: str
    admission_date: str
    active_medication_count: int
    allergy_count: int
    condition_count: int
    highest_risk_level: str
    risk_alert_count: int

class ReviewRequest(BaseModel):
    status: str # REVIEWED_NO_ACTION, REVIEWED_FOLLOW_UP, FALSE_POSITIVE, UNABLE_TO_DETERMINE
    comment: Optional[str] = ""

class AuditLogSchema(BaseModel):
    id: int
    timestamp: datetime
    username: str
    role: str
    action: str
    patient_id: Optional[str] = ""
    details: Optional[str] = ""

    class Config:
        from_attributes = True

class FeedbackRequest(BaseModel):
    usability_score: int
    evidence_clarity_score: int
    uncertainty_clarity_score: int
    comments: Optional[str] = ""
