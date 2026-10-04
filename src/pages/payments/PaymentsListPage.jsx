import React from 'react';
import { CreditCard, CheckCircle } from 'lucide-react';
import { mockPayments } from '../../data/mockData';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';

export const PaymentsListPage = () => {
  const columns = [
    {
      key: 'id',
      header: 'Payment Ref',
      render: (val) => <span className="font-semibold text-slate-900">{val}</span>,
    },
    {
      key: 'client',
      header: 'Client',
      render: (val, row) => (
        <div>
          <div className="font-semibold text-slate-900">{val}</div>
          <div className="text-[11px] text-slate-400">Invoice: {row.invoiceId}</div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount Paid',
      align: 'right',
      render: (val) => <span className="font-bold text-emerald-700">${val.toLocaleString()}</span>,
    },
    {
      key: 'method',
      header: 'Payment Channel',
      render: (val) => (
        <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
          {val}
        </span>
      ),
    },
    {
      key: 'transactionRef',
      header: 'Gateway Txn ID',
      render: (val) => <span className="text-slate-500 font-mono text-[11px]">{val}</span>,
    },
    {
      key: 'date',
      header: 'Received Date',
      render: (val) => <span className="text-slate-600">{val}</span>,
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
        title="Payment Transactions Log"
        subtitle="Audited ledger of completed client payments, wire confirmations, and gateway receipts."
      />

      <DataTable columns={columns} data={mockPayments} />
    </div>
  );
};
