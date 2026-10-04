import React, { useState } from 'react';
import {
  Clock,
  UserCheck,
  UserX,
  AlertTriangle,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  TrendingUp,
  CheckCircle2,
  Home,
  Sun,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { mockAttendance } from '../../data/mockData';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Avatar } from '../../components/common/Avatar';

export const AttendancePage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentMonth, setCurrentMonth] = useState(new Date('2026-10-01'));
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Selected employee for monthly detail drawer

  // Metrics Calculations
  const presentCount = mockAttendance.filter((a) => a.status === 'Present' || a.status === 'Work From Home').length;
  const absentCount = mockAttendance.filter((a) => a.status === 'Absent').length;
  const lateCount = mockAttendance.filter((a) => a.status === 'Late').length;
  const leaveCount = mockAttendance.filter((a) => a.status === 'Leave').length;

  const validHoursRecords = mockAttendance.filter((a) => a.workingHours > 0);
  const avgHoursSum = validHoursRecords.reduce((sum, a) => sum + a.workingHours, 0);
  const avgHours = validHoursRecords.length > 0 ? (avgHoursSum / validHoursRecords.length).toFixed(1) : '8.0';

  // Filtered attendance list
  const filtered = mockAttendance.filter((a) => {
    const matchesStatus = statusFilter === 'All' || a.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      !search ||
      a.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      a.empId.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Month navigation
  const monthDisplayStr = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Table Columns
  const columns = [
    {
      key: 'employeeName',
      header: 'Employee',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={val} src={row.avatar} size="sm" />
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEmployee(row);
              }}
              className="font-bold text-xs text-slate-900 hover:text-[#0066FF] transition text-left block"
            >
              {val}
            </button>
            <span className="text-[11px] text-slate-400 font-mono">{row.empId}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (val) => <span className="text-xs font-semibold text-slate-700">{val}</span>,
    },
    {
      key: 'clockIn',
      header: 'Clock In',
      render: (val, row) => (
        <span className={`text-xs font-bold ${row.status === 'Late' ? 'text-amber-600' : 'text-emerald-600'}`}>
          {val}
        </span>
      ),
    },
    {
      key: 'clockOut',
      header: 'Clock Out',
      render: (val) => <span className="text-xs font-bold text-slate-700">{val}</span>,
    },
    {
      key: 'workingHours',
      header: 'Working Hours',
      align: 'right',
      render: (val) => <span className="text-xs font-extrabold text-slate-900">{val} hrs</span>,
    },
    {
      key: 'overtime',
      header: 'Overtime',
      align: 'right',
      render: (val) => (
        <span className={`text-xs font-bold ${val > 0 ? 'text-[#0066FF]' : 'text-slate-400'}`}>
          {val > 0 ? `+${val} hrs` : '0.0 hrs'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val} size="xs" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      align: 'right',
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedEmployee(row);
          }}
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0066FF]"
        >
          <Eye className="h-3.5 w-3.5 text-slate-400" /> Monthly View
        </button>
      ),
    },
  ];

  // Helper for generating monthly days grid (31 days for Oct 2026)
  const generateMonthlyDays = (employee) => {
    const days = [];
    for (let d = 1; d <= 31; d++) {
      const dayNum = d;
      let state = 'Present';
      let stateColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';

      // Weekend check (Oct 3, 4, 10, 11, 17, 18, 24, 25, 31 are weekends)
      if ([3, 4, 10, 11, 17, 18, 24, 25, 31].includes(dayNum)) {
        state = 'Holiday';
        stateColor = 'bg-purple-50 text-purple-700 border-purple-200';
      } else if (dayNum === 12 || dayNum === 13) {
        state = 'Leave';
        stateColor = 'bg-amber-50 text-amber-700 border-amber-200';
      } else if (dayNum === 6) {
        state = 'Late';
        stateColor = 'bg-orange-50 text-orange-700 border-orange-200';
      } else if (dayNum === 20) {
        state = 'Absent';
        stateColor = 'bg-rose-50 text-rose-700 border-rose-200';
      }

      days.push({ day: dayNum, state, stateColor });
    }
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Attendance"
        subtitle="Monitor employee attendance and working hours."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-2xs">
              <button onClick={handlePrevMonth} className="p-1 text-slate-500 hover:bg-slate-100 rounded-md">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-bold text-slate-900 px-2">{monthDisplayStr}</span>
              <button onClick={handleNextMonth} className="p-1 text-slate-500 hover:bg-slate-100 rounded-md">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        }
      />

      {/* Summary KPI Cards Grid (5 Metrics Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Present Today</span>
            <UserCheck className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-600">{presentCount}</span>
            <span className="text-[10px] font-semibold text-emerald-500">On Duty</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Absent</span>
            <UserX className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-rose-600">{absentCount}</span>
            <span className="text-[10px] font-semibold text-rose-500">Unexcused</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Late</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-600">{lateCount}</span>
            <span className="text-[10px] font-semibold text-amber-500">Past 09:15 AM</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>On Leave</span>
            <CalendarIcon className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-purple-600">{leaveCount}</span>
            <span className="text-[10px] font-semibold text-purple-500">Approved PTO</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Average Hours</span>
            <Clock className="h-4 w-4 text-[#0066FF]" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#0066FF]">{avgHours}h</span>
            <span className="text-[10px] font-semibold text-[#0066FF]">per shift</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search employee by name or ID..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: ['All', 'Present', 'Absent', 'Late', 'Half Day', 'Leave', 'Work From Home'],
          },
        ]}
        activeFilters={{ status: statusFilter }}
        onFilterChange={(key, val) => setStatusFilter(val)}
        onReset={() => {
          setSearch('');
          setStatusFilter('All');
        }}
      />

      {/* Main Attendance DataTable */}
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(row) => setSelectedEmployee(row)}
        emptyTitle="No attendance records found"
        emptyDescription="Adjust your search query or status filter."
      />

      {/* EMPLOYEE MONTHLY ATTENDANCE DETAIL DRAWER */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={selectedEmployee.employeeName} src={selectedEmployee.avatar} size="lg" />
                  <div>
                    <span className="text-[10px] font-bold text-[#0066FF] uppercase tracking-wider">{selectedEmployee.empId}</span>
                    <h3 className="text-lg font-bold text-slate-900">{selectedEmployee.employeeName}</h3>
                    <p className="text-xs text-slate-500 font-medium">{selectedEmployee.role || 'Team Member'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Work Hours Summary Box (Regular, Overtime, Total) */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Work Hours Summary ({monthDisplayStr})</h4>
                <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Regular Hours</span>
                    <span className="text-base font-bold text-slate-900">160.0 hrs</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Overtime</span>
                    <span className="text-base font-bold text-[#0066FF]">+ 14.5 hrs</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Hours</span>
                    <span className="text-base font-extrabold text-emerald-600">174.5 hrs</span>
                  </div>
                </div>
              </div>

              {/* Monthly Attendance Calendar Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Calendar Grid</h4>
                  <div className="flex items-center gap-2 text-[10px] font-semibold">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" /> Present
                    </span>
                    <span className="flex items-center gap-1 text-amber-700">
                      <span className="h-2 w-2 rounded-full bg-amber-500" /> Leave
                    </span>
                    <span className="flex items-center gap-1 text-purple-700">
                      <span className="h-2 w-2 rounded-full bg-purple-500" /> Holiday
                    </span>
                    <span className="flex items-center gap-1 text-rose-700">
                      <span className="h-2 w-2 rounded-full bg-rose-500" /> Absent
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="font-bold text-[10px] text-slate-400 uppercase py-1">
                      {day}
                    </div>
                  ))}

                  {generateMonthlyDays(selectedEmployee).map((d) => (
                    <div
                      key={d.day}
                      className={`h-12 rounded-lg border p-1 flex flex-col justify-between items-center text-[11px] font-bold ${d.stateColor}`}
                    >
                      <span className="text-[10px]">{d.day}</span>
                      <span className="text-[9px] font-medium leading-none">{d.state}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-end">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
