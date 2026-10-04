import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Building2, ShieldCheck, Lock, Globe, Save } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Tabs } from '../../components/common/Tabs';

export const SettingsPage = () => {
  const [formData, setFormData] = useState({
    companyName: 'Domain Dude Software & Digital Agency',
    taxId: 'US-889123049',
    currency: 'USD ($)',
    timezone: 'America/New_York (EST)',
    emailNotifications: true,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="System & Company Settings"
        subtitle="Configure organization metadata, security rules, global preferences, and access controls."
      />

      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        <NavLink to="/settings" className="rounded-lg bg-indigo-600 px-3 py-1.5 text-white">General</NavLink>
        <NavLink to="/settings/roles" className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50">Roles & RBAC</NavLink>
        <NavLink to="/settings/permissions" className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50">Permission Matrix</NavLink>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card space-y-6 max-w-3xl">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Organization Info</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-slate-700">Company Legal Name</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">Tax Registration / EIN</label>
            <input
              type="text"
              value={formData.taxId}
              onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">Base Operating Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
            >
              <option value="USD ($)">USD ($)</option>
              <option value="EUR (€)">EUR (€)</option>
              <option value="GBP (£)">GBP (£)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700">Timezone</label>
            <select
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none"
            >
              <option value="America/New_York (EST)">America/New_York (EST)</option>
              <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
              <option value="Europe/London (GMT)">Europe/London (GMT)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => alert('Settings saved successfully!')}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Save className="h-4 w-4" /> Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
