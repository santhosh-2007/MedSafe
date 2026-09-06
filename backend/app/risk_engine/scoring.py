def compute_risk_priority(score):
    score_val = float(score)
    if score_val >= 80.0:
        return "HIGH"
    elif score_val >= 50.0:
        return "MODERATE"
    else:
        return "REVIEW"

def categorize_confidence(confidence_pct):
    conf = float(confidence_pct)
    if conf >= 90.0:
        return "High Confidence"
    elif conf >= 70.0:
        return "Moderate Confidence"
    else:
        return "Low Confidence"
