import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  FileText,
  FolderKanban,
  CheckSquare,
  Calendar,
  UserCheck,
  Clock,
  CalendarOff,
  DollarSign,
  Receipt,
  CreditCard,
  PieChart,
  BarChart2,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Avatar } from './Avatar';
import { Tooltip } from './Tooltip';
import clsx from 'clsx';

export const Sidebar = () => {
  const { isSidebarCollapsed, toggleSidebar, isMobileSidebarOpen, setIsMobileSidebarOpen, currentUser, notifications } = useApp();
  const location = useLocation();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const sections = [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'SALES',
      items: [
        { label: 'Enquiries', path: '/enquiries', icon: MessageSquare },
        { label: 'Clients', path: '/clients', icon: Users },
        { label: 'Proposals', path: '/proposals', icon: FileText },
      ],
    },
    {
      title: 'PROJECTS',
      items: [
        { label: 'Projects', path: '/projects', icon: FolderKanban },
        { label: 'Tasks', path: '/tasks', icon: CheckSquare },
        { label: 'Work Schedule', path: '/schedule', icon: Calendar },
      ],
    },
    {
      title: 'PEOPLE',
      items: [
        { label: 'Employees', path: '/employees', icon: UserCheck },
        { label: 'Attendance', path: '/attendance', icon: Clock },
        { label: 'Leave', path: '/leave', icon: CalendarOff },
        { label: 'Payroll', path: '/payroll', icon: DollarSign },
      ],
    },
    {
      title: 'FINANCE',
      items: [
        { label: 'Invoices', path: '/invoices', icon: Receipt },
        { label: 'Payments', path: '/payments', icon: CreditCard },
        { label: 'Expenses', path: '/expenses', icon: PieChart },
      ],
    },
    {
      title: 'INSIGHTS',
      items: [
        { label: 'Reports', path: '/reports', icon: BarChart2 },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
        { label: 'Settings', path: '/settings', icon: Settings },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white text-slate-700 select-none">
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200/80 px-4">
        <NavLink to="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          {isSidebarCollapsed ? (
            <div className="h-8 w-8 overflow-hidden shrink-0">
              <img src="/Domine-Dude_black.png" alt="Domain Dude Logo" className="h-8 max-w-none object-left object-contain" />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <img src="/Domine-Dude_black.png" alt="Domain Dude" className="h-8 w-auto object-contain" />
              <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[9px] font-bold text-[#0066FF] border border-sky-200/60 uppercase tracking-wider">
                OS
              </span>
            </div>
          )}
        </NavLink>
        <button
          onClick={toggleSidebar}
          className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 no-scrollbar">
        {sections.map((section, idx) => (
          <div key={idx}>
            {!isSidebarCollapsed && (
              <div className="mb-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {section.title}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

                const linkElement = (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={clsx(
                      'group flex items-center rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-150',
                      isActive
                        ? 'bg-blue-50/80 text-[#0066FF] font-bold border-l-2 border-[#0066FF]'
                        : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                    )}
                  >
                    <Icon className={clsx('h-4 w-4 shrink-0 transition-colors', isActive ? 'text-[#0066FF]' : 'text-slate-400 group-hover:text-slate-600')} />
                    {!isSidebarCollapsed && <span className="ml-3 truncate">{item.label}</span>}
                    {!isSidebarCollapsed && item.badge > 0 && (
                      <span className="ml-auto rounded-full bg-[#0066FF] px-2 py-0.5 text-[10px] font-semibold text-white">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );

                return isSidebarCollapsed ? (
                  <Tooltip key={item.path} content={item.label} position="right">
                    {linkElement}
                  </Tooltip>
                ) : (
                  linkElement
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer User Info */}
      <div className="border-t border-slate-200/80 p-3 bg-slate-50/50">
        <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-100/80 transition-colors cursor-pointer">
          <Avatar name={currentUser.name} src={currentUser.avatar} size="sm" status="online" />
          {!isSidebarCollapsed && (
            <div className="flex flex-1 flex-col truncate">
              <span className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</span>
              <span className="text-[10px] text-slate-500 truncate">{currentUser.role}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={clsx(
          'hidden md:flex flex-col border-r border-slate-200/80 bg-white transition-all duration-200 z-20 shrink-0 h-screen sticky top-0',
          isSidebarCollapsed ? 'w-[72px]' : 'w-[250px]'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative w-64 max-w-xs bg-white shadow-popover h-full flex flex-col z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
