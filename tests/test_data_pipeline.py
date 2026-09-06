import os
import pytest
from scripts.clean_data import clean_and_normalize_data, PROCESSED_DIR

def test_data_cleaning_pipeline_execution():
    report = clean_and_normalize_data()

    assert report["total_patients"] > 0
    assert report["total_raw_medications"] > 0
    assert "duplicate_medications_removed" in report
    assert "normalized_medication_names" in report
    assert "missing_allergy_values" in report

    assert os.path.exists(os.path.join(PROCESSED_DIR, "patients.csv"))
    assert os.path.exists(os.path.join(PROCESSED_DIR, "medications.csv"))
    assert os.path.exists(os.path.join(PROCESSED_DIR, "allergies.csv"))
    assert os.path.exists(os.path.join(PROCESSED_DIR, "quality_report.json"))
