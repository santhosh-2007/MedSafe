import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, CheckSquare, Square, ArrowRight } from 'lucide-react';
import { recordConsent } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ConsentPage: React.FC = () => {
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setConsent } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!check1 || !check2) return;

    setLoading(true);
    try {
      await recordConsent(true);
      setConsent(true);
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to record consent.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-200">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Clinical Decision Support Notice</h2>
            <p className="text-xs text-amber-700 font-semibold">
              Academic Research Prototype • Synthetic Data Only
            </p>
          </div>
        </div>

        <div className="prose prose-slate text-xs space-y-3 mb-6 text-slate-700 leading-relaxed">
          <p>
            Welcome to <strong>MEDSAFE</strong>. Before accessing patient decision-support records, you must acknowledge the following safety protocols and research terms:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Synthetic Patient Dataset:</strong> All patient records (P001–P100, DEMO-001–DEMO-008), clinical histories, and laboratory values are 100% algorithmically generated.</li>
            <li><strong>Decision Support Boundary:</strong> MEDSAFE highlights rule-matched interaction risks, evidence recency, and potential harms. It does <em>not</em> execute medication orders or make autonomous medical decisions.</li>
            <li><strong>Audit Governance:</strong> Your session activities (patient views, alert reviews, evidence inspections) are recorded in the system audit log for scientific evaluation.</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-200">
          <label className="flex items-start space-x-3 cursor-pointer p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition">
            <input
              type="checkbox"
              checked={check1}
              onChange={(e) => setCheck1(e.target.checked)}
              className="mt-1 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded"
            />
            <span className="text-xs font-medium text-slate-800">
              I understand this system provides decision support only and does <strong>NOT replace professional clinical judgment</strong>.
            </span>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition">
            <input
              type="checkbox"
              checked={check2}
              onChange={(e) => setCheck2(e.target.checked)}
              className="mt-1 text-medical-600 focus:ring-medical-500 h-4 w-4 rounded"
            />
            <span className="text-xs font-medium text-slate-800">
              I understand system alerts may be <strong>incomplete or incorrect</strong> and must be verified against primary medical source records.
            </span>
          </label>

          <button
            type="submit"
            disabled={!check1 || !check2 || loading}
            className="w-full mt-4 flex items-center justify-center py-3 px-4 bg-medical-700 hover:bg-medical-800 text-white font-bold text-xs rounded-xl shadow-lg transition disabled:opacity-40"
          >
            <span>{loading ? 'Recording Consent...' : 'Accept Notice & Enter Workstation'}</span>
            <ArrowRight size={16} className="ml-2" />
          </button>
        </form>
      </div>
    </div>
  );
};
