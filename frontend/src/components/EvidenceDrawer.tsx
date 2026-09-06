import React from 'react';
import { X, ShieldAlert, FileText, Calendar, Database, CheckCircle, AlertTriangle } from 'lucide-react';
import { RiskAlert } from '../types';

interface EvidenceDrawerProps {
  alert: RiskAlert | null;
  onClose: () => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ alert, onClose }) => {
  if (!alert) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-slide-in">
        {/* Drawer Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="text-medical-400" size={20} />
            <h2 className="text-lg font-bold">Evidence & Audit Traceability</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Summary Banner */}
          <div className="bg-medical-50 border border-medical-200 rounded-xl p-4">
            <span className="text-xs font-bold text-medical-800 uppercase tracking-wider block mb-1">
              Risk Alert Identifier: {alert.risk_id}
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {alert.risk_type}: {alert.medication_a}
              {alert.medication_b && ` ↕ ${alert.medication_b}`}
              {alert.related_allergen && ` ↕ ${alert.related_allergen} Allergy`}
              {alert.related_condition && ` ↕ ${alert.related_condition}`}
            </h3>
            <div className="mt-3 flex items-center space-x-4 text-xs">
              <span className="bg-medical-200 text-medical-900 px-2.5 py-0.5 rounded font-bold">
                Score: {alert.score}/100
              </span>
              <span className="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded font-bold">
                Confidence: {alert.confidence}%
              </span>
              <span className="text-slate-600 font-medium">Patient: {alert.patient_id}</span>
            </div>
          </div>

          {/* Traceable Evidence Items */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
              <FileText size={16} className="text-medical-600 mr-2" />
              Traceable Record Evidence
            </h4>
            <div className="space-y-3">
              {alert.evidences.map((ev) => (
                <div key={ev.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs flex items-start space-x-3">
                  <div className="mt-0.5 text-medical-600">
                    <CheckCircle size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider bg-slate-200 px-1.5 py-0.5 rounded">
                        {ev.evidence_type}
                      </span>
                      {ev.record_date && (
                        <span className="text-slate-500 text-[11px] flex items-center">
                          <Calendar size={12} className="mr-1" />
                          {ev.record_date}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-800 font-medium leading-normal">{ev.evidence_item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Uncertainty & Limitations */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900">
            <h4 className="font-bold text-amber-800 mb-1 flex items-center">
              <AlertTriangle size={14} className="mr-1.5" />
              System Uncertainty & Limitations
            </h4>
            <p className="leading-relaxed">{alert.uncertainty}</p>
          </div>

          {/* Potential Harm Warning */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-900">
            <h4 className="font-bold text-red-800 mb-1 flex items-center">
              <ShieldAlert size={14} className="mr-1.5" />
              Potential Harm from Incorrect Interpretation
            </h4>
            <p className="leading-relaxed">{alert.potential_harm}</p>
          </div>

          {/* Clinical Safety Disclaimer */}
          <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-slate-600 text-xs italic">
            <strong className="not-italic font-bold text-slate-800">Mandatory Safety Disclaimer:</strong> {alert.safety_disclaimer}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium text-xs transition"
          >
            Close Evidence Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
