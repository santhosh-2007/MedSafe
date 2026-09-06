import os
import csv
import json
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
RAW_DIR = os.path.join(DATA_DIR, "raw")
PROCESSED_DIR = os.path.join(DATA_DIR, "processed")

KNOWN_MEDICATIONS = [
    "Amoxicillin", "Penicillin V", "Warfarin", "Aspirin", "Lisinopril", "Metformin", 
    "Gentamicin", "Ibuprofen", "Atorvastatin", "Furosemide", "Metoprolol", "Omeprazole",
    "Ciprofloxacin", "Clopidogrel", "Heparin", "Simvastatin", "Paracetamol", "Spironolactone"
]

def load_csv(path):
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return list(csv.DictReader(f))

def save_csv(path, fieldnames, rows):
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

def clean_and_normalize_data():
    raw_meds = load_csv(os.path.join(RAW_DIR, "medications.csv"))
    raw_allergies = load_csv(os.path.join(RAW_DIR, "allergies.csv"))
    raw_conditions = load_csv(os.path.join(RAW_DIR, "conditions.csv"))
    raw_obs = load_csv(os.path.join(RAW_DIR, "observations.csv"))
    raw_patients = load_csv(os.path.join(RAW_DIR, "patients.csv"))
    raw_interactions = load_csv(os.path.join(RAW_DIR, "interactions.csv"))

    report = {
        "total_patients": len(raw_patients),
        "total_raw_medications": len(raw_meds),
        "total_raw_allergies": len(raw_allergies),
        "total_raw_conditions": len(raw_conditions),
        "duplicate_medications_removed": 0,
        "normalized_medication_names": 0,
        "normalized_allergy_names": 0,
        "conflicting_allergy_records": 0,
        "unknown_medications_flagged": 0,
        "missing_allergy_values": 0,
        "ended_medications_flagged": 0
    }

    # 1. CLEAN PATIENTS
    cleaned_patients = raw_patients

    # 2. CLEAN MEDICATIONS
    cleaned_meds = []
    seen_med_keys = set()

    for m in raw_meds:
        raw_name = m.get("medication_name", "").strip()
        norm_name = raw_name.capitalize() if raw_name.islower() or raw_name.isupper() else raw_name
        # Match against known title-cased list
        for km in KNOWN_MEDICATIONS:
            if raw_name.lower() == km.lower():
                norm_name = km
                break
        
        if norm_name != raw_name:
            report["normalized_medication_names"] += 1
            
        m["medication_name"] = norm_name

        # Check unknown medication
        if norm_name not in KNOWN_MEDICATIONS and not norm_name.startswith("Unrecognized"):
            report["unknown_medications_flagged"] += 1
        elif norm_name.startswith("Unrecognized"):
            report["unknown_medications_flagged"] += 1

        if m.get("status") == "ENDED":
            report["ended_medications_flagged"] += 1

        # Deduplication check key
        dedup_key = (m["patient_id"], norm_name.lower(), m.get("dose", "").lower(), m.get("start_date", ""))
        if dedup_key in seen_med_keys:
            report["duplicate_medications_removed"] += 1
            continue
        seen_med_keys.add(dedup_key)
        cleaned_meds.append(m)

    # 3. CLEAN ALLERGIES
    cleaned_allergies = []
    allergy_by_patient = {}

    for a in raw_allergies:
        raw_alg = a.get("allergen", "").strip()
        norm_alg = raw_alg.title()
        if norm_alg != raw_alg:
            report["normalized_allergy_names"] += 1
        a["allergen"] = norm_alg

        pid = a["patient_id"]
        if pid not in allergy_by_patient:
            allergy_by_patient[pid] = []
        allergy_by_patient[pid].append(a)

        cleaned_allergies.append(a)

    # Detect conflicts & missing values in allergies
    patient_ids = {p["patient_id"] for p in raw_patients}
    for pid in patient_ids:
        p_algs = allergy_by_patient.get(pid, [])
        if not p_algs:
            report["missing_allergy_values"] += 1
        elif len(p_algs) > 1:
            # Check for conflict (e.g. same allergen active vs inactive, or severe vs none)
            allergens_seen = {}
            for alg in p_algs:
                aname = alg["allergen"].lower()
                if aname in allergens_seen:
                    prev = allergens_seen[aname]
                    if prev["status"] != alg["status"] or prev["severity"] != alg["severity"]:
                        report["conflicting_allergy_records"] += 1
                else:
                    allergens_seen[aname] = alg

    # 4. SAVE CLEANED FILES TO PROCESSED DIR AND DATA ROOT
    if cleaned_patients:
        save_csv(os.path.join(PROCESSED_DIR, "patients.csv"), list(cleaned_patients[0].keys()), cleaned_patients)
    if cleaned_meds:
        save_csv(os.path.join(PROCESSED_DIR, "medications.csv"), list(cleaned_meds[0].keys()), cleaned_meds)
    if cleaned_allergies:
        save_csv(os.path.join(PROCESSED_DIR, "allergies.csv"), list(cleaned_allergies[0].keys()), cleaned_allergies)
    if raw_conditions:
        save_csv(os.path.join(PROCESSED_DIR, "conditions.csv"), list(raw_conditions[0].keys()), raw_conditions)
    if raw_obs:
        save_csv(os.path.join(PROCESSED_DIR, "observations.csv"), list(raw_obs[0].keys()), raw_obs)
    if raw_interactions:
        save_csv(os.path.join(PROCESSED_DIR, "interactions.csv"), list(raw_interactions[0].keys()), raw_interactions)

    # Save Quality Report JSON
    with open(os.path.join(PROCESSED_DIR, "quality_report.json"), "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    print(f"[CLEANING SUCCESS] Data pipeline complete. Quality Report:\n{json.dumps(report, indent=2)}")
    return report

if __name__ == "__main__":
    clean_and_normalize_data()
