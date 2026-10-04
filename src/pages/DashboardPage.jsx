import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  FolderKanban,
  TrendingUp,
  Receipt,
  Plus,
  ArrowRight,
  Calendar,
  Clock,
  CheckSquare,
  AlertCircle,
  ChevronDown,
  UserCheck,
  User,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { ChartCard } from '../components/common/ChartCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { ProgressBar } from '../components/common/ProgressBar';
import { Avatar } from '../components/common/Avatar';
import { ActivityFeed } from '../components/common/Timeline';

export const DashboardPage = () => {
  const { openQuickCreate } = useApp();
  const navigate = useNavigate();

  // Control states for chart and date range
  const [chartFilter, setChartFilter] = useState('Monthly');
  const [dateRange, setDateRange] = useState('This Month');
  const [followUpTab, setFollowUpTab] = useState('today');

  // Revenue overview chart data (Jan to Oct in INR Lakhs)
  const revenueChartData = [
    { month: 'Jan', revenue: 4.2 },
    { month: 'Feb', revenue: 5.1 },
    { month: 'Mar', revenue: 5.8 },
    { month: 'Apr', revenue: 6.2 },
    { month: 'May', revenue: 6.8 },
    { month: 'Jun', revenue: 7.4 },
    { month: 'Jul', revenue: 7.9 },
    { month: 'Aug', revenue: 8.1 },
    { month: 'Sep', revenue: 8.25 },
    { month: 'Oct', revenue: 8.42 },
  ];

  // Project Progress list
  const projectProgressList = [
    { name: 'ABC Website', progress: 82, color: 'brand' },
    { name: 'ERP System', progress: 64, color: 'brand' },
    { name: 'Mobile App', progress: 48, color: 'amber' },
    { name: 'Branding Project', progress: 91, color: 'emerald' },
  ];

  // Today's Work tasks
  const todaysWorkTasks = [
    { id: 'TW-01', task: 'Complete homepage UI', project: 'ABC Website', assignee: 'Nikhil', time: '02:30 PM', status: 'In Progress' },
    { id: 'TW-02', task: 'Fix checkout API', project: 'ERP System', assignee: 'Rahul', time: '04:00 PM', status: 'To Do' },
    { id: 'TW-03', task: 'Client revision', project: 'Branding Project', assignee: 'Anoop', time: '11:15 AM', status: 'Review' },
    { id: 'TW-04', task: 'Create project proposal', project: 'Mobile App', assignee: 'Arjun', time: '05:45 PM', status: 'In Progress' },
    { id: 'TW-05', task: 'Testing and QA', project: 'ERP System', assignee: 'Nikhil', time: '06:30 PM', status: 'Completed' },
  ];

  // Upcoming sales follow-ups
  const followUps = {
    today: [
      { id: 'FU-101', client: 'Nexus Corp', proposal: 'ERP Customization', value: '₹4.50L', assigned: 'Rahul', dueDate: 'Today, 3:00 PM', status: 'Urgent', isWarning: true },
      { id: 'FU-102', client: 'Apex Media', proposal: 'Brand Identity', value: '₹1.80L', assigned: 'Anoop', dueDate: 'Today, 5:30 PM', status: 'Action Required', isWarning: true },
    ],
    tomorrow: [
      { id: 'FU-103', client: 'AeroLogistics', proposal: 'Mobile Fleet Portal', value: '₹6.20L', assigned: 'Arjun', dueDate: 'Tomorrow, 11:00 AM', status: 'Scheduled', isWarning: false },
    ],
    upcoming: [
      { id: 'FU-104', client: 'BioHealth Ltd', proposal: 'Healthcare App', value: '₹3.80L', assigned: 'Nikhil', dueDate: '08 Oct 2026', status: 'Scheduled', isWarning: false },
    ],
  };

  // Projects overview table data
  const projectOverviewList = [
    { id: 'PRJ-101', name: 'ABC Website', client: 'ABC Corp', manager: 'Nikhil', progress: 82, deadline: '15 Oct 2026', status: 'In Progress' },
    { id: 'PRJ-102', name: 'ERP System', client: 'Strata FinTech', manager: 'Rahul', progress: 64, deadline: '30 Oct 2026', status: 'In Progress' },
    { id: 'PRJ-103', name: 'Mobile App', client: 'Quantum Tech', manager: 'Arjun', progress: 48, deadline: '15 Nov 2026', status: 'Review' },
    { id: 'PRJ-104', name: 'Branding Project', client: 'Velox Group', manager: 'Anoop', progress: 91, deadline: '10 Oct 2026', status: 'In Progress' },
  ];

  // Team Workload
  const teamWorkloadList = [
    { name: 'Nikhil', role: 'Lead Architect', progress: 82, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { name: 'Rahul', role: 'Senior Developer', progress: 72, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { name: 'Anoop', role: 'UI/UX Designer', progress: 61, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { name: 'Arjun', role: 'Full Stack Dev', progress: 45, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
  ];

  // Recent Activity timeline items
  const recentActivities = [
    { user: 'Rahul', action: 'sent proposal for', target: 'ERP System (Strata FinTech)', time: '10 mins ago' },
    { user: 'System', action: 'received new enquiry from', target: 'ABC Corp', time: '35 mins ago' },
    { user: 'Arjun', action: 'created project', target: 'Mobile App v2', time: '2 hours ago' },
    { user: 'Anoop', action: 'confirmed invoice payment by', target: 'Branding Client', time: '4 hours ago' },
    { user: 'Nikhil', action: 'completed task', target: 'Homepage UI', time: '5 hours ago' },
  ];

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl flex items-center gap-2">
            Good morning, Nikhil 👋
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Here's what's happening across your business.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Date Range Selector */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-semibold text-slate-700 shadow-soft focus:border-[#0066FF] focus:outline-none cursor-pointer"
            >
              <option value="This Month">This Month</option>
              <option value="This Quarter">This Quarter</option>
              <option value="This Year">This Year</option>
            </select>
          </div>

          {/* Quick Action + Create */}
          <button
            onClick={() => openQuickCreate('enquiry')}
            className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0052D4] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> + Create
          </button>
        </div>
      </div>

      {/* KPI SECTION (4 Cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Enquiries"
          value={128}
          trendText="+18.4%"
          trendLabel="vs last month"
          icon={MessageSquare}
          onClick={() => navigate('/enquiries')}
        />
        <StatCard
          title="Active Projects"
          value={24}
          trendText="+6 projects"
          trendLabel="vs last month"
          icon={FolderKanban}
          onClick={() => navigate('/projects')}
        />
        <StatCard
          title="Revenue"
          value="₹8.42L"
          trendText="+12.8%"
          trendLabel="vs last month"
          icon={TrendingUp}
          onClick={() => navigate('/reports')}
        />
        <StatCard
          title="Outstanding"
          value="₹2.18L"
          trendText="-4.2%"
          trendLabel="vs last month"
          icon={Receipt}
          onClick={() => navigate('/invoices')}
        />
      </div>

      {/* MAIN ANALYTICS SECTION (Two Columns) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT: Revenue Overview Chart (2 cols) */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Revenue Overview"
            subtitle="Monthly gross revenue performance from January to October (₹ Lakhs)"
            data={revenueChartData}
            type="area"
            dataKey="revenue"
            xAxisKey="month"
            height={260}
            action={
              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
                {['Monthly', 'Quarterly', 'Yearly'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setChartFilter(mode)}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      chartFilter === mode
                        ? 'bg-white text-[#0066FF] shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            }
          />
        </div>

        {/* RIGHT: Project Progress (1 col) */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Project Progress</h3>
                <p className="text-xs text-slate-500">Key milestone completion rates</p>
              </div>
              <button
                onClick={() => navigate('/projects')}
                className="text-xs font-semibold text-[#0066FF] hover:underline"
              >
                All Projects
              </button>
            </div>

            <div className="space-y-4">
              {projectProgressList.map((prj, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                    <span>{prj.name}</span>
                    <span className="text-[#0066FF] font-bold">{prj.progress}%</span>
                  </div>
                  <ProgressBar progress={prj.progress} size="sm" showLabel={false} color={prj.color} />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-3 text-center">
            <span className="text-[11px] text-slate-400 font-medium">4 active sprints ongoing</span>
          </div>
        </div>
      </div>

      {/* TODAY'S WORK & FOLLOW-UPS SECTION */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* TODAY'S WORK (2 cols) */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Today's Work</h3>
              <p className="text-xs text-slate-500">Priority tasks and scheduled sprint items for today</p>
            </div>
            <button
              onClick={() => navigate('/tasks')}
              className="text-xs font-semibold text-[#0066FF] hover:underline flex items-center gap-1"
            >
              View Task Board <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-3 py-2.5">Task</th>
                  <th className="px-3 py-2.5">Project</th>
                  <th className="px-3 py-2.5">Assigned To</th>
                  <th className="px-3 py-2.5">Time</th>
                  <th className="px-3 py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {todaysWorkTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-3 py-3 font-semibold text-slate-900">{t.task}</td>
                    <td className="px-3 py-3 text-slate-500">{t.project}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <Avatar name={t.assignee} size="xs" />
                        <span className="font-medium text-slate-700">{t.assignee}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-500 font-mono text-[11px]">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {t.time}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <StatusBadge status={t.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOLLOW-UPS (1 col) */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Sales Follow-ups</h3>
                <p className="text-xs text-slate-500">Upcoming client lead touchpoints</p>
              </div>
            </div>

            {/* Follow-up Tabs */}
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 mb-3 text-xs">
              {[
                { id: 'today', label: 'Due Today', count: followUps.today.length },
                { id: 'tomorrow', label: 'Due Tomorrow', count: followUps.tomorrow.length },
                { id: 'upcoming', label: 'Upcoming', count: followUps.upcoming.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFollowUpTab(tab.id)}
                  className={`flex-1 rounded-md py-1 text-[11px] font-semibold transition-all ${
                    followUpTab === tab.id
                      ? 'bg-white text-[#0066FF] shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Follow-up List */}
            <div className="space-y-2.5">
              {followUps[followUpTab].map((item) => (
                <div
                  key={item.id}
                  className={`rounded-lg border p-3 text-xs transition-colors ${
                    item.isWarning ? 'border-amber-200 bg-amber-50/40' : 'border-slate-100 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                    <span>{item.client}</span>
                    <span className="text-emerald-700">{item.value}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] font-medium">{item.proposal}</p>

                  <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-200/50 text-[11px]">
                    <span className="text-slate-500">Owner: <strong className="text-slate-800">{item.assigned}</strong></span>
                    <span className={`font-semibold px-2 py-0.5 rounded ${item.isWarning ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-slate-100 text-center">
            <button
              onClick={() => navigate('/enquiries')}
              className="text-xs font-semibold text-[#0066FF] hover:underline"
            >
              Manage all sales prospects →
            </button>
          </div>
        </div>
      </div>

      {/* PROJECT OVERVIEW & TEAM WORKLOAD & RECENT ACTIVITY SECTION */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* PROJECT OVERVIEW TABLE (2 cols) */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Project Overview</h3>
              <p className="text-xs text-slate-500">Live development contracts and deadlines</p>
            </div>
            <button
              onClick={() => navigate('/projects')}
              className="text-xs font-semibold text-[#0066FF] hover:underline flex items-center gap-1"
            >
              View all projects →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-3 py-2.5">Project</th>
                  <th className="px-3 py-2.5">Client</th>
                  <th className="px-3 py-2.5">Manager</th>
                  <th className="px-3 py-2.5 w-32">Progress</th>
                  <th className="px-3 py-2.5">Deadline</th>
                  <th className="px-3 py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projectOverviewList.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => navigate(`/projects/${p.id}`)}
                    className="hover:bg-slate-50/60 cursor-pointer transition-colors"
                  >
                    <td className="px-3 py-3 font-bold text-slate-900">{p.name}</td>
                    <td className="px-3 py-3 text-slate-600">{p.client}</td>
                    <td className="px-3 py-3 font-medium text-slate-700">{p.manager}</td>
                    <td className="px-3 py-3">
                      <ProgressBar progress={p.progress} size="sm" showLabel={false} />
                    </td>
                    <td className="px-3 py-3 text-slate-500 text-[11px]">{p.deadline}</td>
                    <td className="px-3 py-3 text-right">
                      <StatusBadge status={p.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TEAM WORKLOAD & RECENT ACTIVITY (1 col) */}
        <div className="space-y-6">
          {/* TEAM WORKLOAD */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Team Workload</h3>
              <span className="text-[11px] font-semibold text-slate-400">Current Sprint</span>
            </div>

            <div className="space-y-3">
              {teamWorkloadList.map((mem, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Avatar name={mem.name} src={mem.avatar} size="xs" />
                      <span className="font-bold text-slate-900">{mem.name}</span>
                      <span className="text-[10px] text-slate-400">({mem.role})</span>
                    </div>
                    <span className="font-bold text-[#0066FF]">{mem.progress}%</span>
                  </div>
                  <ProgressBar progress={mem.progress} size="sm" showLabel={false} color={mem.progress > 80 ? 'amber' : 'brand'} />
                </div>
              ))}
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <ActivityFeed activities={recentActivities} />
        </div>
      </div>
    </div>
  );
};
