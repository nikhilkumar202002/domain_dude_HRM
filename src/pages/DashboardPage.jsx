import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, FolderKanban, Users, MessageSquare, Plus, ArrowRight, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { ChartCard } from '../components/common/ChartCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { ProgressBar } from '../components/common/ProgressBar';
import { ActivityFeed } from '../components/common/Timeline';
import { AvatarGroup } from '../components/common/Avatar';
import { mockRevenueData } from '../data/mockData';

export const DashboardPage = () => {
  const { dashboardStats, enquiries, projects, employees, openQuickCreate } = useApp();
  const navigate = useNavigate();

  const recentEnquiries = enquiries.slice(0, 4);
  const activeProjectsList = projects.filter((p) => p.status !== 'Completed').slice(0, 3);

  const mockActivities = [
    { user: 'Alex Morgan', action: 'converted enquiry to client', target: 'Quantum Dynamics', time: '25 mins ago' },
    { user: 'Sophia Chen', action: 'completed task', target: 'DICOM Viewer Zoom Controls', time: '1 hour ago' },
    { user: 'Marcus Vance', action: 'sent proposal', target: '$120,000 AeroCloud ERP', time: '3 hours ago' },
    { user: 'Elena Rostova', action: 'approved expense', target: '$2,100 Software Licensing', time: '5 hours ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Business Operations OS"
        subtitle="Real-time summary of revenue, sales pipeline, active project delivery, and team productivity."
        actions={
          <>
            <button
              onClick={() => openQuickCreate('enquiry')}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> New Lead Enquiry
            </button>
          </>
        }
      />

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Monthly Revenue"
          value={148500}
          format="currency"
          trend={12.4}
          trendLabel="vs last month"
          icon={DollarSign}
          onClick={() => navigate('/reports')}
        />
        <StatCard
          title="Active Projects"
          value={18}
          trend={5.2}
          trendLabel="on schedule"
          icon={FolderKanban}
          onClick={() => navigate('/projects')}
        />
        <StatCard
          title="Total Clients"
          value={42}
          trend={8.1}
          trendLabel="growth"
          icon={Users}
          onClick={() => navigate('/clients')}
        />
        <StatCard
          title="Pending Enquiries"
          value={14}
          trend={-2.3}
          trendLabel="needs response"
          icon={MessageSquare}
          onClick={() => navigate('/enquiries')}
        />
      </div>

      {/* Main Grid: Charts & Pipeline */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue & Expense Analytics (2 cols) */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Revenue & Cash Flow Analytics"
            subtitle="Monthly gross revenue compared against operating expenses (2026 Q2 - Q3)"
            data={mockRevenueData}
            type="area"
            dataKey="revenue"
            secondaryKey="expenses"
            height={280}
            action={
              <button
                onClick={() => navigate('/reports')}
                className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
              >
                Full Report <ArrowRight className="h-3 w-3" />
              </button>
            }
          />
        </div>

        {/* Activity & System Health (1 col) */}
        <div>
          <ActivityFeed activities={mockActivities} />
        </div>
      </div>

      {/* Second Grid: Recent Enquiries & Active Projects */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Enquiries Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Sales Enquiries</h3>
              <p className="text-xs text-slate-500">Inbound leads awaiting follow-up or proposals</p>
            </div>
            <button
              onClick={() => navigate('/enquiries')}
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-3">
            {recentEnquiries.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/enquiries/${item.id}`)}
                className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:border-indigo-200 hover:bg-slate-50/50 cursor-pointer transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900">{item.clientName}</span>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{item.service}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900">${item.estimatedBudget.toLocaleString()}</span>
                  <p className="text-[10px] text-slate-400">Assigned: {item.assignedTo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Projects Delivery Health Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Active Project Delivery</h3>
              <p className="text-xs text-slate-500">Milestone completion & team progress</p>
            </div>
            <button
              onClick={() => navigate('/projects')}
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-4">
            {activeProjectsList.map((prj) => (
              <div
                key={prj.id}
                onClick={() => navigate(`/projects/${prj.id}`)}
                className="rounded-lg border border-slate-100 p-3 hover:border-indigo-200 hover:bg-slate-50/50 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-semibold text-xs text-slate-900">{prj.name}</span>
                    <span className="text-[11px] text-slate-400 ml-2">• {prj.client}</span>
                  </div>
                  <StatusBadge status={prj.status} size="sm" />
                </div>
                <ProgressBar progress={prj.progress} size="sm" color={prj.progress > 70 ? 'emerald' : 'indigo'} />
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Manager: {prj.manager}</span>
                  <AvatarGroup users={prj.team} size="xs" max={3} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
