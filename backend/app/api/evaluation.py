import os
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.models.domain import User, EvaluationResult
from backend.app.auth.rbac import require_roles
from scripts.run_evaluation import run_evaluation_experiment, RESULTS_DIR

router = APIRouter(prefix="/api/evaluation", tags=["Evaluation"])

@router.get("/summary")
def get_evaluation_summary(
    current_user: User = Depends(require_roles(["ADMIN", "DOCTOR", "NURSE"])),
    db: Session = Depends(get_db)
):
    results_path = os.path.join(RESULTS_DIR, "evaluation_results.json")
    if os.path.exists(results_path):
        with open(results_path, "r", encoding="utf-8") as f:
            return json.load(f)

    latest = db.query(EvaluationResult).order_by(EvaluationResult.run_timestamp.desc()).first()
    if not latest:
        # Run on demand if not present
        return run_evaluation_experiment()

    return {
        "run_timestamp": latest.run_timestamp.isoformat(),
        "total_cases": latest.total_cases,
        "baseline_median_time_sec": latest.baseline_median_time_sec,
        "prototype_median_time_sec": latest.prototype_median_time_sec,
        "time_reduction_pct": latest.time_reduction_pct,
        "target_reduction_pct": 25.0,
        "precision": latest.precision,
        "recall": latest.recall,
        "f1_score": latest.f1_score,
        "false_positives": latest.false_positives,
        "false_negatives": latest.false_negatives,
        "missed_risks": latest.missed_risks,
        "status": latest.status
    }

@router.get("/errors")
def get_evaluation_errors(
    current_user: User = Depends(require_roles(["ADMIN", "DOCTOR"])),
    db: Session = Depends(get_db)
):
    error_path = os.path.join(RESULTS_DIR, "error_analysis.json")
    if os.path.exists(error_path):
        with open(error_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

@router.post("/run")
def trigger_evaluation_run(
    current_user: User = Depends(require_roles(["ADMIN"])),
    db: Session = Depends(get_db)
):
    summary = run_evaluation_experiment()
    return {"status": "SUCCESS", "summary": summary}
