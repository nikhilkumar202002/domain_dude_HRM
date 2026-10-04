import React from 'react';
import { Search, Filter, X, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

export const FilterBar = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Filter records...',
  filters = [],
  activeFilters = {},
  onFilterChange,
  onReset,
  className,
}) => {
  const hasActiveFilters = Object.values(activeFilters).some(
    (val) => val !== '' && val !== 'All' && val !== null
  ) || Boolean(searchQuery);

  return (
    <div className={clsx('flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 bg-white p-4 rounded-xl shadow-soft mb-4', className)}>
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        {/* Search Input */}
        <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery || ''}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Dropdown Filters */}
        {filters.map((filter) => (
          <div key={filter.key} className="flex items-center">
            <select
              value={activeFilters[filter.key] || 'All'}
              onChange={(e) => onFilterChange && onFilterChange(filter.key, e.target.value)}
              className="rounded-lg border border-slate-200 bg-white py-1.5 px-3 text-xs font-medium text-slate-700 hover:border-slate-300 focus:border-indigo-500 focus:outline-none"
            >
              <option value="All">{filter.label}: All</option>
              {filter.options.map((opt) => (
                <option key={opt.value || opt} value={opt.value || opt}>
                  {opt.label || opt}
                </option>
              ))}
            </select>
          </div>
        ))}

        {hasActiveFilters && onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          >
            <RefreshCw className="h-3 w-3" /> Reset
          </button>
        )}
      </div>
    </div>
  );
};
