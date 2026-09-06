import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 animate-pulse">
    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
    <div className="h-6 bg-slate-200 rounded w-2/3"></div>
    <div className="h-16 bg-slate-100 rounded w-full"></div>
    <div className="h-8 bg-slate-200 rounded w-1/4"></div>
  </div>
);

export const TableSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4 animate-pulse">
    <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="h-10 bg-slate-100 rounded w-full flex items-center px-4 space-x-4">
        <div className="h-4 bg-slate-200 rounded w-1/6"></div>
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/6"></div>
      </div>
    ))}
  </div>
);
