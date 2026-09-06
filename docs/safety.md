# MEDSAFE - Medical Safety Specification

## Critical Safety Directives

MEDSAFE is an academic and research prototype designed to support clinician review. It adheres to strict medical safety principles:

### 1. Mandatory Human-in-the-Loop
The system **NEVER**:
- Replaces professional clinical judgment
- Automatically orders, stops, or modifies prescriptions
- Asserts autonomous diagnostic conclusions (e.g. "Patient definitely has...")
- Emits prescriptive commands such as "Stop this medication" or "Start this medication"

Instead, the system strictly uses decision-support phrasing:
- *"Potential concern identified."*
- *"Requires clinician review."*
- *"Possible interaction detected."*
- *"Verify against source medical records."*

### 2. System Confidence vs Clinical Certainty
Every alert clearly distinguishes system matching confidence from clinical certainty. All UI cards display:
> *"Confidence represents system confidence in the configured rule match, not clinical certainty."*

### 3. Potential Harm Disclaimers
Every high and moderate priority alert explicitly displays:
> *"⚠ POTENTIAL HARM: An incorrect interpretation could lead to unnecessary medication changes or delay appropriate treatment. Clinician verification required."*

### 4. Causal Separation for Recent Observations
Recent observations (e.g. Creatinine > 1.8 mg/dL or Blood Pressure < 90 mmHg) are displayed to increase contextual relevance only. The system explicitly states:
> *"NOTE: System highlights relevant recent observations as contextual indicators only; does NOT assert a causal relationship."*
