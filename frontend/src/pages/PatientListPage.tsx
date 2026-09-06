import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Users, ChevronRight } from 'lucide-react';
import { fetchPatients } from '../services/api';
import { PatientSummary } from '../types';
import { TableSkeleton } from '../components/SkeletonLoaders';

export const PatientListPage: React.FC = () => {
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedWard, setSelectedWard] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPatients();
        setPatients(data);
        setFilteredPatients(data);
      } catch (err) {
        console.error('Failed fetching patients', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    let result = patients;
    if (search.trim()) {
      result = result.filter(p => p.patient_id.toLowerCase().includes(search.toLowerCase()));
    }
    if (selectedWard !== 'ALL') {
      result = result.filter(p => p.ward === selectedWard);
    }
    if (selectedRisk !== 'ALL') {
      result = result.filter(p => p.highest_risk_level === selectedRisk);
    }
    setFilteredPatients(result);
  }, [search, selectedWard, selectedRisk, patients]);

  const wards = Array.from(new Set(patients.map(p => p.ward)));

  if (loading) return <TableSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <Users className="mr-2 text-medical-600" size={24} />
            Patient Census & Decision Support List
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Displaying {filteredPatients.length} of {patients.length} synthetic patient profiles.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search patient ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-medical-500 w-44"
            />
          </div>

          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 font-medium"
          >
            <option value="ALL">All Wards</option>
            {wards.map(w => <option key={w} value={w}>{w}</option>)}
          </select>

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 font-medium"
          >
            <option value="ALL">All Priority Levels</option>
            <option value="HIGH">HIGH Priority</option>
            <option value="MODERATE">MODERATE Priority</option>
            <option value="REVIEW">REVIEW Priority</option>
            <option value="SAFE">SAFE / No Priority</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Patient ID</th>
                <th className="py-3.5 px-4">Demographics</th>
                <th className="py-3.5 px-4">Ward Location</th>
                <th className="py-3.5 px-4">Active Meds</th>
                <th className="py-3.5 px-4">Allergies</th>
                <th className="py-3.5 px-4">Comorbidities</th>
                <th className="py-3.5 px-4">Highest Risk</th>
                <th className="py-3.5 px-4 text-center">Alert Count</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map((p) => (
                <tr key={p.patient_id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{p.patient_id}</td>
                  <td className="py-3.5 px-4 text-slate-600">{p.age}y / {p.sex}</td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">{p.ward}</td>
                  <td className="py-3.5 px-4">{p.active_medication_count} active</td>
                  <td className="py-3.5 px-4">{p.allergy_count} documented</td>
                  <td className="py-3.5 px-4">{p.condition_count} recorded</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase border ${
                      p.highest_risk_level === 'HIGH' ? 'bg-red-100 text-red-800 border-red-300' :
                      p.highest_risk_level === 'MODERATE' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                      p.highest_risk_level === 'REVIEW' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                      'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}>
                      {p.highest_risk_level}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold">{p.risk_alert_count}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => navigate(`/patients/${p.patient_id}`)}
                      className="px-3 py-1.5 bg-medical-700 hover:bg-medical-800 text-white rounded-lg font-bold text-xs shadow-sm transition inline-flex items-center"
                    >
                      <span>Review Profile</span>
                      <ChevronRight size={14} className="ml-1" />
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
