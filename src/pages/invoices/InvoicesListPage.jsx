import React, { useState, useMemo } from 'react';
import {
  Plus,
  Eye,
  Receipt,
  Download,
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  Send,
  Printer,
  DollarSign,
  Building,
  User,
  Calendar,
  X,
  Check,
  Percent,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockClients, mockProjects } from '../../data/mockData';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

export const InvoicesListPage = () => {
  const { invoices, setInvoices } = useApp();

  // Filters state
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [clientFilter, setClientFilter] = useState('All');
  const [projectFilter, setProjectFilter] = useState('All');

  // Detail Drawer & Modals state
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Record Payment Form state
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    method: 'Bank Wire',
    transactionRef: '',
    notes: '',
  });

  // Create Invoice Form state
  const [createForm, setCreateForm] = useState({
    clientId: 'CLI-101',
    project: 'Quantum Portal v2 Redesign',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '2026-11-15',
    discount: 0,
    taxRate: 18,
    lineItems: [{ id: 1, description: 'UX & Software Development', qty: 1, rate: 10000 }],
  });

  // Handle drawer open
  const handleOpenDrawer = (inv) => {
    setSelectedInvoice(inv);
    setIsDrawerOpen(true);
  };

  // Quick Action: Mark Paid
  const handleMarkAsPaid = (id, e) => {
    if (e) e.stopPropagation();
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          const totalAmt = inv.amount;
          return {
            ...inv,
            status: 'Paid',
            amountPaid: totalAmt,
            paymentHistory: [
              ...(inv.paymentHistory || []),
              {
                id: `PM-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                amount: totalAmt - (inv.amountPaid || 0),
                method: 'Direct Full Settlement',
                transactionRef: `SETTLE-${Math.floor(100000 + Math.random() * 900000)}`,
                notes: 'Marked as paid by Finance Officer',
              },
            ],
          };
        }
        return inv;
      })
    );

    if (selectedInvoice && selectedInvoice.id === id) {
      setSelectedInvoice((prev) => ({
        ...prev,
        status: 'Paid',
        amountPaid: prev.amount,
      }));
    }
  };

  // Quick Action: Send Invoice
  const handleSendInvoice = (id, e) => {
    if (e) e.stopPropagation();
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id && inv.status === 'Draft' ? { ...inv, status: 'Sent' } : inv))
    );
    if (selectedInvoice && selectedInvoice.id === id) {
      setSelectedInvoice((prev) => ({ ...prev, status: 'Sent' }));
    }
    alert(`Invoice ${id} sent to client email successfully!`);
  };

  // Handle Record Payment submission
  const handleRecordPaymentSubmit = (e) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    const pAmt = parseFloat(paymentForm.amount) || 0;
    const currentPaid = selectedInvoice.amountPaid || 0;
    const newPaid = currentPaid + pAmt;
    const totalAmt = selectedInvoice.amount;

    let newStatus = selectedInvoice.status;
    if (newPaid >= totalAmt) {
      newStatus = 'Paid';
    } else if (newPaid > 0) {
      newStatus = 'Partially Paid';
    }

    const newPaymentLog = {
      id: `PM-${Date.now()}`,
      date: paymentForm.date,
      amount: pAmt,
      method: paymentForm.method,
      transactionRef: paymentForm.transactionRef || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: paymentForm.notes || 'Payment recorded via portal',
    };

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === selectedInvoice.id) {
          return {
            ...inv,
            amountPaid: newPaid,
            status: newStatus,
            paymentHistory: [...(inv.paymentHistory || []), newPaymentLog],
          };
        }
        return inv;
      })
    );

    setSelectedInvoice((prev) => ({
      ...prev,
      amountPaid: newPaid,
      status: newStatus,
      paymentHistory: [...(prev.paymentHistory || []), newPaymentLog],
    }));

    setIsRecordPaymentOpen(false);
    setPaymentForm({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      method: 'Bank Wire',
      transactionRef: '',
      notes: '',
    });
  };

  // Handle Create Invoice submission
  const handleCreateInvoiceSubmit = (e) => {
    e.preventDefault();
    const clientObj = mockClients.find((c) => c.id === createForm.clientId) || mockClients[0];

    const subtotal = createForm.lineItems.reduce((acc, item) => acc + item.qty * item.rate, 0);
    const afterDiscount = subtotal - (parseFloat(createForm.discount) || 0);
    const taxAmt = Math.round(afterDiscount * ((parseFloat(createForm.taxRate) || 0) / 100));
    const grandTotal = afterDiscount + taxAmt;

    const newInv = {
      id: `INV-2026-00${Math.floor(48 + Math.random() * 50)}`,
      clientId: clientObj.id,
      clientName: clientObj.name,
      billingAddress: clientObj.location || '100 Business Way, San Francisco, CA',
      email: clientObj.email,
      phone: clientObj.phone,
      taxId: 'US-EIN-9028190',
      project: createForm.project,
      issueDate: createForm.issueDate,
      dueDate: createForm.dueDate,
      status: 'Sent',
      paymentMethod: 'Pending',
      subtotal: subtotal,
      discount: parseFloat(createForm.discount) || 0,
      tax: taxAmt,
      amount: grandTotal,
      amountPaid: 0,
      lineItems: createForm.lineItems.map((item, idx) => ({
        id: idx + 1,
        description: item.description,
        qty: item.qty,
        rate: item.rate,
        amount: item.qty * item.rate,
      })),
      paymentHistory: [],
    };

    setInvoices([newInv, ...invoices]);
    setIsCreateModalOpen(false);
  };

  // Add/remove line item in creation modal
  const addLineItem = () => {
    setCreateForm((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, { id: Date.now(), description: '', qty: 1, rate: 1000 }],
    }));
  };

  const removeLineItem = (idx) => {
    if (createForm.lineItems.length === 1) return;
    setCreateForm((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== idx),
    }));
  };

  const updateLineItem = (idx, field, val) => {
    setCreateForm((prev) => {
      const updated = [...prev.lineItems];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, lineItems: updated };
    });
  };

  // Metrics summary
  const totalInvoiced = useMemo(() => invoices.reduce((acc, curr) => acc + curr.amount, 0), [invoices]);
  const paidTotal = useMemo(
    () => invoices.reduce((acc, curr) => acc + (curr.amountPaid || (curr.status === 'Paid' ? curr.amount : 0)), 0),
    [invoices]
  );
  const pendingTotal = useMemo(
    () =>
      invoices
        .filter((i) => i.status === 'Sent' || i.status === 'Draft' || i.status === 'Partially Paid')
        .reduce((acc, curr) => acc + (curr.amount - (curr.amountPaid || 0)), 0),
    [invoices]
  );
  const overdueTotal = useMemo(
    () => invoices.filter((i) => i.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0),
    [invoices]
  );

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      // Tab filter
      if (activeTab !== 'All' && inv.status !== activeTab) return false;

      // Client filter
      if (clientFilter !== 'All' && inv.clientName !== clientFilter) return false;

      // Project filter
      if (projectFilter !== 'All' && inv.project !== projectFilter) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = inv.id.toLowerCase().includes(q);
        const matchesClient = inv.clientName.toLowerCase().includes(q);
        const matchesProject = inv.project.toLowerCase().includes(q);
        if (!matchesId && !matchesClient && !matchesProject) return false;
      }

      return true;
    });
  }, [invoices, activeTab, clientFilter, projectFilter, searchQuery]);

  const columns = [
    {
      key: 'id',
      header: 'Invoice Number',
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-900 font-mono text-xs hover:text-blue-600 cursor-pointer">
            {val}
          </span>
          <span className="text-[10px] text-slate-400 block">Issued {row.issueDate}</span>
        </div>
      ),
    },
    {
      key: 'clientName',
      header: 'Client',
      render: (val, row) => (
        <div>
          <div className="font-semibold text-slate-900 leading-tight">{val}</div>
          <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{row.email || 'billing@client.com'}</div>
        </div>
      ),
    },
    {
      key: 'project',
      header: 'Project',
      render: (val) => (
        <span className="text-slate-700 text-xs font-medium truncate max-w-[200px] block" title={val}>
          {val}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (val, row) => (
        <div>
          <span className="font-bold text-slate-900 text-sm">${val.toLocaleString()}</span>
          {row.amountPaid > 0 && row.amountPaid < val && (
            <span className="text-[10px] text-emerald-600 block">
              ${row.amountPaid.toLocaleString()} paid
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'issueDate',
      header: 'Issue Date',
      render: (val) => <span className="text-slate-700 text-xs">{val}</span>,
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (val, row) => (
        <span className={`text-xs font-medium ${row.status === 'Overdue' ? 'text-rose-600 font-semibold' : 'text-slate-700'}`}>
          {val}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <StatusBadge status={val} size="xs" />,
    },
    {
      key: 'paymentMethod',
      header: 'Payment',
      render: (val, row) => (
        <span className="text-slate-500 text-xs">
          {row.status === 'Paid' ? (
            <span className="text-emerald-700 font-medium">{val || 'Wire Transfer'}</span>
          ) : row.status === 'Partially Paid' ? (
            <span className="text-amber-700 font-medium">Partial Settlement</span>
          ) : (
            <span className="text-slate-400">Unpaid</span>
          )}
        </span>
      ),
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
            Preview
          </button>
          {row.status !== 'Paid' && row.status !== 'Cancelled' && (
            <button
              onClick={() => {
                setSelectedInvoice(row);
                setPaymentForm({
                  amount: (row.amount - (row.amountPaid || 0)).toString(),
                  date: new Date().toISOString().split('T')[0],
                  method: 'Bank Wire',
                  transactionRef: '',
                  notes: '',
                });
                setIsRecordPaymentOpen(true);
              }}
              className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200"
            >
              <CreditCard className="h-3.5 w-3.5" /> Pay
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <PageHeader
        title="Invoices"
        subtitle="Manage billing, invoices and payment status."
        actions={
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#0066FF] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" /> Create Invoice
          </button>
        }
      />

      {/* SUMMARY CARDS (4 Cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Invoiced */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Invoiced
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Receipt className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              ${totalInvoiced.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {invoices.length} Bills
            </span>
          </div>
        </div>

        {/* Paid */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-emerald-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Paid
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              ${paidTotal.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Collected
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
              Receivables
            </span>
          </div>
        </div>

        {/* Overdue */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-rose-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Overdue
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              ${overdueTotal.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
              Action Req.
            </span>
          </div>
        </div>
      </div>

      {/* FILTER BAR & TABS */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {['All', 'Draft', 'Sent', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled'].map((tab) => {
            const isActive = activeTab === tab;
            let count = 0;
            if (tab === 'All') count = invoices.length;
            else count = invoices.filter((i) => i.status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
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

        {/* Search & Secondary Dropdown Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoice number, client name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Client Filter */}
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="All">All Clients</option>
              {Array.from(new Set(invoices.map((i) => i.clientName))).map((cli) => (
                <option key={cli} value={cli}>
                  {cli}
                </option>
              ))}
            </select>

            {/* Project Filter */}
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="All">All Projects</option>
              {Array.from(new Set(invoices.map((i) => i.project))).map((prj) => (
                <option key={prj} value={prj}>
                  {prj}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <DataTable
        columns={columns}
        data={filteredInvoices}
        onRowClick={(row) => handleOpenDrawer(row)}
      />

      {/* INVOICE DETAIL DRAWER */}
      {isDrawerOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
          <div
            className="w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-200 border-l border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-extrabold text-slate-900">{selectedInvoice.id}</span>
                  <StatusBadge status={selectedInvoice.status} size="xs" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Project: {selectedInvoice.project}</p>
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
              {/* Client & Billing Info Card */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Billed To</span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedInvoice.clientName}</h3>
                    <p className="text-xs text-slate-600 mt-1 max-w-sm leading-relaxed">{selectedInvoice.billingAddress}</p>
                  </div>
                  <div className="text-right text-xs space-y-1">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Issue Date</span>
                      <span className="font-semibold text-slate-800">{selectedInvoice.issueDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Due Date</span>
                      <span className={`font-semibold ${selectedInvoice.status === 'Overdue' ? 'text-rose-600' : 'text-slate-800'}`}>
                        {selectedInvoice.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-400" /> {selectedInvoice.email}
                  </span>
                  <span className="font-mono text-slate-500">Tax ID: {selectedInvoice.taxId || 'US-EIN-9872104'}</span>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                <div className="bg-slate-100 px-4 py-2.5 font-bold text-slate-800 text-xs border-b border-slate-200 grid grid-cols-12 gap-2">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2 text-center">Qty / Hrs</div>
                  <div className="col-span-2 text-right">Rate ($)</div>
                  <div className="col-span-2 text-right">Amount ($)</div>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {selectedInvoice.lineItems && selectedInvoice.lineItems.length > 0 ? (
                    selectedInvoice.lineItems.map((item) => (
                      <div key={item.id} className="px-4 py-3 grid grid-cols-12 gap-2 items-center text-slate-800">
                        <div className="col-span-6 font-medium text-slate-900">{item.description}</div>
                        <div className="col-span-2 text-center text-slate-600">{item.qty}</div>
                        <div className="col-span-2 text-right text-slate-600">${item.rate.toLocaleString()}</div>
                        <div className="col-span-2 text-right font-semibold text-slate-900">${item.amount.toLocaleString()}</div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-slate-500 italic">Core project development milestone billing.</div>
                  )}
                </div>

                {/* Subtotal & Totals Box */}
                <div className="bg-slate-50/80 p-4 border-t border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">${(selectedInvoice.subtotal || selectedInvoice.amount * 0.85).toLocaleString()}</span>
                  </div>
                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount</span>
                      <span>-${selectedInvoice.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Tax (GST / VAT)</span>
                    <span>+${(selectedInvoice.tax || selectedInvoice.amount * 0.15).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                    <span>Grand Total</span>
                    <span className="text-[#0066FF] text-base">${selectedInvoice.amount.toLocaleString()}</span>
                  </div>

                  {selectedInvoice.amountPaid > 0 && (
                    <div className="flex justify-between text-xs font-semibold text-emerald-700 pt-1">
                      <span>Amount Paid to Date</span>
                      <span>-${selectedInvoice.amountPaid.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs font-bold text-slate-900 pt-1 border-t border-slate-200">
                    <span>Balance Due</span>
                    <span className={selectedInvoice.amount - (selectedInvoice.amountPaid || 0) > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                      ${(selectedInvoice.amount - (selectedInvoice.amountPaid || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment History Log */}
              <div className="rounded-xl border border-slate-200 p-4 bg-white space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Receipt className="h-4 w-4 text-blue-600" /> Payment History
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {selectedInvoice.paymentHistory ? selectedInvoice.paymentHistory.length : 0} Payments
                  </span>
                </h4>

                {selectedInvoice.paymentHistory && selectedInvoice.paymentHistory.length > 0 ? (
                  <div className="space-y-2">
                    {selectedInvoice.paymentHistory.map((pm) => (
                      <div
                        key={pm.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-2">
                            <span>{pm.method}</span>
                            <span className="font-mono text-[10px] text-slate-400">Ref: {pm.transactionRef}</span>
                          </div>
                          <span className="text-[11px] text-slate-500 block mt-0.5">{pm.date} • {pm.notes}</span>
                        </div>
                        <span className="font-bold text-emerald-600 text-sm">+${pm.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100 text-xs text-amber-800 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span>No payments recorded yet for this invoice.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="border-t border-slate-200 p-4 bg-slate-50 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Printing Invoice #${selectedInvoice.id}...`)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Printer className="h-3.5 w-3.5" /> Print
                </button>
                <button
                  onClick={() => alert(`Downloading PDF for Invoice #${selectedInvoice.id}...`)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" /> PDF
                </button>
              </div>

              <div className="flex items-center gap-2">
                {selectedInvoice.status === 'Draft' && (
                  <button
                    onClick={(e) => handleSendInvoice(selectedInvoice.id, e)}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    <Send className="h-3.5 w-3.5" /> Send Invoice
                  </button>
                )}

                {selectedInvoice.status !== 'Paid' && selectedInvoice.status !== 'Cancelled' && (
                  <>
                    <button
                      onClick={() => {
                        setPaymentForm({
                          amount: (selectedInvoice.amount - (selectedInvoice.amountPaid || 0)).toString(),
                          date: new Date().toISOString().split('T')[0],
                          method: 'Bank Wire',
                          transactionRef: '',
                          notes: '',
                        });
                        setIsRecordPaymentOpen(true);
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      <CreditCard className="h-3.5 w-3.5" /> Record Payment
                    </button>
                    <button
                      onClick={(e) => handleMarkAsPaid(selectedInvoice.id, e)}
                      className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                    >
                      <Check className="h-3.5 w-3.5" /> Mark Paid
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {isRecordPaymentOpen && selectedInvoice && (
        <Modal
          isOpen={isRecordPaymentOpen}
          onClose={() => setIsRecordPaymentOpen(false)}
          title={`Record Payment — ${selectedInvoice.id}`}
          subtitle={`Client: ${selectedInvoice.clientName}`}
        >
          <form onSubmit={handleRecordPaymentSubmit} className="space-y-4 pt-2 text-xs">
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-blue-900 flex justify-between items-center">
              <div>
                <span className="text-[11px] text-blue-700 block">Remaining Invoice Balance</span>
                <span className="text-lg font-bold text-[#0066FF]">
                  ${(selectedInvoice.amount - (selectedInvoice.amountPaid || 0)).toLocaleString()}
                </span>
              </div>
              <StatusBadge status={selectedInvoice.status} size="xs" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
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
                  value={paymentForm.date}
                  onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentForm.method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Bank Wire">Bank Wire</option>
                  <option value="ACH Transfer">ACH Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Check">Check</option>
                  <option value="Stripe Direct">Stripe Direct</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Transaction Reference / Check No.
              </label>
              <input
                type="text"
                placeholder="e.g. TXN-889021 or ACH-77123"
                value={paymentForm.transactionRef}
                onChange={(e) => setPaymentForm({ ...paymentForm, transactionRef: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Notes / Memo
              </label>
              <input
                type="text"
                placeholder="e.g. Milestone 2 payment received..."
                value={paymentForm.notes}
                onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsRecordPaymentOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Check className="h-4 w-4" /> Save Payment Log
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* CREATE INVOICE MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Invoice"
        subtitle="Generate a professional client billing invoice."
      >
        <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4 pt-2 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Client
              </label>
              <select
                value={createForm.clientId}
                onChange={(e) => setCreateForm({ ...createForm, clientId: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              >
                {mockClients.map((cli) => (
                  <option key={cli.id} value={cli.id}>
                    {cli.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Associated Project
              </label>
              <input
                type="text"
                value={createForm.project}
                onChange={(e) => setCreateForm({ ...createForm, project: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                value={createForm.issueDate}
                onChange={(e) => setCreateForm({ ...createForm, issueDate: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={createForm.dueDate}
                onChange={(e) => setCreateForm({ ...createForm, dueDate: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Line Items Section */}
          <div className="space-y-2 border-t border-b border-slate-200 py-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Invoice Line Items
              </label>
              <button
                type="button"
                onClick={addLineItem}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-3.5 w-3.5" /> Add Item
              </button>
            </div>

            {createForm.lineItems.map((item, idx) => (
              <div key={item.id || idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Item description..."
                  value={item.description}
                  onChange={(e) => updateLineItem(idx, 'description', e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                  required
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.qty}
                  onChange={(e) => updateLineItem(idx, 'qty', parseInt(e.target.value, 10) || 1)}
                  className="w-16 rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-center text-slate-800 focus:border-blue-500 focus:outline-none"
                  required
                />
                <input
                  type="number"
                  placeholder="Rate ($)"
                  value={item.rate}
                  onChange={(e) => updateLineItem(idx, 'rate', parseFloat(e.target.value) || 0)}
                  className="w-24 rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-right text-slate-800 focus:border-blue-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeLineItem(idx)}
                  className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Discount Amount ($)
              </label>
              <input
                type="number"
                value={createForm.discount}
                onChange={(e) => setCreateForm({ ...createForm, discount: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tax Rate (%)
              </label>
              <input
                type="number"
                value={createForm.taxRate}
                onChange={(e) => setCreateForm({ ...createForm, taxRate: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0066FF] hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              Generate Invoice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
