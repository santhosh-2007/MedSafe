KNOWN_INTERACTIONS = [
    {
        "med_a": "warfarin",
        "med_b": "aspirin",
        "level": "HIGH",
        "base_score": 85.0,
        "confidence": 90.0,
        "desc": "Concurrent anticoagulant (Warfarin) and antiplatelet (Aspirin) therapy elevates major bleeding risk."
    },
    {
        "med_a": "warfarin",
        "med_b": "ibuprofen",
        "level": "HIGH",
        "base_score": 88.0,
        "confidence": 92.0,
        "desc": "NSAID (Ibuprofen) combined with Warfarin significantly increases gastrointestinal bleeding risk."
    },
    {
        "med_a": "lisinopril",
        "med_b": "spironolactone",
        "level": "MODERATE",
        "base_score": 68.0,
        "confidence": 85.0,
        "desc": "ACE inhibitor (Lisinopril) combined with potassium-sparing diuretic (Spironolactone) increases hyperkalemia risk."
    }
]

def evaluate_medication_interaction_risks(patient_id, active_meds):
    alerts = []
    med_list = [m for m in active_meds]

    for i in range(len(med_list)):
        for j in range(i + 1, len(med_list)):
            m1 = med_list[i]
            m2 = med_list[j]

            name1 = m1.medication_name.strip().lower()
            name2 = m2.medication_name.strip().lower()

            for rule in KNOWN_INTERACTIONS:
                rule_a = rule["med_a"]
                rule_b = rule["med_b"]

                if (name1 == rule_a and name2 == rule_b) or (name1 == rule_b and name2 == rule_a):
                    evidence = [
                        f"Medication '{m1.medication_name}' ({m1.dose}) active since {m1.start_date}.",
                        f"Medication '{m2.medication_name}' ({m2.dose}) active since {m2.start_date}.",
                        f"Synthetic safety rule matched: {rule['desc']}"
                    ]

                    alerts.append({
                        "risk_type": "Medication-Medication",
                        "medication_a": m1.medication_name,
                        "medication_b": m2.medication_name,
                        "related_allergen": "",
                        "related_condition": "",
                        "base_score": rule["base_score"],
                        "confidence": rule["confidence"],
                        "evidence": evidence,
                        "uncertainty": "Rule-based interaction alert. Patient monitoring parameters (e.g. INR, serum potassium) must be evaluated in context.",
                        "potential_harm": "Potential medication-medication interaction detected. Incorrect interpretation could lead to unmonitored adverse drug events or bleeding risk.",
                        "safety_disclaimer": "Confidence represents system confidence in configured rule match, not clinical certainty. Alerts may be incomplete or incorrect. Verify against source records.",
                        "record_dates": [m1.start_date, m2.start_date]
                    })

    return alerts
