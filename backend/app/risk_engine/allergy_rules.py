ALLERGY_CROSS_REACTIVITY = {
    "penicillin": ["penicillin", "amoxicillin", "ampicillin", "penicillin v", "piperacillin"],
    "nsaids": ["ibuprofen", "naproxen", "aspirin", "diclofenac", "ketorolac"],
    "aspirin": ["aspirin", "ibuprofen", "naproxen"],
    "sulfa drugs": ["sulfamethoxazole", "trimethoprim-sulfamethoxazole", "sulfasalazine"]
}

def evaluate_medication_allergy_risks(patient_id, active_meds, active_allergies):
    alerts = []

    for med in active_meds:
        med_name = med.medication_name.strip().lower()

        for alg in active_allergies:
            allergen_name = alg.allergen.strip().lower()

            match_found = False
            match_type = ""

            # Direct match
            if med_name == allergen_name:
                match_found = True
                match_type = "Direct Allergen Match"
            else:
                # Class / Cross-reactivity match
                cross_list = ALLERGY_CROSS_REACTIVITY.get(allergen_name, [])
                if med_name in cross_list:
                    match_found = True
                    match_type = f"Cross-Reactivity Match ({alg.allergen} allergen group)"

            if match_found:
                confidence = 92.0 if match_type == "Direct Allergen Match" else 88.0
                if alg.severity == "SEVERE":
                    confidence += 3.0

                evidence = [
                    f"Medication '{med.medication_name}' ({med.dose}) is currently active (Started: {med.start_date}).",
                    f"Allergy to '{alg.allergen}' ({alg.reaction}) is documented as {alg.severity} severity (Recorded: {alg.recorded_date}).",
                    f"Synthetic demonstration rule matched: {match_type}."
                ]

                alerts.append({
                    "risk_type": "Medication-Allergy",
                    "medication_a": med.medication_name,
                    "medication_b": "",
                    "related_allergen": alg.allergen,
                    "related_condition": "",
                    "base_score": 85.0 if alg.severity == "SEVERE" else 75.0,
                    "confidence": min(confidence, 98.0),
                    "evidence": evidence,
                    "uncertainty": "Rule match based on documented allergen string. Patient tolerance or previous desensitization is unknown.",
                    "potential_harm": "Potential medication-allergy concern identified. Incorrect interpretation could lead to unnecessary medication change or acute allergic response.",
                    "safety_disclaimer": "Confidence represents system confidence in configured rule match, not clinical certainty. Alerts may be incomplete or incorrect. Verify against source records.",
                    "record_dates": [med.start_date, alg.recorded_date]
                })

    return alerts
