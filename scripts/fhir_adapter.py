import json

def convert_patient_to_fhir_bundle(patient, medications, allergies, conditions, observations, risk_alerts):
    entries = []

    # 1. FHIR Patient Resource
    patient_resource = {
        "resourceType": "Patient",
        "id": patient.patient_id,
        "active": True,
        "gender": patient.sex.lower(),
        "extension": [
            {
                "url": "http://hl7.org/fhir/StructureDefinition/patient-ward",
                "valueString": patient.ward
            }
        ]
    }
    entries.append({"resource": patient_resource})

    # 2. FHIR AllergyIntolerance Resources
    for alg in allergies:
        entries.append({
            "resource": {
                "resourceType": "AllergyIntolerance",
                "id": f"alg-{alg.id}",
                "clinicalStatus": {
                    "coding": [{"system": "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical", "code": "active"}]
                },
                "verificationStatus": {
                    "coding": [{"system": "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification", "code": "confirmed"}]
                },
                "type": "allergy",
                "category": ["medication"],
                "criticality": "high" if alg.severity == "SEVERE" else "medium",
                "code": {
                    "text": alg.allergen
                },
                "patient": {"reference": f"Patient/{patient.patient_id}"},
                "reaction": [{"manifestation": [{"text": alg.reaction}]}]
            }
        })

    # 3. FHIR MedicationRequest Resources
    for med in medications:
        entries.append({
            "resource": {
                "resourceType": "MedicationRequest",
                "id": f"med-{med.id}",
                "status": "active" if med.status == "ACTIVE" else "stopped",
                "intent": "order",
                "medicationCodeableConcept": {"text": med.medication_name},
                "subject": {"reference": f"Patient/{patient.patient_id}"},
                "dosageInstruction": [{"text": f"{med.dose} {med.route}"}]
            }
        })

    # 4. FHIR DetectedIssue Resources for Risk Alerts
    for alert in risk_alerts:
        entries.append({
            "resource": {
                "resourceType": "DetectedIssue",
                "id": alert.risk_id,
                "status": "final" if alert.status != "UNREVIEWED" else "preliminary",
                "code": {"text": alert.risk_type},
                "severity": alert.risk_level.lower(),
                "patient": {"reference": f"Patient/{patient.patient_id}"},
                "detail": alert.potential_harm,
                "evidence": [{"detail": [{"display": ev.evidence_item}] for ev in alert.evidences}]
            }
        })

    return {
        "resourceType": "Bundle",
        "type": "collection",
        "entry": entries
    }
