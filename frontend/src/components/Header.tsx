import React from 'react';
import { Search, Bell, ShieldAlert, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  title: string;
  onSearchChange?: (val: string) => void;
  searchValue?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, onSearchChange, searchValue = '' }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center space-x-3">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        {onSearchChange !== undefined && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search patient ID (e.g. DEMO-001)..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-slate-100 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-medical-500 w-64"
            />
          </div>
        )}

        {/* Badges */}
        <div className="hidden sm:flex items-center space-x-2">
          <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center space-x-1">
            <ShieldAlert size={12} className="mr-1" />
            SYNTHETIC DATA • DEMO
          </span>
          <span className="bg-medical-100 text-medical-800 border border-medical-300 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center space-x-1 capitalize">
            <UserCheck size={12} className="mr-1" />
            {user?.role || 'Clinician'}
          </span>
        </div>
      </div>
    </header>
  );
};
