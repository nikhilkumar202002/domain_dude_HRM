import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import clsx from 'clsx';

export const StatCard = ({
  title,
  value,
  trend,
  trendLabel = 'vs last month',
  icon: Icon,
  format = 'number',
  badgeText,
  onClick,
  className
}) => {
  const isPositive = trend > 0;
  const isNegative = trend < 0;

  const formattedValue = () => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
    }
    if (format === 'percent') {
      return `${value}%`;
    }
    return value;
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'group relative rounded-xl border border-slate-200/80 bg-white p-5 transition-all duration-200 hover:border-slate-300 hover:shadow-soft',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
            <Icon className="h-4.5 w-4.5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-2xl font-bold tracking-tight text-slate-900">{formattedValue()}</div>
        {badgeText && (
          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
            {badgeText}
          </span>
        )}
      </div>

      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span
            className={clsx(
              'inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded',
              isPositive && 'bg-emerald-50 text-emerald-700',
              isNegative && 'bg-rose-50 text-rose-700',
              !isPositive && !isNegative && 'bg-slate-100 text-slate-600'
            )}
          >
            {isPositive && <ArrowUpRight className="h-3.5 w-3.5" />}
            {isNegative && <ArrowDownRight className="h-3.5 w-3.5" />}
            {!isPositive && !isNegative && <Minus className="h-3.5 w-3.5" />}
            {Math.abs(trend)}%
          </span>
          <span className="text-slate-500">{trendLabel}</span>
        </div>
      )}
    </div>
  );
};
