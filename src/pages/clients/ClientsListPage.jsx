import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Building2, Mail, Phone, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Avatar } from '../../components/common/Avatar';

export const ClientsListPage = () => {
  const { clients, openQuickCreate } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = clients.filter((c) => {
    const matchesStatus = statusFilter === 'All' || c.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      !search ||
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.contactName.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns = [
    {
      key: 'companyName',
      header: 'Client / Company',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={val} src={row.avatar} size="md" />
          <div>
            <div className="font-semibold text-slate-900">{val}</div>
            <div className="text-[11px] text-slate-400">{row.industry} • {row.location}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'contactName',
      header: 'Primary Contact',
      render: (val, row) => (
        <div>
          <div className="font-semibold text-slate-800">{val}</div>
          <div className="text-[11px] text-slate-400">{row.email}</div>
        </div>
      ),
    },
    {
      key: 'totalSpent',
      header: 'Total Value',
      align: 'right',
      render: (val) => <span className="font-bold text-slate-900">${val.toLocaleString()}</span>,
    },
    {
      key: 'activeProjectsCount',
      header: 'Active Projects',
      align: 'center',
      render: (val) => (
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-semibold text-slate-700">
          {val}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'accountManager',
      header: 'Account Manager',
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
            navigate(`/clients/${row.id}`);
          }}
          className="flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          <Eye className="h-3.5 w-3.5 text-slate-400" /> View
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients Directory"
        subtitle="Manage client accounts, total historical spend, active project contracts, and key stakeholders."
        actions={
          <button
            onClick={() => openQuickCreate('client')}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-3.5 w-3.5" /> Add New Client
          </button>
        }
      />

      <FilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filter by company, contact, industry..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: ['All', 'Active', 'Inactive'],
          },
        ]}
        activeFilters={{ status: statusFilter }}
        onFilterChange={(key, val) => setStatusFilter(val)}
        onReset={() => {
          setSearch('');
          setStatusFilter('All');
        }}
      />

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(row) => navigate(`/clients/${row.id}`)}
        emptyTitle="No clients found"
        emptyDescription="Add a client manually or convert a sales enquiry."
      />
    </div>
  );
};
