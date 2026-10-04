import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, Check, X, Save, Search, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';

const ROLES = [
  'Super Admin',
  'Admin',
  'HR Manager',
  'Project Manager',
  'Team Leader',
  'Accounts',
  'Sales',
  'Employee',
];

const MODULES = [
  'Dashboard',
  'Enquiries & Leads',
  'Clients Directory',
  'Commercial Proposals',
  'Projects Delivery',
  'Tasks Management',
  'Work Schedule',
  'Employees Directory',
  'Attendance & Clock-in',
  'Leave Applications',
  'Payroll & Salaries',
  'Invoices & Billing',
  'Payments & Receipts',
  'Expense Claims',
  'Business Reports',
  'System Settings',
];

export const PermissionsSettingsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [matrixState, setMatrixState] = useState(() => {
    const state = {};
    MODULES.forEach((mod) => {
      state[mod] = {};
      ROLES.forEach((role, idx) => {
        if (role === 'Super Admin' || role === 'Admin') {
          state[mod][role] = true;
        } else if (role === 'HR Manager' && (mod.includes('Employees') || mod.includes('Attendance') || mod.includes('Leave') || mod.includes('Payroll') || mod.includes('Reports'))) {
          state[mod][role] = true;
        } else if (role === 'Project Manager' && (mod.includes('Projects') || mod.includes('Tasks') || mod.includes('Schedule') || mod.includes('Clients') || mod.includes('Proposals'))) {
          state[mod][role] = true;
        } else if (role === 'Accounts' && (mod.includes('Invoices') || mod.includes('Payments') || mod.includes('Expense') || mod.includes('Payroll') || mod.includes('Reports'))) {
          state[mod][role] = true;
        } else if (role === 'Sales' && (mod.includes('Enquiries') || mod.includes('Clients') || mod.includes('Proposals'))) {
          state[mod][role] = true;
        } else if (role === 'Team Leader' && (mod.includes('Tasks') || mod.includes('Schedule') || mod.includes('Attendance') || mod.includes('Leave'))) {
          state[mod][role] = true;
        } else if (role === 'Employee' && (mod.includes('Dashboard') || mod.includes('Tasks') || mod.includes('Schedule') || mod.includes('Leave'))) {
          state[mod][role] = true;
        } else {
          state[mod][role] = false;
        }
      });
    });
    return state;
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const toggleCell = (mod, role) => {
    if (role === 'Super Admin') {
      triggerToast('Super Admin access cannot be disabled.');
      return;
    }
    setMatrixState((prev) => ({
      ...prev,
      [mod]: {
        ...prev[mod],
        [role]: !prev[mod][role],
      },
    }));
  };

  const filteredModules = MODULES.filter((mod) =>
    mod.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <PageHeader
        title="Global Permission Matrix"
        subtitle="Cross-functional security overview mapping all 16 modules against company security roles."
        actions={
          <button
            onClick={() => triggerToast('Global permission matrix saved successfully!')}
            className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4" /> Save Matrix Changes
          </button>
        }
      />

      {/* TOAST FEEDBACK */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-3 shadow-xl border border-slate-700 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SUB NAV */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        <NavLink to="/settings" className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50">
          General Settings
        </NavLink>
        <NavLink to="/settings/roles" className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50">
          Roles & Permissions Matrix
        </NavLink>
        <NavLink to="/settings/permissions" className="rounded-lg bg-[#0066FF] px-3.5 py-1.5 text-white shadow-xs">
          Global Permission Matrix
        </NavLink>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search 16 modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>8 Roles Configured</span>
        </div>
      </div>

      {/* MATRIX TABLE */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 font-bold border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="p-4 min-w-[220px]">Module / Subsystem</th>
              {ROLES.map((r) => (
                <th key={r} className="p-4 text-center min-w-[110px]">
                  {r}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredModules.map((mod) => (
              <tr key={mod} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-4 font-bold text-slate-900">{mod}</td>
                {ROLES.map((role) => {
                  const allowed = !!matrixState[mod]?.[role];
                  return (
                    <td key={role} className="p-4 text-center">
                      <label className="inline-flex items-center justify-center cursor-pointer p-1.5 rounded hover:bg-blue-50">
                        <input
                          type="checkbox"
                          checked={allowed}
                          onChange={() => toggleCell(mod, role)}
                          className="h-4 w-4 rounded border-slate-300 text-[#0066FF] focus:ring-[#0066FF] cursor-pointer"
                        />
                      </label>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
