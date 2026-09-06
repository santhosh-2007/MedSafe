import React, { useEffect, useState } from 'react';
import { Lock, ShieldCheck, Database, AlertTriangle } from 'lucide-react';
import { fetchPrivacyInfo } from '../services/api';

export const PrivacySafetyPage: React.FC = () => {
  const [privacy, setPrivacy] = useState<any>(null);

  useEffect(() => {
    fetchPrivacyInfo().then(setPrivacy).catch(console.error);
  }, []);

  if (!privacy) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3">
        <Lock className="text-medical-600 flex-shrink-0" size={28} />
        <div>
          <h2 className="text-xl font-bold text-slate-900">{privacy.title}</h2>
          <p className="text-xs text-slate-500">{privacy.notice}</p>
        </div>
      </div>

      {/* Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {privacy.principles.map((p: any, idx: number) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-medical-900 flex items-center">
              <ShieldCheck size={18} className="text-medical-600 mr-2" />
              {p.name}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
          </div>
        ))}
      </div>

      {/* Medical Safety Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-xs text-amber-900 space-y-2">
        <h4 className="font-bold text-sm text-amber-950 flex items-center">
          <AlertTriangle size={18} className="mr-2 text-amber-600" />
          Critical Medical Safety Disclaimer & Scope
        </h4>
        <p className="leading-relaxed">{privacy.disclaimer}</p>
        <p className="leading-relaxed">
          MEDSAFE outputs transparent system match confidence, not clinical diagnosis. Clinicians must always verify alerts against source patient charts before making any treatment decisions.
        </p>
      </div>
    </div>
  );
};
