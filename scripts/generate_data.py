import os
import csv
import random
from datetime import datetime, timedelta

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
RAW_DIR = os.path.join(DATA_DIR, "raw")
PROCESSED_DIR = os.path.join(DATA_DIR, "processed")

os.makedirs(RAW_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)

random.seed(42)

WARDS = ["Cardiology Ward 4A", "General Medicine 2B", "Geriatrics 3C", "Surgical Ward 1A", "ICU Stepdown"]
MEDICATIONS = [
    "Amoxicillin", "Penicillin V", "Warfarin", "Aspirin", "Lisinopril", "Metformin", 
    "Gentamicin", "Ibuprofen", "Atorvastatin", "Furosemide", "Metoprolol", "Omeprazole",
    "Ciprofloxacin", "Clopidogrel", "Heparin", "Simvastatin"
]
ALLERGENS = [
    "Penicillin", "Sulfa drugs", "Aspirin", "Codeine", "NSAIDs", "Latex", "Contrast Dye"
]
CONDITIONS = [
    "Chronic Kidney Disease Stage 3", "Hypertension", "Type 2 Diabetes Mellitus",
    "Atrial Fibrillation", "Heart Failure", "Asthma", "Peptic Ulcer Disease", "Gout"
]

SYNTHETIC_RULES = [
    {
        "rule_id": "R-ALL-001",
        "rule_type": "Medication-Allergy",
        "medication_a": "Amoxicillin",
        "medication_b": "",
        "related_allergen": "Penicillin",
        "related_condition": "",
        "risk_level": "HIGH",
        "evidence_strength": "HIGH",
        "description": "SYNTHETIC DEMONSTRATION RULE: Beta-lactam antibiotic cross-reactivity with documented Penicillin allergy."
    },
    {
        "rule_id": "R-ALL-002",
        "rule_type": "Medication-Allergy",
        "medication_a": "Penicillin V",
        "medication_b": "",
        "related_allergen": "Penicillin",
        "related_condition": "",
        "risk_level": "HIGH",
        "evidence_strength": "HIGH",
        "description": "SYNTHETIC DEMONSTRATION RULE: Direct administration of Penicillin to patient with Penicillin allergy."
    },
    {
        "rule_id": "R-ALL-003",
        "rule_type": "Medication-Allergy",
        "medication_a": "Ibuprofen",
        "medication_b": "",
        "related_allergen": "NSAIDs",
        "related_condition": "",
        "risk_level": "HIGH",
        "evidence_strength": "HIGH",
        "description": "SYNTHETIC DEMONSTRATION RULE: NSAID administration with documented NSAID sensitivity."
    },
    {
        "rule_id": "R-MED-001",
        "rule_type": "Medication-Medication",
        "medication_a": "Warfarin",
        "medication_b": "Aspirin",
        "related_allergen": "",
        "related_condition": "",
        "risk_level": "HIGH",
        "evidence_strength": "HIGH",
        "description": "SYNTHETIC DEMONSTRATION RULE: Concurrent anticoagulation and antiplatelet therapy increases major bleeding risk."
    },
    {
        "rule_id": "R-MED-002",
        "rule_type": "Medication-Medication",
        "medication_a": "Warfarin",
        "medication_b": "Ibuprofen",
        "related_allergen": "",
        "related_condition": "",
        "risk_level": "HIGH",
        "evidence_strength": "HIGH",
        "description": "SYNTHETIC DEMONSTRATION RULE: NSAID combined with Warfarin significantly elevates gastrointestinal bleeding risk."
    },
    {
        "rule_id": "R-MED-003",
        "rule_type": "Medication-Medication",
        "medication_a": "Lisinopril",
        "medication_b": "Spironolactone",
        "related_allergen": "",
        "related_condition": "",
        "risk_level": "MODERATE",
        "evidence_strength": "MODERATE",
        "description": "SYNTHETIC DEMONSTRATION RULE: ACE inhibitor combined with potassium-sparing agent may cause severe hyperkalemia."
    },
    {
        "rule_id": "R-COM-001",
        "rule_type": "Medication-Comorbidity",
        "medication_a": "Gentamicin",
        "medication_b": "",
        "related_allergen": "",
        "related_condition": "Chronic Kidney Disease Stage 3",
        "risk_level": "HIGH",
        "evidence_strength": "HIGH",
        "description": "SYNTHETIC DEMONSTRATION RULE: Aminoglycoside nephrotoxicity risk elevated in pre-existing Chronic Kidney Disease."
    },
    {
        "rule_id": "R-COM-002",
        "rule_type": "Medication-Comorbidity",
        "medication_a": "Ibuprofen",
        "medication_b": "",
        "related_allergen": "",
        "related_condition": "Chronic Kidney Disease Stage 3",
        "risk_level": "MODERATE",
        "evidence_strength": "HIGH",
        "description": "SYNTHETIC DEMONSTRATION RULE: NSAID nephrotoxicity can exacerbate pre-existing renal impairment."
    },
    {
        "rule_id": "R-COM-003",
        "rule_type": "Medication-Comorbidity",
        "medication_a": "Metoprolol",
        "medication_b": "",
        "related_allergen": "",
        "related_condition": "Asthma",
        "risk_level": "MODERATE",
        "evidence_strength": "MODERATE",
        "description": "SYNTHETIC DEMONSTRATION RULE: Beta-blocker administration may induce bronchospasm in severe asthma patients."
    }
]

