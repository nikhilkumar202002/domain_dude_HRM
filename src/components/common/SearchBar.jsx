import React from 'react';
import { Search } from 'lucide-react';
import clsx from 'clsx';

export const SearchBar = ({ value, onChange, placeholder = 'Search...', className, shortcut = true }) => {
  return (
    <div className={clsx('relative flex items-center w-full', className)}>
      <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-8 text-xs text-slate-900 placeholder-slate-400 shadow-none transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      {shortcut && (
        <div className="absolute right-2.5 flex items-center gap-0.5 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 pointer-events-none">
          <span className="text-[9px]">⌘</span>K
        </div>
      )}
    </div>
  );
};
