import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Pill, AlertOctagon, HeartPulse, Activity, 
  ShieldAlert, Eye, CheckCircle, Clock, Calendar, FileText 
} from 'lucide-react';
import { fetchPatientDetail, submitRiskReview } from '../services/api';
import { PatientDetail, RiskAlert } from '../types';
import { RiskCard } from '../components/RiskCard';
import { EvidenceDrawer } from '../components/EvidenceDrawer';
import { ReviewModal } from '../components/ReviewModal';
import { CardSkeleton } from '../components/SkeletonLoaders';

export const PatientDetailPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'MEDS' | 'ALLERGIES' | 'CONDITIONS' | 'OBSERVATIONS'>('MEDS');

  // Modals / Drawers
  const [selectedAlertForEvidence, setSelectedAlertForEvidence] = useState<RiskAlert | null>(null);
  const [selectedAlertForReview, setSelectedAlertForReview] = useState<RiskAlert | null>(null);

  const loadData = async () => {
    if (!patientId) return;
    try {
      const data = await fetchPatientDetail(patientId);
      setPatient(data);
    } catch (err) {
      console.error('Failed loading patient detail', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [patientId]);

  const handleReviewSubmit = async (riskId: string, status: string, comment: string) => {
    await submitRiskReview(riskId, status, comment);
    await loadData(); // Reload to refresh review state
  };

  if (loading || !patient) return <CardSkeleton />;

  const highAlerts = patient.risk_alerts.filter(a => a.risk_level === 'HIGH');
  const modAlerts = patient.risk_alerts.filter(a => a.risk_level === 'MODERATE');
  const reviewAlerts = patient.risk_alerts.filter(a => a.risk_level === 'REVIEW');

  return (
    <div className="space-y-6">
      {/* Top Navigation & Patient Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <Link to="/patients" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-800">
          <ArrowLeft size={16} className="mr-1" />
          Back to Patient List
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-black text-slate-900">{patient.patient_id}</h2>
              <span className="bg-medical-100 text-medical-800 border border-medical-300 text-xs font-bold px-3 py-1 rounded-full">
                {patient.ward}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                {patient.consent_status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {patient.age} years old • {patient.sex} • Admitted: {patient.admission_date}
            </p>
          </div>

          {/* Quick Risk Summary Counter */}
          <div className="flex items-center space-x-2">
            <div className="bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl text-center">
              <span className="block text-xs font-bold text-red-800">{highAlerts.length} High</span>
            </div>
            <div className="bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xl text-center">
              <span className="block text-xs font-bold text-orange-800">{modAlerts.length} Mod</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-center">
              <span className="block text-xs font-bold text-amber-800">{reviewAlerts.length} Review</span>
            </div>
          </div>
        </div>

        {/* Clinical Records Tabs */}
        <div className="flex space-x-2 border-b border-slate-200 pt-2">
          <button
            onClick={() => setActiveTab('MEDS')}
            className={`pb-2 px-4 text-xs font-bold flex items-center border-b-2 transition ${
              activeTab === 'MEDS'
                ? 'border-medical-600 text-medical-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Pill size={14} className="mr-1.5" />
            Medications ({patient.medications.length})
          </button>

          <button
            onClick={() => setActiveTab('ALLERGIES')}
            className={`pb-2 px-4 text-xs font-bold flex items-center border-b-2 transition ${
              activeTab === 'ALLERGIES'
                ? 'border-medical-600 text-medical-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertOctagon size={14} className="mr-1.5 text-red-600" />
            Allergies ({patient.allergies.length})
          </button>

          <button
            onClick={() => setActiveTab('CONDITIONS')}
            className={`pb-2 px-4 text-xs font-bold flex items-center border-b-2 transition ${
              activeTab === 'CONDITIONS'
                ? 'border-medical-600 text-medical-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HeartPulse size={14} className="mr-1.5 text-indigo-600" />
            Comorbidities ({patient.conditions.length})
          </button>

          <button
            onClick={() => setActiveTab('OBSERVATIONS')}
            className={`pb-2 px-4 text-xs font-bold flex items-center border-b-2 transition ${
              activeTab === 'OBSERVATIONS'
                ? 'border-medical-600 text-medical-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity size={14} className="mr-1.5 text-emerald-600" />
            Recent Observations ({patient.observations.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="pt-2">
          {activeTab === 'MEDS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {patient.medications.map((m) => (
                <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{m.medication_name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      m.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                  <p className="text-slate-600">Dose: {m.dose} • Route: {m.route}</p>
                  <p className="text-[11px] text-slate-400">Started: {m.start_date} {m.end_date ? `• Ended: ${m.end_date}` : ''}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'ALLERGIES' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {patient.allergies.length === 0 ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium">
                  ⚠ No documented allergy information found for this patient.
                </div>
              ) : (
                patient.allergies.map((a) => (
                  <div key={a.id} className="p-3 bg-red-50/50 rounded-xl border border-red-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-900 text-sm">{a.allergen}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-300">
                        {a.severity}
                      </span>
                    </div>
                    <p className="text-slate-700">Reaction: {a.reaction}</p>
                    <p className="text-[11px] text-slate-500">Recorded Date: {a.recorded_date}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'CONDITIONS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {patient.conditions.map((c) => (
                <div key={c.id} className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-950 text-sm">{c.condition}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                      {c.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Diagnosis Date: {c.diagnosis_date}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'OBSERVATIONS' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {patient.observations.map((o) => (
                <div key={o.id} className="p-4 bg-emerald-50/30 rounded-xl border border-emerald-200 text-xs space-y-2">
                  <div className="text-[11px] text-slate-500 font-bold flex items-center justify-between">
                    <span>Recorded: {o.observation_date}</span>
                    <Activity size={14} className="text-emerald-600" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-slate-400 block">BP</span> <strong className="text-slate-900">{o.blood_pressure}</strong></div>
                    <div><span className="text-slate-400 block">Heart Rate</span> <strong className="text-slate-900">{o.heart_rate} bpm</strong></div>
                    <div><span className="text-slate-400 block">Temp</span> <strong className="text-slate-900">{o.temperature}°C</strong></div>
                    <div><span className="text-slate-400 block">SpO2</span> <strong className="text-slate-900">{o.oxygen_saturation}%</strong></div>
                    <div>
                      <span className="text-slate-400 block">Creatinine</span> 
                      <strong className={`px-1.5 py-0.5 rounded ${o.creatinine && o.creatinine > 1.8 ? 'bg-red-100 text-red-800 font-extrabold' : 'text-slate-900'}`}>
                        {o.creatinine} mg/dL
                      </strong>
                    </div>
                    <div><span className="text-slate-400 block">Glucose</span> <strong className="text-slate-900">{o.glucose} mg/dL</strong></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PRIORITIZED SAFETY SUMMARY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center">
              <ShieldAlert size={20} className="mr-2 text-medical-600" />
              Prioritized Clinical Safety Summary ({patient.risk_alerts.length} Potential Concerns)
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated by rule engine combining Medications, Allergies, Comorbidities & Observation Context.
            </p>
          </div>
        </div>

        {patient.risk_alerts.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center text-emerald-900">
            <CheckCircle size={32} className="mx-auto mb-2 text-emerald-600" />
            <h4 className="font-bold text-base">No High/Moderate Priority Interaction Alerts Found</h4>
            <p className="text-xs text-emerald-700 mt-1">
              Active treatments do not trigger configured synthetic safety rules. Continue routine clinical monitoring.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patient.risk_alerts.map((alert) => (
              <RiskCard
                key={alert.risk_id}
                alert={alert}
                onViewEvidence={(al) => setSelectedAlertForEvidence(al)}
                onReview={(al) => setSelectedAlertForReview(al)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <EvidenceDrawer
        alert={selectedAlertForEvidence}
        onClose={() => setSelectedAlertForEvidence(null)}
      />

      <ReviewModal
        alert={selectedAlertForReview}
        onClose={() => setSelectedAlertForReview(null)}
        onSubmitReview={handleReviewSubmit}
      />
    </div>
  );
};
