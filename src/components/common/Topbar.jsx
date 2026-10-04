import React, { useState } from 'react';
import { Menu, Search, Plus, Bell, HelpCircle, User, Settings, LogOut, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from './Breadcrumbs';
import { Avatar } from './Avatar';
import { Dropdown } from './Dropdown';
import { NavLink } from 'react-router-dom';

export const Topbar = () => {
  const {
    toggleMobileSidebar,
    setIsGlobalSearchOpen,
    openQuickCreate,
    currentUser,
    notifications,
    markAllNotificationsRead,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-6">
      {/* Left: Sidebar Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileSidebar}
          className="flex md:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:block">
          <Breadcrumbs />
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={() => setIsGlobalSearchOpen(true)}
          className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-100/80 hover:border-slate-300 transition-all"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span>Search enquiries, projects, invoices...</span>
          </div>
          <div className="flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
            <span>⌘K</span>
          </div>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        {/* Quick Create Button */}
        <button
          onClick={() => openQuickCreate('enquiry')}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Quick Create</span>
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Popover */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-popover z-40 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllNotificationsRead}
                  className="text-[11px] font-medium text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Check className="h-3 w-3" /> Mark all read
                </button>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-lg text-xs transition-colors ${
                      !n.read ? 'bg-indigo-50/40 border border-indigo-100' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-900 mb-0.5">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600">{n.message}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-2 mt-3 text-center">
                <NavLink
                  to="/notifications"
                  onClick={() => setIsNotifOpen(false)}
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  View all notifications →
                </NavLink>
              </div>
            </div>
          )}
        </div>

        {/* Help Icon */}
        <NavLink
          to="/settings"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors hidden sm:flex"
        >
          <HelpCircle className="h-4.5 w-4.5" />
        </NavLink>

        {/* User Profile Dropdown */}
        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-100 transition-colors">
              <Avatar name={currentUser.name} src={currentUser.avatar} size="sm" />
            </button>
          }
          items={[
            { label: 'View Profile', icon: User, onClick: () => alert('Opening user profile...') },
            { label: 'Account Settings', icon: Settings, onClick: () => alert('Navigating to settings...') },
            { label: 'Sign Out', icon: LogOut, danger: true, onClick: () => alert('User logged out demo.') },
          ]}
        />
      </div>
    </header>
  );
};
