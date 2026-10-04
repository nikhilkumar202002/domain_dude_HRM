import React, { useState, useMemo } from 'react';
import {
  Download,
  TrendingUp,
  BarChart2,
  PieChart as PieIcon,
  DollarSign,
  Calendar,
  Layers,
  Users,
  UserCheck,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Percent,
  Check,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { PageHeader } from '../../components/common/PageHeader';
import { mockRevenueData, mockProjectPerformanceData } from '../../data/mockData';

export const ReportsPage = () => {
  // State
  const [activeCategory, setActiveCategory] = useState('Sales'); // 'Sales' | 'Projects' | 'Team' | 'HR' | 'Finance'
  const [dateFilter, setDateFilter] = useState('This Month'); // 'Today' | 'This Week' | 'This Month' | 'This Quarter' | 'Custom'
  const [customStartDate, setCustomStartDate] = useState('2026-10-01');
  const [customEndDate, setCustomEndDate] = useState('2026-10-31');

  // Chart Color Palettes
  const COLORS = ['#0066FF', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];

  // Export actions
  const handleExportCSV = () => {
    alert(`Exporting ${activeCategory} Report dataset for period: ${dateFilter} (CSV format)...`);
  };

  const handleExportPDF = () => {
    alert(`Generating Executive ${activeCategory} Summary PDF Report...`);
  };

  // Mock Datasets for each report tab
  const salesFunnelData = [
    { stage: 'Enquiries Received', count: 86, pct: '100%' },
    { stage: 'Initial Contacted', count: 64, pct: '74%' },
    { stage: 'Proposal Sent', count: 38, pct: '44%' },
    { stage: 'Negotiation', count: 24, pct: '28%' },
    { stage: 'Won Deals', count: 18, pct: '21%' },
  ];

  const salesSourceData = [
    { name: 'Website', value: 35 },
    { name: 'Referral', value: 22 },
    { name: 'Instagram', value: 20 },
    { name: 'WhatsApp', value: 13 },
    { name: 'Direct Call', value: 10 },
  ];

  const projectStatusData = [
    { name: 'In Progress', value: 4 },
    { name: 'Review', value: 2 },
    { name: 'Planning', value: 1 },
    { name: 'Client Approval', value: 1 },
  ];

  const teamUtilizationData = [
    { department: 'Engineering', capacity: 100, utilized: 88 },
    { department: 'Design', capacity: 100, utilized: 82 },
    { department: 'Operations', capacity: 100, utilized: 78 },
    { department: 'QA', capacity: 100, utilized: 84 },
    { department: 'Executive', capacity: 100, utilized: 85 },
  ];

  const hrLeaveTypeData = [
    { name: 'Annual Vacation', value: 50 },
    { name: 'Sick Leave', value: 25 },
    { name: 'Casual Leave', value: 15 },
    { name: 'Conference / Event', value: 10 },
  ];

  const financeStatusData = [
    { name: 'Paid', value: 65 },
    { name: 'Pending', value: 25 },
    { name: 'Overdue', value: 10 },
  ];

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <PageHeader
        title="Reports"
        subtitle="Understand business performance across teams, projects and finance."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <FileText className="h-3.5 w-3.5 text-slate-500" /> Export CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Download className="h-3.5 w-3.5" /> Export PDF
            </button>
          </div>
        }
      />

      {/* DATE FILTER CONTROL BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-800">Reporting Period:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {['Today', 'This Week', 'This Month', 'This Quarter', 'Custom'].map((period) => (
            <button
              key={period}
              onClick={() => setDateFilter(period)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                dateFilter === period
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {dateFilter === 'Custom' && (
          <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="h-8 rounded-lg border border-slate-200 px-2.5 text-xs text-slate-700 focus:outline-none"
            />
            <span className="text-xs text-slate-400">to</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="h-8 rounded-lg border border-slate-200 px-2.5 text-xs text-slate-700 focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* REPORT CATEGORY TAB SWITCHER */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 pb-3">
        {[
          { id: 'Sales', label: 'Sales', icon: TrendingUp },
          { id: 'Projects', label: 'Projects', icon: Layers },
          { id: 'Team', label: 'Team', icon: Users },
          { id: 'HR', label: 'HR', icon: UserCheck },
          { id: 'Finance', label: 'Finance', icon: DollarSign },
        ].map((cat) => {
          const IconComp = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#0066FF] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <IconComp className="h-4 w-4" />
              <span>{cat.label} Report</span>
            </button>
          );
        })}
      </div>

      {/* CATEGORY 1: SALES REPORT */}
      {activeCategory === 'Sales' && (
        <div className="space-y-6">
          {/* Sales Summary KPIs (6 cards) */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Enquiries</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">86</span>
              <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="h-3 w-3" /> +14.2% vs last month
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Conversion Rate</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">24.5%</span>
              <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="h-3 w-3" /> +3.1% velocity
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Proposals</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">38</span>
              <span className="text-[10px] text-slate-500 mt-1 block">$415,000 value</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Won Deals</span>
              <span className="text-2xl font-bold text-emerald-600 mt-1 block">18</span>
              <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">$284,500 total</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Lost Deals</span>
              <span className="text-2xl font-bold text-rose-600 mt-1 block">6</span>
              <span className="text-[10px] text-rose-600 mt-1 block">$62,000 lost</span>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-xs">
              <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">Revenue</span>
              <span className="text-2xl font-extrabold text-[#0066FF] mt-1 block">$148,500</span>
              <span className="text-[10px] font-semibold text-blue-700 mt-1 block">Oct Recognized</span>
            </div>
          </div>

          {/* Sales Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Revenue Trend Line Chart */}
            <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Sales Revenue & Deal Growth</h3>
                  <p className="text-xs text-slate-500">Trailing 6-month sales revenue trajectory ($ USD)</p>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  +18.4% YoY
                </span>
              </div>

              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#E2E8F0',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#0066FF" strokeWidth={3} fillOpacity={1} fill="url(#salesGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Lead Sources Donut Chart */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Lead Sources Breakdown</h3>
                <p className="text-xs text-slate-500">Acquisition channels distribution</p>
              </div>

              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={salesSourceData} innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                      {salesSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                {salesSourceData.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                    <span className="text-slate-600 truncate">{s.name}: <strong>{s.value}%</strong></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sales Conversion Funnel */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Sales Pipeline Funnel Velocity
            </h3>
            <div className="space-y-3">
              {salesFunnelData.map((fn, idx) => (
                <div key={fn.stage} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-800 font-semibold">{fn.stage}</span>
                    <span className="text-slate-900 font-bold">{fn.count} Deals <span className="text-slate-400 font-normal">({fn.pct})</span></span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: fn.pct }}
                      className={`h-full rounded-full transition-all ${
                        idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-indigo-500' : idx === 2 ? 'bg-purple-500' : idx === 3 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 2: PROJECTS REPORT */}
      {activeCategory === 'Projects' && (
        <div className="space-y-6">
          {/* Projects Summary KPIs (5 cards) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Active Projects</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">8</span>
              <span className="text-[10px] text-blue-600 font-medium mt-1 block">In Progress</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Completed</span>
              <span className="text-2xl font-bold text-emerald-600 mt-1 block">14</span>
              <span className="text-[10px] text-emerald-700 font-medium mt-1 block">YTD Delivered</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Overdue</span>
              <span className="text-2xl font-bold text-rose-600 mt-1 block">1</span>
              <span className="text-[10px] text-rose-600 font-medium mt-1 block">Needs Attention</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Avg Completion Time</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">42 Days</span>
              <span className="text-[10px] text-emerald-600 font-medium mt-1 block">3.5d ahead of SLA</span>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-xs">
              <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">Team Workload</span>
              <span className="text-2xl font-extrabold text-[#0066FF] mt-1 block">81.5%</span>
              <span className="text-[10px] text-blue-700 font-semibold mt-1 block">Optimal Capacity</span>
            </div>
          </div>

          {/* Project Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status Distribution Donut Chart */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Project Status Distribution</h3>
                <p className="text-xs text-slate-500">Active project stage breakdown</p>
              </div>

              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={projectStatusData} innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                {projectStatusData.map((ps, i) => (
                  <div key={ps.name} className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                    <span className="text-slate-600 truncate">{ps.name}: <strong>{ps.value}</strong></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Projects Workload Progress */}
            <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Active Project Progress & SLA Tracking
              </h3>

              <div className="space-y-4 text-xs">
                {[
                  { name: 'Quantum Portal v2 Redesign', client: 'Quantum Dynamics', progress: 85, daysLeft: '8 days', status: 'On Track' },
                  { name: 'AeroCloud Real-Time Dispatch Fleet', client: 'AeroCloud Logistics', progress: 68, daysLeft: '14 days', status: 'On Track' },
                  { name: 'HealthViz Medical Imaging Interface', client: 'Nexus Global Health', progress: 92, daysLeft: '3 days', status: 'Near Completion' },
                  { name: 'Mobile Banking Discovery Phase', client: 'FinTech Nexus Corp', progress: 45, daysLeft: '22 days', status: 'On Track' },
                ].map((prj) => (
                  <div key={prj.name} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-900">{prj.name}</span>
                        <span className="text-[11px] text-slate-500 block">{prj.client} • {prj.daysLeft} left</span>
                      </div>
                      <span className="font-extrabold text-blue-600 text-sm">{prj.progress}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div style={{ width: `${prj.progress}%` }} className="h-full rounded-full bg-[#0066FF]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 3: TEAM REPORT */}
      {activeCategory === 'Team' && (
        <div className="space-y-6">
          {/* Team Summary KPIs (4 cards) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Team Members</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">8</span>
              <span className="text-[10px] text-blue-600 font-medium mt-1 block">100% Active</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Avg Utilization %</span>
              <span className="text-2xl font-bold text-emerald-600 mt-1 block">83.4%</span>
              <span className="text-[10px] text-emerald-700 font-medium mt-1 block">+2.4% vs Q2</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Completed Tasks</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">142</span>
              <span className="text-[10px] text-slate-500 mt-1 block">This Month</span>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-xs">
              <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">Billable Hours</span>
              <span className="text-2xl font-extrabold text-[#0066FF] mt-1 block">1,240 hrs</span>
              <span className="text-[10px] text-blue-700 font-semibold mt-1 block">Logged</span>
            </div>
          </div>

          {/* Departmental Utilization Bar Chart */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Departmental Capacity Utilization (%)
            </h3>

            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamUtilizationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="department" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="utilized" fill="#0066FF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 4: HR REPORT */}
      {activeCategory === 'HR' && (
        <div className="space-y-6">
          {/* HR Summary KPIs (5 cards) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Attendance Rate</span>
              <span className="text-2xl font-bold text-emerald-600 mt-1 block">98.2%</span>
              <span className="text-[10px] text-emerald-700 font-medium mt-1 block">Present</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Leave Days Granted</span>
              <span className="text-2xl font-bold text-amber-600 mt-1 block">14 Days</span>
              <span className="text-[10px] text-amber-700 font-medium mt-1 block">October 2026</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Working Hours</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">1,328 hrs</span>
              <span className="text-[10px] text-slate-500 mt-1 block">Regular</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Overtime Hours</span>
              <span className="text-2xl font-bold text-purple-600 mt-1 block">86 hrs</span>
              <span className="text-[10px] text-purple-700 font-medium mt-1 block">Logged</span>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-xs">
              <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">Employee Performance</span>
              <span className="text-2xl font-extrabold text-[#0066FF] mt-1 block">4.8 / 5.0</span>
              <span className="text-[10px] text-blue-700 font-semibold mt-1 block">Quarterly Rating</span>
            </div>
          </div>

          {/* HR Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leave Type Donut Chart */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Leave Type Category Distribution
              </h3>

              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={hrLeaveTypeData} innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {hrLeaveTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Overtime vs Regular Hours breakdown */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Monthly Overtime Hours Distribution
              </h3>

              <div className="space-y-3 text-xs">
                {[
                  { name: 'Rahul Verma (Backend)', ot: 20, max: 20 },
                  { name: 'Marcus Vance (PM)', ot: 16, max: 20 },
                  { name: 'David Miller (Frontend)', ot: 14, max: 20 },
                  { name: 'Sophia Chen (Design)', ot: 12, max: 20 },
                  { name: 'Liam O\'Connor (Lead)', ot: 10, max: 20 },
                ].map((emp) => (
                  <div key={emp.name} className="space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-800">{emp.name}</span>
                      <span className="text-purple-600 font-bold">{emp.ot} OT Hours</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div style={{ width: `${(emp.ot / emp.max) * 100}%` }} className="h-full rounded-full bg-purple-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 5: FINANCE REPORT */}
      {activeCategory === 'Finance' && (
        <div className="space-y-6">
          {/* Finance Summary KPIs (6 cards) */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Gross Revenue</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">$148,500</span>
              <span className="text-[10px] text-emerald-600 font-medium mt-1 block">+12.4% vs Sep</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Invoices Billed</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">$137,900</span>
              <span className="text-[10px] text-slate-500 mt-1 block">6 Invoices</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Payments Collected</span>
              <span className="text-2xl font-bold text-emerald-600 mt-1 block">$113,500</span>
              <span className="text-[10px] text-emerald-700 font-medium mt-1 block">Settled</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Expenses</span>
              <span className="text-2xl font-bold text-rose-600 mt-1 block">$20,799</span>
              <span className="text-[10px] text-rose-600 mt-1 block">Operating Costs</span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Outstanding</span>
              <span className="text-2xl font-bold text-amber-600 mt-1 block">$24,400</span>
              <span className="text-[10px] text-amber-700 font-medium mt-1 block">Receivables</span>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-xs">
              <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">Net Profit</span>
              <span className="text-2xl font-extrabold text-[#0066FF] mt-1 block">$94,300</span>
              <span className="text-[10px] text-blue-700 font-semibold mt-1 block">63.5% Margin</span>
            </div>
          </div>

          {/* Cash Flow Area Chart */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Cash Flow: Revenue vs Expenses vs Net Profit</h3>
                <p className="text-xs text-slate-500">Trailing 6-month P&L ledger breakdown</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                63.5% Profit Margin
              </span>
            </div>

            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="finRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="finProf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#0066FF" strokeWidth={2.5} fillOpacity={1} fill="url(#finRev)" name="Gross Revenue ($)" />
                  <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#finProf)" name="Net Profit ($)" />
                  <Area type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={1.5} fillOpacity={0} name="Operating Expenses ($)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
