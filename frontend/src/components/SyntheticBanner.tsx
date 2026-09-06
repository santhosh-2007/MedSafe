import React from 'react';
import { AlertCircle } from 'lucide-react';

export const SyntheticBanner: React.FC = () => {
  return (
    <div className="bg-amber-500 text-white text-xs px-4 py-2 flex items-center justify-between shadow-inner">
      <div className="flex items-center space-x-2 container mx-auto">
        <AlertCircle size={16} className="flex-shrink-0" />
        <p className="font-medium">
          <strong className="font-bold uppercase tracking-wider">Academic Demonstration Environment:</strong> Uses 100% synthetic patient data. Does NOT perform automatic ordering or replace professional clinician review.
        </p>
      </div>
    </div>
  );
};
