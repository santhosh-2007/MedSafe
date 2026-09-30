import os
from datetime import datetime

def generate_patient_clinical_report_html(patient, medications, allergies, conditions, observations, risk_alerts):
    high_alerts = [a for a in risk_alerts if a.risk_level == "HIGH"]
    mod_alerts = [a for a in risk_alerts if a.risk_level == "MODERATE"]

    alerts_html = ""
    if not risk_alerts:
        alerts_html = "<div class='safe'>No high or moderate priority interaction risks detected. Continue routine monitoring.</div>"
    else:
        for a in risk_alerts:
            color = "#dc2626" if a.risk_level == "HIGH" else "#ea580c" if a.risk_level == "MODERATE" else "#d97706"
            alerts_html += f"""
            <div style="border-left: 4px solid {color}; background: #f8fafc; padding: 12px; margin-bottom: 12px; border-radius: 6px;">
                <div style="font-weight: bold; color: {color}; text-transform: uppercase; font-size: 12px;">{a.risk_level} PRIORITY • {a.risk_type}</div>
                <h3 style="margin: 4px 0; font-size: 16px;">{a.medication_a} {f"↕ {a.medication_b}" if a.medication_b else ""} {f"↕ {a.related_allergen} Allergy" if a.related_allergen else ""} {f"↕ {a.related_condition}" if a.related_condition else ""}</h3>
                <p style="font-size: 12px; color: #334155; margin: 4px 0;"><strong>System Match Confidence:</strong> {a.confidence}%</p>
                <div style="background: #ef444415; border: 1px solid #fca5a5; padding: 8px; border-radius: 4px; margin-top: 8px; font-size: 11px; color: #991b1b;">
                    <strong>POTENTIAL HARM:</strong> {a.potential_harm}
                </div>
                <p style="font-size: 10px; color: #64748b; font-style: italic; margin-top: 6px;">{a.safety_disclaimer}</p>
            </div>
            """

    meds_rows = "".join([f"<tr><td>{m.medication_name}</td><td>{m.dose}</td><td>{m.route}</td><td>{m.start_date}</td><td>{m.status}</td></tr>" for m in medications])
    algs_rows = "".join([f"<tr><td>{a.allergen}</td><td>{a.reaction}</td><td>{a.severity}</td><td>{a.recorded_date}</td></tr>" for a in allergies])

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>MedSafe Clinical Safety Report - {patient.patient_id}</title>
        <style>
            body {{ font-family: Arial, sans-serif; font-size: 12px; color: #0f172a; margin: 20px; }}
            .header {{ border-bottom: 2px solid #026fc2; padding-bottom: 10px; margin-bottom: 20px; }}
            .title {{ font-size: 20px; font-weight: bold; color: #026fc2; }}
            .subtitle {{ font-size: 12px; color: #475569; }}
            .section-title {{ font-size: 14px; font-weight: bold; margin-top: 20px; margin-bottom: 8px; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }}
            table {{ width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px; }}
            th, td {{ border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }}
            th {{ background-color: #f1f5f9; color: #334155; font-weight: bold; }}
            .disclaimer-box {{ background: #fef3c7; border: 1px solid #fcd34d; padding: 10px; border-radius: 6px; font-size: 11px; color: #92400e; margin-top: 20px; }}
        </style>
    </head>
    <body>
        <div class="header">
            <div class="title">MedSafe Clinical Decision Support Report</div>
            <div class="subtitle">Patient ID: {patient.patient_id} • Ward: {patient.ward} • Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}</div>
        </div>

        <div>
            <strong>Demographics:</strong> Age: {patient.age} | Sex: {patient.sex} | Admission: {patient.admission_date} | Consent: {patient.consent_status}
        </div>

        <div class="section-title">Prioritized Safety & Risk Analysis ({len(risk_alerts)} Alerts)</div>
        {alerts_html}

        <div class="section-title">Active & Historical Medication Orders ({len(medications)})</div>
        <table>
            <thead><tr><th>Medication</th><th>Dose</th><th>Route</th><th>Start Date</th><th>Status</th></tr></thead>
            <tbody>{meds_rows}</tbody>
        </table>

        <div class="section-title">Documented Patient Allergies ({len(allergies)})</div>
        <table>
            <thead><tr><th>Allergen</th><th>Reaction</th><th>Severity</th><th>Recorded Date</th></tr></thead>
            <tbody>{algs_rows}</tbody>
        </table>

        <div class="disclaimer-box">
            <strong>MANDATORY CLINICAL SAFETY DIRECTIVE:</strong> MedSafe provides decision support only and does NOT replace professional clinical judgment. Confidence scores represent system rule matching, not clinical certainty. All alerts must be verified against source medical records.
        </div>
    </body>
    </html>
    """
    return html_content
