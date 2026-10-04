import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Eye, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Avatar } from '../../components/common/Avatar';

export const EmployeesListPage = () => {
  const { employees, openQuickCreate } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  const filtered = employees.filter((emp) => {
    const matchesDept = deptFilter === 'All' || emp.department.toLowerCase() === deptFilter.toLowerCase();
    const matchesSearch =
      !search ||
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const columns = [
    {
      key: 'name',
      header: 'Employee Name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={val} src={row.avatar} size="md" status="online" />
          <div>
            <div className="font-semibold text-slate-900">{val}</div>
            <div className="text-[11px] text-slate-400">{row.role}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      render: (val) => (
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
          {val}
        </span>
      ),
    },
    {
      key: 'email',
      header: 'Work Email',
      render: (val) => <span className="text-indigo-600">{val}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'joiningDate',
      header: 'Joined',
      render: (val) => <span className="text-slate-600">{val}</span>,
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
          className="flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          <Eye className="h-3.5 w-3.5 text-slate-400" /> View Profile
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Directory"
        subtitle="Manage company staff, engineering teams, departments, profiles, and onboarding status."
        actions={
          <button
            onClick={() => openQuickCreate('employee')}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <UserPlus className="h-3.5 w-3.5" /> Add Employee
          </button>
        }
      />

      <FilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filter employees by name, role, email..."
        filters={[
          {
            key: 'department',
            label: 'Department',
            options: ['All', 'Engineering', 'Product', 'Design', 'Infrastructure', 'Executive'],
          },
        ]}
        activeFilters={{ department: deptFilter }}
        onFilterChange={(key, val) => setDeptFilter(val)}
        onReset={() => {
          setSearch('');
          setDeptFilter('All');
        }}
      />

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(row) => navigate(`/employees/${row.id}`)}
        emptyTitle="No employees found"
        emptyDescription="Add a team member to build your company organization chart."
      />
    </div>
  );
};
