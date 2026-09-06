def attach_observation_context(alerts, recent_observations):
    if not recent_observations:
        return alerts

    # Sort observations by date descending
    latest_obs = sorted(recent_observations, key=lambda x: x.observation_date or "", reverse=True)[0]

    obs_notes = []
    creatinine_elevated = latest_obs.creatinine and latest_obs.creatinine > 1.8
    bp_str = latest_obs.blood_pressure or ""
    bp_low = False
    if "/" in bp_str:
        try:
            sys_val = int(bp_str.split("/")[0])
            if sys_val < 95:
                bp_low = True
        except ValueError:
            pass

    for alert in alerts:
        # Check nephrotoxic context
        if creatinine_elevated and ("Gentamicin" in alert["medication_a"] or "Kidney Disease" in alert.get("related_condition", "") or "Ibuprofen" in alert["medication_a"]):
            alert["base_score"] = min(100.0, alert["base_score"] + 12.0)
            obs_evidence = f"Recent observation context ({latest_obs.observation_date}): Serum Creatinine is elevated at {latest_obs.creatinine} mg/dL (Normal: 0.6-1.2 mg/dL). Recent observation may increase the relevance of this alert."
            alert["evidence"].append(obs_evidence)
            alert["evidence"].append("NOTE: System highlights relevant recent observations as contextual indicators only; does NOT assert a causal relationship.")

        # Check BP context
        if bp_low and ("Lisinopril" in alert["medication_a"] or "Metoprolol" in alert["medication_a"]):
            alert["base_score"] = min(100.0, alert["base_score"] + 10.0)
            obs_evidence = f"Recent observation context ({latest_obs.observation_date}): Blood pressure is low at {latest_obs.blood_pressure} mmHg. Recent observation may increase the relevance of this alert."
            alert["evidence"].append(obs_evidence)
            alert["evidence"].append("NOTE: System highlights relevant recent observations as contextual indicators only; does NOT assert a causal relationship.")

    return alerts
