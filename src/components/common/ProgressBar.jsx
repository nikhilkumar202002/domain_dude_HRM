import React from 'react';
import clsx from 'clsx';

export const ProgressBar = ({ progress = 0, size = 'md', color = 'indigo', showLabel = true, className }) => {
  const percentage = Math.min(100, Math.max(0, progress));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const colors = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
  };

  return (
    <div className={clsx('w-full', className)}>
      {showLabel && (
        <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-slate-600">
          <span>Progress</span>
          <span className="font-semibold text-slate-900">{percentage}%</span>
        </div>
      )}
      <div className={clsx('w-full overflow-hidden rounded-full bg-slate-100', heights[size])}>
        <div
          className={clsx('h-full transition-all duration-300 rounded-full', colors[color] || colors.indigo)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
