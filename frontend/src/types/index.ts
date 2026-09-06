export type Role = 'DOCTOR' | 'NURSE' | 'ADMIN';

export interface User {
  username: string;
  role: Role;
  full_name: string;
  token?: string;
}

export interface PatientSummary {
  patient_id: string;
  age: number;
  sex: string;
  ward: string;
  admission_date: string;
  active_medication_count: number;
  allergy_count: number;
  condition_count: number;
  highest_risk_level: 'HIGH' | 'MODERATE' | 'REVIEW' | 'SAFE';
  risk_alert_count: number;
}

export interface Medication {
  id: number;
  patient_id: string;
  medication_name: string;
  dose: string;
  route: string;
  start_date: string;
  end_date: string;
  status: 'ACTIVE' | 'ENDED';
}

export interface Allergy {
  id: number;
  patient_id: string;
  allergen: string;
  reaction: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE';
  recorded_date: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Condition {
  id: number;
  patient_id: string;
  condition: string;
  severity: string;
  diagnosis_date: string;
  status: string;
}

export interface Observation {
  id: number;
  patient_id: string;
  observation_date: string;
  blood_pressure: string;
  heart_rate: number;
  temperature: number;
  oxygen_saturation: number;
  creatinine: number;
  glucose: number;
}

export interface RiskEvidence {
  id: number;
  evidence_item: string;
  evidence_type: string;
  record_date?: string;
}

export interface RiskAlert {
  risk_id: string;
  patient_id: string;
  risk_type: 'Medication-Allergy' | 'Medication-Medication' | 'Medication-Comorbidity';
  medication_a: string;
  medication_b?: string;
  related_allergen?: string;
  related_condition?: string;
  risk_level: 'HIGH' | 'MODERATE' | 'REVIEW';
  score: number;
  confidence: number;
  uncertainty: string;
  potential_harm: string;
  safety_disclaimer: string;
  status: 'UNREVIEWED' | 'REVIEWED_NO_ACTION' | 'REVIEWED_FOLLOW_UP' | 'FALSE_POSITIVE' | 'UNABLE_TO_DETERMINE';
  review_comment?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  evidences: RiskEvidence[];
}

export interface PatientDetail {
  patient_id: string;
  age: number;
  sex: string;
  ward: string;
  admission_date: string;
  consent_status: string;
  medications: Medication[];
  allergies: Allergy[];
  conditions: Condition[];
  observations: Observation[];
  risk_alerts: RiskAlert[];
}

export interface AuditLog {
  id: number;
  timestamp: string;
  username: string;
  role: string;
  action: string;
  patient_id?: string;
  details?: string;
}

export interface EvaluationSummary {
  run_timestamp: string;
  total_cases: number;
  baseline_median_time_sec: number;
  prototype_median_time_sec: number;
  time_reduction_pct: number;
  target_reduction_pct: number;
  precision: number;
  recall: number;
  f1_score: number;
  false_positives: number;
  false_negatives: number;
  missed_risks: number;
  status: 'TARGET_ACHIEVED' | 'TARGET_NOT_ACHIEVED';
}

export interface EvaluationError {
  patient_id: string;
  error_type: string;
  expected: string[];
  predicted: string[];
  reason: string;
  safety_implication: string;
}
