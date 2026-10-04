import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, CheckCircle2, UserCheck, Phone, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { StatusBadge } from '../../components/common/StatusBadge';

export const EnquiriesListPage = () => {
  const { enquiries, openQuickCreate } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = enquiries.filter((e) => {
    const matchesStatus = statusFilter === 'All' || e.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      !search ||
      e.clientName.toLowerCase().includes(search.toLowerCase()) ||
      e.service.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns = [
    {
      key: 'id',
      header: 'Enquiry ID',
      render: (val, row) => <span className="font-semibold text-slate-900">{val}</span>,
    },
    {
      key: 'clientName',
      header: 'Client / Company',
      render: (val, row) => (
        <div>
          <div className="font-semibold text-slate-900">{val}</div>
          <div className="text-[11px] text-slate-400">{row.contactPerson}</div>
        </div>
      ),
    },
    {
      key: 'service',
      header: 'Service Required',
      render: (val) => <span className="text-slate-700">{val}</span>,
    },
    {
      key: 'estimatedBudget',
      header: 'Est. Budget',
      align: 'right',
      render: (val) => <span className="font-bold text-slate-900">${val.toLocaleString()}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'assignedTo',
      header: 'Assigned Owner',
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
            navigate(`/enquiries/${row.id}`);
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
        title="Sales Enquiries"
        subtitle="Track and qualify inbound business leads, prospective clients, and project requests."
        actions={
          <button
            onClick={() => openQuickCreate('enquiry')}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-3.5 w-3.5" /> New Enquiry
          </button>
        }
      />

      <FilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filter by client, service, ID..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: ['All', 'New', 'In Discussion', 'Qualified', 'Proposal Sent', 'Won', 'Lost'],
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
        onRowClick={(row) => navigate(`/enquiries/${row.id}`)}
        emptyTitle="No sales enquiries found"
        emptyDescription="Try adjusting your filters or click 'New Enquiry' to add one."
      />
    </div>
  );
};
