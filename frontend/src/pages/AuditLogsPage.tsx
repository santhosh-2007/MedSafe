import React, { useEffect, useState } from 'react';
import { ShieldCheck, Search, Calendar, User, FileText } from 'lucide-react';
import { fetchAuditLogs } from '../services/api';
import { AuditLog } from '../types';
import { TableSkeleton } from '../components/SkeletonLoaders';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAuditLogs();
        setLogs(data);
      } catch (err) {
        console.error('Failed fetching audit logs', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredLogs = logs.filter(l => 
    l.username.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    (l.patient_id && l.patient_id.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <TableSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <ShieldCheck className="mr-2 text-medical-600" size={24} />
            Governance & Audit Trail Log
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tamper-evident record of all user login, consent, patient views, risk views, alert reviews, and feedback.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-medical-500 w-64"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 uppercase text-[10px] font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{log.username}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] uppercase font-sans font-bold">
                      {log.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                      log.action.includes('LOGIN') ? 'bg-blue-100 text-blue-800' :
                      log.action.includes('CONSENT') ? 'bg-indigo-100 text-indigo-800' :
                      log.action.includes('REVIEW') ? 'bg-emerald-100 text-emerald-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-medical-800">{log.patient_id || '—'}</td>
                  <td className="py-3 px-4 font-sans text-slate-600 max-w-md truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
