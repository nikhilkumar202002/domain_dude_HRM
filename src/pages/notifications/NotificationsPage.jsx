import React, { useState, useMemo } from 'react';
import {
  Bell,
  CheckCircle2,
  Check,
  Clock,
  AlertCircle,
  Building,
  CheckSquare,
  Layers,
  UserCheck,
  Receipt,
  DollarSign,
  ShieldCheck,
  AtSign,
  ExternalLink,
  Filter,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';

export const NotificationsPage = () => {
  const { notifications, setNotifications, markAllNotificationsRead, toggleNotificationRead } = useApp();
  const [activeTab, setActiveTab] = useState('All');

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  // Icon and Style mapping for notification types
  const getNotificationVisuals = (item) => {
    const type = item.notificationType || item.type || '';
    const category = item.category || '';

    if (type === 'New enquiry' || category === 'sales') {
      return {
        icon: Building,
        bg: 'bg-blue-50 text-blue-600 border-blue-200',
        dot: 'bg-[#0066FF]',
        badge: 'Sales',
      };
    }
    if (type === 'Follow-up due') {
      return {
        icon: Clock,
        bg: 'bg-amber-50 text-amber-600 border-amber-200',
        dot: 'bg-amber-500',
        badge: 'Follow-up',
      };
    }
    if (type === 'Task deadline') {
      return {
        icon: CheckSquare,
        bg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
        dot: 'bg-indigo-500',
        badge: 'Tasks',
      };
    }
    if (type === 'Task overdue') {
      return {
        icon: AlertCircle,
        bg: 'bg-rose-50 text-rose-600 border-rose-200',
        dot: 'bg-rose-500',
        badge: 'Task Overdue',
      };
    }
    if (type === 'Project deadline' || category === 'projects') {
      return {
        icon: Layers,
        bg: 'bg-purple-50 text-purple-600 border-purple-200',
        dot: 'bg-purple-500',
        badge: 'Projects',
      };
    }
    if (type === 'Leave request' || category === 'hr') {
      return {
        icon: UserCheck,
        bg: 'bg-teal-50 text-teal-600 border-teal-200',
        dot: 'bg-teal-500',
        badge: 'HR / Leave',
      };
    }
    if (type === 'Invoice overdue') {
      return {
        icon: Receipt,
        bg: 'bg-rose-50 text-rose-600 border-rose-200',
        dot: 'bg-rose-500',
        badge: 'Finance / Invoices',
      };
    }
    if (type === 'Payment received' || category === 'finance') {
      return {
        icon: DollarSign,
        bg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        dot: 'bg-emerald-500',
        badge: 'Finance / Payments',
      };
    }
    if (type === 'Payroll approval') {
      return {
        icon: ShieldCheck,
        bg: 'bg-cyan-50 text-cyan-600 border-cyan-200',
        dot: 'bg-cyan-500',
        badge: 'Payroll',
      };
    }
    if (category === 'mentions' || type === 'Mention') {
      return {
        icon: AtSign,
        bg: 'bg-blue-50 text-blue-600 border-blue-200',
        dot: 'bg-blue-500',
        badge: 'Mentions',
      };
    }

    return {
      icon: Bell,
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      dot: 'bg-slate-400',
      badge: 'System',
    };
  };

  // Tab Filtering
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (activeTab === 'All') return true;
      if (activeTab === 'Unread') return !item.read;
      if (activeTab === 'Mentions') return item.category === 'mentions';
      if (activeTab === 'Tasks') return item.category === 'tasks';
      if (activeTab === 'Projects') return item.category === 'projects';
      if (activeTab === 'Finance') return item.category === 'finance';
      if (activeTab === 'HR') return item.category === 'hr';
      return true;
    });
  }, [notifications, activeTab]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <PageHeader
        title="Notifications"
        subtitle="Stay updated with important business activity."
        actions={
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-[#0066FF]">
                {unreadCount} Unread Notifications
              </span>
            )}
            <button
              onClick={markAllNotificationsRead}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Check className="h-3.5 w-3.5 text-blue-600" /> Mark all as read
            </button>
          </div>
        }
      />

      {/* CATEGORY TABS BAR */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 pb-3">
        {['All', 'Unread', 'Mentions', 'Tasks', 'Projects', 'Finance', 'HR'].map((tab) => {
          const isActive = activeTab === tab;
          let count = 0;
          if (tab === 'All') count = notifications.length;
          else if (tab === 'Unread') count = unreadCount;
          else if (tab === 'Mentions') count = notifications.filter((n) => n.category === 'mentions').length;
          else if (tab === 'Tasks') count = notifications.filter((n) => n.category === 'tasks').length;
          else if (tab === 'Projects') count = notifications.filter((n) => n.category === 'projects').length;
          else if (tab === 'Finance') count = notifications.filter((n) => n.category === 'finance').length;
          else if (tab === 'HR') count = notifications.filter((n) => n.category === 'hr').length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#0066FF] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* NOTIFICATIONS STREAM CONTAINER */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((item) => {
            const visual = getNotificationVisuals(item);
            const IconComponent = visual.icon;

            return (
              <div
                key={item.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between rounded-xl p-4 border transition-all gap-4 ${
                  !item.read
                    ? 'bg-blue-50/40 border-blue-200/90 shadow-2xs'
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                {/* Left: Unread dot + Category Icon + Info */}
                <div className="flex items-start gap-3.5">
                  {/* Unread dot */}
                  <div className="pt-2">
                    <span
                      className={`block h-2.5 w-2.5 rounded-full ${
                        !item.read ? visual.dot : 'bg-transparent'
                      }`}
                    />
                  </div>

                  {/* Icon Badge */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${visual.bg}`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>

                  {/* Notification text details */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {item.title}
                      </h4>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-200">
                        {item.module || visual.badge}
                      </span>
                      {item.notificationType && (
                        <span className="text-[10px] font-medium text-slate-400">
                          • {item.notificationType}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                      {item.message}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-0.5 font-medium">
                      <Clock className="h-3 w-3" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    onClick={() => toggleNotificationRead(item.id)}
                    title={item.read ? 'Mark as unread' : 'Mark as read'}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors shadow-2xs"
                  >
                    {item.read ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5 text-slate-400" />
                        <span className="hidden sm:inline">Unread</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5 text-blue-600" />
                        <span className="hidden sm:inline">Mark Read</span>
                      </>
                    )}
                  </button>

                  {item.link && (
                    <NavLink
                      to={item.link}
                      onClick={() => {
                        if (!item.read) toggleNotificationRead(item.id);
                      }}
                      className="flex items-center gap-1 rounded-lg bg-[#0066FF] px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-2xs"
                    >
                      <span>Open Record</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </NavLink>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Bell className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No notifications found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are no notifications matching the selected tab filter at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
