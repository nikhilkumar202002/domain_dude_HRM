import React from 'react';
import { Bell, CheckCircle2, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';

export const NotificationsPage = () => {
  const { notifications, markAllNotificationsRead } = useApp();

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Notifications & Audit Feed"
        subtitle="Chronological stream of system alerts, lead status changes, billing updates, and leave approvals."
        actions={
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Check className="h-3.5 w-3.5 text-indigo-600" /> Mark All as Read
          </button>
        }
      />

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-start justify-between rounded-xl p-4 border transition-all ${
              !n.read ? 'bg-indigo-50/40 border-indigo-200/80 shadow-soft' : 'border-slate-100 bg-white'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 mt-0.5">
                <Bell className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  <StatusBadge status={n.type} size="sm" />
                </div>
                <p className="mt-1 text-xs text-slate-600">{n.message}</p>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-medium shrink-0">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
