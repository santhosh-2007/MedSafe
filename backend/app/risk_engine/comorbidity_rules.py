KNOWN_COMORBIDITY_RULES = [
    {
        "med": "gentamicin",
        "condition_substr": "kidney disease",
        "level": "HIGH",
        "base_score": 82.0,
        "confidence": 89.0,
        "desc": "Aminoglycoside nephrotoxicity risk elevated in pre-existing renal dysfunction."
    },
    {
        "med": "ibuprofen",
        "condition_substr": "kidney disease",
        "level": "MODERATE",
        "base_score": 70.0,
        "confidence": 86.0,
        "desc": "NSAID nephrotoxicity can exacerbate pre-existing Chronic Kidney Disease."
    },
    {
        "med": "metoprolol",
        "condition_substr": "asthma",
        "level": "MODERATE",
        "base_score": 65.0,
        "confidence": 80.0,
        "desc": "Beta-blocker administration may increase bronchospasm risk in severe asthma."
    }
]

def evaluate_medication_comorbidity_risks(patient_id, active_meds, active_conditions):
    alerts = []

    for med in active_meds:
        med_name = med.medication_name.strip().lower()

        for cond in active_conditions:
            cond_name = cond.condition.strip().lower()

            for rule in KNOWN_COMORBIDITY_RULES:
                if med_name == rule["med"] and rule["condition_substr"] in cond_name:
                    evidence = [
                        f"Medication '{med.medication_name}' ({med.dose}) active since {med.start_date}.",
                        f"Documented condition '{cond.condition}' ({cond.severity} severity) diagnosed on {cond.diagnosis_date}.",
                        f"Synthetic demonstration rule matched: {rule['desc']}"
                    ]

                    alerts.append({
                        "risk_type": "Medication-Comorbidity",
                        "medication_a": med.medication_name,
                        "medication_b": "",
                        "related_allergen": "",
                        "related_condition": cond.condition,
                        "base_score": rule["base_score"],
                        "confidence": rule["confidence"],
                        "evidence": evidence,
                        "uncertainty": "Disease stage and current organ function parameters require clinician correlation.",
                        "potential_harm": "Potential medication-comorbidity concern identified. Incorrect interpretation could result in inappropriate medication discontinuation or renal impairment.",
                        "safety_disclaimer": "Confidence represents system confidence in configured rule match, not clinical certainty. Alerts may be incomplete or incorrect. Verify against source records.",
                        "record_dates": [med.start_date, cond.diagnosis_date]
                    })

    return alerts
