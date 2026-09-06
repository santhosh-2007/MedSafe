# MEDSAFE - Automated Testing Specification

## Test Suite Overview

MEDSAFE includes an automated test suite executed via `pytest`.

### Test Files

1. `tests/test_risk_engine.py`:
   - Tests Medication-Allergy cross-reactivity rule matching
   - Tests Medication-Medication interaction rule matching
   - Tests Medication-Comorbidity contraindication rule matching
   - Tests observation context score escalation (elevated creatinine)
   - Tests missing allergy edge case flagging

2. `tests/test_data_pipeline.py`:
   - Tests dataset cleaning, drug name normalization, exact duplicate removal, missing value detection, quality report generation.

3. `tests/test_api.py`:
   - Tests authentication (`/api/auth/login`), JWT validation, role-based access control, consent recording (`/api/auth/consent`), patient directory listing (`/api/patients`), health check (`/api/health`).

## Running Tests

```bash
pytest
```
