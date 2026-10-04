import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

export const DatePicker = ({ value, onChange, label }) => {
  return (
    <div className="flex flex-col">
      {label && <label className="mb-1 text-xs font-medium text-slate-700">{label}</label>}
      <div className="relative flex items-center">
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
        />
        <CalendarIcon className="absolute right-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
};
