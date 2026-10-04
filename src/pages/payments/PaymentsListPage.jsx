import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowDownRight,
  RotateCcw,
  AlertTriangle,
  Receipt,
  Download,
  Printer,
  Calendar,
  Building,
  User,
  X,
  Check,
  FileText,
  ShieldCheck,
  Smartphone,
  Landmark,
  Banknote,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockInvoices, mockClients } from '../../data/mockData';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

export const PaymentsListPage = () => {
  const { payments, setPayments, invoices, setInvoices } = useApp();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRangeFilter, setDateRangeFilter] = useState('All Time');

  // Detail Drawer & Modals state
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // New Payment Form state
  const [newPaymentForm, setNewPaymentForm] = useState({
    invoiceId: 'INV-2026-0043',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    method: 'Bank Transfer',
    transactionRef: '',
    notes: '',
  });

  const handleOpenDrawer = (pm) => {
    setSelectedPayment(pm);
    setIsDrawerOpen(true);
  };

  const handleRecordPaymentSubmit = (e) => {
    e.preventDefault();
    const inv = mockInvoices.find((i) => i.id === newPaymentForm.invoiceId) || mockInvoices[0];
    const pAmt = parseFloat(newPaymentForm.amount) || 0;

    const newPm = {
      id: `PAY-${Math.floor(910 + Math.random() * 90)}`,
      invoiceId: inv.id,
      client: inv.clientName,
      email: inv.email || 'billing@client.com',
      amount: pAmt,
      date: newPaymentForm.date,
      method: newPaymentForm.method,
      transactionRef: newPaymentForm.transactionRef || `UTR-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Completed',
      notes: newPaymentForm.notes || 'Recorded via Finance Payments portal',
      recordedBy: 'Nikhil (Finance Lead)',
    };

    setPayments([newPm, ...payments]);

    // Update invoice status if invoices context exists
    if (setInvoices) {
      setInvoices((prev) =>
        prev.map((item) => {
          if (item.id === inv.id) {
            const updatedPaid = (item.amountPaid || 0) + pAmt;
            return {
              ...item,
              amountPaid: updatedPaid,
              status: updatedPaid >= item.amount ? 'Paid' : 'Partially Paid',
            };
          }
          return item;
        })
      );
    }

    setIsRecordModalOpen(false);
    setNewPaymentForm({
      invoiceId: 'INV-2026-0043',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      method: 'Bank Transfer',
      transactionRef: '',
      notes: '',
    });
  };

  // Payment Method badge renderer
  const getMethodBadge = (method) => {
    switch (method) {
      case 'Bank Transfer':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
            <Landmark className="h-3 w-3" /> Bank Transfer
          </span>
        );
      case 'UPI':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 border border-purple-200">
            <Smartphone className="h-3 w-3" /> UPI
          </span>
        );
      case 'Cash':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
            <Banknote className="h-3 w-3" /> Cash
          </span>
        );
      case 'Card':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CreditCard className="h-3 w-3" /> Card
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
            <Receipt className="h-3 w-3" /> {method || 'Other'}
          </span>
        );
    }
  };

  // Metrics summary calculations
  const totalReceived = useMemo(() => {
    return payments
      .filter((p) => p.status === 'Completed' || p.status === 'Success')
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [payments]);

  const thisMonthTotal = useMemo(() => {
    return payments
      .filter((p) => p.date.startsWith('2026-10') && (p.status === 'Completed' || p.status === 'Success'))
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [payments]);

  const pendingTotal = useMemo(() => {
    return payments.filter((p) => p.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
  }, [payments]);

  const refundsTotal = useMemo(() => {
    return payments.filter((p) => p.status === 'Refunded').reduce((acc, curr) => acc + curr.amount, 0);
  }, [payments]);

  // Filtering payments
  const filteredPayments = useMemo(() => {
    return payments.filter((pm) => {
      // Payment Method filter
      if (methodFilter !== 'All' && pm.method !== methodFilter) return false;

      // Status filter
      if (statusFilter !== 'All' && pm.status !== statusFilter) return false;

      // Date Range filter
      if (dateRangeFilter === 'This Month (Oct 2026)' && !pm.date.startsWith('2026-10')) return false;
      if (dateRangeFilter === 'Last Month (Sep 2026)' && !pm.date.startsWith('2026-09')) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = pm.id.toLowerCase().includes(q);
        const matchesInvoice = pm.invoiceId.toLowerCase().includes(q);
        const matchesClient = pm.client.toLowerCase().includes(q);
        const matchesRef = (pm.transactionRef || '').toLowerCase().includes(q);
        if (!matchesId && !matchesInvoice && !matchesClient && !matchesRef) return false;
      }

      return true;
    });
  }, [payments, methodFilter, statusFilter, dateRangeFilter, searchQuery]);

  const columns = [
    {
      key: 'id',
      header: 'Payment ID',
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-900 font-mono text-xs hover:text-blue-600 cursor-pointer">
            {val}
          </span>
          <span className="text-[10px] text-slate-400 block font-mono">Invoice: {row.invoiceId}</span>
        </div>
      ),
    },
    {
      key: 'client',
      header: 'Client',
      render: (val, row) => (
        <div>
          <div className="font-semibold text-slate-900 leading-tight">{val}</div>
          <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{row.email || 'billing@client.com'}</div>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (val, row) => (
        <span className={`font-bold text-sm tracking-tight ${row.status === 'Refunded' ? 'text-rose-600' : 'text-emerald-700'}`}>
          {row.status === 'Refunded' ? '-' : '+'}${val.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'method',
      header: 'Payment Method',
      render: (val) => getMethodBadge(val),
    },
    {
      key: 'date',
      header: 'Date',
      render: (val) => <span className="text-slate-700 text-xs font-medium">{val}</span>,
    },
    {
      key: 'transactionRef',
      header: 'Reference',
      render: (val) => (
        <span className="font-mono text-xs text-slate-600 truncate max-w-[150px] block" title={val}>
          {val || 'N/A'}
        </span>
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenDrawer(row);
          }}
          className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors"
        >
          Details
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <PageHeader
        title="Payments"
        subtitle="Track incoming payments and transaction history."
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Exporting audited payment ledger CSV...')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" /> Export Ledger
            </button>
            <button
              onClick={() => setIsRecordModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#0066FF] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" /> Record Payment
            </button>
          </div>
        }
      />

      {/* SUMMARY CARDS (4 Cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Received */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-emerald-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Received
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              ${totalReceived.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Lifetime Collections
            </span>
          </div>
        </div>

        {/* This Month */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              This Month
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <ArrowDownRight className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              ${thisMonthTotal.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              Oct 2026
            </span>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              ${pendingTotal.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
              Clearing Queue
            </span>
          </div>
        </div>

        {/* Refunds */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-purple-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Refunds
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
              <RotateCcw className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              ${refundsTotal.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
              Reversals
            </span>
          </div>
        </div>
      </div>

      {/* FILTER BAR & DATE RANGE SELECTOR */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search payment ID, invoice, reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Payment Method filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 font-medium hidden sm:inline">Method:</span>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="All">All Payment Methods</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 font-medium hidden sm:inline">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Refunded">Refunded</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            {/* Date Range filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 font-medium hidden sm:inline">Period:</span>
              <select
                value={dateRangeFilter}
                onChange={(e) => setDateRangeFilter(e.target.value)}
                className="h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-700 focus:border-blue-500 focus:outline-none bg-slate-50 font-medium"
              >
                <option value="All Time">All Time</option>
                <option value="This Month (Oct 2026)">This Month (Oct 2026)</option>
                <option value="Last Month (Sep 2026)">Last Month (Sep 2026)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <DataTable
        columns={columns}
        data={filteredPayments}
        onRowClick={(row) => handleOpenDrawer(row)}
      />

      {/* PAYMENT DETAIL DRAWER */}
      {isDrawerOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
          <div
            className="w-full max-w-lg bg-white shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-200 border-l border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-slate-400">{selectedPayment.id}</span>
                  <StatusBadge status={selectedPayment.status} size="xs" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">Payment Details</h2>
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
              {/* Highlight Amount Box */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 text-center space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  Amount Received
                </span>
                <div className="text-3xl font-extrabold text-emerald-700">
                  ${selectedPayment.amount.toLocaleString()} USD
                </div>
                <span className="text-[11px] text-emerald-600 block pt-1">
                  Settled on {selectedPayment.date} via {selectedPayment.method}
                </span>
              </div>

              {/* Invoice & Client Card */}
              <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                  Associated Billing Info
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Invoice Reference</span>
                    <span className="font-bold text-slate-900 font-mono mt-0.5 block">
                      {selectedPayment.invoiceId}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Client Name</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block truncate">
                      {selectedPayment.client}
                    </span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-100">
                    <span className="text-slate-400 text-[11px] block">Billing Contact Email</span>
                    <span className="font-medium text-slate-700 mt-0.5 block">{selectedPayment.email}</span>
                  </div>
                </div>
              </div>

              {/* Transaction Gateway Audit Details */}
              <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span>Transaction Audit Log</span>
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Payment Method</span>
                    {getMethodBadge(selectedPayment.method)}
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Gateway Ref / UTR</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {selectedPayment.transactionRef}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Payment Date</span>
                    <span className="font-medium text-slate-800">{selectedPayment.date}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Recorded By</span>
                    <span className="font-medium text-slate-800">{selectedPayment.recordedBy || 'Finance Manager'}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-slate-400 text-[11px] block">Notes & Memo</span>
                  <p className="mt-1 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 italic leading-relaxed">
                    "{selectedPayment.notes || 'No payment memo attached.'}"
                  </p>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-slate-200 p-4 bg-slate-50 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Printing Official Payment Receipt #${selectedPayment.id}...`)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Printer className="h-3.5 w-3.5" /> Print Receipt
                </button>
                <button
                  onClick={() => alert(`Downloading PDF Receipt for #${selectedPayment.id}...`)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" /> PDF
                </button>
              </div>

              {selectedPayment.status === 'Completed' && (
                <button
                  onClick={() => alert(`Initiated refund workflow for ${selectedPayment.id}...`)}
                  className="flex items-center gap-1.5 rounded-lg border border-rose-300 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Issue Refund
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record Incoming Payment"
        subtitle="Log a new client payment transaction."
      >
        <form onSubmit={handleRecordPaymentSubmit} className="space-y-4 pt-2 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Invoice
            </label>
            <select
              value={newPaymentForm.invoiceId}
              onChange={(e) => {
                const inv = mockInvoices.find((i) => i.id === e.target.value);
                setNewPaymentForm({
                  ...newPaymentForm,
                  invoiceId: e.target.value,
                  amount: inv ? (inv.amount - (inv.amountPaid || 0)).toString() : '',
                });
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            >
              {mockInvoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.id} — {inv.clientName} (${inv.amount.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="e.g. 12500"
              value={newPaymentForm.amount}
              onChange={(e) => setNewPaymentForm({ ...newPaymentForm, amount: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                value={newPaymentForm.date}
                onChange={(e) => setNewPaymentForm({ ...newPaymentForm, date: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Method
              </label>
              <select
                value={newPaymentForm.method}
                onChange={(e) => setNewPaymentForm({ ...newPaymentForm, method: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Transaction Reference / UTR / Check No.
            </label>
            <input
              type="text"
              placeholder="e.g. UTR-HDFC881902 or UPI-90281@okaxis"
              value={newPaymentForm.transactionRef}
              onChange={(e) => setNewPaymentForm({ ...newPaymentForm, transactionRef: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Memo / Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Advance milestone payment received..."
              value={newPaymentForm.notes}
              onChange={(e) => setNewPaymentForm({ ...newPaymentForm, notes: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsRecordModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0066FF] hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Check className="h-4 w-4" /> Save Payment Transaction
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
