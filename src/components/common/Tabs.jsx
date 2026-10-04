import React from 'react';
import clsx from 'clsx';

export const Tabs = ({ tabs = [], activeTab, onChange, variant = 'underline', className }) => {
  return (
    <div className={clsx('flex items-center space-x-1 border-b border-slate-200/80', className)}>
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        const Icon = t.icon;

        if (variant === 'pills') {
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={clsx(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              {t.label}
              {t.count !== undefined && (
                <span className={clsx('rounded-full px-1.5 py-0.2 text-[10px]', isActive ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700')}>
                  {t.count}
                </span>
              )}
            </button>
          );
        }

        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={clsx(
              'flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors',
              isActive
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
            )}
          >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            {t.label}
            {t.count !== undefined && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 font-medium">
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
