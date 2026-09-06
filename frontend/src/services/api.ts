import { PatientSummary, PatientDetail, RiskAlert, AuditLog, EvaluationSummary, EvaluationError } from '../types';

const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('medsafe_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Login failed');
  }
  return res.json();
}

export async function recordConsent(disclaimerAccepted: boolean) {
  const res = await fetch(`${API_BASE}/auth/consent`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ disclaimer_accepted: disclaimerAccepted }),
  });
  if (!res.ok) throw new Error('Consent recording failed');
  return res.json();
}

export async function fetchPatients(query?: string, ward?: string, riskLevel?: string): Promise<PatientSummary[]> {
  const params = new URLSearchParams();
  if (query) params.append('query', query);
  if (ward) params.append('ward', ward);
  if (riskLevel) params.append('risk_level', riskLevel);

  const res = await fetch(`${API_BASE}/patients?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch patient list');
  return res.json();
}

export async function fetchPatientDetail(patientId: string): Promise<PatientDetail> {
  const res = await fetch(`${API_BASE}/patients/${patientId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch patient detail for ${patientId}`);
  return res.json();
}

export async function fetchRiskDetail(riskId: string): Promise<RiskAlert> {
  const res = await fetch(`${API_BASE}/risks/${riskId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to fetch risk detail for ${riskId}`);
  return res.json();
}

export async function submitRiskReview(riskId: string, status: string, comment: string): Promise<RiskAlert> {
  const res = await fetch(`${API_BASE}/risks/${riskId}/review`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status, comment }),
  });
  if (!res.ok) throw new Error('Failed to submit review');
  return res.json();
}

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  const res = await fetch(`${API_BASE}/audit`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}

export async function fetchEvaluationSummary(): Promise<EvaluationSummary> {
  const res = await fetch(`${API_BASE}/evaluation/summary`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch evaluation summary');
  return res.json();
}

export async function fetchEvaluationErrors(): Promise<EvaluationError[]> {
  const res = await fetch(`${API_BASE}/evaluation/errors`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch evaluation error analysis');
  return res.json();
}

export async function submitFeedback(usability: number, evidenceClarity: number, uncertaintyClarity: number, comments: string) {
  const res = await fetch(`${API_BASE}/feedback`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      usability_score: usability,
      evidence_clarity_score: evidenceClarity,
      uncertainty_clarity_score: uncertaintyClarity,
      comments,
    }),
  });
  if (!res.ok) throw new Error('Failed to submit feedback');
  return res.json();
}

export async function fetchFeedbackSummary() {
  const res = await fetch(`${API_BASE}/feedback/summary`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch feedback summary');
  return res.json();
}

export async function fetchPrivacyInfo() {
  const res = await fetch(`${API_BASE}/privacy`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch privacy information');
  return res.json();
}
