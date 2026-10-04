import React from 'react';
import { Plus, PieChart, FileText } from 'lucide-react';
import { mockExpenses } from '../../data/mockData';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';

export const ExpensesListPage = () => {
  const columns = [
    {
      key: 'id',
      header: 'Expense ID',
      render: (val) => <span className="font-semibold text-slate-900">{val}</span>,
    },
    {
      key: 'category',
      header: 'Category & Vendor',
      render: (val, row) => (
        <div>
          <div className="font-semibold text-slate-900">{val}</div>
          <div className="text-[11px] text-slate-400">Vendor: {row.vendor}</div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (val) => <span className="font-bold text-slate-900">${val.toLocaleString()}</span>,
    },
    {
      key: 'submitter',
      header: 'Claimed By',
      render: (val) => <span className="text-slate-700">{val}</span>,
    },
    {
      key: 'project',
      header: 'Allocated Project',
      render: (val) => <span className="text-slate-500">{val}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operating Expenses"
        subtitle="Track company expenditure, software licensing, cloud hosting, travel claims, and vendor receipts."
        actions={
          <button
            onClick={() => alert('Log New Expense Modal')}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-3.5 w-3.5" /> Log Expense
          </button>
        }
      />

      <DataTable columns={columns} data={mockExpenses} />
    </div>
  );
};
