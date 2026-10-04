import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, FileText, Send, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { StatusBadge } from '../../components/common/StatusBadge';

export const ProposalsListPage = () => {
  const { proposals, openQuickCreate } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = proposals.filter((p) => {
    const matchesStatus = statusFilter === 'All' || p.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns = [
    {
      key: 'id',
      header: 'Proposal ID',
      render: (val) => <span className="font-semibold text-slate-900">{val}</span>,
    },
    {
      key: 'title',
      header: 'Proposal Title',
      render: (val, row) => (
        <div>
          <div className="font-semibold text-slate-900">{val}</div>
          <div className="text-[11px] text-slate-400">Client: {row.clientName}</div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Total Value',
      align: 'right',
      render: (val) => <span className="font-bold text-slate-900">${val.toLocaleString()}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'sentDate',
      header: 'Sent Date',
      render: (val) => <span className="text-slate-600">{val}</span>,
    },
    {
      key: 'author',
      header: 'Author',
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
            navigate(`/proposals/${row.id}`);
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
        title="Commercial Proposals"
        subtitle="Manage client bids, scope estimates, milestone pricing, and contractual commitments."
        actions={
          <button
            onClick={() => openQuickCreate('proposal')}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-3.5 w-3.5" /> Create Proposal
          </button>
        }
      />

      <FilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filter proposals by title or client..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: ['All', 'Draft', 'Sent', 'Accepted', 'Rejected'],
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
        onRowClick={(row) => navigate(`/proposals/${row.id}`)}
        emptyTitle="No proposals found"
        emptyDescription="Create a new commercial proposal to track deal progress."
      />
    </div>
  );
};
