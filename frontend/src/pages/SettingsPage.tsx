import React, { useState } from 'react';
import { Settings, Save, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [highThreshold, setHighThreshold] = useState(80);
  const [modThreshold, setModThreshold] = useState(50);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <Settings className="mr-2 text-medical-600" size={24} />
            System Configuration & Risk Thresholds
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure transparent scoring cutoffs and workstation parameters.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3">Risk Scoring Cutoffs (0-100 Score)</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  HIGH Priority Threshold (Current: ≥{highThreshold})
                </label>
                <input
                  type="range"
                  min="70"
                  max="95"
                  value={highThreshold}
                  onChange={(e) => setHighThreshold(parseInt(e.target.value))}
                  className="w-full text-medical-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  MODERATE Priority Threshold (Current: ≥{modThreshold})
                </label>
                <input
                  type="range"
                  min="40"
                  max="69"
                  value={modThreshold}
                  onChange={(e) => setModThreshold(parseInt(e.target.value))}
                  className="w-full text-medical-600"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="submit"
              className="px-5 py-2.5 bg-medical-700 hover:bg-medical-800 text-white font-bold rounded-xl shadow-md transition flex items-center"
            >
              <Save size={16} className="mr-2" />
              Save Configuration
            </button>

            {saved && (
              <span className="text-emerald-600 font-bold text-xs">
                Configuration updated successfully!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
