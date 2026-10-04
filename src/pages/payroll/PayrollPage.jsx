import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  FileText,
  CheckCircle2,
  Download,
  Printer,
  ShieldCheck,
  Lock,
  Clock,
  TrendingUp,
  AlertCircle,
  Building,
  User,
  Search,
  Check,
  X,
  CreditCard,
  Send,
  Eye,
  Award,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { mockPayroll } from '../../data/mockData';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

export const PayrollPage = () => {
  const [payrollList, setPayrollList] = useState(mockPayroll);
  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [activeTab, setActiveTab] = useState('All Payrolls');
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer and Payslip modal states
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);

  // Status handlers
  const handleApprove = (id, e) => {
    if (e) e.stopPropagation();
    setPayrollList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Approved' } : p))
    );
    if (selectedPayroll && selectedPayroll.id === id) {
      setSelectedPayroll((prev) => ({ ...prev, status: 'Approved' }));
    }
  };

  const handleProcess = (id, e) => {
    if (e) e.stopPropagation();
    setPayrollList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Processed' } : p))
    );
    if (selectedPayroll && selectedPayroll.id === id) {
      setSelectedPayroll((prev) => ({ ...prev, status: 'Processed' }));
    }
  };

  const handleMarkAsPaid = (id, e) => {
    if (e) e.stopPropagation();
    setPayrollList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Paid', paymentDate: new Date().toISOString().split('T')[0] } : p))
    );
    if (selectedPayroll && selectedPayroll.id === id) {
      setSelectedPayroll((prev) => ({ ...prev, status: 'Paid', paymentDate: new Date().toISOString().split('T')[0] }));
    }
  };

  const handleOpenDrawer = (item) => {
    setSelectedPayroll(item);
    setIsDrawerOpen(true);
  };

  const handleOpenPayslip = (item, e) => {
    if (e) e.stopPropagation();
    setSelectedPayslip(item);
  };

  // Metrics summary
  const totalPayroll = useMemo(() => {
    return payrollList.reduce((acc, curr) => acc + curr.netPay, 0);
  }, [payrollList]);

  const processedAmount = useMemo(() => {
    return payrollList
      .filter((p) => p.status === 'Processed' || p.status === 'Paid')
      .reduce((acc, curr) => acc + curr.netPay, 0);
  }, [payrollList]);

  const pendingAmount = useMemo(() => {
    return payrollList
      .filter((p) => p.status === 'Draft' || p.status === 'Pending Approval' || p.status === 'Approved')
      .reduce((acc, curr) => acc + curr.netPay, 0);
  }, [payrollList]);

  const totalOvertime = useMemo(() => {
    return payrollList.reduce((acc, curr) => acc + (curr.overtimePay || 0), 0);
  }, [payrollList]);

  const totalBonuses = useMemo(() => {
    return payrollList.reduce((acc, curr) => acc + (curr.bonuses || 0), 0);
  }, [payrollList]);

  // Tab & search filtering
  const filteredPayrolls = useMemo(() => {
    return payrollList.filter((item) => {
      // Tab filtering
      if (activeTab === 'Draft' && item.status !== 'Draft') return false;
      if (activeTab === 'Pending Approval' && item.status !== 'Pending Approval') return false;
      if (activeTab === 'Approved' && item.status !== 'Approved') return false;
      if (activeTab === 'Processed' && item.status !== 'Processed') return false;
      if (activeTab === 'Paid' && item.status !== 'Paid') return false;

      // Search filtering
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.employeeName.toLowerCase().includes(query);
        const matchesEmpId = item.empId.toLowerCase().includes(query);
        const matchesDept = item.department.toLowerCase().includes(query);
        if (!matchesName && !matchesEmpId && !matchesDept) return false;
      }

      return true;
    });
  }, [payrollList, activeTab, searchQuery]);

  const columns = [
    {
      key: 'employeeName',
      header: 'Employee',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar}
            alt={row.employeeName}
            className="h-9 w-9 rounded-full object-cover border border-slate-200 shadow-xs"
          />
          <div>
            <div className="font-semibold text-slate-900 leading-tight">{row.employeeName}</div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span>{row.role}</span>
              <span>•</span>
              <span className="font-mono text-slate-400">{row.empId}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'baseSalary',
      header: 'Basic Salary',
      align: 'right',
      render: (val) => (
        <span className="font-medium text-slate-800">${val.toLocaleString()}</span>
      ),
    },
    {
      key: 'workingDays',
      header: 'Working Days',
      align: 'center',
      render: (val, row) => (
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
          {val} / {row.totalDays || 22} Days
        </span>
      ),
    },
    {
      key: 'regularHours',
      header: 'Hours',
      align: 'center',
      render: (val) => <span className="text-slate-600 text-xs font-medium">{val} hrs</span>,
    },
    {
      key: 'overtimePay',
      header: 'Overtime',
      align: 'right',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-emerald-700">+${val.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 block">{row.overtimeHours} hrs</span>
        </div>
      ),
    },
    {
      key: 'bonuses',
      header: 'Bonus',
      align: 'right',
      render: (val) => (
        <span className="font-semibold text-indigo-600">+${val.toLocaleString()}</span>
      ),
    },
    {
      key: 'totalDeductions',
      header: 'Deductions',
      align: 'right',
      render: (val) => (
        <span className="font-medium text-rose-600">-${val.toLocaleString()}</span>
      ),
    },
    {
      key: 'netPay',
      header: 'Net Salary',
      align: 'right',
      render: (val) => (
        <span className="font-bold text-slate-900 text-sm tracking-tight">${val.toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val} size="xs" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleOpenDrawer(row)}
            className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Review
          </button>
          <button
            onClick={(e) => handleOpenPayslip(row, e)}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <FileText className="h-3.5 w-3.5 text-blue-600" /> Payslip
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* SECURITY CONFIDENTIALITY BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl bg-slate-900 text-white p-4 shadow-sm border border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider uppercase text-blue-400">
                Encrypted Payroll Portal
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                AES-256 Secured
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Confidential financial information. Access is restricted to authorized HR & Finance Executives.
            </p>
          </div>
        </div>

        {/* Audit Log pill */}
        <div className="flex items-center gap-2 self-start sm:self-center text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Audit Log Active</span>
        </div>
      </div>

      {/* PAGE HEADER */}
      <PageHeader
        title="Payroll"
        subtitle="Manage salaries, overtime, bonuses and payroll processing."
        actions={
          <div className="flex items-center gap-3">
            {/* Month selector */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-2xs">
              <span className="text-xs font-semibold text-slate-700">{selectedMonth}</span>
            </div>

            <button
              onClick={() => setIsRunModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <DollarSign className="h-4 w-4" /> Run Payroll Batch
            </button>
          </div>
        }
      />

      {/* SUMMARY CARDS (5 Cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Total Payroll */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Payroll
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              ${totalPayroll.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">Oct 2026 Commitment</span>
          </div>
        </div>

        {/* Processed */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-emerald-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Processed
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              ${processedAmount.toLocaleString()}
            </span>
            <span className="text-[11px] text-emerald-600 font-medium block mt-1">Completed Payouts</span>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              ${pendingAmount.toLocaleString()}
            </span>
            <span className="text-[11px] text-amber-600 font-medium block mt-1">Awaiting Approval</span>
          </div>
        </div>

        {/* Overtime */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-purple-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Overtime
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              +${totalOvertime.toLocaleString()}
            </span>
            <span className="text-[11px] text-purple-600 font-medium block mt-1">86 Total OT Hours</span>
          </div>
        </div>

        {/* Bonuses */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-indigo-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Bonuses
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              +${totalBonuses.toLocaleString()}
            </span>
            <span className="text-[11px] text-indigo-600 font-medium block mt-1">Incentives Disbursed</span>
          </div>
        </div>
      </div>

      {/* FILTER TABS & SEARCH BAR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {['All Payrolls', 'Draft', 'Pending Approval', 'Approved', 'Processed', 'Paid'].map((tab) => {
            const isActive = activeTab === tab;
            let count = 0;
            if (tab === 'All Payrolls') count = payrollList.length;
            else count = payrollList.filter((p) => p.status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0066FF] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee, ID, dept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-60 rounded-lg border border-slate-200 pl-9 pr-3 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* DATA TABLE */}
      <DataTable
        columns={columns}
        data={filteredPayrolls}
        onRowClick={(row) => handleOpenDrawer(row)}
      />

      {/* PAYROLL DETAIL DRAWER */}
      {isDrawerOpen && selectedPayroll && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
          <div
            className="w-full max-w-lg bg-white shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-200 border-l border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">{selectedPayroll.id}</span>
                  <StatusBadge status={selectedPayroll.status} size="xs" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">Payroll Breakdown</h2>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Employee Info Header */}
              <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <img
                  src={selectedPayroll.avatar}
                  alt={selectedPayroll.employeeName}
                  className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedPayroll.employeeName}</h3>
                  <p className="text-xs font-medium text-slate-600">{selectedPayroll.role}</p>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                    <span>{selectedPayroll.department}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-500">ID: {selectedPayroll.empId}</span>
                  </div>
                </div>
              </div>

              {/* Bank & Tax Credentials */}
              <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-blue-600" /> Disbursement Credentials
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Bank Name</span>
                    <span className="font-semibold text-slate-800">{selectedPayroll.bankName || 'HDFC Bank'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Account Number</span>
                    <span className="font-mono font-semibold text-slate-800">{selectedPayroll.accountNo || '•••• •••• 4912'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Tax ID / PAN</span>
                    <span className="font-mono font-semibold text-slate-800">{selectedPayroll.taxId || 'PAN-ALX99201'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Pay Period</span>
                    <span className="font-semibold text-slate-800">{selectedPayroll.month}</span>
                  </div>
                </div>
              </div>

              {/* Attendance & Hours Summary */}
              <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-blue-600" /> Attendance & Hours Log
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Working Days</span>
                    <span className="font-bold text-slate-900 text-sm block mt-0.5">
                      {selectedPayroll.workingDays} / {selectedPayroll.totalDays || 22}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Regular Hours</span>
                    <span className="font-bold text-slate-900 text-sm block mt-0.5">
                      {selectedPayroll.regularHours} hrs
                    </span>
                  </div>
                  <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 font-semibold block">Overtime</span>
                    <span className="font-bold text-emerald-800 text-sm block mt-0.5">
                      {selectedPayroll.overtimeHours} hrs (+${selectedPayroll.overtimePay})
                    </span>
                  </div>
                </div>
              </div>

              {/* Earnings & Deductions Breakdown */}
              <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                  Salary Structure & Compensation
                </h4>

                <div className="space-y-2 text-xs">
                  {/* Earnings */}
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Basic Base Salary</span>
                    <span className="font-medium text-slate-900">${selectedPayroll.baseSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">House Rent Allowance (HRA)</span>
                    <span className="font-medium text-slate-900">${(selectedPayroll.hra || 3000).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Overtime Compensation</span>
                    <span className="font-semibold text-emerald-600">+${(selectedPayroll.overtimePay || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Performance Bonus</span>
                    <span className="font-semibold text-indigo-600">+${(selectedPayroll.bonuses || 0).toLocaleString()}</span>
                  </div>

                  {/* Deductions */}
                  <div className="flex justify-between py-1 border-b border-slate-100 text-rose-700">
                    <span>Income Tax (TDS)</span>
                    <span>-${(selectedPayroll.taxDeduction || 1800).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 text-rose-700">
                    <span>Provident Fund (PF / 401k)</span>
                    <span>-${(selectedPayroll.pfDeduction || 900).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 text-rose-700">
                    <span>Medical Insurance</span>
                    <span>-${(selectedPayroll.insuranceDeduction || 400).toLocaleString()}</span>
                  </div>
                </div>

                {/* Net Pay Final Box */}
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3.5 mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block">
                      Net Payable Amount
                    </span>
                    <span className="text-[11px] text-blue-700">Calculated after taxes and benefits</span>
                  </div>
                  <span className="text-xl font-extrabold text-[#0066FF]">
                    ${selectedPayroll.netPay.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="border-t border-slate-200 p-4 bg-slate-50 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedPayslip(selectedPayroll)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
              >
                <FileText className="h-4 w-4 text-blue-600" /> Payslip Preview
              </button>

              <div className="flex items-center gap-2">
                {selectedPayroll.status === 'Draft' && (
                  <button
                    onClick={() => handleApprove(selectedPayroll.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-700 transition-colors"
                  >
                    Submit for Approval
                  </button>
                )}
                {(selectedPayroll.status === 'Pending Approval' || selectedPayroll.status === 'Draft') && (
                  <button
                    onClick={() => handleApprove(selectedPayroll.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors"
                  >
                    <Check className="h-4 w-4" /> Approve Payroll
                  </button>
                )}
                {selectedPayroll.status === 'Approved' && (
                  <button
                    onClick={() => handleProcess(selectedPayroll.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition-colors"
                  >
                    <Send className="h-4 w-4" /> Process Payout
                  </button>
                )}
                {selectedPayroll.status === 'Processed' && (
                  <button
                    onClick={() => handleMarkAsPaid(selectedPayroll.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Mark as Paid
                  </button>
                )}
                {selectedPayroll.status === 'Paid' && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="h-4 w-4" /> Disbursed
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL PAYSLIP PREVIEW MODAL */}
      {selectedPayslip && (
        <Modal
          isOpen={Boolean(selectedPayslip)}
          onClose={() => setSelectedPayslip(null)}
          title={`Salary Slip — ${selectedPayslip.employeeName}`}
          subtitle={`Official Payslip for ${selectedPayslip.month}`}
        >
          <div className="space-y-5 text-xs text-slate-800 pt-2">
            {/* Official Payslip Header */}
            <div className="rounded-xl border border-slate-200 bg-slate-900 text-white p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">DOMAIN DUDE BUSINESS OS</h3>
                  <p className="text-[11px] text-slate-400">100 Tech Boulevard, Suite 400 • HR Finance Dept</p>
                </div>
                <div className="text-right">
                  <span className="inline-block rounded-md bg-blue-600/30 px-2.5 py-1 text-xs font-mono font-bold text-blue-400 border border-blue-500/30">
                    PAYSLIP #{selectedPayslip.id}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">Issued: Oct 31, 2026</span>
                </div>
              </div>

              {/* Employee & Bank Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1 text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Employee Name</span>
                  <span className="font-bold text-white block">{selectedPayslip.employeeName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Employee ID</span>
                  <span className="font-mono text-white block">{selectedPayslip.empId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Designation</span>
                  <span className="text-white block truncate">{selectedPayslip.role}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Bank Account</span>
                  <span className="font-mono text-white block">{selectedPayslip.accountNo || '•••• 4912'}</span>
                </div>
              </div>
            </div>

            {/* Attendance Summary Bar */}
            <div className="flex items-center justify-between rounded-lg bg-slate-100 p-3 border border-slate-200 text-xs font-medium">
              <span>Pay Period: <strong>{selectedPayslip.month}</strong></span>
              <span>Working Days: <strong>{selectedPayslip.workingDays} Days</strong></span>
              <span>Regular Hours: <strong>{selectedPayslip.regularHours} hrs</strong></span>
              <span>Overtime Hours: <strong>{selectedPayslip.overtimeHours} hrs</strong></span>
            </div>

            {/* Earnings vs Deductions Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Earnings Column */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-100 px-3.5 py-2 font-bold text-slate-800 border-b border-slate-200 flex justify-between">
                  <span>Earnings</span>
                  <span>Amount ($)</span>
                </div>
                <div className="p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Basic Salary</span>
                    <span className="font-medium text-slate-900">${selectedPayslip.baseSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">House Rent Allowance (HRA)</span>
                    <span className="font-medium text-slate-900">${(selectedPayslip.hra || 3000).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Overtime Pay</span>
                    <span className="font-medium text-emerald-600">+${(selectedPayslip.overtimePay || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Performance Bonus</span>
                    <span className="font-medium text-indigo-600">+${(selectedPayslip.bonuses || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
                    <span>Total Gross Earnings</span>
                    <span>${(selectedPayslip.baseSalary + (selectedPayslip.hra || 3000) + (selectedPayslip.overtimePay || 0) + (selectedPayslip.bonuses || 0)).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Deductions Column */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-100 px-3.5 py-2 font-bold text-slate-800 border-b border-slate-200 flex justify-between">
                  <span>Deductions</span>
                  <span>Amount ($)</span>
                </div>
                <div className="p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between text-rose-700">
                    <span>Income Tax (TDS)</span>
                    <span>-${(selectedPayslip.taxDeduction || 1800).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-rose-700">
                    <span>Provident Fund (PF)</span>
                    <span>-${(selectedPayslip.pfDeduction || 900).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-rose-700">
                    <span>Medical Insurance</span>
                    <span>-${(selectedPayslip.insuranceDeduction || 400).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 italic">
                    <span>Other Retainage</span>
                    <span>-$0.00</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-rose-700">
                    <span>Total Deductions</span>
                    <span>-${(selectedPayslip.totalDeductions || 3100).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary Highlight Box */}
            <div className="rounded-xl bg-[#0066FF] text-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-md">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-200 block">
                  Net Payable Amount
                </span>
                <span className="text-xs text-blue-100 font-serif italic mt-0.5 block">
                  Amount in words: ${selectedPayslip.netPay.toLocaleString()} USD Net Disbursed
                </span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                ${selectedPayslip.netPay.toLocaleString()}
              </span>
            </div>

            {/* Authorized Signatory Footer Stamp */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5 text-slate-600">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>System Verified & Digitally Signed by Finance Officer</span>
              </div>

              <div className="text-right">
                <div className="font-semibold text-slate-800 font-mono">FIN-AUTH-90218</div>
                <div className="text-[10px] text-slate-400">Computer Generated Salary Slip</div>
              </div>
            </div>

            {/* Print & Download Buttons */}
            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => alert('Printing payslip...')}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Printer className="h-4 w-4" /> Print Payslip
              </button>
              <button
                onClick={() => alert('Downloading official PDF payslip...')}
                className="flex items-center gap-1.5 rounded-lg bg-[#0066FF] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Download className="h-4 w-4" /> Download PDF
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* RUN PAYROLL MODAL */}
      <Modal
        isOpen={isRunModalOpen}
        onClose={() => setIsRunModalOpen(false)}
        title="Run Payroll Batch"
        subtitle="Initialize monthly compensation processing for October 2026."
      >
        <div className="space-y-4 pt-2 text-xs">
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-blue-900 leading-relaxed">
            <p className="font-semibold flex items-center gap-1.5">
              <Building className="h-4 w-4 text-blue-600" /> Batch Processing Confirmation
            </p>
            <p className="mt-1 text-[11px] text-blue-800">
              You are about to run payroll calculations for <strong>8 active employees</strong> for October 2026.
              This will automatically sync attendance hours, calculate overtime rates, and compute tax deductions.
            </p>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Pay Period</span>
              <span className="font-semibold text-slate-900">October 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Employees</span>
              <span className="font-semibold text-slate-900">8 Members</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estimated Total Commitment</span>
              <span className="font-bold text-[#0066FF]">${totalPayroll.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              onClick={() => setIsRunModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                alert('Payroll batch for October 2026 initiated successfully!');
                setIsRunModalOpen(false);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0066FF] hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <DollarSign className="h-4 w-4" /> Start Payroll Run
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
