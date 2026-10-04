import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, Check, X, Save } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';

export const PermissionsSettingsPage = () => {
  const modules = ['Sales Enquiries', 'Clients Directory', 'Proposals', 'Project Delivery', 'Task Boards', 'Employees & HR', 'Payroll & Invoices', 'Settings & System'];
  const roles = ['Super Admin', 'Project Manager', 'Senior Developer', 'HR Specialist', 'Accountant'];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Granular Permission Matrix"
        subtitle="Matrix mapping operational domain actions to assigned organizational roles."
        actions={
          <button
            onClick={() => alert('Permissions saved successfully!')}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Save className="h-3.5 w-3.5" /> Save Matrix Changes
          </button>
        }
      />

      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        <NavLink to="/settings" className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50">General</NavLink>
        <NavLink to="/settings/roles" className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50">Roles & RBAC</NavLink>
        <NavLink to="/settings/permissions" className="rounded-lg bg-indigo-600 px-3 py-1.5 text-white">Permission Matrix</NavLink>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-card overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 font-semibold border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="p-4">Module / Domain</th>
              {roles.map((r) => (
                <th key={r} className="p-4 text-center">{r}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {modules.map((mod, i) => (
              <tr key={mod} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-semibold text-slate-900">{mod}</td>
                {roles.map((r, j) => {
                  const allowed = j === 0 || (j === 1 && i <= 4) || (j === 3 && mod.includes('HR')) || (j === 4 && mod.includes('Payroll'));
                  return (
                    <td key={r} className="p-4 text-center">
                      <input
                        type="checkbox"
                        defaultChecked={allowed}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
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
