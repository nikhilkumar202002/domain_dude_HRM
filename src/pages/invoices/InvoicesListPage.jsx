import React, { useState } from 'react';
import { Plus, Eye, Receipt, Download, CreditCard } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { FilterBar } from '../../components/common/FilterBar';
import { StatusBadge } from '../../components/common/StatusBadge';

export const InvoicesListPage = () => {
  const { invoices, openQuickCreate } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = invoices.filter((inv) => {
    const matchesStatus = statusFilter === 'All' || inv.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      !search ||
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns = [
    {
      key: 'id',
      header: 'Invoice Number',
      render: (val) => <span className="font-semibold text-slate-900">{val}</span>,
    },
    {
      key: 'clientName',
      header: 'Client / Billed To',
      render: (val, row) => (
        <div>
          <div className="font-semibold text-slate-900">{val}</div>
          <div className="text-[11px] text-slate-400">Project: {row.project}</div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Total Amount',
      align: 'right',
      render: (val) => <span className="font-bold text-slate-900">${val.toLocaleString()}</span>,
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (val) => <span className="text-slate-600">{val}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'paymentMethod',
      header: 'Payment Method',
      render: (val) => <span className="text-slate-500">{val}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      align: 'right',
      render: (_, row) => (
        <button
          onClick={() => alert(`Downloading PDF for Invoice ${row.id}...`)}
          className="flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          <Download className="h-3.5 w-3.5 text-slate-400" /> PDF
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Invoices"
        subtitle="Generate client billing invoices, track receivables, payment due dates, and payment statuses."
        actions={
          <button
            onClick={() => openQuickCreate('invoice')}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-3.5 w-3.5" /> New Invoice
          </button>
        }
      />

      <FilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filter by invoice ID or client..."
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: ['All', 'Paid', 'Unpaid', 'Overdue', 'Draft'],
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
