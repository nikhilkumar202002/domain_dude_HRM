import React from 'react';
import { NavLink } from 'react-router-dom';
import { Plus, ShieldCheck, Users, Edit3 } from 'lucide-react';
import { mockRolesList } from '../../data/mockData';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';

export const RolesSettingsPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Access Control (RBAC)"
        subtitle="Define security roles, system permissions, and user group scope."
        actions={
          <button
            onClick={() => alert('New Role Modal')}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-3.5 w-3.5" /> Create Custom Role
          </button>
        }
      />

      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        <NavLink to="/settings" className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50">General</NavLink>
        <NavLink to="/settings/roles" className="rounded-lg bg-indigo-600 px-3 py-1.5 text-white">Roles & RBAC</NavLink>
        <NavLink to="/settings/permissions" className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50">Permission Matrix</NavLink>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockRolesList.map((role) => (
          <div key={role.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-slate-900">{role.name}</h4>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                {role.usersCount} Members
              </span>
            </div>

            <p className="text-xs text-slate-500 line-clamp-2">{role.description}</p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-indigo-600 font-semibold">{role.permissions.length} Enabled Privileges</span>
              <button
                onClick={() => alert(`Edit role ${role.name}`)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
