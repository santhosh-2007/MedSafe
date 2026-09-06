import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, HelpCircle, XCircle } from 'lucide-react';
import { RiskAlert } from '../types';

interface ReviewModalProps {
  alert: RiskAlert | null;
  onClose: () => void;
  onSubmitReview: (riskId: string, status: string, comment: string) => Promise<void>;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ alert, onClose, onSubmitReview }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('REVIEWED_NO_ACTION');
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!alert) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmitReview(alert.risk_id, selectedStatus, comment);
      onClose();
    } catch (err) {
      console.error('Error submitting review', err);
    } finally {
      setSubmitting(false);
    }
  };

  const options = [
    {
      value: 'REVIEWED_NO_ACTION',
      label: 'Reviewed — No Further Action Required',
      description: 'Clinician evaluated risk alert and confirmed patient status is stable without treatment changes.',
      icon: CheckCircle,
      color: 'text-emerald-600'
    },
    {
      value: 'REVIEWED_FOLLOW_UP',
      label: 'Reviewed — Requires Clinical Follow-Up',
      description: 'Alert flagged for pharmacy consultation, dose adjustment, or ward round review.',
      icon: AlertCircle,
      color: 'text-amber-600'
    },
    {
      value: 'FALSE_POSITIVE',
      label: 'False Positive / Rule Irrelevant',
      description: 'Configured synthetic rule matched but is clinically irrelevant for this patient context.',
      icon: XCircle,
      color: 'text-red-600'
    },
    {
      value: 'UNABLE_TO_DETERMINE',
      label: 'Unable to Determine / Insufficient Data',
      description: 'Additional laboratory results or source medical record documentation required.',
      icon: HelpCircle,
      color: 'text-slate-600'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-scale-up">
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">Clinician Review Workflow</h3>
            <p className="text-xs text-slate-400">Risk ID: {alert.risk_id} • Patient {alert.patient_id}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
            <p className="font-bold text-slate-900">{alert.risk_type}</p>
            <p className="text-slate-600 mt-0.5">{alert.medication_a} {alert.medication_b ? `↕ ${alert.medication_b}` : ''}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Review Outcome
            </label>
            <div className="space-y-2">
              {options.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = selectedStatus === opt.value;
                return (
                  <label
                    key={opt.value}
                    className={`flex items-start p-3 rounded-xl border cursor-pointer transition ${
                      isSelected
                        ? 'border-medical-600 bg-medical-50/50 ring-2 ring-medical-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="review_status"
                      value={opt.value}
                      checked={isSelected}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="mt-1 text-medical-600 focus:ring-medical-500"
                    />
                    <div className="ml-3">
                      <div className="flex items-center text-xs font-bold text-slate-900">
                        <IconComponent size={14} className={`mr-1.5 ${opt.color}`} />
                        <span>{opt.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{opt.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Clinical Rationale / Notes (Recorded in Audit Log)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add optional notes for ward rounds or pharmacy record..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-medical-500"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-bold text-white bg-medical-700 hover:bg-medical-800 rounded-lg transition shadow-md disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Confirm Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
