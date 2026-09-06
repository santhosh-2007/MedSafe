import React, { useState, useEffect } from 'react';
import { MessageSquarePlus, Star, CheckCircle, BarChart2 } from 'lucide-react';
import { submitFeedback, fetchFeedbackSummary } from '../services/api';

export const FeedbackPage: React.FC = () => {
  const [usability, setUsability] = useState(5);
  const [evidenceClarity, setEvidenceClarity] = useState(5);
  const [uncertaintyClarity, setUncertaintyClarity] = useState(4);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const [summary, setSummary] = useState<any>(null);

  const loadSummary = async () => {
    try {
      const data = await fetchFeedbackSummary();
      setSummary(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitFeedback(usability, evidenceClarity, uncertaintyClarity, comments);
      setSubmittedSuccess(true);
      setComments('');
      await loadSummary();
    } catch (err) {
      alert('Error submitting feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <MessageSquarePlus className="mr-2 text-medical-600" size={24} />
            User Validation & Stakeholder Feedback
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Academic usability validation evaluating search effort reduction, evidence clarity, and uncertainty warnings.
          </p>
        </div>
      </div>

      {/* Aggregated Feedback Summary KPI */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Evaluators</span>
            <strong className="text-2xl font-black text-slate-900">{summary.total_responses}</strong>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Avg Usability Score</span>
            <strong className="text-2xl font-black text-medical-700">{summary.avg_usability} / 5.0</strong>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Evidence Clarity</span>
            <strong className="text-2xl font-black text-emerald-700">{summary.avg_evidence_clarity} / 5.0</strong>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Uncertainty Clarity</span>
            <strong className="text-2xl font-black text-indigo-700">{summary.avg_uncertainty_clarity} / 5.0</strong>
          </div>
        </div>
      )}

      {/* Feedback Form & Ratings */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-2xl">
        <h3 className="text-base font-bold text-slate-900 mb-4">Submit Evaluation Feedback</h3>

        {submittedSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center">
            <CheckCircle size={16} className="mr-2 flex-shrink-0" />
            Thank you! Your feedback has been recorded in the system database.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              1. Was important information easy to find and summarize? (1-5)
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setUsability(val)}
                  className={`w-10 h-10 rounded-lg font-bold border flex items-center justify-center transition ${
                    usability === val ? 'bg-medical-700 text-white border-medical-800' : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              2. Was the supporting evidence traceable and understandable? (1-5)
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setEvidenceClarity(val)}
                  className={`w-10 h-10 rounded-lg font-bold border flex items-center justify-center transition ${
                    evidenceClarity === val ? 'bg-medical-700 text-white border-medical-800' : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              3. Were system confidence and uncertainty limitations clear? (1-5)
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setUncertaintyClarity(val)}
                  className={`w-10 h-10 rounded-lg font-bold border flex items-center justify-center transition ${
                    uncertaintyClarity === val ? 'bg-medical-700 text-white border-medical-800' : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Free-text Clinical Feedback & Suggestions
            </label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="What features or risk rules should be expanded in future work?"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 bg-medical-700 hover:bg-medical-800 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Evaluator Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};
