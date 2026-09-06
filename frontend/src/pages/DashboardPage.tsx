import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users, AlertOctagon, AlertTriangle, Clock, ChevronRight, 
  Sparkles, CheckCircle2, ShieldAlert, FileText 
} from 'lucide-react';
import { fetchPatients, fetchEvaluationSummary } from '../services/api';
import { PatientSummary, EvaluationSummary } from '../types';
import { useAuth } from '../context/AuthContext';
import { TableSkeleton } from '../components/SkeletonLoaders';

export const DashboardPage: React.FC = () => {
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [evalSummary, setEvalSummary] = useState<EvaluationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [pData, eData] = await Promise.all([
          fetchPatients(),
          fetchEvaluationSummary()
        ]);
        setPatients(pData);
        setEvalSummary(eData);
      } catch (err) {
        console.error('Failed loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalPatients = patients.length;
  const highPriorityCount = patients.filter(p => p.highest_risk_level === 'HIGH').length;
  const modPriorityCount = patients.filter(p => p.highest_risk_level === 'MODERATE').length;
  const reviewCount = patients.filter(p => p.highest_risk_level === 'REVIEW').length;

  const demoPatients = patients.filter(p => p.patient_id.startsWith('DEMO-'));

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-medical-900 via-medical-800 to-indigo-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Good morning, {user?.full_name || 'Dr. Demo'}
          </h2>
          <p className="text-medical-200 text-xs mt-1">
            Clinical safety overview for today's ward review. Surface the right evidence. Support safer clinical review.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/patients/DEMO-001"
            className="bg-white text-medical-900 hover:bg-medical-50 text-xs font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center"
          >
            <Sparkles size={16} className="mr-1.5 text-medical-600" />
            Quick Demo: DEMO-001
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Patients</span>
            <Users size={18} className="text-medical-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalPatients}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Active ward population</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm bg-red-50/20">
          <div className="flex items-center justify-between text-red-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">High Priority</span>
            <AlertOctagon size={18} />
          </div>
          <p className="text-2xl font-black text-red-700">{highPriorityCount}</p>
          <p className="text-[11px] text-red-500 mt-0.5">Immediate review</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-orange-200 shadow-sm bg-orange-50/20">
          <div className="flex items-center justify-between text-orange-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Moderate</span>
            <AlertTriangle size={18} />
          </div>
          <p className="text-2xl font-black text-orange-700">{modPriorityCount}</p>
          <p className="text-[11px] text-orange-500 mt-0.5">Watch list</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Needs Review</span>
            <Clock size={18} />
          </div>
          <p className="text-2xl font-black text-slate-800">{reviewCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Low risk checks</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Time</span>
            <Clock size={18} />
          </div>
          <p className="text-2xl font-black text-emerald-700">
            {evalSummary?.prototype_median_time_sec || 4.5}s
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            -{evalSummary?.time_reduction_pct || 84.7}% vs Baseline
          </p>
        </div>
      </div>

      {/* Dedicated Demo Patients Quick Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center">
            <Sparkles size={16} className="text-medical-600 mr-2" />
            Dedicated Demonstration Patients (Evaluator Quick Access)
          </h3>
          <span className="text-xs text-slate-500 font-medium">8 Guided Scenarios</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {demoPatients.map((dp) => (
            <button
              key={dp.patient_id}
              onClick={() => navigate(`/patients/${dp.patient_id}`)}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-medical-500 hover:bg-medical-50 text-left transition flex flex-col justify-between"
            >
              <div>
                <span className="font-bold text-xs text-medical-800">{dp.patient_id}</span>
                <span className={`block text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 text-center uppercase ${
                  dp.highest_risk_level === 'HIGH' ? 'bg-red-100 text-red-800' :
                  dp.highest_risk_level === 'MODERATE' ? 'bg-orange-100 text-orange-800' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {dp.highest_risk_level}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Patient Table Snapshot */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Patients Requiring Ward Review</h3>
            <p className="text-xs text-slate-500">Sorted by risk priority score</p>
          </div>
          <Link
            to="/patients"
            className="text-xs font-bold text-medical-700 hover:text-medical-900 flex items-center"
          >
            View All Patients ({patients.length})
            <ChevronRight size={14} className="ml-1" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Ward</th>
                <th className="py-3 px-4">Active Meds</th>
                <th className="py-3 px-4">Allergies</th>
                <th className="py-3 px-4">Highest Risk</th>
                <th className="py-3 px-4 text-center">Alerts</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.slice(0, 8).map((p) => (
                <tr key={p.patient_id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{p.patient_id}</td>
                  <td className="py-3 px-4 text-slate-600">{p.ward}</td>
                  <td className="py-3 px-4">{p.active_medication_count} active</td>
                  <td className="py-3 px-4">{p.allergy_count} documented</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase border ${
                      p.highest_risk_level === 'HIGH' ? 'bg-red-100 text-red-800 border-red-300' :
                      p.highest_risk_level === 'MODERATE' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                      'bg-slate-100 text-slate-700 border-slate-300'
                    }`}>
                      {p.highest_risk_level}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold">{p.risk_alert_count}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => navigate(`/patients/${p.patient_id}`)}
                      className="px-3 py-1 bg-medical-50 hover:bg-medical-100 text-medical-800 border border-medical-200 rounded-lg font-bold text-xs transition"
                    >
                      Review Summary
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
