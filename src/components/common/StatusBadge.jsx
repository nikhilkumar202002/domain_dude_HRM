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

  // Info / Brand Blue
  new: 'bg-blue-50 text-[#0066FF] border-blue-200/60',
  qualified: 'bg-blue-50 text-[#0066FF] border-blue-200/60',
  review: 'bg-blue-50 text-[#0066FF] border-blue-200/60',
  proposal_sent: 'bg-blue-50 text-[#0066FF] border-blue-200/60',
  to_do: 'bg-slate-100 text-slate-700 border-slate-200',
  draft: 'bg-slate-100 text-slate-600 border-slate-200',

  // Priority Specific
  high: 'bg-rose-50 text-rose-700 border-rose-200/60',
  medium: 'bg-amber-50 text-amber-700 border-amber-200/60',
  low: 'bg-slate-100 text-slate-600 border-slate-200',
};

export const StatusBadge = ({ status, text, size = 'md', className }) => {
  const normalized = (status || text || '').toString().toLowerCase().replace(/\s+/g, '_');
  const styleClass = statusStyles[normalized] || 'bg-slate-50 text-slate-700 border-slate-200';

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px] font-semibold leading-none gap-1',
    sm: 'px-2 py-0.5 text-[11px] font-medium leading-none gap-1',
    md: 'px-2.5 py-0.5 text-xs font-medium leading-tight gap-1.5',
    lg: 'px-3 py-1 text-xs font-semibold leading-normal gap-1.5',
  };

  const selectedSizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border tracking-tight transition-colors whitespace-nowrap shrink-0',
        selectedSizeClass,
        styleClass,
        className
      )}
    >
      <span className={clsx('rounded-full bg-current opacity-80 shrink-0', size === 'xs' ? 'h-1 w-1' : 'h-1.5 w-1.5')} />
      {text || status}
    </span>
  );
};
