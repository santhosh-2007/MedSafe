import React from 'react';
import { AlertOctagon, AlertTriangle, Info, Eye, CheckCircle2, ShieldAlert } from 'lucide-react';
import { RiskAlert } from '../types';

interface RiskCardProps {
  alert: RiskAlert;
  onViewEvidence: (alert: RiskAlert) => void;
  onReview: (alert: RiskAlert) => void;
}

export const RiskCard: React.FC<RiskCardProps> = ({ alert, onViewEvidence, onReview }) => {
  const isHigh = alert.risk_level === 'HIGH';
  const isModerate = alert.risk_level === 'MODERATE';

  const badgeStyles = isHigh
    ? 'bg-red-100 text-red-800 border-red-300'
    : isModerate
    ? 'bg-orange-100 text-orange-800 border-orange-300'
    : 'bg-amber-100 text-amber-800 border-amber-300';

  const borderLeft = isHigh
    ? 'border-l-4 border-l-red-600'
    : isModerate
    ? 'border-l-4 border-l-orange-500'
    : 'border-l-4 border-l-amber-500';

  const IconComponent = isHigh ? AlertOctagon : isModerate ? AlertTriangle : Info;

  const isReviewed = alert.status !== 'UNREVIEWED';

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-5 ${borderLeft} transition hover:shadow-md relative`}>
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center space-x-1 uppercase ${badgeStyles}`}>
            <IconComponent size={14} className="mr-1" />
            {alert.risk_level} PRIORITY
          </span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide bg-slate-100 px-2 py-0.5 rounded">
            {alert.risk_type}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1 text-slate-600">
            <span className="font-semibold text-medical-700">{alert.confidence}%</span>
            <span className="text-slate-400">Confidence</span>
          </div>

          {isReviewed ? (
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full text-xs font-semibold flex items-center">
              <CheckCircle2 size={12} className="mr-1" />
              Reviewed
            </span>
          ) : (
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">
              Pending Review
            </span>
          )}
        </div>
      </div>

      {/* Main Content / Interaction summary */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
          <span>{alert.medication_a}</span>
          {alert.medication_b && (
            <>
              <span className="text-slate-400 font-normal">↕</span>
              <span>{alert.medication_b}</span>
            </>
          )}
          {alert.related_allergen && (
            <>
              <span className="text-slate-400 font-normal">↕</span>
              <span className="text-red-700">{alert.related_allergen} Allergy</span>
            </>
          )}
          {alert.related_condition && (
            <>
              <span className="text-slate-400 font-normal">↕</span>
              <span className="text-medical-800">{alert.related_condition}</span>
            </>
          )}
        </h3>
      </div>

      {/* Why this alert appeared */}
      <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Why this alert appeared</h4>
        <ul className="space-y-1 text-xs text-slate-700">
          {alert.evidences.slice(0, 3).map((ev, idx) => (
            <li key={idx} className="flex items-start">
              <span className="text-medical-600 mr-2">•</span>
              <span>{ev.evidence_item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Potential Harm Alert */}
      <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-900">
        <div className="flex items-center font-bold text-red-800 mb-1">
          <ShieldAlert size={14} className="mr-1.5 flex-shrink-0" />
          <span>POTENTIAL HARM</span>
        </div>
        <p className="leading-relaxed">{alert.potential_harm}</p>
      </div>

      {/* Disclaimer */}
      <div className="text-[11px] text-slate-500 italic mb-4 border-t border-slate-100 pt-2">
        {alert.safety_disclaimer}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button
          onClick={() => onViewEvidence(alert)}
          className="inline-flex items-center text-xs font-semibold text-medical-700 hover:text-medical-900 bg-medical-50 hover:bg-medical-100 px-3 py-1.5 rounded-lg border border-medical-200 transition"
        >
          <Eye size={14} className="mr-1.5" />
          View Evidence
        </button>

        <button
          onClick={() => onReview(alert)}
          className={`inline-flex items-center text-xs font-semibold px-3.5 py-1.5 rounded-lg transition shadow-sm ${
            isReviewed
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
              : 'bg-medical-700 hover:bg-medical-800 text-white'
          }`}
        >
          <CheckCircle2 size={14} className="mr-1.5" />
          {isReviewed ? 'Update Review' : 'Mark Reviewed'}
        </button>
      </div>
    </div>
  );
};