def generate_synthetic_data():
    patients = []
    medications = []
    allergies = []
    conditions = []
    observations = []

    start_base_date = datetime(2026, 8, 25)

    # 1. GENERATE 8 EXPLICIT DEMO PATIENTS
    demo_specs = [
        {
            "id": "DEMO-001", "age": 64, "sex": "Male", "ward": "General Medicine 2B", "desc": "Med-Allergy Risk",
            "meds": [("Amoxicillin", "500mg", "Oral", -2, None, "ACTIVE"), ("Paracetamol", "1000mg", "Oral", -5, None, "ACTIVE")],
            "allergies": [("Penicillin", "Anaphylaxis & Rash", "SEVERE", -30, "ACTIVE")],
            "conditions": [("Bacterial Pneumonia", "MODERATE", -3, "ACTIVE")],
            "obs": [("120/80", 76, 38.2, 96, 0.9, 105)]
        },
        {
            "id": "DEMO-002", "age": 72, "sex": "Female", "ward": "Cardiology Ward 4A", "desc": "Med-Med Risk",
            "meds": [("Warfarin", "5mg", "Oral", -10, None, "ACTIVE"), ("Aspirin", "100mg", "Oral", -1, None, "ACTIVE")],
            "allergies": [("None Known", "None", "NONE", -60, "INACTIVE")],
            "conditions": [("Atrial Fibrillation", "HIGH", -100, "ACTIVE"), ("Hypertension", "MODERATE", -200, "ACTIVE")],
            "obs": [("135/85", 82, 36.8, 98, 1.1, 110)]
        },
        {
            "id": "DEMO-003", "age": 68, "sex": "Male", "ward": "Geriatrics 3C", "desc": "Med-Comorbidity Risk",
            "meds": [("Gentamicin", "80mg", "IV", -2, None, "ACTIVE"), ("Omeprazole", "20mg", "Oral", -7, None, "ACTIVE")],
            "allergies": [("Sulfa drugs", "Mild Urticaria", "MILD", -120, "ACTIVE")],
            "conditions": [("Chronic Kidney Disease Stage 3", "HIGH", -300, "ACTIVE")],
            "obs": [("110/70", 68, 37.0, 97, 2.4, 118)] # Elevated creatinine 2.4 mg/dL
        },
        {
            "id": "DEMO-004", "age": 55, "sex": "Female", "ward": "Surgical Ward 1A", "desc": "Missing Allergy Information",
            "meds": [("Ciprofloxacin", "400mg", "IV", -1, None, "ACTIVE")],
            "allergies": [], # Intentionally missing allergy documentation
            "conditions": [("Post-operative Infection", "MODERATE", -2, "ACTIVE")],
            "obs": [("124/78", 80, 37.5, 99, 0.8, 95)]
        },
        {
            "id": "DEMO-005", "age": 61, "sex": "Male", "ward": "General Medicine 2B", "desc": "Conflicting Allergy Information",
            "meds": [("Amoxicillin", "500mg", "Oral", -1, None, "ACTIVE")],
            "allergies": [
                ("Penicillin", "Anaphylaxis", "SEVERE", -400, "ACTIVE"),
                ("Penicillin", "No reaction reported", "NONE", -30, "INACTIVE")
            ],
            "conditions": [("Sinusitis", "MILD", -4, "ACTIVE")],
            "obs": [("118/74", 72, 36.9, 98, 0.9, 100)]
        },
        {
            "id": "DEMO-006", "age": 49, "sex": "Female", "ward": "ICU Stepdown", "desc": "Unknown Medication",
            "meds": [("UnrecognizedDrug-X9", "50mg", "Oral", -1, None, "ACTIVE"), ("Lisinopril", "10mg", "Oral", -10, None, "ACTIVE")],
            "allergies": [("Aspirin", "Bronchospasm", "MODERATE", -50, "ACTIVE")],
            "conditions": [("Hypertension", "MODERATE", -150, "ACTIVE")],
            "obs": [("130/82", 74, 36.6, 97, 1.0, 102)]
        },
        {
            "id": "DEMO-007", "age": 78, "sex": "Male", "ward": "Geriatrics 3C", "desc": "Duplicate Medication Entries",
            "meds": [
                ("Lisinopril", "10mg", "Oral", -15, None, "ACTIVE"),
                ("lisinopril", "10mg", "oral", -1, None, "ACTIVE") # Duplicate with lower case
            ],
            "allergies": [("None Known", "None", "NONE", -90, "ACTIVE")],
            "conditions": [("Hypertension", "MODERATE", -400, "ACTIVE")],
            "obs": [("142/88", 78, 36.7, 96, 1.2, 108)]
        },
        {
            "id": "DEMO-008", "age": 52, "sex": "Female", "ward": "General Medicine 2B", "desc": "No Significant Priority Alert",
            "meds": [("Metformin", "500mg", "Oral", -60, None, "ACTIVE"), ("Atorvastatin", "20mg", "Oral", -60, None, "ACTIVE")],
            "allergies": [("Latex", "Contact Dermatitis", "MILD", -500, "ACTIVE")],
            "conditions": [("Type 2 Diabetes Mellitus", "MODERATE", -600, "ACTIVE")],
            "obs": [("122/76", 70, 36.8, 99, 0.9, 115)]
        }
    ]

    for d in demo_specs:
        pid = d["id"]
        adm_date = (start_base_date - timedelta(days=5)).strftime("%Y-%m-%d")
        patients.append({
            "patient_id": pid, "age": d["age"], "sex": d["sex"], "ward": d["ward"],
            "admission_date": adm_date, "consent_status": "CONSENTED"
        })
        for m in d["meds"]:
            s_date = (start_base_date + timedelta(days=m[3])).strftime("%Y-%m-%d")
            e_date = (start_base_date + timedelta(days=m[4])).strftime("%Y-%m-%d") if m[4] else ""
            medications.append({
                "patient_id": pid, "medication_name": m[0], "dose": m[1], "route": m[2],
                "start_date": s_date, "end_date": e_date, "status": m[5]
            })
        for a in d["allergies"]:
            r_date = (start_base_date + timedelta(days=a[3])).strftime("%Y-%m-%d")
            allergies.append({
                "patient_id": pid, "allergen": a[0], "reaction": a[1], "severity": a[2],
                "recorded_date": r_date, "status": a[4]
            })
        for c in d["conditions"]:
            diag_date = (start_base_date + timedelta(days=c[2])).strftime("%Y-%m-%d")
            conditions.append({
                "patient_id": pid, "condition": c[0], "severity": c[1],
                "diagnosis_date": diag_date, "status": c[3]
            })
        for o in d["obs"]:
            obs_date = (start_base_date - timedelta(days=1)).strftime("%Y-%m-%d %H:%M")
            observations.append({
                "patient_id": pid, "observation_date": obs_date, "blood_pressure": o[0],
                "heart_rate": o[1], "temperature": o[2], "oxygen_saturation": o[3],
                "creatinine": o[4], "glucose": o[5]
            })

    # 2. GENERATE 100 POPULATION SYNTHETIC PATIENTS (P001 TO P100)
    for i in range(1, 101):
        pid = f"P{i:03d}"
        age = random.randint(18, 92)
        sex = random.choice(["Male", "Female"])
        ward = random.choice(WARDS)
        adm_days_ago = random.randint(1, 14)
        adm_date = (start_base_date - timedelta(days=adm_days_ago)).strftime("%Y-%m-%d")
        
        patients.append({
            "patient_id": pid, "age": age, "sex": sex, "ward": ward,
            "admission_date": adm_date, "consent_status": "CONSENTED"
        })

        # Add 1-4 medications per patient
        med_count = random.randint(1, 4)
        chosen_meds = random.sample(MEDICATIONS, med_count)
        
        # Introduce deliberate data quality flaws in ~15% of records
        for m in chosen_meds:
            med_name = m
            if random.random() < 0.1: # lower case flaw
                med_name = m.lower()
            elif random.random() < 0.05: # uppercase flaw
                med_name = m.upper()

            status = "ACTIVE"
            start_offset = random.randint(-10, -1)
            end_offset = None
            if random.random() < 0.2: # ended medication
                status = "ENDED"
                end_offset = random.randint(-4, -1)
            
            s_date = (start_base_date + timedelta(days=start_offset)).strftime("%Y-%m-%d")
            e_date = (start_base_date + timedelta(days=end_offset)).strftime("%Y-%m-%d") if end_offset else ""
            
            medications.append({
                "patient_id": pid, "medication_name": med_name, "dose": f"{random.choice([10, 20, 500, 100])}mg",
                "route": random.choice(["Oral", "IV", "Subcutaneous"]),
                "start_date": s_date, "end_date": e_date, "status": status
            })

            # Add occasional duplicate entry
            if random.random() < 0.05:
                medications.append({
                    "patient_id": pid, "medication_name": med_name, "dose": f"{random.choice([10, 20, 500, 100])}mg",
                    "route": "Oral", "start_date": s_date, "end_date": e_date, "status": status
                })

        # Add 0-2 allergies per patient
        if random.random() > 0.3:
            chosen_alg = random.choice(ALLERGENS)
            alg_name = chosen_alg
            if random.random() < 0.1:
                alg_name = chosen_alg.lower()
            allergies.append({
                "patient_id": pid, "allergen": alg_name, "reaction": random.choice(["Rash", "Hives", "Anaphylaxis", "Nausea"]),
                "severity": random.choice(["MILD", "MODERATE", "SEVERE"]),
                "recorded_date": (start_base_date - timedelta(days=random.randint(10, 300))).strftime("%Y-%m-%d"),
                "status": "ACTIVE"
            })

        # Add 1-2 conditions
        chosen_cond = random.choice(CONDITIONS)
        conditions.append({
            "patient_id": pid, "condition": chosen_cond,
            "severity": random.choice(["MILD", "MODERATE", "HIGH"]),
            "diagnosis_date": (start_base_date - timedelta(days=random.randint(30, 1000))).strftime("%Y-%m-%d"),
            "status": "ACTIVE"
        })

        # Add observations
        obs_date = (start_base_date - timedelta(hours=random.randint(2, 48))).strftime("%Y-%m-%d %H:%M")
        sys_bp = random.randint(90, 170)
        dia_bp = random.randint(55, 105)
        cr = round(random.uniform(0.6, 3.2), 2)
        observations.append({
            "patient_id": pid, "observation_date": obs_date,
            "blood_pressure": f"{sys_bp}/{dia_bp}", "heart_rate": random.randint(58, 115),
            "temperature": round(random.uniform(36.1, 38.8), 1),
            "oxygen_saturation": random.randint(92, 100),
            "creatinine": cr, "glucose": random.randint(80, 210)
        })

    # WRITE CSV FILES TO DATA DIRECTORIES
    def save_csv(filename, fieldnames, rows):
        path_raw = os.path.join(RAW_DIR, filename)
        path_data = os.path.join(DATA_DIR, filename)
        for p in [path_raw, path_data]:
            with open(p, "w", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(rows)

    save_csv("patients.csv", ["patient_id", "age", "sex", "ward", "admission_date", "consent_status"], patients)
    save_csv("medications.csv", ["patient_id", "medication_name", "dose", "route", "start_date", "end_date", "status"], medications)
    save_csv("allergies.csv", ["patient_id", "allergen", "reaction", "severity", "recorded_date", "status"], allergies)
    save_csv("conditions.csv", ["patient_id", "condition", "severity", "diagnosis_date", "status"], conditions)
    save_csv("observations.csv", ["patient_id", "observation_date", "blood_pressure", "heart_rate", "temperature", "oxygen_saturation", "creatinine", "glucose"], observations)
    save_csv("interactions.csv", ["rule_id", "rule_type", "medication_a", "medication_b", "related_allergen", "related_condition", "risk_level", "evidence_strength", "description"], SYNTHETIC_RULES)

    print(f"[DATA GEN SUCCESS] Created synthetic data for {len(patients)} patients across CSV files.")

if __name__ == "__main__":
    generate_synthetic_data()
