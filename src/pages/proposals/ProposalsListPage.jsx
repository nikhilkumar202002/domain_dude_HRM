import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Download, Eye, FileText, Send, Copy, Edit, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { NewProposalModal } from '../../components/proposals/NewProposalModal';

export const ProposalsListPage = () => {
  const { proposals, addProposal } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [clientFilter, setClientFilter] = useState('All');
  const [assignedFilter, setAssignedFilter] = useState('All');
  const [isNewProposalModalOpen, setIsNewProposalModalOpen] = useState(false);

  // Compute Summary Metrics
  const draftCount = proposals.filter((p) => p.status === 'Draft').length;
  const sentCount = proposals.filter((p) => p.status === 'Sent').length;
  const viewedCount = proposals.filter((p) => p.status === 'Viewed').length;
  const negotiationCount = proposals.filter((p) => p.status === 'Negotiation').length;
  const acceptedCount = proposals.filter((p) => p.status === 'Accepted').length;
  const rejectedCount = proposals.filter((p) => p.status === 'Rejected').length;
  const totalValueSum = proposals.reduce((acc, p) => acc + (p.grandTotal || p.amount || 0), 0);

  // Format INR Lakhs / Crores helper
  const formatINR = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Client & Assigned filter list
  const uniqueClients = Array.from(new Set(proposals.map((p) => p.clientName)));
  const uniqueAssigned = Array.from(new Set(proposals.map((p) => p.author || p.assignedTo)));

  // Filtering Logic
  const filteredProposals = proposals.filter((p) => {
    const matchesStatus = statusFilter === 'All' || p.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesClient = clientFilter === 'All' || p.clientName === clientFilter;
    const matchesAssigned = assignedFilter === 'All' || (p.author || p.assignedTo) === assignedFilter;
    const matchesSearch =
      !search ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      (p.service && p.service.toLowerCase().includes(search.toLowerCase()));

    return matchesStatus && matchesClient && matchesAssigned && matchesSearch;
  });

  const handleDuplicate = (proposal) => {
    const dup = {
      ...proposal,
      id: `PROP-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: `${proposal.title} (Copy)`,
      status: 'Draft',
      createdDate: new Date().toISOString().split('T')[0],
      sentDate: 'Pending',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      activity: [
        { id: 1, type: 'created', label: 'Duplicated from ' + proposal.id, by: 'Nikhil', timestamp: 'Just now' }
      ]
    };
    addProposal(dup);
  };

  const handleExportCSV = () => {
    const headers = ['Proposal ID,Title,Client,Service,Value,Status,Created Date,Valid Until,Author\n'];
    const rows = filteredProposals.map(
      (p) => `${p.id},"${p.title}","${p.clientName}","${p.service || ''}",${p.grandTotal || p.amount},${p.status},${p.createdDate},${p.validUntil},${p.author}`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Proposals_Export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const columns = [
    {
      key: 'id',
      header: 'Proposal Number',
      render: (val, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/proposals/${row.id}`);
          }}
          className="font-bold text-[#0066FF] hover:underline"
        >
          {val}
        </button>
      ),
    },
    {
      key: 'clientName',
      header: 'Client',
      render: (val, row) => (
        <div>
          <div className="font-bold text-slate-900">{val}</div>
          <div className="text-[11px] text-slate-400">{row.contactPerson || row.email}</div>
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Project / Service',
      render: (val, row) => (
        <div className="max-w-xs">
          <div className="font-semibold text-slate-900 truncate">{val}</div>
          <div className="text-[11px] text-slate-500 truncate">{row.service || 'Commercial Scope'}</div>
        </div>
      ),
    },
    {
      key: 'grandTotal',
      header: 'Value',
      align: 'right',
      render: (val, row) => {
        const amount = val || row.amount || 0;
        return <span className="font-bold text-slate-900">₹{amount.toLocaleString('en-IN')}</span>;
      },
    },
    {
      key: 'createdDate',
      header: 'Created',
      render: (val) => <span className="text-slate-600 text-xs">{val || '2026-09-20'}</span>,
    },
    {
      key: 'validUntil',
      header: 'Valid Until',
      render: (val) => <span className="text-slate-600 text-xs">{val}</span>,
    },
    {
      key: 'author',
      header: 'Assigned To',
      render: (val, row) => (
        <div className="flex items-center gap-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[#0066FF] text-[10px] font-bold">
            {(val || row.assignedTo || 'N')[0]}
          </div>
          <span className="text-xs text-slate-700">{val || row.assignedTo || 'Unassigned'}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/proposals/${row.id}`)}
            title="View Detail"
            className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[#0066FF]"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => navigate(`/proposals/${row.id}`)}
            title="Edit Proposal"
            className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[#0066FF]"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => handleDuplicate(row)}
            title="Duplicate Proposal"
            className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-emerald-600"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Proposals"
        subtitle="Create, manage and track client proposals."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" /> Export
            </button>
            <button
              onClick={() => setIsNewProposalModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
            >
              <Plus className="h-3.5 w-3.5" /> + New Proposal
            </button>
          </div>
        }
      />

      {/* Summary KPI Cards Grid (7 Metric Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Draft</span>
            <FileText className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">{draftCount}</span>
            <span className="text-[10px] font-semibold text-slate-400">In Prep</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Sent</span>
            <Send className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-blue-600">{sentCount}</span>
            <span className="text-[10px] font-semibold text-blue-500">Issued</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Viewed</span>
            <Eye className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-purple-600">{viewedCount}</span>
            <span className="text-[10px] font-semibold text-purple-500">Opened</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Negotiation</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-amber-600">{negotiationCount}</span>
            <span className="text-[10px] font-semibold text-amber-500">In Sync</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Accepted</span>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-emerald-600">{acceptedCount}</span>
            <span className="text-[10px] font-semibold text-emerald-500">Won</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Rejected</span>
            <XCircle className="h-4 w-4 text-red-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-bold text-red-600">{rejectedCount}</span>
            <span className="text-[10px] font-semibold text-red-500">Lost</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#0066FF]/20 bg-blue-50/50 p-3.5 shadow-card col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-[#0066FF] font-semibold">
            <span>Total Value</span>
            <FileText className="h-4 w-4 text-[#0066FF]" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-slate-900">{formatINR(totalValueSum)}</span>
            <span className="text-[10px] font-bold text-[#0066FF]">Pipeline</span>
          </div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <FilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by proposal number, client, project, service..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: ['All', 'Draft', 'Sent', 'Viewed', 'Negotiation', 'Accepted', 'Rejected', 'Expired'],
          },
          {
            key: 'client',
            label: 'Client',
            options: ['All', ...uniqueClients],
          },
          {
            key: 'assignedTo',
            label: 'Assigned To',
            options: ['All', ...uniqueAssigned],
          },
        ]}
        activeFilters={{
          status: statusFilter,
          client: clientFilter,
          assignedTo: assignedFilter,
        }}
        onFilterChange={(key, val) => {
          if (key === 'status') setStatusFilter(val);
          if (key === 'client') setClientFilter(val);
          if (key === 'assignedTo') setAssignedFilter(val);
        }}
        onReset={() => {
          setSearch('');
          setStatusFilter('All');
          setClientFilter('All');
          setAssignedFilter('All');
        }}
      />

      {/* Main DataTable */}
      <DataTable
        columns={columns}
        data={filteredProposals}
        onRowClick={(row) => navigate(`/proposals/${row.id}`)}
        emptyTitle="No proposals found"
        emptyDescription="Create a new proposal using the builder or adjust your search filters."
      />

      {/* Multi-step New Proposal Wizard Modal */}
      <NewProposalModal
        isOpen={isNewProposalModalOpen}
        onClose={() => setIsNewProposalModalOpen(false)}
      />
    </div>
  );
};
