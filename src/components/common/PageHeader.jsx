import React from 'react';
import { Breadcrumbs } from './Breadcrumbs';

export const PageHeader = ({ title, subtitle, actions, showBreadcrumbs = true }) => {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/60 pb-5">
      <div>
        {showBreadcrumbs && (
          <div className="mb-1.5">
            <Breadcrumbs />
          </div>
        )}
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 text-xs text-slate-500 max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
};
