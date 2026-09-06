# MEDSAFE - Academic Evaluation Report

## 1. Objective

The primary measurable objective of MEDSAFE is:
> **Reduce the median time required for clinicians to identify relevant medication safety interaction risks by at least 25% compared with a standard unranked chronological baseline.**

## 2. Experimental Setup

- **Dataset**: 108 synthetic patient profiles (100 population patients + 8 dedicated demonstration patients).
- **Baseline**: Standard Electronic Health Record chronological raw event view without risk ranking or automated evidence synthesis.
- **Prototype**: MEDSAFE explainable decision support workspace.

## 3. Measured Results

| Metric | Target | Baseline | Prototype | Result / Difference | Status |
|---|---|---|---|---|---|
| **Median Identification Time** | ≥25% Reduction | 29.5s | 4.5s | **84.7% Reduction** | **TARGET ACHIEVED** |
| **Precision** | -- | -- | 0.615 | 61.5% | Evaluated |
| **Recall** | -- | -- | 0.800 | 80.0% | Evaluated |
| **F1 Score** | -- | -- | 0.695 | 0.695 | Evaluated |
| **False Positives** | -- | -- | 5 | Flagged for review | Evaluated |
| **False Negatives** | -- | -- | 2 | Flagged for review | Evaluated |

## 4. Conclusion

MEDSAFE achieved an empirical **84.7% reduction** in median risk identification time compared with the chronological baseline, far exceeding the 25% target requirement.
