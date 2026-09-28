import React, { useEffect, useState } from 'react';
import { Users, Filter, CheckCircle2, ShieldAlert, Download, Building2, ChevronRight } from 'lucide-react';
import { fetchPatients, submitRiskReview } from '../services/api';
import { PatientSummary } from '../types';
import { Link } from 'react-router-dom';

export const WardRoundPage: React.FC = () => {
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [selectedWard, setSelectedWard] = useState<string>('General Medicine 2B');
  const [selectedPriority, setSelectedPriority] = useState<string>('HIGH');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPatients();
        setPatients(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const wards = Array.from(new Set(patients.map(p => p.ward)));
  const wardPatients = patients.filter(p => p.ward === selectedWard);
  const highPriorityPatients = wardPatients.filter(p => p.highest_risk_level === selectedPriority || selectedPriority === 'ALL');

  const exportAuditSummary = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Patient ID,Ward,Highest Risk,Alert Count,Active Meds\n"
      + wardPatients.map(e => `${e.patient_id},${e.ward},${e.highest_risk_level},${e.risk_alert_count},${e.active_medication_count}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Ward_Round_Report_${selectedWard.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <Building2 className="mr-2 text-medical-600" size={24} />
            Multi-Patient Ward Round Batch Review (70% Scope Extension)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Batch review clinical safety alerts, filter by ward location, and export clinical audit logs for multidisciplinary team rounds.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportAuditSummary}
            className="bg-medical-700 hover:bg-medical-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition flex items-center"
          >
            <Download size={14} className="mr-1.5" />
            Export Ward Summary (CSV)
          </button>
        </div>
      </div>

      {/* Ward Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Ward:</span>
          <div className="flex space-x-2 overflow-x-auto">
            {wards.map((w) => (
              <button
                key={w}
                onClick={() => setSelectedWard(w)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedWard === w
                    ? 'bg-medical-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="font-bold text-slate-500">Filter Priority:</span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1 bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">HIGH Priority Only</option>
            <option value="MODERATE">MODERATE Priority Only</option>
          </select>
        </div>
      </div>

      {/* Batch Patient Ward Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {highPriorityPatients.map((p) => (
          <div key={p.patient_id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3 hover:shadow-md transition">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-base text-slate-900">{p.patient_id}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                p.highest_risk_level === 'HIGH' ? 'bg-red-100 text-red-800 border-red-300' :
                p.highest_risk_level === 'MODERATE' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                'bg-slate-100 text-slate-700 border-slate-300'
              }`}>
                {p.highest_risk_level}
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p>Age/Sex: {p.age}y / {p.sex}</p>
              <p>Active Meds: <strong>{p.active_medication_count}</strong> • Allergies: <strong>{p.allergy_count}</strong></p>
              <p>Risk Alerts Triggered: <strong className="text-red-700">{p.risk_alert_count}</strong></p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <Link
                to={`/patients/${p.patient_id}`}
                className="text-xs font-bold text-medical-700 hover:text-medical-900 flex items-center"
              >
                Review Full Profile
                <ChevronRight size={14} className="ml-1" />
              </Link>

              <a
                href={`/api/fhir/patients/${p.patient_id}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-slate-500 font-semibold hover:underline"
              >
                FHIR R4 JSON
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
