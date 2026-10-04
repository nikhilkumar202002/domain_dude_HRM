import React, { useState } from 'react';
import { Plus, Check, X, Calendar, AlertCircle } from 'lucide-react';
import { mockLeaveRequests } from '../../data/mockData';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/Modal';

export const LeavePage = () => {
  const [leaveList, setLeaveList] = useState(mockLeaveRequests);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [actionType, setActionType] = useState(null);

  const handleApprove = (id) => {
    setLeaveList((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'Approved' } : l)));
  };

  const handleReject = (id) => {
    setLeaveList((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'Rejected' } : l)));
  };

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
      key: 'leaveType',
      header: 'Leave Type',
      render: (val) => (
        <span className="rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
          {val}
        </span>
      ),
    },
    {
      key: 'startDate',
      header: 'Duration',
      render: (val, row) => (
        <span className="text-slate-700">{val} → {row.endDate} ({row.days} days)</span>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (val) => <span className="text-slate-600 truncate max-w-xs block">{val}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'actions',
      header: 'Approve / Reject',
      sortable: false,
      align: 'right',
      render: (_, row) => (
        row.status === 'Pending' ? (
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => handleApprove(row.id)}
              className="flex items-center gap-1 rounded bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              <Check className="h-3.5 w-3.5" /> Approve
            </button>
            <button
              onClick={() => handleReject(row.id)}
              className="flex items-center gap-1 rounded bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100"
            >
              <X className="h-3.5 w-3.5" /> Reject
            </button>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400 font-medium">Processed</span>
        )
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Management"
        subtitle="Review employee paid time-off (PTO), sick leaves, and manager approval workflows."
        actions={
          <button
            onClick={() => alert('New Leave Request Modal')}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-3.5 w-3.5" /> Request Leave
          </button>
        }
      />

      <DataTable columns={columns} data={leaveList} />
    </div>
  );
};
