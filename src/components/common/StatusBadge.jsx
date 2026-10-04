import React from 'react';
import clsx from 'clsx';

const statusStyles = {
  // Success / Green
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  won: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  present: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',

  // Warning / Amber
  in_progress: 'bg-amber-50 text-amber-700 border-amber-200/60',
  in_discussion: 'bg-amber-50 text-amber-700 border-amber-200/60',
  sent: 'bg-amber-50 text-amber-700 border-amber-200/60',
  unpaid: 'bg-amber-50 text-amber-700 border-amber-200/60',
  pending: 'bg-amber-50 text-amber-700 border-amber-200/60',
  late: 'bg-amber-50 text-amber-700 border-amber-200/60',
  processing: 'bg-amber-50 text-amber-700 border-amber-200/60',

  // Danger / Red
  urgent: 'bg-rose-50 text-rose-700 border-rose-200/60',
  overdue: 'bg-rose-50 text-rose-700 border-rose-200/60',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200/60',
  lost: 'bg-rose-50 text-rose-700 border-rose-200/60',
  inactive: 'bg-slate-100 text-slate-600 border-slate-200',
  absent: 'bg-rose-50 text-rose-700 border-rose-200/60',

  // Info / Blue / Indigo
  new: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
  qualified: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
  review: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
  proposal_sent: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
  to_do: 'bg-slate-100 text-slate-700 border-slate-200',
  draft: 'bg-slate-100 text-slate-600 border-slate-200',

  // Priority Specific
  high: 'bg-rose-50 text-rose-700 border-rose-200/60',
  medium: 'bg-amber-50 text-amber-700 border-amber-200/60',
  low: 'bg-slate-100 text-slate-600 border-slate-200',
};

export const StatusBadge = ({ status, text, size = 'md', className }) => {
  const normalized = (status || text || '').toString().toLowerCase().replace(/\s+/g, '_');
  const styleClass = statusStyles[normalized] || 'bg-gray-50 text-gray-700 border-gray-200';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-medium',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border tracking-tight transition-colors',
        sizeClasses[size],
        styleClass,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {text || status}
    </span>
  );
};
