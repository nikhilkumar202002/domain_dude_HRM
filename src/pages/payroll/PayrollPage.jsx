import React, { useState } from 'react';
import { DollarSign, FileText, CheckCircle2, Download, Printer } from 'lucide-react';
import { mockPayroll } from '../../data/mockData';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

export const PayrollPage = () => {
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const columns = [
    {
      key: 'employeeName',
      header: 'Employee Name',
      render: (val, row) => (
        <div>
          <div className="font-semibold text-slate-900">{val}</div>
          <div className="text-[11px] text-slate-400">Period: {row.month}</div>
        </div>
      ),
    },
    {
      key: 'baseSalary',
      header: 'Base Salary',
      align: 'right',
      render: (val) => <span className="text-slate-700">${val.toLocaleString()}</span>,
    },
    {
      key: 'bonuses',
      header: 'Bonus / Additions',
      align: 'right',
      render: (val) => <span className="font-semibold text-emerald-600">+${val.toLocaleString()}</span>,
    },
    {
      key: 'deductions',
      header: 'Deductions / Tax',
      align: 'right',
      render: (val) => <span className="text-rose-600">-${val.toLocaleString()}</span>,
    },
    {
      key: 'netPay',
      header: 'Net Payable',
      align: 'right',
      render: (val) => <span className="font-bold text-slate-900 text-sm">${val.toLocaleString()}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'actions',
      header: 'Payslip',
      sortable: false,
      align: 'right',
      render: (_, row) => (
        <button
          onClick={() => setSelectedPayslip(row)}
          className="flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          <FileText className="h-3.5 w-3.5 text-indigo-600" /> Payslip
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll & Salary Processing"
        subtitle="Manage monthly compensation, tax withholdings, bonuses, net pay calculations, and payslip generation."
        actions={
          <button
            onClick={() => alert('Payroll processing initialized for October 2026!')}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <DollarSign className="h-3.5 w-3.5" /> Run Payroll Batch
          </button>
        }
      />

      <DataTable columns={columns} data={mockPayroll} />

      {/* Payslip Modal */}
      {selectedPayslip && (
        <Modal
          isOpen={Boolean(selectedPayslip)}
          onClose={() => setSelectedPayslip(null)}
          title={`Payslip - ${selectedPayslip.employeeName}`}
          subtitle={`Pay Period: ${selectedPayslip.month}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="font-bold text-slate-900 text-sm">Domain Dude Business OS</span>
                <p className="text-slate-400">Payroll Reference: {selectedPayslip.id}</p>
              </div>
              <StatusBadge status={selectedPayslip.status} size="lg" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Base Salary</span>
                <span className="font-semibold text-slate-900">${selectedPayslip.baseSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Performance Bonus</span>
                <span className="font-semibold text-emerald-600">+${selectedPayslip.bonuses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tax & Benefits Deductions</span>
                <span className="font-semibold text-rose-600">-${selectedPayslip.deductions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-sm">
                <span className="font-bold text-slate-900">Total Net Amount</span>
                <span className="font-bold text-indigo-600">${selectedPayslip.netPay.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => alert('Printing payslip...')}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-50"
              >
                <Printer className="h-3.5 w-3.5" /> Print
              </button>
              <button
                onClick={() => alert('Downloading PDF payslip...')}
                className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 font-semibold text-white hover:bg-indigo-700"
              >
                <Download className="h-3.5 w-3.5" /> Download PDF
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
