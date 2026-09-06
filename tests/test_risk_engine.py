import pytest
from backend.app.models.domain import Patient, Medication, Allergy, Condition, Observation
from backend.app.risk_engine.engine import run_patient_risk_assessment

def test_medication_allergy_risk_detection():
    patient = Patient(patient_id="TEST-001", age=50, sex="Male", ward="Test Ward", admission_date="2026-08-01")
    meds = [
        Medication(patient_id="TEST-001", medication_name="Amoxicillin", dose="500mg", route="Oral", start_date="2026-08-20", status="ACTIVE")
    ]
    allergies = [
        Allergy(patient_id="TEST-001", allergen="Penicillin", reaction="Rash", severity="SEVERE", recorded_date="2026-07-01", status="ACTIVE")
    ]

    res = run_patient_risk_assessment(patient, meds, allergies, [], [])
    alerts = res["alerts"]

    assert len(alerts) == 1
    assert alerts[0]["risk_type"] == "Medication-Allergy"
    assert alerts[0]["risk_level"] == "HIGH"
    assert alerts[0]["confidence"] >= 90.0
    assert "Amoxicillin" in alerts[0]["medication_a"]
    assert "Penicillin" in alerts[0]["related_allergen"]

def test_medication_interaction_detection():
    patient = Patient(patient_id="TEST-002", age=70, sex="Female", ward="Cardiology", admission_date="2026-08-01")
    meds = [
        Medication(patient_id="TEST-002", medication_name="Warfarin", dose="5mg", route="Oral", start_date="2026-08-10", status="ACTIVE"),
        Medication(patient_id="TEST-002", medication_name="Aspirin", dose="100mg", route="Oral", start_date="2026-08-15", status="ACTIVE")
    ]

    res = run_patient_risk_assessment(patient, meds, [], [], [])
    alerts = res["alerts"]

    assert len(alerts) == 1
    assert alerts[0]["risk_type"] == "Medication-Medication"
    assert alerts[0]["risk_level"] == "HIGH"
    assert "Warfarin" in [alerts[0]["medication_a"], alerts[0]["medication_b"]]
    assert "Aspirin" in [alerts[0]["medication_a"], alerts[0]["medication_b"]]

def test_observation_context_escalation():
    patient = Patient(patient_id="TEST-003", age=65, sex="Male", ward="Renal", admission_date="2026-08-01")
    meds = [
        Medication(patient_id="TEST-003", medication_name="Gentamicin", dose="80mg", route="IV", start_date="2026-08-20", status="ACTIVE")
    ]
    conditions = [
        Condition(patient_id="TEST-003", condition="Chronic Kidney Disease Stage 3", severity="HIGH", diagnosis_date="2025-01-01", status="ACTIVE")
    ]
    observations = [
        Observation(patient_id="TEST-003", observation_date="2026-08-24 10:00", blood_pressure="120/80", heart_rate=72, temperature=36.8, oxygen_saturation=98, creatinine=2.5, glucose=100)
    ]

    res = run_patient_risk_assessment(patient, meds, [], conditions, observations)
    alerts = res["alerts"]

    assert len(alerts) == 1
    assert alerts[0]["score"] > 85.0
    assert any("Creatinine" in ev for ev in alerts[0]["evidence"])

def test_missing_allergy_edge_case():
    patient = Patient(patient_id="TEST-004", age=40, sex="Female", ward="Surgical", admission_date="2026-08-01")
    meds = [
        Medication(patient_id="TEST-004", medication_name="Lisinopril", dose="10mg", route="Oral", start_date="2026-08-20", status="ACTIVE")
    ]

    res = run_patient_risk_assessment(patient, meds, [], [], [])
    edge_cases = res["edge_cases"]

    assert any(e["code"] == "EDGE_MISSING_ALLERGY" for e in edge_cases)
