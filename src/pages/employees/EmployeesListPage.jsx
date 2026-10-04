import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  Eye,
  Mail,
  Phone,
  MapPin,
  Building2,
  LayoutGrid,
  List,
  Users,
  UserCheck,
  Calendar,
  Layers,
  CheckSquare,
  TrendingUp,
  User
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Avatar } from '../../components/common/Avatar';

export const EmployeesListPage = () => {
  const { employees, openQuickCreate } = useApp();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Summary Metrics
  const totalEmployeesCount = employees.length;
  const activeCount = employees.filter((e) => e.status === 'Active').length;
  const onLeaveCount = employees.filter((e) => e.status === 'On Leave').length;
  const uniqueDepartments = Array.from(new Set(employees.map((e) => e.department)));
  const departmentsCount = uniqueDepartments.length;

  // Filtered dataset
  const filteredEmployees = employees.filter((emp) => {
    const matchesDept = deptFilter === 'All' || emp.department.toLowerCase() === deptFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || emp.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      !search ||
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      (emp.role && emp.role.toLowerCase().includes(search.toLowerCase())) ||
      (emp.designation && emp.designation.toLowerCase().includes(search.toLowerCase())) ||
      emp.email.toLowerCase().includes(search.toLowerCase());

    return matchesDept && matchesStatus && matchesSearch;
  });

  // Table Columns for List View
  const columns = [
    {
      key: 'name',
      header: 'Employee',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={val} src={row.avatar} size="md" status={row.status === 'Active' ? 'online' : 'away'} />
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/employees/${row.id}`);
              }}
              className="font-bold text-xs text-slate-900 hover:text-[#0066FF] transition text-left block"
            >
              {val}
            </button>
            <span className="text-[11px] text-slate-400">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      render: (val) => (
        <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
          {val}
        </span>
      ),
    },
    {
      key: 'designation',
      header: 'Designation',
      render: (val, row) => <span className="text-xs text-slate-800 font-semibold">{val || row.role}</span>,
    },
    {
      key: 'manager',
      header: 'Manager',
      render: (val, row) => <span className="text-xs text-slate-600 font-medium">{val || row.reportingManager || 'Nikhil'}</span>,
    },
    {
      key: 'tasks',
      header: 'Tasks',
      render: (_, row) => (
        <div className="text-xs">
          <span className="font-bold text-slate-900">{row.activeTasksCount || 4} Active</span>
          <span className="text-slate-400 text-[10px] block">{(row.completedTasksCount || 12)} Done</span>
        </div>
      ),
    },
    {
      key: 'attendanceRate',
      header: 'Attendance',
      render: (val) => <span className="text-xs font-bold text-emerald-600">{val || '98.0%'}</span>,
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
            navigate(`/employees/${row.id}`);
          }}
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0066FF]"
        >
          <Eye className="h-3.5 w-3.5 text-slate-400" /> View Profile
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Employees"
        subtitle="Manage your team, roles and employee information."
        actions={
          <div className="flex items-center gap-3">
            {/* View Switcher Controls */}
            <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  viewMode === 'grid' ? 'bg-[#0066FF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  viewMode === 'list' ? 'bg-[#0066FF] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <List className="h-3.5 w-3.5" /> List
              </button>
            </div>

            <button
              onClick={() => openQuickCreate('employee')}
              className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
            >
              <UserPlus className="h-3.5 w-3.5" /> + Add Employee
            </button>
          </div>
        }
      />

      {/* Summary KPI Cards Grid (4 Summary Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Employees</span>
            <Users className="h-4 w-4 text-[#0066FF]" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{totalEmployeesCount}</span>
            <span className="text-[10px] font-semibold text-blue-600">Company Roster</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Active Staff</span>
            <UserCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-600">{activeCount}</span>
            <span className="text-[10px] font-semibold text-emerald-500">Working Now</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>On Leave</span>
            <Calendar className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-600">{onLeaveCount}</span>
            <span className="text-[10px] font-semibold text-amber-500">Out Today</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Departments</span>
            <Layers className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-purple-600">{departmentsCount}</span>
            <span className="text-[10px] font-semibold text-purple-500">Teams</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search employee by name, designation, email..."
        filters={[
          {
            key: 'department',
            label: 'Department',
            options: ['All', ...uniqueDepartments],
          },
          {
            key: 'status',
            label: 'Status',
            options: ['All', 'Active', 'On Leave', 'Remote', 'Onboarding'],
          },
        ]}
        activeFilters={{
          department: deptFilter,
          status: statusFilter,
        }}
        onFilterChange={(key, val) => {
          if (key === 'department') setDeptFilter(val);
          if (key === 'status') setStatusFilter(val);
        }}
        onReset={() => {
          setSearch('');
          setDeptFilter('All');
          setStatusFilter('All');
        }}
      />

      {/* VIEW 1: GRID VIEW (EMPLOYEE CARDS) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => navigate(`/employees/${emp.id}`)}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card hover:border-[#0066FF] hover:shadow-soft cursor-pointer transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Top Status & Avatar */}
                <div className="flex items-start justify-between">
                  <Avatar name={emp.name} src={emp.avatar} size="lg" status={emp.status === 'Active' ? 'online' : 'away'} />
                  <StatusBadge status={emp.status} size="xs" />
                </div>

                {/* Name & Role */}
                <div className="mt-3">
                  <h3 className="text-sm font-bold text-slate-900 hover:text-[#0066FF] transition-colors">{emp.name}</h3>
                  <p className="text-xs font-semibold text-[#0066FF] mt-0.5">{emp.designation || emp.role}</p>
                  <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 mt-1">
                    {emp.department}
                  </span>
                </div>

                {/* Current Workload Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-[11px] font-medium text-slate-500">
                    <span>Current Workload</span>
                    <span className="font-bold text-slate-900">{emp.workload || 75}%</span>
                  </div>
                  <ProgressBar progress={emp.workload || 75} size="xs" />
                </div>
              </div>

              {/* Card Footer */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1 font-semibold text-slate-700">
                  <CheckSquare className="h-3.5 w-3.5 text-slate-400" />
                  <span>{emp.activeTasksCount || 4} Active Tasks</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {emp.attendanceRate || '98.5%'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: LIST VIEW (DATA TABLE) */}
      {viewMode === 'list' && (
        <DataTable
          columns={columns}
          data={filteredEmployees}
          onRowClick={(row) => navigate(`/employees/${row.id}`)}
          emptyTitle="No employees found"
          emptyDescription="Add a team member to build your company organization chart."
        />
      )}
    </div>
  );
};
