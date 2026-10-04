import React, { useState } from 'react';
import { Clock, UserCheck, CheckCircle, Calendar, Filter } from 'lucide-react';
import { mockAttendance } from '../../data/mockData';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatCard } from '../../components/common/StatCard';

export const AttendancePage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = mockAttendance.filter((a) => {
    const matchesStatus = statusFilter === 'All' || a.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = !search || a.employeeName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns = [
    {
      key: 'employeeName',
      header: 'Employee Name',
      render: (val, row) => (
        <div>
          <div className="font-semibold text-slate-900">{val}</div>
          <div className="text-[11px] text-slate-400">ID: {row.empId}</div>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (val) => <span className="text-slate-700">{val}</span>,
    },
    {
      key: 'clockIn',
      header: 'Clock In',
      render: (val) => <span className="font-semibold text-emerald-700">{val}</span>,
    },
    {
      key: 'clockOut',
      header: 'Clock Out',
      render: (val) => <span className="font-semibold text-slate-700">{val}</span>,
    },
    {
      key: 'hours',
      header: 'Total Hours',
      align: 'right',
      render: (val) => <span className="font-bold text-slate-900">{val} hrs</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'mode',
      header: 'Work Location',
      render: (val) => (
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
          {val}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance & Time Log"
        subtitle="Daily check-in logs, total working hours, remote/onsite status, and punctuality monitoring."
        actions={
          <button
            onClick={() => alert('Simulated: Clock In / Clock Out triggered for Alex Morgan')}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Clock className="h-3.5 w-3.5" /> Quick Clock In
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total Present Today" value={28} trend={4.2} icon={UserCheck} />
        <StatCard title="Remote Workers" value={9} trend={0} icon={Calendar} />
        <StatCard title="On Leave / Absent" value={3} trend={-1.5} icon={Clock} />
      </div>

      <FilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by employee name..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: ['All', 'Present', 'Late', 'On Leave', 'Absent'],
          },
        ]}
        activeFilters={{ status: statusFilter }}
        onFilterChange={(key, val) => setStatusFilter(val)}
        onReset={() => {
          setSearch('');
          setStatusFilter('All');
        }}
      />

      <DataTable columns={columns} data={filtered} />
    </div>
  );
};
