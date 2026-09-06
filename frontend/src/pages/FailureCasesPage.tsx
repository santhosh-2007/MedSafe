import React from 'react';
import { FileCode, CheckCircle2, ShieldAlert, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FailureCasesPage: React.FC = () => {
  const cases = [
    {
      id: 'CASE-01',
      title: 'Missing Allergy Information',
      patientId: 'DEMO-004',
      input: 'Patient profile with no allergy records documented in medical history.',
      behavior: 'System displays "Allergy Information Unavailable" warning badge. Does NOT assume "No Allergies".',
      expected: 'Never assume absence of allergy data equals absence of clinical allergy.',
      implication: 'Prevents false sense of security when allergy documentation is incomplete.',
      status: 'PASS'
    },
    {
      id: 'CASE-02',
      title: 'Conflicting Allergy Records',
      patientId: 'DEMO-005',
      input: 'Penicillin allergy recorded as SEVERE in 2024 and INACTIVE/NONE in 2026.',
      behavior: 'System flags "Conflicting Allergy Records Detected" requiring clinician reconciliation.',
      expected: 'Flag conflicting documentation for manual clinical review.',
      implication: 'Avoids misinterpreting resolved allergies when severe reactions were previously noted.',
      status: 'PASS'
    },
    {
      id: 'CASE-03',
      title: 'Unknown / Unrecognized Medication',
      patientId: 'DEMO-006',
      input: 'Active medication listed as "UnrecognizedDrug-X9" not in standard drug catalog.',
      behavior: 'System displays "Medication Not Recognized. Interaction assessment may be incomplete."',
      expected: 'Do not silently ignore unknown drugs.',
      implication: 'Notifies clinician to request manual monograph review by pharmacy.',
      status: 'PASS'
    },
    {
      id: 'CASE-04',
      title: 'Duplicate Medication Entries',
      patientId: 'DEMO-007',
      input: 'Lisinopril 10mg listed twice under different start dates and capitalization ("Lisinopril" & "lisinopril").',
      behavior: 'Data cleaning pipeline normalizes drug names and removes exact duplicates before running risk engine.',
      expected: 'Identify and consolidate duplicate orders cleanly.',
      implication: 'Eliminates double-counting of interaction scores.',
      status: 'PASS'
    },
    {
      id: 'CASE-05',
      title: 'Outdated / Ended Medication Record',
      patientId: 'P001',
      input: 'Historical medication discontinued 30 days ago.',
      behavior: 'System flags medication status as ENDED and excludes it from active interaction rule matches.',
      expected: 'Do not treat historical ended medications as current active risks.',
      implication: 'Prevents false positive alerts for discontinued treatments.',
      status: 'PASS'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <FileCode className="mr-2 text-medical-600" size={24} />
            Handled Failure & Clinical Edge Cases
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            System robustness testing under incomplete, ambiguous, or corrupted real-world data quality conditions.
          </p>
        </div>
      </div>

      {/* Case Cards Grid */}
      <div className="space-y-4">
        {cases.map((c) => (
          <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {c.id}
                </span>
                <h3 className="font-bold text-base text-slate-900">{c.title}</h3>
              </div>

              <div className="flex items-center space-x-3">
                <Link
                  to={`/patients/${c.patientId}`}
                  className="text-xs font-bold text-medical-700 hover:underline flex items-center"
                >
                  Test on {c.patientId}
                  <ArrowRight size={14} className="ml-1" />
                </Link>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-black flex items-center">
                  <CheckCircle2 size={12} className="mr-1" />
                  {c.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Data Input</span>
                <p className="text-slate-800 mt-1 font-medium">{c.input}</p>
              </div>

              <div className="bg-medical-50/60 p-3 rounded-xl border border-medical-200">
                <span className="font-bold text-medical-800 uppercase tracking-wider block text-[10px]">System Behavior</span>
                <p className="text-medical-950 mt-1 font-medium">{c.behavior}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Expected Behavior</span>
                <p className="text-slate-800 mt-1 font-medium">{c.expected}</p>
              </div>

              <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-amber-900">
                <span className="font-bold text-amber-800 uppercase tracking-wider block text-[10px]">Safety Implication</span>
                <p className="mt-1 font-medium">{c.implication}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
