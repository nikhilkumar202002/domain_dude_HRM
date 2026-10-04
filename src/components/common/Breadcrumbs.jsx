import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeLabels = {
  dashboard: 'Dashboard',
  enquiries: 'Enquiries',
  clients: 'Clients',
  proposals: 'Proposals',
  projects: 'Projects',
  tasks: 'Tasks',
  schedule: 'Work Schedule',
  employees: 'Employees',
  attendance: 'Attendance',
  leave: 'Leave Requests',
  payroll: 'Payroll',
  invoices: 'Invoices',
  payments: 'Payments',
  expenses: 'Expenses',
  reports: 'Reports & Insights',
  notifications: 'Notifications',
  settings: 'Settings',
  roles: 'Roles & RBAC',
  permissions: 'Permissions',
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) {
    return (
      <div className="flex items-center text-xs text-slate-500 font-medium">
        <Home className="h-3.5 w-3.5 mr-1" />
        <span>Dashboard</span>
      </div>
    );
  }

  return (
    <nav className="flex items-center text-xs text-slate-500 font-medium space-x-1">
      <Link to="/dashboard" className="hover:text-slate-900 transition-colors flex items-center">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const label = routeLabels[name.toLowerCase()] || name;

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
            {isLast ? (
              <span className="text-slate-900 font-semibold truncate max-w-[150px] sm:max-w-xs">{label}</span>
            ) : (
              <Link to={routeTo} className="hover:text-slate-900 transition-colors capitalize">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
