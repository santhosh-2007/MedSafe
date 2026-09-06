import React, { useState, useEffect } from 'react';
import { GitCompare, Clock, ShieldCheck, ArrowRight, Play, RotateCcw, AlertTriangle } from 'lucide-react';
import { fetchPatientDetail } from '../services/api';
import { PatientDetail } from '../types';

export const BaselinePage: React.FC = () => {
  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [baselineRecordFoundTime, setBaselineRecordFoundTime] = useState<number | null>(null);
  const [prototypeFoundTime, setPrototypeFoundTime] = useState<number | null>(null);

  useEffect(() => {
    fetchPatientDetail('DEMO-001').then(setPatient).catch(console.error);
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 0.1);
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleStartTimer = () => {
    setElapsedSeconds(0);
    setBaselineRecordFoundTime(null);
    setPrototypeFoundTime(null);
    setTimerActive(true);
  };

  const handleStopBaseline = () => {
    setBaselineRecordFoundTime(parseFloat(elapsedSeconds.toFixed(1)));
  };

  const handleStopPrototype = () => {
    setPrototypeFoundTime(parseFloat(elapsedSeconds.toFixed(1)));
    setTimerActive(false);
  };

  if (!patient) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <GitCompare className="mr-2 text-medical-600" size={24} />
            Baseline vs MEDSAFE Comparative Workflow Experiment
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Compare unranked chronological records against MEDSAFE's prioritized safety summary for patient <strong>DEMO-001</strong>.
          </p>
        </div>

        {/* Experiment Timer */}
        <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center space-x-4">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Live Experiment Timer</span>
            <span className="text-2xl font-mono font-bold text-medical-400">{elapsedSeconds.toFixed(1)}s</span>
          </div>

          <div className="flex space-x-2">
            {!timerActive ? (
              <button
                onClick={handleStartTimer}
                className="px-3 py-1.5 bg-medical-600 hover:bg-medical-500 text-white font-bold text-xs rounded-lg flex items-center shadow"
              >
                <Play size={14} className="mr-1" />
                Start Task
              </button>
            ) : (
              <button
                onClick={() => setTimerActive(false)}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg"
              >
                Pause
              </button>
            )}

            <button
              onClick={() => { setTimerActive(false); setElapsedSeconds(0); }}
              className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT: BASELINE WORKFLOW */}
        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                BASELINE WORKFLOW
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">Chronological Raw Medical Record</h3>
            </div>

            <button
              onClick={handleStopBaseline}
              disabled={!timerActive}
              className="px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-900 disabled:opacity-30"
            >
              Found Risk ({baselineRecordFoundTime ? `${baselineRecordFoundTime}s` : 'Click when found'})
            </button>
          </div>

          <p className="text-xs text-slate-500 italic">
            Standard EHR view: Unranked, long longitudinal record without prioritization or automated safety grouping.
          </p>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-2 text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 block font-bold">2026-08-20 • Observation</span>
              <p className="font-semibold text-slate-800">Blood Pressure: 120/80 mmHg, HR: 76 bpm</p>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 block font-bold">2026-07-26 • Allergy Documentation</span>
              <p className="font-semibold text-red-700">Allergen: Penicillin (Reaction: Anaphylaxis & Rash, Severity: SEVERE)</p>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 block font-bold">2026-08-22 • Condition</span>
              <p className="font-semibold text-slate-800">Diagnosis: Bacterial Pneumonia (MODERATE)</p>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 block font-bold">2026-08-20 • Medication Order</span>
              <p className="font-semibold text-slate-800">Paracetamol 1000mg Oral (Status: ACTIVE)</p>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 block font-bold">2026-08-23 • Medication Order</span>
              <p className="font-semibold text-slate-900 bg-amber-100 p-1 rounded">Amoxicillin 500mg Oral (Status: ACTIVE)</p>
            </div>
          </div>
        </div>

        {/* RIGHT: MEDSAFE WORKFLOW */}
        <div className="bg-white rounded-2xl border-2 border-medical-500 shadow-md p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="bg-medical-700 text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                MEDSAFE WORKFLOW
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">Prioritized Safety Decision Support</h3>
            </div>

            <button
              onClick={handleStopPrototype}
              disabled={!timerActive}
              className="px-3 py-1.5 bg-medical-700 text-white text-xs font-bold rounded-lg hover:bg-medical-800 disabled:opacity-30"
            >
              Found Risk ({prototypeFoundTime ? `${prototypeFoundTime}s` : 'Click when found'})
            </button>
          </div>

          <p className="text-xs text-medical-800 font-medium bg-medical-50 p-2 rounded-lg border border-medical-200">
            Instant rule-matched risk summary: Highlights active medications vs documented allergies with confidence & harm context.
          </p>

          <div className="p-4 bg-red-50/70 border border-red-300 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                HIGH PRIORITY
              </span>
              <span className="text-xs font-bold text-medical-800">91% Confidence</span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">
              Amoxicillin ↕ Penicillin Allergy
            </h4>
            <p className="text-xs text-red-900">
              Cross-reactivity match: Patient is prescribed active Amoxicillin (started 2026-08-23) with documented SEVERE Penicillin allergy.
            </p>
          </div>
        </div>
      </div>

      {/* Measured Results Box */}
      {(baselineRecordFoundTime || prototypeFoundTime) && (
        <div className="bg-emerald-950 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-emerald-400">Measured Workflow Performance</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Baseline Time: {baselineRecordFoundTime || '--'}s • MEDSAFE Time: {prototypeFoundTime || '--'}s
            </p>
          </div>

          {baselineRecordFoundTime && prototypeFoundTime && (
            <div className="bg-emerald-600 text-white font-black text-xl px-5 py-2.5 rounded-xl shadow">
              {Math.round(((baselineRecordFoundTime - prototypeFoundTime) / baselineRecordFoundTime) * 100)}% TIME REDUCTION
            </div>
          )}
        </div>
      )}
    </div>
  );
};
