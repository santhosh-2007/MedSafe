import uuid
from backend.app.risk_engine.allergy_rules import evaluate_medication_allergy_risks
from backend.app.risk_engine.interaction_rules import evaluate_medication_interaction_risks
from backend.app.risk_engine.comorbidity_rules import evaluate_medication_comorbidity_risks
from backend.app.risk_engine.observation_context import attach_observation_context
from backend.app.risk_engine.scoring import compute_risk_priority, categorize_confidence

KNOWN_MEDICATIONS = [
    "Amoxicillin", "Penicillin V", "Warfarin", "Aspirin", "Lisinopril", "Metformin", 
    "Gentamicin", "Ibuprofen", "Atorvastatin", "Furosemide", "Metoprolol", "Omeprazole",
    "Ciprofloxacin", "Clopidogrel", "Heparin", "Simvastatin", "Paracetamol", "Spironolactone"
]

def run_patient_risk_assessment(patient, medications, allergies, conditions, observations):
    active_meds = [m for m in medications if m.status == "ACTIVE"]
    active_allergies = [a for a in allergies if a.status == "ACTIVE"]
    active_conditions = [c for c in conditions if c.status == "ACTIVE"]

    raw_alerts = []
    edge_case_notices = []

    # 1. CHECK EDGE CASES & SYSTEM FLAGS
    # Edge Case 1: Missing Allergy Information
    if not allergies:
        edge_case_notices.append({
            "code": "EDGE_MISSING_ALLERGY",
            "title": "Allergy Information Unavailable",
            "severity": "WARNING",
            "message": "No allergy documentation exists for this patient. Allergy interaction assessment is incomplete.",
            "recommendation": "Verify allergy history with source medical record or patient."
        })

    # Edge Case 2: Conflicting Allergy Records
    allergy_names = [a.allergen.strip().lower() for a in allergies]
    if len(allergy_names) != len(set(allergy_names)):
        edge_case_notices.append({
            "code": "EDGE_CONFLICTING_ALLERGY",
            "title": "Conflicting Allergy Records Detected",
            "severity": "HIGH",
            "message": "Multiple conflicting documentation entries exist for the same allergen.",
            "recommendation": "Perform clinical reconciliation of allergy status prior to medication administration."
        })

    # Edge Case 3: Unknown Medication
    for med in active_meds:
        mname = med.medication_name.strip()
        if mname.startswith("Unrecognized") or (mname not in KNOWN_MEDICATIONS and mname.title() not in KNOWN_MEDICATIONS):
            edge_case_notices.append({
                "code": "EDGE_UNKNOWN_MED",
                "title": f"Medication Not Recognized ({mname})",
                "severity": "MODERATE",
                "message": f"Medication '{mname}' is not in the synthetic knowledge base catalog.",
                "recommendation": "Manual pharmacist drug monograph review required."
            })

    # Edge Case 4: Duplicate Medication
    med_names = [m.medication_name.strip().lower() for m in active_meds]
    if len(med_names) != len(set(med_names)):
        edge_case_notices.append({
            "code": "EDGE_DUPLICATE_MED",
            "title": "Duplicate Active Medication Record",
            "severity": "MODERATE",
            "message": "Multiple active medication records detected for the same drug agent.",
            "recommendation": "Reconcile duplicate active orders in electronic health record."
        })

    # Edge Case 5: Outdated Medication filter check
    ended_meds = [m for m in medications if m.status == "ENDED"]
    if ended_meds:
        edge_case_notices.append({
            "code": "INFO_ENDED_MED",
            "title": f"Excluded {len(ended_meds)} Ended Medication(s)",
            "severity": "INFO",
            "message": "Discontinued/ended medications are excluded from active interaction risk calculations.",
            "recommendation": "Review historical records if post-discontinuation lingering effects are suspected."
        })

    # 2. RUN RULE ENGINES FOR ACTIVE MEDICATIONS ONLY
    raw_alerts.extend(evaluate_medication_allergy_risks(patient.patient_id, active_meds, active_allergies))
    raw_alerts.extend(evaluate_medication_interaction_risks(patient.patient_id, active_meds))
    raw_alerts.extend(evaluate_medication_comorbidity_risks(patient.patient_id, active_meds, active_conditions))

    # 3. ATTACH RECENT OBSERVATION CONTEXT
    raw_alerts = attach_observation_context(raw_alerts, observations)

    # 4. STRUCTURE FINAL RISK ALERTS
    final_alerts = []
    for item in raw_alerts:
        risk_score = round(item["base_score"], 1)
        priority = compute_risk_priority(risk_score)
        conf_cat = categorize_confidence(item["confidence"])
        rid = f"RISK-{uuid.uuid4().hex[:8].upper()}"

        final_alerts.append({
            "risk_id": rid,
            "patient_id": patient.patient_id,
            "risk_type": item["risk_type"],
            "medication_a": item["medication_a"],
            "medication_b": item["medication_b"],
            "related_allergen": item["related_allergen"],
            "related_condition": item["related_condition"],
            "risk_level": priority,
            "score": risk_score,
            "confidence": item["confidence"],
            "confidence_category": conf_cat,
            "evidence": item["evidence"],
            "uncertainty": item["uncertainty"],
            "potential_harm": item["potential_harm"],
            "safety_disclaimer": item["safety_disclaimer"]
        })

    # Sort final alerts by score descending
    final_alerts.sort(key=lambda x: x["score"], reverse=True)

    return {
        "alerts": final_alerts,
        "edge_cases": edge_case_notices,
        "active_medication_count": len(active_meds),
        "active_allergy_count": len(active_allergies),
        "active_condition_count": len(active_conditions),
        "recent_observation_count": len(observations)
    }
